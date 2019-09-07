import React from 'react';
import { connect } from 'react-redux';
import {Unsubscribe} from 'redux';

import {setCurrentScore, setPlaying} from '../Actions';
import {store} from '../index';

interface PlayState {
}

interface PlayProps {
    readonly currentUser: string,
    readonly currentScore: number
    readonly playing: boolean,
    setPlaying: any,
    setCurrentScore: any
}

interface CanvasState {
    // ctx: CanvasRenderingContext2D | null
}

interface CanvasData {
    CANVAS_CONTAINER_ID: string,
    CANVAS_ID: string,
    CANVAS_WIDTH: number,
    CANVAS_HEIGHT: number,
    CANVAS_PIXELS: number,
    CANVAS_CONTAINER: HTMLDivElement,
    gameCanvas_0: HTMLCanvasElement,
    offscreenCanvas: OffscreenCanvas|null
}

interface Map {
    LEVEL_MAP: Uint8ClampedArray,
    WALL_CHAR_CODE: number,
    PLAYER_CHAR_CODE: number
    MAP_WIDTH: number,
    MAP_HEIGHT: number
}

interface Colors {
    red: number,
    green: number,
    blue: number,
    alpha: number
}


type pixelBufferIndicies = {
    redIndex: number,
    greenIndex: number,
    blueIndex: number,
    alphaIndex: number
}

type testDistanceReturn = {
    outOfBounds: boolean,
    objectHitType: number,
    distance: number,
    coordinates: ObjectCoordinateVector;
}

type hitCheck = {
    hit: boolean,
    testReturn: testDistanceReturn
}

type ObjectCoordinateVector = {
    x: number,
    y: number,
    angle: number
}

interface Player {
    coordinates: ObjectCoordinateVector,
    score: number
    // fieldOfView: number
}

interface CanvasProps {
    // currentScore: number
    setCurrentScore: any,
    setPlaying: any
}

interface GameState {
    screenBuffer: Uint8ClampedArray,
    objectsOnMap: Array<ObjectCoordinateVector>,
    drawDarkAimPointFlipFlop: boolean,
    MAP: Map
}

const DEFAULT_PLAYER: Player = {
    coordinates: {
        x: 2,
        y: 2,
        angle: Math.PI/2
    },
    score: 0
}
const DEFAULT_CANVAS_STATE: CanvasState = {
    // ctx: null
}

// const DEFAULT_PLAY_STATE: PlayState = {
//     playing: true
// }

const CANVAS: CanvasData = initCanvasData();

// Has to be done after init.
CANVAS.gameCanvas_0.id = canvasIDString(0);
const FIELD_OF_VIEW: number = (Math.PI/2)
const VIEW_DISTANCE: number = 16;


const HIT_ERR = 0;
const HIT_WALL = 1;
const HIT_DYN = 2;

const BEEP_BOOP_SOUNDS: Array<HTMLAudioElement> = initBeepBoopSounds();
const ALL_SOUND_EFFECTS: Array<HTMLAudioElement> = initAllSoundEffects();


const LEVEL_MAP_STRING: string = '' +
'################################' +
'#                              #' +
'#              #######         #' +
'#   #              #           #' +
'#   #         ##           #   #' +
'#            #   #             #' +
'#           #                  #' +
'#          #      ##           #' +
'#                          #   #' +
'#          ##  ######          #' +
'#          #        #          #' +
'#          ###   #  #          #' +
'#          #        #          #' +
'#           #######            #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#        #        ###          #' +
'#         #                    #' +
'#          #                   #' +
'#    #      #                  #' +
'#            #                 #' +
'#             #                #' +
'#       #      #               #' +
'#        ##   ###              #' +
'#                #             #' +
'#                 #  #         #' +
'#                  #           #' +
'#    ##             #          #' +
'#                    #         #' +
'#                              #' +
'################################';

function initMap(): Map {
    const MAP: Map = {
        LEVEL_MAP: levelMapArray(),
        WALL_CHAR_CODE: wallCharCode(),
        PLAYER_CHAR_CODE: playerCharCode(),
        MAP_WIDTH: 32,
        MAP_HEIGHT: 32
    }
    console.assert(MAP.MAP_WIDTH === MAP.MAP_HEIGHT);
    console.assert((MAP.MAP_WIDTH * MAP.MAP_HEIGHT) === LEVEL_MAP_STRING.length)
    return MAP;
}

// https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
// Imagedata needs an 8 bit R value, G value, b value, and a A value;
const SCREEN_BUFFER_SIZE = CANVAS.CANVAS_PIXELS *4

function initGameState(): GameState {
    const objectsOnMap: Array<ObjectCoordinateVector> = [];
    const MAP: Map = initMap();
    addToObjects(MAP, objectsOnMap, {
        x: 10,
        y: 8,
        angle: Math.PI/4
    })
        addToObjects(MAP, objectsOnMap, {
        x: 22,
        y: 14,
        angle: Math.PI/4
    })
    addToObjects(MAP, objectsOnMap, {
        x: 26,
        y: 17,
        angle: Math.PI/4
    })
    addToObjects(MAP, objectsOnMap, {
        x: 29,
        y: 2,
        angle: Math.PI/4
    })

    // Allocate once please, not every render.
    const screenBuffer: Uint8ClampedArray = new Uint8ClampedArray(SCREEN_BUFFER_SIZE);
    const drawDarkAimPointFlipFlop: boolean = false;

    const state: GameState = {
        objectsOnMap: objectsOnMap,
        screenBuffer: screenBuffer,
        drawDarkAimPointFlipFlop: drawDarkAimPointFlipFlop,
        MAP: MAP
    }

    return state;
}

function canvasIDString(index: number): string {
    return `${CANVAS.CANVAS_ID}-${index}`;
}

function initCanvasElement(canvas: HTMLCanvasElement, width: number, height: number, hidden: boolean): void {
    canvas.width = width;
    canvas.height = height;
    canvas.hidden = hidden;
}

function randomSoundPlay(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): any {
    event.preventDefault();
    randomSound().play();
}

function initCanvasData(): CanvasData {
    const CANVAS_WIDTH: number = 400;
    const CANVAS_HEIGHT: number = 400;
    const CANVAS_PIXELS: number = (CANVAS_WIDTH * CANVAS_HEIGHT);
    const CANVAS_CONTAINER_ID: string = "game-canvas-container";
    const container: HTMLDivElement = document.getElementById(CANVAS_CONTAINER_ID) as HTMLDivElement;
    const gameCanvas_0: HTMLCanvasElement = document.createElement('canvas');
    // gameCanvas_1.id = canvasIDString(1);
    
    initCanvasElement(gameCanvas_0, CANVAS_WIDTH, CANVAS_HEIGHT, false);
    // initCanvas(gameCanvas_1, 400, 400, true);
    container.appendChild(gameCanvas_0);
    
    return {
        CANVAS_CONTAINER_ID: CANVAS_CONTAINER_ID,
        CANVAS_ID: "game-canvas-element-id",
        CANVAS_WIDTH: CANVAS_WIDTH,
        CANVAS_HEIGHT: CANVAS_HEIGHT,
        CANVAS_PIXELS: CANVAS_PIXELS,
        CANVAS_CONTAINER: container,
        gameCanvas_0: gameCanvas_0,
        offscreenCanvas: null
    }
}

function initBeepBoopSounds(): Array<HTMLAudioElement> {
    const BEEP_BOOP_SOUNDS = [];

    for (let i = 0; true; i++) {
        const beepBoopSound = document.getElementById(`beepboop-${i}`) as HTMLAudioElement;
        
        if (beepBoopSound === null) {
            break;
        }
        console.warn(beepBoopSound);
    }
    // const beepBoopSound: HTMLAudioElement = new Audio('../../public/rb_one_to_many_06031_boop_0.m4a');
    const beepBoopSound_0 = document.getElementById("beepboop-0") as HTMLAudioElement;
    BEEP_BOOP_SOUNDS.push(beepBoopSound_0);

    const beepBoopSound_1 = document.getElementById("beepboop-1") as HTMLAudioElement;
    BEEP_BOOP_SOUNDS.push(beepBoopSound_1);
    return BEEP_BOOP_SOUNDS;
};

function initAllSoundEffects(): Array<HTMLAudioElement> {
    const SOUND_EFFECTS: Array<HTMLAudioElement> = [];
    const elements = document.querySelectorAll('.evans-soundeffect')
     elements.forEach(element => {
         SOUND_EFFECTS.push(element as HTMLAudioElement)
     })
     return SOUND_EFFECTS;
}

function randomBeepBoop(): HTMLAudioElement {
    const rand = Math.random()*BEEP_BOOP_SOUNDS.length;
    const index = Math.floor(rand);
    const sound = BEEP_BOOP_SOUNDS[index];
    if (sound === null) {
        throw new Error("Sound not valid");
    }
    return sound;
}

function randomSound(): HTMLAudioElement {
    const rand = Math.random()*ALL_SOUND_EFFECTS.length;
    const index = Math.floor(rand);
    const sound = ALL_SOUND_EFFECTS[index];
    if (sound === null) {
        throw new Error("Sound not valid");
    }
    return sound;
}


function getCanvasCtx(): CanvasRenderingContext2D {
    const canvas: HTMLCanvasElement = document.getElementById(canvasIDString(0)) as HTMLCanvasElement;
    if (canvas === null) {
        console.error("null canvas")
        throw new Error("null canvas");
    }
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (ctx === null) {
        console.error("null context");
        throw new Error("null context");
    }
    return ctx
}

function getOffscreenContext(width: number, height: number): OffscreenCanvasRenderingContext2D {
    CANVAS.offscreenCanvas = new OffscreenCanvas(width, height);
    const context = CANVAS.offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D | null;
    if (context === null) {
        console.error("null context")
        throw new Error();
    }
    return context;
}

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

function playerCharCode(): number {
    const X: string = 'X';
    return X.charCodeAt(0);
}

function findDynObject(objectsOnMap: Array<ObjectCoordinateVector>, objectCoordinates: ObjectCoordinateVector): number | null {
    for (let i = 0; i < objectsOnMap.length; i++) {
        if ((objectsOnMap[i].x === objectCoordinates.x) && (objectsOnMap[i].y === objectCoordinates.y)) {
            return i;
        }
    }
    return null;
}

function addToObjects(MAP: Map, objectsOnMap: Array<ObjectCoordinateVector>, objectCoordinates: ObjectCoordinateVector) {
    if (outOfBounds(MAP, objectCoordinates.x, objectCoordinates.y)) {
        throw new Error("Object out of bounds!");
    }
    if (ifHitWall(MAP, objectCoordinates.y, objectCoordinates.x)) {
        throw new Error("Object in wall. Huh?");
    }
    if (findDynObject(objectsOnMap, objectCoordinates) !== null) {
        console.error("already an object there, not adding.");
        return;
    }
    objectsOnMap.push(objectCoordinates);
}

function removeFromObjects(MAP: Map, objectsOnMap: Array<ObjectCoordinateVector>, objectCoordinates: ObjectCoordinateVector) {
    if (outOfBounds(MAP, objectCoordinates.x, objectCoordinates.y)) {
        throw new Error("Object out of bounds!");
    }
    if (ifHitWall(MAP, objectCoordinates.y, objectCoordinates.x)) {
        throw new Error("Tried to remove a wall wall. Huh?");
    }
    let index = findDynObject(objectsOnMap, objectCoordinates);
    if (index === null) {
        throw new Error("Dynamic object not found!")
    }
    const removed = objectsOnMap.splice(index, 1);
    console.assert(removed.length === 1);
    console.assert(objectCoordinates.x === removed[0].x);
    console.assert(objectCoordinates.y === removed[0].y);
}

function rayAngle(playerAngle: number, offset: number): number {
    const middleAngle = (FIELD_OF_VIEW/2);
    const FOVStart = (playerAngle) - middleAngle;
    const fractionOfScreen = (offset/CANVAS.CANVAS_WIDTH);
    const FOVEnd = fractionOfScreen * FIELD_OF_VIEW;
    const rayAngleReturn = FOVStart + FOVEnd;
    return rayAngleReturn;
}

function outOfBounds(MAP: Map, testX: number, testY: number): boolean {
    if (testX < 0) {
        return true;
    }
    if (testX >= MAP.MAP_WIDTH) {
        return true;
    }
    if (testY < 0) {
        return true;
    }
    if (testY >= MAP.MAP_HEIGHT) {
        return true;
    }
    return false;
}

function clampBounds(MAP: Map, coordinates: ObjectCoordinateVector): ObjectCoordinateVector {
    if (coordinates.x < 1) {
        // debugger;
        coordinates.x = 1;
    }
    if (coordinates.x > MAP.MAP_WIDTH - 1) {
        // debugger;
        coordinates.x = MAP.MAP_WIDTH - 1;
    }
    if (coordinates.y < 1) {
        // debugger;
        coordinates.y = 1;
    }
    if (coordinates.y > MAP.MAP_HEIGHT -1) {
        // debugger;
        coordinates.y = MAP.MAP_HEIGHT -1;
    }
    // console.log(coordinates.x, coordinates.y, MAP.MAP_WIDTH, MAP.MAP_HEIGHT);
    return coordinates;
}

function ifHitWall(MAP: Map, testY: number, testX: number): boolean {
    const testYIndex = (testY * MAP.MAP_WIDTH);
    const index = testYIndex + testX;
    if (MAP.LEVEL_MAP[index] === MAP.WALL_CHAR_CODE) {
        // console.log('Hit object at x:', testX, ', y: ', testY, "index: ", index);
        return true;
    }
    // console.log('NO object at x:', testX, ', y: ', testY, "index: ", index);
    return false;
}

function hitDynObject(objectsOnMap: Array<ObjectCoordinateVector>, testX: number, testY: number): boolean {
    for (let i = 0; i < objectsOnMap.length; i++) {
        if ((objectsOnMap[i].x === testX) && (objectsOnMap[i].y === testY)) {
            return true;
        }
    }
    return false;
}

function checkHits(MAP: Map, objectsOnMap: Array<ObjectCoordinateVector>, testX: number, testY: number, distanceToWall: number): hitCheck {
    if (outOfBounds(MAP, testX, testY)) {
        // console.warn("out of bounds, currently no handling.")
        // debugger;
        distanceToWall = VIEW_DISTANCE;
        console.warn("out of bounds");
        return {
            hit: true,
            testReturn: {
                outOfBounds: true,
                objectHitType: HIT_ERR,
                distance: distanceToWall,
                coordinates: {
                    x: testX,
                    y: testY,
                    angle: 0
                }
            }
        };
    }
    if (hitDynObject(objectsOnMap, testX, testY)) {
        // debugger;
        return {
            hit: true,
            testReturn: {
                outOfBounds: false,
                objectHitType: HIT_DYN,
                distance: distanceToWall,
                coordinates: {
                    x: testX,
                    y: testY,
                    angle: 0
                }
            }
        };
    }
    if(ifHitWall(MAP, testX, testY)) {
        return {
            hit: true,
            testReturn: {
                outOfBounds: false,
                objectHitType: HIT_WALL,
                distance: distanceToWall,
                coordinates: {
                    x: testX,
                    y: testY,
                    angle: 0
                }
            }
        };
    }
    return {
        hit: false,
        testReturn: {
                outOfBounds: false,
                objectHitType: HIT_ERR,
                distance: distanceToWall,
                coordinates: {
                    x: testX,
                    y: testY,
                    angle: 0
                }
        }
    };
}

function testDistance(MAP: Map, objectsOnMap: Array<ObjectCoordinateVector>, eyeX: number, eyeY: number, playerCoordinates: ObjectCoordinateVector): testDistanceReturn {
    let thisDistanceToWall: number = 0;
    // let outOfBounds = false;
    while (thisDistanceToWall < VIEW_DISTANCE) {
        const testX: number = Math.floor((eyeX * thisDistanceToWall) + playerCoordinates.x);
        const testY: number = Math.floor((eyeY * thisDistanceToWall) + playerCoordinates.y);
        if (outOfBounds(MAP, testX, testY)) {
            break;
        }
        const hit = checkHits(MAP, objectsOnMap, testX, testY, thisDistanceToWall);
        if (hit.hit) {
            return hit.testReturn;
        }
        thisDistanceToWall += 0.1;
    }
    // console.warn("max distance fallthrough?");
    return {
        outOfBounds: false,
        objectHitType: HIT_ERR,
        distance: thisDistanceToWall,
        coordinates: {
            x: -1,
            y: -1,
            angle: 0
        }
    };
}

function distanceToWall(MAP: Map, objectsOnMap: Array<ObjectCoordinateVector>, rayAngle: number, coordinates: ObjectCoordinateVector): testDistanceReturn {
    const eyeX: number = Math.sin(rayAngle); // javidX9 calls this a "unit vector for ray in space"
    const eyeY: number = Math.cos(rayAngle);
    // debugger;
    const wallDistance: testDistanceReturn = testDistance(MAP, objectsOnMap, eyeX, eyeY, coordinates);
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

function drawCeiling(screenBuffer: Uint8ClampedArray, wallDistance: testDistanceReturn, indexes: pixelBufferIndicies) {
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

function drawObjects(screenBuffer: Uint8ClampedArray, wallDistance: testDistanceReturn, indexes: pixelBufferIndicies) {
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

function drawFloor(screenBuffer: Uint8ClampedArray, wallDistance: testDistanceReturn, indexes: pixelBufferIndicies) {
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

function drawAimPoint(gameState: GameState){
    const y = (CANVAS.CANVAS_HEIGHT/2)
    const screenBufferRowPixelIndex = (y * CANVAS.CANVAS_WIDTH);
    const i = (CANVAS.CANVAS_WIDTH/2);
    const screenBufferPixelIndex = (screenBufferRowPixelIndex + i);
    const screenBufferIndex =
        pixelIndexToBufferIndex(SCREEN_BUFFER_SIZE, CANVAS.CANVAS_PIXELS, screenBufferPixelIndex);
    
    const indexes = bufferPixelElementIndexes(SCREEN_BUFFER_SIZE, screenBufferIndex);
    // drawPixels(y, ceiling, floor, wallDistance, indexes)
    gameState.screenBuffer[indexes.redIndex] = 0;
    gameState.screenBuffer[indexes.greenIndex] = 0;
    gameState.screenBuffer[indexes.blueIndex] = 0;
    if (gameState.drawDarkAimPointFlipFlop) {
        gameState.screenBuffer[indexes.alphaIndex] = 0;
    }
    else {
        gameState.screenBuffer[indexes.alphaIndex] = 255;
    }
    gameState.drawDarkAimPointFlipFlop = (!gameState.drawDarkAimPointFlipFlop);
}

function drawPixels(screenBuffer: Uint8ClampedArray, y: number, ceiling: number, floor: number, wallDistance: testDistanceReturn, indexes: pixelBufferIndicies) {
    if (y < ceiling) {
        drawCeiling(screenBuffer, wallDistance, indexes);
    }
    else if ((y > ceiling) && (y <= floor)) {
        drawObjects(screenBuffer, wallDistance, indexes);
    }
    else {
        drawFloor(screenBuffer, wallDistance, indexes)
    }
}

function renderToContextFromUint8Clamped(data: ImageData, ctx: CanvasRenderingContext2D) {
    if (CANVAS.offscreenCanvas === null) {
        console.error("null canvas");
        return;
    }
    ctx.putImageData(data, 0, 0)
}

function checkShot(MAP: Map, objectsOnMap: Array<ObjectCoordinateVector>, playerCoordinates: ObjectCoordinateVector): testDistanceReturn | null {
    const SHOOT_ANGLE_RANGE = (CANVAS.CANVAS_WIDTH/80);
    const SHOOT_ANGLE_START = Math.floor((CANVAS.CANVAS_WIDTH/2) - SHOOT_ANGLE_RANGE);
    const SHOOT_ANGLE_END = Math.floor((CANVAS.CANVAS_WIDTH/2) + SHOOT_ANGLE_RANGE)
    for (let i = SHOOT_ANGLE_START; i < SHOOT_ANGLE_END; i++) {
        const angleOfThisRay = rayAngle(playerCoordinates.angle, i);
        console.log(`Player at radians,angle,x,y: '${playerCoordinates.angle},${playerCoordinates.angle*(360)},${playerCoordinates.x},${playerCoordinates.y}'` )
        const testHitDistance = distanceToWall(MAP, objectsOnMap, angleOfThisRay, playerCoordinates);
        console.log(`Maybe the target is at: ${testHitDistance.coordinates.x},${testHitDistance.coordinates.y}`)
        if (testHitDistance.objectHitType === HIT_DYN) {
            console.log("good hit!");
            return testHitDistance;
        }
        console.log(`Miss! ${testHitDistance.objectHitType}`);
    }
    return null;
}

function castRays(MAP: Map, objectsOnMap: Array<ObjectCoordinateVector>, screenBuffer: Uint8ClampedArray, playerCoordinates: ObjectCoordinateVector) {
    for (let i = 0; i < CANVAS.CANVAS_WIDTH; i++) {
        const angleOfThisRay = rayAngle(playerCoordinates.angle, i);
        // raysCasted.push(angleOfThisRay);
        const wallDistance: testDistanceReturn = distanceToWall(MAP, objectsOnMap,angleOfThisRay, playerCoordinates);
        const ceiling: number = (CANVAS.CANVAS_HEIGHT/2) - (CANVAS.CANVAS_HEIGHT / wallDistance.distance);
        const floor = CANVAS.CANVAS_HEIGHT - ceiling;
        for (let y = 0; y < CANVAS.CANVAS_HEIGHT; y++) {
            const screenBufferRowPixelIndex = (y * CANVAS.CANVAS_WIDTH);
            const screenBufferPixelIndex = (screenBufferRowPixelIndex + i);
            const screenBufferIndex =
                pixelIndexToBufferIndex(SCREEN_BUFFER_SIZE, CANVAS.CANVAS_PIXELS, screenBufferPixelIndex);
            
            const indexes = bufferPixelElementIndexes(SCREEN_BUFFER_SIZE, screenBufferIndex);
            drawPixels(screenBuffer, y, ceiling, floor, wallDistance, indexes)
        }
    }
}

// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
class _Canvas extends React.Component<CanvasProps, CanvasState> {
    state: any;
    ctx: any;
    offscreenContext: OffscreenCanvasRenderingContext2D;
    animationLoopHandle: any;
    player: Player;
    scoreSubscription: Unsubscribe;
    timeout: any;
    gameState: GameState

    constructor(props: CanvasProps) {
        super(props);
        this.state = DEFAULT_CANVAS_STATE;
        this.ctx = getCanvasCtx();
        this.offscreenContext = getOffscreenContext(400, 400);
        this.player = DEFAULT_PLAYER;
        this.scoreSubscription = store.subscribe(this.updateScore);
        this.gameState = initGameState();
    }

    endPlay = () => {
        this.props.setPlaying(false);
        const jeopardy = document.getElementById('jeopardy-0') as HTMLAudioElement;
        if (jeopardy !== null) {
            jeopardy.play()
        }
    }

    updateScore = () => {
        // From the docs: https://redux.js.org/api/store#getState
        // const previousValue = this.player.score;
        this.player.score = store.getState().currentScore;
        // console.log(`Updated score from ${previousValue} to ${this.player.score}`)
    }

    step() {
        if (CANVAS.offscreenCanvas === null) {
            console.warn("null canvas");
            return;
        }

        castRays(this.gameState.MAP, this.gameState.objectsOnMap, this.gameState.screenBuffer, this.player.coordinates);
        drawAimPoint(this.gameState);
        const data: ImageData = new ImageData(this.gameState.screenBuffer, CANVAS.CANVAS_WIDTH, CANVAS.CANVAS_HEIGHT);

        renderToContextFromUint8Clamped(data, this.ctx)
        this.animationLoopHandle = requestAnimationFrame(this.step.bind(this));
    }

    componentDidMount() {
        console.log("canvas mounted");
        this.gameState = initGameState();
        if ((this.ctx === null) || (this.offscreenContext === null) || (CANVAS.offscreenCanvas === null)) {
            return;
        }
        this.timeout = setTimeout(this.endPlay, 10000);

        // this.animationLoopHandle = setInterval(this.step.bind(this), 1);
        this.animationLoopHandle = requestAnimationFrame(this.step.bind(this));
        CANVAS.gameCanvas_0.hidden = false;
        // this.renderToContextFromBitmap();

        document.addEventListener('keydown', this.keydown)

    }

    turnLeft = (event: KeyboardEvent) => {
        this.player.coordinates.angle -= 0.1;
        event.preventDefault();
        return;
    }

    turnRight = (event: KeyboardEvent) => {
        this.player.coordinates.angle += 0.1;
        event.preventDefault();
        return;
    }

    forward = (event: KeyboardEvent) => {
        randomBeepBoop().play()
        this.player.coordinates.x += (Math.sin(this.player.coordinates.angle) * 0.5);
        this.player.coordinates.y += (Math.cos(this.player.coordinates.angle) * 0.5);
        event.preventDefault();
        return;
    }

    backward = (event: KeyboardEvent) => {
        this.player.coordinates.x -= (Math.sin(this.player.coordinates.angle) * 0.5);
        this.player.coordinates.y -= (Math.cos(this.player.coordinates.angle) * 0.5);
        event.preventDefault();
        return;
    }

    strafeRight = (event: KeyboardEvent) => {
        this.player.coordinates.x += (Math.sin(this.player.coordinates.angle + (Math.PI/2)) * 0.5);
        this.player.coordinates.y += (Math.cos(this.player.coordinates.angle + (Math.PI/2)) * 0.5);
        event.preventDefault();
        return;
    }

    strafeLeft = (event: KeyboardEvent) => {
        this.player.coordinates.x += (Math.sin(this.player.coordinates.angle - (Math.PI/2)) * 0.5);
        this.player.coordinates.y += (Math.cos(this.player.coordinates.angle - (Math.PI/2)) * 0.5);
        event.preventDefault();
        return;
    }


    shoot = (event: KeyboardEvent) => {
        event.preventDefault();
        const testHitShot: testDistanceReturn | null = checkShot(this.gameState.MAP, this.gameState.objectsOnMap, this.player.coordinates);
        if (testHitShot === null) {
            return;
        }

        removeFromObjects(this.gameState.MAP, this.gameState.objectsOnMap, testHitShot.coordinates);
        this.props.setCurrentScore(this.player.score + 1);
        return;

    }

    keydown = (event: KeyboardEvent) => {
        // Ideally we'd track elapsed time, but not right now.
        // console.log(event.key);
        switch (event.key) {
            case ('ArrowLeft'):
                this.turnLeft(event);
                break;
            case ('ArrowRight'):
                this.turnRight(event);
                break;
            case ('a'):
                this.strafeLeft(event);
                break;
            case ('d'):
                this.strafeRight(event);
                break;
            case ('w'):
                this.forward(event);
                break;
            case ('s'):
                this.backward(event);
                break;
            case (' '):
                this.shoot(event);
                break
            default:
                console.log(`canvas component ignoring keystroke: ${event.key}`)
        }
        // console.log(`Player x,y: ${this.player.coordinates.x}, ${this.player.coordinates.y}`);
        this.player.coordinates = clampBounds(this.gameState.MAP, this.player.coordinates);
    }

    componentWillUnmount() {
        console.log("canvas unmounting"); 
        // clearInterval(this.animationLoopHandle)
        cancelAnimationFrame(this.animationLoopHandle);
        CANVAS.gameCanvas_0.hidden = true;
        document.removeEventListener('keydown', this.keydown);
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    render() {
        // Not really doing any rendering, but using a react component makes lots of other things easy.
        return(null)
    }
}

const mapDispatchToPlayProps = (dispatch: any) => {
    return {
        setCurrentScore: (score: number) => dispatch(setCurrentScore(score)),
        setPlaying: (playing: boolean) => dispatch(setPlaying(playing))
    };
}

const Canvas = connect(null, mapDispatchToPlayProps)(_Canvas);

class _Play extends React.Component<PlayProps, PlayState> {

    newGame = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        this.props.setCurrentScore(0);
        this.props.setPlaying(true);
        // gameState = initGameState();
    }
    render() {
        if (this.props.playing) {
            return (
                <>
                    Current Score: {this.props.currentScore}
                    <Canvas/>
                    <button onClick={randomSoundPlay}>Random Evans sound</button>
                </>
            );
        }
        return (
            <>
                <h2>GAME OVER</h2>
                <h4>Final score: {this.props.currentScore}</h4>
                <button onClick={this.newGame}>Play again</button>
            </>
        );
    }
}

const mapStateToPlayProps = (state: any) => {
    return {
        currentUser: state.currentUser,
        currentScore: state.currentScore,
        playing: state.playing
    }
}

export const Play = connect(mapStateToPlayProps, mapDispatchToPlayProps)(_Play);
