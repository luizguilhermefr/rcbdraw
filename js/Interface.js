function Interface (newCanvas) {
    this.canvas = newCanvas;
    this.context = this.canvas.getContext('2d');
    this.rect = this.canvas.getBoundingClientRect();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'red';

    this.getRelativeX = function (x) {
        return Math.round((x - this.rect.left) / (this.rect.right - this.rect.left) * this.canvas.width);
    };

    this.getRelativeY = function (y) {
        return Math.round((y - this.rect.top) / (this.rect.bottom - this.rect.top) * this.canvas.height);
    };

    this.getNewDotX = function (x, y, teta) {
        return (x * Math.cos(teta)) - (y * Math.sin(teta));
    };

    this.getNewDotY = function (x, y, teta) {
        return (x * Math.sin(teta)) + (y * Math.cos(teta));
    };

    this.drawPolygon = function (sides, size, x, y) {
        var dotX;
        var dotY;
        var temp;
        var teta = ((2 * Math.PI) / sides);
        dotX = 0;
        dotY = size;
        if (sides % 2 === 0) {
            temp = dotX;
            dotX = this.getNewDotX(dotX, dotY, (2 * Math.PI) / 8);
            dotY = this.getNewDotY(temp, dotY, (2 * Math.PI) / 8);
        }
        x = this.getRelativeX(x);
        y = this.getRelativeY(y);
        this.context.beginPath();
        this.context.fillRect(dotX + x, (dotY * (-1)) + y, 4, 4);
        this.context.stroke();
        for (var i = 0; i < sides; i++) {
            temp = dotX;
            dotX = this.getNewDotX(dotX, dotY, teta);
            dotY = this.getNewDotY(temp, dotY, teta);
            this.context.beginPath();
            this.context.fillRect(dotX + x, (dotY * (-1)) + y, 4, 4);
            this.context.stroke();
        }
    };

    this.clearAll = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
}