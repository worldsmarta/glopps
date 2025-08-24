import { useNavigate, useLocation } from "react-router";
import { screens } from "./Screens";
import './Goto.css';

export default function Goto({
  isGotoEnabled,
  isGotoDropdownOpen,
  setIsGotoDropdownOpen,
  setIsMarketDropdownOpen,
  mode = "exclude",
  items = []
}) {
  const navigate = useNavigate();
  const location = useLocation();  // 👈 fix here

  // Base menu → remove anything from General (like Home)
  let GotoMenu = Object.entries(screens)
    .filter(([category]) => category !== "General") // 🚫 remove "General"
    .flatMap(([_, subs]) => subs);

  // Apply extra include/exclude rules
  if (mode === "exclude") {
    GotoMenu = GotoMenu.filter((sub) => !items.includes(sub.name));
  } else if (mode === "include") {
    GotoMenu = GotoMenu.filter((sub) => items.includes(sub.name));
  }

  // 🚫 remove current screen
  GotoMenu = GotoMenu.filter((sub) => sub.path !== location.pathname);

  return (
    <div
      className={`goto-dropdown ${isGotoDropdownOpen ? "active" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setIsGotoDropdownOpen((prev) => !prev);
        setIsMarketDropdownOpen(false);
      }}
    >
      <div
        className="goto-button"
        style={{ width: isGotoEnabled ? "300px" : "100px" }}
      >
        <span>Go To</span>
        <span className="goto-arrow">▼</span>
      </div>

      {isGotoDropdownOpen && (
        <div
          className="goto-options-container"
          style={{ width: isGotoEnabled ? "300px" : "100px" }}
        >
          <ul className="goto-options">
            {isGotoEnabled ? (
              GotoMenu.map((sub, index) => (
                <li
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(sub.path);
                    setIsGotoDropdownOpen(false);
                  }}
                >
                  {sub.name}
                </li>
              ))
            ) : (
              <li>Go To:</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
