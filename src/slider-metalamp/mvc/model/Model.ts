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

  public update(configuration: IBusinessDataIndexed) {
    this.configuration = checkConfiguration({ ...this.configuration, ...configuration });
    this.notify('modelUpdate', this.configuration);
  }
}

export default Model;
