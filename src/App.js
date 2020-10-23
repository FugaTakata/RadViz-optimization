import React, { useState, useEffect } from "react";
import RadViz from "./RadViz";

const App = () => {
  const [data, setData] = useState([]);
  const [dimensions, setDimensions] = useState([]);

  useEffect(() => {
    const dataURL = "data/iris.json";
    fetch(dataURL)
      .then((res) => res.json())
      .then((data) => {
        const max = {};
        const min = {};
        const keys = Object.keys(data[0]);
        setDimensions(keys.filter((key) => key != "species"));
        keys.map((key) => {
          max[key] = data[0][key];
          min[key] = data[0][key];
        });
        data.map((item) => {
          keys.map((key) => {
            if (max[key] < item[key]) {
              max[key] = item[key];
            }
            if (item[key] < min[key]) {
              min[key] = item[key];
            }
          });
        });
        data.map((item) => {
          keys.map((key) => {
            item[key] = (item[key] - min[key]) / (max[key] - min[key]);
          });
        });
        setData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <RadViz data={data} dims={dimensions} colorKey={"species"} />
    </div>
  );
};

export default App;
