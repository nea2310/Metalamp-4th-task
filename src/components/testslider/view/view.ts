
import { sliderViewPanel } from './../view/view-panel/view-panel';
import { sliderViewControl } from
	'./../view/view-control/view-control';
import { sliderViewGrid } from './../view/view-grid/view-grid';
import { sliderViewBar } from './../view/view-bar/view-bar';
import {
	$Idata, IConf
} from './../interface';

import { Observer } from '../observer/observer';

class sliderView extends Observer {
	viewControl: sliderViewControl;
	viewPanel: sliderViewPanel;
	viewGrid: sliderViewGrid;
	viewBar: sliderViewBar;

	slider: HTMLElement;
	track: HTMLElement;
	conf: IConf;
	root: string;

	constructor(root: string) {
		super();
		this.root = root;
		/*Находим корневой элемент*/
		this.slider = document.querySelector(root);
		this.track = document.createElement('div');
		this.track.className = 'rs__track';
		this.slider.append(this.track);

	}
	$init(conf: IConf) {
		this.conf = conf;
		this.createSubViews();
		this.$createListeners();//срабатывает после инициализации модели
	}


	createSubViews() {
		this.viewControl = new sliderViewControl(this.root, this.conf);
		this.viewPanel = new sliderViewPanel(this.root, this.conf);
		this.viewGrid = new sliderViewGrid(this.root, this.conf);
		this.viewBar = new sliderViewBar(this.root, this.conf);

	}

	$createListeners() {
		this.viewControl.subscribe(this.$handleMoveEvent);
		this.viewControl.subscribe(this.$handleKeydownEvent);
	}


	$handleFromPosition = (key: string, data: $Idata) => {
		this.viewControl.updateControlPos(this.viewControl.controlMin,
			data.$fromPos);

	}

	$handleToPosition = (key: string, data: $Idata) => {
		this.viewControl.updateControlPos(this.viewControl.controlMax,
			data.$toPos);
	}


	$handleFromValue = (key: string, data: $Idata) => {
		this.viewPanel.updateFromTo('from', data.$fromVal);
		this.viewControl.updateTipVal(data.$fromVal, true);
	}


	$handleToValue = (key: string, data: $Idata) => {
		this.viewPanel.updateFromTo('to', data.$toVal);
		this.viewControl.updateTipVal(data.$toVal, false);
	}

	$handleScale = (key: string, data: $Idata, conf: IConf) => {
		this.viewGrid.createGrid(data.$marksArr, conf);
	}

	$handleBar = (key: string, data: $Idata, conf: IConf) => {
		this.viewBar.
			$updateBar(data.$barPos, data.$barWidth, conf.vertical);
	}

	$handleGrid = (key: string, data: $Idata) => {
		if (data.$gridType === 'steps') {
			this.viewPanel.updateInterval(data.$intervalValue);
		}
		if (data.$gridType === 'intervals') {
			this.viewPanel.updateInterval(data.$stepValue);
		}
	}


	$handleMoveEvent = (key: string, data: $Idata) => {
		if (key !== 'MoveEvent') return;
		else {
			this.fire('MoveEvent', data);
		}
	}

	$handleKeydownEvent = (key: string, data: $Idata) => {
		if (key !== 'KeydownEvent') return;
		else {
			this.fire('KeydownEvent', data);
		}
	}


	// Удаление слайдера
	deleteSlider() {
		this.slider.firstChild.remove();
		this.slider.nextElementSibling.remove();
	}
}



export { sliderView };

