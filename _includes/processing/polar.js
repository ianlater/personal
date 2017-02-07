var polar = function( p ) {
  var theta = p.HALF_PI;
  var nodes = 8;
  var degree = 3;
  var line = false;
  var me, degreeSlider;
  p.setup = function() {
    degreeSlider = p.createSlider(0,10,3);
    p.createButton("Line").mousePressed(function(){line = !line;});
    p.createButton("Nodes").mousePressed(function(){nodes++;});
    p.createCanvas(600, 600);
    manageLoading(this, p);
    me = this;
  };

  p.draw = function() {
    degree = degreeSlider.value();
    p.background(255, 255, 255, 50);
    p.translate(p.width/2, p.height/2);
    for (var i = 0; i < nodes % 9 + 1; i ++){
      c = 100*theta % 80;
      p.stroke(p.random(c), 40+p.random(c), p.random(35 + c));
      p.strokeWeight(10);
      if (line)
        p.line(x(theta + i), y(theta + i), x(theta + i + 1),y(theta + i + 1));
      else {
        p.point(x(theta-i), y(theta-i));
      }
    }
    theta += 0.01;
  };

  x = function(theta){
    return r(theta) * p.cos(theta);
  };

  y = function(theta) {
    return r(theta) * p.sin(theta);
  };

  r = function(theta) {
    return 250 * p.cos(degree*theta);
  };
};

var myp5 = new p5(polar, 'polar');
