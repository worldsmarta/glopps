import { Routes, Route } from "react-router";
import Home from "./Home";
import LogisticsConsumer from "./LogisticsConsumer/LogisticsConsumer";
import './App.css'

export default function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logisticsconsumer" element={<LogisticsConsumer />} />
      </Routes>
   
  );
}
