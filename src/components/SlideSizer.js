import React from 'react';

class SlideSizer extends React.Component {
    constructor(props) {
        super(props);

        // State.
        this.state = {
            innerWidth: window.innerWidth,
        }

        // Method Bindings.
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
    }

    render() {
        let  availableWidth = this.state.innerWidth - 600;

        let transformContainerStyle = {
            width: '1920px',
            height: '1080px',
            transform: `scale(${availableWidth / 1920})`,
            transformOrigin: 'top left',
        }

        return (
                <div style={transformContainerStyle}>
                    {this.props.children}
                </div>
        )
    }

    handleWindowResize() {
        this.setState({ innerWidth: window.innerWidth });
    }
}

export default SlideSizer