import React from "react";
import "./CatProfileDetails.css";

type CatProfile = {
  name: string;
  color: string;
  age: number;
  personality: string;
  friendliness: number; // 0-5
  activity: string;
  favSpot: string;
  bio: string;
  sightings: number;
  bestTime: string;
};

const CatProfileDetails: React.FC<{ selectedCatProfile: CatProfile }> = ({
  selectedCatProfile,
}) => {
  return (
    <div className="cat-details">
      {selectedCatProfile && (
        <div className="p-6 space-y-6">
          <div className="card-box orange">
            <h3 className="heading">
              <i className="fas fa-info-circle icon orange"></i>
              Basic Information
            </h3>
            <div className="space-y-3">
              <div className="row">
                <span className="label">
                  <i className="fas fa-palette icon blue"></i>
                  Color
                </span>
                <span className="value">{selectedCatProfile.color}</span>
              </div>
              <div className="row">
                <span className="label">
                  <i className="fas fa-birthday-cake icon orange"></i>
                  Age
                </span>
                <span className="value">
                  {selectedCatProfile.age} years old
                </span>
              </div>
              <div className="row">
                <span className="label">
                  <i className="fas fa-smile icon blue"></i>
                  Personality
                </span>
                <span className="value">{selectedCatProfile.personality}</span>
              </div>
            </div>
          </div>

          <div className="card-box orange">
            <h3 className="heading">
              <i className="fas fa-heart icon red"></i>
              Friendliness Level
            </h3>
            <div className="hearts">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-heart heart ${
                    i < selectedCatProfile.friendliness ? "filled" : "empty"
                  }`}
                ></i>
              ))}
            </div>
            <p className="muted">
              {selectedCatProfile.friendliness >= 4
                ? "Very friendly! Loves attention 😻"
                : selectedCatProfile.friendliness >= 3
                ? "Moderately friendly 😸"
                : "A bit shy, approach carefully 😿"}
            </p>
          </div>

          <div className="card-box blue">
            <h3 className="heading">
              <i className="fas fa-running icon blue"></i>
              Current Activity
            </h3>
            <p className="muted activity">
              <i className="fas fa-paw icon orange small"></i>
              {selectedCatProfile.activity}
            </p>
          </div>

          <div className="card-box orange">
            <h3 className="heading">
              <i className="fas fa-map-marker-alt icon orange"></i>
              Favorite Spot
            </h3>
            <p className="muted">
              <i className="fas fa-location-dot icon blue small"></i>
              {selectedCatProfile.favSpot}
            </p>
          </div>

          <div className="card-box blue">
            <h3 className="heading">
              <i className="fas fa-book icon blue"></i>
              Bio
            </h3>
            <p className="muted">{selectedCatProfile.bio}</p>
          </div>

          <div className="card-box orange">
            <h3 className="heading">
              <i className="fas fa-eye icon orange"></i>
              Sightings & Best Time
            </h3>
            <div className="space-y-3">
              <div className="row">
                <span className="label">
                  <i className="fas fa-binoculars icon blue"></i>
                  Total Sightings
                </span>
                <span className="value">{selectedCatProfile.sightings}</span>
              </div>
              <div className="row">
                <span className="label">
                  <i className="fas fa-clock icon orange"></i>
                  Best Time to Spot
                </span>
                <span className="value">{selectedCatProfile.bestTime}</span>
              </div>
            </div>
          </div>

          <div className="card-box blue">
            <h3 className="heading">
              <i className="fas fa-camera icon blue"></i>
              Share a Sighting
            </h3>
            <p className="muted mb-4">
              Spotted {selectedCatProfile.name}? Share your sighting to help
              track their adventures!
            </p>
            <button
              onClick={() => alert("Feature coming soon!")}
              className="report-btn"
            >
              <i className="fas fa-paw"></i>
              Report Sighting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatProfileDetails;
