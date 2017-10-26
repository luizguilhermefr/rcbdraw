function Vertex(x, y, z) {
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.z = Math.round(z);

    this.getX = function () {
        return this.x;
    };

    this.getY = function () {
        return this.y;
    };

    this.getZ = function () {
        return this.z;
    };

    this.setX = function (val) {
        this.x = val;
    };

    this.setY = function (val) {
        this.y = val;
    };

    this.setZ = function (val) {
        this.z = val;
    };

    this.setCoords = function (x, y) {
        this.x = x;
        this.y = y;
        this.z = z;
    };

    this.clone = function () {
        return new Vertex(this.x, this.y, this.z);
    };

    this.invert = function () {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;

        return this;
    };

    this.distanceToVertexXY = function (vertex) {
        return Math.sqrt(Math.pow(vertex.getX() - this.getX(), 2) + Math.pow(vertex.getY() - this.getY(), 2));
    };

    this.distanceToVertexXZ = function (vertex) {
        return Math.sqrt(Math.pow(vertex.getX() - this.getX(), 2) + Math.pow(vertex.getZ() - this.getZ(), 2));
    };

    this.distanceToVertexZY = function (vertex) {
        return Math.sqrt(Math.pow(vertex.getZ() - this.getZ(), 2) + Math.pow(vertex.getY() - this.getY(), 2));
    };

    this.distanceToVertex = function (vertex) {
        // TODO: Include Z comparison
        return Math.sqrt(Math.pow(vertex.getX() - this.getX(), 2) + Math.pow(vertex.getY() - this.getY(), 2));
    };

    this.distanceToEdgeXY = function (edge) {
        let from = edge.getFrom();
        let to = edge.getTo();

        let r = to.getY() - from.getY();
        let s = -(to.getX() - from.getX());
        let t = to.getX() * from.getY() - from.getX() * to.getY();
        return Math.abs(r * this.x + s * this.y + t) / Math.sqrt(Math.pow(r, 2) + Math.pow(s, 2));
    };

    this.distanceToEdgeXZ = function (edge) {
        let from = edge.getFrom();
        let to = edge.getTo();

        let r = to.getZ() - from.getZ();
        let s = -(to.getX() - from.getX());
        let t = to.getX() * from.getZ() - from.getX() * to.getZ();
        return Math.abs(r * this.x + s * this.z + t) / Math.sqrt(Math.pow(r, 2) + Math.pow(s, 2));
    };

    this.distanceToEdgeZY = function (edge) {
        let from = edge.getFrom();
        let to = edge.getTo();

        let r = to.getY() - from.getY();
        let s = -(to.getZ() - from.getZ());
        let t = to.getZ() * from.getY() - from.getZ() * to.getY();
        return Math.abs(r * this.z + s * this.y + t) / Math.sqrt(Math.pow(r, 2) + Math.pow(s, 2));
    };

    this.distanceToEdge = function (edge) {
        // TODO: Include Z comparison
        let from = edge.getFrom();
        let to = edge.getTo();

        let r = to.getY() - from.getY();
        let s = -(to.getX() - from.getX());
        let t = to.getX() * from.getY() - from.getX() * to.getY();
        return Math.abs(r * this.x + s * this.y + t) / Math.sqrt(Math.pow(r, 2) + Math.pow(s, 2));
    };

    this.sub = function (vertex) {
        this.x -= vertex.getX();
        this.y -= vertex.getY();
        this.z -= vertex.getZ();

        return this;
    };

    this.mult = function (vertex) {
        this.x *= vertex.getX();
        this.y *= vertex.getY();
        this.z *= vertex.getZ();

        return this;
    };

    this.dotProduct = function (vertex) {
        let value = 0;
        value += this.x * vertex.getX();
        value += this.y * vertex.getY();
        value += this.z * vertex.getZ();

        return value;
    };

    this.divScalar = function (value) {
        this.x /= value;
        this.y /= value;
        this.z /= value;

        return this;
    };

    this.getMagnitude = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    };

    this.xRotation = function(teta){
        this.setY((this.getY()* Math.cos(teta)) - (this.getZ() * Math.sin(teta)));
        this.setZ((this.getY()* Math.sin(teta)) + (this.getZ() * Math.cos(teta)));    
    };

    this.yRotation = function(teta){
        this.setX((this.getX()* Math.cos(teta)) + (this.getZ() * Math.sin(teta)));
        this.setZ((this.getX().invert()* Math.sin(teta)) + (this.getZ() * Math.cos(teta)));    
    };

    this.zRotation = function(teta){
        this.setX((this.getX()* Math.cos(teta)) - (this.getY() * Math.sin(teta)));
        this.setY((this.getX()* Math.sin(teta)) + (this.getY() * Math.cos(teta)));    
    };
    

}