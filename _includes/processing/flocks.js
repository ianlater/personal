// save this file as sketch.js
var flock = [];

var s = function( p ) { // p could be any variable name
  var loop = false;
  p.setup = function() {
    p.createCanvas(900, 600);
    for (var i = 0; i<100; i++){
      flock.push(new Bird(p));
      flock[i].velocity = p.createVector(p.random(1,2), p.random(1,2));
      flock[i].position = p.createVector(p.random(p.width), p.random(p.height));
    }
    p.noLoop();
    p.frameRate(20);
  };

  p.draw = function() {
    p.background(20);
    for (index in flock) {
      flock[index].draw();
    }
  };
  p.mouseClicked = function() {
    this.toggle = !this.toggle;
    if (this.toggle) p.loop();
    else p.noLoop();
  };
};


function Bird(p5) {
  this.position = p5.createVector(0,0);
  this.velocity = p5.createVector(0,0);
  this.destination = p5.createVector(0,0);
  this.alpha = .05;//r/s
  this.speed = 5;
  this.length = 12;
  this.width = 3;
  this.viewRadiusSq = 500;
  this.maxforce =  .1;

  this.draw = function() {
    //rotationally accelerate velocity towards destination
    bearing = this.position.copy().sub(this.destination).normalize().mult(-1);
    acceleration = this.computeAlignment().add(this.computeCohesion()).add(this.computeSeparation().mult(2));
    // this.velocity.rotate(angleBetween(this.velocity, bearing)*this.alpha);
    this.velocity.add(acceleration).limit(this.speed);
    //calculate triangle at origin//
    heading = this.velocity.copy().normalize().mult(-1);
    base = heading.copy().mult(this.length);
    this.viewRadiusSq = base.copy().mult(3).magSq();
    left = p5.createVector(heading.y, -1 * heading.x).mult(this.width);
    right = left.copy().mult(-1);

    //wraparound
    this.wraparound();

    //translate everything to position //could use transform matrix which allows you to do eveything at the origin and simplifies math, but for 500 birds, that started to slow down
    left.add(base).add(this.position);
    right.add(base).add(this.position);
    step = this.velocity.copy().normalize().add(this.position);

    this.position.lerp(step.x, step.y, 0, this.velocity.mag());

    //render
    p5.stroke(230);
    p5.triangle(this.position.x, this.position.y,left.x, left.y, right.x, right.y);
    p5.stroke(255,0,0, 50);
    p5.line(p5.width/2 ,p5.height/2,this.position.x, this.position.y);

  };

  this.wraparound = function() {
    if (this.position.x < -this.length)  this.position.x = p5.width + this.length;
    if (this.position.y < -this.length)  this.position.y = p5.height + this.length;
    if (this.position.x > p5.width +this.length) this.position.x = -this.length;
    if (this.position.y > p5.height+this.length) this.position.y = -this.length;
  };

  this.computeAlignment = function() {
    var avgVel = p5.createVector();
    var neighbors = 0;
    for(index in flock) {
      bird = flock[index];
      if (bird != this){
        if (this.position.copy().sub(bird.position).magSq() < this.viewRadiusSq) {
          avgVel.add(bird.velocity);
          neighbors++;
        }
      }
    }
    return avgVel.div(neighbors).normalize().mult(this.speed).sub(this.velocity).limit(this.maxforce);
  };

  this.computeCohesion = function() {
    var cofm = p5.createVector();
    var neighbors = 0;
    for(index in flock) {
      bird = flock[index];
      if (bird != this){
        if (this.position.copy().sub(bird.position).magSq() < this.viewRadiusSq) {
          cofm.add(bird.position);
          neighbors++;
        }
      }
    }
    return cofm.div(neighbors).sub(this.position).normalize().mult(this.speed).sub(this.velocity).limit(this.maxforce);
  };

  this.computeSeparation = function() {
    var repel = p5.createVector();
    var neighbors = 0;
    for(index in flock) {
      bird = flock[index];
      if (bird != this){
        dist = this.position.copy().sub(bird.position).magSq();
        if (dist > 0 && dist < this.viewRadiusSq*.5) {
          repel.add(this.position.copy().sub(bird.position).normalize().div(dist));
          neighbors++;
        }
      }
    }
    repel.div(neighbors);
    return repel.normalize().mult(this.speed).sub(this.velocity).limit(this.maxforce);
  };
}

function angleBetween(v1, v2){
  return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
}
var myp5 = new p5(s, 'flocks');
