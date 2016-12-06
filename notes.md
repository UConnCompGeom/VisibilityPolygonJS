Visibility Polygon
=====================

## About

A visibility polygon is formally defined as follows:
Let **O** be the set of obstacles
Let **V** be the set of points in the visibility polygon
Let **q** and **p** be members 
the set of points **V** in **R^2** such that every point **q** member of **R^2**, the segment **p** , doesn't intersect any obstacles in **S**

## Uniform Ray Casting:

The idea is to rotate about a point (0, 2pi) casting rays out every x angles

This algorithm doesn't always produce the correct result, and isn't optimal. The idea of reducing the size of the increment angle (thus increasing the number of rays) will improve the result, but even then you can find errors. The best angle would be infinetely small so that a ray never misses any shape, even when the source is near infinity away from obstacles.

Note, increasing the number of rays is expensive, so it will cause lag.

Time Complexity: 
