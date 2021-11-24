import { sliderModel } from './../model/model';
import { sliderView } from './../view/view';
import { IConf, Idata } from './../interface';
import { Observer } from '../observer';
class sliderController extends Observer {
	model: sliderModel;
	view: sliderView;
	constructor(model: sliderModel, view: sliderView) {
		super();
		this.model = model;
		this.view = view;
		this.createListeners();//срабатывает после инициализации модели
		this.init();
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


	private handleFromPosition = (key: string, data: Idata, conf: IConf) => {
		if (key !== 'FromPosition') return;
		this.view.updateFromPos(data, conf);
	}
	private handleToPosition = (key: string, data: Idata, conf: IConf) => {
		if (key !== 'ToPosition') return;
		//	else {
		this.view.updateToPos(data, conf);
		//	}
	}

	private handleFromValue = (key: string, data: Idata) => {
		if (key !== 'FromValue') return;
		//	else {
		this.view.updateFromVal(data);
		//	}
	}

	private handleToValue = (key: string, data: Idata) => {
		if (key !== 'ToValue') return;
		//	else {
		this.view.updateToVal(data);
		//	}
	}

	private handleScale = (key: string, data: Idata, conf: IConf) => {
		if (key !== 'Scale') return;
		//	else {
		this.view.updateScale(data, conf);
		//	}
	}

	private handleBar = (key: string, data: Idata, conf: IConf) => {
		//	console.log(data);

		if (key !== 'Bar') return;
		//	else {
		this.view.updateBar(data, conf);
		//	}
	}

	private handleIsVertical = (key: string, data: Idata, conf: IConf) => {
		if (key !== 'IsVertical') return;
		//	else {
		this.view.switchVertical(conf);
		//	}
	}

	private handleIsRange = (key: string, data: Idata, conf: IConf) => {
		if (key !== 'IsRange') return;
		//	else {
		this.view.switchRange(conf);
		//	}
	}

	private handleIsScale = (key: string, data: Idata, conf: IConf) => {
		if (key !== 'IsScale') return;
		//	else {
		this.view.switchScale(conf);
		//	}
	}

	private handleIsBar = (key: string, data: Idata, conf: IConf) => {
		if (key !== 'IsBar') return;
		//	else {
		this.view.switchBar(conf);
		//	}
	}


	private handleIsTip = (key: string, data: Idata, conf: IConf) => {
		if (key !== 'IsTip') return;
		//	else {
		this.view.switchTip(conf);
		//}
	}


	private handleMoveEvent = (key: string, data: Idata) => {
		if (key !== 'MoveEvent') return;
		//	else {
		this.model.calcPos(
			data.thumb.type,
			data.thumb.clientY,
			data.thumb.clientX,
			data.thumb.top,
			data.thumb.left,
			data.thumb.width,
			data.thumb.height,
			data.thumb.shiftBase,
			data.thumb.moovingControl);
		//	}
	}

	private handleKeydownEvent = (key: string, data: Idata) => {
		if (key !== 'KeydownEvent') return;
		//		else {
		this.model.calcPosKey(
			data.thumb.key,
			data.thumb.repeat,
			data.thumb.moovingControl);
		//		}
	}

	public update(conf: IConf) {
		this.model.update(conf);
	}


}

export { sliderModel, sliderView, sliderController };

