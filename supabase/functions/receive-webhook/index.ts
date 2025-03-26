
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

    console.log("Webhook payload received:", JSON.stringify(payload).substring(0, 200) + "...");
    
    // Process properties - handle multiple formats
    let properties = [];
    
    // Case 1: Array of properties
    if (Array.isArray(payload)) {
      console.log("Processing array of properties");
      properties = payload;
    } 
    // Case 2: Object with properties array
    else if (payload && Array.isArray(payload.properties)) {
      console.log("Processing object with properties array");
      properties = payload.properties;
    }
    // Case 3: Single property object
    else if (payload && typeof payload === 'object') {
      console.log("Processing single property object");
      properties = [payload];
    }
    
    console.log(`Processing ${properties.length} properties`);
    
    // Store each property in the database
    for (const property of properties) {
      // Debug log to see what's in each property
      console.log("Processing property:", JSON.stringify(property).substring(0, 200));

      // Extract data based on our simplified schema
      // For our new properties table: id, address, mls, price, image_url
      const propertyData = {
        address: property.address || '',
        mls: property.mls || '',
        price: property.price || '',
        image_url: property.image_url || property.image || '',
      };

      console.log("Storing property data:", JSON.stringify(propertyData));
      
      // Store in properties table
      const { data: insertedProperty, error } = await supabase
        .from('properties')
        .insert(propertyData);
        
      if (error) {
        console.error("Error storing property:", error);
      } else {
        console.log("Property stored successfully, MLS:", propertyData.mls);
      }
    }
    
    // Return a successful response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Webhook received successfully", 
        processed: properties.length 
      }),
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
