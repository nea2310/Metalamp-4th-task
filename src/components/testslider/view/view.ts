
import { ModuleBody } from 'typescript';

import {
	CBNoArgs,
	CBControlElements,
	CBMouseEvent,
	CBPointerEvent,
	CBEvent,
	CBStringEvent,
	CBStringPointerEvent,
	CBInputEvent,
	CBStringInputEvent,
	ControlPosUpdated,
	ProgressBarUpdated,
	ControlValueUpdated,
	IConf,
	IControlElements
} from './../interface';




class sliderView {
	totalWidth: number;

	slider: HTMLElement;
	startWidth: number;

	constructor(root: string) {
		/*Находим корневой элемент*/
		this.slider = document.querySelector(root);
		this.totalWidth = 0; //-------------------------------- ширина врапера слайдера
	}

	// Удаление слайдера
	deleteSlider() {
		this.slider.firstChild.remove();
		this.slider.nextElementSibling.remove();
	}
}



export { sliderView };

