import React from "react";
import ReactDOM from "react-dom";
import { select } from "d3-selection";
import TrajectoryAnnotator from "./TrajectoryAnnotator";

export function renderBaseballAnnotator(divName, data){
	ReactDOM.render(
		<TrajectoryAnnotator tracking={JSON.parse(data.tracking)}/>
		, select(divName).node());
}
