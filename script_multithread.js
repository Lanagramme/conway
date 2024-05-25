class Case {
  constructor(x, y, live) {
    this.x = x;
    this.y = y;
    this.live = live ? live : 0;
  }

  update() {
    this.live = this.live === 0 ? 1 : 0;
  }

  around(Grid) {
    let voisins = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx !== 0 || dy !== 0) {
          const neighbor = Grid[`x${this.x + dx}y${this.y + dy}`];
          if (neighbor) voisins += neighbor.live;
        }
      }
    }
    return voisins;
  }
}

let Grid, Ogrid
let Speed = 3
let running  = false;
let button = document.querySelector('#btn-stop')

function coord(x, y) { return `x${x}y${y}`; }

function create_grid(nb_col, nb_row) {
  const html_grid = document.getElementById("grid");
  html_grid.innerText=""
  const grid = {};

  for (let row = 0; row < nb_row; row++) {
    const html_row = document.createElement("div");
    html_row.className = "brow";
    for (let col = 0; col < nb_col; col++) {
      const block = new Case(col, row);
      grid[coord(col, row)] = block;

      const html_case = document.createElement("div");
      html_case.className = `bcase x${col} y${row}`;
      html_row.appendChild(html_case);
    }
    html_grid.appendChild(html_row);
  }
 let cases = document.querySelectorAll('.bcase')
  cases.forEach( x => {
    x.addEventListener( "click", function(){
        let Case = Grid[this.classList[1]+this.classList[2]]
        Case.update()
        update_Case(Case)
      } 
    )
  })

  return grid;
}

function update_Case(case_to_update) {
  const html_case = document.querySelector(`.x${case_to_update.x}.y${case_to_update.y}`);
  html_case.classList.remove("dead", "alive");
  html_case.classList.add(case_to_update.live === 1 ? "alive" : "dead");
}

function update_Grid(Grid) {
  for (const key in Grid)
    if (Object.hasOwnProperty.call(Grid, key))
      update_Case(Grid[key]);
}

function turn() {
  const worker = new Worker('worker.js');
  worker.postMessage({ Grid });

  worker.onmessage = function (e) {
    const newGen = e.data;
    const newGrid = {}
    for (const key in newGen)
      newGrid[key] = new Case(newGen[key].x, newGen[key].y, newGen[key].live)
    update_Grid(newGrid);
    Grid = newGrid;
  };
}


function run(){
  running =!running
  if (running) button.innerText = "Pause"
  else button.innerText = "Start"
}

function save(){
  Ogrid = Grid
}

function reset() {
  Grid = Ogrid
  update_Grid(Grid)
  running = false
  button.innerText = "Start"
}


function newGame(){
  Grid = create_grid(100,100) 
  running = false
  save()
  button.innerText = "Start"
}

newGame()
setInterval(function () {
  if (running) turn();
}, 1000 / Speed);


