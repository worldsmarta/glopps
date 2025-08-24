
import Home from './Home';
import LogisticsConsumer from './mdm/LogisticsConsumer/LogisticsConsumer';
import WarehouseBuiltPart from './mdm/WarehouseBuiltPart/WarehouseBuiltPart';
import WMPart from './mdm/WMPart/WMPart';
import CircularCross from './parts/CircularCross/CircularCross';

import GdaLocalAction from './parts/GdaLocalAction/GdaLocalAction';
import GlobalPartInfo from './parts/GlobalPartInfo/GlobalPartInfo';

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
  Parts:[
     { name: "Global Part Info", path: "/parts/partsGlobal",component:GlobalPartInfo },
    { name: "GDA Local Action", path: "/parts/partsGda",component:GdaLocalAction },
    { name: "Circular Cross", path: "/parts/circularCross",component:CircularCross }
  ],
  MDM: [
    { name: "MDM WM Part", path: "/mdm/wmParts",component:WMPart },
    { name: "Warehouse Built Part", path: "/mdm/warehouseBuiltPart",component:WarehouseBuiltPart },
    { name: "MDM Logistics Consumer", path: "/mdm/logisticsConsumer",component:LogisticsConsumer }
  ],
  


  General:  [
      { name: "System Info", path: "/",component:Home }  ,
      { name: "Help & Support", path: "/",component:Home }  ,
      { name: "NDA", path: "/",component:Home }  
    ]
  
};





