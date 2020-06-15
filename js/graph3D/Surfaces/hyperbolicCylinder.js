Surfaces.prototype.hyperbolicCylinder = (count = 20) => {
    const points = [];
    const edges = [];
    const polygons = [];

    // точки
    const size = 10;
    const delta = size / count;
    for (let i = 0; i < count / 2; i++) {
        for (let j = 0; j < count; j++) {
            const x = i * delta - size / 2;
            const y = j * delta - size / 2;
            const z = 1 / x * x / 2 - y * y / 2 - 2;
            points.push(new Point(x, y, z));
        }
    }
    for (let i = 0; i < count / 2; i++) {
        for (let j = 0; j < count; j++) {
            const x = i * delta - size / 2;
            const y = j * delta - size / 2;
            const z = -(1 / x * x / 2 - y * y / 2);
            points.push(new Point(x, y, z));
        }
    }
    // ребра
    for (let i = 0; i < points.length; i++) {
        if (i + 1 < points.length && (i + 1) % count != 0) {
            edges.push(new Edge(i, i + 1));
        }
        if (i + count < points.length / 2 && (i + count) % count != 0) {
            edges.push(new Edge(i, i + count));
        }
    }
    for (let i = points.length / 2; i < points.length; i++) {
        if (i + 1 < points.length && (i + 1) % count != 0) {
            edges.push(new Edge(i, i + 1));
        }
        if (i + count < points.length && (i + count) % count != 0) {
            edges.push(new Edge(i, i + count));
        }
    }
    //  полигоны
    for (let i = 0; i < points.length / 2; i++) {
        if (i + 1 + count < points.length / 2 && (i + 1) % count != 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
        }
    }
    for (let i = points.length / 2; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count != 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
        }
    }
    return new Subject(points, edges, polygons);
}