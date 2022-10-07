// Vaidehi's (naive) implementations of standard matrix functions
// October 2022

// INTERFACE
/*
    TODO    
    Describe vectors, labeled vectors, matrices
*/

// Checks that a matrix is valid, and if it is valid, returns 
// the dimensions.  
// Dimensions of a 0 x n matrix for any m, will be reported as 
// 0 x 0
export const matrixSize = null;


// Input: unlabeled vector, unlabeled vector
// Output: unlabeled vector
// Exceptions: if inputs are not the same dimension
export const vectorAdd = ((v1, v2) =>
    {
        if (v1.length != v2.length) {
            throw "Vectors incompatible for addition";
        }

        var sums = v1.map((v1Value, index) =>
            v1Value + v2[index]
        );

        return sums;
    }
);

// Input: scalar, unlabeled vector
// Output: unlabeled vector
export const scalarVectorMult = ((scale, vec) => 
    vec.map((value) => scale * value)
);

// Input: unlabeled vector, unlabeled vector
// Output: scalar
// Exception: if inputs are not the same dimension
export const innerProduct = ((v1, v2) =>
    {
        if (v1.length != v2.length) {
            throw "Vectors incompatible for inner product";
        }

        var products = v1.map((v1Value, index) =>
            v1Value * v2[index]
        );

        var sum = products.reduce((a, b) => a + b, 0);

        return sum;
    }
);

// Input: matrix, (column) index
// Output: unlabeled vector
export const extractColumn = ((m, colIndex) => m.map((rowWrapper) => rowWrapper.row[colIndex]));

// Input: matrix, matrix 
// Output: matrix
// Exception: TODO
export const matrixMultiply = ((m1, m2) =>
    {
        if (m1 == null || m2 == null || m1.length === 0 || m2.length === 0) return [];

        var result = m1.map((m1RowWrapper) => 
            {
                // matrix multiplication maps a row of m1 to its index-wise inner product 
                // with m2

                var m1Row = m1RowWrapper.row;

                var productRow = m1Row.map((ignore, columnIndex) =>
                    {
                        var m2Col = extractColumn(m2, columnIndex);
                        return innerProduct(m1Row, m2Col);
                    }
                );

                return ({row: productRow});
            }
        );

        return result;
    }
);

// Input: labeled vectors, scalar (perturbation value)
// Output: labeled vectors
export const perturbVectors = ((labeledVecs, perturbWithin) => {
    // Math.random() returns something in [0, 1]

    var perturbedVecs = labeledVecs.map((vec) =>
        {
            var perturbedIndices = vec.vec.map((entry) =>
                entry + (2 * Math.random() * perturbWithin) - perturbWithin
            );

            return ({
                label: vec.label,
                vec: perturbedIndices
            });
        }
    );

    return perturbedVecs;
});

// Input: labeled vectors (current point), labeled vectors (gradient), scalar (step size)
// Output: labeled vectors 
export const moveAgainstGradient = ((currentPoint, grad, stepSize) =>
    {
        var newWrappedVectors = currentPoint.map((vecWrapper, vecIndex) =>
            {
                var newVector = vecWrapper.vec.map((oldValue, internalIndex) =>
                    {
                        var indivGrad = grad[vecIndex].vec[internalIndex];
                        var newValue = Number(oldValue) + (indivGrad * stepSize * -1);

                        return newValue;
                    }
                );

                return ({label: vecWrapper.label, vec: newVector});
            }
        );

        return newWrappedVectors;
    }
);

/* LOGGING */

// Input: labeled vectors
// Output: null
export const logLabeledVector = ((labeledVec, index) => {
    var coordStrings = labeledVec.vec.map((val, ind) => {
        if (ind == labeledVec.vec.length - 1) {
            return val;
        }

        return val + ", ";
    });

    var coordString = coordStrings.reduce((a, b) => a + b, "");

    console.log("index: " + index 
                + ", label: " + labeledVec.label 
                + ", coords: [" + coordString + "]");
});

// Input: labeled vector list
// Output: null
export const logLabeledVectorList = ((labeledVecList) => {
    console.log("VECTORS ------");
    var garbage = labeledVecList.map((vec, index) => logLabeledVector(vec, index));
    console.log("-------------")
});

