var cavas;
var rows = 20;
var columns = 20;
var scl = 30;
var matrix = new Matrix(rows, columns, scl);

function setup() {
  canvas = createCanvas(800,  360);
  canvas.parent('mainCanvasContainer');

  console.log(matrix);
}

function draw() {
  matrix.jitter();
  matrix.draw();
}

function mouseClicked() {
  matrix = new Matrix(rows, columns, scl);
}
