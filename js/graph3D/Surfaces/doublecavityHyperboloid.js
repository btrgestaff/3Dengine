Surfaces.prototype.doublecavityHyperboloid = (count = 20, ringCount = 10, R = 10) => {
    const points = [];
    const edges = [];
    const polygons = [];

    // points
    /*for (let beta = Math.PI / 2; beta < Math.PI; beta += Math.PI / ringCount) {
        const y = R - Math.sin(beta) * R + 1;
        const r = Math.cos(beta) * R;
        for (let alfa = 0; alfa < 2 * Math.PI; alfa += Math.PI / pointCount * 2) {
            const x = Math.cos(alfa) * r;
            const z = Math.sin(alfa) * r;
            points.push(new Point(x, y, z)); 
        }
    }
    for (let beta = Math.PI / 2; beta < Math.PI; beta += Math.PI / ringCount) {
        const y = Math.sin(beta) * R - R - 1;
        const r = Math.cos(beta) * R;
        for (let alfa = 0; alfa < 2 * Math.PI; alfa += Math.PI / pointCount) {
            const x = Math.cos(alfa) * r;
            const z = Math.sin(alfa) * r;
            points.push(new Point(x, y, z)); 
        }
    }
    
    for (let i = 0; i + 1 < points.length; i++) {
        if ((i + 1) % (pointCount * 2) != 0) {
            edges.push(new Edge(i, i + 1));
        } else {
            edges.push(new Edge(i, i + 1 - pointCount * 2));
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
    */
    // 
    const size = 10;
    const delta = size / count;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            const x = i * delta - size / 2;
            const y = j * delta - size / 2;
            const z = Math.sqrt(x * x + y * y + 1);
            points.push(new Point(x, y, z));
            }
    }
    for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const x = i * delta - size / 2;
                const y = j * delta - size / 2;
                const z = -Math.sqrt(x * x + y * y + 1);
                points.push(new Point(x, y, z));
            }
    }

    // ребра
    for (let i = 0; i < points.length; i++) {
        if (i + 1 < points.length && (i + 1) % count != 0) {
            edges.push(new Edge(i, i + 1));
        }
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        }
    }
    //  полигоны
    /*
    for (let i = 0; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count != 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
        }
    }
    */
    return new Subject(points, edges, polygons);
}