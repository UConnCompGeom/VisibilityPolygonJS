// Points
var pa = null;
var pb = null;
var pc = null;

// Compute Orinetation
var v1 = null;
var v2 = null;

function setup() {
    // Canvas & Drawing Setup
    createCanvas(windowWidth, windowHeight);
    background(51);

    // Points
    pa = new Point(50, 50, "a");
    pb = new Point(100, 100, "b");
    pc = new Point(50, 100, "c");

    // // Compute Orinetation
    // v1 = new Vector(pa, pb);
    // v2 = new Vector(pa, pc);

    pa.color = color(247, 146, 159);  // Red
    pb.color = color(129, 245, 125);  // Green
    pc.color = color(141, 196, 247);  // Blue

    // ccw = 1
    console.log("Orientation for: c b a");
    console.log(ccw(pc, pb, pa));

    // cw = -1
    console.log("Orientation for: a b c");
    console.log(ccw(pa, pb, pc));

    // ccw = 1
    console.log("Orientation for: b a c");
    console.log(ccw(pb, pa, pc));

    // cw = -1
    console.log("Orientation for: b c a");
    console.log(ccw(pb, pc, pa));

    // colinear = 0
    console.log("Orientation for: b c b");
    console.log(ccw(pb, pc, pb));
}

function draw() {
    pa.draw();
    pb.draw();
    pc.draw();
}
