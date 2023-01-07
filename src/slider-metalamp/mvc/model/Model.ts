import Observer from '../Observer';
import { IBusinessDataIndexed } from '../interface';
import checkConfiguration from './configurationChecker';

class Model extends Observer {
  private configuration: IBusinessDataIndexed = {
    min: 0,
    max: 0,
    from: 0,
    to: 0,
    range: true,
  };

  public init(configuration: IBusinessDataIndexed) {
    this.configuration = checkConfiguration(configuration);
  }

  public update(newConf: IBusinessDataIndexed) {
    this.configuration = checkConfiguration({ ...this.configuration, ...newConf });
  }

  get modelConfiguration() {
    return this.configuration;
  }
}

export default Model;
