var polar = function( p ) {
  var theta = p.HALF_PI;
  var nodes = 8;
  var degree = 3;
  var line = false;
  var me;
  p.setup = function() {
    p.createCanvas(900, 600);
    manageLoading(this, p);
    me = this;
  };

  p.draw = function() {
    p.background(255, 255, 255, 50);
    p.translate(p.width/2, p.height/2);
    for (var i = 0; i < nodes % 9 + 1; i ++){
      c = 10*theta % 80;
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

  p.mouseClicked = function() {
    nodes++;
  };

  p.keyReleased = function() {
    if (window.location.hash.substr(1) != me._userNode.id) {
      return;
    }
    if (p.key == ' '){
      line = !line;
    }
  }

  p.mouseWheel = function(e) {
    degree += e.delta > 0 ? 1 : -1;
    degree = degree > 10 ? 10 : degree;
    degree = degree <= 0 ? 1 : degree;
  }

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
