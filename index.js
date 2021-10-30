const colorPalette = ["#1865b5", "#fb4337", "#70cdc3", "#fdfa65", "#e298bb"];
const possibleShapes = ["square", "circle", "lines", "steps", "triangle"];
const possibleFillDir = [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1],
];
let angles;

let scaleFactor = 1.3;

const circleRad = 50 * scaleFactor;
const squareSize = 50 * scaleFactor;
const lineSize = 6 * scaleFactor;
const fillOffsetCircle = 9 * scaleFactor;
const fillOffsetSquare = 10 * scaleFactor;
const fillOffsetLine = 8 * scaleFactor;

let createdShapes = [];
const minBorder = 55 * scaleFactor;
const border = -10 * scaleFactor;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    noLoop();

    angles = [0, PI / 4, PI];
}

function draw() {
    background("#f7f7f7");

    let protection = 0;

    while (true) {
        let thisShape = new generateShape();

        let overlapping = false;

        for (let j = 0; j < createdShapes.length; j++) {
            let other = createdShapes[j];
            let d = dist(thisShape.pos.x, thisShape.pos.y, other.pos.x, other.pos.y);
            if (d < minBorder * 2) {
                overlapping = true;
            }
        }

        if (!overlapping) {
            createdShapes.push(thisShape);
        }

        protection++;
        if (protection > 1000) {
            console.log("INFINITE LOOP", createdShapes.length);
            break;
        }
    }

    for (let i = 0; i < createdShapes.length; i++) {
        createdShapes[i].show();
    }
    // save("shapes.png");
}

function isColliding(obj1, obj2) {
    return obj1.pos.x + minBorder > obj2.pos.x - minBorder && obj1.pos.x - minBorder < obj2.pos.x + minBorder && obj1.pos.y - minBorder > obj2.pos.y + minBorder && obj1.pos.y + minBorder < obj2.pos.y - minBorder;
}

function drawSquiggle() {
    let lineLength = 20 * scaleFactor;
    let capLength = 3.25 * scaleFactor;

    let beginX = -30 * scaleFactor;
    let beginY = 30 * scaleFactor;

    strokeWeight(6.5 * scaleFactor);

    for (let i = 0; i < 3; i++) {
        line(beginX, beginY, beginX + lineLength + capLength, beginY);
        line(beginX + lineLength, beginY, beginX + lineLength, beginY - lineLength - capLength);

        beginX += lineLength;
        beginY -= lineLength;
    }
}

function drawTriangle() {
    let h = 30 * scaleFactor;

    strokeWeight(6.5 * scaleFactor);

    beginShape();

    for (let i = 0; i < 3; i++) {
        let angle = i == 0 ? 0 : (i / 3) * TWO_PI;
        // console.log(angle);
        let x = h * cos(angle);
        let y = h * sin(angle);

        vertex(x, y);
    }

    endShape(CLOSE);
}

class generateShape {
    constructor() {
        this.shapeText = random(possibleShapes);
        this.pos = createVector(random(border, width - border), random(border, height - border));
        let fillDir = random(possibleFillDir);
        this.fillx = fillDir[0];
        this.filly = fillDir[1];
    }

    show() {
        strokeWeight(5 * scaleFactor);
        stroke("pink");
        // circle(this.pos.x, this.pos.y, minBorder * 2);
        if (this.shapeText === "square") {
            rectMode(CENTER);

            noStroke();
            fill("#fb4337");

            rect(this.pos.x + fillOffsetSquare * this.fillx, this.pos.y + fillOffsetSquare * this.filly, squareSize);

            stroke("black");
            noFill();
            rect(this.pos.x, this.pos.y, squareSize);
        } else if (this.shapeText === "circle") {
            noStroke();
            fill("#1865b5");
            circle(this.pos.x + fillOffsetCircle * this.fillx, this.pos.y + fillOffsetCircle * this.filly, circleRad);

            stroke("black");
            noFill();
            circle(this.pos.x, this.pos.y, circleRad);
        } else if (this.shapeText === "lines") {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(random(angles));
            translate(-15 * scaleFactor, 0);

            noStroke();

            fill("#70cdc3");
            rect(fillOffsetLine * this.fillx, fillOffsetLine * this.filly, lineSize, squareSize);
            rect(15 * scaleFactor + fillOffsetLine * this.fillx, 10 * scaleFactor + fillOffsetLine * this.filly, lineSize, squareSize);
            rect(30 * scaleFactor + fillOffsetLine * this.fillx, -5 * scaleFactor + fillOffsetLine * this.filly, lineSize, squareSize);

            fill("black");
            rect(0, 0, lineSize, squareSize);
            rect(15 * scaleFactor, 10 * scaleFactor, lineSize, squareSize);
            rect(30 * scaleFactor, -5 * scaleFactor, lineSize, squareSize);

            pop();
        } else if (this.shapeText === "steps") {
            // noStroke();
            strokeCap(SQUARE);
            strokeWeight(6.5);

            push();

            translate(this.pos.x, this.pos.y);
            // rotate(random(angles));

            stroke("#e298bb");

            drawSquiggle();

            translate(fillOffsetCircle * this.fillx, -fillOffsetCircle * this.filly);

            stroke("black");
            drawSquiggle();

            pop();
        } else if (this.shapeText === "triangle") {
            // fill("black");

            push();

            fill("#fdfa65");

            noStroke();

            translate(this.pos.x, this.pos.y);

            drawTriangle();

            translate(fillOffsetCircle * this.fillx, -fillOffsetCircle * this.filly);

            stroke("black");
            noFill();

            drawTriangle();

            pop();
        }
    }
}