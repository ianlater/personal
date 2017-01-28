// save this file as sketch.js
var flock = [];

var s = function( p ) { // p could be any variable name
  var loop = false;
  p.setup = function() {
    p.createCanvas(900, 600);
    for (var i = 0; i<150; i++){
      flock.push(new Bird(p));
      flock[i].velocity = p5.Vector.random2D();
      flock[i].position = p5.Vector.random2D().mult(p.random(p.width));
    }
    p.noLoop();
    p.fill(180,180,220);
  };

  p.draw = function() {
    p.background(20);
    processFlocking(flock);
    for (index in flock) {
      // flock[index].destination.set(p.mouseX, p.mouseY);
      flock[index].draw();
    }
  };
  p.mouseClicked = function() {
    this.toggle = !this.toggle;
    if (this.toggle) p.loop();
    else p.noLoop();
  };
};

function processFlocking(flock) {
  for (index in flock) {
    for (var i = index; i < flock.length; i++) {
      flock[index].relateAlignment(flock[i]);
      flock[i].relateAlignment(flock[index]);

      flock[index].relateCohesion(flock[i]);
      flock[i].relateCohesion(flock[index]);

      flock[index].relateSeparation(flock[i]);
      flock[i].relateSeparation(flock[index]);
    }
  }
}

function Bird(p) {
   function steerComponent(){
    this.vector = p.createVector();
    this.neighbors = 0;
  };
  this.position = p.createVector(0,0);
  this.velocity = p.createVector(0,0);
  this.destination = p.createVector(0,0);
  this.alpha = .05;//r/s
  this.terminalspeed = 6;
  this.length = 12;
  this.width = 4;
  this.viewRadiusSq = 400;
  this.maxforce =  .2;
  this.acceleration;
  this.alignment = new steerComponent();
  this.cohesion = new steerComponent();
  this.separation = new steerComponent();

  this.draw = function() {
    //rotationally accelerate velocity towards destination
    bearing = this.position.copy().sub(this.destination).normalize().mult(-1);
    //compute steer
    this.acceleration = this.computeAcceleration();
    //reset steer components
    this.alignment = new steerComponent();
    this.cohesion = new steerComponent();
    this.separation = new steerComponent();
    // this.velocity.rotate(p5.Vector.angleBetween(this.velocity, bearing)*this.alpha);

    //accelerate velocity
    this.velocity.add(this.acceleration).limit(this.terminalspeed);

    //calculate triangle at origin//
    heading = this.velocity.copy().normalize().mult(-1);
    base = heading.copy().mult(this.length);
    this.viewRadiusSq = base.copy().mult(3).magSq();
    left = p.createVector(heading.y, -1 * heading.x).mult(this.width);
    right = left.copy().mult(-1);

    //wraparound
    this.wraparound();

    //translate everything to position //could use transform matrix which allows you to do eveything at the origin and simplifies math, but for 500 birds, that started to slow down
    left.add(base).add(this.position);
    right.add(base).add(this.position);
    step = this.velocity.copy().normalize().add(this.position);

    this.position.lerp(step.x, step.y, 0, this.velocity.mag());

    //render
    p.stroke(220);
    // p.fill(180,180,220);
    p.triangle(this.position.x, this.position.y,left.x, left.y, right.x, right.y);
    p.stroke(255,0,0, 50);
    p.line(p.width/2 ,p.height/2,this.position.x, this.position.y);

  };

  this.wraparound = function() {
    if (this.position.x < -this.length)  this.position.x = p.width + this.length;
    if (this.position.y < -this.length)  this.position.y = p.height + this.length;
    if (this.position.x > p.width +this.length) this.position.x = -this.length;
    if (this.position.y > p.height+this.length) this.position.y = -this.length;
  };

  this.computeAcceleration = function() {
    return this.computeAlignment().mult(1).add(this.computeCohesion()).mult(1).add(this.computeSeparation().mult(1.5));
  }

  this.relateAlignment = function(bird) {
    if (this.position.copy().sub(bird.position).magSq() < this.viewRadiusSq) {
      this.alignment.vector.add(bird.velocity);
      this.alignment.neighbors++;
    }
  };

  this.computeAlignment = function() {
    return this.alignment.vector.div(this.alignment.neighbors).normalize().mult(this.terminalspeed).sub(this.velocity).limit(this.maxforce);
  };

  this.relateCohesion = function(bird) {
    if (this.position.copy().sub(bird.position).magSq() < this.viewRadiusSq) {
        this.cohesion.vector.add(bird.position);
        this.cohesion.neighbors++;
      }
  };

  this.computeCohesion = function() {
    return this.cohesion.vector.div(this.cohesion.neighbors).sub(this.position).normalize().mult(this.terminalspeed).sub(this.velocity).limit(this.maxforce);
  };

  this.relateSeparation = function(bird) {
    dist = this.position.copy().sub(bird.position).mag();
    if (dist > 0 && dist*dist < this.viewRadiusSq*.5) {
        this.separation.vector.add(this.position.copy().sub(bird.position).normalize().div(dist));
        this.separation.neighbors++;
      }
  };

  this.computeSeparation = function() {
    return this.separation.vector.div(this.separation.neighbors).normalize().mult(this.terminalspeed).sub(this.velocity).limit(this.maxforce);
  };
};

var myp5 = new p5(s, 'flocks');
