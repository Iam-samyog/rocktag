import React, { useState, type MouseEvent } from "react";
import CatProfileDetails from "@/components/CatProfileDetails";

import "./ProfileCard.css"; // Import the component-specific styles

// Define a type for the possible section IDs
type CardSection = "#about" | "#demand" | "#rubplace";

const ProfileCard: React.FC = () => {
  // Use state to track the active section, initialized to "#about"
  const [activeSection, setActiveSection] = useState<CardSection>("#about");
  // Sample selected cat profile state to demonstrate the new detailed view
  type CatProfile = {
    name: string;
    color: string;
    age: number;
    personality: string;
    friendliness: number;
    activity: string;
    favSpot: string;
    bio: string;
    sightings: number;
    bestTime: string;
  };

  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedCatProfile] = useState<CatProfile | null>({
    name: "Mr. Kitten",
    color: "Orange & White",
    age: 2,
    personality: "Playful & Affectionate",
    friendliness: 4,
    activity: "Napping in the sun",
    favSpot: "Window sill near the plants",
    bio: "Curious explorer who loves warm laps and feather toys.",
    sightings: 27,
    bestTime: "Late afternoon",
  });

  // Logic to determine if the card should have the 'is-active' class
  // Based on the script.js logic: it adds 'is-active' unless the targetSection is '#about'
  const isCardActive = activeSection !== "#about";

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Safely get the data-section attribute
    const targetSection = e.currentTarget.getAttribute(
      "data-section"
    ) as CardSection | null;

    if (targetSection) {
      setActiveSection(targetSection);
    }
  };

  // Content rendering utility
  const renderSectionContent = (sectionId: CardSection) => {
    switch (sectionId) {
      case "#about":
        return (
          <>
            <div className="card-subtitle">ABOUT</div>
            <p
              className="card-desc"
              id="about-description"
              data-field="about.description"
            >
              This fluffy little cat is pure joy — playful, cuddly, and always
              ready to melt hearts with every tiny purr. 🐾💛
            </p>
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => setShowDetails((s) => !s)}
                className="rubplace-me"
                aria-expanded={showDetails}
              >
                {showDetails ? "Hide Full Profile" : "View Full Profile"}
              </button>
            </div>
            {showDetails && selectedCatProfile && (
              <div style={{ marginTop: 12 }}>
                <CatProfileDetails selectedCatProfile={selectedCatProfile} />
              </div>
            )}
          </>
        );
      case "#demand":
        return (
          <>
            <div className="card-subtitle">DEMAND SNACKS</div>
            <ul className="card-desc">
              <li>
                Royal Canin – Vet-recommended formulas for specific breeds and
                health needs.
              </li>
              <li>
                Hill’s Science Diet – Scientifically formulated for overall
                health and weight management.
              </li>
              <li>
                Purina Pro Plan – High-protein recipes with real meat and
                tailored nutrition.
              </li>
              <li>
                Blue Buffalo – Natural ingredients with no artificial flavors or
                preservatives.
              </li>
            </ul>
          </>
        );
      case "#rubplace":
        return (
          <>
            <div className="card-subtitle">RUB PLACE</div>
            <div className="card-rubplace-wrapper">
              <div className="card-rubplace">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1818/1818401.png"
                  alt="icon"
                />
                Under the chin (preferred spot, gentle strokes only)
              </div>
              <div className="card-rubplace">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1818/1818401.png"
                  alt="icon"
                />
                Behind the ears: a soothing, favorite massage spot for cats. 🐱
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`card border-card ${isCardActive ? "is-active" : ""}`}
      data-state={activeSection}
    >
      <div className="card-header">
        {/* Cover image */}
        <div
          className="card-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1549068106-b024baf5062d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80')",
          }}
        ></div>
        {/* Avatar image */}
        <img
          className="card-avatar"
          src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          alt="avatar"
        />
        <h1 className="card-fullname">Mr. Kitten</h1>
        <h2 className="card-jobtitle">I love to sleep</h2>
      </div>

      <div className="card-main">
        {/* Sections */}
        {(
          [
            { id: "#about", label: "ABOUT" },
            { id: "#demand", label: "DEMAND SNACKS" },
            { id: "#rubplace", label: "RUB PLACE" },
          ] as { id: CardSection; label: string }[]
        ).map((section) => (
          <div
            key={section.id}
            className={`card-section ${
              activeSection === section.id ? "is-active" : ""
            }`}
            id={section.id.substring(1)} // Remove '#' for the actual HTML id
          >
            <div className="card-content">
              {renderSectionContent(section.id)}
            </div>
          </div>
        ))}

        {/* Buttons (Navigation) */}
        <div className="card-buttons">
          {(
            [
              { id: "#about", label: "ABOUT" },
              { id: "#demand", label: "DEMAND SNACKS" },
              { id: "#rubplace", label: "RUB PLACE" },
            ] as { id: CardSection; label: string }[]
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
};

export default ProfileCard;
