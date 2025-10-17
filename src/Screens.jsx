
import Home from './Home';
import HazardousJobQueue from './mdm/HazardousJobQueue/HazardousJobQueue';
import LogisticsConsumer from './mdm/LogisticsConsumer/LogisticsConsumer';

import WarehouseBuiltPart from './mdm/WarehouseBuiltPart/WarehouseBuiltPart';
import WMPart from './mdm/WMPart/WMPart';
import CircularCross from './parts/CircularCross/CircularCross';

import GdaLocalAction from './parts/GdaLocalAction/GdaLocalAction';
import GlobalPartInfo from './parts/GlobalPartInfo/GlobalPartInfo';



export const screens = {
  Parts:[
     { name: "Global Part Info", path: "/parts/partsGlobal",component:GlobalPartInfo },
    { name: "GDA Local Action", path: "/parts/partsGda",component:GdaLocalAction },
    { name: "Part Consumer Blocking", path: "/parts/partConsumerBlocking",component:GlobalPartInfo },
    { name: "Supplier Cross", path: "/parts/supplierCross",component:GlobalPartInfo },
    { name: "Part Note", path: "/parts/partNote",component:GlobalPartInfo },
    { name: "Historical Action", path: "/parts/partsHistorical",component:GlobalPartInfo },
    { name: "Part Job Queue", path: "/parts/partsJobQueue",component:GlobalPartInfo },
    { name: "Local Action Job Queue", path: "/parts/localActionJobQueue",component:GlobalPartInfo },
    { name: "Where Used In Catalogue", path: "/parts/whereUsedCat",component:GlobalPartInfo },

    { name: "Circular Cross", path: "/parts/circularCross",component:CircularCross },
    
  ],
  MDM: [
    { name: "MDM WM Part", path: "/mdm/wmParts",component:WMPart },
    { name: "Warehouse Built Part", path: "/mdm/warehouseBuiltPart",component:WarehouseBuiltPart },
    { name: "MDM Logistics Consumer", path: "/mdm/logisticsConsumer",component:LogisticsConsumer },

    { name: "Hazardous Job Queue", path: "/mdm/hazardousJobQueue",component:HazardousJobQueue},


  ],
  General:  [
      { name: "System Info", path: "/",component:Home }  ,
      { name: "Help & Support", path: "/",component:Home }  ,
      { name: "NDA", path: "/",component:Home }  
    ]
    
};





