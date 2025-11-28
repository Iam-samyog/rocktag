"use cache";

import { DEFAULT_CAT_IMAGE } from "./constants";

export type CatProfile = {
  id: string;
  name: string;
  tagline: string; // "I love to sleep"
  about: string; // text for ABOUT section
  imageUrl?: string; // optional image URL, will use default if not provided
};

export async function getCatProfile(catId: string): Promise<CatProfile> {
  // Mock API endpoint - replace with actual API URL when ready
  const mockData: Record<string, CatProfile> = {
    "1": {
      id: "1",
      name: "Microwave",
      tagline: "Campus Celebrity",
      about:
        "The most famous cat on campus! Microwave got their name from always hanging around the UC looking for warm spots. Extremely friendly and loves attention from students.",
      imageUrl: DEFAULT_CAT_IMAGE,
    },
    "2": {
      id: "2",
      name: "Professor Whiskers",
      tagline: "Scholar of Naps",
      about:
        "A distinguished older cat who seems to have attended more classes than most students. Often found near the library, observing campus life with scholarly interest.",
      imageUrl: DEFAULT_CAT_IMAGE,
    },
    "3": {
      id: "3",
      name: "Shadow",
      tagline: "Mysterious Explorer",
      about:
        "An elusive black cat that appears and disappears like a shadow. Engineering students claim Shadow brings good luck during finals week.",
      imageUrl: DEFAULT_CAT_IMAGE,
    },
    "4": {
      id: "4",
      name: "Einstein",
      tagline: "E = mc² of Cuteness",
      about:
        "A genius among cats, Einstein is known for their playful antics and clever ways to get treats. Often seen lounging in sunny spots around campus.",
      imageUrl: DEFAULT_CAT_IMAGE,
    },
    "5": {
      id: "5",
      name: "Coffee",
      tagline: "Caffeine Companion",
      about:
        "Always found near the campus coffee shops, Coffee is a lively cat that seems to thrive on the buzz of student life. Loves to curl up next to anyone studying with a cup of joe.",
      imageUrl: DEFAULT_CAT_IMAGE,
    },
    default: {
      id: "default",
      name: "Mr. Kitten",
      tagline: "I love to sleep",
      about:
        "This fluffy little cat is pure joy — playful, cuddly, and always ready to melt hearts with every tiny purr. 🐾💛",
      imageUrl: DEFAULT_CAT_IMAGE,
    },
  };

  // For now, simulate fetch with mock data (replace with actual API call)
  try {
    // const res = await fetch(`https://api.example.com/cats/${catId}`, {
    //   next: { revalidate: 3600 }, // 1h cache per cat
    // });
    // if (!res.ok) throw new Error('Failed to fetch cat profile');
    // return res.json();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockData[catId] || mockData["default"];
  } catch (error) {
    console.error("Failed to fetch cat profile:", error);
    return mockData["default"];
  }
}
