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
    trace
    updateTrace
    off (deactivate the whole display)
    objectiveValue
*/
class GradientDescentIO extends Component {

    render () {

        if (this.props.off) {
            return null;
        }

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

        var traceCheckbox = IOUtils.buildCheckBox("", "Trace paths", this.props.trace, this.props.updateTrace);

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

        var objectiveValueComponent  = 
            <b> Objective value: {Number(this.props.objectiveValue).toFixed(4)}</b>;
        
        return (
            <div style={topLevelWrapperStyle}>
                {stepSizeEntryBox}
                {tickTimeEntryBox}
                {perturbWithinEntryBox}
                {traceCheckbox}
                {runResetButtonsTogether}

                <b> Current model: </b>
                {vectorHeader}
                {modelCurrentVectorDisplay}

                {objectiveValueComponent}
            </div>
        );
    }
}

export default GradientDescentIO;