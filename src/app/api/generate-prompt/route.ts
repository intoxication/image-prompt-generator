import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { basePrompt } = await request.json();

  // Check if basePrompt is provided and is a string
  if (!basePrompt || typeof basePrompt !== "string") {
    return NextResponse.json(
      { message: "Base prompt must be a non-empty string" },
      { status: 400 }
    );
  }

  try {
    // Initialize the Hugging Face Inference API with your API key
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    // Use text generation with a suitable model (e.g., distilgpt2 or gpt2)
    const response = await hf.textGeneration({
      model: "Gustavosta/MagicPrompt-Stable-Diffusion", // Use a model optimized for image prompts
      inputs: basePrompt,
      parameters: {
        max_length: 150, // Limit to ensure concise, usable prompts
        temperature: 0.7, // Controls creativity (0.7 is balanced)
        top_p: 0.9, // Nucleus sampling for diverse but coherent output
        do_sample: true, // Enables sampling for varied outputs
        repetition_penalty: 1.2, // Prevents repetitive text like "lacking" or numbers
      },
    });

    // Extract and clean the generated text from the response
    const enhancedPrompt = response.generated_text.trim().replace(/\s+/g, " "); // Clean up extra whitespace

    return NextResponse.json({ prompt: enhancedPrompt });
  } catch (error) {
    console.error("Inference API error:", error);
    return NextResponse.json(
      { message: "Error generating prompt" },
      { status: 500 }
    );
  }
}
