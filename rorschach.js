
const canvas = document.getElementById('canvas');
canvas.width = 2000;
canvas.height = 1500;
canvas.style.width = "1000px";
canvas.style.height = "745px";
const visibleContext = canvas.getContext('2d');
visibleContext.scale(2,2);


const offscreenCanvas = document.createElement("canvas");
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
offscreenCanvas.style.width = canvas.style.width;
offscreenCanvas.style.height = canvas.style.height;
const offscreenContext = offscreenCanvas.getContext("2d");

const defaultCenterPoint = {
    x: canvas.width * 0.25,
    y: canvas.height * 0.25,
};

const defaultRadius = 100;

function randomPoint() {
    let p = {
        x: Math.random() * canvas.width * 0.25,
        y: Math.random() * canvas.height * 0.25,
    }

    return p;
};

function skew() {
    let s = Math.random() * 1;
    s *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

    return s * 0.5;
};

const randomRadius = () => Math.floor(Math.random() * (141)) + 10;

const blobX = (cx, radius, angle) => cx + (radius * Math.cos(angle));
const blobY = (cy, radius, angle) => cy + (radius * Math.sin(angle));


function drawBlob(centerPoint, radius, i, context){
    const maxOffset = radius * 0.5;
    const ctx = context;
    const s = skew();
    const c = {
        x: centerPoint.x + radius,
        y: centerPoint.y + radius
    };

    ctx.globalCompositeOperation = 'multiply';
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    let lastPoint = c;

    for (let j = 0; j < 4; j++) {
        for (let angle = -Math.PI/10; angle <= 2 * Math.PI; angle+= Math.PI/10) {
            let r = radius + skew() * 2 * maxOffset;
            let newPoint = {
                x: blobX(c.x, r, angle + s) > canvas.width * 0.25 ? canvas.width * 0.25 : blobX(c.x, r, angle + s),
                y: blobY(c.y, r, angle),
            };

            ctx.arcTo(
                lastPoint.x,
                lastPoint.y,
                newPoint.x,
                newPoint.y,
                Math.random() * 10 + Math.sin(angle) + 1
            );
            lastPoint = newPoint;
        }
        ctx.arcTo(
            lastPoint.x,
            lastPoint.y,
            c.x,
            c.y,
            10
        );
        ctx.closePath();
        ctx.shadowColor = 'rgba('
            + Math.floor(Math.random() * 50 + 200)
            +', '+ Math.floor(Math.random() * 60)
            +', '+ Math.floor(Math.random() * 20)
            +', 0.9)';
        ctx.fillStyle = 'rgba('
        + Math.floor(Math.random() * 50 + 200)
        +', '+ Math.floor(Math.random() * 60)
        +', '+ Math.floor(Math.random() * 20)
        +', 0.2)';
        ctx.shadowBlur = Math.random() * 100;
        ctx.fill();
    };
};

function drawSplatter(numberOfBlobs, context) {
    for(i = 0; i < numberOfBlobs; i++) {
        drawBlob(randomPoint(), randomRadius(), i, context);
    }
};

function draw() {
    visibleContext.save();
    drawSplatter(4, offscreenContext);
    visibleContext.translate(canvas.width * 0.25, 0);
    visibleContext.drawImage(offscreenCanvas, -canvas.width * 0.25, 0);
    visibleContext.scale(-1, 1);
    visibleContext.translate(-canvas.width * 0.25, 0);
    visibleContext.drawImage(offscreenCanvas, 0, 0);
    visibleContext.restore();
}

draw();