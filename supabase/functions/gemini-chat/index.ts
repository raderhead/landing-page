
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory } = await req.json();
    console.log("Received message:", message);
    console.log("Chat history length:", chatHistory.length);

    // Create system prompt from the first message if it's a system message
    let systemPrompt = "You are a helpful real estate assistant for Josh Rader Realty. You provide information about properties, real estate advice, and answer questions about real estate services. Keep your responses concise, professional, and focused on real estate topics.";
    
    // Format chat history for Perplexity API
    const formattedMessages = [];
    
    // Add system message first
    formattedMessages.push({
      role: "system",
      content: systemPrompt
    });
    
    // Add the chat history (excluding system messages)
    for (const msg of chatHistory) {
      if (msg.role !== "system") {
        formattedMessages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }

    // Add the new user message
    formattedMessages.push({
      role: "user",
      content: message
    });

    console.log("Sending request to Perplexity API");
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: formattedMessages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000,
        return_images: false,
        return_related_questions: false,
        search_domain_filter: ['perplexity.ai'],
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Perplexity API:", errorData);
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received response from Perplexity API");
    console.log("Response data:", JSON.stringify(data, null, 2));

    // Extract the response text
    let responseText = "";
    if (data.choices && data.choices.length > 0 && 
        data.choices[0].message && 
        data.choices[0].message.content) {
      responseText = data.choices[0].message.content;
    } else {
      throw new Error("No response generated from Perplexity API");
    }

    return new Response(JSON.stringify({ response: responseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in chat function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
