import React from 'react';
import { connect } from 'react-redux';
import { object } from 'prop-types';
// import { string } from 'prop-types';


interface PlayState {
    readonly currentUser: string
}

interface PlayProps {
    currentUser: string
}

interface CanvasState {
    // ctx: CanvasRenderingContext2D | null
}

const defaultCanvasState: CanvasState = {
    // ctx: null
}

function canvasIDString(index: number): string {
    return `${CANVAS_ID}-${index}`;
}
function initCanvas(canvas: HTMLCanvasElement, width: number, height: number, hidden: boolean): void {
    canvas.width = width;
    canvas.height = height;
    canvas.hidden = hidden;
}


const CANVAS_CONTAINER: string = "game-canvas-container";
const CANVAS_ID: string = "game-canvas-element-id";
const CANVAS_WIDTH: number = 400;
const CANVAS_HEIGHT: number = 400;
const CANVAS_PIXELS: number = (CANVAS_WIDTH * CANVAS_HEIGHT);
const container: HTMLDivElement = document.getElementById(CANVAS_CONTAINER) as HTMLDivElement;
const gameCanvas_0: HTMLCanvasElement = document.createElement('canvas');
// const gameCanvas_1: HTMLCanvasElement = document.createElement('canvas');
let offscreenCanvas: OffscreenCanvas|null = null



gameCanvas_0.id = canvasIDString(0);
// gameCanvas_1.id = canvasIDString(1);

initCanvas(gameCanvas_0, CANVAS_WIDTH, CANVAS_HEIGHT, false);
// initCanvas(gameCanvas_1, 400, 400, true);
container.appendChild(gameCanvas_0);

function getCanvasCtx(): any {
    const canvas: HTMLCanvasElement = document.getElementById(canvasIDString(0)) as HTMLCanvasElement;
    if (canvas === null) {
        console.error("null canvas")
        throw new Error();
    }
    const ctx: any = canvas.getContext("2d");
    if (ctx === null) {
        console.error("null context");
        throw new Error();
    }
    return ctx
}

function getOffscreenContext(width: number, height: number): OffscreenCanvasRenderingContext2D {
    offscreenCanvas = new OffscreenCanvas(width, height);
    const context = offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    if (context === null) {
        console.error("null context")
        throw new Error();
    }
    return context;
}

const LEVEL_MAP_STRING: string = '' +
'################################' +
'#                              #' +
'#              #######         #' +
'#   #              #           #' +
'#   #         ##               #' +
'#            #   #             #' +
'#           #                  #' +
'#          #      ##           #' +
'#                              #' +
'#          ##  ######          #' +
'#          #        #          #' +
'#          ###   #  #          #' +
'#          #        #          #' +
'#           #######            #' +
'#                              #' +
'################################';
// see also: https://github.com/mdn/canvas-raycaster

function levelMapArray(): Uint8ClampedArray {
    const buf = new Uint8ClampedArray(LEVEL_MAP_STRING.length);
    for (let i = 0; i < LEVEL_MAP_STRING.length; i++) {
        console.assert(LEVEL_MAP_STRING.charCodeAt(i) <= 255);
        console.assert(LEVEL_MAP_STRING.charCodeAt(i) >= 0);
        buf[i] = LEVEL_MAP_STRING.charCodeAt(i);
    }
    return buf
}

function wallCharCode(): number {
    const pound: string = '#';
    return pound.charCodeAt(0);
}

const LEVEL_MAP: Uint8ClampedArray = levelMapArray();
const WALL_CHAR_CODE: number = wallCharCode();
const MAP_WIDTH: number = 32;
const MAP_HEIGHT: number = 32;
console.assert(MAP_WIDTH === MAP_HEIGHT);

// const gameListeners = {
//     w: null,
//     a: null,
//     s: null,
//     d: null,
// }
// https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
// Imagedata needs an 8 bit R value, G value, b value, and a A value;
const screenBufferSize = CANVAS_PIXELS *4

// Allocate once please.
const screenBuffer: Uint8ClampedArray = new Uint8ClampedArray(screenBufferSize);


interface CanvasProps {

}

type ObjectCoordinateVector = {
    x: number,
    y: number,
    angle: number
}

interface Player {
    coordinates: ObjectCoordinateVector,
    // fieldOfView: number
}

const defaultPlayer: Player = {
    coordinates: {
        x: 2,
        y: 2,
        angle: Math.PI/2
    },
    // 
}

const objectsOnMap: Array<ObjectCoordinateVector> = [];

function addToObjects(objectCoordinates: ObjectCoordinateVector) {
    if (outOfBounds(objectCoordinates.x, objectCoordinates.y)) {
        throw new Error("Object out of bounds!");
    }
    if (ifHitWall(objectCoordinates.y, objectCoordinates.x)) {
        throw new Error("Object in wall. Huh?");
    }
    objectsOnMap.push(objectCoordinates);
}

addToObjects({
    x: 10,
    y: 8,
    angle: Math.PI/4
})

const FIELD_OF_VIEW: number = (Math.PI/2)
const VIEW_DISTANCE: number = 16;

function middleAngleFOV(playerAngle: number): number {
    const middleAngle = (FIELD_OF_VIEW/4);
    const angleWithMiddleOffset = (playerAngle - middleAngle);
    return angleWithMiddleOffset;
}

function rayAngle(playerAngle: number, offset: number): number {
    const middleAngle = (FIELD_OF_VIEW/2);
    const FOVStart = (playerAngle) - middleAngle;
    const fractionOfScreen = (offset/CANVAS_WIDTH);
    const FOVEnd = fractionOfScreen * FIELD_OF_VIEW;
    const rayAngleReturn = FOVStart + FOVEnd;
    return rayAngleReturn;
}

function outOfBounds(testX: number, testY: number): boolean {
    if (testX < 0) {
        return true;
    }
    if (testX >= MAP_WIDTH) {
        return true;
    }
    if (testY < 0) {
        return true;
    }
    if (testY >= MAP_HEIGHT) {
        return true;
    }
    return false;
}

function ifHitWall(testY: number, testX: number): boolean {
    const index = Math.floor((testY * MAP_WIDTH) + testX);
    if (LEVEL_MAP[index] === WALL_CHAR_CODE) {
        // console.log('Hit object at x:', testX, ', y: ', testY, "index: ", index);
        return true;
    }
    // console.log('NO object at x:', testX, ', y: ', testY, "index: ", index);
    return false;
}

const HIT_ERR = 0;
const HIT_WALL = 1;
const HIT_DYN = 2;

type testDistanceReturn = {
    outOfBounds: boolean,
    objectHitType: number,
    distance: number;
}

type hitCheck = {
    hit: boolean,
    testReturn: testDistanceReturn
}

function hitDynObject(testX: number, testY: number): boolean {
    for (let i = 0; i < objectsOnMap.length; i++) {
        if ((objectsOnMap[i].x === testX) && (objectsOnMap[i].y === testY)) {
            return true;
        }
    }
    return false;
}

function checkHits(testX: number, testY: number, distanceToWall: number): hitCheck {
    if (outOfBounds(testX, testY)) {
        // console.warn("out of bounds, currently no handling.")
        // debugger;
        distanceToWall = VIEW_DISTANCE;
        console.warn("out of bounds");
        return {
            hit: true,
            testReturn: {
                outOfBounds: true,
                objectHitType: HIT_ERR,
                distance: distanceToWall
            }
        };
    }
    if (hitDynObject(testX, testY)) {
        // debugger;
        return {
            hit: true,
            testReturn: {
                outOfBounds: false,
                objectHitType: HIT_DYN,
                distance: distanceToWall
            }
        };

    }

    if(ifHitWall(testX, testY)) {
        return {
            hit: true,
            testReturn: {
                outOfBounds: false,
                objectHitType: HIT_WALL,
                distance: distanceToWall
            }
        };
    }


    return {
        hit: false,
        testReturn: {
                outOfBounds: false,
                objectHitType: HIT_ERR,
                distance: distanceToWall
        }
    };

}

function testDistance(eyeX: number, eyeY: number, playerCoordinates: ObjectCoordinateVector): testDistanceReturn {
    let thisDistanceToWall: number = 0;
    // let outOfBounds = false;
    while (thisDistanceToWall < VIEW_DISTANCE) {
        const testX: number = Math.floor((eyeX * thisDistanceToWall) + playerCoordinates.x);
        const testY: number = Math.floor((eyeY * thisDistanceToWall) + playerCoordinates.y);
        const hit = checkHits(testX, testY, thisDistanceToWall);
        if (hit.hit) {
            return hit.testReturn;
        }
        thisDistanceToWall += 0.1;
    }
    // console.warn("max distance fallthrough?");
    return {
        outOfBounds: false,
        objectHitType: HIT_ERR,
        distance: thisDistanceToWall
    };

    
}

function distanceToWall(rayAngle: number, coordinates: ObjectCoordinateVector): testDistanceReturn {
    const eyeX: number = Math.sin(rayAngle); // javidX9 calls this a "unit vector for ray in space"
    const eyeY: number = Math.cos(rayAngle);
    // debugger;
    const wallDistance: testDistanceReturn = testDistance(eyeX, eyeY, coordinates);
    return wallDistance;
}

function pixelIndexToBufferIndex(bufferSize: number, pixelsSize: number, pixelIndex: number): number {
    // https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
    // Imagedata needs an 8 bit R value, G value, b value, and a A value;
    if(!(pixelIndex < pixelsSize)) {
        throw new Error("assertion failed");
    }
    // console.assert((pixelIndex % 4) === 0);
    const rawIndex = pixelIndex * 4;
    if(!(rawIndex < bufferSize)) {
        throw new Error("assertion failed");
    }
    return rawIndex;
}

function inPixelBufferBounds(bufferSize: number, bufferPixelIndex: number): boolean {
    // console.assert(bufferPixelIndex < bufferSize);
    if (bufferPixelIndex >= bufferSize) {
        console.error("out of bounds!");
        throw new Error("assertion failed");
        // return false;
    }
    return true;
}

type pixelBufferIndicies = {
    redIndex: number,
    greenIndex: number,
    blueIndex: number,
    alphaIndex: number
}

function bufferPixelElementIndexes(bufferSize: number, bufferPixelIndex: number): pixelBufferIndicies {
    // won't check bounds for red, green, blue, only alpha, because it's the top. 

    // red is the 0th index in this pixel. really does nothing.
    const redIndex = bufferPixelIndex + 0;

    // Green is the 1st index in this pixel.
    const greenIndex = bufferPixelIndex + 1;
    
    // Blue is the 2nd index in this pixel.
    const blueIndex = bufferPixelIndex + 2;

    // Alpha is the 3rd index in this pixel.
    const alphaIndex = bufferPixelIndex + 3;
    if (!inPixelBufferBounds(bufferSize, alphaIndex)) {
        throw new Error("out of bounds!");
    }

    // These will only fire in case of weird overflow problems 
    if(!(redIndex < greenIndex)) {
        throw new Error("assertion failed");
    }
    if(!(greenIndex < blueIndex)) {
        throw new Error("assertion failed");
    }
    if(!(blueIndex < alphaIndex)) {
        throw new Error("assertion failed");
    }
    return {redIndex, greenIndex, blueIndex, alphaIndex};
}


function drawCeiling(wallDistance: testDistanceReturn, indexes: pixelBufferIndicies) {
    if (wallDistance.outOfBounds) {
        // Debug bad draws if they ever happen
        screenBuffer[indexes.redIndex] = 255;
        screenBuffer[indexes.greenIndex] = 255;
        screenBuffer[indexes.blueIndex] = 100;
        screenBuffer[indexes.alphaIndex] = 255;
    }
    else {
        // screenBuffer[screenBufferIndex] = 0;
        screenBuffer[indexes.redIndex] = 0;
        screenBuffer[indexes.greenIndex] = 100;
        screenBuffer[indexes.blueIndex] = 0;
        screenBuffer[indexes.alphaIndex] = 255;
        // screenBuffer[indexes.alphaIndex] = brightness;
    }

}

function drawObjects(wallDistance: testDistanceReturn, indexes: pixelBufferIndicies) {
    if (wallDistance.outOfBounds) {
        // Debug bad draws if they ever happen
        screenBuffer[indexes.redIndex] = 255;
        screenBuffer[indexes.greenIndex] = 255;
        screenBuffer[indexes.blueIndex] = 100;
        screenBuffer[indexes.alphaIndex] = 255;
    }
    else {
        if (wallDistance.objectHitType === HIT_DYN) {
            // console.log("dyn draw");
            screenBuffer[indexes.redIndex] = 255;
            screenBuffer[indexes.greenIndex] = 255;
            screenBuffer[indexes.blueIndex] = 0;
            screenBuffer[indexes.alphaIndex] = 255;
        }
        else {
            const brightness: number = Math.floor(((wallDistance.distance)/VIEW_DISTANCE) * 255);
            screenBuffer[indexes.redIndex] = 100;
            screenBuffer[indexes.greenIndex] = 100;
            screenBuffer[indexes.blueIndex] = 100;
            screenBuffer[indexes.alphaIndex] = brightness;
        }
    }

}

function drawFloor(wallDistance: testDistanceReturn, indexes: pixelBufferIndicies) {
    if (wallDistance.outOfBounds) {
        // Debug bad draws if they ever happen
        screenBuffer[indexes.redIndex] = 255;
        screenBuffer[indexes.greenIndex] = 255;
        screenBuffer[indexes.blueIndex] = 100;
        screenBuffer[indexes.alphaIndex] = 255;
    }
    else {
        screenBuffer[indexes.redIndex] = 100;
        screenBuffer[indexes.greenIndex] = 0;
        screenBuffer[indexes.blueIndex] = 0;
        screenBuffer[indexes.alphaIndex] = 255;
        // screenBuffer[indexes.alphaIndex] = brightness;
    }

}

function drawPixels(y: number, ceiling: number, floor: number, wallDistance: testDistanceReturn, indexes: pixelBufferIndicies) {
    if (y < ceiling) {
        drawCeiling(wallDistance, indexes);
    }
    else if ((y > ceiling) && (y <= floor)) {
        drawObjects(wallDistance, indexes);
    }
    else {
        drawFloor(wallDistance, indexes)
    }
}


// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
class Canvas extends React.Component<CanvasProps, CanvasState> {
    state: any;
    ctx: any;
    offscreenContext: OffscreenCanvasRenderingContext2D;
    lastBitmapRenderedBool: boolean;
    bitmap_0: ImageBitmap | null;
    bitmap_1: ImageBitmap | null;
    x: number;
    y: number;
    timer: any;
    player: Player;

    constructor(props: CanvasProps) {
        super(props);
        this.state = defaultCanvasState;
        this.ctx = getCanvasCtx();
        this.offscreenContext = getOffscreenContext(400, 400);
        this.lastBitmapRenderedBool = false;
        this.bitmap_0 = null;
        this.bitmap_1 = null;
    
        this.x = 0;
        this.y = 0;
        this.player = defaultPlayer;
    
    }

    renderToContextFromBitmap() {
        this.offscreenContext.fillText("Not implemented yet.", this.x, this.y)
        this.offscreenContext.fillText(".tey detnemelpmi toN", (-this.x)+gameCanvas_0.width, (-this.y)+gameCanvas_0.height)
        this.x = ((this.x + 1) % 400);
        this.y = ((this.y + 2) % 400);

        if (offscreenCanvas === null) {
            console.warn("null canvas");
            return;
        }
        if (this.lastBitmapRenderedBool) {
            this.bitmap_0 = offscreenCanvas.transferToImageBitmap();
            this.ctx.transferFromImageBitmap(this.bitmap_0)    
        }
        else {
            this.bitmap_1 = offscreenCanvas.transferToImageBitmap();
            this.ctx.transferFromImageBitmap(this.bitmap_1)
        }
        this.lastBitmapRenderedBool = !(this.lastBitmapRenderedBool);

    }

    renderToContextFromUint8Clamped(data: ImageData) {
        if (offscreenCanvas === null) {
            console.error("null canvas");
            return;
        }
        this.ctx.putImageData(data, 0, 0)
        if (this.lastBitmapRenderedBool) {
            // this.bitmap_0
        }
    }

    castRays() {
        for (let i = 0; i < CANVAS_WIDTH; i++) {
            const angleOfThisRay = rayAngle(this.player.coordinates.angle, i);
            // raysCasted.push(angleOfThisRay);
            const wallDistance: testDistanceReturn = distanceToWall(angleOfThisRay, this.player.coordinates);
            const ceiling: number = (CANVAS_HEIGHT/2) - (CANVAS_HEIGHT / wallDistance.distance);
            const floor = CANVAS_HEIGHT - ceiling;
            for (let y = 0; y < CANVAS_HEIGHT; y++) {
                const screenBufferRowPixelIndex = (y * CANVAS_WIDTH);
                const screenBufferPixelIndex = (screenBufferRowPixelIndex + i);
                const screenBufferIndex =
                    pixelIndexToBufferIndex(screenBufferSize, CANVAS_PIXELS, screenBufferPixelIndex);
                
                const indexes = bufferPixelElementIndexes(screenBufferSize, screenBufferIndex);
                drawPixels(y, ceiling, floor, wallDistance, indexes)
            }
        }
    }

    step() {
        if (offscreenCanvas === null) {
            console.warn("null canvas");
            return;
        }

        this.castRays();

        const data: ImageData = new ImageData(screenBuffer, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.renderToContextFromUint8Clamped(data)
        // this.offscreenContext.clearRect(0,0, 400, 400);
        // this.renderToContextFromBitmap();
    }

    componentDidMount() {
        if ((this.ctx === null) || (this.offscreenContext === null) || (offscreenCanvas === null)) {
            return;
        }
        // this.offscreenContext.fillText("Not implemented yet.", 200, 200)
        const screenBufferSize = CANVAS_PIXELS *4
        const screenBuffer: Uint8ClampedArray = new Uint8ClampedArray(screenBufferSize);
        for (let i = 0; i < screenBufferSize; i++) {
            screenBuffer[i] = Math.floor(Math.random() * 255);
        }
        const data: ImageData = new ImageData(screenBuffer, CANVAS_WIDTH, CANVAS_HEIGHT);
        console.log("render junk screen to show we can render things")
        this.renderToContextFromUint8Clamped(data);

        this.timer = setInterval(this.step.bind(this), 1);
        gameCanvas_0.hidden = false;
        // this.renderToContextFromBitmap();

        document.addEventListener('keydown', this.keydown)

    }

    keydown = (event: KeyboardEvent) => {
        // Ideally we'd track elapsed time, but not right now.
        switch (event.key) {
            case ('a'):
                this.player.coordinates.angle -= 0.1;
                event.preventDefault();
                break;
            case ('d'):
                this.player.coordinates.angle += 0.1;
                event.preventDefault();
                break;
            case ('w'):
                this.player.coordinates.x += (Math.sin(this.player.coordinates.angle) * 0.5);
                this.player.coordinates.y += (Math.cos(this.player.coordinates.angle) * 0.5);
                event.preventDefault();
                break;
            case (' '):
                event.preventDefault();
                // const shootAngle = middleAngleFOV(this.player.coordinates.angle);
                // const eyeX: number = Math.sin(shootAngle); // javidX9 calls this a "unit vector for ray in space"
                // const eyeY: number = Math.cos(shootAngle);
                const SHOOT_ANGLE_RANGE = (CANVAS_WIDTH/80);
                const SHOOT_ANGLE_START = Math.floor((CANVAS_WIDTH/2) - SHOOT_ANGLE_RANGE);
                const SHOOT_ANGLE_END = Math.floor((CANVAS_WIDTH/2) + SHOOT_ANGLE_RANGE)
                for (let i = SHOOT_ANGLE_START; i < SHOOT_ANGLE_END; i++) {
                    const angleOfThisRay = rayAngle(this.player.coordinates.angle, i);
                    // console.log(`Player at angle,x,y: '${this.player.coordinates.angle},${this.player.coordinates.x},${this.player.coordinates.y}' shooting angle,x,y: '${shootAngle},${eyeX},${eyeY}'` )
                    console.log(`Player at angle,x,y: '${this.player.coordinates.angle},${this.player.coordinates.x},${this.player.coordinates.y}'` )
                    // debugger;
                    const testHitDistance = distanceToWall(angleOfThisRay, this.player.coordinates);
                    
                    const sine = Math.sin(angleOfThisRay);
                    const yDiff = sine/testHitDistance.distance;
                    // const y = //sine = opposite over hypotenuse
                    // sine/hypotenuse = opposite
    
                    // const x = // cosine = adjacent over hypotenuse
                    // cosine/hypotenuse = adjacent
                    const cosine = Math.cos(angleOfThisRay);
                    const xDiff = cosine/testHitDistance.distance;
                    console.log(`sine: ${sine}, cosine: ${cosine}`);
                    console.log(`xdiff: ${xDiff}, ydiff: ${yDiff}`)
    
                    // const test = distanceToWall(shootAngle, this.player.coordinates);
                    // debugger;
                    if (testHitDistance.objectHitType === HIT_DYN) {
                        alert("good hit!");
                        // debugger;
                        // break;
                        return;
                    }
                    else {
                        console.log(`Miss! ${testHitDistance.objectHitType}`);
                        // debugger;
                    }
    
                    // const targetX: number = this.player.coordinates.x + (Math.sin(shootAngle) * testHitDistance.distance);
    
                    // const targetX: number = (testHitDistance.distance + (testHitDistance.distance * Math.sin(testHitDistance.distance))) + this.player.coordinates.x;
                    // const targetX: number = Math.round((testHitDistance.distance * Math.sin(testHitDistance.distance)));
                    const targetX: number = this.player.coordinates.x - Math.sin(testHitDistance.distance);
                    
    
                    // const targetY: number = this.player.coordinates.y + (Math.cos(shootAngle) * testHitDistance.distance);
                    // const targetY: number = (testHitDistance.distance + (testHitDistance.distance * Math.cos(testHitDistance.distance))) + this.player.coordinates.y;
                    // const targetY: number = Math.round(testHitDistance.distance + (testHitDistance.distance * Math.cos(testHitDistance.distance)));
                    const targetY: number = this.player.coordinates.y - Math.cos(testHitDistance.distance);
    
                    console.log(`target x, y: '${targetX},${targetY}'`);
                    // debugger;

                }
        }

    }

    componentWillUnmount() {
        clearInterval(this.timer)
        gameCanvas_0.hidden = true;
        // this.bitmap_0.close();
        // this.bitmap_1.close();
        document.removeEventListener('keydown', this.keydown);
    }

    render() {
        return(null)
    }

}

class _Play extends React.Component<PlayProps, PlayState> {
    render() {
        return (
            <Canvas/>
        );
    }
}

export const Play = connect(null, null)(_Play);