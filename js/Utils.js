drawPixel = function (context, x, y, color) {
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
};