function Interface (newCanvas) {
    this.canvas = newCanvas;
    this.context = this.canvas.getContext('2d');
    this.rect = this.canvas.getBoundingClientRect();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'red';

    this.getRelativeX = function(x){
        return Math.round((x - this.rect.left) / (this.rect.right - this.rect.left) * this.canvas.width);
    };

    this.getRelativeY = function(y){
        return Math.round((y - this.rect.top) / (this.rect.bottom - this.rect.top) * this.canvas.height);
    };

    this.drawPolygon = function (sides, size, x, y) {
        this.context.beginPath();
        this.context.fillRect(this.getRelativeX(x), this.getRelativeY(y), 4, 4);
        this.context.fill();
    };

    this.clearAll = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
}