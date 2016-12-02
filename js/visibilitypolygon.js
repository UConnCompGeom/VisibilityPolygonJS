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
        half_intersects = {};
        half_intersects_at_end = {};
        intersect_beyond = null;
        intersect_beyond_distance = Infinity;
        halfintersects_seg = 0;
        halfintersects_beyond = 0;
        seg = new Segment(source, mypoint);
        var edgePoint = null;

        border_dist = Infinity;
        for (i = 0; i < 4; i++) {
          border_intersect = intersection_on_border(seg,borders[i]);
          if (border_intersect.label != "null" && distance(border_intersect,source) < border_dist && Math.abs(angle(source,mypoint,border_intersect) - 3.14) < .01) {
            edgePoint = border_intersect;
            border_dist = distance(border_intersect,source);
          }
        }

        beyond = new Segment(mypoint,edgePoint);

        for (i = 0; i < lines.length; i++) {
          intersection_value = segcross(seg,lines[i]);
          if (Math.abs(intersection_value) == 1) {
            intersect_seg.push(i);
          } else if (Math.abs(intersection_value) == .5) {
            if (ccw(source,mypoint,lines[i].p1) == 0) {
              intersected_vertex = lines[i].p1;
              other_vertex = lines[i].p2;
            } else {
              intersected_vertex = lines[i].p2;
              other_vertex = lines[i].p1;
            }
            if (half_intersects[intersected_vertex] == null) {
              half_intersects[intersected_vertex] = new HalfIntersect();
            }
            half_intersects[intersected_vertex].PositiveCCW = (half_intersects[intersected_vertex].PositiveCCW) || ccw(source,mypoint,other_vertex) == 1;
            half_intersects[intersected_vertex].NegativeCCW = (half_intersects[intersected_vertex].NegativeCCW) || ccw(source,mypoint,other_vertex) == -1;
          } else if (Math.abs(intersection_value) == .25) {
            if (ccw(source,mypoint,lines[i].p1) == 0) {
              intersected_vertex = lines[i].p1;
              other_vertex = lines[i].p2;
            } else {
              intersected_vertex = lines[i].p2;
              other_vertex = lines[i].p1;
            }
            if (half_intersects_at_end[intersected_vertex] == null) {
              half_intersects_at_end[intersected_vertex] = new HalfIntersect();
            }
            half_intersects_at_end[intersected_vertex].PositiveCCW = (half_intersects_at_end[intersected_vertex].PositiveCCW) || ccw(source,mypoint,other_vertex) == 1;
            half_intersects_at_end[intersected_vertex].NegativeCCW = (half_intersects_at_end[intersected_vertex].NegativeCCW) || ccw(source,mypoint,other_vertex) == -1;
          }

          intersection_value = segcross(beyond,lines[i]);
          if (Math.abs(intersection_value) == 1) {
            intersection_point = intersection_two_segments(beyond,lines[i]);
            beyond_dist = distance(mypoint,intersection_point);

            if (beyond_dist < intersect_beyond_distance) {
              intersect_beyond = intersection_point;
              intersect_beyond_distance = beyond_dist;
            }
          }
          if (Math.abs(intersection_value) == .5) {
            halfintersects_beyond += intersection_value;
          }
        }
        intersected_through_vertex = false;
        for (var key in half_intersects) {
          if (half_intersects[key].PositiveCCW && half_intersects[key].NegativeCCW) {
            intersected_through_vertex = true;
            break;
          }
        }
        intersected_at_vertex = false;
        for (var key in half_intersects_at_end) {
          if (half_intersects_at_end[key].PositiveCCW && half_intersects_at_end[key].NegativeCCW) {
            intersected_at_vertex = true;
            break;
          }
        }
        if (intersect_seg.length == 0 && !intersected_through_vertex) {
          seg.draw();
          if (intersect_beyond_distance == Infinity && !intersected_at_vertex) {
            beyond.draw();
          } else if (!intersected_at_vertex) {
            beyond = new Segment(mypoint,intersect_beyond);
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
