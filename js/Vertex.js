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

    this.clone = function(){
        return new Vertex(this.getX(),this.getY(),this.getZ());
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
        let temp = (this.getY()* Math.cos(teta)) - (this.getZ() * Math.sin(teta));
        let temp1 = (this.getY()* Math.sin(teta)) + (this.getZ() * Math.cos(teta));
        this.setY(temp);
        this.setZ(temp1);    
    };

    this.yRotation = function(teta){  
        let temp = (this.getX() * Math.cos(teta)) + (this.getZ() * Math.sin(teta));
        let temp1 = ((this.getX() * -1 )* Math.sin(teta)) + (this.getZ() * Math.cos(teta));
        this.setX(temp);
        this.setZ(temp1);                  
    };

    this.zRotation = function(teta){        
        let temp = (this.getX()* Math.cos(teta)) - (this.getY() * Math.sin(teta));
        let temp1 = (this.getX()* Math.sin(teta)) + (this.getY() * Math.cos(teta));
        this.setX(temp);
        this.setY(temp1);            
    };

    this.rotationVertex = function (tetaX, tetaY, tetaZ) {
        
        let temp = (this.getY()* Math.cos(tetaX)) - (this.getZ() * Math.sin(tetaX));
        let temp1 = (this.getY()* Math.sin(tetaX)) + (this.getZ() * Math.cos(tetaX));
        this.setY(temp);
        this.setZ(temp1);   

        temp = (this.getX() * Math.cos(tetaY)) + (this.getZ() * Math.sin(tetaY));
        temp1 = ((this.getX() * -1 )* Math.sin(tetaY)) + (this.getZ() * Math.cos(tetaY));
        this.setX(temp);
        this.setZ(temp1);   
        
        temp = (this.getX()* Math.cos(tetaZ)) - (this.getY() * Math.sin(tetaZ));
        temp1 = (this.getX()* Math.sin(tetaZ)) + (this.getY() * Math.cos(tetaZ));
        this.setX(temp);
        this.setY(temp1);         
    };

    this.vrpRotation = function (tetaX, tetaY) {
        let temp = (this.getX() * Math.cos(tetaY)) + (this.getZ() * Math.sin(tetaY));
        let temp1 = ((this.getX() * -1 )* Math.sin(tetaY)) + (this.getZ() * Math.cos(tetaY));
        this.setX(temp);
        this.setZ(temp1);

        temp = (this.getY()* Math.cos(tetaX)) - (this.getZ() * Math.sin(tetaX));
        temp1 = (this.getY()* Math.sin(tetaX)) + (this.getZ() * Math.cos(tetaX));
        this.setY(temp);
        this.setZ(temp1);   
    };

    this.scaleVertex = function (tetaX, tetaY, tetaZ) {
        let tempX = (this.getX() + Math.round(this.getX() * tetaX));
        let tempY = (this.getY() + Math.round(this.getY() * tetaY));
        let tempZ = (this.getZ() + Math.round(this.getZ() * tetaZ));
        this.setX(tempX);
        this.setY(tempY);
        this.setZ(tempZ);
    };

    this.extrusionVertex = function (extrusionDistance) {
        this.setX(this.getX() + extrusionDistance.getX());
        this.setY(this.getY() + extrusionDistance.getY());
        this.setZ(this.getZ() + extrusionDistance.getZ());
    };
}