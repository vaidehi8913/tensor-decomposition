
 // For easy one-value inputs 
 // Input: string, string, bool, number, function: number -> null
 // Output: component
export const buildEntryBox = ((prelabel, postlabel, isInteger, currentValue, updateFunction) => {
    var entryBoxWrapperStyle = {
        display: "flex",
        flexDirection: "row",
        gap: "5px"
    }

    return(
        <div style={entryBoxWrapperStyle}>
            {prelabel}

            <input type="text"
                value={currentValue}
                onChange={(event) => 
                    updateFunction(isInteger ? Math.floor(event.target.value) 
                                                : event.target.value)}
                style={{width: labelWidth}} />

            {postlabel}
        </div>
    );
});

/* Vector Inputs */

export const vectorIndexWidth = "50px";
export const labelWidth = "50px";

// Assumes we only have access to an update function for the whole
// vector list at once
// Input: number (integer), number (integer), number, vector list, function: vector list -> null
// Output: none (but it will update)
export const updateVectorIndex = ((vectorNumber, index, newValue, oldVectors, vectorUpdateFunction) => {
    var newVectors = oldVectors.map((elem, listIndex) => {    
        if (listIndex == vectorNumber) {
            var newVector = elem.vec.map((el, vecIndex) => {
                if (vecIndex == index) {
                    return newValue;
                } else {
                    return el;
                }
            });

            return ({
                label: elem.label,
                vec: newVector
            });
        } else {
            return elem;
        }
    });

    vectorUpdateFunction(newVectors);
});

// Assumes we only have access to an update function for the whole
// vector list at once
// Input: number (integer), string, vector list, function: vector list -> null
// Output: none (but it will update)
export const updateVectorLabel = ((vectorNumber, newLabel, oldVectors, vectorUpdateFunction) => {
    var newVectors = oldVectors.map((elem, listIndex) => {
        if (listIndex == vectorNumber) {
            return ({
                label: newLabel,
                vec: elem.vec
            });
        } else {
            return elem;
        }
    });

    vectorUpdateFunction(newVectors);
});

// Input: component, array of components
// Output: component
export const formatDataRow = ((label, data) => {

    var formattedData = data.map((datum) => 
        <div style={{width: vectorIndexWidth}} >
            {datum}
        </div>
    );

    var wrapperStyle = {
        display: "flex",
        flexDirection: "row",
        gap: "15px"
    };

    return (
        <div style={wrapperStyle}>
            <div style={{width: labelWidth}} >
                {label}
            </div>
            {formattedData}
        </div>
    );
});

// Inputs: labeled vector, number, labeled vector list, function: labeled vectors -> null
// Output: component
export const displayVectorInputs = ((labeledVec, vectorNumber, allLabeledVecs, vectorUpdateFunction) => {

    var vectorInputs = labeledVec.vec.map((coordVal, coord) => 
        <input type="text"
               value={coordVal}
               onChange={(event) => updateVectorIndex(vectorNumber, 
                                                      coord, 
                                                      event.target.value, 
                                                      allLabeledVecs, 
                                                      vectorUpdateFunction)}
               style={{width: vectorIndexWidth}}/>
    );

    var labelInput = 
        <input type="text"
               value={labeledVec.label}
               onChange={(event) => updateVectorLabel(vectorNumber,
                                                      event.target.value,
                                                      allLabeledVecs,
                                                      vectorUpdateFunction)}
               style={{width: labelWidth}}/>

    return (formatDataRow(labelInput, vectorInputs));
});

// Inputs: labeled vector
// Output: component
export const displayVectorValues = ((labeledVec) => {

    var fixVectorStrings = labeledVec.vec.map((coordVal) => {
        if (coordVal == null) return "";

        return Number(coordVal).toFixed(4);
    });

    // old code has an extra format step here, but I don't think it's necessary

    return formatDataRow(labeledVec.label, fixVectorStrings);
});

// Input: number
// Output: component
export const vectorHeader = ((dimension) => {
    var indexNames = [];

    if (dimension == 2) {
        indexNames = ["x", "y"];
    }

    if (dimension == 3) {
        indexNames = ["x", "y", "z"];
    }

    return(formatDataRow("label", indexNames));
});