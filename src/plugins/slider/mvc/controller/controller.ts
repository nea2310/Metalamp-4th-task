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
			console.log('SCALE');


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

	// testAPI() {
	// 	console.log('Test API');

	// }

	update(conf: IConf) {
		console.log('UPDATE');

		this.model.$update(conf);

	}



	// handleIntervalCalc =
	// 	(step: string) => {
	// 		this.viewPanel.updateStep(step);
	// 	}


	// handleStepCalc =
	// 	(interval: string) => {
	// 		this.viewPanel.updateInterval(interval);
	// 	}

	// handleOnScaleMarksUpdated =
	// 	(scaleMarks: { 'pos'?: number, 'val'?: number }[]) => {
	// 		this.viewScale.createScale(scaleMarks, this.conf);
	// 	}



	// handleIsVerticalChecked = () => {
	// 	this.conf.vertical = true;
	// 	this.handleWindowReRendering();
	// }

	// handleIsVerticalNotChecked = () => {
	// 	this.conf.vertical = false;
	// 	this.handleWindowReRendering();
	// }


	// handleIsRangeChecked = () => {
	// 	this.conf.range = true;
	// 	this.viewControl.updateRangeMode(true);
	// }

	// handleIsRangeNotChecked = () => {
	// 	this.conf.range = false;
	// 	this.viewControl.updateRangeMode(false);
	// }

	// handleAdjustControlPos = () => {
	// 	this.model.adjustControlPos();
	// }

	// handleIsScaleChecked = () => {
	// 	this.conf.scale = true;
	// 	this.viewScale.updateScaleMode(true);
	// }

	// handleIsScaleNotChecked = () => {
	// 	this.conf.scale = false;
	// 	this.viewScale.updateScaleMode(false);
	// }

	// handleIsBarChecked = () => {
	// 	this.conf.bar = true;
	// 	this.viewBar.updateBarMode(true);
	// }

	// handleIsBarNotChecked = () => {
	// 	this.conf.bar = false;
	// 	this.viewBar.updateBarMode(false);
	// }



	// handleIsTipChecked = () => {
	// 	this.conf.tip = true;
	// 	this.viewControl.updateTipMode(true);
	// }

	// handleIsTipNotChecked = () => {
	// 	this.conf.tip = false;
	// 	this.viewControl.updateTipMode(false);
	// }

	// handleIsStickyChecked = () => {
	// 	this.conf.sticky = true;
	// }

	// handleIsStickyNotChecked = () => {
	// 	this.conf.sticky = false;
	// }



	// handleFromToChanged = (val: string, e: Event) => {
	// 	const target = e.target as HTMLElement;

	// 	if (target.classList.contains('rs__input-from')) {
	// 		this.conf.from = parseInt(val);
	// 		this.viewControl.updateTipVal(val, true);
	// 	} else {
	// 		this.conf.to = parseInt(val);
	// 			this.viewControl.updateTipVal(val, false);
	// 	}
	// }


	// handleOnStepValueUpdated = (newValue: string) => {
	// 	this.viewPanel.updateInterval(newValue);
	// }



	// handleOnIntervalValueUpdated = (newValue: string) => {
	// 	this.viewPanel.updateStep(newValue);
	// }

	// handleMinMaxChanged = (val: string, e: Event) => {
	// 	const target = e.target as HTMLElement;

	// 	if (target.classList.contains('rs__input-min')) {

	// 		this.conf.min = parseInt(val);
	// 		this.viewControl.updateTipVal(val, true);
	// 	} else if (target.classList.contains('rs__input-max')) {

	// 		this.conf.max = parseInt(val);
	// 		this.viewControl.updateTipVal(val, false);
	// 	}

	// 	this.handleWindowReRendering();
	// }

	// handleStepChanged = (val: string) => {
	// 	this.conf.step = parseInt(val);
	// 	delete this.conf.intervals;
	// 	this.handleOnScaleMarksUpdated(this.model.marksArr);
	// }


	// handleIntervalChanged = (val: string) => {
	// 	this.conf.intervals = parseInt(val);
	// 	delete this.conf.step;
	// 	this.handleOnScaleMarksUpdated(this.model.marksArr);
	// }

	// handleShiftOnKeyDownChange = (val: string) => {
	// 	this.conf.shiftOnKeyDown = parseInt(val);
	// }

	// handleShiftOnKeyHoldChange = (val: string) => {
	// 	this.conf.shiftOnKeyHold = parseInt(val);
	// }


	// handleWindowReRendering = () => {
	// 	this.view.deleteSlider();
	// };
}

export { sliderModel, sliderView, sliderController };

