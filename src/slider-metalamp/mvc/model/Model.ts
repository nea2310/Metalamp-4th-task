import Observer from '../Observer';
import { IBusinessDataIndexed } from '../interface';
import checkConfiguration from './configurationChecker';

const DEFAULT_VALUE = 0;
const DEFAULT_SHIFT = 1;

class Model extends Observer {
  private configuration: IBusinessDataIndexed = {
    min: DEFAULT_VALUE,
    max: DEFAULT_VALUE,
    from: DEFAULT_VALUE,
    to: DEFAULT_VALUE,
    range: true,
    shiftOnKeyDown: DEFAULT_SHIFT,
    shiftOnKeyHold: DEFAULT_SHIFT,
  };

  public update(configuration: IBusinessDataIndexed) {
    this.configuration = checkConfiguration({ ...this.configuration, ...configuration });
  }

  get modelConfiguration() {
    return this.configuration;
  }
}

export default Model;
