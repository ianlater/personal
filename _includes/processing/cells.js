'use strict'
var created = 0;
var goodcolor;
var pixelated = false;
var s = function( p ) {
  var grid = [];
  var locality = 2;
  var threshold = 3;
  var types = 7;
  var scl = 5;
  var neumann = true;
  var button, toggleNeumann, localitySlider, thresholdSlider, nSlider, toggleDrawTypeButton;

  p.setup = function() {
    var canvas = p.createCanvas(400,400, 'WEBGL');

    localitySlider = p.createSlider(1, 4, locality);
    thresholdSlider = p.createSlider(1, 5, threshold);
    nSlider = p.createSlider(1, 14, types);
    canvas.parent().append(localitySlider.elt);
    canvas.parent().appendChild(thresholdSlider.elt);
    canvas.parent().appendChild(thresholdSlider.elt);

    applyLabel("locality", localitySlider);
    applyLabel("threshold", thresholdSlider);
    applyLabel("types", nSlider);

    toggleNeumann = p.createButton('Neumann/Moore');
    toggleNeumann.mousePressed(function(){neumann = !neumann;})
    applyLabel("neighborhood type: ", toggleNeumann);
    button = p.createButton('submit');
    button.mousePressed(refresh);
    applyLabel("", button);

    toggleDrawTypeButton = p.createButton('Display Type');
    toggleDrawTypeButton.mousePressed(function(){pixelated = !pixelated;})

    $("#cells label").appendTo("#input_cells");
    $("input").change(function(){$("#console").innerHTML = this.value;console.log(this.value);});

    goodcolor = [p.color("#F94A43"),p.color("#F66B44"),p.color("#F48A45"),p.color("#F1A846"),p.color("#EFC547"),p.color("#EDE148"),p.color("#D9EA49"),p.color("#BBE84A"),p.color("#9FE54B"),p.color("#83E34C"),p.color("#69E14D"),p.color("#50DE4E"),p.color("#4FDC66"),p.color("#50D97F"),p.color("#50D796"),p.color("#51D5AD"),p.color("#52D2C2"),p.color("#52CAD0"),p.color("#53B2CD"),p.color("#549BCB"),p.color("#5485C9"),p.color("#5570C6"),p.color("#555CC4"),p.color("#6156C2")];

    initGrid();
    assignNeighbors();
    p.pixelDensity(1);
  };

  p.draw = function() {
    for (var x = 0; x < grid.length; x++) {
      for (var y = 0; y < grid[x].length; y++) {
        grid[x][y].update();
      }
    }
    if (pixelated) {
      drawByPixel();
    }
  };

  function drawByPixel() {
    p.loadPixels();
    var d = p.pixelDensity();
    var frame = 4 * p.width  * p.height * d * d ;
    for (var i = 0; i < frame; i+=4) {
      var x = p.int((i/(4*d*d))%(p.width));
      var y = p.int((i/(4*d*d))/(p.width));
      x = p.floor(p.map(x, 0, p.width, 0, p.width/scl));
      y = p.floor(p.map(y, 0, p.height, 0, p.height/scl));
      y = y >= grid[x].length ? grid[x].length-1 : y;
      if (!grid[x][y]){
        console.log(i, x,y,p.height, p.width, grid[x]);p.noLoop();return;
      }
      p.pixels[i] = p.red(grid[x][y].color);
      p.pixels[i+1] = p.green(grid[x][y].color);
      p.pixels[i+2] = p.blue(grid[x][y].color);
      p.pixels[i+3] = 165;
    }
    p.updatePixels();
  };

  function applyLabel(text, element) {
    var label = document.createElement("LABEL");
    element.parent().appendChild(label);
    label.appendChild(document.createTextNode(text));
    label.appendChild(element.elt);
  };

  function refresh() {
    locality = localitySlider.value();
    threshold = thresholdSlider.value();
    types = nSlider.value();
    console.log("locality: " + locality, "threshold: " + threshold, "types: " + types, "neumann: " + (neumann ? "true" : "false"));
    for (var x in grid) {
      for (var y in grid[x]){
        grid[x][y] = null;
      }
    }
    initGrid();
    assignNeighbors();
  };

  function initGrid() {
    grid = [];
    for (var x = 0; x < p.floor(p.width/scl); x++) {
      var column = [];
      for (var y = 0; y < p.floor(p.height/scl); y++) {
        created++;
        var blob = new Blob(p, types, threshold, scl);
        blob.position = p.createVector(x*scl, y*scl);
        column[y] = blob;

      }
      grid[x] = column;
    }
  };

  function assignNeighbors(){
    for (var col = 0; col < grid.length; col++) {
      for (var row = 0; row < grid[col].length; row++) {
        grid[col][row].neighbors = [];
        for (var xoff = -1 * locality; xoff <= locality; xoff++) {
          var ylim = locality;
          if (neumann) ylim -= p.abs(xoff);
          for (var yoff = -1 * ylim; yoff <= ylim; yoff++) {
            //wraparound
            var x = col+xoff < 0 ? grid.length - p.abs(col+xoff) : col+xoff;
            var y = row+yoff < 0 ? grid[col].length - p.abs(row+yoff) : row+yoff;
            if (x >= grid.length) x -= grid.length;
            if (y >= grid[col].length) y -= grid[col].length;
            grid[col][row].addNeighbor(grid[x][y]);
          }
        }
      }
    }
  };
};

function Blob (p, types = 8, threshold = 1, scl = 1) {
  this.type = p.floor(p.random(types));
  this.nextType = this.type;
  this.threshold = threshold;
  this.neighbors = [];
  this.position = p.createVector(0,0);
  this.r = 1;
  this.color;

  this.update = function() {
    this.type = this.nextType;
    this.considerNeighbors();
    this.render();
  };

  this.render = function() {
    var i = p.floor(p.map(this.type, 0, types, 0, goodcolor.length - 1));
    this.color = goodcolor[i];
    if (!pixelated){
      p.stroke(this.color);
      p.strokeWeight(this.r*scl);
      p.point(this.position.x, this.position.y);
    }
  };

  this.addNeighbor = function(neighbor) {
    this.neighbors.push(neighbor);
    neighbor.neighbors.push(this);
  };

  this.considerNeighbors = function(){
    var count = 0;
    for (var index in this.neighbors) {
      var neighbor = this.neighbors[index];
      var diff = p.int(this.type - neighbor.type);
      if (diff == 1 || diff == (1 - types)) {
        count++;
        if (count >= this.threshold){
           this.eatenBy(neighbor);
           break;
         }
      }
    }
  };

  this.eatenBy = function(neighbor) {
    this.nextType = neighbor.type;
  };
};

var myp5 = new p5(s, 'cells');
