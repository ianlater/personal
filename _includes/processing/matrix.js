var Matrix = function(p, rows = 0, columns = 0, scl = 0){
  this.rows = rows;
  this.columns = columns;
  this.scl = scl;
  this.ar = [];
  for (var y = 0; y < this.rows; y++) {
    var row = [];
    for (var x =0; x < this.columns; x++){
      row[x] = p.createVector(x*scl, y*scl);
    }
    this.ar[y] = row;
  }

  this.get = function(row, column) {
    return this.ar[row][column];
  };

  this.vertex = function(row, column) {
    v = this.ar[row][column];
    vertex(v.x, v.y, v.z);
  };

  this.draw = function() {
    for (var y = 0; y < this.rows - 1; y++) {
      beginShape(TRIANGLE_STRIP);
      for (var x = 0; x < this.columns; x++){
        matrix.vertex(y, x);
        matrix.vertex(y+1, x);
      }
      endShape();
    }
  };

  this.jitter = function(lowerBound = -1, upperBound = 1) {
    this.ar.forEach(function(row) {
      row.forEach(function(point){
        point.x += random(lowerBound, upperBound);
        point.y += random(lowerBound, upperBound);
      });
    });
  };
}
