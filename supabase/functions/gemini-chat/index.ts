
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

// Commercial Real Estate Knowledge Base for Abilene, TX
const knowledgeBase = `
# Josh Rader Commercial Real Estate - Abilene, TX Knowledge Base

## About Josh Rader Realty
Josh Rader Realty specializes in commercial real estate in Abilene, Texas. We provide expert guidance for buying, selling, and leasing commercial properties in the Abilene area.

## Abilene Commercial Real Estate Market
Abilene, TX is experiencing steady growth in the commercial sector. The city's strategic location in West Texas makes it an attractive market for businesses. Key commercial corridors include South 14th Street, Southwest Drive, and the downtown business district.

## Types of Commercial Properties Available
1. Retail spaces - Strip malls, standalone retail buildings, and shopping centers
2. Office spaces - Professional office buildings, medical offices, and flex spaces
3. Industrial properties - Warehouses, manufacturing facilities, and distribution centers
4. Investment properties - Multi-tenant buildings and income-producing properties
5. Land - Development sites and commercial lots

## Popular Commercial Areas in Abilene
- Downtown Abilene - Historic district with revitalization efforts
- South 14th Street - Major retail corridor
- Southwest Drive - Growing commercial and retail area
- Buffalo Gap Road - Mixed retail and office space
- Industrial parks near Abilene Regional Airport

## Commercial Real Estate Services Offered
- Property sales and acquisition
- Tenant and landlord representation
- Investment property analysis
- Site selection
- Commercial property management
- Lease negotiation and preparation
- Market analysis and valuation

## Investment Opportunities
Abilene offers various investment opportunities with generally higher cap rates compared to larger Texas markets. Popular investment properties include multi-tenant retail centers, office buildings, and industrial spaces.

## Meeting with Josh Rader
Josh Rader is available for consultations and property viewings by appointment. To schedule a meeting, clients should provide their name, contact information, and the nature of their commercial real estate needs.

## Contact Information
For all commercial real estate inquiries or to schedule an appointment with Josh Rader, please contact Josh Rader Realty directly.

## Important Note
This knowledge base contains information specific to commercial real estate in Abilene, TX. For questions outside this domain, users should be directed to schedule a meeting with Josh Rader for personalized assistance.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory } = await req.json();
    console.log("Received message:", message);
    console.log("Chat history length:", chatHistory.length);

    // Create system prompt focusing on commercial real estate in Abilene
    const systemPrompt = `You are a specialized real estate assistant for Josh Rader Realty, focused EXCLUSIVELY on commercial real estate in Abilene, Texas. 
    
Here is your knowledge base:
${knowledgeBase}

IMPORTANT GUIDELINES:
1. ONLY provide information about commercial real estate in Abilene, TX or Josh Rader's services.
2. If asked about residential properties, politely explain you specialize in commercial real estate only.
3. If asked about locations outside of Abilene, TX, politely explain your expertise is limited to the Abilene area.
4. If asked for information not contained in your knowledge base, suggest scheduling a meeting with Josh Rader.
5. For meeting requests, ask for the person's name, contact information, and the nature of their commercial real estate needs.
6. Keep your responses professional, concise, and directly related to commercial real estate matters.
7. Do NOT provide information about topics unrelated to commercial real estate or Josh Rader's services.
8. Do NOT pretend to know specific property listings or details unless they're in your knowledge base.

Remember: Your purpose is strictly to assist with commercial real estate inquiries in Abilene, TX or help schedule consultations with Josh Rader.`;
    
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
