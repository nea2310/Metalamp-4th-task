const sortArray = (object: Object) => Object.entries(object).sort(
  (a: any, b: any) => {
    if (a[0] > b[0]) return 1;
    return -1;
  },
);

export default sortArray;
