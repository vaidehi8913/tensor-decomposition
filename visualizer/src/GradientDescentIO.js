import React, { Component } from "react";
import * as IOUtils from "./IOUtils";

/*
    PROPS
    stepSize
    updateStepSize
    tickTime
    updateTickTime
    perturbWithin
    updatePerturbWithin
    isRunning
    controlRun
    resetVectors
    dimension
    modelCurrentVectors
*/
class GradientDescentIO extends Component {

    render () {

        var topLevelWrapperStyle = {
            display: "flex",
            flexDirection: "column",
            gap: "20px"
        };

        var stepSizeEntryBox = IOUtils.buildEntryBox("Step size:", "", 
                                                     false, 
                                                     this.props.stepSize,
                                                     this.props.updateStepSize);

        var tickTimeEntryBox = IOUtils.buildEntryBox("Step every", "millisec",
                                                      true,
                                                      this.props.tickTime,
                                                      this.props.updateTickTime);

        var perturbWithinEntryBox = IOUtils.buildEntryBox("Perturb within:", "",
                                                          false,
                                                          this.props.perturbWithin,
                                                          this.props.updatePerturbWithin);

        var controlRunButtonStyle = {width: "150"};

        var controlRunButton = 
            <button onClick={this.props.controlRun} 
                    style={controlRunButtonStyle}>
                {this.props.isRunning ? "Pause gradient descent" : "Run gradient descent"}
            </button>;

        var resetButtonStyle = {width: "80px"};

        var resetButton = 
            <button onClick={this.props.resetVectors}
                    style={resetButtonStyle}>
                Reset
            </button>;

        var runResetButtonsTogether = 
            <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
                {controlRunButton}
                {resetButton}
            </div>;

        var vectorHeader = IOUtils.vectorHeader(this.props.dimension);



        var modelCurrentVectorDisplay = this.props.modelCurrentVectors.map((labeledVec) =>
            IOUtils.displayVectorValues(labeledVec)
        ); 
        
        return (
            <div style={topLevelWrapperStyle}>
                {stepSizeEntryBox}
                {tickTimeEntryBox}
                {perturbWithinEntryBox}
                {runResetButtonsTogether}

                <b> Current model: </b>
                {vectorHeader}
                {modelCurrentVectorDisplay}

                <b>Objective value: ???</b>
            </div>
        );
    }
}

export default GradientDescentIO;