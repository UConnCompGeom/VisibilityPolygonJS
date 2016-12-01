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
    for (p = 0; p < points.length; p++) {
        mypoint = points[p];
        intersect_seg = [];
        intersect_beyond = [];
        halfintersects_seg = 0;
        halfintersects_beyond = 0;
        seg = new Segment(source, mypoint);
        var edgePoint = null;

        for (i = 0; i < 4; i++) {
          border_intersect = intersection_on_border(seg,borders[i]);
          if (border_intersect.label != "null" && Math.abs(angle(source,mypoint,border_intersect)-3.14) < .01) {
            edgePoint = border_intersect;
          }
        }
        if (edgePoint == null) {for (i = 0; i < 4; i++) {
          border_intersect = intersection_on_border(seg,borders[i]);
          if (border_intersect != null && Math.abs(angle(source,mypoint,border_intersect)-3.14) < .01) {
            edgePoint = border_intersect;
          }
        }
        }
        beyond = new Segment(mypoint,edgePoint);

        for (i = 0; i < lines.length; i++) {
          intersection_value = segcross(seg,lines[i]);
          if (Math.abs(intersection_value) == 1) {
            intersect_seg.push(i);
          }
          if (Math.abs(intersection_value) == .5) {
            halfintersects_seg += intersection_value;
          }

          intersection_value = segcross(beyond,lines[i]);
          if (Math.abs(intersection_value) == 1) {
            intersect_beyond.push(i);
          }
          if (Math.abs(intersection_value) == .5) {
            halfintersects_beyond += intersection_value;
          }
        }
        if (intersect_seg.length == 0 && halfintersects_seg == 0) {
          seg.draw();
          if (intersect_beyond.length == 0 && halfintersects_beyond == 0) {
            beyond.draw();
          }
        }
    }
}

///////////////////////////
// Global Variables
///////////////////////////

var lines;
var points;
var borders;
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
             new Segment(new Point(150,100),new Point(100,100)),

             new Segment(new Point(300,300),new Point(250,350)),
             new Segment(new Point(300,300),new Point(350,350))];

    points = [];
    for (var p of pset) {
      points.push(p);
    }

    borders =
            [new Segment(new Point(0,0),new Point(0,windowHeight)),
             new Segment(new Point(0,windowHeight),new Point(windowWidth,windowHeight)),
             new Segment(new Point(windowWidth,windowHeight),new Point(windowWidth,0)),
             new Segment(new Point(windowWidth,0),new Point(0,0))];
}

function draw() {
    background(51);
    for (i = 0; i < lines.length; i++) {
      lines[i].draw();
    }
    drawRays(src);
}
