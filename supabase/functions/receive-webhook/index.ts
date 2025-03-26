
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from '../_shared/supabase-client.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  console.log("Received webhook request");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Log request details for debugging
    const url = new URL(req.url);
    console.log(`Webhook path: ${url.pathname}`);
    
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

    console.log("Webhook payload:", JSON.stringify(payload));
    
    // Check if payload contains property listings
    // This handles both arrays of properties and single property objects
    if (payload) {
      let properties = [];
      
      // Handle array of properties
      if (Array.isArray(payload.properties)) {
        properties = payload.properties;
      }
      // Handle single property as root object
      else if (payload.title) {
        properties = [payload];
      }
      // Handle array at root level
      else if (Array.isArray(payload)) {
        properties = payload;
      }
      
      console.log(`Processing ${properties.length} properties`);
      
      // Store each property in the database
      for (const property of properties) {
        // Ensure the property has the minimum required fields
        if (property && property.title) {
          // Store in properties table
          const { data: insertedProperty, error } = await supabase
            .from('properties')
            .insert({
              title: property.title,
              address: property.address || '',
              type: property.type || 'Other',
              size: property.size || '',
              price: property.price || '',
              image_url: property.image_url || null,
              description: property.description || null,
              featured: property.featured !== undefined ? property.featured : true,
              received_at: new Date().toISOString()
            });
            
          if (error) {
            console.error("Error storing property:", error);
          } else {
            console.log("Property stored successfully:", property.title);
          }
        } else {
          console.warn("Skipped invalid property without title:", property);
        }
      }
    } else {
      console.warn("No valid property data found in payload");
    }
    
    // Return a successful response
    return new Response(
      JSON.stringify({ success: true, message: "Webhook received successfully" }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
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
