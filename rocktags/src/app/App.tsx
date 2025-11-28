import "./App.css";
import ProfileCard from "../components/ProfileCard";

function App() {
  // You can remove the state and the Vite/React logos from here.
  // The global app styles are likely still in index.css and App.css.

  return (
    // Only apply the centering layout to the Profile Card view
    <div className="profile-card-layout">
      <ProfileCard />
    </div>
  );
}

export default App;
