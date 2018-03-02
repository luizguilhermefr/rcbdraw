import Vertex from './Vertex';

export default class {

    context = null;
    worldWidth = 0;
    worldHeight = 0;
    viewReferencePoint = null;
    viewUp = null;
    solids = [];
    ignoreVisibility = false;
    wireFrame = false;
    surfaceHiding = true;
    wireframeColor = 'red';

    constructor (options = {}) {
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
        } = options;
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

    strokePoly = ({ polygon, strokeColor }) => {

    };

    fillPoly = ({ polygon, lightProperties, fillColor, lightSource, shouldShade }) => {

    };

    reset = () => {
        this.solids = [];
        this.clear();
    };

    clear = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    drawPolygon = ({ polygon, lightProperties, fillColor = null, strokeColor = null, forceVisible = false, shouldWireframe = false, shouldFill = false, shouldStroke = false }) => {
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
                    lightSource,
                    shouldShade
                });
            }
            if (shouldStroke) {
                this.strokePoly({ polygon, strokeColor });
            }
        }
    };

    drawSolid = ({ solid, forceVisible = false, shouldWireframe = false }) => {
        const shouldFill = solid.shouldFill() && !shouldWireframe;
        const shouldStroke = solid.shouldStroke() || shouldWireframe;
        const lightProperties = solid.getLighting();
        const fillColor = solid.getFillColor();
        const strokeColor = solid.getStrokeColor();
        solid.getPolygons().forEach((polygon) => this.drawPolygon({
            polygon,
            forceVisible,
            shouldWireframe,
            shouldStroke,
            shouldFill,
            lightProperties,
            fillColor,
            strokeColor
        }));
    };

    render = () => {
        const shouldWireframe = this.wireFrame;
        const forceVisible = this.ignoreVisibility || shouldWireframe;
        solids.forEach((solid) => this.drawSolid({ solid, forceVisible, shouldWireframe }));
    };
}