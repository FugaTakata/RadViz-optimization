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

// only glocal
export const multiOptimize = (data, dimensionsKey, percentile, r) => {
  const candidates = [];
  for (let n = 0; n <= percentile; ++n) {
    const target = Math.ceil((n / 100) * data.length);
    const p = {};
    const d = [];

    dimensionsKey.forEach((dimensionKey) => {
      p[dimensionKey] = data.sort((a, b) => a.dimensionKey - b.dimensionKey)[
        target
      ];
    });

    console.log(dimensionsKey);
    dimensionsKey
      .map((property) => [property, p[property]])
      .sort((a, b) => b[1] - a[1])
      .forEach((item, i) => {
        if (i % 2 == 0) {
          d.push(item[0]);
        } else {
          d.unshift(item[0]);
        }
      });

    const points = calcCordinates(data, dimensionsKey, r);

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
  console.log(candidates);
  return candidates[0].dimensions;

  // const a = Array.from({ length: data.length }, (v, k) => k);
  // const partition = (a, left, right, pivotIndex) => {
  //   const pivotValue = data[pivotIndex];
  //   const tmp = a[pivotIndex];
  //   a[pivotIndex] = a[right];
  //   a[right] = tmp;
  //   let storeIndex = left;
  //   for (let i = left; i < right; ++i) {
  //     if (data[i] < pivotValue) {
  //       const tmp = a[storeIndex];
  //       a[storeIndex] = a[i];
  //       a[i] = tmp;
  //       ++storeIndex;
  //     }
  //     const tmp = a[right];
  //     a[storeIndex] = a[right];
  //     a[right] = tmp;
  //     return storeIndex;
  //   }
  // };

  // const quickSelect = (a, left, right, k) => {
  //   if (left === right) {
  //     return a[left];
  //   }
  //   let pivotIndex = left;
  //   pivotIndex = partition(a, left, right, pivotIndex);
  //   if (k === pivotIndex) {
  //     return quickSelect(a, left, pivotIndex - 1, k);
  //   } else {
  //     return quickSelect(a, pivotIndex + 1, right, k);
  //   }
  // };

  // dimensions.map();
};
