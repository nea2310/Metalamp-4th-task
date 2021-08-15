
import { ModuleBody } from 'typescript';
import { sliderView } from './../../view/view';

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
	IControlElements,
	IScaleLabels
} from './../../interface';



class sliderViewGrid extends sliderView {

	scale: HTMLElement;
	elem: HTMLElement;
	scaleWidth: number;
	scaleHeight: number;
	progressBar: HTMLElement;
	leftControl: HTMLElement;
	rightControl: HTMLElement;
	leftControlDist: number;
	rightControlDist: number;
	markList: HTMLElement[];
	conf: IConf;
	grid: HTMLElement;
	checkNext: boolean;
	lastLabelRemoved: boolean;


	constructor(root: string) {
		super(root);
	}

	// Инициализация
	init(conf: IConf) {
		this.conf = conf;
		this.scale = this.slider.firstElementChild as HTMLElement;
	}


	//создаем деления
	createGrid(scaleMarks: { 'pos'?: number, 'val'?: number }[],
		conf: IConf) {
		if (this.markList) {
			for (let elem of this.markList) {
				elem.remove();
			}
		}
		for (let node of scaleMarks) {
			let elem = document.createElement('div');
			elem.classList.add('rs__mark');
			let label = document.createElement('div');
			label.innerText = String(node.val);
			label.classList.add('rs__label');
			elem.appendChild(label);


			if (conf.vertical == true) {
				elem.classList.add('vertical');
				label.classList.add('vertical');
				elem.style.bottom = String(node.pos) + '%';
			} else {
				elem.classList.add('horizontal');
				label.classList.add('horizontal');
				elem.style.left = String(node.pos) + '%';
			}
			if (!conf.scale) {
				elem.classList.add('hidden');
			}
			this.scale.appendChild(elem);

			if (conf.vertical == true) {
				label.style.top = label.offsetHeight / 2 * (-1) + 'px';
			} else {
				label.style.left = label.offsetWidth / 2 * (-1) + 'px';
			}
		}

		this.markList =
			[...this.scale.querySelectorAll<HTMLElement>('.rs__mark')];
		this.checkGridWidth(this.markList);
	}


	//проверяем, не налезают ли подписи друг на друга и если да - то удаляем каждую вторую
	checkGridWidth(markList: HTMLElement[]) {
		if (!this.conf.vertical) {
			let totalWidth = 0;
			//вычисляем общую ширину подписей к шагам
			for (let node of markList) {
				totalWidth += node.firstElementChild.
					getBoundingClientRect().width;
			}
			//если общая ширина подписей к шагам больше ширины шкалы
			if (totalWidth > this.scale.offsetWidth) {
				//скрываем подпись каждого второго эл-та шага, а самому эл-ту добавляем класс "no-label"
				for (let i = 1; i < markList.length; i += 2) {
					markList[i].firstElementChild.
						classList.add('hidden');
					markList[i].
						classList.add('no-label');
				}
				this.markList = //создаем новый markList из элементов, не имеющих класса "no-label" (т.е. с видимыми подписями)
					[...this.scale.
						querySelectorAll<HTMLElement>
						('.rs__mark:not(.no-label)')];
				// запускаем функцию проверки заново
				this.lastLabelRemoved = true;
				this.checkGridWidth(this.markList);

			} else {
				//возвращаем подпись последнему шагу
				this.addLastLabel(this.lastLabelRemoved);
				return;
			}
		}

	}

	//возвращаем подпись у последненего шага и удаляем у предпоследнего подписанного
	addLastLabel(isRemoved: boolean) {
		if (isRemoved) {
			let markLabeledList = this.scale.
				querySelectorAll('.rs__mark:not(.no-label)');
			let lastMarkLabeled = markLabeledList[markLabeledList.length - 1];
			let lastMark = this.scale.querySelector('.rs__mark:last-child');

			lastMarkLabeled.classList.add('no-label');
			lastMarkLabeled.firstElementChild.classList.add('hidden');

			lastMark.classList.remove('no-label');
			lastMark.firstElementChild.classList.remove('hidden');
		}
	}
}


export { sliderViewGrid };

