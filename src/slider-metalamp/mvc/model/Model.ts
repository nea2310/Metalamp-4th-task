import Observer from '../Observer';
import { IBusinessDataIndexed } from '../interface';
import checkConfiguration from './configurationChecker';

class Model extends Observer {
  public conf: IBusinessDataIndexed = {
    min: 0,
    max: 0,
    from: 0,
    to: 0,
    range: true,
  };

  public init(configuration: IBusinessDataIndexed) {
    this.conf = checkConfiguration(configuration);
  }

  public update(newConf: IBusinessDataIndexed) {
    this.conf = checkConfiguration({ ...this.conf, ...newConf });
  }
}

export default Model;
