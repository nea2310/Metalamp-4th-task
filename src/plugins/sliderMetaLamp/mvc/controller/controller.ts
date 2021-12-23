import { IConf, IFireParms } from './../interface';
import { Model } from './../model/model';
import { View } from './../view/view';
import { Observer } from '../observer';

class Controller extends Observer {
	model: Model;
	view: View;
	enabled: boolean;
	constructor(model: Model, view: View) {
		super();
		this.model = model;
		this.view = view;
		this.createListeners();//срабатывает после инициализации модели
		this.init();
		this.enabled = true;
	}

	public update(conf: IConf) {
		this.model.update(conf);
	}

	public getData() {
		return this.model.getData();
	}

	public disable() {
		this.removeListeners();
		this.enabled = false;
		this.view.disable();
	}

	public enable() {
		if (!this.enabled) {
			this.createListeners();
			this.view.enable();
		}
		this.enabled = true;
	}

	public destroy() {
		this.view.slider.remove();
		this.view = null;
		this.model = null;
	}

	private init() {
		this.model.getConf(this.view.backEndConf);
		this.view.init(this.model.conf); //закидываем конфиг из модели в view
		this.model.start();
	}

	private createListeners() {
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

	private removeListeners() {
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


	private handleFromPosition =
		(parms: IFireParms) => {
			if (parms.key !== 'FromPosition') return;
			this.view.updateFromPos(parms.data, parms.conf);
		}
	private handleToPosition = (parms: IFireParms) => {
		if (parms.key !== 'ToPosition') return;
		this.view.updateToPos(parms.data, parms.conf);
	}

	private handleFromValue = (parms: IFireParms) => {
		if (parms.key !== 'FromValue') return;
		this.view.updateFromVal(parms.data);
	}

	private handleToValue = (parms: IFireParms) => {
		if (parms.key !== 'ToValue') return;
		this.view.updateToVal(parms.data);
	}

	private handleScale = (parms: IFireParms) => {
		if (parms.key !== 'Scale') return;
		this.view.updateScale(parms.data, parms.conf);
	}

	private handleBar = (parms: IFireParms) => {
		if (parms.key !== 'Bar') return;
		this.view.updateBar(parms.data, parms.conf);
	}

	private handleIsVertical = (parms: IFireParms) => {
		if (parms.key !== 'IsVertical') return;
		this.view.switchVertical(parms.conf);
	}

	private handleIsRange = (parms: IFireParms) => {
		if (parms.key !== 'IsRange') return;
		this.view.switchRange(parms.conf);
	}

	private handleIsScale = (parms: IFireParms) => {
		if (parms.key !== 'IsScale') return;
		this.view.switchScale(parms.conf);
	}

	private handleIsBar = (parms: IFireParms) => {
		if (parms.key !== 'IsBar') return;
		this.view.switchBar(parms.conf);
	}


	private handleIsTip = (parms: IFireParms) => {
		if (parms.key !== 'IsTip') return;
		this.view.switchTip(parms.conf);
	}


	private handleMoveEvent = (parms: IFireParms) => {
		if (parms.key !== 'MoveEvent') return;
		this.model.calcPos(
			parms.data.thumb.type,
			parms.data.thumb.clientY,
			parms.data.thumb.clientX,
			parms.data.thumb.top,
			parms.data.thumb.left,
			parms.data.thumb.width,
			parms.data.thumb.height,
			parms.data.thumb.shiftBase,
			parms.data.thumb.moovingControl);
	}

	private handleKeydownEvent = (parms: IFireParms) => {
		if (parms.key !== 'KeydownEvent') return;
		this.model.calcPosKey(
			parms.data.thumb.key,
			parms.data.thumb.repeat,
			parms.data.thumb.moovingControl);
	}
}

export { Model, View, Controller };

