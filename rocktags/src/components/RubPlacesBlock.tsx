"use client";

import { getCatRubPlaces } from "../data/getCatRubPlaces";
import { useEffect, useState } from "react";

export default function RubPlacesBlock({ catId }: { catId: string }) {
  const [places, setPlaces] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const placesData = await getCatRubPlaces(catId);
        setPlaces(placesData);
      } catch (error) {
        console.error("Error fetching rub places:", error);
        setPlaces(["Error loading rub places"]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [catId]);

  if (loading) {
    return <p className="card-desc">Loading rub places…</p>;
  }

  return (
    <div className="card-rubplace-wrapper">
      {places.map((p, i) => (
        <div className="card-rubplace" key={i}>
          {p}
        </div>
      ))}
    </div>
  );
}
