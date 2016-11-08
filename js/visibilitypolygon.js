///////////////////////////
// Classes
///////////////////////////

/*
Inherits from Point
*/
function Source() {
    this.color = color('blue');
    this.x = mouseX;
    this.y = mouseY;
}

Source.prototype = Object.create(Point.prototype);

Source.prototype.draw = function() {
    // Point.prototype.draw.call(this);  // TODO: Why Doesn't this work?
    push();
    noStroke();
    fill(this.color);
    this.x = mouseX;
    this.y = mouseY;
    ellipse(this.x, this.y, 10);
    pop();
};

// TODO: Make more efficient (i.e. stop re-drawing the source every iteration)
// TODO: Don't draw raws the intersect other segments
function drawRays(source) {
    for (var p of pset) {
        seg = new Segment(source, p);
        seg.draw();
    }
}

///////////////////////////
// Global Variables
///////////////////////////

var polygon;
var src;


///////////////////////////
// Setup & Drawing
///////////////////////////

function setup() {
    // Canvas & Drawing Setup
    createCanvas(windowWidth, windowHeight);
    background(51);

    src = new Source();
    polygon = new Polygon([new Point(100, 100), new Point(50, 150),
                           new Point(50, 200), new Point(100, 250),
                           new Point(150, 250), new Point(200, 200),
                           new Point(200, 150), new Point(150, 100)]);
}

function draw() {
    background(51);
    polygon.draw();
    drawRays(src);
}
