window.requestAnimFrame = (function () {
    return window.requestAnimationFrame      ||
           window.webkitCancelAnimationFrame ||
           window.mozRequestAnimationFrame   ||
           window.oRequestAnimationFrame     ||
           window.msRequestAnimationFrame    ||
           function (callback) {
               window.setTimeout(callback, 1000 / 60);
           };
})();

window.onload = function () {
    const WINDOW = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20,
        CENTER: new Point(0, 0, -30), // центр окошка, через которое видим мир
        CAMERA: new Point(0, 0, -50) // точка, из которой смотрим на мир
    };
    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;

    const sur = new Surfaces;
    const canvas = new Canvas({id: 'canvas', width: 600, height: 600, WINDOW, callbacks: { wheel, mousemove, mouseup, mousedown}});
    const graph3D = new Graph3D({ WINDOW });
    const ui = new UI({ callbacks: {printPoints, printEdges, printPolygons}});
    // сцена
    const SCENE = [
        sur.sphere(10, 10, 3, new Point(0, 0, 0), '#fff100', {rotateOz: new Point(0, 0 ,0), speedCoef: 1}), //Солнце
        sur.sphere(10, 10, 0.1, new Point(-5, 0, 0), '#a5a154', {rotateOz: new Point(0, 0 ,0), speedCoef: 3}),  // Меркурий
        sur.sphere(10, 10, 0.3, new Point(-10, 0, 0), '#be9921', {rotateOz: new Point(0, 0 ,0), speedCoef: 2}), // Венера 
        sur.sphere(10, 10, 1, new Point(-15, 0, 0), '#1200c2', {rotateOz: new Point(0, 0 ,0), speedCoef: 1.5}),  // Земля
        sur.sphere(10, 10, 0.1, new Point(-15, 0, 0), '#535353', {rotateOz: new Point(0, 0 ,0), speedCoef: 1}), // Луна
        sur.sphere(10, 10, 0.9, new Point(-20, 0, 0), '#a63700', {rotateOz: new Point(0, 0 ,0), speedCoef: 0.8}),  // Марс
        sur.sphere(10, 10, 1.5, new Point(-25, 0, 0), '#c8a283', {rotateOz: new Point(0, 0 ,0), speedCoef: 0.5}), // Юпитер
        sur.bublik(20, 2.5, new Point(-25, 0, 0), '#2d2118', {rotateOz: new Point(0, 0, 0), speedCoef: 0.5}), // кольцо Юпитера
        sur.sphere(10, 10, 1.2, new Point(-30, 0, 0), '#c6a452', {rotateOz: new Point(0, 0 ,0), speedCoef: 0.35}),  // Сатурн
        sur.sphere(10, 10, 1.1, new Point(-35, 0, 0), '#0081c6', {rotateOz: new Point(0, 0 ,0), speedCoef: 0.2}), // Уран
        sur.sphere(10, 10, 1.1, new Point(-40, 0, 0), '#004e77', {rotateOz: new Point(0, 0 ,0), speedCoef: 0.1}),  // Нептун
    ];
    console.log(SCENE[3]);
    const LIGHT = new Light(0, 0, 0, 100); // источник света

    let canRotate;
    let canPrint = {
        points: false,
        edges: false,
        polygons: true
    };

    // about callbacks
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        graph3D.zoomMatrix(delta);
        SCENE.forEach(subject => {
            subject.points.forEach(point => graph3D.zoom(point));
            if (subject.animation) {
                for (let key in subject.animation) {
                    if (key === 'rotateOx' || key === 'rotateOy' || key === 'rotateOz') {
                        graph3D.zoom(subject.animation[key]);
                    }
                }
            }
        });
    }

    function mouseup(){
        canRotate = false;
    }

    function mousedown(){
        canRotate = true;
    }

    function mousemove(event) {
        if (canRotate) {
            if (event.movementX) { // вращение вокруг Oy
                const alpha = (event.movementX > 0) ? -canvas.sx(event.movementX) / (WINDOW.CENTER.z * 50) : canvas.sx(event.movementX) / (WINDOW.CENTER.z * 50);
                SCENE.forEach(subject => {
                    subject.points.forEach(point => graph3D.rotateOy(alpha, point))
                    if (subject.animation) {
                        for (let key in subject.animation) {
                            if (key === 'rotateOx' || key === 'rotateOy' || key === 'rotateOz') {
                                graph3D.rotateOy(alpha, subject.animation[key]);
                            }
                        }
                    }
                });
            }
            if (event.movementY) { // вращение вокруг Ox
                const alpha = (event.movementY > 0) ? -canvas.sx(event.movementX) / (WINDOW.CENTER.z * 50) : canvas.sx(event.movementX) / (WINDOW.CENTER.z * 50);
                SCENE.forEach(subject => {
                    subject.points.forEach(point => graph3D.rotateOx(alpha, point))
                    if (subject.animation) {
                        for (let key in subject.animation) {
                            if (key === 'rotateOx' || key === 'rotateOy' || key === 'rotateOz') {
                                graph3D.rotateOx(alpha, subject.animation[key]);
                            }
                        }
                    }
                });
            }
        }
    }

    // inputs
    function printPoints(value) {
        canPrint.points = value;
    }
    function printEdges(value) {
        canPrint.edges = value;
    }
    function printPolygons(value) {
        canPrint.polygons = value;
    }
    
    // about render
    function printAllPolygons() {
        if (canPrint.polygons) {
            const polygons = [];
            SCENE.forEach(subject => {
                graph3D.calcGorner(subject, WINDOW.CAMERA);
                graph3D.calcDistance(subject, WINDOW.CAMERA, 'distance');
                graph3D.calcDistance(subject, LIGHT, 'lumen');
                for (let i = 0; i < subject.polygons.length; i++) {
                    if (subject.polygons[i].visible) {
                        const polygon = subject.polygons[i];
                        const point1 = {
                            x: graph3D.xs(subject.points[polygon.points[0]]),
                            y: graph3D.ys(subject.points[polygon.points[0]])
                        };
                        const point2 = {
                            x: graph3D.xs(subject.points[polygon.points[1]]),
                            y: graph3D.ys(subject.points[polygon.points[1]])
                        };
                        const point3 = {
                            x: graph3D.xs(subject.points[polygon.points[2]]),
                            y: graph3D.ys(subject.points[polygon.points[2]])
                        };
                        const point4 = {
                            x: graph3D.xs(subject.points[polygon.points[3]]),
                            y: graph3D.ys(subject.points[polygon.points[3]])
                        };
                        let {r, g, b} = polygon.color;
                        const lumen = graph3D.calcIllumination(polygon.lumen, LIGHT.lumen);
                        r = Math.round(r * lumen);
                        g = Math.round(g * lumen);
                        b = Math.round(b * lumen);
                        polygons.push({
                            points: [point1, point2, point3, point4],
                            color: polygon.rgbToHex(r, g, b),
                            distance: polygon.distance
                        });
                    }
                }
            });
            // отрисовка всех полигонов
            polygons.sort((a, b) => b.distance - a.distance); // сортировка полиговнов
            polygons.forEach(polygon => {canvas.polygon(polygon.points, polygon.color)});
        }
    }
    
    function printSubject(subject) {
        // print edges
        if (canPrint.edges) {
            for (let i = 0; i < subject.edges.length; i++) {
                const edges = subject.edges[i];
                const point1 = subject.points[edges.p1];
                const point2 = subject.points[edges.p2];
                canvas.line(graph3D.xs(point1), graph3D.ys(point1), graph3D.xs(point2), graph3D.ys(point2));
            }
        }
        // print points
        if (canPrint.points) {
            for (let i = 0; i < subject.points.length; i++) {
                const points = subject.points[i];
                canvas.point(graph3D.xs(points), graph3D.ys(points));
            }
        }
    }

    function render() {
        canvas.clear();
        printAllPolygons();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(-7, 7, FPSout);
    }

    function animation() {
        // анимация вращения
        SCENE.forEach(subject => {
            if (subject.animation) {
                for (let key in subject.animation) {
                    if (key === 'rotateOx' || key === 'rotateOy' || key === 'rotateOz') {
                        const {x, y, z} = subject.animation[key];
                        const xn = WINDOW.CENTER.x - x;
                        const yn = WINDOW.CENTER.y - y;
                        const zn = WINDOW.CENTER.z - z;
                        // переместить цент фигуры в центр координат
                        subject.points.forEach(point => {graph3D.move(xn, yn, zn, point)});
                        // вращение фигуры
                        const alpha = Math.PI / 180 * subject.animation.speedCoef;
                        subject.points.forEach(point => graph3D[key](alpha, point))
                        // вернуть центр фигуры обратно
                        subject.points.forEach(point => {graph3D.move(-xn, -yn, -zn, point)});
                    }
                }
            }
        });
    }

    setInterval(animation, 10);

    let FPS = 0;
    let FPSout = 0;
    let timestemp = (new Date()).getTime();
    (function animloop () {
        // вывод FPS
        FPS++;
        const currentTimestemp = (new Date()).getTime();
        if (currentTimestemp - timestemp >= 1000) {
            timestemp = currentTimestemp;
            FPSout = FPS;
            FPS = 0;
        }

        // отрисовка сцены
        render();
        requestAnimFrame(animloop);
    })();
}; 