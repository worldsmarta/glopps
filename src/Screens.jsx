import React, { useState, useEffect } from 'react';
import './NavBar.css'; // Import the CSS for the navigation bar

// Define the screens object here or import it from your Screens file
export const screens = {
  Parts: ['Global Part Info', 'GDA Local Action', 'Part Consumer Blocking', 'Supplier Cross', 'Where Used In Catalogue', 'Part Note', 'Historical Action', 'Part Job Queue',
    'Local Action Job Queue', 'GTI-Part Connection', 'Circular Cross'],
  Supersession: ['Global Supersession', 'Renault Truck Supersession', 'Global ACC/DCN', 'Superseding'],
  Structure: ['Global Structure info', 'Where used in structure', 'Reports'],
  MDM: ['MDM WM Part', 'MDM Logistics Consumer', 'Warehouse Built Part']
};

export default function NavBar() {
  // State to hold the currently selected category from the dropdown
  const [selectedCategory, setSelectedCategory] = useState('');
  // State to hold the subscreens to be displayed based on the selected category
  const [displayedSubscreens, setDisplayedSubscreens] = useState([]);

  // useEffect to update displayedSubscreens whenever selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      // Get the array of subscreens for the selected category
      const subscreens = screens[selectedCategory];
      if (subscreens) {
        setDisplayedSubscreens(subscreens);
      } else {
        setDisplayedSubscreens([]); // Clear if category has no subscreens or is not found
      }
    } else {
      setDisplayedSubscreens([]); // Clear if no category is selected
    }
  }, [selectedCategory]);

  // Handle change event for the dropdown
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="navbar-container">
      {/* Dropdown for selecting categories */}
      <select className="navbar-dropdown" onChange={handleCategoryChange} value={selectedCategory}>
        <option value="" disabled>Select Category</option> {/* Default disabled option */}
        {/* Map over the keys of the 'screens' object to create dropdown options */}
        {Object.keys(screens).map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Display area for subscreens */}
      <div className="subscreens-display">
        {displayedSubscreens.length > 0 ? (
          <ul className="subscreens-list">
            {/* Map over the displayedSubscreens array to create list items */}
            {displayedSubscreens.map((subscreen, index) => (
              <li key={index} className="subscreen-item">
                {subscreen}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-subscreens-message">Select a category to view subscreens.</p>
        )}
      </div>
    </div>
  );
}