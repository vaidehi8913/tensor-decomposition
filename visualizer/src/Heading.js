import React, {Component} from "react";

class Heading extends Component {

    constructor(props){
        super(props);

        this.state = {
            dropDown: false,
            hovering: false
        }

        this.onClick = this.onClick.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.infoButtonColor = "#10006e";
    }

    onClick(e) {
        var isDropped = this.state.dropDown;
        this.setState({dropDown: !isDropped});
    }

    onMouseEnter(e) {
        this.setState({hovering: true});
    }

    onMouseLeave(e) {
        this.setState({hovering: false});
    }

    render() {

        var topLevelWrapperStyle = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // gap: "20px",
            // marginTop: "50px"
        }

        var titleWrapperStyle = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        } 

        var titleStyle = {
            fontSize: "1.5em"
        };

        var invertColorScheme = this.state.dropDown || this.state.hovering;

        var mainColor = invertColorScheme ? null : this.infoButtonColor;
        var textColor = invertColorScheme ? this.infoButtonColor : "white";

        var infoButtonStyle = {
            width: "10px",
            height: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            borderRadius: 100,
            backgroundColor: mainColor,
            margin: "15px",
            color: textColor,
            fontSize: "65%",
            borderColor: this.infoButtonColor,
            borderWidth: "3px",
            borderStyle: "solid",
            fontSize: "0.5em"
        };

        var dropDownBox = null;

        var dropDownBoxStyle = {
            maxWidth: "700px"
        };

        if (this.state.dropDown) {
            dropDownBox = 
            <div style={dropDownBoxStyle}> 
                This visualizer is running perturbed gradient descent on the standard tensor decomposiotion
                objective function (squared Frobenius norm of the difference of the ground truth tensor and 
                the model tensor).  You can find the git repo and README {' '}<a href="https://github.com/vaidehi8913/tensor-decomposition/tree/main" target="_blank">here</a>.
            </div>;
        }

        return(
            <div style={topLevelWrapperStyle}>

                <div style={titleWrapperStyle}>
                    <div style={titleStyle}>
                        <b> Visualizer for Over-parameterized Tensor Decomposition </b>
                    </div>

                    <div style={infoButtonStyle}
                        onClick={this.onClick}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}>
                        {this.state.dropDown ? <b>less</b> : <b>info</b>}
                    </div>
                </div>

                {dropDownBox}

            </div>
        );
    }
}

export default Heading;
