import { sliderModel } from './../model/model';
import { sliderView } from './../view/view';
import { sliderViewScale } from './../view/view-scale/view-scale';
import { sliderViewPanel } from './../view/view-panel/view-panel';
import { sliderViewControl } from
	'./../view/view-control/view-control';
import { sliderViewGrid } from './../view/view-grid/view-grid';
import { sliderViewBar } from './../view/view-bar/view-bar';



import {
	IConf,
	IControlElements,
	$Idata
} from './../interface';
import { Observer } from '../observer/observer';




class sliderController extends Observer {
	model: sliderModel;
	view: sliderView;
	viewScale: sliderViewScale;
	viewControl: sliderViewControl;
	viewPanel: sliderViewPanel;
	viewGrid: sliderViewGrid;
	viewBar: sliderViewBar;
	conf: IConf;
	root: string;
	defaultConf: IConf;
	customConf: IConf;
	controlData: IControlElements;

	constructor(root: string, conf: IConf,
		view: sliderView,
		model: sliderModel) {
		super();
		this.model = model;
		this.view = view;
		this.conf = conf;
		this.root = root;
		this.$createListeners();//срабатывает после инициализации модели
		this.$init();
	}


	$createListeners() {
		this.model.subscribe(this.$handleFromPosition);
		this.model.subscribe(this.$handleToPosition);
		this.model.subscribe(this.$handleFromValue);
		this.model.subscribe(this.$handleToValue);
		this.model.subscribe(this.$handleBar);
		this.model.subscribe(this.$handleScale);
		this.model.subscribe(this.$handleGrid);
		this.view.subscribe(this.$handleMoveEvent);
		this.view.subscribe(this.$handleKeydownEvent);

	}

	$init() {
		this.view.$init(this.model.$conf); //закидываем конфиг из модели в view
		this.$handleFromPosition('FromPosition', this.model.$data);
		this.$handleToPosition('ToPosition', this.model.$data);
		this.$handleBar('Bar', this.model.$data, this.model.$conf);
		this.$handleScale('Grid', this.model.$data, this.model.$conf);
		this.$handleGrid('Grid', this.model.$data); // это нужно только для внесения значения в панель

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
		if (key !== 'Grid') return;
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

	$handleGrid = (key: string, data: $Idata) => {
		if (key !== 'Grid') return;
		else {
			this.view.$handleGrid(key, data);
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

	// вызываем метод computeNewPosKeyEvnt в модели
	$handleKeydownEvent = (key: string, data: $Idata) => {
		//	this.model.computePosFromKeyboardEvent(e);
		if (key !== 'KeydownEvent') return;
		else {
			this.model.$calcPosKey(
				data.$thumb.$key,
				data.$thumb.$repeat,
				data.$thumb.$moovingControl);
		}
	}





	handleIntervalCalc =
		(step: string) => {
			this.viewPanel.updateStep(step);
		}


	handleStepCalc =
		(interval: string) => {
			this.viewPanel.updateInterval(interval);
		}

	handleOnScaleMarksUpdated =
		(scaleMarks: { 'pos'?: number, 'val'?: number }[]) => {
			this.viewGrid.createGrid(scaleMarks, this.conf);
		}


	//вызываем метод GetControlData в модели
	handleGetControlData = (controlData: IControlElements) => {
		this.controlData = controlData;
		//	this.model.getControlData(controlData);
	}

	// вызываем метод computeControlPosFromEvent в модели
	handlecomputeControlPosFromEvent = (e: PointerEvent) => {
		//	this.model.computeControlPosFromEvent(e);
		this.model.$calcPos(
			e.type,
			e.clientY,
			e.clientX,
			this.controlData.top,
			this.controlData.left,
			this.controlData.width,
			this.controlData.height,
			this.controlData.shift,
			this.controlData.moovingControl);
	}


	// вызываем метод computeNewPosKeyEvnt в модели
	handleNewPosKeyboardEvnt = (e: KeyboardEvent) => {
		//	this.model.computePosFromKeyboardEvent(e);


		this.model.$calcPosKey(
			e.key,
			e.repeat,
			this.controlData.moovingControl);
	}


	//вызываем метод updateСurrentControl в view
	handleOnControlPosUpdated = (elem: HTMLElement, newPos: number) => {
		this.viewControl.updateControlPos(elem, newPos);
	}

	handleIsVerticalChecked = () => {
		this.conf.vertical = true;
		//this.viewControl.updateVerticalMode(true);
		this.handleWindowReRendering();
	}

	handleIsVerticalNotChecked = () => {
		this.conf.vertical = false;
		//this.viewControl.updateVerticalMode(false);
		this.handleWindowReRendering();
	}


	handleIsRangeChecked = () => {
		this.conf.range = true;
		this.viewControl.updateRangeMode(true);
		//	this.model.computeProgressBar('handleMovement');

	}

	handleIsRangeNotChecked = () => {
		this.conf.range = false;
		this.viewControl.updateRangeMode(false);
		//this.model.computeProgressBar('handleMovement');
	}

	handleAdjustControlPos = () => {
		this.model.adjustControlPos();
	}

	handleIsScaleChecked = () => {
		this.conf.scale = true;
		this.viewScale.updateScaleMode(true);
	}

	handleIsScaleNotChecked = () => {
		this.conf.scale = false;
		this.viewScale.updateScaleMode(false);
	}

	handleIsBarChecked = () => {
		this.conf.bar = true;
		this.viewBar.updateBarMode(true);
	}

	handleIsBarNotChecked = () => {
		this.conf.bar = false;
		this.viewBar.updateBarMode(false);
	}



	handleIsTipChecked = () => {
		this.conf.tip = true;
		this.viewControl.updateTipMode(true);
	}

	handleIsTipNotChecked = () => {
		this.conf.tip = false;
		this.viewControl.updateTipMode(false);
	}

	handleIsStickyChecked = () => {
		this.conf.sticky = true;
		//	this.viewControl.updateStickyMode(true);
	}

	handleIsStickyNotChecked = () => {
		this.conf.sticky = false;
		//this.viewControl.updateStickyMode(false);
	}



	handleFromToChanged = (val: string, e: Event) => {
		const target = e.target as HTMLElement;

		if (target.classList.contains('rs__input-from')) {
			this.conf.from = parseInt(val);
			// this.model.computeControlPosFromVal(parseInt(val),
			// 	false, this.viewControl.controlMin);
			this.viewControl.updateTipVal(val, true);
		} else {
			this.conf.to = parseInt(val);
			// this.model.computeControlPosFromVal(parseInt(val),
			// 	false, this.viewControl.controlMax);
			this.viewControl.updateTipVal(val, false);
		}
	}

	//вызываем метод updateInterval в view
	handleOnStepValueUpdated = (newValue: string) => {
		this.viewPanel.updateInterval(newValue);
	}


	//вызываем метод updateStep в view
	handleOnIntervalValueUpdated = (newValue: string) => {
		this.viewPanel.updateStep(newValue);
	}

	handleMinMaxChanged = (val: string, e: Event) => {
		const target = e.target as HTMLElement;

		if (target.classList.contains('rs__input-min')) {

			this.conf.min = parseInt(val);
			// this.model.computeControlPosFromVal(parseInt(val), false,
			// 	this.viewControl.controlMin);
			this.viewControl.updateTipVal(val, true);
		} else if (target.classList.contains('rs__input-max')) {

			this.conf.max = parseInt(val);
			// this.model.computeControlPosFromVal(parseInt(val), false,
			// 	this.viewControl.controlMax);
			this.viewControl.updateTipVal(val, false);
		}

		this.handleWindowReRendering();
	}

	handleStepChanged = (val: string) => {
		this.conf.step = parseInt(val);
		delete this.conf.intervals;
		//	this.model.computeGrid(this.conf, 'steps');
		this.handleOnScaleMarksUpdated(this.model.marksArr);
	}


	handleIntervalChanged = (val: string) => {
		this.conf.intervals = parseInt(val);
		delete this.conf.step;
		//	this.model.computeGrid(this.conf, 'intervals');
		this.handleOnScaleMarksUpdated(this.model.marksArr);
	}

	handleShiftOnKeyDownChange = (val: string) => {
		this.conf.shiftOnKeyDown = parseInt(val);
	}

	handleShiftOnKeyHoldChange = (val: string) => {
		this.conf.shiftOnKeyHold = parseInt(val);
	}


	handleWindowReRendering = () => {
		this.view.deleteSlider();
	};
}

export { sliderController };

