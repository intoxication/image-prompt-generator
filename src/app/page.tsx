"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { PromptBuilder } from "./components/PromptBuilder";
import { PromptDisplay } from "./components/PromptDisplay";
import { PromptHistory } from "./components/PromptHistory";

export default function Home() {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  // Load prompt history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("promptHistory");
    if (savedHistory) {
      setPromptHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save prompt history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("promptHistory", JSON.stringify(promptHistory));
  }, [promptHistory]);

  const handlePromptGenerated = (prompt: string) => {
    setGeneratedPrompt(prompt);
    if (prompt.trim() !== "") {
      setPromptHistory((prev) => [prompt, ...prev.slice(0, 9)]); // Keep only last 10 prompts
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Head>
        <title>AI Image Prompt Generator</title>
        <meta
          name="description"
          content="Generate high-quality prompts for AI image generation"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-purple-800 dark:text-purple-400 mb-8">
          AI Image Prompt Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PromptBuilder onGeneratePrompt={handlePromptGenerated} />
          </div>

          <div className="space-y-8">
            <PromptDisplay prompt={generatedPrompt} />
            <PromptHistory
              prompts={promptHistory}
              onSelectPrompt={setGeneratedPrompt}
            />
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-600 dark:text-gray-400">
        <p>Created with Next.js, TypeScript, and Tailwind CSS</p>
      </footer>
    </div>
  );
}
