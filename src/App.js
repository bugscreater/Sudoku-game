import React, { useState, useEffect } from "react";
import Sudoku from "./components/Sudoku";
import "./components/sudoku.css";
import "./App.css";
import PlaySudoku from "./components/PlaySudoku";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
 


  // Sudoku

  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PlaySudoku/>}/>
          <Route path="/solvesudoku" element={<Sudoku/>} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
