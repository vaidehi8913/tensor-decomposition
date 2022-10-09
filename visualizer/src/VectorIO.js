import React, { Component } from "react";
import * as IOUtils from "./IOUtils";

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

        // var indexNames = [];

        // if (this.props.dimension == 2) {
        //     indexNames = ["x", "y"];
        // }

        // if (this.props.dimension == 3) {
        //     indexNames = ["x", "y", "z"];
        // }

        // var vectorHeader = IOUtils.formatDataRow("Label", indexNames);

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

        var addMIVectorButton = 
            <button onClick={this.props.addNewModelVector}
                    style={addVectorButtonStyle}>
                Add vector
            </button>;

        return (
            <div style={topLevelWrapperStyle}>

                {orderEntry}

                {dimensionEntry}

                <b> Ground truth vectors: </b>

                {vectorHeader}

                {groundTruthVectorInputs}

                {addGTVectorButton}

                <b> Model vectors (initial): </b>

                {vectorHeader}

                {modelInitialVectorInputs}

                {addMIVectorButton}
            </div>
        );
    }

}

export default VectorIO;