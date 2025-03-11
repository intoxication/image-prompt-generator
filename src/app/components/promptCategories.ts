export interface PromptOption {
  id: string;
  label: string;
}

export interface PromptCategory {
  id: string;
  label: string;
  options: PromptOption[];
  multiSelect: boolean;
}

export const promptCategories: PromptCategory[] = [
  {
    id: "style",
    label: "Art Style",
    multiSelect: true,
    options: [
      { id: "realistic", label: "Realistic" },
      { id: "artistic", label: "Artistic" },
      { id: "digital", label: "Digital Art" },
      { id: "traditional", label: "Traditional" },
      { id: "animation", label: "Animation" },
      { id: "fantasy", label: "Fantasy" },
      { id: "scifi", label: "Sci-Fi" },
      { id: "surreal", label: "Surrealism" },
    ],
  },
  {
    id: "mood",
    label: "Mood/Atmosphere",
    multiSelect: true,
    options: [
      { id: "peaceful", label: "Peaceful" },
      { id: "dramatic", label: "Dramatic" },
      { id: "dark", label: "Dark" },
      { id: "vibrant", label: "Vibrant" },
      { id: "ethereal", label: "Ethereal" },
      { id: "melancholic", label: "Melancholic" },
    ],
  },
  {
    id: "setting",
    label: "Setting/Environment",
    multiSelect: false,
    options: [
      { id: "nature", label: "Nature" },
      { id: "urban", label: "Urban" },
      { id: "indoor", label: "Indoor" },
      { id: "fantasy", label: "Fantasy World" },
      { id: "scifi", label: "Sci-Fi World" },
      { id: "underwater", label: "Underwater" },
      { id: "space", label: "Space" },
    ],
  },
  {
    id: "lighting",
    label: "Lighting",
    multiSelect: false,
    options: [
      { id: "natural", label: "Natural Light" },
      { id: "artificial", label: "Artificial Light" },
      { id: "dramatic", label: "Dramatic" },
      { id: "dark", label: "Dark/Low Key" },
      { id: "colorful", label: "Colorful" },
    ],
  },
  {
    id: "camera",
    label: "Camera/Perspective",
    multiSelect: false,
    options: [
      { id: "closeup", label: "Close-up" },
      { id: "shoulder", label: "Over the model's shoulder" },
      { id: "sideways", label: "Slightly sideways to the front" },
      { id: "tilt", label: "Slightly tilts down" },
      { id: "upward", label: "An upward shot" },
      { id: "zooms in", label: "Camera slowly zooms in" },
      { id: "circle", label: "Camera circles around" },
      { id: "wrap", label: "Camera continues to wrap around" },
      { id: "descend", label: "Slowly descend and hover around" },
      { id: "wide", label: "Wide Shot" },
      { id: "aerial", label: "Aerial" },
      { id: "fisheye", label: "Fish Eye" },
      { id: "isometric", label: "Isometric" },
    ],
  },
  {
    id: "quality",
    label: "Quality Descriptors",
    multiSelect: true,
    options: [
      { id: "highquality", label: "High Quality" },
      { id: "professional", label: "Professional" },
      { id: "trending", label: "Trending" },
      { id: "clear", label: "Clear" },
    ],
  },
];
