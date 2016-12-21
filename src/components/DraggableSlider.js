/*
 *  Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
import React from 'react';
import Rcslider from 'rc-slider';



const handleStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -100%)',
    cursor: 'pointer',
    padding: '2px',
    border: 'solid 2px #96dbfa',
    borderRadius: '30px',
    background: 'rgb(255, 255, 255)',
    fontSize: '14px',
    textAlign: 'center',
    width:'30px',
    height:'30px'
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
                {/*{this.props.tipFormatter(props.value)}*/}
                </div>
            </div>
        );
    },
});


//Returns the inRange itself if in Range is inside the out range. If not their
const getMarginFixedRange = (inRange, outRange) => {
    let newRange = [...inRange];
    if(inRange[0] < outRange[0])
        newRange[0] = outRange[0];
    if(inRange[1] > outRange[1])
        newRange[1] = outRange[1];
    return newRange;
}


const getMarks = (range, type="int", labelFormatter=a=>a) => {
    let points = {};
    if(!range) return points;

    let gap =  (range[1]-range[0])/10 //Generate a gap depending on the range

    if(type==='time' || type=='date'){
        gap -= gap%Math.pow(10,Math.floor(Math.log10(gap)));
        let min = range[0]+gap
        min = min - min%gap;
        for(let i=min; i<range[1]; i+=gap)
        {
            points[i] = new Date(i).toString();
        }
    }
    else{
        gap -= gap%Math.pow(10,Math.floor(Math.log10(gap)));
        let min = range[0]+gap
        min = min - min%gap;
        for(let i=min; i<range[1]; i+=gap)
        {
            points[i] = labelFormatter(i);
        }
    }

    return points;
}

class DraggableSlider extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // dragRange: props.dragRange ? props.dragRange : props.fullRange.map((item) => (item/8 + dragRangeMean )),
            dragRange: props.dragRange ? props.dragRange : props.fullRange,
            fullRange: props.fullRange
        }
    }

    componentWillMount(){
        this.setZoomedRange();
    }

    handleSlideChange(values) {
        this.setState({dragRange: getMarginFixedRange(values, this.props.fullRange)})
        if(this.props.onChange) this.props.onChange(values);
    }

    handleSlideChangeComplete(values) {
        this.setState({dragRange: getMarginFixedRange(values, this.props.fullRange)})
        if(this.props.onAfterChange) this.props.onAfterChange(values);
        //this.setZoomedRange();
    }


    componentWillReceiveProps(props){
        this.setState({
            dragRange: props.dragRange ? props.dragRange : props.fullRange,
            fullRange: props.fullRange,
            })
        // this.setZoomedRange();
    }

    handleDrag(value){
        let dragRange = this.state.dragRange;
        let change = value - (dragRange[0]+dragRange[1])/2;
        let newDragRange =  dragRange.map((item) => (item+change));
        if (newDragRange[1] >= this.props.fullRange[1])
        {
            newDragRange[1] = this.props.fullRange[1];
            newDragRange[0] = this.state.dragRange[0];
        }
        if(newDragRange[0] <= this.props.fullRange[0])
        {
            newDragRange[0] = this.props.fullRange[0];
            newDragRange[1] = this.state.dragRange[1];
        }
        this.setState({dragRange: newDragRange});
        if(this.props.onChange) this.props.onChange(newDragRange);
    }

    handleDragComplete(value){
        this.handleDrag(value);
        if(this.props.onAfterChange) this.props.onAfterChange(this.state.dragRange);

        //Set the zoomed range after drag
        this.setZoomedRange();
    }

    setZoomedRange(){
        let dragRange = this.state.dragRange;
        let rangeSize = dragRange[1]  - dragRange[0];
        let zoomedRange = [dragRange[0] - rangeSize/2, dragRange[1]+rangeSize/2];
        this.setState({zoomedRange:this.props.fullRange})
    }

    render() {

        return (
            <div>
                <Rcslider
                    marks={getMarks(this.state.zoomedRange, this.props.type)}
                    range={2}
                    min={this.state.zoomedRange[0]}
                    max={this.state.zoomedRange[1]}
                    value={this.state.dragRange}
                    onChange={this.handleSlideChange.bind(this)}
                    onAfterChange={this.handleSlideChangeComplete.bind(this)}
                    tipFormatter={this.props.tipFormatter}
                />

                <Rcslider

                    className="drag-slider"
                    min={this.state.zoomedRange[0]}
                    max={this.state.zoomedRange[1]}
                    value={Math.ceil(this.state.dragRange.reduce((a,b) => a+b, 0 )/2)}
                    onChange={this.handleDrag.bind(this)}
                    onAfterChange={this.handleDragComplete.bind(this)}
                    tipFormatter={this.props.tipFormatter}
                    handle={<CustomHandle/>}
                />




            </div>)
    }

}

export default DraggableSlider;