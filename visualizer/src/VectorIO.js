import React, { Component } from "react";
import * as IOUtils from "./IOUtils";
import * as MatrixUtils from "./MatrixUtils";

/*
    PROPS
    order
    updateOrder
    dimension
    updateDimension

    groundTruthVectors
    updateGroundTruthVectors

    modelInitialVectors
    updateModelInitialVectors

    addNewGroundTruthVector
    addNewModelVector
*/
class VectorIO extends Component {

    constructor(props) {
        super(props);

        this.randomizeModelVectors = this.randomizeModelVectors.bind(this);
        this.randomizeGroundTruthVectors = this.randomizeGroundTruthVectors.bind(this);
        this.perturbGroundTruthVectors = this.perturbGroundTruthVectors.bind(this);
    }

    randomizeModelVectors() {
        var randomModelVectors = this.props.modelInitialVectors.map((labeledVec) => {
            var randomVec = labeledVec.vec.map((entry) => 2 * Math.random() - 1);
            return ({
                label: labeledVec.label,
                vec: randomVec
            });
        });

        this.props.updateModelInitialVectors(randomModelVectors);
    }

    randomizeGroundTruthVectors() {
        var randomGroundTruthVectors = this.props.groundTruthVectors.map((labeledVec) => {
            var randomVec = labeledVec.vec.map((entry) => 2 * Math.random() - 1);
            return ({
                label: labeledVec.label,
                vec: randomVec
            });
        });

        this.props.updateGroundTruthVectors(randomGroundTruthVectors);
    }

    perturbGroundTruthVectors() {
        var perturbedVecs = MatrixUtils.perturbVectors(this.props.groundTruthVectors, 0.001);

        this.props.updateGroundTruthVectors(perturbedVecs);
    }

    render () {

        var topLevelWrapperStyle = {
            display: "flex",
            flexDirection: "column",
            gap: "20px"
        };

        var orderEntry = IOUtils.buildEntryBox("Order:", "",
                                               true, 
                                               this.props.order, 
                                               this.props.updateOrder);

        var dimensionEntry = IOUtils.buildEntryBox("Dimension:", "",
                                                   true,
                                                   this.props.dimension,
                                                   this.props.updateDimension);

        if (this.props.order < 2) {
            return (
                <div style={topLevelWrapperStyle}>
    
                    {orderEntry}
    
                    {dimensionEntry}
    
                    Valid orders are at least 2.
                </div>
            );
        }

        var vectorHeader = IOUtils.vectorHeader(this.props.dimension);

        var groundTruthVectorInputs = this.props.groundTruthVectors.map((gtVec, gtVecIndex) => 
            IOUtils.displayVectorInputs(gtVec, 
                                        gtVecIndex, 
                                        this.props.groundTruthVectors,
                                        this.props.updateGroundTruthVectors)
        );

        var modelInitialVectorInputs = this.props.modelInitialVectors.map((miVec, miVecIndex) =>
            IOUtils.displayVectorInputs(miVec,
                                        miVecIndex,
                                        this.props.modelInitialVectors,
                                        this.props.updateModelInitialVectors)
        );

        var addVectorButtonStyle = {width: "80px"};

        var addGTVectorButton = 
            <button onClick={this.props.addNewGroundTruthVector}
                    style={addVectorButtonStyle}>
                Add vector
            </button>;

        var randomizeGTVectorsButton = 
            <button onClick={this.randomizeGroundTruthVectors}
                    style={addVectorButtonStyle}>
                Randomize
            </button>;

        var perturbGTVectorsButton = 
            <button onClick={this.perturbGroundTruthVectors}
                style={addVectorButtonStyle}>
                Perturb
        </button>;

        var GTButtonsTogether = 
            <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
                {addGTVectorButton}
                {randomizeGTVectorsButton}
                {perturbGTVectorsButton}
            </div>;

        var addMIVectorButton = 
            <button onClick={this.props.addNewModelVector}
                    style={addVectorButtonStyle}>
                Add vector
            </button>;

        var randomizeMIVectorsButton = 
            <button onClick={this.randomizeModelVectors}
                    style={addVectorButtonStyle}>
                Randomize
            </button>;

        var MIButtonsTogether = 
            <div style={{display: "flex", flexDirection: "row", gap: "20px"}}>
                {addMIVectorButton}
                {randomizeMIVectorsButton}
            </div>;

        return (
            <div style={topLevelWrapperStyle}>

                {orderEntry}

                {dimensionEntry}

                <b> Ground truth vectors: </b>

                {vectorHeader}

                {groundTruthVectorInputs}

                {GTButtonsTogether}

                <b> Model vectors (initial): </b>

                {vectorHeader}

                {modelInitialVectorInputs}

                {MIButtonsTogether}
            </div>
        );
    }

}

export default VectorIO;