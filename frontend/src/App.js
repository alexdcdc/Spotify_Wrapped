import './App.css';
import SpotifyButton from "./SpotifyButton";
import SpotifyOverview from "./components/SpotifyOverview";  // Adjust the path if needed

function App() {
  return (
    <div className="App">
      <SpotifyButton />
      <SpotifyOverview />
    </div>
  );
}

export default App;
