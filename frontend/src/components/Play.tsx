import React from 'react';
import { connect } from 'react-redux';
import {Unsubscribe} from 'redux';

import {Dropdown, DropdownButton} from 'react-bootstrap';

import {setCurrentScore, setPlaying, setCurrentLevel, setMaxScoreForLevel} from '../Actions';
import {store} from '../index';
import {formatErrors} from '../utils/ErrorObject';


interface PlayState {
    mapsList: any
}

interface PlayProps {
    readonly currentUser: string,
    readonly currentScore: number
    readonly playing: boolean,
    readonly currentLevel: string,
    readonly maxScore: number,
    readonly setPlaying: any,
    readonly setCurrentScore: any,
    readonly setCurrentLevel: any
}

interface CanvasState {
    // ctx: CanvasRenderingContext2D | null
    // currentUser: string
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
    MAP_HEIGHT: number,
    initialized: boolean,
    MAP_ID: string
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
    score: number,
    velocity: ObjectCoordinateVector
}

interface CanvasProps {
    readonly setCurrentScore: any,
    readonly setPlaying: any,
    readonly currentUser: string,
    readonly currentLevelID: string,
    readonly setMaxScoreForLevel: any
}

interface GameState {
    screenBuffer: Uint8ClampedArray,
    objectsOnMap: Array<ObjectCoordinateVector>,
    drawDarkAimPointFlipFlop: boolean,
    MAP: Map
}

const _DEFAULT_PLAYER: Player = {
    coordinates: {
        x: 2,
        y: 2,
        angle: Math.PI/2
    },
    score: 0,
    velocity: {
        x: 0,
        y: 0,
        angle: 0
    }
}
const DEFAULT_CANVAS_STATE: CanvasState = {
}

const DEFAULT_PLAY_STATE: PlayState = {
    mapsList: []
}

const CANVAS: CanvasData = initCanvasData();

// Has to be done after init.
CANVAS.gameCanvas_0.id = canvasIDString(0);
const FIELD_OF_VIEW: number = (Math.PI/2)
const VIEW_DISTANCE: number = 16;

enum HitType {
    HIT_ERR,
    HIT_WALL,
    HIT_DYN
}

const FRICTION_COEFFICIENT: number = 0.8;

const BEEP_BOOP_SOUNDS: Array<HTMLAudioElement> = initBeepBoopSounds();
const ALL_SOUND_EFFECTS: Array<HTMLAudioElement> = initAllSoundEffects();
const BAD_SOUNDS: Array<HTMLAudioElement> = initBadSounds();
const GOOD_SOUNDS: Array<HTMLAudioElement> = initGoodSounds();
const OH_MAN_SOUNDS: Array<HTMLAudioElement> = initOhManSounds();

// https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
// Imagedata needs an 8 bit R value, G value, b value, and a A value;
const SCREEN_BUFFER_SIZE = CANVAS.CANVAS_PIXELS *4

// const FPS_COUNTER_ID = 'fps-counter';
// const FPS_COUNTER_ELEM = getFPSCounter();

const DEFAULT_LEVEL_MAP_STRING: string = '' +
'################################' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'#                              #' +
'################################';

// function getFPSCounter(): HTMLElement {
//     const elem = document.getElementById(FPS_COUNTER_ID);
//     if (elem === null) {
//         throw new Error("expected a p for the FPS in index!")
//     }
//     return elem;
// }

function deepCopyDefaultPlayerBecauseJavascriptIsReallyAnnoying(): Player {
    const DEFAULT_PLAYER: Player = {
        coordinates: {
            x: _DEFAULT_PLAYER.coordinates.x,
            y: _DEFAULT_PLAYER.coordinates.y,
            angle: _DEFAULT_PLAYER.coordinates.angle
        },
        score: _DEFAULT_PLAYER.score,
        velocity: {
            x: _DEFAULT_PLAYER.velocity.x,
            y: _DEFAULT_PLAYER.velocity.y,
            angle: _DEFAULT_PLAYER.velocity.angle
        }
    }
    return {
        ...DEFAULT_PLAYER
    }
}

function initMap(mapStringFromFetch: string, map_id: string): Map {
    const MAP: Map = {
        LEVEL_MAP: levelMapArray(mapStringFromFetch),
        WALL_CHAR_CODE: wallCharCode(),
        PLAYER_CHAR_CODE: playerCharCode(),
        MAP_WIDTH: 32,
        MAP_HEIGHT: 32,
        initialized: true,
        MAP_ID: map_id
    }
    console.assert(MAP.MAP_WIDTH === MAP.MAP_HEIGHT);
    console.assert((MAP.MAP_WIDTH * MAP.MAP_HEIGHT) === MAP.LEVEL_MAP.length)
    return MAP;
}

function defaultMap(): Map {
    const MAP: Map = {
        LEVEL_MAP: defaultLevelMapArray(),
        WALL_CHAR_CODE: wallCharCode(),
        PLAYER_CHAR_CODE: playerCharCode(),
        MAP_WIDTH: 32,
        MAP_HEIGHT: 32,
        initialized: false,
        MAP_ID: ''
    }
    console.assert(MAP.MAP_WIDTH === MAP.MAP_HEIGHT);
    console.assert((MAP.MAP_WIDTH * MAP.MAP_HEIGHT) === MAP.LEVEL_MAP.length)
    return MAP;

}

function mapFetchOptions(jwt: string): RequestInit {
    // debugger;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
    };
    return requestOptions;
}

function listMapFetchOptions(jwt: string): RequestInit {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
    };
    return requestOptions;
}

function submitScoreOptions(jwt: string, score: number, level: string): RequestInit {
    const body = {
        score: {
            score: score,
            level_id: level
        }
    }
    
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(body)
    };
    return requestOptions;
}

function initGameState(): GameState {
    const objectsOnMap: Array<ObjectCoordinateVector> = [];
    const MAP: Map = defaultMap();

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

// WTF is the type of the targets damnit?
function initGameMapStateAfterFetch(gameState: GameState, mapStringFromFetch: string, targets: any, map_id: string): void {
    gameState.MAP = initMap(mapStringFromFetch, map_id);

    for (let i = 0; i < targets.length; i++) {
        console.assert(targets[i].x !== undefined);
        console.assert(targets[i].y !== undefined);
        console.assert(targets[i].angle !== undefined);

        console.assert(targets[i].x !== null);
        console.assert(targets[i].y !== null);
        console.assert(targets[i].angle !== null);

        addToObjects(gameState.MAP, gameState.objectsOnMap, {
            x: parseInt(targets[i].x, 10),
            y: parseInt(targets[i].y, 10),
            angle: parseInt(targets[i].angle, 10)
        })
    }
}

function defaultLevelMapArray(): Uint8ClampedArray {
    const buf = new Uint8ClampedArray(DEFAULT_LEVEL_MAP_STRING.length);
    for (let i = 0; i < DEFAULT_LEVEL_MAP_STRING.length; i++) {
        console.assert(DEFAULT_LEVEL_MAP_STRING.charCodeAt(i) <= 255);
        console.assert(DEFAULT_LEVEL_MAP_STRING.charCodeAt(i) >= 0);
        buf[i] = DEFAULT_LEVEL_MAP_STRING.charCodeAt(i);
    }
    return buf
}
// see also: https://github.com/mdn/canvas-raycaster
function levelMapArray(mapString: string): Uint8ClampedArray {
    console.assert(mapString.indexOf(String.fromCharCode(wallCharCode())) !== -1);
    // console.assert(mapString.indexOf(String.fromCharCode(playerCharCode())) !== -1);
    console.assert(mapString.indexOf)
    const buf = new Uint8ClampedArray(mapString.length);
    for (let i = 0; i < mapString.length; i++) {
        console.assert(mapString.charCodeAt(i) <= 255);
        console.assert(mapString.charCodeAt(i) >= 0);
        buf[i] = mapString.charCodeAt(i);
    }
    return buf
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
    // randomSound().play();
    randomSoundFromHTMLAudioElementArray(ALL_SOUND_EFFECTS).play();
}

function initCanvasData(): CanvasData {
    const CANVAS_WIDTH: number = 600;
    const CANVAS_HEIGHT: number = 600;
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

function getSound(soundID: string): HTMLAudioElement {
    const sound = document.getElementById(soundID) as HTMLAudioElement;
    if (sound === null) {
        throw new Error(`${soundID} sound effect missing.`)
    }
    return sound;
}

function eachSoundTag(soundIDTag: string): Array<HTMLAudioElement> {
    const SOUNDS = []
    for (let i = 0; true; i++) {
        const sound = document.getElementById(`${soundIDTag}-${i}`) as HTMLAudioElement;
        if (sound === null) {
            break;
        }
        console.log(`loaded sound for sound tag: ${soundIDTag}, at ID: ${i}: `, sound);
        SOUNDS.push(sound);
    }
    return SOUNDS;
}

function initBeepBoopSounds(): Array<HTMLAudioElement> {
    const BEEP_BOOP_SOUNDS = eachSoundTag('beepboop');
    return BEEP_BOOP_SOUNDS;
};

function initAllSoundEffects(): Array<HTMLAudioElement> {
    const SOUND_EFFECTS: Array<HTMLAudioElement> = [];
    const elements = document.querySelectorAll('.evans-soundeffect')
     elements.forEach(element => {
         SOUND_EFFECTS.push(element as HTMLAudioElement);
     })
     return SOUND_EFFECTS;
}

function initBadSounds(): Array<HTMLAudioElement> {
    const BAD_SOUNDS: Array<HTMLAudioElement> = [];
    BAD_SOUNDS.push(...eachSoundTag('terrible'));

    BAD_SOUNDS.push(...eachSoundTag('embarrasing'));
    BAD_SOUNDS.push(...eachSoundTag('kidding'));
    BAD_SOUNDS.push(...eachSoundTag('rethink'));
    BAD_SOUNDS.push(...eachSoundTag('hmm'));
    BAD_SOUNDS.push(...eachSoundTag('ohman'));
    BAD_SOUNDS.push(...eachSoundTag('smell'));
    BAD_SOUNDS.push(...eachSoundTag('whoops'));
    BAD_SOUNDS.push(...eachSoundTag('hip'));
    BAD_SOUNDS.push(...eachSoundTag('no'));
    BAD_SOUNDS.push(...eachSoundTag('whomp'));
    return BAD_SOUNDS;
}

function initGoodSounds(): Array<HTMLAudioElement> {
    const GOOD_SOUNDS: Array<HTMLAudioElement> = [];
    GOOD_SOUNDS.push(...eachSoundTag('powerful'));
    GOOD_SOUNDS.push(...eachSoundTag('wild'));
    GOOD_SOUNDS.push(...eachSoundTag('hey'));
    GOOD_SOUNDS.push(...eachSoundTag('seed'));
    GOOD_SOUNDS.push(...eachSoundTag('classy'));
    GOOD_SOUNDS.push(...eachSoundTag('noice'));
    GOOD_SOUNDS.push(...eachSoundTag('swaglord'));
    GOOD_SOUNDS.push(...eachSoundTag('fire'));
    GOOD_SOUNDS.push(...eachSoundTag('like-a-g-0'));
    GOOD_SOUNDS.push(...eachSoundTag('magical'));
    GOOD_SOUNDS.push(...eachSoundTag('spicy'));
    GOOD_SOUNDS.push(...eachSoundTag('megabless'));
    return GOOD_SOUNDS;
}

function initOhManSounds(): Array<HTMLAudioElement> {
    return eachSoundTag('ohman');
}
function randomSoundFromHTMLAudioElementArray(sounds: Array<HTMLAudioElement>): HTMLAudioElement {
    const rand = Math.random()*sounds.length;
    const index = Math.floor(rand);
    const sound = sounds[index];
    if (sound === null) {
        throw new Error("Sound not valid");
    }
    console.log(`returning random sound: ${sound.id}`)
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
    if (!MAP.initialized) {
        throw new Error("Map not initialized yet.")
    }
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
        throw new Error("Tried to remove a wall. Huh?");
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
        coordinates.x = 2;
    }
    if (coordinates.x > MAP.MAP_WIDTH - 1) {
        coordinates.x = MAP.MAP_WIDTH - 2;
    }
    if (coordinates.y < 1) {
        coordinates.y = 2;
    }
    if (coordinates.y > MAP.MAP_HEIGHT -1) {
        coordinates.y = MAP.MAP_HEIGHT -2;
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
    // if (outOfBounds(MAP, testX, testY)) {
    //     console.warn("out of bounds, currently no handling.")
    //     debugger;
    //     distanceToWall = VIEW_DISTANCE;
    //     console.warn("out of bounds");
    //     return {
    //         hit: true,
    //         testReturn: {
    //             outOfBounds: true,
    //             objectHitType: HIT_ERR,
    //             distance: distanceToWall,
    //             coordinates: {
    //                 x: testX,
    //                 y: testY,
    //                 angle: 0
    //             }
    //         }
    //     };
    // }
    if (hitDynObject(objectsOnMap, testX, testY)) {
        // debugger;
        return {
            hit: true,
            testReturn: {
                outOfBounds: false,
                objectHitType: HitType.HIT_DYN,
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
                objectHitType: HitType.HIT_WALL,
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
                objectHitType: HitType.HIT_ERR,
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
        const testX: number = Math.trunc((eyeX * thisDistanceToWall) + playerCoordinates.x);
        const testY: number = Math.trunc((eyeY * thisDistanceToWall) + playerCoordinates.y);
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
        objectHitType: HitType.HIT_ERR,
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

    // if(!(pixelIndex < pixelsSize)) {
    //     throw new Error("assertion failed");
    // }
    // console.assert((pixelIndex % 4) === 0);
    const rawIndex = pixelIndex * 4;
    if(rawIndex >= bufferSize) {
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
        if (wallDistance.objectHitType === HitType.HIT_DYN) {
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
        // console.log(`Player at radians,angle,x,y: '${playerCoordinates.angle},${playerCoordinates.angle*(360)},${playerCoordinates.x},${playerCoordinates.y}'` )
        const testHitDistance = distanceToWall(MAP, objectsOnMap, angleOfThisRay, playerCoordinates);
        // console.log(`Maybe the target is at: ${testHitDistance.coordinates.x},${testHitDistance.coordinates.y}`)
        if (testHitDistance.objectHitType === HitType.HIT_DYN) {
            console.log("good hit!");
            return testHitDistance;
        }
        // console.log(`Miss! ${testHitDistance.objectHitType}`);
    }
    return null;
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

    // Don't have time for these in the render loop.
    // // These will only fire in case of weird overflow problems 
    // if(!(redIndex < greenIndex)) {
    //     throw new Error("assertion failed");
    // }
    // if(!(greenIndex < blueIndex)) {
    //     throw new Error("assertion failed");
    // }
    // if(!(blueIndex < alphaIndex)) {
    //     throw new Error("assertion failed");
    // }
    return {redIndex, greenIndex, blueIndex, alphaIndex};
}

function castRays(MAP: Map, objectsOnMap: Array<ObjectCoordinateVector>, screenBuffer: Uint8ClampedArray, playerCoordinates: ObjectCoordinateVector) {
    const w: number = CANVAS.CANVAS_WIDTH;
    const h: number = CANVAS.CANVAS_HEIGHT;
    const halfH: number = (h/2);
    for (let i = 0; i < w; i++) {
        const angleOfThisRay: number = rayAngle(playerCoordinates.angle, i);
        // raysCasted.push(angleOfThisRay);
        const wallDistance: testDistanceReturn = distanceToWall(MAP, objectsOnMap,angleOfThisRay, playerCoordinates);
        const ceiling: number = halfH - (h / wallDistance.distance);
        const floor: number = h - ceiling;
        for (let y = 0; y < h; y++) {
            const screenBufferRowPixelIndex: number = (y * w);
            const screenBufferPixelIndex: number = (screenBufferRowPixelIndex + i);
            
            // Don't have time for THIS redundant check in the render loop. It's quite expensive.
            // const screenBufferIndex: number =
            //     pixelIndexToBufferIndex(SCREEN_BUFFER_SIZE, CANVAS.CANVAS_PIXELS, screenBufferPixelIndex);
            const screenBufferIndex = screenBufferPixelIndex * 4;
            const indexes = bufferPixelElementIndexes(SCREEN_BUFFER_SIZE, screenBufferIndex);
            drawPixels(screenBuffer, y, ceiling, floor, wallDistance, indexes)
        }
    }
}

function clampAngularMomentum(angle: number): number {
    // 0.15 seems fine
    const MAX_TURNING = 0.15
    if (angle > MAX_TURNING) {
        return MAX_TURNING;
    }
    if (angle < -MAX_TURNING) {
        return -MAX_TURNING;
    }
    // Prevent denormals and stuff.
    if ((angle > 0) && (angle < 0.0001)) {
        // console.log(angle);
        return 0;
    }
    if ((angle < 0) && (angle > -0.0001)) {
        // console.log(angle);
        return 0;
    }
    return angle;
}

function clampPlayerDirectionalSpeed(dimensionalSpeed: number) {
    // Prevent denormals and stuff.
    if ((dimensionalSpeed > 0) && (dimensionalSpeed < 0.0001)) {
        return 0;
    }
    if ((dimensionalSpeed < 0) && (dimensionalSpeed > -0.0001)) {
        return 0;
    }
    if (dimensionalSpeed > 0.8) {
        console.log(dimensionalSpeed);
        return 0.8;
    }
    if (dimensionalSpeed < -0.8) {
        console.log(dimensionalSpeed);
        return -0.8;
    }
    return dimensionalSpeed;
}

function updatePlayerMomentum(player: Player): void {
    player.velocity.x = (player.velocity.x * FRICTION_COEFFICIENT);
    player.velocity.y = (player.velocity.y * FRICTION_COEFFICIENT);

    player.velocity.x = clampPlayerDirectionalSpeed(player.velocity.x);
    player.velocity.y = clampPlayerDirectionalSpeed(player.velocity.y);

    player.velocity.angle = (player.velocity.angle * FRICTION_COEFFICIENT);
    player.velocity.angle = clampAngularMomentum(player.velocity.angle);
    // console.log(player.velocity.x);
    // console.log(player.velocity.x, player.velocity.y)
    player.coordinates.x += player.velocity.x;
    player.coordinates.y += player.velocity.y;
    player.coordinates.angle += player.velocity.angle;
    // console.log(player.velocity.angle);
}

const instructions = () =>
    <p className='instructions-p'>
        w -> forward<br/>
        a -> strafe left<br/>
        s -> backwards<br/>
        d -> strafe right<br/>

        left arrow -> turn left<br/>
        right arrow -> turn right<br/>

        spacebar -> shoot<br/>

        You have 20 seconds.<br/>
    </p>

// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
class _Canvas extends React.Component<CanvasProps, CanvasState> {
    state: any;
    ctx: any;
    offscreenContext: OffscreenCanvasRenderingContext2D;
    animationLoopHandle: any;
    player: Player;
    scoreSubscription: Unsubscribe;
    timeout: any;
    ohManTimeout: any;
    gameState: GameState;
    // renderTime: number;

    constructor(props: CanvasProps) {
        super(props);
        this.state = DEFAULT_CANVAS_STATE;
        this.ctx = getCanvasCtx();
        this.offscreenContext = getOffscreenContext(400, 400);
        this.player = Object.assign({}, deepCopyDefaultPlayerBecauseJavascriptIsReallyAnnoying()); // Fucking javascript;
        this.scoreSubscription = store.subscribe(this.updateScore);
        this.gameState = initGameState();
        // this.renderTime = performance.now();
    }

    endPlay = async () => {
        this.props.setPlaying(false);
        if (this.player.score > 0) {
            const submitScoreRequestOptions = submitScoreOptions(this.props.currentUser, this.player.score, this.gameState.MAP.MAP_ID);
    
            const submitResult: Promise<Response> = fetch('/scoreboard', submitScoreRequestOptions);
            const jsonResponse = (await submitResult).json();
            const responseParsed = await jsonResponse;
            if (responseParsed.errors !== undefined) {
                console.error(formatErrors(responseParsed.errors));
                alert(formatErrors(responseParsed.errors));
                return;
            }
            if (responseParsed.score !== undefined) {
                console.log("Successfully posted score!");
            }
        }

        if (this.player.score === 0) {
            randomSoundFromHTMLAudioElementArray(BAD_SOUNDS).play();
        }
        if (this.player.score > 4) {
            randomSoundFromHTMLAudioElementArray(GOOD_SOUNDS).play();
        }
        const jeopardy = document.getElementById('jeopardy-0') as HTMLAudioElement;
        if (jeopardy !== null) {
            jeopardy.play()
        }
        // FPS_COUNTER_ELEM.hidden = true;
        this.player.coordinates = Object.assign({}, deepCopyDefaultPlayerBecauseJavascriptIsReallyAnnoying().coordinates);
    }

    updateScore = () => {
        // From the docs: https://redux.js.org/api/store#getState
        // const previousValue = this.player.score;
        this.player.score = store.getState().currentScore;
        // console.log(`Updated score from ${previousValue} to ${this.player.score}`)
    }

    step() {
        // const lastRenderTime = this.renderTime;
        // this.renderTime = performance.now();
        // const difference = (this.renderTime - lastRenderTime);
        // const fps = (1000/difference);
        // // console.log(fps);
        // if (fps < 20) {
        //     FPS_COUNTER_ELEM.textContent = `FPS: ${ Math.floor(fps)}`;
        // }
        if (CANVAS.offscreenCanvas === null) {
            console.warn("null canvas");
            return;
        }

        castRays(this.gameState.MAP, this.gameState.objectsOnMap, this.gameState.screenBuffer, this.player.coordinates);
        drawAimPoint(this.gameState);
        const data: ImageData = new ImageData(this.gameState.screenBuffer, CANVAS.CANVAS_WIDTH, CANVAS.CANVAS_HEIGHT);

        updatePlayerMomentum(this.player);
        renderToContextFromUint8Clamped(data, this.ctx)
        this.animationLoopHandle = requestAnimationFrame(this.step.bind(this));
    }

    async fetchLevel() {
        const options: RequestInit = mapFetchOptions(this.props.currentUser);
        console.log(`redux currentLevel: ${this.props.currentLevelID}`);
        const fetchLevelURL: string = `/levels/${this.props.currentLevelID}`
        const rawResponse: Promise<Response> = fetch(fetchLevelURL, options);
        const jsonResponse = (await rawResponse).json();
        const responseParsed = await jsonResponse;
        // debugger;
        if (responseParsed.errors !== undefined) {
            console.error(formatErrors(responseParsed.errors));
            alert(formatErrors(responseParsed.errors));
            return;
        }

        if (responseParsed.map === undefined) {
            console.error('ill formed map.')
            console.warn(responseParsed);
            alert('server returned bad map data!')
        }
        if (responseParsed.targets === undefined) {
            console.error('No targets in server response?')
            console.warn(responseParsed);
            alert("Server returned a level without targets. There's no fun in that!")
        }
        if (responseParsed.map_id === undefined) {
            console.error('No map_id in response from server!');
            console.warn(responseParsed);
            alert("Server returned a map without a level ID, your scores can't be saved...");
        }
        // console.log(responseParsed.map);
        console.assert(responseParsed.map.charCodeAt(0) === wallCharCode());
        // debugger;
        initGameMapStateAfterFetch(this.gameState, responseParsed.map, responseParsed.targets, responseParsed.map_id);
        // initPlayerAfterFetch(this.gameState.MAP);
        this.props.setMaxScoreForLevel(responseParsed.targets.length);
        // this.player.coordinates = DEFAULT_PLAYER.coordinates;
        console.log('level loaded');
    }

    ohMan() {
        randomSoundFromHTMLAudioElementArray(OH_MAN_SOUNDS).play()
    }

    async componentDidMount() {
        console.log("canvas mounted");
        this.gameState = initGameState();
        if ((this.ctx === null) || (this.offscreenContext === null) || (CANVAS.offscreenCanvas === null)) {
            return;
        }
        console.log("loading level...");
        await this.fetchLevel();
        const TIMEOUT = 20000;
        const ALMOST_OVER = (TIMEOUT - (TIMEOUT/4));
        this.ohManTimeout = setTimeout(this.ohMan, ALMOST_OVER);
        this.timeout = setTimeout(this.endPlay, TIMEOUT);
        console.log('game timeout set...')

        // this.animationLoopHandle = setInterval(this.step.bind(this), 1);
        this.animationLoopHandle = requestAnimationFrame(this.step.bind(this));
        CANVAS.gameCanvas_0.hidden = false;
        // this.renderToContextFromBitmap();

        document.addEventListener('keydown', this.keydown)
        // FPS_COUNTER_ELEM.hidden = false;
    }

    turnLeft = (event: KeyboardEvent) => {
        this.player.velocity.angle -= 0.05;
        // console.log(this.player.velocity.angle);
        this.player.coordinates.angle += this.player.velocity.angle;
        event.preventDefault();
        return;
    }

    turnRight = (event: KeyboardEvent) => {
        this.player.velocity.angle += 0.05;
        this.player.coordinates.angle += this.player.velocity.angle;
        event.preventDefault();
        return;
    }

    forward = (event: KeyboardEvent) => {
        // randomBeepBoop().play();
        randomSoundFromHTMLAudioElementArray(BEEP_BOOP_SOUNDS).play()
        this.player.velocity.x += (Math.sin(this.player.coordinates.angle) * 0.5);
        this.player.velocity.y += (Math.cos(this.player.coordinates.angle) * 0.5);
        this.player.coordinates.x += this.player.velocity.x;
        this.player.coordinates.y += this.player.velocity.y;
        event.preventDefault();
        return;
    }

    backward = (event: KeyboardEvent) => {
        this.player.velocity.x -= (Math.sin(this.player.coordinates.angle) * 0.5);
        this.player.velocity.y -= (Math.cos(this.player.coordinates.angle) * 0.5);
        this.player.coordinates.x += this.player.velocity.x;
        this.player.coordinates.y += this.player.velocity.y;
        event.preventDefault();
        return;
    }

    strafeRight = (event: KeyboardEvent) => {
        this.player.velocity.x += (Math.sin(this.player.coordinates.angle + (Math.PI/2)) * 0.5);
        this.player.velocity.y += (Math.cos(this.player.coordinates.angle + (Math.PI/2)) * 0.5);
        this.player.coordinates.x += this.player.velocity.x;
        this.player.coordinates.y += this.player.velocity.y;
        event.preventDefault();
        return;
    }

    strafeLeft = (event: KeyboardEvent) => {
        this.player.velocity.x += (Math.sin(this.player.coordinates.angle - (Math.PI/2)) * 0.5);
        this.player.velocity.y += (Math.cos(this.player.coordinates.angle - (Math.PI/2)) * 0.5);
        this.player.coordinates.x += this.player.velocity.x;
        this.player.coordinates.y += this.player.velocity.y;
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
        randomSoundFromHTMLAudioElementArray(GOOD_SOUNDS).play()
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
                getSound('whoops-0').play();
                console.log(`canvas component ignoring keystroke: ${event.key}`)
        }
        // console.log(`Player x,y: ${this.player.coordinates.x}, ${this.player.coordinates.y}`);
        this.player.coordinates = clampBounds(this.gameState.MAP, this.player.coordinates);
    }

    componentWillUnmount() {
        // debugger; // Why unmounting during second game
        console.log("canvas unmounting"); 
        // clearInterval(this.animationLoopHandle)
        cancelAnimationFrame(this.animationLoopHandle);
        CANVAS.gameCanvas_0.hidden = true;
        document.removeEventListener('keydown', this.keydown);
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (this.ohManTimeout !== null) {
            clearTimeout(this.ohManTimeout);
            this.ohManTimeout = null;
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
        setPlaying: (playing: boolean) => dispatch(setPlaying(playing)),
        setCurrentLevel: (level: string) => dispatch(setCurrentLevel(level)),
        setMaxScoreForLevel: (maxScore: number) => dispatch(setMaxScoreForLevel(maxScore))
    };
}

const mapStateToCanvasProps = (state: any) => {
    return {
      currentUser: state.currentUser,
      currentLevelID: state.currentLevel
    }
  }


const Canvas = connect(mapStateToCanvasProps, mapDispatchToPlayProps)(_Canvas);

class _Play extends React.Component<PlayProps, PlayState> {

    state = DEFAULT_PLAY_STATE;
    async componentDidMount() {
        const options: RequestInit = listMapFetchOptions(this.props.currentUser);
        const rawResponse: Promise<Response> = fetch('/levels', options);
        const jsonResponse = (await rawResponse).json();
        const responseParsed = await jsonResponse;
        // debugger;
        if (responseParsed.errors !== undefined) {
            console.error(formatErrors(responseParsed.errors));
            alert(formatErrors(responseParsed.errors));
            return;
        }
        this.setState({
            mapsList: responseParsed.maps
        })
        // debugger;
    }

    newGame = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        this.props.setCurrentScore(0);
        this.props.setPlaying(true);
        // gameState = initGameState();
    }
    renderPlaying = () => {
        return (
            <>
                Current Score: {this.props.currentScore} Max score possible for this level: {this.props.maxScore}
                <Canvas/>
                <button onClick={randomSoundPlay}>Random Evans sound (total: {ALL_SOUND_EFFECTS.length})</button>
            </>
        );

    }

    renderAllMapDropdownButtons = () => {
        if ((this.state.mapsList === undefined) || (this.state.mapsList === null)) {
            return (
                <>
                </>
            );
        }
        return (
            <>
                {this.state.mapsList.map((singleMap: any) => {
                    return (
                        <Dropdown.Item
                            key={`dropdown-map-button-${singleMap.name}`}
                            eventKey={singleMap.name}
                        >
                            {singleMap.name}
                        </Dropdown.Item>
                    );
                })}
            </>
        );
    }

    selectMapDropdown = (eventKey: any, event: Object): any => {
        console.log(eventKey);
        console.log(event);
        console.log(this.state.mapsList)
        const selected = this.state.mapsList.find((map: any) => map.name === eventKey);
        if (selected === undefined) {
            console.error(`something is wrong, can't find the map with name: ${eventKey}`);
            throw new Error(`something is wrong, can't find the map with name: ${eventKey}`);
        }
        this.props.setCurrentLevel(selected.id);
        this.props.setPlaying(false);

        // debugger;
    }

    renderMapDropdown = () => {
        return (
            <DropdownButton
                id='map-selector-dropdown-button'
                title={`Select map ${this.props.currentLevel}`}
                onSelect={this.selectMapDropdown}
            >
                
                    {this.renderAllMapDropdownButtons()}
                
            </DropdownButton>
        );
    }

    renderGameOver = () => {
        return (
            <>
                <h2>GAME OVER</h2>
                <h4>Final score: {this.props.currentScore}</h4>
                <button onClick={this.newGame}>Play again</button>
                <button onClick={randomSoundPlay}>Random Evans sound</button>
            </>
        );
    }
    render = () => {
        if (this.props.currentUser === '') {
            // avoid bug where ya can't log in because keystrokes are captured :D
            return null;
        }
        if (this.props.playing) {
            return (
                <>
                    {this.renderMapDropdown()}
                    {this.renderPlaying()}
                    {instructions()}
                </>
            );
        }
        return (
            <>
                {this.renderMapDropdown()}
                {this.renderGameOver()}
            </>
        );
    }
}

const mapStateToPlayProps = (state: any) => {
    return {
        currentUser: state.currentUser,
        currentScore: state.currentScore,
        playing: state.playing,
        currentLevel: state.currentLevel,
        maxScore: state.maxScore
    }
}

export const Play = connect(mapStateToPlayProps, mapDispatchToPlayProps)(_Play);
