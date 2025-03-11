
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

## About Josh Rader
- Name: Josh Rader
- Role: Licensed Commercial Real Estate Agent
- Location Served: Abilene, Texas, and surrounding areas
- Specialties: Retail Leasing, Office Leasing, Industrial Properties, Property Investment, and Market Analysis
- Professional Background: Licensed commercial real estate agent specializing in commercial properties. Josh combines local market expertise with extensive industry knowledge.
- Values: Josh prioritizes integrity, transparency, and client success. He is committed to providing clear communication, honest advice, and personalized solutions tailored to clients' unique real estate goals.

## Services Offered

### Retail Leasing
- Finding retail spaces suitable for businesses like stores, restaurants, and boutiques
- Lease negotiations to secure favorable terms

### Office Leasing
- Helping businesses find ideal office spaces in Abilene tailored to company needs (traditional, open-plan, or hybrid workspaces)
- Facilitating lease agreements and renewals

### Industrial Properties
- Locating warehouses, distribution centers, and manufacturing spaces
- Guidance on industrial zoning and regulatory compliance

### Property Investment
- Assistance in identifying profitable commercial investment opportunities
- Detailed market analyses and investment feasibility reports

### Market Analysis
- Providing comprehensive analyses on current Abilene commercial real estate trends, market values, and projections

## Abilene Real Estate Market Insights (2025)

### Growing Industries
- Healthcare & Medical Offices
- Educational Facilities
- Manufacturing & Industrial Spaces
- Retail & Hospitality Developments

### Key Trends
- Increased popularity of mixed-use developments
- Strong demand for industrial and warehouse spaces
- Shift toward flexible office spaces accommodating hybrid work models
- Integration of smart technology and sustainable building practices

## Types of Commercial Properties Available
- Retail Spaces
- Office Spaces
- Industrial and Warehouse Facilities
- Mixed-use Developments
- Medical and Specialty Facilities

## Why Invest in Commercial Real Estate in Abilene
- Stable local economy with consistent growth
- Strategic location and excellent infrastructure
- High demand across multiple sectors creating profitable investment opportunities

## Frequently Asked Questions

Q: How can Josh help me invest in commercial real estate?
A: Josh offers personalized consultation, detailed market analysis, and professional guidance to secure the ideal property tailored to your investment objectives.

## Contact Information
- Josh Rader
- Address: 123 Commercial Ave, Suite 200, Abilene, TX 79601
- Phone: (Contact directly for phone number)
- Email: josh.rader@example.com
- Website: (Contact directly for website URL)
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
