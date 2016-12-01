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
        intersect = false;
        seg = new Segment(source, p);
        for (i = 0; i < lines.length; i++) {
          if (segcross(seg,lines[i]) == 1) {
            intersect = true;
            break;
          }
        }
        if (!intersect) {
          seg.draw();
        }
    }
}

///////////////////////////
// Global Variables
///////////////////////////

var lines;
var src;


///////////////////////////
// Setup & Drawing
///////////////////////////

function setup() {
    // Canvas & Drawing Setup
    createCanvas(windowWidth, windowHeight);
    background(51);

    src = new Source();
    lines = [new Segment(new Point(100,100),new Point(50,150)),
             new Segment(new Point(50,150),new Point(50,200)),
             new Segment(new Point(50,200),new Point(100,250)),
             new Segment(new Point(100,250),new Point(150,250)),
             new Segment(new Point(150,250),new Point(200,200)),
             new Segment(new Point(200,200),new Point(200,150)),
             new Segment(new Point(200,150),new Point(150,100)),
             new Segment(new Point(150,100),new Point(100,100))];
}

function draw() {
    background(51);
    for (i = 0; i < lines.length; i++) {
      lines[i].draw();
    }
    drawRays(src);
}
