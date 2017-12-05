FlatShading = function (polygon, color) {

    this.ia = this.ambientLightIntensity * this.ka;

    this.l = this.lightPosition - this.polygon.getCenter();

    this.id = this.ambientIntensity * this.kd;

    this.ambientIntensity = 150;

    this.lightPosition = new Vertex(70, 20, 35);

    this.ambientLightIntensity = 120;

    this.color = color;

    this.polygon = polygon;
};