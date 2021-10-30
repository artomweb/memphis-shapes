const colorPalette = ["#1865b5", "#fb4337", "#70cdc3", "#fdfa65", "#e298bb"];
const possibleShapes = ["square", "circle", "lines", "steps", "triangle"];
const possibleFillDir = [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1],
];
let angles;

const circleRad = 50;
const squareSize = 50;
const lineSize = 6;
const fillOffsetCircle = 9;
const fillOffsetSquare = 10;
const fillOffsetLine = 8;

let createdShapes = [];
const minBorder = 55;
const border = -10;

function setup() {
    createCanvas(1000, 1000);
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
    // save("shapes2.png");
}

function isColliding(obj1, obj2) {
    return obj1.pos.x + minBorder > obj2.pos.x - minBorder && obj1.pos.x - minBorder < obj2.pos.x + minBorder && obj1.pos.y - minBorder > obj2.pos.y + minBorder && obj1.pos.y + minBorder < obj2.pos.y - minBorder;
}

function drawSquiggle() {
    let lineLength = 20;
    let capLength = 3.25;

    let beginX = -30;
    let beginY = 30;

    for (let i = 0; i < 3; i++) {
        line(beginX, beginY, beginX + lineLength + capLength, beginY);
        line(beginX + lineLength, beginY, beginX + lineLength, beginY - lineLength - capLength);

        beginX += lineLength;
        beginY -= lineLength;
    }
}

function drawTriangle() {
    let h = 30;

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
        strokeWeight(5);
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
            translate(-15, 0);

            noStroke();

            fill("#70cdc3");
            rect(fillOffsetLine * this.fillx, fillOffsetLine * this.filly, lineSize, squareSize);
            rect(15 + fillOffsetLine * this.fillx, 10 + fillOffsetLine * this.filly, lineSize, squareSize);
            rect(30 + fillOffsetLine * this.fillx, -5 + fillOffsetLine * this.filly, lineSize, squareSize);

            fill("black");
            rect(0, 0, lineSize, squareSize);
            rect(15, 10, lineSize, squareSize);
            rect(30, -5, lineSize, squareSize);

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