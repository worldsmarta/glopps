import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { screens } from "./Screens";
import './Navstyle.css';

export default function NavBar() {
  const [selectedCategory, setSelectedCategory] = useState(""); // for ex: Parts
  const [displayedSubscreens, setDisplayedSubscreens] = useState([]); // subscreens under selected category
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null); // Reference to the dropdown DOM element
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

  // Handle category selection
  const handleSelect = (category) => {
    setSelectedCategory(category);
    setDisplayedSubscreens(screens[category] || []);
    setIsDropdownOpen(false);
    // Navigate to first subscreen if available
    if (screens[category] && screens[category].length > 0) {
      navigate(screens[category][0].path);
    }
  };

  // Handle navigation and close mobile menu
  const handleNavigate = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  // Open mobile menu
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Close mobile menu when clicking outside (on overlay)
  const handleOverlayClick = () => {
    closeMobileMenu();
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile hamburger button - HIDE WHEN MENU IS OPEN */}
      {!isMobileMenuOpen && (
        <button 
          className="mobile-menu-button"
          onClick={openMobileMenu}
          aria-label="Open mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      )}

      {/* Mobile overlay - Only show when menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={handleOverlayClick}
          aria-label="Close mobile menu"
        ></div>
      )}

      {/* Navbar container */}
      <div className={`navbar-container ${isMobileMenuOpen ? 'navbar-mobile-open' : ''}`}>
        {/* Mobile close button - Only show when menu is open */}
        {isMobileMenuOpen && (
          <button 
            className="mobile-close-button" 
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            ×
          </button>
        )}

        <p className="logo">GLOPPS</p>
        <p className="userid">A510468</p>

        {/* Dropdown for categories */}
        <div
          className='navbar-custom-dropdown'
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          ref={dropdownRef}
        >
          <div className="navbar-custom-button">
            <span>{selectedCategory || "Select Category"}</span>
            <span className={`navbar-custom-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
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
          {displayedSubscreens.length > 0 ? (
            <ul className="subscreens-list">
              {displayedSubscreens.map((sub, index) => (
                <li
                  key={index}
                  className={`subscreen-item ${location.pathname === sub.path ? 'active' : ''}`}
                  onClick={() => handleNavigate(sub.path)}
                >
                  {sub.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-subscreens-message">
              Select a category to view options
            </div>
          )}
        </div>
      </div>
    </>
  );
}