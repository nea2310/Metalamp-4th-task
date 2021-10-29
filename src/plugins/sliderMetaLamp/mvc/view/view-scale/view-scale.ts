import {
	IConf,
} from '../../interface';



class sliderViewScale {
	slider: HTMLElement;
	startWidth: number;
	track: HTMLElement;
	markList: HTMLElement[];
	conf: IConf;
	lastLabelRemoved: boolean;
	scaleMarks: { 'pos'?: number, 'val'?: number }[];

	constructor(root: HTMLElement, conf: IConf) {
		this.slider = root;
		this.init(conf);
	}

	// Инициализация
	init(conf: IConf) {
		this.conf = conf;
		this.track = this.slider.firstElementChild as HTMLElement;
		this.getResizeWrap();
	}

	//создаем деления
	createScale(scaleMarks: { 'pos'?: number, 'val'?: number }[],
		conf: IConf) {
		this.conf = conf;
		this.scaleMarks = scaleMarks;
		let steps = this.slider.querySelectorAll('.rs__mark');
		//Если это переотрисовка шкалы - удалить существующие деления
		if (steps.length) {
			for (let elem of steps) {
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


			if (conf.vertical) {
				elem.classList.add('vert');
				label.classList.add('vert');
				elem.style.bottom = String(node.pos) + '%';
			} else {
				elem.classList.add('horizontal');
				label.classList.add('horizontal');
				elem.style.left = String(node.pos) + '%';
			}
			if (!conf.scale) {
				elem.classList.add('hidden');
			}
			this.track.appendChild(elem);

			if (conf.vertical) {
				label.style.top = label.offsetHeight / 2 * (-1) + 'px';
			} else {
				label.style.left = label.offsetWidth / 2 * (-1) + 'px';
			}
		}

		this.markList =
			[...this.track.querySelectorAll<HTMLElement>('.rs__mark')];
		this.checkScaleLength(this.markList);
	}


	//проверяем, не налезают ли подписи друг на друга и если да - то удаляем каждую вторую
	checkScaleLength(markList: HTMLElement[]) {
		let hideLabels = (markList: HTMLElement[]) => {
			console.log('hideLabels');
			//скрываем подпись каждого второго эл-та шага, а самому эл-ту добавляем класс "no-label"
			for (let i = 1; i < markList.length; i += 2) {
				markList[i].firstElementChild.
					classList.add('hidden');
				markList[i].
					classList.add('no-label');
			}
			this.markList = //создаем новый markList из элементов, не имеющих класса "no-label" (т.е. с видимыми подписями)
				[...this.track.
					querySelectorAll<HTMLElement>
					('.rs__mark:not(.no-label)')];
			// запускаем функцию проверки заново
			this.lastLabelRemoved = true;
			this.checkScaleLength(this.markList);
		};

		if (!this.conf.vertical) { //Горизонтальный слайдер
			let totalWidth = 0;
			//вычисляем общую ширину подписей к шагам
			for (let node of markList) {
				totalWidth += node.firstElementChild.
					getBoundingClientRect().width;
			}
			//если общая ширина подписей к шагам больше ширины шкалы
			if (totalWidth > this.track.offsetWidth) {
				//Скрываем подписи
				hideLabels(markList);
			} else {
				if (this.lastLabelRemoved) {
					//возвращаем подпись последнему шагу и выходим из рекурсии
					this.addLastLabel(this.lastLabelRemoved);
					return;
				}
			}
		} else {//Вертикальный слайдер
			let totalHeight = 0;
			//вычисляем общую высоту подписей к шагам
			for (let node of markList) {
				totalHeight += node.firstElementChild.
					getBoundingClientRect().height;
			}
			//если общая высота подписей к шагам больше высоты шкалы
			if (totalHeight > this.track.offsetHeight) {
				console.log('recursion');
				//Скрываем подписи
				hideLabels(markList);
			} else {
				if (this.lastLabelRemoved) {
					//возвращаем подпись последнему шагу и выходим из рекурсии
					this.addLastLabel(this.lastLabelRemoved);
					return;
				}
			}
		}
	}

	//возвращаем подпись у последненего шага и удаляем у предпоследнего подписанного
	addLastLabel(isRemoved: boolean) {
		let markLabeledList = this.track.
			querySelectorAll('.rs__mark:not(.no-label)');
		let lastMarkLabeled = markLabeledList[markLabeledList.length - 1];
		let lastMark = this.track.querySelector('.rs__mark:last-child');
		if (isRemoved) {
			lastMarkLabeled.classList.add('no-label');
			lastMarkLabeled.firstElementChild.classList.add('hidden');
			lastMark.classList.remove('no-label');
			lastMark.firstElementChild.classList.remove('hidden');
		}
		let lastLabel = lastMark.firstElementChild;
		let beforeLastLabel =
			markLabeledList[markLabeledList.length - 2].firstElementChild;
		let right = beforeLastLabel.getBoundingClientRect().right;
		let left = lastLabel.getBoundingClientRect().left;

		if (right > left) {
			markLabeledList[markLabeledList.length - 2].
				classList.add('no-label');
			beforeLastLabel.classList.add('hidden');
		}
	}


	switchScale(conf: IConf) {
		this.conf = conf;
		let stepMarks = this.slider.querySelectorAll('.rs__mark');
		if (this.conf.scale) {
			for (let elem of stepMarks) {
				elem.classList.remove('hidden');
			}
		} else {
			for (let elem of stepMarks) {
				elem.classList.add('hidden');
			}
		}
	}

	getResizeWrap() { // ??????
		let sleep = 200; // --------- задержка в миллесекундах
		let rtime = 0;  // ---------- для хранения отрезка времени
		let timeout = false; // ----- флаг для запрета лишний раз вызывать функцию resizeend

		this.startWidth = this.slider.offsetWidth; // ----------------- запоминаем ширину враппера до ресайза

		(function () { // ------------------------------------------------- функция которая сразу исполняеться (она повесит искуственное событие optimizedResize)
			let throttle = function (type: string, name: string, obj = window) {
				let running = false;  // ------------------------------------ флаг начала события
				let func = function () { //---------------------------------- функция создающая оптимизированное отслеживание ресайза 60 запросов в сек. 
					if (running) { return; } // ------------------------------ выйти если мы ещё не сделали dispatchEvent
					running = true;
					requestAnimationFrame(function () {  // ------------------ делаем отрисовку Анимации - то есть вызовим функцию при следующей отрисовке и частота опроса не больше 60 раз в сек
						obj.dispatchEvent(new CustomEvent(name)); //----------- создаём искуственное событие - которое будет вешаться раз 60 раз в сек
						running = false; // ----------------------------------- даём знать что requestAnimationFrame можно будет выполнить в след раз
					});
				};
				obj.addEventListener(type, func); // ------------------------ на виндовс вешаем событие ресайза и отслеживаем его как только ресайз будет - вызовиться функция func
			};
			throttle("resize", "optimizedResize");
		})();


		const resizeend = () => {
			if (+(new Date()) - rtime < sleep) { // -------------------------- сверяем отрезок времени с задержкой - если мы уже давно не ресайзимся то скорей всего остановились
				setTimeout(resizeend, sleep); // --------------------------- если отрезок времени короче чем sleep то ждём ещё  миллисекунд на sleep... 
			} else { // --------------------------------------------------- если времени прошло достаточно а ресайза не было то можно считать что мы остановились
				timeout = false;

				let totalWidth = this.slider.offsetWidth; // ----------------------------------- получаем ширину после ресайза
				if (totalWidth != this.startWidth) { // -------------------------------------------------- если до и после отличаеться 
					if (totalWidth < this.startWidth) {
						console.log('RESIZE');
						this.checkScaleLength(this.markList);
					}
					if (totalWidth > this.startWidth) {
						this.createScale(this.scaleMarks, this.conf);
					}
					this.startWidth = totalWidth;//-------------------------------------------------------- запоминаем новую ширину враппера до ресайза
				}
			}
		};

		window.addEventListener("optimizedResize", function () { // ------- метод будет вызван 60 раз в сек
			rtime = +(new Date()); // ----------------------------------------- каждый раз получаем текущее время
			if (timeout === false) { // ------------------------------------ пропускать только если мы дождались setTimeout
				timeout = true; // ------------------------------------------ даём понять что нам не нужно лишний раз вызывать setTimeout пока мы полностью не дождались конца ресайза
				setTimeout(resizeend, sleep); // ---------------------------- ждём (когда ресайз кончиться) и вызовим метод что бы проверить что он кончился
			}
		});
	}
}


export { sliderViewScale };

