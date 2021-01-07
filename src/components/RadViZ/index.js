import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { calcCordinates } from "../../utils/calcCordinates";

const RadViz = ({
  data,
  dimensions,
  selectPoint,
  colorKey,
  // points,
  r,
  currentSelected,
  selected,
}) => {
  const [points, setPoints] = useState([]);
  const contentWidth = 2 * r;
  const contentHeight = 2 * r;
  const margin = 50;
  const width = contentWidth + margin * 2;
  const height = contentHeight + margin * 2;
  const lineColor = "#444";

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  // console.log(data);
  for (const item of data) {
    color(item[colorKey]);
  }

  useEffect(() => {
    setPoints(calcCordinates(data, dimensions, r));
  }, [dimensions]);

  return (
    <div className="card">
      <div className="card-content">
        <svg viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${margin + r},${margin + r})`}>
            <circle r={r} fill="none" stroke={lineColor} />
            {dimensions.map((property, i) => {
              return (
                <g
                  key={i}
                  transform={`rotate(${(360 / dimensions.length) * i + 90})`}
                >
                  <line x1="0" y1="0" x2="0" y2={-r} stroke={lineColor} />
                  <text
                    y={-r}
                    textAnchor="start"
                    // stroke={property === "WHO" ? "red" : "black"}
                    // dominantBaseline="text-after-edge"
                    dominantBaseline="middle"
                    transform={`rotate(-90 ${0} ${-r})`}
                  >
                    {property}
                  </text>
                </g>
              );
            })}
            {data.map((item, i) => {
              if (points.length > 0) {
                const { x, y } = points[i];
                return (
                  <g
                    key={i}
                    transform={`translate(${x},${y})`}
                    onClick={() => {
                      selectPoint(i);
                    }}
                  >
                    <circle
                      r="3"
                      stroke={
                        i === currentSelected
                          ? "red"
                          : selected.includes(i)
                          ? "black"
                          : "none"
                      }
                      fill={
                        color(item[colorKey])
                        // i === currentSelected
                        //   ? "red"
                        //   : selected.includes(i)
                        //   ? "orange"
                        //   : color(item[colorKey])
                      }
                      opacity="0.8"
                    >
                      <title>{dimensions.map((p) => item[p]).join(",")}</title>
                    </circle>
                  </g>
                );
              }
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default RadViz;
