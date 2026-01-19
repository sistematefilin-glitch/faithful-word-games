import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { puzzleId, title, description, category } = await req.json();
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client with service role for storage access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if image already exists in database
    const { data: existingImage } = await supabase
      .from("puzzle_images")
      .select("image_url")
      .eq("puzzle_id", puzzleId)
      .single();

    if (existingImage?.image_url) {
      console.log("Image already exists for puzzle:", puzzleId);
      return new Response(
        JSON.stringify({ 
          puzzleId,
          imageUrl: existingImage.image_url,
          success: true,
          cached: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a detailed prompt for realistic biblical art
    const prompt = `Create a beautiful, realistic oil painting style biblical scene: ${title}. 
${description}. 
Category: ${category}. 
Style: Classical renaissance religious art, dramatic lighting, rich colors, detailed and reverent. 
The image should be suitable for a puzzle game, with clear details and vivid colors.
Aspect ratio: 1:1 square format.`;

    console.log("Generating image for puzzle:", puzzleId, "with prompt:", prompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received for puzzle:", puzzleId);

    // Extract image from response (base64)
    const base64Image = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!base64Image) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    // Extract base64 data (remove data:image/png;base64, prefix)
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Upload to Supabase Storage
    const fileName = `puzzle-${puzzleId}-${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from("puzzle-images")
      .upload(fileName, imageBuffer, {
        contentType: "image/png",
        upsert: true
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("puzzle-images")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;
    console.log("Image uploaded to storage:", publicUrl);

    // Save to database
    const { error: dbError } = await supabase
      .from("puzzle_images")
      .insert({
        puzzle_id: puzzleId,
        image_url: publicUrl
      });

    if (dbError) {
      console.error("Database insert error:", dbError);
      // Image is already in storage, so we can still return it
    }

    return new Response(
      JSON.stringify({ 
        puzzleId,
        imageUrl: publicUrl,
        success: true 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating puzzle image:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
