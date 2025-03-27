
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from '../_shared/supabase-client.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
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
    
    console.log("Webhook sync payload received:", JSON.stringify(payload));
    
    // Extract properties from the payload
    let properties = [];
    if (Array.isArray(payload.properties)) {
      properties = payload.properties;
    } else if (payload.title || payload.address) {
      properties = [payload];
    } else if (Array.isArray(payload)) {
      properties = payload;
    } else if (typeof payload === 'object') {
      // Try to handle arbitrary property format
      properties = Array.isArray(payload) ? payload : [payload];
    }
    
    // Make sure properties have required fields
    const validProperties = properties.filter(p => p.address || p.title);
    console.log(`Processing ${validProperties.length} valid properties for sync`);
    
    if (validProperties.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No valid properties found in payload. Properties must have address or title." 
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

    // Start transaction to ensure atomicity
    // Step 1: Store incoming properties and create a sync marker
    const syncId = crypto.randomUUID();
    const syncTimestamp = new Date().toISOString();
    
    // Step 2: Mark this as the latest sync operation
    const { error: syncError } = await supabase
      .from('sync_operations')
      .insert({
        id: syncId,
        source: "webhook",
        timestamp: syncTimestamp,
        property_count: validProperties.length
      });
      
    if (syncError) {
      console.error("Error recording sync operation:", syncError);
      throw new Error("Failed to record sync operation");
    }
    
    // Step 3: Process each property
    for (const property of validProperties) {
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
        received_at: syncTimestamp,
        last_sync_id: syncId
      };
      
      const dupeCheckField = property.mls ? 'mls' : 'address';
      const dupeCheckValue = property.mls || property.address;
      
      if (dupeCheckValue) {
        // Look for existing property
        const { data: existingProperties, error: queryError } = await supabase
          .from('properties')
          .select('id')
          .eq(dupeCheckField, dupeCheckValue);
          
        if (queryError) {
          console.error("Error checking for existing property:", queryError);
          continue;
        }
        
        if (existingProperties && existingProperties.length > 0) {
          // Update existing property with new data and sync ID
          const { error: updateError } = await supabase
            .from('properties')
            .update(propertyData)
            .eq('id', existingProperties[0].id);
            
          if (updateError) {
            console.error("Error updating existing property:", updateError);
          } else {
            console.log(`Updated property with ${dupeCheckField} = ${dupeCheckValue}`);
          }
        } else {
          // Insert new property
          const { error: insertError } = await supabase
            .from('properties')
            .insert(propertyData);
            
          if (insertError) {
            console.error("Error inserting new property:", insertError);
          } else {
            console.log(`Inserted new property with ${dupeCheckField} = ${dupeCheckValue}`);
          }
        }
      }
    }
    
    // Step 4: Delete properties not included in this sync
    // Only delete properties that were received from webhooks (not manually created)
    const { data: deletedData, error: deleteError } = await supabase
      .from('properties')
      .delete()
      .is('received_at', 'not null')  // Only delete properties from webhooks
      .neq('last_sync_id', syncId)    // Not included in current sync
      .select('id, address, title');  // Return info about deleted properties
      
    if (deleteError) {
      console.error("Error deleting stale properties:", deleteError);
      throw new Error("Failed to delete stale properties");
    }
    
    const deletedCount = deletedData?.length || 0;
    console.log(`Deleted ${deletedCount} properties not included in current sync`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sync completed. Processed ${validProperties.length} properties, deleted ${deletedCount} stale properties.`,
        syncId: syncId,
        deletedCount: deletedCount,
        processedCount: validProperties.length
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
    console.error("Error in sync-properties function:", error);
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
