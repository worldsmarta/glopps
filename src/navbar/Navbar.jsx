// NavBar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { screens } from "../Screens";
import './Navbar.css';

export default function NavBar() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [displayedSubscreens, setDisplayedSubscreens] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Update selected category when route changes
  useEffect(() => {
    for (const [category, subscreens] of Object.entries(screens)) {
      if (subscreens.some((sub) => sub.path === location.pathname)) {
        setSelectedCategory(category);
        setDisplayedSubscreens(subscreens);
        return;
      }
    }
  }, [location.pathname]);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    setDisplayedSubscreens(screens[category] || []);
    setIsDropdownOpen(false);

    // 🚀 Goto first subscreen of category
    if (screens[category]?.length > 0) {
      navigate(screens[category][0].path);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar-container">
      <p className="logo">GLOPPS</p>
      <p className="userid">A510468</p>

      {/* Dropdown for categories */}
      <div
        className={`navbar-custom-dropdown ${isDropdownOpen ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen((prev) => !prev);
        }}
        ref={dropdownRef}
      >
        <div className="navbar-custom-button">
          <span>{selectedCategory || "Select"}</span>
          <span className="navbar-custom-arrow">▼</span>
        </div>

        {isDropdownOpen && (
          <div className="navbar-custom-options-container">
            <ul className="navbar-custom-options">
              {Object.keys(screens).map((category, index) => (
                <li
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(category);
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Subscreens display */}
      <div className="subscreens-display">
        <ul className="subscreens-list">
          {displayedSubscreens.map((sub, index) => (
            <li
              key={index}
              className="subscreen-item"
              onClick={() => navigate(sub.path)}
            >
              {sub.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
