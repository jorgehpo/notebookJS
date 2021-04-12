import React, { Component } from 'react';
import PropTypes from "prop-types";
import { mapFieldSVG, mapSVGField, constants, mapFieldSVGY, mapFieldSVGX, interpolatePositions } from './helpers';
import $ from "jquery";
import * as d3 from "d3";
import fieldsvg from "./field.svg";

export default class PlayDiagram extends Component {
  render() {
    let ball = null;

    let line = d3.line()
      .x((d) => {
        return mapFieldSVGX(d.x);
      })
      .y((d) => {
        return mapFieldSVGY(d.y);
      });

    const lineElems = [];
    const endElems = [];

    constants.gameElements.forEach( elem => {
      if (this.props.tracking && this.props.tracking[elem] && this.props.tracking[elem].length > 0){
        const tracking = this.props.tracking;
        const newTrackingElem = [];
        for (let i = 0; i < tracking[elem].length; ++i){
          if (tracking[elem][i].t > this.props.playUpTo){
            break;
          }
          newTrackingElem.push(tracking[elem][i]);
        }
        const lastPos = interpolatePositions(this.props.playUpTo, tracking[elem]);
        newTrackingElem.push( {...lastPos, t: this.props.playUpTo} );
        lineElems.push(
          <path
            d={line(newTrackingElem)}
            style={{
              strokeWidth: 0.6,
              strokeOpacity: 1,
              strokeDasharray: elem==="BALL" ? "3 3" : "0",
              fillOpacity: 0,
              stroke: "#000"
            }}
            key={elem}
          />);

        if (elem === this.props.annotationElem) {
          endElems.push(<circle
              cx={mapFieldSVGX(lastPos.x)}
              cy={mapFieldSVGY(lastPos.y)}
              r={3}
              style={{
                  fill: 'white',
                  stroke: 'black',
                  strokeWidth: 1
              }}
              key={elem}
            />);

        } else {
          endElems.push(
            <circle
              cx={mapFieldSVGX(lastPos.x)}
              cy={mapFieldSVGY(lastPos.y)}
              r={1}
              style={{
                stroke: "#000",
                fill: "#000"
              }}
              key={elem}
            />
          );
        }
      }
    });
    return (
        <svg id="playDiagramBallSVG" viewBox={"0 0 250 250"} style={{width:this.props.width, height: this.props.height}}
             onClick={(evt)=> {
               let container = $("#playDiagramBallSVG").get(0).getBoundingClientRect();
               let x = evt.clientX - container.left;
               let y = evt.clientY - container.top;
               const scaleX = 250/this.props.width;
               const scaleY = 250/this.props.height;
               let mapped = mapSVGField([x * scaleX, y * scaleY]);
               this.props.onClick(mapped);
             }}>
          <image width={250} height={250} xlinkHref={fieldsvg}/>
          {lineElems}
          {endElems}
          {ball}
        </svg>
    );
  }
}

PlayDiagram.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  playUpTo: PropTypes.number,
  tracking: PropTypes.object,
  annotationElem: PropTypes.string
};

PlayDiagram.defaultProps = {
  width: 500,
  height: 500
};
