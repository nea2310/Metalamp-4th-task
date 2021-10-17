import { sliderViewControl } from
	'./../view/view-control/view-control';
import { sliderViewScale } from './../view/view-scale/view-scale';
import { sliderViewBar } from './../view/view-bar/view-bar';
import {
	$Idata, IConf
} from '../../interface';

import { Observer } from '../../observer';

class sliderView extends Observer {
	viewControl: sliderViewControl;
	viewScale: sliderViewScale;
	viewBar: sliderViewBar;

	slider: HTMLElement;
	track: HTMLElement;
	conf: IConf;
	//root: string;

	constructor(root: Element, i: number) {
		super();
		/*Находим корневой элемент*/
		this.slider = root as HTMLElement;
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
		this.viewControl = new sliderViewControl(this.slider, this.conf);
		this.viewScale = new sliderViewScale(this.slider, this.conf);
		this.viewBar = new sliderViewBar(this.slider, this.conf);

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
		//this.viewPanel.updateFromTo('from', data.$fromVal);
		this.viewControl.updateTipVal(data.$fromVal, true);
	}


	$handleToValue = (key: string, data: $Idata) => {
		//this.viewPanel.updateFromTo('to', data.$toVal);
		this.viewControl.updateTipVal(data.$toVal, false);
	}

	$handleScale = (key: string, data: $Idata, conf: IConf) => {
		this.viewScale.createScale(data.$marksArr, conf);
	}

	$handleBar = (key: string, data: $Idata, conf: IConf) => {
		this.viewBar.
			$updateBar(data.$barPos, data.$barWidth, conf.vertical);
	}

	// $handleScale = (key: string, data: $Idata) => {
	// 	if (data.$scaleType === 'steps') {
	// 		//this.viewPanel.updateInterval(data.$intervalValue);
	// 	}
	// 	if (data.$scaleType === 'intervals') {
	// 		//this.viewPanel.updateInterval(data.$stepValue);
	// 	}
	// }


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

}



export { sliderView };

