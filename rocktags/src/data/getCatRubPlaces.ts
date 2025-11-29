"use cache";

export async function getCatRubPlaces(catId: string): Promise<string[]> {
  // Mock data - replace with actual API call
  const mockData: Record<string, string[]> = {
    "1": [
      "Behind the ears (loves the attention from students)",
      "Under the chin (favorite spot for selfies)",
      "Gentle head scratches (perfect for viral videos)",
    ],
    "2": [
      "Top of the head (dignified and scholarly)",
      "Behind the ears (appreciates quiet, thoughtful pets)",
      "Gentle chin rubs (only during office hours)",
    ],
    "3": [
      "Base of the tail (mysterious and elusive)",
      "Under the chin (likes subtle, quick pets)",
    ],
    "4": ["Cheeks (loves playful scratches)"],
    "5": [
      "Around the neck (enjoys energetic rubs)",
      "Back scratches (loves to stretch out)",
    ],
    default: [
      "Under the chin (preferred spot, gentle strokes only)",
      "Behind the ears: a soothing, favorite massage spot for cats. 🐱",
    ],
  };

  try {
    // const res = await fetch(`https://api.example.com/cats/${catId}/rub-places`, {
    //   next: { revalidate: 86400 }, // cache 1 day
    // });
    // if (!res.ok) throw new Error('Failed to fetch rub places');
    // return res.json();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockData[catId] || mockData["default"];
  } catch (error) {
    console.error("Failed to fetch rub places:", error);
    return mockData["default"];
  }
}
