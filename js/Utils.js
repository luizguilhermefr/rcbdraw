drawPixel = function (context, x, y, color) {
    context.fillStyle = color;
    console.log(color);
    context.fillRect(x, y, 1, 1);
};