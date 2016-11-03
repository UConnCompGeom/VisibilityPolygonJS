//////////////////////////////
// Global Variables
//////////////////////////////

var pset = new Set();
var eset = new Set();

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
    noStroke();
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

function det(v1, v2) {
    return (v1.x * v2.y) - (v2.x * v1.y);
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
