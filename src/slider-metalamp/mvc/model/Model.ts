import sortArray from '../../../shared/utils/sortArray';
import Observer from '../Observer';
import { IBusinessDataIndexed } from '../interface';
import checkConfiguration from './configurationChecker';

const DEFAULT_VALUE = 0;
const DEFAULT_SHIFT = 1;

class Model extends Observer {
  private configuration: IBusinessDataIndexed = {
    min: DEFAULT_VALUE,
    max: DEFAULT_SHIFT,
    from: DEFAULT_VALUE,
    to: DEFAULT_SHIFT,
    range: true,
    shiftOnKeyDown: DEFAULT_SHIFT,
    shiftOnKeyHold: DEFAULT_SHIFT,
  };

  static getString(object: Object) {
    return sortArray(object).flat().join();
  }

  public update(configuration: IBusinessDataIndexed) {
    const oldConfiguration = ({ ...this.configuration });
    const newConfiguration = checkConfiguration({ ...this.configuration, ...configuration });
    if (Model.getString(oldConfiguration) !== Model.getString(newConfiguration)) {
      this.configuration = newConfiguration;
      this.notify('model', newConfiguration);
    }
  }
}

export default Model;
