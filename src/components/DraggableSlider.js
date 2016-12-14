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
            <div style={style}>
                <div>
                {this.props.tipFormatter(props.value)}
                </div>
            </div>
        );
    },
});

class DraggableSlider extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // dragRange: props.dragRange ? props.dragRange : props.fullRange.map((item) => (item/8 + dragRangeMean )),
            dragRange: props.dragRange ? props.dragRange : props.fullRange,
            fullRange: props.fullRange
        }
    }

    handleSlideChange(values) {
        this.setState({dragRange: values})
        if(this.props.onChange) this.props.onChange(values);
    }

    handleSlideChangeComplete(values) {
        this.setState({dragRange: values})
        if(this.props.onAfterChange) this.props.onAfterChange(values);
    }

    handleDrag(value){
        let dragRange = this.state.dragRange;
        let change = value - (dragRange[0]+dragRange[1])/2;
        let newDragRange =  dragRange.map((item) => (item+change));
        if (newDragRange[1] >= this.state.fullRange[1])
        {
            newDragRange[1] = this.state.fullRange[1];
            newDragRange[0] = this.state.dragRange[0];
        }
        if(newDragRange[0] <= this.state.fullRange[0])
        {
            newDragRange[0] = this.state.fullRange[0];
            newDragRange[1] = this.state.dragRange[1];
        }
        this.setState({dragRange: newDragRange});
        if(this.props.onChange) this.props.onChange(newDragRange);
    }

    handleDragComplete(value){
        this.handleDrag(value);
        if(this.props.onAfterChange) this.props.onAfterChange(this.state.dragRange);
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
                    onAfterChange={this.handleDragComplete.bind(this)}
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