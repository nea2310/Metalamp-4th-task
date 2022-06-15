import Model from '../model/model';
import View from '../view/view';
import Observer from '../observer';
import { IConf, IFireParms } from '../interface';

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
      this.model.subscribe(this.handleBar);
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
      this.model.unsubscribe(this.handleBar);
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
    (parms: IFireParms) => {
      if (parms.key !== 'FromPosition') return;
      if (this.view) {
        this.view.updateFromPos(parms.data, parms.conf);
      }
    }

  private handleToPosition = (parms: IFireParms) => {
    if (parms.key !== 'ToPosition') return;
    if (this.view) {
      this.view.updateToPos(parms.data, parms.conf);
    }
  }

  private handleFromValue = (parms: IFireParms) => {
    if (parms.key !== 'FromValue') return;
    if (this.view) {
      this.view.updateFromValue(parms.data);
    }
  }

  private handleToValue = (parms: IFireParms) => {
    if (parms.key !== 'ToValue') return;
    if (this.view) {
      this.view.updateToValue(parms.data);
    }
  }

  private handleScale = (parms: IFireParms) => {
    if (parms.key !== 'Scale') return;
    if (this.view) {
      this.view.updateScale(parms.data, parms.conf);
    }
  }

  private handleBar = (parms: IFireParms) => {
    if (parms.key !== 'Bar') return;
    if (this.view) {
      this.view.updateBar(parms.data, parms.conf);
    }
  }

  private handleIsVertical = (parms: IFireParms) => {
    if (parms.key !== 'IsVertical') return;
    if (this.view) {
      this.view.switchVertical(parms.conf);
    }
  }

  private handleIsRange = (parms: IFireParms) => {
    if (parms.key !== 'IsRange') return;
    if (this.view) {
      this.view.switchRange(parms.conf);
    }
  }

  private handleIsScale = (parms: IFireParms) => {
    if (parms.key !== 'IsScale') return;
    if (this.view) {
      this.view.switchScale(parms.conf);
    }
  }

  private handleIsBar = (parms: IFireParms) => {
    if (parms.key !== 'IsBar') return;
    if (this.view) {
      this.view.switchBar(parms.conf);
    }
  }

  private handleIsTip = (parms: IFireParms) => {
    if (parms.key !== 'IsTip') return;
    if (this.view) {
      this.view.switchTip(parms.conf);
    }
  }

  private handleMoveEvent = (parms: IFireParms) => {
    if (parms.key !== 'MoveEvent') return;
    if (this.model) {
      this.model.calcPositionSetByPointer({
        type: parms.data.thumb.type,
        clientY: parms.data.thumb.clientY,
        clientX: parms.data.thumb.clientX,
        top: parms.data.thumb.top,
        left: parms.data.thumb.left,
        width: parms.data.thumb.width,
        height: parms.data.thumb.height,
        shiftBase: parms.data.thumb.shiftBase,
        moovingControl: parms.data.thumb.moovingControl,
      });
    }
  }

  private handleKeydownEvent = (parms: IFireParms) => {
    if (parms.key !== 'KeydownEvent') return;
    if (this.model) {
      this.model.calcPositionSetByKey({
        key: parms.data.thumb.key,
        repeat: parms.data.thumb.repeat,
        moovingControl: parms.data.thumb.moovingControl,
      });
    }
  }
}

export { Model, View, Controller };
