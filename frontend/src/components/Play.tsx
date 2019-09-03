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

const CANVAS_CONTAINER: string = "game-canvas-container";
const CANVAS_ID: string = "game-canvas-element-id";
const container: HTMLDivElement = document.getElementById(CANVAS_CONTAINER) as HTMLDivElement;
const gameCanvas: HTMLCanvasElement = document.createElement('canvas');
gameCanvas.id = CANVAS_ID;


// WHY U NO WORK
// gameCanvas.style.border = '100px';
// gameCanvas.style.borderColor = 'black';

gameCanvas.width = 400;
gameCanvas.height = 400;
gameCanvas.hidden = false;
container.appendChild(gameCanvas);

function getCanvasCtx(): CanvasRenderingContext2D {
    const canvas: HTMLCanvasElement = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
    if (canvas === null) {
        console.log("null canvas")
        throw new Error();
    }
    const ctx = canvas.getContext("2d")
    if (ctx === null) {
        console.log("null context");
        throw new Error();
    }
    return ctx
}

// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
class Canvas extends React.Component<{}, CanvasState> {
    state = defaultCanvasState;
    ctx = getCanvasCtx();
    x = 0;
    y = 0;
    timer: any;

    step() {
        this.ctx.clearRect(0,0, 400, 400);
        this.ctx.fillText("Not implemented yet.", this.x, this.y)
        this.ctx.fillText(".tey detnemelpmi toN", (-this.x)+gameCanvas.width, (-this.y)+gameCanvas.height)
        this.x = ((this.x + 1) % 400);
        this.y = ((this.y + 2) % 400);
        
    }

    componentDidMount() {
        if (this.ctx === null) {
            return;
        }
        this.ctx.fillText("Not implemented yet.", 200, 200)
        this.timer = setInterval(this.step.bind(this), 10);
        gameCanvas.hidden = false;
    }

    componentWillUnmount() {
        clearInterval(this.timer)
        gameCanvas.hidden = true;
    }

    render() {
        return(null)
    }

}

class _Play extends React.Component<PlayProps, PlayState> {
    render() {
        return (
        <>
            <Canvas/>
        </>
        );
    }
}

export const Play = connect(null, null)(_Play);