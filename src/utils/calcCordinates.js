import * as d3 from "d3";

const calcCordinates = (data, dimensions, r) => {
  const n = dimensions.length;
  const scales = dimensions.map((property) => {
    return d3
      .scaleLinear()
      .domain(d3.extent(data, (item) => item[property]))
      .range([0, 1]);
  });

  return data.map((item, i) => {
    let a = 0;
    let b = 0;
    let c = 0;
    const dt = (2 * Math.PI) / n;
    for (let j = 0; j < n; ++j) {
      const v = scales[j](item[dimensions[j]]);
      a += v * Math.cos(dt * j);
      b += v * Math.sin(dt * j);
      c += v;
    }
    a *= r / c;
    b *= r / c;
    const d = Math.sqrt(a * a + b * b);
    const t = Math.atan2(b, a);
    return { x: d * Math.cos(t), y: d * Math.sin(t) };
  });
};

export { calcCordinates };
