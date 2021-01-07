// import React, { useEffect, useState } from "react";
// import * as d3 from "d3";

// const singleOptimizer = (data, dimensions, i) => {
//   const d = [];
//   if (data.length > 0) {
//     dimensions
//       .map((property) => [property, data[i][property]])
//       .sort((a, b) => b[1] - a[1])
//       .map((item, i) => {
//         if (i % 2 == 0) {
//           d.push(item[0]);
//         } else {
//           d.unshift(item[0]);
//         }
//       });
//   }
//   return d;
// };

// const radviz = (data, dimensions, r) => {
//   const n = dimensions.length;
//   const scales = dimensions.map((property) => {
//     return d3
//       .scaleLinear()
//       .domain(d3.extent(data, (item) => item[property]))
//       .range([0, 1]);
//   });
//   return data.map((item, i) => {
//     let a = 0;
//     let b = 0;
//     let c = 0;
//     const dt = (2 * Math.PI) / n;
//     for (let j = 0; j < n; ++j) {
//       const v = scales[j](item[dimensions[j]]);
//       a += v * Math.cos(dt * j);
//       b += v * Math.sin(dt * j);
//       c += v;
//     }
//     a *= r / c;
//     b *= r / c;
//     const d = Math.sqrt(a * a + b * b);
//     const t = Math.atan2(b, a);
//     return { x: d * Math.cos(t), y: d * Math.sin(t) };
//   });
// };

// const RadViz = ({
//   data,
//   dims,
//   colorKey,
//   toggleSelected,
//   current,
//   selected,
// }) => {
//   const r = 300;
//   const contentWidth = 2 * r;
//   const contentHeight = 2 * r;
//   const margin = 50;
//   const width = contentWidth + margin * 2;
//   const height = contentHeight + margin * 2;
//   const lineColor = "#444";
//   const [dimensions, setDimensions] = useState([]);
//   const [points, setpoints] = useState([]);

//   const color = d3.scaleOrdinal(d3.schemeCategory10);
//   for (const item of data) {
//     color(item[colorKey]);
//   }

//   useEffect(() => {
//     setpoints(radviz(data, dimensions, r));
//   }, [dimensions]);

//   useEffect(() => {
//     setDimensions(dims);
//   }, [dims]);

//   return (
//     <div className="card">
//       <div className="card-content">
//         <svg viewBox={`0 0 ${width} ${height}`}>
//           <g transform={`translate(${margin + r},${margin + r})`}>
//             <circle r={r} fill="none" stroke={lineColor} />
//             {dimensions.map((property, i) => {
//               return (
//                 <g
//                   key={i}
//                   transform={`rotate(${(360 / dimensions.length) * i + 90})`}
//                 >
//                   <line x1="0" y1="0" x2="0" y2={-r} stroke={lineColor} />
//                   <text
//                     y={-r}
//                     textAnchor="middle"
//                     dominantBaseline="text-after-edge"
//                   >
//                     {property}
//                   </text>
//                 </g>
//               );
//             })}
//             {data.map((item, i) => {
//               if (points.length > 0) {
//                 const { x, y } = points[i];
//                 return (
//                   <g
//                     key={i}
//                     transform={`translate(${x},${y})`}
//                     onClick={() => {
//                       toggleSelected(i);
//                     }}
//                   >
//                     <circle r="3" fill={color(item[colorKey])} opacity="0.8">
//                       <title>{dimensions.map((p) => item[p]).join(",")}</title>
//                     </circle>
//                   </g>
//                 );
//               }
//             })}
//           </g>
//         </svg>
//         <div className="buttons">
//           <button
//             className="button"
//             disabled={current === null}
//             onClick={() => {
//               setDimensions(singleOptimizer(data, dimensions, current));
//             }}
//           >
//             この点について最適化
//           </button>
//           <button
//             className="button"
//             disabled={selected.length === 0}
//             onClick={() => {
//               // setDimensions(optimizer(data, dimensions, selected));
//             }}
//           >
//             選択された点について最適化
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RadViz;
