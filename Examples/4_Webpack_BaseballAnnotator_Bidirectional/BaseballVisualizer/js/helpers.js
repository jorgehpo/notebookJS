import {linear} from 'everpolate';

export const constants = {
  gameElements: ["P", "B", "R@1", "R@2", "R@3", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "C",
    "BALL"],
  gameElementsDesc: {
    "P": "Pitcher",
    "B": "Batter",
    "R@1": "Runner at first",
    "R@2": "Runner at second",
    "R@3": "Runner at third",
    "1B": "First baseman",
    "2B": "Second baseman",
    "3B": "Third baseman",
    "SS": "Shortstop",
    "LF": "Left fielder",
    "CF": "Center fielder",
    "RF": "Right fielder",
    "C": "Catcher",
    "BALL": "Ball"
  },
};

const input2ndBase = [0.0, 127.2792206],
  outputHomePlate = [125.2, 203.5],
  output2ndBase = [125.2, 150.8],
  inputScale = 1.0 / input2ndBase[1],
  outputScale = 1.0 / (output2ndBase[1] - outputHomePlate[1]);

export function mapFieldSVGX(x){
  const x2 =  (((-x) * inputScale) / outputScale) + outputHomePlate[0];
  return x2;
}

export function mapFieldSVGY(y){
  const y2 = (y * inputScale) / outputScale + outputHomePlate[1];
  return y2;
}

export function mapFieldSVG([x, y]){
  const x2 =  (((-x) * inputScale) / outputScale) + outputHomePlate[0];
  const y2 = (y * inputScale) / outputScale + outputHomePlate[1];
  return [x2, y2];
}

export function mapSVGField([x2, y2]){
  const x = -((x2 - outputHomePlate[0]) * outputScale) / inputScale;
  const y = ((y2 - outputHomePlate[1]) * outputScale) / inputScale;
  return [x, y];
}

export function interpolatePositions(tQuery, positions) {
  //positions: array of [{x, y, t}, ...]
  if (positions.length === 1){
    return {x: positions[0].x, y:positions[0].y};
  }
  positions.sort((a,b) => a.t - b.t);
  if (tQuery <= positions[0].t) {
    return {x: positions[0].x, y: positions[0].y}
  }
  if (tQuery >= positions[positions.length-1].t) {
    return {x: positions[positions.length-1].x, y: positions[positions.length-1].y}
  }
  const t = positions.map(p=>p.t);
  const x = positions.map(p=>p.x);
  const y = positions.map(p=>p.y);
  const mappedX = linear(tQuery, t, x);
  const mappedY = linear(tQuery, t, y);
  return {x: mappedX, y: mappedY};
}


export function convert_data_format(tracking){
  let csvObj = {};
  constants.gameElements.forEach(elem => {
    tracking[elem].forEach( ({x, y, t}) => {
      if (!csvObj[t]) {
        csvObj[t] = {"time_elapsed_sec": t};
        constants.gameElements.forEach(ename => {
          csvObj[t][ename + "_x"]  = null;
          csvObj[t][ename + "_y"] = null;
        })
      }
      csvObj[t][elem + "_x"] = x;
      csvObj[t][elem + "_y"] = y;
    });
  });
  const timeKeys = Object.keys(csvObj);
  timeKeys.sort((a, b) => a - b);
  const csvArray = [];
  timeKeys.forEach(key => {
    csvArray.push(csvObj[key]);
  });
  return csvArray;
}