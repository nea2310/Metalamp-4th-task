
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

	slider: HTMLElement;

	constructor(root: string) {
		/*Находим корневой элемент*/
		this.slider = document.querySelector(root);
	}


	//Вешаем обработчик события отпускания мыши
	// bindMouseUp(mouseUpHandler: CBNoArgs) {
	// 	this.slider.addEventListener('mouseup', () => {
	// 		mouseUpHandler();
	// 	});
	// }

	//Вешаем обработчик события завершения ресайза
	// bindWindowResize(handler: CBNoArgs) {

	// 	window.addEventListener("resize", () => { //Подключаем событие изменения размеров окна
	// 		windowResizeStart(); //Вызываем функцию Обработки окна
	// 		return false;
	// 	});

	// 	let resizeTimeoutId: ReturnType<typeof setTimeout>; //Таймер задержки исполнения

	// 	function windowResizeStart() {
	// 		clearTimeout(resizeTimeoutId); //удаляем все предыдущие события "Дребезга контактов"
	// 		resizeTimeoutId = setTimeout(windowResizeStop, 1000);
	// 	}

	// 	function windowResizeStop() {
	// 		console.log("Есть смена размера окна ");
	// 		handler();
	// 	}
	// }

	// Удаление слайдера
	deleteSlider() {
		this.slider.firstChild.remove();
		this.slider.nextElementSibling.remove();
	}
}



export { sliderView };

