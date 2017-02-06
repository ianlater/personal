var madras = function( p ) {
  var resolution = 10;
  var mapToBranches = [];
  var branches = [];
  var maxBranches = 20;
  var degree = 3;
  var line = false;
  var toggle = false;
  var count = 0;
  var maxAge = 10;
  var goodcolor;

  p.setup = function() {
    goodcolor = [p.color("#000000"), p.color("#000000"), p.color("#000000"), p.color("#6b6556"), p.color("#a09c84"), p.color("#908b7c"), p.color("#79746e"), p.color("#755d35"), p.color("#937343"), p.color("#9c6b4b"), p.color("#ab8259"), p.color("#aa8a61"), p.color("#578375"), p.color("#f0f6f2"), p.color("#d0e0e5"), p.color("#d7e5ec"), p.color("#d3dfea"), p.color("#c2d7e7"), p.color("#a5c6e3"), p.color("#a6cbe6"), p.color("#adcbe5"), p.color("#77839d"), p.color("#d9d9b9"), p.color("#a9a978"), p.color("#727b5b"), p.color("#6b7c4b"), p.color("#546d3e"), p.color("#47472e"), p.color("#727b52"), p.color("#898a6a"), p.color("#919272"), p.color("#AC623b"), p.color("#cb6a33"), p.color("#9d5c30"), p.color("#843f2b"), p.color("#652c2a"), p.color("#7e372b"), p.color("#403229"), p.color("#47392b"), p.color("#3d2626"), p.color("#362c26"), p.color("#57392c"), p.color("#998a72"), p.color("#864d36"), p.color("#544732") ];
    p.createCanvas(1200, 600);
    refresh();
    manageLoading(this, p);
  };

  p.draw = function() {
    // p.background(255m, 255, 255, 50);
    for (index in branches) {
      branches[index].draw();
    }
  };

  p.mouseClicked = function() {
    toggle = !toggle;
    if (toggle) p.noLoop();
    else p.loop();
  };

  p.keyReleased = function() {
    if (p.key == ' '){
      p.setup();
    }
  }

  function refresh() {
    p.background(255);
    for (var x = 0; x < p.width*resolution;x++) {
      var col = [];
      for (var y = 0; y < p.height*resolution;y++){
        col[y] = null;
      }
      mapToBranches[x] = col;
    }
    branches = [];
    for (var i = 0; i < 3; i++){
      branches[i] = new Branch();
    }
  }
  function outOfBounds(point) {
    if (point.x < 0 || point.x > p.width || point.y < 0 || point.y > p.height) {
      return true;
    }
    return false;
  };

  var Branch = function() {
    this.id = count++;
    this.generation = 0;
    this.equation = function(x,y){
      return p.createVector(x,y).add(this.velocity);
    };
    this.velocity = p.createVector(1,1,.1).normalize().rotate(p.random(p.TWO_PI));
    this.position = p.createVector(p.randomGaussian(p.width/2, p.width), p.randomGaussian(p.height/2, p.height));
    this.color = p.color(0);
    var points = [];
    var brushStrokes = 40;
    var fillSide = p.randomGaussian() > 0 ? p.HALF_PI : -1 * p.HALF_PI;
    var strokeColor = goodcolor[p.floor(p.random(goodcolor.length))];

    this.draw = function(){
      var nextPoint = this.equation(this.position.x, this.position.y);
      if ((mapToBranches[p.floor(nextPoint.x)] && mapToBranches[p.floor(nextPoint.x)][p.floor(nextPoint.y)] && mapToBranches[p.floor(nextPoint.x)][p.floor(nextPoint.y)]!=this) || outOfBounds(nextPoint)) {
        this.die();
        if (branches.length < maxBranches)
          branches.push(new Branch());
        return;
      }
      mapToBranches[p.floor(nextPoint.x)][p.floor(nextPoint.y)] = this; //if steps are greater than single pixel, may need to interpolate between gaps
      points.push({position: nextPoint, velocity: this.velocity.copy()});
      this.brush();
      p.strokeWeight(1.5);
      p.stroke(this.color);
      p.point(nextPoint.x, nextPoint.y);
      this.position = nextPoint;
    };

    this.brush = function(){
      fillNormal = this.velocity.copy().rotate(fillSide).normalize();
      var bound;
      var brushLimit;
      bleed = p.randomGaussian(5,2);

      for(var i = 0; i < p.width + p.height; i++) {
        bound = this.position.copy().add(fillNormal.copy().mult(i));
        if (outOfBounds(bound) || (mapToBranches[p.floor(bound.x)][p.floor(bound.y)] && (mapToBranches[p.floor(bound.x)][p.floor(bound.y)] != this))) {
          brushLimit = p.abs(this.position.dist(bound)*p.randomGaussian(0)) + bleed;
          break;
        }
      }
      p.strokeWeight(.7);
      var increment = brushLimit/brushStrokes;
      for (var i =0; i<brushStrokes; i++) {
        fleck = this.position.copy().add(fillNormal.copy().mult((i*increment)));
        if (this.position.dist(fleck)>brushLimit) {
          continue;
        }
        p.stroke(p.red(strokeColor), p.green(strokeColor), p.blue(strokeColor), (p.pow(.01, i/brushStrokes))*255);
        p.point(fleck.x, fleck.y);
      }
    };

    this.die = function()  {
      for (var i = 0; i < p.random(4); i++) {
        if (this.generation < maxAge && points.length > 0) {
          var pivot = p.floor(p.randomGaussian(3));
          pivot = points.length - p.floor(points.length/pivot);
          pivot = pivot <= 0 ? 1 : pivot;
          branch = new Branch();
          while(!points[pivot]) {
            if (++pivot>=points.length){
              pivot = p.floor(points.length/2);
              break;
            }
          }
          branch.position = points[pivot].position;
          branch.velocity = points[pivot].velocity.rotate((p.randomGaussian() > .6 ? p.HALF_PI : -1 * p.HALF_PI));
          branch.generation = this.generation + 1;
          branches.push(branch);
        }
      }
      branches.splice(branches.indexOf(this),1);
    };
  };
};
var l = new p5(madras, 'madras');
