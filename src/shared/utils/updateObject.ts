import { IPluginConfiguration } from '../../slider-metalamp/mvc/interface';

const updateObject = (
  objects: Array<HTMLInputElement>,
  data: { [key: string]: unknown } & IPluginConfiguration,
) => {
  const updatedObject = objects.map((object) => {
    const usageType = object.className.match(/usage_\S*/);
    const type = usageType ? usageType[0].replace('usage_', '') : '';
    const item = object;
    item.checked = /toggle/.test(object.className) ? !!data[type] : false;
    item.value = String(data[type]);
    return object;
  });
  return updatedObject;
};

export default updateObject;
