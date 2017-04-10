var ripple = function(p, r = 20, c = 20, s = 60){
    var rows = r;
    var columns = c;
    var scl = s;
    var ar = [];
    var toggle = false;

    p.setup = function() {
      canvas = p.createCanvas(1200,600);
      console.log(canvas);
      // p.frameRate(20);
      rows = p.ceil(p.height/scl)+1;
      columns = p.ceil(p.width/scl)+1;
      ar = [];
      for (var y = 0; y < rows; y++) {
        var row = [];
        for (var x =0; x < columns; x++){
          row[x] = p.createVector(x*scl, y*scl);
        }
        ar[y] = row;
      }
      if(p.int(canvas.id().charAt(canvas.id().length-1)%2)==0) {
        toggle = true;
      }

      //for site purposes
      // manageLoading(this, p);
    }

  p.draw = function() {
    var speed = .7;
    ar.forEach(function(row) {
      row.forEach(function(point){
        var r = p.dist(p.mouseX, p.mouseY, point.x, point.y)-p.millis()*speed;
        point.z = p.sin(r/(p.TWO_PI*scl));
      });
    });
    p.clear();
    if (toggle)
      drawCircles();
    else
      drawTriangleStrip();
  };

  p.mouseClicked = function() {
    if (window.location.hash.substr(1) != this._userNode.id) {
      return;
    }
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
        toggle = !toggle;
    }
  }

  function drawCircles() {
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < columns; x++){
        var z = ar[y][x].z+1;
        p.fill(100*z-127, 100*z, 255 *z-127);
        // text(nf(sin(ar[y][x].z), 1, 2), ar[y][x].x, ar[y][x].y);
        var r = scl * (z+.18) * 1.5;
        p.ellipse(ar[y][x].x, ar[y][x].y, r, r);
      }
    }
  };

   function drawTriangleStrip() {
      for (var y = 0; y < rows - 1; y++) {
      p.beginShape(p.TRIANGLE_STRIP);
      for (var x = 0; x < columns; x++){
        v = ar[y][x];
        p.vertex(v.x, v.y, v.z);
        var z = ar[y][x].z+1;
        // fill(z*127);
        p.fill(255*z -127, 100*z, 100*z-127);
        v = ar[y+1][x];
        p.vertex(v.x, v.y, v.z);

      }
      p.endShape();
    }
  };
};
var l = new p5(ripple, 'ripple');
