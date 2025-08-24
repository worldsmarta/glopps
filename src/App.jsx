import { Routes, Route } from "react-router";
import './App.css';
import { screens } from "./Screens";
import NavBar from "./navbar/Navbar";

export default function App() {
  return (
    <div className="layout-container">
      {/* Navbar always visible, fixed 20% width */}
      <NavBar />

      {/* Routed content takes 80% */}
      <div className="layout-content">
        <Routes>
          {Object.values(screens).flat().map((item, index) => (
            <Route
              key={index}
              path={item.path}
              element={<item.component />}
            />
          ))}
        </Routes>
      </div>
    </div>
  );
}
