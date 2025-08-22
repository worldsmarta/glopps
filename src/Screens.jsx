import React, { useState, useEffect,useRef } from 'react';
import './NavBar.css'; // Import the CSS for the navigation bar

// Define the screens object here or import it from your Screens file
export const screens = {
  Parts: ['Global Part Info', 'GDA Local Action', 'Part Consumer Blocking', 'Supplier Cross', 'Where Used In Catalogue', 'Part Note', 'Historical Action', 'Part Job Queue',
    'Local Action Job Queue', 'GTI-Part Connection', 'Circular Cross'],
  Supersession: ['Global Supersession', 'Renault Truck Supersession', 'Global ACC/DCN', 'Superseding'],
  Structure: ['Global Structure info', 'Where used in structure', 'Reports'],
  MDM: ['MDM WM Part', 'MDM Logistics Consumer', 'Warehouse Built Part'],
  General:['System Info','Help & Support','NDA']
};


export default function NavBar() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [displayedSubscreens, setDisplayedSubscreens] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 👇 Ref for detecting outside clicks
  const dropdownRef = useRef(null);

  // Subscreens logic
  useEffect(() => {
    if (selectedCategory) {
      const subscreens = screens[selectedCategory];
      if (subscreens) {
        setDisplayedSubscreens(subscreens);
      } else {
        setDisplayedSubscreens([]);
      }
    } else {
      setDisplayedSubscreens([]);
    }
  }, [selectedCategory]);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false); // close dropdown after select
  };

  // 👇 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar-container">
      <p className="logo">GLOPPS</p>
      <p className="userid">A510468</p>

      <div
        className={`navbar-custom-dropdown ${isDropdownOpen ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen((prev) => !prev);
        }}
        ref={dropdownRef} // attach ref here
      >
        <div className="navbar-custom-button">
          <span>{selectedCategory}</span>
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

      <div className="subscreens-display">
        <ul className="subscreens-list">
          {displayedSubscreens.map((subscreen, index) => (
            <li key={index} className="subscreen-item">
              {subscreen}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

