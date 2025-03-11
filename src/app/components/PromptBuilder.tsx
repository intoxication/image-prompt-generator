"use client";

import React, { useState, useEffect } from "react";
import { promptCategories, PromptCategory } from "./promptCategories";

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
  const [activeCategory, setActiveCategory] = useState<string>("style"); // Default active category

  // Prompt categories and options
  // eslint-disable-next-line react-hooks/exhaustive-deps

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

  const handleOptionToggle = (categoryId: string, optionId: string) => {
    setSelectedOptions((prev) => {
      const category = promptCategories.find((c) => c.id === categoryId);
      if (!category) return prev;

      const option = category.options.find((opt) => opt.id === optionId);
      if (!option) return prev; // Ensure option exists

      const optionLabel = option.label; // Get the label instead of ID
      const currentSelections = [...(prev[categoryId] || [])];

      if (!category.multiSelect) {
        return { ...prev, [categoryId]: [optionLabel] };
      }

      const index = currentSelections.indexOf(optionLabel);
      if (index === -1) {
        currentSelections.push(optionLabel);
      } else {
        currentSelections.splice(index, 1);
      }

      return { ...prev, [categoryId]: currentSelections };
    });
  };

  // Constructing the final input field text
  const getFinalPrompt = () => {
    const selectedText = Object.values(selectedOptions).flat().join(", ");
    return customText.trim() + (selectedText ? ", " + selectedText : "");
  };

  // Add loading state (optional, see enhancements below)
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // Updated generatePrompt function
  const generatePrompt = async () => {
    // Construct base prompt (same as original logic)
    const promptParts: string[] = [];

    const finalPrompt = getFinalPrompt(); // Get the complete prompt text

    if (finalPrompt.trim()) {
      promptParts.push(finalPrompt.trim());
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
    setCustomText("");
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
          value={customText} // Bind directly to customText
          onChange={(e) => setCustomText(e.target.value)} // Update customText without affecting selected options
        />
      </div>

      <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-700 mb-4">
        {promptCategories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 text-lg font-medium ${
              activeCategory === category.id
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-600 dark:text-gray-400 hover:text-purple-500"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Active Category Options */}
      <div className="space-y-8">
        {promptCategories
          .filter((category) => category.id === activeCategory)
          .map((category) => (
            <div key={category.id} className="pb-6">
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
                    onClick={() => handleOptionToggle(category.id, option.id)}
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
