import { sliderModel } from './../model/model';
import { sliderView } from './../view/view';
import { IConf, $Idata } from './../../interface';
import { Observer } from '../../observer';




class sliderController extends Observer {
	model: sliderModel;
	view: sliderView;

	constructor(model: sliderModel, view: sliderView) {
		super();
		this.model = model;
		this.view = view;
		this.$createListeners();//срабатывает после инициализации модели
		this.$init();
	}

	$init() {
		this.view.$init(this.model.$conf); //закидываем конфиг из модели в view
		this.$handleFromPosition('FromPosition', this.model.$data);
		this.$handleToPosition('ToPosition', this.model.$data);
		this.$handleBar('Bar', this.model.$data, this.model.$conf);
		this.$handleScale('Scale', this.model.$data, this.model.$conf);

	}

	$createListeners() {
		this.model.subscribe(this.$handleFromPosition);
		this.model.subscribe(this.$handleToPosition);
		this.model.subscribe(this.$handleFromValue);
		this.model.subscribe(this.$handleToValue);
		this.model.subscribe(this.$handleBar);
		this.model.subscribe(this.$handleScale);
		this.model.subscribe(this.$handleIsVertical);
		this.model.subscribe(this.$handleIsRange);
		this.model.subscribe(this.$handleIsScale);
		this.model.subscribe(this.$handleIsBar);
		this.model.subscribe(this.$handleIsTip);


		this.view.subscribe(this.$handleMoveEvent);
		this.view.subscribe(this.$handleKeydownEvent);

	}

	$handleFromPosition = (key: string, data: $Idata) => {
		if (key !== 'FromPosition') return;
		else {
			this.view.$handleFromPosition(key, data);
		}
	}

	$handleToPosition = (key: string, data: $Idata) => {
		if (key !== 'ToPosition') return;
		else {
			this.view.$handleToPosition(key, data);
		}
	}

	$handleFromValue = (key: string, data: $Idata) => {
		if (key !== 'FromValue') return;
		else {
			this.view.$handleFromValue(key, data);
		}
	}

	$handleToValue = (key: string, data: $Idata) => {
		if (key !== 'ToValue') return;
		else {
			this.view.$handleToValue(key, data);
		}
	}

	$handleScale = (key: string, data: $Idata, conf: IConf) => {
		if (key !== 'Scale') return;
		else {
			this.view.$handleScale(key, data, conf);
		}
	}

	$handleBar = (key: string, data: $Idata, conf: IConf) => {
		if (key !== 'Bar') return;
		else {
			this.view.$handleBar(key, data, conf);
		}
	}

	$handleIsVertical = (key: string, data: $Idata, conf: IConf) => {
		if (key !== 'IsVertical') return;
		else {
			this.view.$handleIsVertical(key, data, conf);
		}
	}

	$handleIsRange = (key: string, data: $Idata, conf: IConf) => {
		if (key !== 'IsRange') return;
		else {
			this.view.$handleIsRange(key, data, conf);
		}
	}

	$handleIsScale = (key: string, data: $Idata, conf: IConf) => {
		if (key !== 'IsScale') return;
		else {
			this.view.$handleIsScale(key, data, conf);
		}
	}


	$handleIsBar = (key: string, data: $Idata, conf: IConf) => {
		if (key !== 'IsBar') return;
		else {
			this.view.$handleIsBar(key, data, conf);
		}
	}


	$handleIsTip = (key: string, data: $Idata, conf: IConf) => {
		if (key !== 'IsTip') return;
		else {
			this.view.$handleIsTip(key, data, conf);
		}
	}


	$handleMoveEvent = (key: string, data: $Idata) => {
		if (key !== 'MoveEvent') return;
		else {
			this.model.$calcPos(
				data.$thumb.$type,
				data.$thumb.$clientY,
				data.$thumb.$clientX,
				data.$thumb.$top,
				data.$thumb.$left,
				data.$thumb.$width,
				data.$thumb.$height,
				data.$thumb.$shiftBase,
				data.$thumb.$moovingControl);
		}
	}

	$handleKeydownEvent = (key: string, data: $Idata) => {
		if (key !== 'KeydownEvent') return;
		else {
			this.model.$calcPosKey(
				data.$thumb.$key,
				data.$thumb.$repeat,
				data.$thumb.$moovingControl);
		}
	}

	update(conf: IConf) {
		this.model.$update(conf);
	}
}

export { sliderModel, sliderView, sliderController };

