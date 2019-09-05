import React from 'react';
import { connect } from 'react-redux';
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

// see also: https://github.com/mdn/canvas-raycaster

function levelMapArray(): Uint8ClampedArray {
    const LEVEL_MAP: string = '' +
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
    const buf = new Uint8ClampedArray(LEVEL_MAP.length);
    for (let i = 0; i < LEVEL_MAP.length; i++) {
        console.assert(LEVEL_MAP.charCodeAt(i) <= 255);
        console.assert(LEVEL_MAP.charCodeAt(i) >= 0);
        buf[i] = LEVEL_MAP.charCodeAt(i);
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

const screenBuffer: Uint8ClampedArray = new Uint8ClampedArray(screenBufferSize);


interface CanvasProps {

}

type PlayerCoordinates = {
    x: number,
    y: number,
    angle: number
}

interface Player {
    coordinates: PlayerCoordinates,
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

const FIELD_OF_VIEW: number = (Math.PI/2)
const VIEW_DISTANCE: number = 16;

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

function ifHitObject(testY: number, testX: number): boolean {
    const index = Math.floor((testY * MAP_WIDTH) + testX);
    if (LEVEL_MAP[index] === WALL_CHAR_CODE) {
        // console.log('Hit object at x:', testX, ', y: ', testY, "index: ", index);
        return true;
    }
    // console.log('NO object at x:', testX, ', y: ', testY, "index: ", index);
    return false;
}

type testDistanceReturn = {
    outOfBounds: boolean,
    distance: number;
}
function testDistance(eyeX: number, eyeY: number, playerCoordinates: PlayerCoordinates): testDistanceReturn {
    let distanceToWall: number = 0;
    // let outOfBounds = false;
    while (distanceToWall < VIEW_DISTANCE) {
        const testX: number = Math.floor((eyeX * distanceToWall) + playerCoordinates.x);
        const testY: number = Math.floor((eyeY * distanceToWall) + playerCoordinates.y);
        if (outOfBounds(testX, testY)) {
            // console.warn("out of bounds, currently no handling.")
            // debugger;
            distanceToWall = VIEW_DISTANCE;
            return {
                outOfBounds: true,
                distance: distanceToWall
            }
            break;
        }
        if(ifHitObject(testX, testY)) {
            break;
        }
        distanceToWall += 0.1;
    }
    return {
        outOfBounds: false,
        distance: distanceToWall
    };
    
}

function distanceToWall(rayAngle: number, coordinates: PlayerCoordinates): testDistanceReturn {
    const eyeX: number = Math.sin(rayAngle); // javidX9 calls this a "unit vector for ray in space"
    const eyeY: number = Math.cos(rayAngle);
    // debugger;
    const wallDistance: testDistanceReturn = testDistance(eyeX, eyeY, coordinates);
    return wallDistance;
}

function pixelIndexToBufferIndex(bufferSize: number, pixelsSize: number, pixelIndex: number): number {
    // https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
    // Imagedata needs an 8 bit R value, G value, b value, and a A value;
    console.assert(pixelIndex < pixelsSize);
    // console.assert((pixelIndex % 4) === 0);
    const rawIndex = pixelIndex * 4;
    console.assert(rawIndex < bufferSize);
    return rawIndex;
}

function inPixelBufferBounds(bufferSize: number, bufferPixelIndex: number): boolean {
    console.assert(bufferPixelIndex < bufferSize);
    if (bufferPixelIndex >= bufferSize) {
        console.error("out of bounds!");
        return false;
    }
    return true;
}

function pixelBufferIndexToRedIndex(bufferSize: number, bufferPixelIndex: number): number {
    // red is the 0th index in this pixel. really does nothing.
    const redIndex = bufferPixelIndex + 0;
    if (!inPixelBufferBounds(bufferSize, redIndex)) {
        throw new Error("out of bounds");
    }
    return redIndex;
}

function pixelBufferIndexToGreenIndex(bufferSize: number, bufferPixelIndex: number): number {
    // Green is the 1st index in this pixel.
    const greenIndex = bufferPixelIndex + 1;
    if (!inPixelBufferBounds(bufferSize, greenIndex)) {
        throw new Error("out of bounds!");
    }
    return greenIndex;
}

function pixelBufferIndexToBlueIndex(bufferSize: number, bufferPixelIndex: number): number {
    // Blue is the 2nd index in this pixel.
    const blueIndex = bufferPixelIndex + 2;
    if (!inPixelBufferBounds(bufferSize, blueIndex)) {
        throw new Error("out of bounds!");
    }
    return blueIndex;
}

function pixelBufferIndexToAlphaIndex(bufferSize: number, bufferPixelIndex: number): number {
    // Alpha is the 3rd index in this pixel.
    const alphaIndex = bufferPixelIndex + 3;
    if (!inPixelBufferBounds(bufferSize, alphaIndex)) {
        throw new Error("out of bounds!");
    }
    return alphaIndex;
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

    step() {
        if (offscreenCanvas === null) {
            console.warn("null canvas");
            return;
        }

    
        const raysCasted = [];

        for (let i = 0; i < CANVAS_WIDTH; i++) {
            const angleOfThisRay = rayAngle(this.player.coordinates.angle, i);
            raysCasted.push(angleOfThisRay);
            const wallDistance: testDistanceReturn = distanceToWall(angleOfThisRay, this.player.coordinates);
            const ceiling: number = (CANVAS_HEIGHT/2) - (CANVAS_HEIGHT / wallDistance.distance);
            const floor = CANVAS_HEIGHT - ceiling;
            for (let y = 0; y < CANVAS_HEIGHT; y++) {
                const screenBufferRowPixelIndex = (y * CANVAS_WIDTH);
                const screenBufferPixelIndex = (screenBufferRowPixelIndex + i);
                const screenBufferIndex =
                    pixelIndexToBufferIndex(screenBufferSize, CANVAS_PIXELS, screenBufferPixelIndex);
                const redIndex = pixelBufferIndexToRedIndex(screenBufferSize, screenBufferIndex);
                const greenIndex = pixelBufferIndexToGreenIndex(screenBufferSize, screenBufferIndex);
                const blueIndex = pixelBufferIndexToBlueIndex(screenBufferSize, screenBufferIndex);
                const alphaIndex = pixelBufferIndexToAlphaIndex(screenBufferSize, screenBufferIndex);
                // const 
                if (y < ceiling) {
                    // screenBuffer[screenBufferIndex] = 0;
                    screenBuffer[redIndex] = 0;
                    screenBuffer[greenIndex] = 100;
                    screenBuffer[blueIndex] = 0;
                    screenBuffer[alphaIndex] = 255;
                }

                else if ((y > ceiling) && (y <= floor)) {
                    if (wallDistance.outOfBounds) {
                        screenBuffer[redIndex] = 255;
                        screenBuffer[greenIndex] = 255;
                        screenBuffer[blueIndex] = 100;
                        screenBuffer[alphaIndex] = 255;
                    }
                    else {
                        screenBuffer[redIndex] = 100;
                        screenBuffer[greenIndex] = 100;
                        screenBuffer[blueIndex] = 100;
                        const brightness: number = Math.floor((wallDistance.distance/VIEW_DISTANCE) * 255);
                        screenBuffer[alphaIndex] = brightness;
                    }
                }
                else {
                    screenBuffer[redIndex] = 100;
                    screenBuffer[greenIndex] = 0;
                    screenBuffer[blueIndex] = 0;
                    screenBuffer[alphaIndex] = 255;
                }
            }
            
        }
        // console.log("casted rays:", raysCasted);
        const data: ImageData = new ImageData(screenBuffer, CANVAS_WIDTH, CANVAS_HEIGHT);
        // debugger;
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

        this.timer = setInterval(this.step.bind(this), 10);
        gameCanvas_0.hidden = false;
        // this.renderToContextFromBitmap();

        document.addEventListener('keydown', this.keydown)

    }

    keydown = (event: KeyboardEvent) => {
        // Ideally we'd track elapsed time, but not right now.
        switch (event.key) {
            case ('a'):
                this.player.coordinates.angle -= 0.1;
                break;
            case ('d'):
                this.player.coordinates.angle += 0.1;
                break;
            case ('w'):
                this.player.coordinates.x += (Math.sin(this.player.coordinates.angle) * 0.1);
                this.player.coordinates.y += (Math.cos(this.player.coordinates.angle) * 0.1);

        }

    }

    componentWillUnmount() {
        clearInterval(this.timer)
        gameCanvas_0.hidden = true;
        // this.bitmap_0.close();
        // this.bitmap_1.close();
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