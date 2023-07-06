import "./App.css";
import {Route, Routes } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"

function App() {
  return (

   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">

      <Navbar/>                                         {/* navbar is common in all pages */}
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>

   </div>

)};

export default App;
