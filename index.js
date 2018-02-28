import Vertex from './Vertex';

export default class Rcb {

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

    redraw = () => {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const vrp = this.viewReferencePoint;
        const viewUp = this.viewUp;
        const shouldWireframe = this.wireFrame;
        const forceVisible = this.ignoreVisibility || shouldWireframe;
        solids.forEach((solid) => {
            solid.getPolygons().forEach((polygon) => {
                const shouldFill = solid.shouldFill() && !shouldWireframe;
                const shouldStroke = solid.shouldStroke() || shouldWireframe;
                const lightProperties = solid.getLighting();
                const fillColor = solid.getFillColor();
                const strokeColor = solid.getStrokeColor();
                polygon.updateDrawableVertices(canvasWidth, canvasHeight, worldWidth, worldHeight, vrp, viewUp, forceVisible);
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
            });
        });
    };
}