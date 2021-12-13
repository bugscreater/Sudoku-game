import React, { useEffect, useState } from "react";
import "./playground.css";
import { Link } from "react-router-dom";

function PlaySudoku() {
 
  // restrict backspace key...
  window.onkeydown = function (event) {
    if (event.which == 8 || event.which == 46) {
      event.preventDefault(); // turn off browser transition to the previous page
    }
  };
  
   //  quit game...
  function quit_game(){
    if (Game_Interval !== undefined) {
      clearInterval(Game_Interval);
    }
    Reload_game();

  }
  
  const [level, setLevel] = useState("easy");
  function Reload_game() {
    if (Game_Interval !== undefined) {
      clearInterval(Game_Interval);
    }

    callapi();
    var element = document.querySelector(".setup-Game");
    element.scrollIntoView();
    setDisable(false);

    let end_game_btn = document.getElementById("Game_end_btn");
    if (end_game_btn !== null) {
      end_game_btn.disabled = false;
      end_game_btn.style.display = "none";
    }

    let start_game_btn = document.getElementById("Game_start_btn");
    if (start_game_btn !== null) {
      start_game_btn.style.display = "block";
    }

    for (var i = 0; i < 81; i++) {
      var cell = document.getElementById(`cell-${i}`);
      cell.value = "";
      cell.disabled = true;
      cell.readOnly = true;
      
      cell.classList.remove("filled_cell");
      cell.classList.remove("correct");
      cell.classList.remove("incorrect");

    }

  
    setGame_Score(0);
    setGame_result("You loose");
    setTime({m:0,s:0});

    var game_result = document.getElementById("game_result");

    if (game_result !== null) {
      game_result.style.display = "none";
    }

    var eraser = document.getElementById("eraser");
    if (eraser !== null) {
      eraser.style.display = "block";
    }
    
  
   
    var view_solution_btn = document.getElementById("View-solution");

    if (view_solution_btn !== null) {
      view_solution_btn.style.display = "none";
    }

    var new_game_btn = document.getElementById("new_game");

    if (new_game_btn !== null) {
      new_game_btn.style.display = "none";
    }
    
    if(level === "easy"){
      setGame_live(10);
    }
    else if(level === "medium"){
      setGame_live(15);
    }
    else{
      setGame_live(20);
    }

    

    
  }

  const m = 9;
  const n = 9;
  let arr = new Array(m);

  for (var i = 0; i < m; i++) {
    arr[i] = new Array(n);
  }

  var count = 0;
  for (var a = 0; a < m; a++) {
    for (var b = 0; b < n; b++) {
      arr[a][b] = count;
      count++;
    }
  }

  const [easy_sudoku, setEasy] = useState();
  const [medium_sudoku, setMedium] = useState();
  const [hard_sudoku, setHard] = useState();

 
 

  // change theme...

  function change_theme(e) {
    var selected_theme = e.target.value;

    if (selected_theme === "light") {
      document.body.style.background = "white";
      document.body.style.color = "black";

      document.getElementById("game_arena").style.background = "white";
      document.getElementById("game_arena").style.color = "black";
    } else {
      document.body.style.background = "#333333";
      document.body.style.color = "white";

      document.getElementById("game_arena").style.background = "#333333";
      document.getElementById("game_arena").style.color = "white";
    }
  }

  //  function for apicall....
  // https://sudoku-game-server.herokuapp.com/easy

  function callapi() {
    fetch("https://sudoku-game-server.herokuapp.com/easy")
      .then((res) => res.json())
      .then((data) => {
        data = JSON.stringify(data);
        setEasy(data);
      });

    fetch("https://sudoku-game-server.herokuapp.com/medium")
      .then((res) => res.json())
      .then((data) => {
        data = JSON.stringify(data);
        setMedium(data);
      });

    fetch("https://sudoku-game-server.herokuapp.com/hard")
      .then((res) => res.json())
      .then((data) => {
        data = JSON.stringify(data);
        setHard(data);
      });
  }
  
  const [Game_Interval, setGame_Interval] = useState();
  useEffect(() => {
   
     callapi();
  }, []);
  

  const dummy_arr = new Array(9);

  const [isdisabled, setDisable] = useState(false);

  for (var c = 0; c < dummy_arr.length; c++) {
    dummy_arr[c] = new Array(9).fill(0);
  }

  

  function changelevel(e) {
    let level = e.target.value;
    setLevel(level);
    if (level === "easy") {
      setGame_live(10);
    } else if (level === "medium") {
      setGame_live(15);
    } else {
      setGame_live(20);
    }
  }

  const [time, setTime] = useState({ m: 0, s: 0 });
  const [game_time, setGame_time] = useState(5);

  const [game_live, setGame_live] = useState(10);

  const [Game_result, setGame_result] = useState("You loose");

  function change_time(e) {
    setGame_time(parseInt(e.target.value));
  }

  const [eraser_selected, seteraser_selected] = useState(false);
  const [selected_number, setSelect_num] = useState(0);
  function Select_number(e) {
    seteraser_selected(false);
    let eraser = document.getElementById("eraser");
    eraser.classList.remove("eraser_selected");

    var children = document.getElementById("number-container").children;
    for (var i = 0; i < children.length; i++) {
      children[i].classList.remove("selected");
    }

    setSelect_num(parseInt(e.target.innerHTML));
    e.target.classList.add("selected");
  }

 
  const [Game_Score, setGame_Score] = useState(0);

  //  Scroll the page to automatic to board...
  function scroll() {
    var element = document.querySelector(".Game-container");
    element.scrollIntoView();
  }

  function start_game() {
    setDisable(true);

    for (var i = 0; i < 81; i++) {
      document.getElementById(`cell-${i}`).value = "";
      document.getElementById(`cell-${i}`).classList.remove("filled_cell");
    }

    if (level === "easy") {
    
      fill_board(easy_sudoku);
    } else if (level === "medium") {
     
      fill_board(medium_sudoku);
    } else {
     
      fill_board(hard_sudoku);
    }

    run();
    let Interval = setInterval(run, 1000);
    setGame_Interval(Interval);

    for (var i = 0; i < 81; i++) {
      var cell = document.getElementById(`cell-${i}`);
      if (cell.value === "") {
        cell.disabled = false;
        cell.readOnly = true;
      }
    }
    let start_game_btn = document.getElementById("Game_start_btn");
    if (start_game_btn !== null) {
      start_game_btn.style.display = "none";
    }

    let end_game_btn = document.getElementById("Game_end_btn");
    if (end_game_btn !== null) {
      end_game_btn.style.display = "block";
    }
  }

  function Restrict_input(e) {
    e.target.value = "";
  }

  const input_arr = new Array(9);

  for (var c = 0; c < input_arr.length; c++) {
    input_arr[c] = new Array(9).fill(0);
  }

  // select eraser...

  function select_eraser() {
    let flag = eraser_selected;

    var children = document.getElementById("number-container").children;
    for (var i = 0; i < children.length; i++) {
      children[i].classList.remove("selected");
      children[i].disabled = !flag;
    }

    let eraser = document.getElementById("eraser");

    if (eraser !== null) {
      eraser.classList.toggle("eraser_selected");
    }

    seteraser_selected(!flag);
  }

  //  fill the cell or erase the cell...
  function fill_the_cell(e, row, column) {
    var count = 0;

    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        input_arr[i][j] = document.getElementById(`cell-${count}`).value;
        count++;
      }
    }

    if (selected_number === 0) {
      e.target.value = "";
    } else {
      if (!eraser_selected) {
        e.target.value = selected_number;
        input_arr[row][column] = e.target.value;
      } else {
        if (e.target.value !== "") {
          e.target.value = "";
          input_arr[row][column] = "";
          let score = Game_Score;
          score--;
          if (score >= 0) {
            setGame_Score(score);
          } else {
            setGame_Score(0);
          }
        }

        return;
      }

      if (!isValidSudoku(input_arr)) {
        e.target.classList.remove("correct");
        e.target.classList.add("incorrect");
        let live = game_live;
        live--;
        setGame_live(live);

        if (game_live < 2) {
          setGame_live(0);
          if (Game_Interval !== undefined) {
            clearInterval(Game_Interval);
          }
          game_over();
        }
      } else {
        e.target.classList.remove("incorrect");
        e.target.classList.add("correct");
        let score = Game_Score;
        score++;
        setGame_Score(score);
        var filled_cell = 0;

        for (var i = 0; i < 81; i++) {
          let cell = document.getElementById(`cell-${i}`);
          if (cell.value !== "") {
            filled_cell++;
          }
        }
        //  check whether user wins or not...
        if (filled_cell === 81) {
          if (Game_Interval !== undefined) {
            clearInterval(Game_Interval);
          }
          game_over();
          setGame_result("You Won.");
        }
      }
    }
  }

  //  Game over function...
  function game_over() {
    scroll();
    for (var i = 0; i < 81; i++) {
      var cell = document.getElementById(`cell-${i}`);

      cell.disabled = true;
    }
    var view_solution_btn = document.getElementById("View-solution");

    if (view_solution_btn !== null) {
      view_solution_btn.style.display = "flex";
    }

    var new_game_btn = document.getElementById("new_game");

    if (new_game_btn !== null) {
      new_game_btn.style.display = "flex";
    }

    var game_result = document.getElementById("game_result");

    if (game_result !== null) {
      game_result.style.display = "flex";
    }

    var eraser = document.getElementById("eraser");
    if (eraser !== null) {
      eraser.style.display = "none";
    }

    

    let end_game_btn = document.getElementById("Game_end_btn");
    if (end_game_btn !== null) {
      end_game_btn.disabled = true;
    }
  }

  //  Function for sudoku validation....

  function check_grid(r, c, board) {
    var m1 = new Map();

    for (var i = r; i < r + 3; i++) {
      for (var j = c; j < c + 3; j++) {
        if (board[i][j] !== "") {
          if (m1.has(board[i][j])) {
            return false;
          }
          m1.set(board[i][j], 1);
        }
      }
    }

    return true;
  }

  function isValidSudoku(board) {
    // check for first 3*3 grid;

    for (var i = 0; i <= 6; i += 3) {
      for (var j = 0; j <= 6; j += 3) {
        if (!check_grid(i, j, board)) {
          return false;
        }
      }
    }

    // check for row...

    for (var i = 0; i < 9; i++) {
      var m2 = new Map();

      for (var j = 0; j < 9; j++) {
        if (board[i][j] !== "") {
          if (m2.has(board[i][j])) {
            return false;
          }
          m2.set(board[i][j], 1);
        }
      }
    }

    // check for column...

    for (var j = 0; j < 9; j++) {
      var m2 = new Map();

      for (var i = 0; i < 9; i++) {
        if (board[i][j] !== "") {
          if (m2.has(board[i][j])) {
            return false;
          }
        }
        m2.set(board[i][j], 1);
      }
    }

    return true;
  }

  var updatedmin = time.m;
  var updatedsec = time.s;

  function run(){
   
    if (updatedsec === 60) {
      updatedmin++;
      updatedsec = 0;
    }
    if (updatedmin >= game_time) {
      clearInterval(Game_Interval);
      game_over();
      return;
    }

    updatedsec++;

    return setTime({ m: updatedmin, s: updatedsec });
  };

  function fill_board(sudoku_puzzle) {
    if (sudoku_puzzle !== undefined) {
      var puzzle_ques = JSON.parse(sudoku_puzzle);

      for (let key in puzzle_ques) {
        if (puzzle_ques[key] !== "0") {
          document.getElementById(`cell-${key - 1}`).value = puzzle_ques[key];
          document
            .getElementById(`cell-${key - 1}`)
            .classList.add("filled_cell");
        }
      }

      filldummy_arr(puzzle_ques);
    } else {
      alert("Something went wrong!");
      window.location.reload();
    }
  }

  const [output_arr, setoutput_arr] = useState();
  const [is_sudoku_solved, setis_sudoku_solved] = useState(false);

  function filldummy_arr(sudoku_puzzle) {
    var count = 1;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        dummy_arr[i][j] = sudoku_puzzle[count];

        count++;
      }
    }
   
    let output_arr = solve(dummy_arr);
  
    setoutput_arr(output_arr);
  }

  function display_solution() {
    if (output_arr !== undefined) {
      printsoduko_aftersolved(output_arr);
    }
  }

  function solve(_board) {
    // call the function sudukosolver to run the algorithm
    sudukoSolver(_board);
    // check for validity of suduko
    let f = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (_board[i][j] == "0") f = 1;
      }
    }
    if (f == 1) {
      let is_soduko_solved = false;
      setis_sudoku_solved(is_soduko_solved);
    }
    //print the suduko .
    else {
      let is_soduko_solved = true;
      setis_sudoku_solved(is_soduko_solved);

      return _board;
    }

    function isvalid(i, j, k, data) {
      // check for the row if contains duplicate
      for (let row = 0; row < 9; row++) {
        if (data[row][j] == k) return false;
      }
      // check for the column if contains duplicate
      for (let col = 0; col < 9; col++) {
        if (data[i][col] == k) return false;
      }
      // check for 3X3 grid
      let start_row = i - (i % 3);
      let start_col = j - (j % 3);
      for (let m = 0; m < 3; m++) {
        for (let n = 0; n < 3; n++) {
          if (data[m + start_row][n + start_col] == k) return false;
        }
      }
      return true;
    }
    function sudukoSolver(data) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (data[i][j] == "0") {
            for (let k = 1; k <= 9; k++) {
              if (isvalid(i, j, k, data)) {
                data[i][j] = `${k}`;
                if (sudukoSolver(data)) {
                  return true;
                } else {
                  data[i][j] = "0";
                }
              }
            }
            return false;
          }
        }
      }
      return true;
    }
  }

  function printsoduko_aftersolved(dummy_arr) {
    if (is_sudoku_solved) {
      for (var z = 0; z < 81; z++) {
        var id = `cell-${z}`;

        var cell = document.getElementById(id);

        cell.value = "";
      }
      var count_cell = 0;
      for (var x = 0; x < 9; x++) {
        for (var y = 0; y < 9; y++) {
          var fill_id = `cell-${count_cell}`;
          count_cell++;

          var empty_cell = document.getElementById(fill_id);

          empty_cell.value = dummy_arr[x][y];
        }
      }
    } else {
      alert("INVALID SUDOKU");
    }
  }

  return (
    <>
      <header>
        <div className="setup-Game" id="playground_header">
          <div id="difficulty_of_game">
            <h3>Difficulty : </h3>
            <div className="header-box">
              <input
                id="diff-easy"
                type="radio"
                name="difficulty"
                value="easy"
                defaultChecked={true}
                disabled={isdisabled}
                onClick={changelevel}
              />
              <label id="easy_label">Easy</label>

              <input
                id="diff-medium"
                type="radio"
                name="difficulty"
                value="medium"
                disabled={isdisabled}
                onClick={changelevel}
              />
              <label id="medium_label">Medium</label>

              <input
                id="diff-hard"
                type="radio"
                name="difficulty"
                value="hard"
                disabled={isdisabled}
                onClick={changelevel}
              />
              <label id="hard_label">Hard</label>
            </div>
          </div>

          <div id="time">
            <div className="header-box">
              <h3>Time : </h3>
              <input
                id="time-1"
                type="radio"
                name="time"
                value="5"
                defaultChecked={true}
                disabled={isdisabled}
                onClick={change_time}
              />
              <label id="time_lable_1">5 Min</label>
              <input
                id="time-2"
                type="radio"
                name="time"
                value="10"
                onClick={change_time}
                disabled={isdisabled}
              />
              <label id="time_lable_2">10 Min</label>
              <input
                id="time-3"
                type="radio"
                name="time"
                value="15"
                onClick={change_time}
                disabled={isdisabled}
              />
              <label id="time_lable_3">15 Min</label>
            </div>
          </div>

          <div id="theme">
            <div className="header-box">
              <h3>Theme: </h3>
              <input
                id="light-theme"
                type="radio"
                name="theme"
                value="light"
                disabled={false}
                onClick={change_theme}
              />
              <label>Light</label>

              <input
                id="dark-theme"
                type="radio"
                name="theme"
                value="dark"
                defaultChecked={true}
                onClick={change_theme}
                disabled={false}
              />
              <label>Dark</label>
            </div>
          </div>

          <div>
            <div>
              <button
                className="start_button"
                id="Game_start_btn"
                onClick={() => {
                  start_game();
                  scroll();
                }}
                disabled={isdisabled}
              >
                Start Game
              </button>
            </div>
            <div>
              <button
                className="start_button"
                id="Game_end_btn"
                onClick={quit_game}
              >
                End Game
              </button>
            </div>
          </div>
        </div>
      </header>
      <body className="Game-container" id="game_arena">
        <div id="stats" className="flex-gap">
          <div id="timer">
            Time: {time.m >= 10 ? time.m : "0" + time.m} ::{" "}
            {time.s >= 10 ? time.s : "0" + time.s}
          </div>
          <div id="lives">Live: {game_live}</div>
          <div id="lives">Total_Score: {Game_Score}</div>
        </div>

        <div id="game">
          <div id="board">
            <div>
              <table id="grid">
                {arr.map((items, row) => {
                  return (
                    <tr>
                      {items.map((cell_id, column) => {
                        return (
                          <td>
                            <input
                              id={`cell-${cell_id}`}
                              type="number"
                              className="blank_cell"
                              disabled={true}
                              onSelect={(e) => {
                                fill_the_cell(e, row, column);
                              }}
                              onChange={Restrict_input}
                              onfocus="blur()"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
          <div id="number-container" className="number_box">
            <p id="one" onClick={Select_number}>
              1
            </p>
            <p id="two" onClick={Select_number}>
              2
            </p>
            <p id="three" onClick={Select_number}>
              3
            </p>
            <p id="four" onClick={Select_number}>
              4
            </p>
            <p id="five" onClick={Select_number}>
              5
            </p>
            <p id="six" onClick={Select_number}>
              6
            </p>
            <p id="seven" onClick={Select_number}>
              7
            </p>
            <p id="eight" onClick={Select_number}>
              8
            </p>
            <p id="nine" onClick={Select_number}>
              9
            </p>
          </div>
          <div className="eraser_div">
            <button className="eraser" id="eraser" onClick={select_eraser}>
              Eraser
            </button>
          </div>
        </div>
        <div className="Game_result" id="game_result">
          <span>
            Game over : <b>{Game_result}</b>
          </span>
        </div>
        <div className="flex-gap">
          <div id="View-solution">
            <button
              className="view-solution"
              onClick={() => {
                display_solution();
              }}
            >
              View Solution
            </button>
          </div>
          <div id="new_game">
            <button className="new_game_btn" onClick={Reload_game}>
              Start new_game
            </button>
          </div>
        </div>
      </body>
    </>
  );
}

export default PlaySudoku;
