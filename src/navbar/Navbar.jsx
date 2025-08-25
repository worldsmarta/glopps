// NavBar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { screens } from "../Screens";
import './Navbar.css';

export default function NavBar() {
  const [selectedCategory, setSelectedCategory] = useState(""); //for ex: Parts
  const [displayedSubscreens, setDisplayedSubscreens] = useState([]); //for ex: under Parts: Global Part Info, GDA Local Action etc
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null); //Reference to the dropdown DOM element.
  const navigate = useNavigate();
  const location = useLocation();

  // Update selected category when route changes (when there is a change in location.pathname)
  //   Every time location.pathname changes (i.e., the user navigates to a new route), this useEffect runs.
  // It loops over all categories in screens.
  // For each category, it checks if any of its subscreens match the current URL path.
  // If a match is found:It sets selectedCategory to the matching category.It sets displayedSubscreens to the subscreens of that category.
  //Stops checking after the first match (return).
  useEffect(() => {
    for (const [category, subscreens] of Object.entries(screens)) {
      if (subscreens.some((sub) => sub.path === location.pathname)) {
        setSelectedCategory(category);
        setDisplayedSubscreens(subscreens);
        return;
      }
    }
  }, [location.pathname]);

  //setSelectedCategory(category):Updates the selected category in the dropdown.
  // Example: If you click "Parts", the dropdown now shows Parts.
  // setDisplayedSubscreens(screens[category] || []): Updates the subscreens displayed below the navbar.screens[category] gives an array of subscreens.
  // || [] ensures it defaults to an empty array if the category has no subscreens.

  // Example: For "Parts", subscreens become ["Global Part Info", "GDA Local Action","Circular Cross"].

  // setIsDropdownOpen(false): Closes the dropdown after selecting a category.
  const handleSelect = (category) => {
    setSelectedCategory(category);
    setDisplayedSubscreens(screens[category] || []);
    setIsDropdownOpen(false);

    // Goto first subscreen of category (for mdm it will go to MDM WM Part)
    //     Checks if the category has at least one subscreen.
    // Navigates automatically to the first subscreen of that category.
    // Clicking "MDM" automatically navigates to /mdm/wm-part
    if (screens[category].length > 0) {
      navigate(screens[category][0].path);
    }
  };

  // Close dropdown when clicking outside
  //if we click somewhere not in the dropdown then it closes
//   First part: dropdownRef.current : ensures the ref exists (not null).
// Second part: !dropdownRef.current.contains(event.target) : checks that the click is outside the dropdown.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="navbar-container">
      <p className="logo">GLOPPS</p>
      <p className="userid">A510468</p>

      {/* Dropdown for categories */}
      {/* onClick={() => {setIsDropdownOpen((prev) => !prev)}} is used so as to avoid too many re-renders otherwise if we 
      onClick={setIsDropdownOpen((prev) => !prev)} then it renders immediately which causes infinite renders which leads to errors */}
      <div className='navbar-custom-dropdown' onClick={() => { setIsDropdownOpen((prev) => !prev) }} ref={dropdownRef}>
        <div className="navbar-custom-button">
          <span>{selectedCategory}</span>
          <span className="navbar-custom-arrow">▼</span>
        </div>

        {isDropdownOpen && (<div className="navbar-custom-options-container">
          <ul className="navbar-custom-options">
            {Object.keys(screens).map((category, index) => (<li key={index} onClick={(e) => { e.stopPropagation(); handleSelect(category); }} >{category}</li>))}
          </ul>
        </div>
        )}
      </div>

      {/* Subscreens display */}
      <div className="subscreens-display">
        <ul className="subscreens-list">
          {displayedSubscreens.map((sub, index) => (<li key={index} className="subscreen-item" onClick={() => navigate(sub.path)}>{sub.name}</li>))}
        </ul>
      </div>
    </div>
  );
}
