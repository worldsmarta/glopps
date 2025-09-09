import { useNavigate, useLocation } from "react-router";
import { screens } from "./Screens";
import './Goto.css';

export default function Goto({ isGotoEnabled, isGotoDropdownOpen, setIsGotoDropdownOpen, dropdownOpen, mode = "exclude", items = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  // remove anything from General (we do not include that in Goto menu)
  let GotoMenu = Object.entries(screens).filter(([category]) => category !== "General").flatMap(([_, subs]) => subs);

  // include/exclude rules
  if (mode === "exclude") {
    GotoMenu = GotoMenu.filter((sub) => !items.includes(sub.name));
  } else if (mode === "include") {
    GotoMenu = GotoMenu.filter((sub) => items.includes(sub.name));
  }

  // remove current screen  (if in Logistics consumer screen then Logistics consumer should not be displayed in the Goto dropdown)
  //Here GotoMenu is filtered so that it includes those screens whose path does not match with the pathname of the current screen
  GotoMenu = GotoMenu.filter((sub) => sub.path !== location.pathname);

  return (
    <div className='goto-dropdown' onClick={(e) => { e.stopPropagation(); setIsGotoDropdownOpen((prev) => !prev); dropdownOpen(false) }}>

      <div className="goto-button" style={{ width: isGotoEnabled ? "300px" : "100px" }}>
        <span>Go To</span>
        <span className="goto-arrow">▼</span>
      </div>

      {isGotoDropdownOpen && (<div className="goto-options-container" style={{ width: isGotoEnabled ? "300px" : "100px" }}>
        <ul className="goto-options">
          {isGotoEnabled ? (GotoMenu.map((sub, index) => (<li key={index} onClick={() => { navigate(sub.path); setIsGotoDropdownOpen(false); }}>{sub.name} </li>)))
           : (
            <li>Go To:</li>
          )}
        </ul>
      </div>
      )}
    </div>
  );
}