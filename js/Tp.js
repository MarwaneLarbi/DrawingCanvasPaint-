var canvas,
    context,
    dragging = false,
    dragStartLocation,
    snapshot;
let isPainting = false;


function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;

    return {
        x: x,
        y: y
    };
}

function takeSnapShot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapShot() {
    context.putImageData(snapshot, 0, 0);
}

function drawLine(position) {

    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y);
    context.stroke();
}

function drawCircle(position) {
    context.fillStyle = document.getElementById('fillColor').value;

    var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
    context.beginPath();
    context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI);
}


function drawEllipse(position) {
    context.fillStyle = document.getElementById('fillColor').value;

    var w = position.x - dragStartLocation.x;
    var h = position.y - dragStartLocation.y;
    var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
    context.beginPath();
    var cw = (dragStartLocation.x > position.x) ? true : false;

    console.log(cw);
    context.ellipse(dragStartLocation.x, dragStartLocation.y, Math.abs(w), Math.abs(h), 0, 2 * Math.PI, false);
}


function drawRect(position) {
    context.fillStyle = document.getElementById('fillColor').value;

    console.log(position.x, dragStartLocation.x);
    var w = position.x - dragStartLocation.x;
    var h = position.y - dragStartLocation.y;
    context.beginPath();
    context.rect(dragStartLocation.x, dragStartLocation.y, w, h);
}

function drawrandom(position) {
    context.fillStyle = "rgba(0, 0, 200, 0)";

    context.lineTo(position.x, position.y);
    context.stroke();
}

function drawPolygon(position, sides, angle) {
    context.fillStyle = document.getElementById('fillColor').value;

    var coordinates = [],
        radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2)),
        index = 0;

    for (index; index < sides; index++) {
        coordinates.push({
            x: dragStartLocation.x + radius * Math.cos(angle),
            y: dragStartLocation.y - radius * Math.sin(angle)
        })
        angle += (2 * Math.PI) / sides;
    }


    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);

    for (index = 0; index < sides; index++) {
        context.lineTo(coordinates[index].x, coordinates[index].y);
    }

    context.closePath();
    // context.fill();

}

function drawText(position) {
    var t = $("#textInput").val();
    context.font = "30pt Verdana";
    context.textAlign = "left";
    context.textBaseline = "top";
    var textPxLength = context.measureText(t);
    context.fillText(t, position.x, position.y);
}

function draw(position) {
    var fillBox = document.getElementById("fillBox"),
        shape = document.querySelector('input[type="radio"][name="shape"]:checked').value
        // ,     polygonAngle = document.getElementById('polygonAngle').value
        ,
        polygonAngle = calculateAngle(dragStartLocation, position),
        lineCap = 'round',
        writeCanvas = document.getElementById('textInput').value;
    //global context
    context.lineCap = lineCap;

    //we don't need even't handlers because before drawing we are jsut taking a default value

    if (shape === "circle") {
        drawCircle(position);
    }
    if (shape === "square") {
        drawPolygon(position, 4, Math.PI / 4);
    }
    if (shape === "line") {
        drawLine(position);
    }
    if (shape === "ellipse") {
        drawEllipse(position);
    }
    if (shape === "rect") {
        drawRect(position);
    }
    if (shape === "random") {
        drawrandom(position)
    }
    if (shape === "text") {
        drawText(position)
    }


    if (fillBox.checked) {
        context.fill();
    } else {
        context.stroke();
    }
}
var drawing = false
function dragStart(event) {
    shape = document.querySelector('input[type="radio"][name="shape"]:checked').value
    dragStartLocation = getCanvasCoordinates(event);

    if (shape === "random") {
        if (drawing) {

            context.lineTo(dragStartLocation.x, dragStartLocation.y);
            context.closePath();
            context.moveTo(dragStartLocation.x, dragStartLocation.y);
        } else {
            context.moveTo(dragStartLocation.x, dragStartLocation.y);
            context.beginPath();
        }

    }
    dragging = true;
    takeSnapShot();
}

function calculateAngle(start, current) {

    var angle = 360 - Math.atan2(current.y - start.y, current.x - start.x) * 180 / Math.PI;


    return angle;
}

function drag(event) {
    var position;
    if (dragging === true) {
        restoreSnapShot();
        position = getCanvasCoordinates(event);
        //generic
        draw(position);
    }
}

//Drag Stop
function dragStop(event) {
    dragging = false; //dragging stops here
    restoreSnapShot();
    var position = getCanvasCoordinates(event);
    //generic
    draw(position);
}

//Line Width Here
function changeLineWidth() {
    context.lineWidth = this.value;
    //**important**
    event.stopPropagation();
}
function changeFillStyle() {
    context.fillStyle = this.value;
    event.stopPropagation();
}
function changeStrokeStyle() {
    context.strokeStyle = this.value;
    event.stopPropagation();
}

function changeBackgroundColor() {
    context.save();
    context.fillStyle = document.getElementById('backgroundColor').value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();

}

function eraseCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

canvas = document.getElementById('canvas');
const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
function init() {
    context = canvas.getContext('2d');


    var lineWidth = document.getElementById('lineWidth'),
        fillColor = document.getElementById('fillColor'),
        strokeColor = document.getElementById('strokeColor'),
        canvasColor = document.getElementById('backgroundColor'),
        clearCanvas = document.getElementById('clearCanvas'),
        textInput = document.getElementById('textInput');

    context.lineWidth = lineWidth.value;


    context.fillStyle = fillColor.value;


    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    lineWidth.addEventListener('input', changeLineWidth, false);
    fillColor.addEventListener('input', changeFillStyle, false);
    strokeColor.addEventListener('input', changeStrokeStyle, false);
    canvasColor.addEventListener('input', changeBackgroundColor, false);
    clearCanvas.addEventListener('click', eraseCanvas, false);
}
download_img = function(el) {
  // get image URI from canvas object
  var imageURI = canvas.toDataURL("image/jpg");
  el.href = imageURI;
};
window.addEventListener('load', init, false);
