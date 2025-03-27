
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from '../_shared/supabase-client.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  console.log("Received property details webhook request");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Parse request data
    let payload;
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      payload = Object.fromEntries(formData.entries());
    } else {
      payload = {
        rawBody: await req.text(),
        contentType
      };
    }

    console.log("Property details payload:", JSON.stringify(payload));
    
    // Store the raw payload for reference
    const { data: webhookRecord, error: webhookError } = await supabase
      .from('webhook_property_details')
      .insert({
        payload: payload,
        processed: false
      })
      .select('id')
      .single();
      
    if (webhookError) {
      console.error("Error storing webhook payload:", webhookError);
      throw webhookError;
    }
    
    // Process the received property details
    // This could be a direct payload or nested within a parent object
    let propertyDetails = payload;
    
    // Check if payload has a specific structure we need to handle
    if (payload.propertyDetails) {
      propertyDetails = payload.propertyDetails;
    } else if (payload.data && payload.data.propertyDetails) {
      propertyDetails = payload.data.propertyDetails;
    }
    
    // Check if we have required address information to identify the property
    if (propertyDetails.address) {
      // Try to find the corresponding property by address
      const { data: existingProperties, error: queryError } = await supabase
        .from('properties')
        .select('id')
        .eq('address', propertyDetails.address)
        .limit(1);
        
      if (queryError) {
        console.error("Error finding matching property:", queryError);
        throw queryError;
      }
      
      if (existingProperties && existingProperties.length > 0) {
        const propertyId = existingProperties[0].id;
        
        // Prepare data for insertion
        const detailsData = {
          property_id: propertyId,
          address: propertyDetails.address || null,
          listPrice: propertyDetails.listPrice || propertyDetails.price || null,
          salePricePerSqm: propertyDetails.salePricePerSqm || null,
          status: propertyDetails.status || null,
          propertySize: propertyDetails.propertySize || propertyDetails.size || null,
          landSize: propertyDetails.landSize || null,
          rooms: propertyDetails.rooms || null,
          remarks: propertyDetails.remarks || propertyDetails.description || null,
          listingBy: propertyDetails.listingBy || null
        };
        
        // Check if details for this property already exist
        const { data: existingDetails, error: detailsQueryError } = await supabase
          .from('property_details')
          .select('id')
          .eq('property_id', propertyId)
          .limit(1);
          
        if (detailsQueryError) {
          console.error("Error checking existing property details:", detailsQueryError);
          throw detailsQueryError;
        }
        
        let upsertResult;
        
        if (existingDetails && existingDetails.length > 0) {
          // Update existing record
          const { data, error } = await supabase
            .from('property_details')
            .update(detailsData)
            .eq('id', existingDetails[0].id)
            .select();
            
          upsertResult = { data, error, action: 'updated' };
        } else {
          // Insert new record
          const { data, error } = await supabase
            .from('property_details')
            .insert(detailsData)
            .select();
            
          upsertResult = { data, error, action: 'inserted' };
        }
        
        if (upsertResult.error) {
          console.error(`Error ${upsertResult.action} property details:`, upsertResult.error);
          throw upsertResult.error;
        }
        
        console.log(`Successfully ${upsertResult.action} property details for property ID ${propertyId}`);
        
        // Mark webhook record as processed
        await supabase
          .from('webhook_property_details')
          .update({ processed: true })
          .eq('id', webhookRecord.id);
          
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Property details ${upsertResult.action} successfully`,
            property_id: propertyId
          }),
          {
            status: 200,
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders 
            },
          }
        );
      } else {
        console.log("No matching property found for address:", propertyDetails.address);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "No matching property found with provided address" 
          }),
          {
            status: 404,
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders 
            },
          }
        );
      }
    } else {
      console.log("Missing address in property details payload");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Missing address in property details" 
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          },
        }
      );
    }
  } catch (error) {
    console.error("Error processing property details webhook:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  }
});
