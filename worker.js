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

self.onmessage = function (e) {
  if (e.data !== undefined) {
    var { Grid } = e.data;
    const newGen = {};
    const newgrid = {}
    for (const key in Grid) {
      newgrid[key] = new Case(Grid[key].x, Grid[key].y, Grid[key].live)
    }
    Grid = newgrid
    for (const key in Grid) {
      if (Object.hasOwnProperty.call(Grid, key)) {
        const item = Grid[key];
        const Y = new Case(item.x, item.y);
        const around = item.around(Grid);
        Y.live = (around === 3) || (item.live === 1 && around === 2) ? 1 : 0;
        newGen[`x${item.x}y${item.y}`] = Y;
      }
    }
    self.postMessage(newGen);
  }
};
