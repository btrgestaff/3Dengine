Surfaces.prototype.bublik = (count = 10, R = 10, point = new Point(0, 0, 0), color = '#ff0000', animation) => {
    const x0 = point.x;
    const y0 = point.y;
    const z0 = point.z;
    const points = [];
    const edges = [];
    const polygons = [];

    function setRoundOfPoints(count, R) {
        const da = 2 * Math.PI / count;
        for (let i = 0; i < 2 * Math.PI; i += da) {
            const x = R * Math.sin(i) + x0;
            const z = R * Math.cos(i) + z0;
            const y = y0;
            points.push(new Point(x, y, z));
        }
    }

    setRoundOfPoints(count, R);
    setRoundOfPoints(count, R / 1.4);

    for (let i = 0; i < points.length; i++) {
        if (points[i + count]) {
            edges.push(new Edge(i, i + count));
        }
        if (points[i + 1] && i !== count - 1) {
            edges.push(new Edge(i, i + 1));
        }
        edges.push(new Edge(0, count - 1));
        edges.push(new Edge(count, 2*count - 1));
    }

    for (let i = 0; i < count - 1; i++) {
        polygons.push(new Polygon([i, i + 1, i + count + 1, i + count], color));
    }
    polygons.push(new Polygon([count - 1, 0, count, 2*count - 1], color));

    return new Subject(points, edges, polygons, animation);
}