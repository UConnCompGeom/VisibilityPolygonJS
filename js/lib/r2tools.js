//////////////////////////////
// Global Variables
//////////////////////////////

var pset = new Set();
var eset = new Set();


///////////////////////////////
// Classes
///////////////////////////////

function Point(x, y, label="") {
    this.x = x;
    this.y = y;
    this.color = color(255, 255, 255);
    this.label = label;
    pset.add(this);
};

Point.prototype.draw = function() {
    push();
    fill(this.color);
    noStroke();
    var size = 6;
    ellipse(this.x, this.y, size, size);

    fill("white");
    var offset = 5;
    text(this.label, this.x+offset, this.y+offset);
    pop();
};

function Segment(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.color = color(255, 255, 255);
    eset.add(this);
}

Segment.prototype.draw = function() {
    push();
    fill(this.color);
	stroke(this.color);
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    this.p1.draw();
    this.p2.draw();
    pop();
};

function Vector(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.x = p2.x - p1.x;
    this.y = p2.y - p1.y;
    this.color = color(255, 255, 255);
}

Vector.prototype.draw = function() {
    push();
    fill(this.color);
    noStroke();
    this.p1.draw();
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    var size = 6;
    this.p2.draw();
    pop();
};


///////////////////////////////
// Functions
///////////////////////////////

function basic_det(a,b,c,d) {
  return (a * d) - (b * c);
}

function det(v1, v2) {
    return basic_det(v1.x,v1.y,v2.x,v2.y);
}

function projected_det(v1,v2,v3) {
  return v1.x * (v2.y - v3.y) - v1.y * (v2.x - v3.x) + (v2.x * v3.y - v2.y * v3.x);
}

function sign(num) {
    if (num > 0) {
        return 1;
    } else if (num < 0) {
        return -1;
    } else {
        return 0;
    }
}

/*
a b c are Points
Counter-clockwise 1
Clockwise -1
Collinear 0
*/
function ccw(a, b, c) {
    var v1 = new Vector(a, b);
    var v2 = new Vector(a, c);
    return sign(det(v1, v2)) * -1;
}

/*
If above or below a line segment
segment is a Segment
x is a Point
*/
function linesidetest(segment, x) {
    return ccw(segment.p1, segment.p2, x);
}


/*
Given the points of two line sigments, we can determine if they intersect
a & b: line 1
c & d: line 2
*/
function cross(a, b, c, d) {
    return ((ccw(a,b,c) - ccw(a,b,d)) * (ccw(c,d,a) - ccw(c,d,b)))/4;
}

function segcross(seg1, seg2) {
    return cross(seg1.p1, seg1.p2, seg2.p1, seg2.p2);
}

function intersection_on_border(seg, border) {
  if (border.p1.x == border.p2.x) {
    if (Math.abs(seg.p1.x - seg.p2.x) < .0001) {
      return new Point(0,0,"null");
    }
    m = (seg.p2.y - seg.p1.y)/(seg.p2.x - seg.p1.x);
    b = seg.p1.y - m * seg.p1.x;

    return new Point(border.p1.x,m*border.p1.x + b);
  } else {
    if (Math.abs(seg.p1.y - seg.p2.y) < .0001) {
      return new Point(0,0,"null");
    }
    if (Math.abs(seg.p1.x - seg.p2.x) < .0001) {
      return new Point(seg.p1.x,border.p1.y);
    }
    m = (seg.p2.y - seg.p1.y)/(seg.p2.x - seg.p1.x);
    b = seg.p1.y - m * seg.p1.x;

    return new Point((border.p1.y-b)/m,border.p1.y);
  }
}

function angle(a,b,c) {
    var ab = Math.sqrt(Math.pow(b.x-a.x,2)+ Math.pow(b.y-a.y,2));    
    var bc = Math.sqrt(Math.pow(b.x-c.x,2)+ Math.pow(b.y-c.y,2)); 
    var ac = Math.sqrt(Math.pow(c.x-a.x,2)+ Math.pow(c.y-a.y,2));
    val = (bc*bc+ab*ab-ac*ac)/(2*bc*ab);
    if (Math.abs(1-val) < .001) {
      val = 1;
    }
    if (Math.abs(-1-val) < .001) {
      val = -1;
    }
    return Math.acos(val);
}
