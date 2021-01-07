import { calcCordinates } from "./calcCordinates";

export const singleOptimize = (data, dimensions, i) => {
  const d = [];
  if (data.length > 0) {
    dimensions
      .forEach((property) => [property, data[i][property]])
      .sort((a, b) => b[1] - a[1])
      .forEach((item, i) => {
        if (i % 2 == 0) {
          d.push(item[0]);
        } else {
          d.unshift(item[0]);
        }
      });
  }
  return d;
};

export const globalOptimize = (data, dimensionKey, percentile, r) => {
  const candidates = [];
  for (let n = 1; n <= percentile; ++n) {
    const target = Math.ceil((n / 100) * data.length) - 1;
    const p = {};
    const d = [];

    dimensionKey.forEach((key) => {
      p[key] = data.sort((a, b) => a.values[key] - b.values[key])[
        target
      ].values[key];
    });
    console.log(data);
    console.log(target);
    console.log(p);

    dimensionKey
      .map((dimensionKey) => {
        return [dimensionKey, p[dimensionKey]];
      })
      .sort((a, b) => b[1] - a[1])
      .forEach((item, i) => {
        if (i % 2 === 0) {
          d.push(item[0]);
        } else {
          d.unshift(item[0]);
        }
      });

    const points = calcCordinates(data, d, r);

    let distance = 0;
    points.forEach(({ x, y }) => {
      distance += x ** 2 + y ** 2;
    });

    candidates.push({
      dimensions: d,
      distance,
    });
  }
  candidates.sort((a, b) => b.distance - a.distance);
  return candidates[0].dimensions;
};

export const localOptimize = (data, dimensionsKey, percentile, r, selected) => {
  const candidates = [];
  const selectedData = data.filter((_, index) => selected.includes(index));
  for (let n = 1; n <= percentile; ++n) {
    const target = Math.ceil((n / 100) * selectedData.length) - 1;
    const p = {};
    const d = [];

    dimensionsKey.forEach((dimensionKey) => {
      p[dimensionKey] = selectedData.sort(
        (a, b) => a.dimensionKey - b.dimensionKey
      )[target][dimensionKey];
    });

    dimensionsKey
      .map((dimensionKey) => {
        return [dimensionKey, p[dimensionKey]];
      })
      .sort((a, b) => b[1] - a[1])
      .forEach((item, i) => {
        if (i % 2 === 0) {
          d.push(item[0]);
        } else {
          d.unshift(item[0]);
        }
      });

    const points = calcCordinates(selectedData, d, r);
    let distance = 0;
    const centerOfGravity = { x: 0, y: 0 };
    points.forEach(({ x, y }) => {
      centerOfGravity.x += x;
      centerOfGravity.y += y;
    });
    centerOfGravity.x /= points.length;
    centerOfGravity.y /= points.length;

    points.forEach(({ x, y }) => {
      distance += (x - centerOfGravity.x) ** 2 + (y - centerOfGravity.y) ** 2;
    });

    candidates.push({
      dimensions: d,
      distance,
    });
  }
  candidates.sort((a, b) => b.distance - a.distance);
  return candidates[0].dimensions;
};
