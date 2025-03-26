import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from '../_shared/supabase-client.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Standalone function to clean up duplicate properties
// Can be called directly via an endpoint or scheduled
serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    console.log("Running duplicate cleanup...");
    
    // 1. Get all properties
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, address, mls')
      .order('received_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching properties for cleanup:", error);
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
        console.log(`Found ${ids.length - 1} duplicates for address: ${address}`);
        ids.slice(1).forEach(id => duplicateIds.add(id));
      }
    }
    
    // Check MLS duplicates
    for (const [mls, ids] of mlsMap.entries()) {
      if (ids.length > 1) {
        // Keep the first ID (oldest record), mark others for deletion
        console.log(`Found ${ids.length - 1} duplicates for MLS: ${mls}`);
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
        return new Response(
          JSON.stringify({ success: false, error: deleteError.message }),
          {
            status: 500,
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders 
            },
          }
        );
      } else {
        console.log(`Successfully cleaned up ${idsToDelete.length} duplicate properties`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Successfully cleaned up ${idsToDelete.length} duplicate properties` 
          }),
          {
            status: 200,
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders 
            },
          }
        );
      }
    } else {
      console.log("No duplicates found during cleanup");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No duplicates found" 
        }),
        {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          },
        }
      );
    }
  } catch (error) {
    console.error("Error in duplicate cleanup:", error);
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
