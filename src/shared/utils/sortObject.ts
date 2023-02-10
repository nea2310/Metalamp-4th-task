const sortObject = (object: Object) => Object.entries(object).sort(
  (a, b) => {
    if (a[0] > b[0]) return 1;
    return -1;
  },
);

export default sortObject;
