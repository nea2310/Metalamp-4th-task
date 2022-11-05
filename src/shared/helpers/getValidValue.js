export default function getValidValue(list, value, defaultValue) {
  return list.includes(value) ? value : defaultValue;
}
