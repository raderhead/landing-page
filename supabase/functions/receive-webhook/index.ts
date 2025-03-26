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
    // This handles both array of properties or a single property object
    if (payload) {
      let properties = [];
      
      if (Array.isArray(payload.properties)) {
        // If payload has a 'properties' array
        properties = payload.properties;
      } else if (payload.title) {
        // If payload is a single property object
        properties = [payload];
      } else if (typeof payload === 'object') {
        // Try to handle arbitrary property format
        properties = Array.isArray(payload) ? payload : [payload];
      }
      
      console.log(`Processing ${properties.length} properties`);
      
      // Store each property in the database
      for (const property of properties) {
        // Ensure the property has at least one required field
        if (property.title || property.address) {
          // Prepare data object with all possible fields
          const propertyData = {
            title: property.title || 'Untitled Property',
            address: property.address || '',
            type: property.type || 'Other',
            size: property.size || '',
            price: property.price || '',
            image_url: property.image_url || '',
            description: property.description || '',
            featured: property.featured !== undefined ? property.featured : true,
            mls: property.mls || null,
            received_at: new Date().toISOString()
          };
          
          console.log("Checking for duplicates before inserting property:", JSON.stringify(propertyData));
          
          // Check for duplicates based on address or MLS number
          const dupeCheckField = property.mls ? 'mls' : 'address';
          const dupeCheckValue = property.mls || property.address;
          
          if (dupeCheckValue) {
            // Find any existing duplicates
            const { data: existingProperties, error: queryError } = await supabase
              .from('properties')
              .select('id')
              .eq(dupeCheckField, dupeCheckValue);
              
            if (queryError) {
              console.error("Error checking for duplicates:", queryError);
            } else if (existingProperties && existingProperties.length > 0) {
              console.log(`Found ${existingProperties.length} duplicate(s) with same ${dupeCheckField}: ${dupeCheckValue}`);
              
              // Keep only the first record (oldest one) and delete the rest
              if (existingProperties.length > 1) {
                // Sort by ID to ensure consistent deletion (keeping oldest record)
                const sortedIds = existingProperties.map(p => p.id).sort();
                const idsToDelete = sortedIds.slice(1); // Skip the first ID (to keep)
                
                const { error: deleteError } = await supabase
                  .from('properties')
                  .delete()
                  .in('id', idsToDelete);
                  
                if (deleteError) {
                  console.error("Error deleting duplicate properties:", deleteError);
                } else {
                  console.log(`Successfully removed ${idsToDelete.length} duplicates`);
                }
              }
              
              // Update the existing record instead of inserting a new one
              const { error: updateError } = await supabase
                .from('properties')
                .update(propertyData)
                .eq('id', existingProperties[0].id);
                
              if (updateError) {
                console.error("Error updating existing property:", updateError);
              } else {
                console.log("Successfully updated existing property record");
              }
            } else {
              // No duplicates found, insert as new property
              const { data: insertedProperty, error } = await supabase
                .from('properties')
                .insert(propertyData);
                
              if (error) {
                console.error("Error storing property:", error);
              } else {
                console.log("Property stored successfully:", propertyData.title);
              }
            }
          } else {
            // No fields to check for duplication, just insert
            const { data: insertedProperty, error } = await supabase
              .from('properties')
              .insert(propertyData);
              
            if (error) {
              console.error("Error storing property:", error);
            } else {
              console.log("Property stored successfully:", propertyData.title);
            }
          }
        } else {
          console.log("Skipping property without title or address:", JSON.stringify(property));
        }
      }
      
      // Run a final cleanup to ensure no duplicates remain
      // This handles cases where multiple webhook calls happened simultaneously
      await cleanupDuplicates();
    } else {
      console.log("No valid property data found in payload");
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

// Helper function to clean up duplicate properties
async function cleanupDuplicates() {
  try {
    console.log("Running duplicate cleanup...");
    
    // 1. Get all properties
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, address, mls')
      .order('received_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching properties for cleanup:", error);
      return;
    }
    
    // 2. Organize properties by address and MLS
    const addressMap = new Map();
    const mlsMap = new Map();
    
    for (const property of properties) {
      // Track by address if available
      if (property.address) {
        if (!addressMap.has(property.address)) {
          addressMap.set(property.address, [property.id]);
        } else {
          addressMap.get(property.address).push(property.id);
        }
      }
      
      // Track by MLS if available
      if (property.mls) {
        if (!mlsMap.has(property.mls)) {
          mlsMap.set(property.mls, [property.id]);
        } else {
          mlsMap.get(property.mls).push(property.id);
        }
      }
    }
    
    // 3. Find duplicates (entries with more than one ID)
    const duplicateIds = new Set();
    
    // Check address duplicates
    for (const [address, ids] of addressMap.entries()) {
      if (ids.length > 1) {
        // Keep the first ID (oldest record), mark others for deletion
        ids.slice(1).forEach(id => duplicateIds.add(id));
      }
    }
    
    // Check MLS duplicates
    for (const [mls, ids] of mlsMap.entries()) {
      if (ids.length > 1) {
        // Keep the first ID (oldest record), mark others for deletion
        ids.slice(1).forEach(id => duplicateIds.add(id));
      }
    }
    
    // 4. Delete duplicates if any found
    if (duplicateIds.size > 0) {
      const idsToDelete = Array.from(duplicateIds);
      console.log(`Found ${idsToDelete.length} total duplicates to clean up`);
      
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .in('id', idsToDelete);
        
      if (deleteError) {
        console.error("Error during duplicate cleanup:", deleteError);
      } else {
        console.log(`Successfully cleaned up ${idsToDelete.length} duplicate properties`);
      }
    } else {
      console.log("No duplicates found during cleanup");
    }
  } catch (err) {
    console.error("Error in cleanupDuplicates function:", err);
  }
}
