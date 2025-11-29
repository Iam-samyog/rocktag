"use client";

import React, { useState, type MouseEvent, useEffect } from "react";
import "./ProfileCard.css";
import { getCatProfile } from "../data/getCatProfile";
import { DEFAULT_CAT_IMAGE } from "../data/constants";
import AboutBlock from "./AboutBlock";
import SnacksBlock from "./SnacksBlock";
import RubPlacesBlock from "./RubPlacesBlock";

type CardSection = "#about" | "#demand" | "#rubplace";

export default function ProfileCard({ catId = "default" }: { catId?: string }) {
  const [activeSection, setActiveSection] = useState<CardSection>("#about");
  const isCardActive = activeSection !== "#about";

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    const section = e.currentTarget.getAttribute(
      "data-section"
    ) as CardSection | null;
    if (section) setActiveSection(section);
  };

  return (
    <div
      className={`card border-card ${isCardActive ? "is-active" : ""}`}
      data-state={activeSection}
    >
      <div className="card-header">
        <div
          className="card-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1549068106-b024baf5062d?auto=format&fit=crop&w=934&q=80')",
          }}
        />
        <img className="card-avatar" src={DEFAULT_CAT_IMAGE} alt="avatar" />

        {/* HEADER TEXT FROM CACHED DATA */}
        <HeaderText catId={catId} />
      </div>

      <div className="card-main">
        {(
          [
            { id: "#about", label: "ABOUT" },
            { id: "#demand", label: "RECOMMENDED SNACKS" },
            { id: "#rubplace", label: "RUB PLACE" },
          ] as const
        ).map((section) => (
          <div
            key={section.id}
            className={`card-section ${
              activeSection === section.id ? "is-active" : ""
            }`}
            id={section.id.substring(1)}
          >
            <div className="card-content">
              <div className="card-subtitle">{section.label}</div>

              {section.id === "#about" && <AboutBlock catId={catId} />}
              {section.id === "#demand" && <SnacksBlock catId={catId} />}
              {section.id === "#rubplace" && <RubPlacesBlock catId={catId} />}
            </div>
          </div>
        ))}

        {/* Navigation buttons remain unchanged */}
        <div className="card-buttons">
          {(
            [
              { id: "#about", label: "ABOUT" },
              { id: "#demand", label: "RECOMMENDED SNACKS" },
              { id: "#rubplace", label: "RUB PLACE" },
            ] as const
          ).map((button) => (
            <button
              key={button.id}
              data-section={button.id}
              className={activeSection === button.id ? "is-active" : ""}
              onClick={handleButtonClick}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeaderText({ catId }: { catId: string }) {
  const [name, setName] = useState("Loading...");
  const [tagline, setTagline] = useState("Loading...");

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getCatProfile(catId);
        setName(profile.name);
        setTagline(profile.tagline);
      } catch (error) {
        console.error("Error fetching cat profile:", error);
        setName("Error");
        setTagline("Error");
      }
    }

    fetchData();
  }, [catId]);

  return (
    <>
      <h1 className="card-fullname">{name}</h1>
      <h2 className="card-jobtitle">{tagline}</h2>
    </>
  );
}
