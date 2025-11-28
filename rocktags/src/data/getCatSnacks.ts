"use cache";

export async function getCatSnacks(catId: string): Promise<string[]> {
  // Mock data - replace with actual API call
  const mockData: Record<string, string[]> = {
    "1": [
      "Fancy Feast – Microwave's favorite for special occasions",
      "Temptations Treats – Perfect for getting attention from students",
      "Friskies Indoor Delights – Keeps our campus star healthy",
      "Wellness Core – High-protein fuel for socializing",
    ],
    "2": [
      "Hill's Science Diet Senior – Age-appropriate nutrition",
      "Royal Canin Indoor Adult – Perfect for a scholarly lifestyle",
      "Blue Buffalo Wilderness – Natural ingredients for a wise cat",
      "Purina Pro Plan Focus – Brain health for deep thinking",
    ],
    "3": [
      "Nutro Wholesome Essentials – Balanced diet for an active explorer",
      "Merrick Grain-Free – High-protein for energy",
      "Wellness CORE RawRev – Boosts stamina for adventures",
    ],
    "4": ["Orijen Cat & Kitten – Biologically appropriate for playful felines"],
    "5": ["Iams ProActive Health – Supports energy for lively cats"],
    default: [
      "Royal Canin – Vet-recommended formulas for specific breeds and health needs.",
      "Hill's Science Diet – Scientifically formulated for overall health and weight management.",
      "Purina Pro Plan – High-protein recipes with real meat and tailored nutrition.",
      "Blue Buffalo – Natural ingredients with no artificial flavors or preservatives.",
    ],
  };

  try {
    // const res = await fetch(`https://api.example.com/cats/${catId}/snacks`, {
    //   next: { revalidate: 86400 }, // cache 1 day
    // });
    // if (!res.ok) throw new Error('Failed to fetch cat snacks');
    // return res.json();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockData[catId] || mockData["default"];
  } catch (error) {
    console.error("Failed to fetch cat snacks:", error);
    return mockData["default"];
  }
}
