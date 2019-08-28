import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import { connect } from 'react-redux';


interface PlayState {
    currentUser: string
}

interface PlayProps {
    currentUser: string
}

const defaultPlayState = {
    currentUser: ''
}

interface CanvasState {
    // angle: number
}

const defaultCanvasState: CanvasState = {
    angle: 0
}

// https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
class Canvas extends React.Component<{}, CanvasState> {
    state = defaultCanvasState;

    canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();

    getCanvasCtx() {
        const canvas = this.canvasRef.current;
        if (canvas === null) {
            console.log("null canvas")
            return null;
        }
        const ctx = canvas.getContext("2d")
        if (ctx === null) {
            console.log("null context");
            return null;
        }
        return ctx
    }
    componentDidMount() {
        const ctx = this.getCanvasCtx();
        if (ctx === null) {
            return;
        }
        ctx.fillText("notimpl", 210, 75)
    }
    
      render() {
        return(
          <>
            <canvas ref={this.canvasRef} width={640} height={425} />
          </>
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