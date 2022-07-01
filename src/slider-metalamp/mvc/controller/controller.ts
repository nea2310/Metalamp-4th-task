/* eslint-disable no-console */
import Model from '../model/model';
import View from '../view/view';
import Observer from '../observer';
import { IConf, INotifyParameters } from '../interface';

class Controller extends Observer {
  model: Model | null;

  view: View | null;

  isEnabled: boolean;

  constructor(model: Model, view: View) {
    super();
    this.model = model;
    this.view = view;
    this.createListeners();// срабатывает после инициализации модели
    this.init();
    this.isEnabled = true;
  }

  public update(conf: IConf) {
    if (this.model) {
      this.model.update(conf);
    }
  }

  public getData() {
    if (this.model) {
      return this.model.getData();
    }
    return true;
  }

  public disable() {
    if (this.view) {
      this.removeListeners();
      this.isEnabled = false;
      this.view.disable();
    }
  }

  public enable() {
    if (!this.isEnabled && this.view) {
      this.createListeners();
      this.view.enable();
    }
    this.isEnabled = true;
  }

  public destroy() {
    if (this.view && this.view.slider) {
      this.view.slider.remove();
      this.view = null;
      this.model = null;
    }
  }

  private init() {
    if (this.view && this.model) {
      this.model.getConf(this.view.dataAttributesConf);
      this.view.init(this.model.conf);
      this.model.start();
    }
  }

  private createListeners() {
    if (this.view && this.model) {
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
  }

  private removeListeners() {
    if (this.view && this.model) {
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
  }

  private handleFromPosition =
    (parms: INotifyParameters) => {
      if (parms.key !== 'FromPosition') return;
      if (this.view) {
        this.view.updateFromPos(parms.data, parms.conf);
      }
    }

  private handleToPosition = (parms: INotifyParameters) => {
    if (parms.key !== 'ToPosition') return;
    if (this.view) {
      this.view.updateToPos(parms.data, parms.conf);
    }
  }

  private handleFromValue = (parms: INotifyParameters) => {
    if (parms.key !== 'FromValue') return;
    if (this.view) {
      this.view.updateFromValue(parms.data);
    }
  }

  private handleToValue = (parms: INotifyParameters) => {
    if (parms.key !== 'ToValue') return;
    if (this.view) {
      this.view.updateToValue(parms.data);
    }
  }

  private handleScale = (parms: INotifyParameters) => {
    if (parms.key !== 'Scale') return;
    if (this.view) {
      this.view.updateScale(parms.data, parms.conf);
    }
  }

  private handleIsVertical = (parms: INotifyParameters) => {
    if (parms.key !== 'IsVertical') return;
    if (this.view) {
      this.view.switchVertical(parms.conf);
    }
  }

  private handleIsRange = (parms: INotifyParameters) => {
    if (parms.key !== 'IsRange') return;
    if (this.view) {
      this.view.switchRange(parms.conf, parms.data);
    }
  }

  private handleIsScale = (parms: INotifyParameters) => {
    if (parms.key !== 'IsScale') return;
    if (this.view) {
      this.view.switchScale(parms.conf);
    }
  }

  private handleIsBar = (parms: INotifyParameters) => {
    if (parms.key !== 'IsBar') return;
    if (this.view) {
      this.view.switchBar(parms.conf);
    }
  }

  private handleIsTip = (parms: INotifyParameters) => {
    if (parms.key !== 'IsTip') return;
    if (this.view) {
      this.view.switchTip(parms.conf);
    }
  }

  private handleMoveEvent = (parms: INotifyParameters) => {
    if (parms.key !== 'MoveEvent') return;
    if (this.model) {
      this.model.calcPositionSetByPointer(parms.data.thumb);
    }
  }

  private handleKeydownEvent = (parms: INotifyParameters) => {
    if (parms.key !== 'KeydownEvent') return;
    if (this.model) {
      this.model.calcPositionSetByKey(parms.data.thumb);
    }
  }
}

export { Model, View, Controller };
