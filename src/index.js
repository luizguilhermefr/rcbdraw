import Vertex from './Vertex';

export default class {

    context = null;
    worldWidth = 0;
    worldHeight = 0;
    viewReferencePoint = null;
    viewUp = null;
    solids = [];
    lightSources = [];
    ignoreVisibility = false;
    wireFrame = false;
    surfaceHiding = true;
    wireframeColor = 'red';

    constructor (parameters) {
        const {
            canvasId,
            worldWidth = window.innerWidth,
            worldHeight = window.innerHeight,
            viewReferencePoint = new Vertex(0, 0, 100),
            viewUp = new Vertex(0, 1, 0),
            ignoreVisibility = false,
            wireFrame = false,
            surfaceHiding = true,
            wireframeColor = 'red'
        } = parameters;
        if (!canvasId) {
            throw new ReferenceError('Must specify canvasId.');
        }
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.viewReferencePoint = viewReferencePoint;
        this.viewUp = viewUp;
        this.ignoreVisibility = ignoreVisibility;
        this.wireFrame = wireFrame;
        this.surfaceHiding = surfaceHiding;
        this.wireframeColor = wireframeColor;
    }

    setViewReferencePoint = (viewReferencePoint) => {
        this.viewReferencePoint = viewReferencePoint;
        return this;
    };

    setViewUp = (viewUp) => {
        this.viewUp = viewUp;
        return this;
    };

    setWorldHeight = (height) => {
        this.worldHeight = height;
        return this;
    };

    setWorldWidth = (width) => {
        this.worldWidth = width;
        return this;
    };

    enforceVisibility = (enforce = true) => {
        this.ignoreVisibility = enforce;
        return this;
    };

    enforceWireframe = (enforce = true) => {
        this.wireFrame = enforce;
        return this;
    };

    enforceSurfaceHiding = (enforce = true) => {
        this.surfaceHiding = enforce;
        return this;
    };

    setWireframeColor = (color) => {
        this.wireframeColor = color;
        return this;
    };

    addSolid = (solid) => {
        this.solids.push(solid);
        return this;
    };

    addLightSource = (source) => {
        this.lightSources.push(source);
        return this;
    };

    reset = () => {
        this.lightSources = [];
        this.solids = [];
        this.clear();
    };

    clear = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    render = () => {
        const shouldWireframe = this.wireFrame;
        const forceVisible = this.ignoreVisibility || shouldWireframe;
        solids.forEach((solid) => this.drawSolid({ solid, forceVisible, shouldWireframe }));
    };

    drawSolid = (parameters) => {
        const { solid, forceVisible = false, shouldWireframe = false } = parameters;
        const shouldFill = solid.shouldFill() && !shouldWireframe;
        const shouldStroke = solid.shouldStroke() || shouldWireframe;
        const lightProperties = solid.getLighting();
        const fillColor = solid.getFillColor();
        const strokeColor = solid.getStrokeColor();
        const strokeWidth = solid.getStrokeWidth();
        solid.getPolygons().forEach((polygon) => this.drawPolygon({
            polygon,
            forceVisible,
            shouldStroke,
            shouldFill,
            lightProperties,
            fillColor,
            strokeColor,
            strokeWidth
        }));
    };

    drawPolygon = (parameters) => {
        const {
            polygon,
            lightProperties,
            fillColor = null,
            strokeColor = null,
            strokeWidth = 0,
            forceVisible = false,
            shouldFill = false,
            shouldStroke = false
        } = parameters;
        polygon.updateDrawableVertices({
            canvasWidth: this.canvas.width,
            canvasHeight: this.canvas.height,
            worldWidth: this.worldWidth,
            worldHeight: this.worldHeight,
            vrp: this.viewReferencePoint,
            viewUp: this.viewUp,
            forceVisible
        });
        if (polygon.isVisible()) {
            if (shouldFill) {
                this.fillPoly({
                    polygon,
                    lightProperties,
                    fillColor,
                    shouldShade
                });
            }
            if (shouldStroke) {
                this.strokePoly({
                    polygon,
                    strokeColor,
                    strokeWidth
                });
            }
        }
    };

    strokePoly = (parameters) => {
        const {
            polygon,
            strokeWidth,
            strokeColor,
            autoClose = true
        } = parameters;
        this.context.lineWidth = strokeWidth;
        this.context.strokeStyle = strokeColor;
        this.context.beginPath();
        const vertices = polygon.getDrawableVertices();
        if (vertices.length > 1) {
            this.context.moveTo(vertices[ 0 ].getX(), vertices[ 0 ].getY());
            this.context.lineTo(vertices[ 1 ].getX(), vertices[ 1 ].getY());
        }
        for (let j = 1; j < vertices.length; j++) {
            this.context.lineTo(vertices[ j ].getX(), vertices[ j ].getY());
        }
        if (autoClose) {
            this.context.closePath();
        }
        this.context.stroke();
    };

    fillPoly = (parameters) => {
        const {
            polygon,
            lightProperties,
            fillColor,
            shouldShade
        } = parameters;
        this.context.lineWidth = 1;
        let color;
        if (shouldShade) {
            let { r, g, b } = this.lightSources.reduce((total, current) =>
                this.applyShade({ total, current, polygon, lightProperties }), { r: 0, g: 0, b: 0 });
            r = this.fixTo255Hexa(r);
            g = this.fixTo255Hexa(g);
            b = this.fixTo255Hexa(b);
            color = this.toColorHexaStr(r, g, b);
        } else {
            color = fillColor;
        }
        this.context.strokeStyle = color;
        this.context.beginPath();
        new PolyFill(polygon).run(this.context);
    };

    applyShade = (parameters) => {
        const { total, current, lightProperties } = parameters;
        const shader = new FlatShading({
            polygon,
            lightProperties,
            vrp: this.viewReferencePoint,
            sourcePosition: current.getPosition()
        });
        const ambientIntensity = current.getAmbientIntensity();
        const sourceIntensity = current.getSourceIntensity();
        return {
            r: total.r + shader.getColor({ color: 'r', ambientIntensity, sourceIntensity }),
            g: total.g + shader.getColor({ color: 'g', ambientIntensity, sourceIntensity }),
            b: total.b + shader.getColor({ color: 'b', ambientIntensity, sourceIntensity })
        };
    };

    fixTo255Hexa = (num) => {
        const hexa = (num > 255 ? 255 : num).toString(16);
        return hexa.length === 0x2 ? hexa : '0' + hexa;
    };

    toColorHexaStr = (r, g, b) =>
        '#' + r + g + b;
}