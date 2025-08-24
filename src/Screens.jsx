
import Home from './Home';
import LogisticsConsumer from './mdm/LogisticsConsumer/LogisticsConsumer';
import WarehouseBuiltPart from './mdm/WarehouseBuiltPart/WarehouseBuiltPart';
import WMPart from './mdm/WMPart/WMPart';
import './NavBar.css'; // Import the CSS for the navigation bar

// Define the screens object here or import it from your Screens file
// export const screens = {
//   Parts: ['Global Part Info', 'GDA Local Action', 'Part Consumer Blocking', 'Supplier Cross', 'Where Used In Catalogue', 'Part Note', 'Historical Action', 'Part Job Queue',
//     'Local Action Job Queue', 'GTI-Part Connection', 'Circular Cross'],
//   Supersession: ['Global Supersession', 'Renault Truck Supersession', 'Global ACC/DCN', 'Superseding'],
//   Structure: ['Global Structure info', 'Where used in structure', 'Reports'],
//   MDM: ['MDM WM Part', 'MDM Logistics Consumer', 'Warehouse Built Part'],
//   General:['System Info','Help & Support','NDA']
// };


export const screens = {
  
  MDM: [
    { name: "MDM WM Part", path: "/mdm/wmParts",component:WMPart },
    { name: "Warehouse Built Part", path: "/mdm/warehouseBuiltPart",component:WarehouseBuiltPart },
    { name: "MDM Logistics Consumer", path: "/mdm/logisticsConsumer",component:LogisticsConsumer },

  ],
  

  General:  [
      { name: "System Info", path: "/",component:Home }  ,
      { name: "Help & Support", path: "/",component:Home }  ,
      { name: "NDA", path: "/",component:Home }  


    ]
  
};





