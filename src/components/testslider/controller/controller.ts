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
	IControlElements
} from './../interface';




class sliderController {
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

	constructor(conf: IConf, root: string,
		view: sliderView, viewScale: sliderViewScale,
		viewControl: sliderViewControl,
		viewPanel: sliderViewPanel, viewGrid: sliderViewGrid,
		viewBar: sliderViewBar,
		model: sliderModel) {
		this.model = model;
		this.view = view;
		this.viewScale = viewScale;
		this.viewControl = viewControl;
		this.viewPanel = viewPanel;
		this.viewGrid = viewGrid;
		this.viewBar = viewBar;

		this.conf = conf;
		this.root = root;
		this.prepareConfiguration();
		this.render();
		this.init();


	}

	prepareConfiguration() {
		this.defaultConf = {
			min: 1,
			max: 10,
			from: 3,
			to: 7,
			vertical: false,
			range: true,
			scale: true,
			bar: true,
			tip: true
		};

		this.customConf = this.conf;
		this.customConf.target = this.root;//это нужно для модели
		this.conf = Object.assign(this.defaultConf, this.customConf);




	}


	render = () => {

		this.viewScale.init(this.conf);
		this.viewBar.init(this.conf);
		this.viewControl.init(this.conf);
		this.viewPanel.init(this.conf);
		this.viewGrid.init(this.conf);

		this.model.init(this.conf);
	}



	init() {

		this.handleOnControlPosUpdated(this.viewControl.controlMin,
			this.model.controlMinStartPos);//передаем во view начальное положение левого ползунка
		this.handleOnControlPosUpdated(this.viewControl.controlMax,
			this.model.controlMaxStartPos); //передаем во view начальное положение правого ползунка


		this.handleOnprogressBarUpdated(String(this.model.selectedPos),
			String(this.model.selectedWidth), this.conf.vertical); // передаем во view начальное положение прогресс-бара
		this.handleOnScaleMarksUpdated(this.model.marksArr); // передаем во view начальное положение делений шкалы

		this.handleIntervalCalc(this.model.stepValue);// передаем во view значение шага, если указан интервал
		// this.handleStepCalc(this.model.intervalValue);// передаем во view значение интервала, если указан шаг


		this.viewControl.bindMoveControl(this.handleGetControlData,
			this.handlecomputeControlPosFromEvent,
			this.handleRemoveEventListeners
		);// вешаем обработчики handleGetControlData и handlecomputeControlPosFromEvent для обработки в view события захвата и перетаскивания ползунка
		this.viewScale.bindClickOnScale(this.handleGetControlData,
			this.handlecomputeControlPosFromEvent);// вешаем обработчики handleGetControlData и handlecomputeControlPosFromEvent для обработки в view события клика по шкале



		this.viewPanel.bindCheckIsVerticalControl(this.handleIsVerticalChecked,
			this.handleIsVerticalNotChecked);
		this.viewPanel.bindCheckIsRangeControl(this.handleIsRangeChecked,
			this.handleIsRangeNotChecked, this.handleAdjustControlPos);
		this.viewPanel.bindCheckIsScaleControl(this.handleIsScaleChecked,
			this.handleIsScaleNotChecked);
		this.viewPanel.bindCheckIsBarControl(this.handleIsBarChecked,
			this.handleIsBarNotChecked);
		this.viewPanel.bindCheckIsTipControl(this.handleIsTipChecked,
			this.handleIsTipNotChecked);



		this.viewPanel.bindMinMaxChange(this.handleMinMaxChanged);
		this.viewPanel.bindStepChange(this.handleStepChanged);
		this.viewPanel.bindIntervalChange(this.handleIntervalChanged);
		this.viewPanel.bindFromToChange(this.handleFromToChanged);




		//this.view.bindMouseUp(this.handleMouseUp);//вешаем обработчик handleMouseUp для обработки в view события отпускания кнопки (завершение перетаскивания ползунка)
		//this.view.bindWindowResize(this.handleWindowReRendering);

		this.model.bindControlPosUpdated(this.handleOnControlPosUpdated);//Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindprogressBarUpdated(this.handleOnprogressBarUpdated);//Вызываем для обновления положения ползунка (обращение к view)
		this.model.bindСontrolValueUpdated(this.handleOnСontrolValueUpdated);//Вызываем для обновления панели (обращение к view)

		this.model.bindStepValueUpdated(this.handleOnStepValueUpdated);//Вызываем для обновления инпута INTERVAL в панели (обращение к view)
		this.model.bindIntervalValueUpdated(this.handleOnIntervalValueUpdated);//Вызываем для обновления инпута INTERVAL в панели (обращение к view)


	}

	//вызываем метод GetControlData в модели
	handleGetControlData = (controlData: IControlElements) => {
		this.model.getControlData(controlData);
	}


	// вызываем метод computeControlPosFromEvent в модели
	handlecomputeControlPosFromEvent = (e: MouseEvent) => {
		this.model.computeControlPosFromEvent(e);
	}
	//отвязка слушателей
	handleRemoveEventListeners = () => {
		document.removeEventListener('mousemove',
			this.handlecomputeControlPosFromEvent);
		document.removeEventListener('mouseup',
			this.handleRemoveEventListeners);
	}


	//вызываем метод updateСurrentControl в view
	handleOnprogressBarUpdated = (selectedPos: string,
		selectedWidth: string, isVertical: boolean) => {
		this.viewBar.
			updateProgressBar(selectedPos, selectedWidth, isVertical);
	}


	handleOnScaleMarksUpdated =
		(scaleMarks: { 'pos'?: number, 'val'?: number }[]) => {
			this.viewGrid.createGrid(scaleMarks, this.conf);
		}

	//вызываем метод updateСurrentControl в view
	handleOnControlPosUpdated = (elem: HTMLElement, newPos: number) => {
		this.viewControl.updateControlPos(elem, newPos);
	}


	handleIntervalCalc =
		(step: string) => {
			this.viewPanel.updateStep(step);
		}


	handleStepCalc =
		(interval: string) => {
			this.viewPanel.updateInterval(interval);
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
		this.model.computeProgressBar('handleMovement');

	}

	handleIsRangeNotChecked = () => {
		this.conf.range = false;
		this.viewControl.updateRangeMode(false);
		this.model.computeProgressBar('handleMovement');
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

	handleFromToChanged = (val: string, e: Event) => {
		const target = e.target as HTMLElement;

		if (target.classList.contains('rs__input-from')) {
			this.conf.from = parseInt(val);
			this.model.computeControlPosFromVal(parseInt(val),
				false, this.viewControl.controlMin);
			this.viewControl.updateTipVal(val, true);
		} else {
			this.conf.to = parseInt(val);
			this.model.computeControlPosFromVal(parseInt(val),
				false, this.viewControl.controlMax);
			this.viewControl.updateTipVal(val, false);
		}
	}


	//вызываем метод updateСurrentControl в view
	handleOnСontrolValueUpdated = (elem: HTMLElement, newValue: string) => {
		elem.classList.contains('rs__control-min') ?
			this.conf.from = parseInt(newValue) :
			this.conf.to = parseInt(newValue);
		this.viewPanel.updateFromTo(elem, newValue);
		elem.classList.contains('rs__control-min') ?
			this.viewControl.updateTipVal(newValue, true) :
			this.viewControl.updateTipVal(newValue, false);
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
			this.model.computeControlPosFromVal(parseInt(val), false,
				this.viewControl.controlMin);
			this.viewControl.updateTipVal(val, true);
		} else if (target.classList.contains('rs__input-max')) {

			this.conf.max = parseInt(val);
			this.model.computeControlPosFromVal(parseInt(val), false,
				this.viewControl.controlMax);
			this.viewControl.updateTipVal(val, false);
		}

		this.handleWindowReRendering();
	}

	handleStepChanged = (val: string) => {
		this.conf.step = parseInt(val);
		delete this.conf.intervals;
		this.model.computeGrid(this.conf, 'steps');
		this.handleOnScaleMarksUpdated(this.model.marksArr);
	}


	handleIntervalChanged = (val: string) => {
		this.conf.intervals = parseInt(val);
		delete this.conf.step;
		this.model.computeGrid(this.conf, 'intervals');
		this.handleOnScaleMarksUpdated(this.model.marksArr);
	}



	// снимаем обработчики, повешенные на событие перемещения мыши
	handleMouseUp = () => {
		document.removeEventListener('mousemove',
			this.handlecomputeControlPosFromEvent);
		//	document.removeEventListener('mouseup', this.handleMouseUp);
		// document.removeEventListener('touchmove',
		// 	this.handlecomputeControlPosFromEvent);
		//	document.removeEventListener('touchend', this.handleMouseUp);
	}


	handleWindowReRendering = () => {
		this.view.deleteSlider();
		this.prepareConfiguration();
		this.render();
		this.init();
	};
}

export { sliderController };

