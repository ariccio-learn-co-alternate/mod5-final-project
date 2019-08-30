import React from 'react';
import { connect } from 'react-redux';


interface PlayState {
    currentUser: string
}

interface PlayProps {
    currentUser: string
}

// const defaultPlayState = {
//     currentUser: ''
// }

interface CanvasState {
    // angle: number,
    // ctx: CanvasRenderingContext2D | null
}

const defaultCanvasState: CanvasState = {
    // angle: 0,
    // ctx: null
}

// function randomChoice()

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
    // angle = 45;
    x = 0;
    y = 0;
    timer: any;
    // canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    canvasContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

    // updateCanvas() {
    //     const ctx = this.getCanvasCtx();
    //     if (ctx === null) {
    //         return;
    //     }
    //     ctx.rotate((Math.PI / 180) * this.state.angle);
    //     console.log("angle: ", this.state.angle);
    //     this.setState({angle: ((this.state.angle +1) % 360)});
    //     this.forceUpdate();
    //     requestAnimationFrame(this.updateCanvas.bind(this));
    // }

    step() {
        // const angleRotate = this.angle * Math.PI / 180;
        // console.log("Rotate by: ", angleRotate);
        // console.log("angle: ", this.angle)
        this.ctx.clearRect(0,0, 400, 400);
        // this.ctx.translate(200, 200);
        // this.ctx.rotate(angleRotate);
        console.assert(gameCanvas.width === 400);
        this.ctx.fillText("Not implemented yet.", this.x, this.y)
        this.ctx.fillText(".tey detnemelpmi toN", (-this.x)+gameCanvas.width, (-this.y)+gameCanvas.height)
        this.x = ((this.x + 1) % 400);
        this.y = ((this.y + 2) % 400);
        
    }
    componentDidMount() {
        // if (this.canvasContainerRef === null) {
        //     return;
        // }
        // if (this.canvasContainerRef.current === null) {
        //     return;
        // }
        // this.canvasContainerRef.current.appendChild(gameCanvas);

        // const ctx = getCanvasCtx();
        if (this.ctx === null) {
            return;
        }
        this.ctx.fillText("Not implemented yet.", 200, 200)
        // requestAnimationFrame(this.updateCanvas.bind(this));
        // this.setState({ctx})
        this.timer = setInterval(this.step.bind(this), 10);
        gameCanvas.hidden = false;
    }

    componentWillUnmount() {
        clearInterval(this.timer)
        gameCanvas.hidden = true;
    }
    
      render() {
        return(
          <div id="game-canvas-container" ref={this.canvasContainerRef}>
            
          </div>
        )
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