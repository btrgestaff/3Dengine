Surfaces.prototype.ellipticCylinder = (pointCount = 20, ringCount = 10, R = 10) => {
    const points = [];
    const edges = [];
    const polygons = [];

    // points
    for (let i = 0; i < ringCount; i++) {
        for (let alpha = 0; alpha < Math.PI * 2; alpha += Math.PI / pointCount * 2) {
            let y = Math.cos(alpha) * R;
            let x = i;
            let z = Math.sin(alpha) * R;
            points.push(new Point(x, y, z));
        }
    }

    // edges
    for (let i = 0; i < points.length; i++) {
        if (i % pointCount === 0 && i !== 0) {
            edges.push(new Edge(i, i + 1));
        } else {
            if (i + 1 < points.length && (i + 1) % pointCount !== 0) {
                edges.push(new Edge(i, i + 1));
            } else {
                edges.push(new Edge(i, i + 1 - pointCount));
            }
        }
        if (i + pointCount < points.length) {
            edges.push(new Edge(i, i + pointCount));
        }
    }

    // polygons
    for (let i = 0; i < points.length; i++) {
        if ((i + 1 + pointCount) < points.length && ((i + 1) % pointCount) != 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + pointCount, i + pointCount]));
        } else if ((i + pointCount) < points.length && ((i + 1) % pointCount) == 0) {
            polygons.push(new Polygon([i, i - pointCount + 1, i + 1, i + pointCount]));
        }
    }
    
    return new Subject(points, edges, polygons);
}