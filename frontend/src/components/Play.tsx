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
    angle: number
}

const defaultCanvasState: CanvasState = {
    angle: 0
}

const CANVAS_ID: string = "game-canvas-element-id";
const gameCanvas: HTMLCanvasElement = document.createElement('canvas');
gameCanvas.id = CANVAS_ID;

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
    componentDidMount() {
        if (this.canvasContainerRef === null) {
            return;
        }
        if (this.canvasContainerRef.current === null) {
            return;
        }
        this.canvasContainerRef.current.appendChild(gameCanvas);

        const ctx = getCanvasCtx();
        if (ctx === null) {
            return;
        }
        ctx.fillText("Not implemented yet.", 210, 75)
        // requestAnimationFrame(this.updateCanvas.bind(this));
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