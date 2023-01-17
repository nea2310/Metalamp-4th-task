const sortArray = (object: Object) => Object.entries(object).sort(
  (a: Array<number>, b: Array<number>) => {
    if (a[0] > b[0]) return 1;
    return -1;
  },
);

export default sortArray;
