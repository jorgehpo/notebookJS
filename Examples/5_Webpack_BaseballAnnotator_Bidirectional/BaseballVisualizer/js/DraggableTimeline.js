import React from "react";
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Slider  from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class DraggableTimeline extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.tracking === nextProps.tracking) {
      return false;
    }
    return true;
  }

  render () {
    const tracking = this.props.tracking;
    const annotatedPoints = {};

    tracking.forEach(({x, y, t}, idx) =>
    {
      annotatedPoints[t] = {};
    });

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const SliderTP = createSliderWithTooltip(Slider);

    return (
      <div style={{width: this.props.width, marginBottom: 15}}>
        <SliderTP
        min={0}
        max={this.props.trackingDuration}
        step={0.01}
        defaultValue={this.props.playerHead}
        onChange={value => {this.props.onDragTime(value)}}
        marks={annotatedPoints}
        activeDotStyle={{ borderColor: 'steelblue' }}
        dotStyle={{borderColor: 'steelblue' }}
        trackStyle={{ backgroundColor: 'steelblue' }}
        railStyle={{ backgroundColor: 'steelblue' }}
        width={this.props.width}
        />
      </div>
    );
  }
}

DraggableTimeline.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  tracking: PropTypes.array,
  playerHead: PropTypes.number,
  margin: PropTypes.object,
  onDragTime: PropTypes.func.isRequired,
  trackingDuration: PropTypes.number.isRequired,
};

DraggableTimeline.defaultProps = {
  width: 400,
  height: 10,
  margin: {top:10, bottom: 10, left: 10, right:10}
};
