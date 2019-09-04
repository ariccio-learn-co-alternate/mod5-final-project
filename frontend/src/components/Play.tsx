import React from 'react';
import { connect } from 'react-redux';


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
const container: HTMLDivElement = document.getElementById(CANVAS_CONTAINER) as HTMLDivElement;
const gameCanvas_0: HTMLCanvasElement = document.createElement('canvas');
// const gameCanvas_1: HTMLCanvasElement = document.createElement('canvas');
let offscreenCanvas: OffscreenCanvas|null = null



gameCanvas_0.id = canvasIDString(0);
// gameCanvas_1.id = canvasIDString(1);

initCanvas(gameCanvas_0, 400, 400, false);
// initCanvas(gameCanvas_1, 400, 400, true);
container.appendChild(gameCanvas_0);

function getCanvasCtx(): any {
    const canvas: HTMLCanvasElement = document.getElementById(canvasIDString(0)) as HTMLCanvasElement;
    if (canvas === null) {
        console.error("null canvas")
        throw new Error();
    }
    const ctx: any = canvas.getContext("bitmaprenderer");
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

interface CanvasProps {

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
    
    }

    renderToContextFromBitmap() {
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

    step() {
        if (offscreenCanvas === null) {
            console.warn("null canvas");
            return;
        }
        // this.offscreenContext.clearRect(0,0, 400, 400);
        this.offscreenContext.fillText("Not implemented yet.", this.x, this.y)
        this.offscreenContext.fillText(".tey detnemelpmi toN", (-this.x)+gameCanvas_0.width, (-this.y)+gameCanvas_0.height)
        this.x = ((this.x + 1) % 400);
        this.y = ((this.y + 2) % 400);
        this.renderToContextFromBitmap();
    }

    componentDidMount() {
        if ((this.ctx === null) || (this.offscreenContext === null) || (offscreenCanvas === null)) {
            return;
        }
        this.offscreenContext.fillText("Not implemented yet.", 200, 200)
        this.timer = setInterval(this.step.bind(this), 10);
        gameCanvas_0.hidden = false;
        this.renderToContextFromBitmap();

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