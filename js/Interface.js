function Interface (newCanvas) {
    this.canvas = newCanvas;
    this.context = this.canvas.getContext('2d');
    this.context.beginPath();

    // this.drawExample = function () {
    //   this.context.lineWidth = 2;
    //   this.context.strokeStyle = 'red';
    //   this.context.moveTo(75, 250);
    //   this.context.lineTo(150, 50);
    //   this.context.lineTo(225, 250);
    //   this.context.lineTo(50, 120);
    //   this.context.lineTo(250, 120);
    //   this.context.lineTo(75, 250);
    //   this.context.stroke();
    // };

    this.drawPolygon = function (sides) {

    };

    this.clearAll = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
}