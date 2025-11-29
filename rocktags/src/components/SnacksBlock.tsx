"use client";

import { getCatSnacks } from "../data/getCatSnacks";
import { useEffect, useState } from "react";

export default function SnacksBlock({ catId }: { catId: string }) {
  const [snacks, setSnacks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const snacksData = await getCatSnacks(catId);
        setSnacks(snacksData);
      } catch (error) {
        console.error("Error fetching cat snacks:", error);
        setSnacks(["Error loading snacks"]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [catId]);

  if (loading) {
    return <p className="card-desc">Loading snacks…</p>;
  }

  return (
    <ul className="card-desc">
      {snacks.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>
  );
}
