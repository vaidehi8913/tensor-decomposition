import react, { Component } from "react";
import {
    Stage, 
    Layer,
    Text,
    Circle,
    Line
} from "react-konva";
import * as MatrixUtils from "./MatrixUtils";


/*
    PROPS
    dimension
    groundTruthVectors
    modelVectors
    traces
    displayTraces
*/
class VectorDrawing extends Component {

    constructor(props) {
        super(props);

        this.stageWidth = 400;
        this.stageHeight = this.stageWidth;
        this.midX = this.stageWidth / 2;
        this.midY = this.stageHeight / 2;
        this.scale = (this.stageWidth) / 6; // length "1" in pixels
        this.zaxisX = -0.25;
        this.zaxisY = -0.25;

        this.groundTruthColor = "#cc0018"; // red
        this.modelColor = "#0000b3"; // blue

        this.project3Dto2D = this.project3Dto2D.bind(this);
        this.generatePointDrawing = this.generatePointDrawing.bind(this);
        this.generateTraceDrawing = this.generateTraceDrawing.bind(this);
        this.getCanvasCoords = this.getCanvasCoords.bind(this);
    }  

    // Input: labeled vector of 3 dimensions
    // Output: labeled vector of 2 dimensions
    project3Dto2D (vec) {
        var newX = Number(vec.vec[0]) + vec.vec[2] * this.zaxisX;
        var newY = Number(vec.vec[1]) + vec.vec[2] * this.zaxisY;

        return {label: vec.label, vec: [newX, newY]};
    }

    // Input: labeled vector of 2 or 3 dimensions (corresponding to this.props.dimension)
    // Output: unlabeled vector of 2 dimensions
    getCanvasCoords (vec) {

        if (this.props.dimension == 3) {
            vec = this.project3Dto2D(vec);
        }

        var x = vec.vec[0] * this.scale + this.midX;
        var y = vec.vec[1] * this.scale * -1 + this.midY;

        return ([x, y]);
    }

    // isGroundTruth is a bool that sets the color
    // dimension tells how many drop lines to draw
    generatePointDrawing(vec, isGroundTruth) {
        if (vec.vec[0] == null || vec.vec[1] == null) {
            return null;
        }

        if (this.props.dimension == 3 && vec.vec[2] == null) {
            return null;
        }

        var pointCoords = this.getCanvasCoords(vec);
        console.log("pointCoords: " + pointCoords);
        console.log("pointCoords[0]: " + pointCoords[0] + ", pointCoords[1]: " + pointCoords[1]);

        var pointRadius = 5;
        var pointColor = isGroundTruth ? this.groundTruthColor : this.modelColor;

        var labelWidth = 10;
        var labelHeight = 10;

        // let's try this
        var labelCenterX = pointCoords[0];
        var labelCenterY = pointCoords[1] - 15;
        var labelX = labelCenterX - labelWidth/2;
        var labelY = labelCenterY - labelHeight/2;

        var pointDrawing = [
            <Circle radius={pointRadius}
                    x={pointCoords[0]}
                    y={pointCoords[1]}
                    fill={pointColor}/>,
            <Text text={vec.label}
                  x={labelX}
                  y={labelY}
                  width={labelWidth}
                  height={labelHeight}
                  align="center"
                  verticalAlign="middle"
                  fontSize={16}
                  fill={pointColor}/>
        ];

        var dropLineDrawings = [];

        if (this.props.dimension == 2) {
            var xParallelLineEnd = {label: null, vec: [0, vec.vec[1]]};
            var yParallelLineEnd = {label: null, vec: [vec.vec[0], 0]};

            var xParallelLineEndCanvasCoords = this.getCanvasCoords(xParallelLineEnd);
            var yParallelLineEndCanvasCoords = this.getCanvasCoords(yParallelLineEnd);

            dropLineDrawings = [
                <Line points={pointCoords.concat(xParallelLineEndCanvasCoords)}
                      stroke={pointColor}
                      strokeWidth={"1px"}/>,
                <Line points={pointCoords.concat(yParallelLineEndCanvasCoords)}
                      stroke={pointColor}
                      strokeWidth={"1px"}/>
            ];
        } 
        
        if (this.props.dimension == 3) {
            var xParallelLineEnd = {label: null, vec: [0, vec.vec[1], vec.vec[2]]};
            var yParallelLineEnd = {label: null, vec: [vec.vec[0], 0, vec.vec[2]]};
            var zParallelLineEnd = {label: null, vec: [vec.vec[0], vec.vec[1], 0]};

            var xParallelLineEndCanvasCoords = this.getCanvasCoords(xParallelLineEnd);
            var yParallelLineEndCanvasCoords = this.getCanvasCoords(yParallelLineEnd);
            var zParallelLineEndCanvasCoords = this.getCanvasCoords(zParallelLineEnd);

            dropLineDrawings = [
                <Line points={pointCoords.concat(xParallelLineEndCanvasCoords)}
                      stroke={pointColor}
                      strokeWidth={"1px"}/>,
                <Line points={pointCoords.concat(yParallelLineEndCanvasCoords)}
                      stroke={pointColor}
                      strokeWidth={"1px"}/>,
                <Line points={pointCoords.concat(zParallelLineEndCanvasCoords)}
                      stroke={pointColor}
                      strokeWidth={"1px"}/>
            ];
        }

        return (dropLineDrawings.concat(pointDrawing));
    }

    generateTraceDrawing (oneTrace) {
        var wayPointCoords = oneTrace.trace.map((labeledVec) => 
            this.getCanvasCoords(labeledVec)
        );

        var lines = wayPointCoords.map((fromCoords, stepIndex) => {
            if (stepIndex + 1 == wayPointCoords.length) return null;

            var toCoords = wayPointCoords[stepIndex + 1];

            return (
                <Line points={fromCoords.concat(toCoords)}
                      stroke="#00e013"
                      strokewidth="0.5px"/>
            );
        });

        return lines;
    }

    render () {

        console.log("rendering vectorDrawing");
        console.log(this.props.traces);

        var vectorDisplayWrapperStyle = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            width: "400px"
        };

        if (this.props.dimension < 2 || this.props.dimension > 3) {
            return (
                <div>
                    Drawing only supported for dimensions 2 and 3.
                </div>
            );
        }

        if (this.props.displayTraces) {

            console.log(this.props.traces);

            var traceDrawingsUnflattened = this.props.traces.map(this.generateTraceDrawing);
            var traceDrawings = traceDrawingsUnflattened.reduce((a, b) => a.concat(b), []);
        }

        var groundTruthPointDrawings = this.props.groundTruthVectors.map((labeledVec) =>
            this.generatePointDrawing(labeledVec, true)
        ).reduce((a, b) => a.concat(b), []);

        var modelPointDrawings = this.props.modelVectors.map((labeledVec) =>
            this.generatePointDrawing(labeledVec, false)
        ).reduce((a, b) => a.concat(b), []);

        var xaxisLinePoints = [this.midX - 2.5 * this.scale, this.midY, 
                               this.midX + 2.5 * this.scale, this.midY];
        var yaxisLinePoints = [this.midX, this.midY - 2.5 * this.scale,
                               this.midX, this.midY + 2.5 * this.scale];
            
        var axisDrawings = [<Line points={xaxisLinePoints}
                                  stroke="gray"/>,
                            <Line points={yaxisLinePoints}
                                  stroke="gray"/>];           
                                  
        var title = "2D Vector Display";

        if (this.props.dimension == 3) {
            
            var zaxisPositive = this.project3Dto2D({label: null, vec: [0, 0, 2.5]});
            var zaxisNegative = this.project3Dto2D({label: null, vec: [0, 0, -2.5]});
            var zaxisPosAdjust = [zaxisPositive.vec[0] * this.scale + this.midX, zaxisPositive.vec[1] * this.scale * -1 + this.midY];
            var zaxisNegAdjust = [zaxisNegative.vec[0] * this.scale + this.midX, zaxisNegative.vec[1] * this.scale * -1 + this.midY];
            var zaxisLinePoints = zaxisPosAdjust.concat(zaxisNegAdjust);

            axisDrawings = axisDrawings.concat([<Line points={zaxisLinePoints} stroke="gray"/>]);

            title = "3D Vector Display";
        }

        return (
            <div style={vectorDisplayWrapperStyle} >
                <b> {title} </b>

                <Stage width={this.stageWidth} height={this.stageHeight}>
                    <Layer>
                        {axisDrawings}
                    </Layer>

                    <Layer>
                        {traceDrawings}
                    </Layer>

                    <Layer>
                        {groundTruthPointDrawings}
                    </Layer>

                    <Layer>
                        {modelPointDrawings}
                    </Layer>
                </Stage>
            </div>
        );
    }
}

export default VectorDrawing;