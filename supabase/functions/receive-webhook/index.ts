
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Create a Supabase client with the auth role key
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if the request is a POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { 
          status: 405, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Parse the request body
    const payload = await req.json();
    console.log("Received webhook payload:", payload);

    // Validate the payload
    let properties = [];
    
    if (Array.isArray(payload)) {
      properties = payload;
    } else if (payload.properties && Array.isArray(payload.properties)) {
      properties = payload.properties;
    } else {
      // If it's a single property, wrap it in an array
      properties = [payload];
    }

    // Process each property
    const insertPromises = properties.map(async (property) => {
      // Make sure we have the required fields
      const propertyData = {
        address: property.address || "",
        mls: property.mls || "",
        price: property.price || "",
        image_url: property.image_url || ""
      };

      // Insert the property into the database
      const { data, error } = await supabase
        .from('properties')
        .upsert(propertyData, { 
          onConflict: 'address',
          ignoreDuplicates: false
        });

      if (error) {
        console.error("Error inserting property:", error);
        return { success: false, error };
      }

      return { success: true, data };
    });

    // Wait for all insertions to complete
    const results = await Promise.all(insertPromises);
    
    // Return the results
    return new Response(
      JSON.stringify({ 
        message: "Webhook received and processed successfully", 
        results 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Error processing webhook", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
