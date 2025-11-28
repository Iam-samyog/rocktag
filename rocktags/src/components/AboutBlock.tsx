"use client";

import { getCatProfile } from "../data/getCatProfile";
import { useEffect, useState } from "react";

export default function AboutBlock({ catId }: { catId: string }) {
  const [about, setAbout] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const profile = await getCatProfile(catId);
        setAbout(profile.about);
      } catch (error) {
        console.error("Error fetching cat profile:", error);
        setAbout("Error loading profile");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [catId]);

  if (loading) {
    return <p className="card-desc">Loading about…</p>;
  }

  return <p className="card-desc">{about}</p>;
}
