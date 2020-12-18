import React, { useState, useEffect } from "react";
// import RadViz from "./RadViz";

import "bulma/css/bulma.min.css";
import "bulma-slider/dist/css/bulma-slider.min.css";
import RadViz from "./components/RadViZ";
import { calcCordinates } from "./utils/calcCordinates";
import {
  globalOptimize,
  localOptimize,
  singleOptimize,
} from "./utils/optimize";

const App = () => {
  // const [data, setData] = useState([]);
  // const [dimensions, setDimensions] = useState([]);
  // const [selected, setSelected] = useState([]);
  // const [current, setCurrent] = useState(null);

  // useEffect(() => {
  //   const dataURL = "data/iris.json";
  //   fetch(dataURL)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const max = {};
  //       const min = {};
  //       const keys = Object.keys(data[0]);
  //       setDimensions(keys.filter((key) => key != "species"));
  //       keys.map((key) => {
  //         max[key] = data[0][key];
  //         min[key] = data[0][key];
  //       });
  //       data.map((item) => {
  //         keys.map((key) => {
  //           if (max[key] < item[key]) {
  //             max[key] = item[key];
  //           }
  //           if (item[key] < min[key]) {
  //             min[key] = item[key];
  //           }
  //         });
  //       });
  //       data.map((item) => {
  //         keys.map((key) => {
  //           item[key] = (item[key] - min[key]) / (max[key] - min[key]);
  //         });
  //       });
  //       setData(data);
  //     })
  //     .catch((err) => console.error(err));
  // }, []);

  // const toggleSelected = (i) => {
  //   if (selected.includes(i)) {
  //     setSelected((prev) => [...prev.filter((n) => n !== i)]);
  //   } else {
  //     setSelected((prev) => [...prev, i]);
  //   }
  //   setCurrent(i);
  // };

  const [data, setData] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentSelected, setCurrentSelected] = useState(null);
  // const [points, setPoints] = useState([]);
  const [percentile, setPercentile] = useState(1);
  const r = 300;

  const dataURL = "data/postcrisis_pq2011.json";
  const clusterKey = "";
  useEffect(() => {
    fetch(dataURL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const max = {};
        const min = {};
        const dimensionsKey = Object.keys(data[0]).filter(
          (key) => key !== clusterKey
        );
        dimensionsKey.map((key) => {
          max[key] = data[0][key];
          min[key] = data[0][key];
        });
        data.map((item) => {
          dimensionsKey.map((key) => {
            if (max[key] < item[key]) {
              max[key] = item[key];
            }
            if (item[key] < min[key]) {
              min[key] = item[key];
            }
          });
        });
        data.map((item) => {
          dimensionsKey.map((key) => {
            item[key] = (item[key] - min[key]) / (max[key] - min[key]);
          });
        });
        setData(data);
        setDimensions(dimensionsKey);
      })
      .catch((err) => console.error(err));
  }, []);

  // useEffect(() => {
  //   setPoints(calcCordinates(data, dimensions, r));
  // }, [dimensions]);

  const selectPoint = (index) => {
    if (selected.includes(index)) {
      setSelected((prev) => prev.filter((item) => item !== index));
    } else {
      setSelected((prev) => [...prev, index]);
    }
    setCurrentSelected(index);
  };

  return (
    <section className="section">
      <div className="columns">
        <div className="column is-one-quarter">
          <div className="box">
            <div className="buttons">
              <button
                className="button is-info"
                disabled={currentSelected === null}
                onClick={() => {
                  setDimensions(
                    singleOptimize(data, dimensions, currentSelected)
                  );
                }}
              >
                Single optimize
              </button>

              <div className="field">
                <label className="label">Percentile</label>
                <div className="control">
                  <input
                    className="slider is-fullwidth is-info has-output"
                    type="range"
                    step="1"
                    min="1"
                    max="100"
                    value={percentile}
                    placeholder="percentile input"
                    id="sliderWithValue"
                    onChange={(e) => setPercentile(e.target.value)}
                  />
                  <output htmlFor="sliderWithValue">{percentile}</output>
                </div>
              </div>

              <button
                className="button is-info"
                disabled={selected.length < 2}
                onClick={() => {
                  setDimensions(
                    localOptimize(data, dimensions, percentile, r, selected)
                  );
                }}
              >
                Local optimize
              </button>
              <button
                className="button is-info"
                onClick={() => {
                  setDimensions(
                    globalOptimize(data, dimensions, percentile, r)
                  );
                }}
              >
                Global optimize
              </button>
              <button
                className="button is-danger"
                disabled={selected.length === 0}
                onClick={() => {
                  setSelected([]);
                  setCurrentSelected(null);
                }}
              >
                Reset selected
              </button>
            </div>
          </div>
        </div>
        <div className="column">
          <RadViz
            data={data}
            dimensions={dimensions}
            currentSelected={currentSelected}
            selected={selected}
            colorKey={clusterKey}
            selectPoint={selectPoint}
            // points={points}
            r={r}
          />
        </div>
      </div>
    </section>
    // <section className="section">
    //   <div className="columns">
    //     <div className="column is-one-quarter">
    //       <div className="container">
    //         <div className="card">
    //           <div className="card-content">
    //             <button className="button">この点について最適化</button>
    //             <button className="button">選択された点について最適化</button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="column">
    //       <div className="container">
    //   <div className="card">
    //     <div className="card-content">
    //   <RadViz
    //     data={data}
    //     dims={dimensions}
    //     colorKey={"species"}
    //     toggleSelected={toggleSelected}
    //     selected={selected}
    //     current={current}
    //   />
    //   </div>
    //   </div>
    //   </div>
    //     </div>
    //   </div>
    // </section>
  );
};

export default App;
