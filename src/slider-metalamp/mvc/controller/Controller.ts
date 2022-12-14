import View from '../view/View';
import Model from '../model/Model';
import Observer from '../Observer';
import { IConf, INotifyParameters } from '../interface';

class Controller extends Observer {
  public model: Model | null;

  public view: View | null;

  constructor(model: Model, view: View) {
    super();
    this.model = model;
    this.view = view;
    this.createListeners();
    this.init();
  }

  public update(conf: IConf) {
    if (!this.model) {
      return;
    }
    this.model.update(conf);
  }

  public getData() {
    if (!this.model) {
      return undefined;
    }
    return this.model.getData();
  }

  public disable() {
    if (!this.view) {
      return;
    }
    this.removeListeners();
    this.view.disable();
  }

  public enable() {
    if (!this.view) {
      return;
    }
    this.createListeners();
    this.view.enable();
  }

  public destroy() {
    if (!this.view || !this.view.slider) {
      return;
    }
    this.view.slider.remove();
    this.view = null;
    this.model = null;
  }

  private init() {
    if (!this.view || !this.model) {
      return;
    }
    this.model.getConf(this.view.dataAttributesConf);
    this.view.init(this.model.conf);
    this.model.start();
  }

  private createListeners() {
    if (!this.view || !this.model) {
      return;
    }
    this.model.subscribe(this.handleFromPosition);
    this.model.subscribe(this.handleToPosition);
    this.model.subscribe(this.handleFromValue);
    this.model.subscribe(this.handleToValue);
    this.model.subscribe(this.handleScale);
    this.model.subscribe(this.handleIsVertical);
    this.model.subscribe(this.handleIsRange);
    this.model.subscribe(this.handleIsScale);
    this.model.subscribe(this.handleIsBar);
    this.model.subscribe(this.handleIsTip);
    this.view.subscribe(this.handleMoveEvent);
    this.view.subscribe(this.handleKeydownEvent);
  }

  private removeListeners() {
    if (!this.view || !this.model) {
      return;
    }
    this.model.unsubscribe(this.handleFromPosition);
    this.model.unsubscribe(this.handleToPosition);
    this.model.unsubscribe(this.handleFromValue);
    this.model.unsubscribe(this.handleToValue);
    this.model.unsubscribe(this.handleScale);
    this.model.unsubscribe(this.handleIsVertical);
    this.model.unsubscribe(this.handleIsRange);
    this.model.unsubscribe(this.handleIsScale);
    this.model.unsubscribe(this.handleIsBar);
    this.model.unsubscribe(this.handleIsTip);
    this.view.unsubscribe(this.handleMoveEvent);
    this.view.unsubscribe(this.handleKeydownEvent);
  }

  private handleFromPosition =
  (parms: INotifyParameters) => {
    if (parms.key !== 'FromPosition' || !this.view) {
      return;
    }
    this.view.updateFromPos(parms.data, parms.conf);
  };

  private handleToPosition = (parms: INotifyParameters) => {
    if (parms.key !== 'ToPosition' || !this.view) {
      return;
    }
    this.view.updateToPos(parms.data, parms.conf);
  };

  private handleFromValue = (parms: INotifyParameters) => {
    if (parms.key !== 'FromValue' || !this.view) {
      return;
    }
    this.view.updateFromValue(parms.data);
  };

  private handleToValue = (parms: INotifyParameters) => {
    if (parms.key !== 'ToValue' || !this.view) {
      return;
    }
    this.view.updateToValue(parms.data);
  };

  private handleScale = (parms: INotifyParameters) => {
    if (parms.key !== 'Scale' || !this.view) {
      return;
    }
    this.view.updateScale(parms.data, parms.conf);
  };

  private handleIsVertical = (parms: INotifyParameters) => {
    if (parms.key !== 'IsVertical' || !this.view) {
      return;
    }
    this.view.switchVertical(parms.conf);
  };

  private handleIsRange = (parms: INotifyParameters) => {
    if (parms.key !== 'IsRange' || !this.view) {
      return;
    }
    this.view.switchRange(parms.conf, parms.data);
  };

  private handleIsScale = (parms: INotifyParameters) => {
    if (parms.key !== 'IsScale' || !this.view) {
      return;
    }
    this.view.switchScale(parms.conf);
  };

  private handleIsBar = (parms: INotifyParameters) => {
    if (parms.key !== 'IsBar' || !this.view) {
      return;
    }
    this.view.switchBar(parms.conf);
  };

  private handleIsTip = (parms: INotifyParameters) => {
    if (parms.key !== 'IsTip' || !this.view) {
      return;
    }
    this.view.switchTip(parms.conf);
  };

  private handleMoveEvent = (parms: INotifyParameters) => {
    if (parms.key !== 'MoveEvent' || !this.model) {
      return;
    }
    this.model.calcPositionSetByPointer(parms.data.thumb);
  };

  private handleKeydownEvent = (parms: INotifyParameters) => {
    if (parms.key !== 'KeydownEvent' || !this.model) {
      return;
    }
    this.model.calcPositionSetByKey(parms.data.thumb);
  };
}

export { Model, View, Controller };
