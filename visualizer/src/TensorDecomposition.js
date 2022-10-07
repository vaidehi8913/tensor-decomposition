import React, { Component } from "react";
import Heading from "./Heading";
import * as MatrixUtils from "./MatrixUtils";
import VectorIO from "./VectorIO";
import GradientDescentIO from "./GradientDescentIO";
import VectorDrawing from "./VectorDrawing";

class TensorDecomposition extends Component {

    constructor(props){
        super(props);

        this.state = {
            order: 3,
            dimension: 2,
            modelInitialVectors: [],
            // vectors are stored as {label: ..., vec: [..., ...]}
            groundTruthVectors: [],
            modelCurrentVectors: [],
            isRunning: false,
            stepSize: 0.01,
            tickTime: 1000,
            perturbWithin: 0.01,
            trace: false,
            traces: []
        };

        this.interval = setInterval(() => this.tick(), 1000);

        this.updateOrder = this.updateOrder.bind(this);
        this.resetVectors = this.resetVectors.bind(this);
        this.updatePerturbWithin = this.updatePerturbWithin.bind(this);
        this.updateTickTime = this.updateTickTime.bind(this);
        this.updateVectorDimension = this.updateVectorDimension.bind(this);
        this.updateDimension = this.updateDimension.bind(this);
        this.updateStepSize = this.updateStepSize.bind(this);
        this.controlRun = this.controlRun.bind(this);

        this.updateGroundTruthVectors = this.updateGroundTruthVectors.bind(this);
        this.updateModelInitVectors = this.updateModelInitVectors.bind(this);
        this.addNewModelVector = this.addNewModelVector.bind(this);
        this.addNewGroundTruthVector = this.addNewGroundTruthVector.bind(this);

        this.calculateGradient = this.calculateGradient.bind(this);
        this.stepGradientDescent = this.stepGradientDescent.bind(this);
    }

    /* SETTING AND UPDATING STATE */

    updateOrder (newOrder) {
        this.setState({
            order: newOrder
        });
    }

    resetVectors () {
        this.setState({
            modelCurrentVectors: this.state.modelInitialVectors,
            isRunning: false
        });
    }


    updatePerturbWithin (newPerturbWithin) {
        this.setState({
            perturbWithin: newPerturbWithin
        });
    }


    updateTickTime (newTickTime) {
        this.setState({
            tickTime: newTickTime
        });

        clearInterval(this.interval);
        this.interval = setInterval(() => this.tick(), this.state.tickTime);
    }


    updateVectorDimension (vec, newDimension) {

        var newValues = vec.vec.concat(Array(newDimension).fill(0)).slice(0,newDimension);
        var newVector = {label: vec.vec, vec: newValues};

        return newVector;
    }

    updateDimension (newDimension) {

        var newModelInitVectors = this.state.modelInitialVectors.map((vec) =>
            this.updateVectorDimension(vec, newDimension)
        );

        var newGroundTruthVectors = this.state.groundTruthVectors.map((vec) =>
            this.updateVectorDimension(vec, newDimension)
        );

        this.setState({
            modelInitialVectors: newModelInitVectors,
            modelCurrentVectors: newModelInitVectors,
            groundTruthVectors: newGroundTruthVectors,
            dimension: newDimension,
            isRunning: false
        });
    }

    updateStepSize (newStepSize) {
        this.setState({
            stepSize: newStepSize
        });
    }

    controlRun () {

        console.log("control run: " + this.state.isRunning);

        if (this.state.isRunning) {
            this.setState({
                isRunning: false
            });
        } else {
            this.setState({
                isRunning: true
            });
        }
    }

    updateGroundTruthVectors(newGroundTruthVectors) {
        this.setState({
            groundTruthVectors: newGroundTruthVectors,
            isRunning: false
        });
    }

    updateModelInitVectors(newModelInitVectors) {
        this.setState({
            modelInitialVectors: newModelInitVectors,
            modelCurrentVectors: newModelInitVectors,
            isRunning: false
        });
    }

    addNewGroundTruthVector() {
        var newVector = {
            label: null,
            vec: Array(this.state.dimension).fill(0)
        };

        var newVectorSet = this.state.groundTruthVectors.concat(newVector);

        this.setState({
            groundTruthVectors: newVectorSet,
            isRunning: false
        });
    }

    addNewModelVector() {
        var newVector = {
            label: null,
            vec: Array(this.state.dimension).fill(0)
        };

        var newInitialVectorSet = this.state.modelInitialVectors.concat(newVector);
        //var newCurrentVectorSet = this.state.modelCurrentVectors.concat(newVector);

        this.setState({
            modelInitialVectors: newInitialVectorSet,
            modelCurrentVectors: newInitialVectorSet,
            isRunning: false
        });
    }

    // /* GRADIENT DESCENT MACHINERY */

    calculateGradient () {

        // grad_Yi OBJ = - (sum over A_js  < A_j , Y_i>^(l - 1) A_j  ) 
        //               + (sum over Y_js  < Y_j, Y_i>^(l - 1) Y_j )

        var grad = this.state.modelCurrentVectors.map((YiWrapper) => 
            {
                var Yi = YiWrapper.vec;

                var Aterms = this.state.groundTruthVectors.map((AjWrapper) =>
                    {
                        var Aj = AjWrapper.vec; 

                        var scalar = Math.pow(MatrixUtils.innerProduct(Aj, Yi), this.state.order - 1);

                        return MatrixUtils.scalarVectorMult(scalar, Aj);
                    }
                );

                var zeroVector = Yi.map((ignore) => 0);

                var collapsedAterm = Aterms.reduce(MatrixUtils.vectorAdd, zeroVector);

                var Yterms = this.state.modelCurrentVectors.map((YjWrapper) =>
                    {
                        var Yj = YjWrapper.vec; 

                        var scalar = Math.pow(MatrixUtils.innerProduct(Yj, Yi), this.state.order - 1);

                        return MatrixUtils.scalarVectorMult(scalar, Yj);
                    }
                );

                var collapsedYterm = Yterms.reduce(MatrixUtils.vectorAdd, zeroVector);
                
                return {
                    label: YiWrapper.label,
                    vec: MatrixUtils.vectorAdd(MatrixUtils.scalarVectorMult(-1, collapsedAterm), collapsedYterm)
                };
            }
        );

        return grad;
    }

    stepGradientDescent() {

        var grad = this.calculateGradient();

        console.log("gradient");
        MatrixUtils.logLabeledVectorList(grad);

        var newPoint = MatrixUtils.moveAgainstGradient(this.state.modelCurrentVectors, 
                                                    grad, this.state.stepSize);

        console.log("new point");
        MatrixUtils.logLabeledVectorList(newPoint);

        var perturbedNewPoint = MatrixUtils.perturbVectors(newPoint, this.state.perturbWithin);

        console.log("perturbed new point");
        MatrixUtils.logLabeledVectorList(perturbedNewPoint);

        this.setState({
            modelCurrentVectors: perturbedNewPoint
        });
    }

    /* CLOCKWORK */

    tick () {
        if (this.state.isRunning) {
            this.stepGradientDescent();
        }
    }

    componentDidMount () {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount () {
        clearInterval(this.interval);
    }

    /* RENDER */

    render() {
        
        var verticalWrapperStyle = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px"
        };

        var horizontalWrapperStyle = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "50px"
        };

        return(
            <div style={verticalWrapperStyle}>
                <Heading/> 
                <div style={horizontalWrapperStyle} >
                    <VectorDrawing dimension={this.state.dimension}
                                   groundTruthVectors={this.state.groundTruthVectors}
                                   modelVectors={this.state.modelCurrentVectors}/>
                    <VectorIO order={this.state.order}
                              updateOrder={this.updateOrder}
                              dimension={this.state.dimension}
                              updateDimension={this.updateDimension}
                              groundTruthVectors={this.state.groundTruthVectors}
                              updateGroundTruthVectors={this.updateGroundTruthVectors}
                              modelInitialVectors={this.state.modelInitialVectors}
                              updateModelInitialVectors={this.updateModelInitVectors}
                              addNewGroundTruthVector={this.addNewGroundTruthVector}
                              addNewModelVector={this.addNewModelVector}/>
                    <GradientDescentIO stepSize={this.state.stepSize}
                                       updateStepSize={this.updateStepSize}
                                       tickTime={this.state.tickTime}
                                       updateTickTime={this.updateTickTime}
                                       perturbWithin={this.state.perturbWithin}
                                       updatePerturbWithin={this.updatePerturbWithin}
                                       isRunning={this.state.isRunning}
                                       controlRun={this.controlRun}
                                       resetVectors={this.resetVectors}
                                       dimension={this.state.dimension} 
                                       modelCurrentVectors={this.state.modelCurrentVectors}/>
                </div>            
            </div>
        );

    }

}

export default TensorDecomposition;