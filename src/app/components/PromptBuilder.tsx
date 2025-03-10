"use client";

import React, { useState, useEffect } from "react";

// Define types for our prompt options
interface PromptOption {
  id: string;
  label: string;
  examples: string[];
}

interface PromptCategory {
  id: string;
  label: string;
  options: PromptOption[];
  multiSelect: boolean;
}

interface PromptBuilderProps {
  onGeneratePrompt: (prompt: string) => void;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  onGeneratePrompt,
}) => {
  // State to track selected options
  const [subject, setSubject] = useState<string>("");
  const [customText, setCustomText] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});
  const [customDetails, setCustomDetails] = useState<string>("");

  // Prompt categories and options
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const promptCategories: PromptCategory[] = [
    {
      id: "style",
      label: "Art Style",
      multiSelect: true,
      options: [
        {
          id: "realistic",
          label: "Realistic",
          examples: ["photorealistic", "hyperrealistic", "ultra detailed"],
        },
        {
          id: "artistic",
          label: "Artistic",
          examples: ["impressionist", "expressionist", "abstract"],
        },
        {
          id: "digital",
          label: "Digital Art",
          examples: ["digital painting", "concept art", "digital illustration"],
        },
        {
          id: "traditional",
          label: "Traditional",
          examples: ["oil painting", "watercolor", "ink drawing", "acrylic"],
        },
        {
          id: "animation",
          label: "Animation",
          examples: ["anime", "cartoon", "pixar style", "studio ghibli"],
        },
        {
          id: "fantasy",
          label: "Fantasy",
          examples: ["magical", "mystical", "high fantasy", "medieval fantasy"],
        },
        {
          id: "scifi",
          label: "Sci-Fi",
          examples: ["futuristic", "cyberpunk", "retro-futurism", "space"],
        },
        {
          id: "surreal",
          label: "Surrealism",
          examples: ["dreamlike", "Salvador Dali inspired", "surrealist"],
        },
      ],
    },
    {
      id: "mood",
      label: "Mood/Atmosphere",
      multiSelect: true,
      options: [
        {
          id: "peaceful",
          label: "Peaceful",
          examples: ["serene", "tranquil", "calm", "relaxing"],
        },
        {
          id: "dramatic",
          label: "Dramatic",
          examples: ["intense", "epic", "cinematic", "dynamic"],
        },
        {
          id: "dark",
          label: "Dark",
          examples: ["moody", "gloomy", "noir", "mysterious"],
        },
        {
          id: "vibrant",
          label: "Vibrant",
          examples: ["colorful", "bright", "vivid", "energetic"],
        },
        {
          id: "ethereal",
          label: "Ethereal",
          examples: ["ethereal", "dreamy", "mystical", "magical"],
        },
        {
          id: "melancholic",
          label: "Melancholic",
          examples: ["nostalgic", "bittersweet", "lonely", "wistful"],
        },
      ],
    },
    {
      id: "setting",
      label: "Setting/Environment",
      multiSelect: false,
      options: [
        {
          id: "nature",
          label: "Nature",
          examples: ["forest", "mountains", "beach", "jungle", "desert"],
        },
        {
          id: "urban",
          label: "Urban",
          examples: ["city", "streets", "buildings", "skyline", "metropolis"],
        },
        {
          id: "indoor",
          label: "Indoor",
          examples: ["room", "interior", "home", "library", "studio"],
        },
        {
          id: "fantasy",
          label: "Fantasy World",
          examples: ["magical realm", "enchanted forest", "fairy tale kingdom"],
        },
        {
          id: "scifi",
          label: "Sci-Fi World",
          examples: ["alien planet", "space station", "future city"],
        },
        {
          id: "underwater",
          label: "Underwater",
          examples: ["ocean depths", "coral reef", "underwater city"],
        },
        {
          id: "space",
          label: "Space",
          examples: ["galaxy", "nebula", "stars", "cosmos", "planetary"],
        },
      ],
    },
    {
      id: "lighting",
      label: "Lighting",
      multiSelect: false,
      options: [
        {
          id: "natural",
          label: "Natural Light",
          examples: ["sunlight", "daylight", "golden hour", "sunset"],
        },
        {
          id: "artificial",
          label: "Artificial Light",
          examples: ["neon", "studio lighting", "lamp light"],
        },
        {
          id: "dramatic",
          label: "Dramatic",
          examples: ["chiaroscuro", "high contrast", "cinematic lighting"],
        },
        {
          id: "dark",
          label: "Dark/Low Key",
          examples: ["moonlight", "night", "dim", "shadows"],
        },
        {
          id: "colorful",
          label: "Colorful",
          examples: ["rainbow lighting", "colored gels", "vibrant lighting"],
        },
      ],
    },
    {
      id: "camera",
      label: "Camera/Perspective",
      multiSelect: false,
      options: [
        {
          id: "closeup",
          label: "Close-up",
          examples: ["macro", "detailed", "portrait"],
        },

        {
          id: "shoulder",
          label: "over the model's shoulder",
          examples: ["", "", ""],
        },
        {
          id: "Sideways",
          label: "slightly sideways to the front",
          examples: ["", "", ""],
        },
        {
          id: "Tilt",
          label: "slightly tilts down",
          examples: ["", "", ""],
        },
        {
          id: "upward",
          label: "an upward shot",
          examples: ["", "", ""],
        },

        {
          id: "zooms in",
          label: "camera slowly zooms in",
          examples: ["", "", ""],
        },

        {
          id: "circle",
          label: "camera circles around",
          examples: ["", "", ""],
        },

        {
          id: "wrap",
          label: "camera continues to wrap around",
          examples: ["", "", ""],
        },
        {
          id: "descend",
          label: "slowly descend and hover around",
          examples: ["", "", ""],
        },

        {
          id: "wide",
          label: "Wide Shot",
          examples: ["landscape view", "panorama", "wide angle"],
        },
        {
          id: "aerial",
          label: "Aerial",
          examples: ["bird's eye view", "drone shot", "top-down"],
        },
        {
          id: "fisheye",
          label: "Fish Eye",
          examples: ["ultra wide angle", "distorted perspective"],
        },
        {
          id: "isometric",
          label: "Isometric",
          examples: ["isometric view", "3D isometric"],
        },
      ],
    },
    {
      id: "quality",
      label: "Quality Descriptors",
      multiSelect: true,
      options: [
        {
          id: "highquality",
          label: "High Quality",
          examples: ["highly detailed", "8K", "ultra high definition"],
        },
        {
          id: "professional",
          label: "Professional",
          examples: ["award winning", "professional", "masterpiece"],
        },
        {
          id: "trending",
          label: "Trending",
          examples: ["trending on artstation", "popular", "viral"],
        },
        {
          id: "clear",
          label: "Clear",
          examples: ["sharp focus", "crystal clear", "perfect composition"],
        },
      ],
    },
  ];

  useEffect(() => {
    if (Object.keys(selectedOptions).length === 0) return;

    const selectedText = Object.values(selectedOptions).flat().join(", ");

    setCustomText((prev) => {
      if (prev.trim() && selectedText.trim()) {
        return prev + ", " + selectedText; // Append new prompt
      }
      return selectedText || prev; // Set new if empty
    });

    // Use setTimeout to clear selection AFTER text update
    setTimeout(() => {
      setSelectedOptions({});
    }, 0);
  }, [selectedOptions]);

  const handleOptionToggle = (
    categoryId: string,
    optionId: string,
    label: string
  ) => {
    setSelectedOptions((prev) => {
      const category = promptCategories.find((c) => c.id === categoryId);
      if (!category) return prev;

      const currentSelections = [...(prev[categoryId] || [])];

      if (!category.multiSelect) {
        return { ...prev, [categoryId]: [label] };
      }

      const index = currentSelections.indexOf(label);
      if (index === -1) {
        currentSelections.push(label);
      } else {
        currentSelections.splice(index, 1);
      }

      return { ...prev, [categoryId]: currentSelections };
    });
  };

  // Constructing the final input field text
  const getFinalPrompt = () => {
    const selectedText = Object.values(selectedOptions).flat().join(", ");
    return `${customText} ${selectedText}`.trim();
  };

  // Generate the prompt based on selected options
  // const generatePrompt = () => {
  //   const promptParts: string[] = [];

  //   // Start with the subject if provided
  //   if (subject.trim()) {
  //     promptParts.push(subject.trim());
  //   } else {
  //     promptParts.push("A stunning image");
  //   }

  //   // Add selected options from each category
  //   promptCategories.forEach(category => {
  //     const selectedIds = selectedOptions[category.id] || [];
  //     if (selectedIds.length > 0) {
  //       const selectedLabels: string[] = [];

  //       selectedIds.forEach(id => {
  //         const option = category.options.find(opt => opt.id === id);
  //         if (option) {
  //           // Randomly select one of the examples
  //           const example = option.examples[Math.floor(Math.random() * option.examples.length)];
  //           selectedLabels.push(example);
  //         }
  //       });

  //       if (selectedLabels.length > 0) {
  //         promptParts.push(selectedLabels.join(", "));
  //       }
  //     }
  //   });

  //   // Add custom details if provided
  //   if (customDetails.trim()) {
  //     promptParts.push(customDetails.trim());
  //   }

  //   // Add quality enhancers
  //   promptParts.push("high quality, detailed");

  //   // Combine all parts into a single prompt
  //   const finalPrompt = promptParts.join(", ");
  //   onGeneratePrompt(finalPrompt);
  // };

  // Add loading state (optional, see enhancements below)
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // Updated generatePrompt function
  const generatePrompt = async () => {
    // Construct base prompt (same as original logic)
    const promptParts: string[] = [];

    if (subject.trim()) {
      promptParts.push(subject.trim());
    } else {
      promptParts.push("A stunning image");
    }

    promptCategories.forEach((category) => {
      const selectedIds = selectedOptions[category.id] || [];
      if (selectedIds.length > 0) {
        const selectedLabels: string[] = [];

        selectedIds.forEach((id) => {
          const option = category.options.find((opt) => opt.id === id);
          if (option) {
            const example =
              option.examples[
                Math.floor(Math.random() * option.examples.length)
              ];
            selectedLabels.push(example);
          }
        });

        if (selectedLabels.length > 0) {
          promptParts.push(selectedLabels.join(", "));
        }
      }
    });

    if (customDetails.trim()) {
      promptParts.push(customDetails.trim());
    }

    promptParts.push("high quality, detailed");

    const basePrompt = promptParts.join(", ");

    // Optional: Set loading state
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ basePrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate prompt");
      }

      const data = await response.json();
      onGeneratePrompt(data.prompt);
    } catch (error) {
      console.error(
        "Error generating prompt. Failed to enhance prompt with AI. Using basic prompt instead.",
        error
      );
      onGeneratePrompt(basePrompt);
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset all selections
  const resetSelections = () => {
    setSubject("");
    setCustomDetails("");
    const resetOptions: Record<string, string[]> = {};
    promptCategories.forEach((category) => {
      resetOptions[category.id] = [];
    });
    setSelectedOptions(resetOptions);
    onGeneratePrompt("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Build Your Prompt
      </h2>

      {/* Subject Input */}
      <div className="mb-6">
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Main Subject
        </label>
        <input
          type="text"
          id="subject"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="A majestic mountain, a cyberpunk cityscape, a portrait of a warrior..."
          value={getFinalPrompt()}
          onChange={(e) => setCustomText(e.target.value)}
        />
      </div>

      {/* Option Categories */}
      <div className="space-y-8">
        {promptCategories.map((category) => (
          <div
            key={category.id}
            className="border-b border-gray-200 dark:border-gray-700 pb-6"
          >
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
              {category.label}{" "}
              {category.multiSelect ? "(Multiple)" : "(Choose One)"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {category.options.map((option) => (
                <button
                  key={option.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedOptions[category.id]?.includes(option.id)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900"
                  }`}
                  onClick={() =>
                    handleOptionToggle(category.id, option.id, option.label)
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Details */}
      <div className="mt-6 mb-8">
        <label
          htmlFor="customDetails"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Custom Details (Optional)
        </label>
        <textarea
          id="customDetails"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Add specific details, elements, or attributes..."
          value={customDetails}
          onChange={(e) => setCustomDetails(e.target.value)}
        ></textarea>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          onClick={generatePrompt}
        >
          {isGenerating ? "Generating..." : "Generate Prompt"}
        </button>
        <button
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onClick={resetSelections}
        >
          Reset All
        </button>
      </div>
    </div>
  );
};
