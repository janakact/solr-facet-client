import React from 'react';
import Rcslider from 'rc-slider';


const handleStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    padding: '2px',
    border: '2px solid #abe2fb',
    borderRadius: '3px',
    background: '#fff',
    fontSize: '14px',
    textAlign: 'center',
};

const CustomHandle = React.createClass({
    propTypes: {
        value: React.PropTypes.any,
        offset: React.PropTypes.number,
        tipFormatter: React.PropTypes.any
    },
    render() {
        const props = this.props;
        const style = Object.assign({left: `${props.offset}%`}, handleStyle);
        return (
            <div style={style}>{this.props.tipFormatter(props.value)}</div>
        );
    },
});

class DraggableSlider extends React.Component {

    constructor(props) {
        super(props)
        let dragRangeMean = (props.fullRange[0]+props.fullRange[1])/2;
        this.state = {
            dragRange: props.dragRange ? props.dragRange : props.fullRange.map((item) => (item/8 + dragRangeMean )),
            fullRange: props.fullRange
        }
    }

    handleSlideChange(values) {
        this.setState({dragRange: values})
    }

    handleSlideChangeComplete(values) {
        this.setState({dragRange: values})
    }

    handleDrag(value){
        let dragRange = this.state.dragRange;
        let change = value - (dragRange[0]+dragRange[1])/2;
        let newDragRange =  dragRange.map((item) => (item+change));
        if (newDragRange[1] <= this.state.fullRange[1] && newDragRange[0] >= this.state.fullRange[0])
            this.setState({dragRange: newDragRange});
    }

    render() {

        return (
            <div>
                <Rcslider
                    className="drag-slider"
                    defaultValue={this.state.dragRange}
                    min={this.state.fullRange[0]}
                    max={this.state.fullRange[1]}
                    value={(this.state.dragRange[0]+this.state.dragRange[1])/2}
                    onChange={this.handleDrag.bind(this)}
                    tipFormatter={this.props.tipFormatter}
                    handle={<CustomHandle />}
                />


                <Rcslider
                    range={2}
                    defaultValue={this.state.dragRange}
                    min={this.state.fullRange[0]}
                    max={this.state.fullRange[1]}
                    value={this.state.dragRange}
                    onChange={this.handleSlideChange.bind(this)}
                    onAfterChange={this.handleSlideChangeComplete.bind(this)}
                    tipFormatter={this.props.tipFormatter}
                />


            </div>)
    }

}

export default DraggableSlider;