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
};

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

function addBorderLines() {
  for (b = 0; b < borderPoints.length; b++) {
    intersected = false;
    for (i = 0; i < lines.length; i++) {
      intersection_value = cross(src,borderPoints[b],lines[i].p1,lines[i].p2);
      if (Math.abs(intersection_value) != 0) {
        intersected = true;
        break;
      }
    }
    if (!intersected) {
      addPointToOrdering(borderPoints[b]);
    }
  }
};

function pointLessThan(a,b) {
//We always add the beyond point after the closer point, but need to figure out which one should come first.
  for (var key in sameLine[a.x + " " + a.y]) {
    if (sameLine[a.x + " " + a.y][key] == b) {
      for (var e in lines) {
        if (lines[e].p1 == a) {
          x = lines[e].p2;
          if (ccw(src,a,x) == 1) {
            return false;
          } else if(ccw(src,a,x) == -1) {
            return true;
          }
        } else if (lines[e].p2 == a) {
          x = lines[e].p1;
          if (ccw(src,a,x) == 1) {
            return false;
          } else if(ccw(src,a,x) == -1) {
            return true;
          }
        }
      }
    }
  }

  if (a.x - src.x >= 0 && b.x - src.x < 0) {
    return true;
  } else if (a.x - src.x < 0 && b.x - src.x >= 0) {
    return false;
  } else if (a.x - src.x == 0 && b.x - src.x  == 0) {
    if (a.y - src.y >= 0 || b.y - src.y >= 0) {
      return a.y > b.y;
    }
    return b.y > a.y;
  }

  determ = (a.x - src.x) * (b.y - src.y) - (b.x - src.x) * (a.y - src.y);
  if (determ < 0) {
    return true;
  } else if (determ > 0) {
    return false;
  }
};

function addPointToOrdering(p) {
  for (i = 0; i < point_order.length; i++) {
    if (pointLessThan(point_order[i],p)) {
      point_order.splice(i,0,p);
      return;
    }
  }
  point_order.push(p);
};

// TODO: Make more efficient (i.e. stop re-drawing the source every iteration)
// TODO: Don't draw raws the intersect other segments
function drawRays(source) {
    for (p = 0; p < points.length; p++) {
        mypoint = points[p];
        intersect_seg = [];
        seg_half_intersects = {};
        seg_half_intersects_at_end = {};
        beyond_half_intersects = {};
        intersect_beyond = null;
        intersect_beyond_distance = Infinity;
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
            if (seg_half_intersects[intersected_vertex] == null) {
              seg_half_intersects[intersected_vertex] = new HalfIntersect(intersected_vertex);
            }
            seg_half_intersects[intersected_vertex].PositiveCCW = (seg_half_intersects[intersected_vertex].PositiveCCW) || ccw(source,mypoint,other_vertex) == 1;
            seg_half_intersects[intersected_vertex].NegativeCCW = (seg_half_intersects[intersected_vertex].NegativeCCW) || ccw(source,mypoint,other_vertex) == -1;
          } else if (Math.abs(intersection_value) == .25) {
            if (ccw(source,mypoint,lines[i].p1) == 0) {
              intersected_vertex = lines[i].p1;
              other_vertex = lines[i].p2;
            } else {
              intersected_vertex = lines[i].p2;
              other_vertex = lines[i].p1;
            }
            if (seg_half_intersects_at_end[intersected_vertex] == null) {
              seg_half_intersects_at_end[intersected_vertex] = new HalfIntersect(intersected_vertex);
            }
            seg_half_intersects_at_end[intersected_vertex].PositiveCCW = (seg_half_intersects_at_end[intersected_vertex].PositiveCCW) || ccw(source,mypoint,other_vertex) == 1;
            seg_half_intersects_at_end[intersected_vertex].NegativeCCW = (seg_half_intersects_at_end[intersected_vertex].NegativeCCW) || ccw(source,mypoint,other_vertex) == -1;
          }

          intersection_value = segcross(beyond,lines[i]);
          if (Math.abs(intersection_value) == 1) {
            intersection_point = intersection_two_segments(beyond,lines[i]);
            beyond_dist = distance(mypoint,intersection_point);

            if (beyond_dist < intersect_beyond_distance) {
              intersect_beyond = intersection_point;
              intersect_beyond_distance = beyond_dist;
            }
          } else if (Math.abs(intersection_value) == .5) {
            if (ccw(source,mypoint,lines[i].p1) == 0) {
              intersected_vertex = lines[i].p1;
              other_vertex = lines[i].p2;
            } else {
              intersected_vertex = lines[i].p2;
              other_vertex = lines[i].p1;
            }
            if (beyond_half_intersects[intersected_vertex] == null) {
              beyond_half_intersects[intersected_vertex] = new HalfIntersect(intersected_vertex);
            }
            beyond_half_intersects[intersected_vertex].PositiveCCW = (beyond_half_intersects[intersected_vertex].PositiveCCW) || ccw(source,mypoint,other_vertex) == 1;
            beyond_half_intersects[intersected_vertex].NegativeCCW = (beyond_half_intersects[intersected_vertex].NegativeCCW) || ccw(source,mypoint,other_vertex) == -1;
          }
        }
        seg_intersected_through_vertex = false;
        for (var key in seg_half_intersects) {
          if (seg_half_intersects[key].PositiveCCW && seg_half_intersects[key].NegativeCCW) {
            seg_intersected_through_vertex = true;
            break;
          }
        }
        seg_intersected_at_vertex = false;
        for (var key in seg_half_intersects_at_end) {
          if (seg_half_intersects_at_end[key].PositiveCCW && seg_half_intersects_at_end[key].NegativeCCW) {
            seg_intersected_at_vertex = true;
            break;
          }
        }

        beyond_intersected_through_vertex = false;
        for (var key in beyond_half_intersects) {
          if (beyond_half_intersects[key].PositiveCCW && beyond_half_intersects[key].NegativeCCW) {
            point_dist = distance(mypoint,beyond_half_intersects[key].Point);
            if (point_dist < intersect_beyond_distance) {
              intersect_beyond = beyond_half_intersects[key].Point;
              intersect_beyond_distance = point_dist;
            }
          }
        }
        if (intersect_seg.length == 0 && !seg_intersected_through_vertex) {
          seg.draw();
          addPointToOrdering(seg.p2);
          if (intersect_beyond_distance == Infinity && !seg_intersected_at_vertex) {
            beyond.draw();
            if (sameLine[mypoint] == null) {
              sameLine[mypoint.x + " " + mypoint.y] = [beyond.p2];
            } else {
              sameLine[mypoint.x + " " + mypoint.y].push(beyond.p2);
            }
            addPointToOrdering(beyond.p2);
          } else if (!seg_intersected_at_vertex) {
            beyond = new Segment(mypoint,intersect_beyond);
            beyond.draw();
            if (sameLine[mypoint.x + " " + mypoint.y] == null) {
              sameLine[mypoint.x + " " + mypoint.y] = [beyond.p2];
            } else {
              sameLine[mypoint.x + " " + mypoint.y].push(beyond.p2);
            }
            addPointToOrdering(beyond.p2);
          }
        }
    }
};

function castRays(num) {
  current_angle = 0;
  for (count = 0; count < num; count++) {
    samplePoint = new Point(Math.cos(current_angle) + src.x,Math.sin(current_angle) + src.y);
    seg_half_intersects = {};
    edgePoint = null;
    border_dist = Infinity;
    seg = new Segment(src,samplePoint);

    for (i = 0; i < 4; i++) {
      border_intersect = segcross(seg,borders[i]);
      if (border_intersect != 0) {
        intersection_point = intersection_two_segments(seg,borders[i]);
        if (distance(intersection_point,src) < border_dist) {
          edgePoint = intersection_point;
          border_dist = distance(border_intersect,src);
        }
      }
    }
    if (edgePoint == null) {
      for (i = 0; i < 4; i++) {
        border_intersect = intersection_on_border(seg,borders[i]);
        if (border_intersect.label != "null" && distance(border_intersect,src) < border_dist && Math.abs(angle(src,samplePoint,border_intersect) - 3.14) < .01) {
          edgePoint = border_intersect;
          border_dist = distance(border_intersect,src);
        }
      }
    }
    seg = new Segment(src,edgePoint);

    for (i = 0; i < lines.length; i++) {
      intersection_value = segcross(seg,lines[i]);
      if (Math.abs(intersection_value) == 1) {
        intersection_point = intersection_two_segments(seg,lines[i]);
        beyond_dist = distance(src,intersection_point);

        if (beyond_dist < border_dist) {
          edgePoint = intersection_point;
          border_dist = beyond_dist;
        }
      } else if (Math.abs(intersection_value) == .5) {
        if (ccw(src,edgePoint,lines[i].p1) == 0) {
          intersected_vertex = lines[i].p1;
          other_vertex = lines[i].p2;
        } else {
          intersected_vertex = lines[i].p2;
          other_vertex = lines[i].p1;
        }
        if (seg_half_intersects[intersected_vertex] == null) {
          seg_half_intersects[intersected_vertex] = new HalfIntersect(intersected_vertex);
        }
        seg_half_intersects[intersected_vertex].PositiveCCW = (seg_half_intersects[intersected_vertex].PositiveCCW) || ccw(src,edgePoint,other_vertex) == 1;
        seg_half_intersects[intersected_vertex].NegativeCCW = (seg_half_intersects[intersected_vertex].NegativeCCW) || ccw(src,edgePoint,other_vertex) == -1;
      }
    }

    for (var key in seg_half_intersects) {
      if (seg_half_intersects[key].PositiveCCW && seg_half_intersects[key].NegativeCCW) {
        point_dist = distance(src,seg_half_intersects[key].Point);
        if (point_dist < border_dist) {
          edgePoint = seg_half_intersects[key].Point;
          border_dist = point_dist;
        }
      }
    }
    seg = new Segment(src,edgePoint);
    seg.draw();
    point_order.push(edgePoint);
    current_angle += 2 * Math.PI/num;
  }
};

function highlightVisibleAreas() {
  strokeWeight(.1);
  fill(0,180,180);
  l = point_order.length;

  for (i = 0; i < l; i++) {
    curr = point_order[i];
    next = point_order[(i+1)%l];
    triangle(src.x,src.y,curr.x,curr.y,next.x,next.y);
  }
}

///////////////////////////
// Global Variables
///////////////////////////

var lines;
var points;
var borders;
var src;
var point_order;
var borderPoints;
var sameLine;
var numRays;
var radio;
var visibilityMode;
var drawLineMode;
var firstPoint;
var drawShapeMode;
var shapeToDraw;


///////////////////////////
// Setup & Drawing
///////////////////////////

function setup() {
//These will need to be replaced with user-input.  Also, whenever the user switches TO drawLineMode, it should set firstPoint to null.
visibilityMode = true;
drawShapeMode = false;
drawLineMode = false;
shapeToDraw = 5;
firstPoint = null;

    createElement('p', "Number of rays (if Via Angles)");
    numRays = createInput('30');

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
             new Segment(new Point(300,300),new Point(350,350)),

             new Segment(new Point(600,700),new Point(700,700)),
             new Segment(new Point(700,700),new Point(700,600)),
             new Segment(new Point(700,600),new Point(600,600)),
             new Segment(new Point(600,600),new Point(600,700)),

             new Segment(new Point(300,500),new Point(250,550))];
    points = [];
    for (var p of pset) {
      points.push(p);
    }


    borders =
            [new Segment(new Point(0,0),new Point(0,windowHeight)),
             new Segment(new Point(0,windowHeight),new Point(windowWidth,windowHeight)),
             new Segment(new Point(windowWidth,windowHeight),new Point(windowWidth,0)),
             new Segment(new Point(windowWidth,0),new Point(0,0))];

    borderPoints =
            [new Point(0,0),new Point(0,windowHeight),new Point(windowWidth,windowHeight),new Point(windowWidth,0)];
}

function draw() {
  src = new Source();
  pset = new Set();
  point_to_edges_dict = {};
  point_order = [];
  sameLine = {};

  background(51);
  for (i = 0; i < lines.length; i++) {
    strokeWeight(1);
    lines[i].draw();
  }
  if (visibilityMode && src.y >= 0) {
    castRays(numRays.value());
    highlightVisibleAreas();
  }
}

function outOfRange(p) {
  return (p.x < 0 || p.y < 0 || p.x > windowWidth || p.y > windowHeight);
}

function mousePressed() {
  if (drawLineMode) {
    if (firstPoint == null) {
      if (!outOfRange(src)) {
        firstPoint = new Point(src.x,src.y);
      }
    } else {
      if (!outOfRange(src)) {
        secondPoint = new Point(src.x,src.y);
        points.push(firstPoint);
        points.push(secondPoint);
        lines.push(new Segment(firstPoint,secondPoint));
        firstPoint = null;
      }
    }
  } else if (drawShapeMode) {
    if (shapeToDraw == 1) { //triangle
      a = new Point(src.x,src.y);
      b = new Point(src.x+40,src.y+60);
      c = new Point(src.x-40,src.y+60);
      if (!outOfRange(a) && !outOfRange(b) && !outOfRange(c)) {
        points.push(a);
        points.push(b);
        points.push(c);
        lines.push(new Segment(a,b));
        lines.push(new Segment(b,c));
        lines.push(new Segment(c,a));
      }
    } else if (shapeToDraw == 2) { //square
      a = new Point(src.x,src.y);
      b = new Point(src.x+50,src.y);
      c = new Point(src.x+50,src.y+50);
      d = new Point(src.x,src.y+50);
      if (!outOfRange(a) && !outOfRange(b) && !outOfRange(c) && !outOfRange(d)) {
        points.push(a);
        points.push(b);
        points.push(c);
        points.push(d);
        lines.push(new Segment(a,b));
        lines.push(new Segment(b,c));
        lines.push(new Segment(c,d));
        lines.push(new Segment(d,a));
      }
    } else if (shapeToDraw == 3) { //pentagon
      a = new Point(src.x,src.y);
      b = new Point(src.x-95,src.y+69);
      c = new Point(src.x-59,src.y+181);
      d = new Point(src.x+59,src.y+181);
      e = new Point(src.x+95,src.y+69);
      if (!outOfRange(a) && !outOfRange(b) && !outOfRange(c) && !outOfRange(d) && !outOfRange(e)) {
        points.push(a);
        points.push(b);
        points.push(c);
        points.push(d);
        points.push(e);
        lines.push(new Segment(a,b));
        lines.push(new Segment(b,c));
        lines.push(new Segment(c,d));
        lines.push(new Segment(d,e));
        lines.push(new Segment(e,a));
      }
    } else if (shapeToDraw == 4) { //arrow
      a = new Point(src.x,src.y);
      b = new Point(src.x,src.y+30);
      c = new Point(src.x+50,src.y+30);
      d = new Point(src.x+50,src.y+50);
      e = new Point(src.x+90,src.y+15);
      f = new Point(src.x+50,src.y-20);
      g = new Point(src.x+50,src.y);
      if (!outOfRange(a) && !outOfRange(b) && !outOfRange(c) && !outOfRange(d) && !outOfRange(e) && !outOfRange(f) && !outOfRange(g)) {
        points.push(a);
        points.push(b);
        points.push(c);
        points.push(d);
        points.push(e);
        points.push(f);
        points.push(g);
        lines.push(new Segment(a,b));
        lines.push(new Segment(b,c));
        lines.push(new Segment(c,d));
        lines.push(new Segment(d,e));
        lines.push(new Segment(e,f));
        lines.push(new Segment(f,g));
        lines.push(new Segment(g,a));
      }
    } else if (shapeToDraw == 5) { //star
      a = new Point(src.x,src.y);
      b = new Point(src.x+10,src.y+20);
      c = new Point(src.x+35,src.y+20);
      d = new Point(src.x+20,src.y+35);
      e = new Point(src.x+30,src.y+60);
      f = new Point(src.x,src.y+45);
      g = new Point(src.x-30,src.y+60);
      h = new Point(src.x-20,src.y+35);
      i = new Point(src.x-35,src.y+20);
      j = new Point(src.x-10,src.y+20);
      if (!outOfRange(a) && !outOfRange(b) && !outOfRange(c) && !outOfRange(d) && !outOfRange(e) && !outOfRange(f) && !outOfRange(g) && !outOfRange(h) && !outOfRange(i) && !outOfRange(j)) {
        points.push(a);
        points.push(b);
        points.push(c);
        points.push(d);
        points.push(e);
        points.push(f);
        points.push(g);
        points.push(h);
        points.push(i);
        points.push(j);
        lines.push(new Segment(a,b));
        lines.push(new Segment(b,c));
        lines.push(new Segment(c,d));
        lines.push(new Segment(d,e));
        lines.push(new Segment(e,f));
        lines.push(new Segment(f,g));
        lines.push(new Segment(g,h));
        lines.push(new Segment(h,i));
        lines.push(new Segment(i,j));
        lines.push(new Segment(j,a));
      }
    }
  }
}
