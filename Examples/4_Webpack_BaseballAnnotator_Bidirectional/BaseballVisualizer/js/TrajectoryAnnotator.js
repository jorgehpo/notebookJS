import React, { Component } from 'react';
import PlayDiagram from './PlayDiagram';
import {interpolatePositions, constants, convert_data_format} from './helpers';
import {Container, Row, Col, Button} from 'react-bootstrap';
import 'rc-select/assets/index.less';

import DraggableTimeline from "./DraggableTimeline";
import PropTypes from 'prop-types';

function submitTrajectoryToServer(tracking){
  const alert_sent = ()=>{alert("Trajectory sent to Jupyter Notebook.")};
  let comm = new CommAPI("submit_trajectory", alert_sent)

  // Send data
  comm.call({'trajectory': tracking})
}

function convertRawTrackingToTrajectory(rawTracking) {
  if (rawTracking === null) return [];
  let tracking = Object.create(null);
  constants.gameElements.forEach(element => {
    tracking[element] = [];
    for (let i = 0; i < rawTracking.length; ++i) {
      if (rawTracking[i][element + "_x"] !== null) {
        tracking[element].push({
          x: rawTracking[i][element + "_x"],
          y: rawTracking[i][element + "_y"],
          t: rawTracking[i]["time_elapsed_sec"]
        });
      }
    }
  });
  return tracking;
}

export default class TrajectoryAnnotator extends Component {
  constructor(props){
    super(props);
    this.state = {
      tracking: convertRawTrackingToTrajectory(this.props.tracking),
      trackingDuration: this.props.tracking[this.props.tracking.length-1].time_elapsed_sec,
      playerHead: 0,
      curTracking: "B"
    };
    this.clickPlayDiagram = this.clickPlayDiagram.bind(this);
  }

  clickPlayDiagram(position) {
    const curTracking = this.state.curTracking;
    let newTracking = this.state.tracking[curTracking].filter(annotation => {
      return Math.abs(annotation.t - this.state.playerHead) > 1e-1;
    });
    newTracking.push({
      x: position[0],
      y: position[1],
      t: this.state.playerHead
    });
    const allTrackings = {
      ...this.state.tracking,
    };
    allTrackings[curTracking] = newTracking;
    this.setState({tracking: allTrackings});
  }

  render() {
    return (
      <div>
        Selected Position
        <div style={{display: 'flex'}}>
          {
            constants.gameElements.map((elem) => {
              return <label key={elem} style={{marginRight:15}}>
                <input
                  type="radio" value={elem}
                  checked={this.state.curTracking === elem}
                  onChange={(changeEvent) => {this.setState({curTracking: changeEvent.target.value})}}
                  style={{marginRight: 5}}
                />
                {elem}
              </label>
            })
          }
        </div>
        <PlayDiagram
          width={500}
          height={500}
          onClick={this.clickPlayDiagram}
          tracking={this.state.tracking}
          playUpTo={this.state.playerHead}
          annotationElem={this.state.curTracking}
        />
        <DraggableTimeline
          x={0}
          y={0}
          width={500}
          height={50}
          tracking={this.state.tracking[this.state.curTracking]}
          playerHead={this.state.playerHead}
          onDragTime={(time) => {this.setState({playerHead: time})}}
          trackingDuration={this.state.trackingDuration}
        />

        <Button
          onClick={()=>{
            const originalDataFormat = convert_data_format(this.state.tracking);
            submitTrajectoryToServer(originalDataFormat);
          }}
        >
          Submit
        </Button>

        <Button
          style={{marginLeft: 20}}
          onClick={() => {
            let newTracking = {
              ...this.state.tracking
            };
            newTracking[this.state.curTracking] = [];
            this.setState({tracking: newTracking});
          }}
        >
          Clear trajectory
        </Button>
      </div>
    );
  }
}


TrajectoryAnnotator.propTypes = {
  tracking: PropTypes.arrayOf(PropTypes.object).isRequired
};