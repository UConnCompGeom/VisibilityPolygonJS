/*
points: an array of Points
They'll be connectd together as segments
Example: [a, b, c, d] => a->b->c->d->a

Note: d will automatically be connected to a, to close the Polygon
*/
function Polygon(points) {
    this.points = points;
    this.segments = [];
    this.color = color('white');

    // Generate segments
    for (var i=1; i < this.points.length; i++) {
        this.segments.push(new Segment(this.points[i-1], this.points[i]));
    }
    this.segments.push(new Segment(this.points[this.points.length-1], this.points[0]));
}

Polygon.prototype.draw = function() {
    push();
    fill(this.color);
    stroke(this.color);
    for (var seg of this.segments) {
        seg.draw();
    }
    pop();
};
