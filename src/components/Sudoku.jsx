import React from "react";
import { Link } from "react-router-dom";

function Sudoku() {
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

  const dummy_arr = new Array(9);

  for (var c = 0; c < dummy_arr.length; c++) {
    dummy_arr[c] = new Array(9).fill(0);
  }

  var row_no = -1;
  var column_no = -1;

  function fillSudoku(val) {
    var cell_value = val.target.value;

    const id = val.target.id;

    if (cell_value.length > 1) {
      val.target.value = cell_value.slice(0, 1);
    }
    if (cell_value <= 0) {
      val.target.value = "";
    }

    cell_value = cell_value.slice(0, 1);
    var element = document.getElementById(id);

    if (cell_value >= 1 && cell_value <= 9) {
      element.classList.remove("blank_cell");
      element.classList.add("filled_cell");

      if (row_no !== -1 && column_no !== -1) {
        dummy_arr[row_no][column_no] = cell_value;
      }
    }
  }

  var cell_id;
  function detectid(id) {
    cell_id = id;
  }

  function changecolor(event) {
    if (cell_id !== null && event.key === "Backspace") {
      var element = document.getElementById(cell_id);
      if (element !== null) {
        element.classList.remove("filled_cell");
        element.classList.add("blank_cell");
        if (row_no !== -1 && column_no !== -1) {
          dummy_arr[row_no][column_no] = 0;
        }
      }
    }
  }

  var is_soduko_solved = false;
  function Submitsudoku() {
    solvesoduko(dummy_arr);
  }

  function solvesoduko(dummy_arr) {
    // call the function sudukosolver to run the algorithm
    sudukoSolver(dummy_arr);
    // check for validity of suduko

    let f = 0;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (dummy_arr[i][j] == 0) f = 1;
      }
    }

    if (f == 1) {
    
      alert("PLEASE ENTER A VALID SUDUKO FORMAT (:");
    }
    //print the suduko .
    else {
      
     
      is_soduko_solved = true;
      printsoduko_aftersolved(dummy_arr);
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
          if (data[i][j] == 0) {
            for (let k = 1; k <= 9; k++) {
              if (isvalid(i, j, k, data)) {
                data[i][j] = k;
                if (sudukoSolver(data)) {
                  return true;
                } else {
                  data[i][j] = 0;
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

  function rowColumn(row, column) {
    row_no = row;
    column_no = column;
  }

  function printsoduko_aftersolved(dummy_arr) {
   
    if (is_soduko_solved) {
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
    }
  }

  return (
    <>
      <h2 className="heading">Sudoku board</h2>

      <div className="container">
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
                          onChange={fillSudoku}
                          className="blank_cell"
                          onClick={() => {
                            detectid(`cell-${cell_id}`);
                            rowColumn(row, column);
                          }}
                          onKeyDown={changecolor}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </table>
        </div>

        <div className="flex-gap">
          <div>
            <button
              className="solvebtn"
              onClick={() => {
                Submitsudoku();
              }}
            >
              Solve
            </button>
          </div>

          <div>
            <button className="scanbtn" id="sudoku_board">
              <Link to="/">Play sudoku</Link>
            </button>
          </div>

          {/* <div>
           
              {" "}
              <input type="file"  className = "upload-file"/>
           
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Sudoku;
