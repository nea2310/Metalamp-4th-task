
import { sliderModel } from './../model/model';
import { IConf } from './../interface';






describe('model', () => {

	test('calcPos, no Sticky', async () => {
		const conf: IConf = {
			min: 10,
			max: 100,
			from: 20,
			to: 70,
			// vertical: false,
			// range: true,
			// bar: true,
			// tip: true,
			// scale: true,
			// scaleBase: 'step',
			step: 9,
			// interval: 0,
			sticky: false,
			shiftOnKeyDown: 1,
			shiftOnKeyHold: 2,
		};
		const testModel = new sliderModel(conf);
		testModel.getConf(conf);
		testModel.start();
		//	await testModel.update({ sticky: false });
		expect(testModel.calcPos(
			undefined, 50, 50, 100, 100, 10, 10, 0.5, 'min')).
			toBe('newPos < 0');

		expect(testModel.calcPos(
			undefined, 50, 500, 100, 100, 10, 10, 0.5, 'max')).
			toBe('newPos > 100');

		expect(testModel.calcPos(
			undefined, 0, 100, 0, 50, 200, 0, 0.5, 'min')).
			toBe(25);

		expect(testModel.calcPos(
			undefined, 0, 150, 0, 50, 200, 0, 0.5, 'max')).
			toBe(50);

		expect(testModel.calcPos(
			undefined, 0, 50, 0, 50, 200, 0, 0.5, 'max')).
			toBe('newPos < fromPos');

		expect(testModel.calcPos(
			undefined, 0, 200, 0, 50, 200, 0, 0.5, 'min')).
			toBe('newPos > toPos');

	});

	test('calcpos, sticky', async () => {
		const conf: IConf = {
			min: 10,
			max: 100,
			from: 20,
			to: 70,
			step: 9,
			sticky: true,
			shiftOnKeyDown: 1,
			shiftOnKeyHold: 2,
		};
		const testModel = new sliderModel(conf);
		testModel.getConf(conf);
		testModel.start();

		expect(testModel.calcPos(
			undefined, 50, 50, 100, 100, 10, 10, 0.5, 'min')). //надо передавать имя события
			toBe(0);

		expect(testModel.calcPos(
			undefined, 50, 500, 100, 100, 10, 10, 0.5, 'max')).
			toBe(100);

		expect(testModel.calcPos(
			undefined, 0, 100, 0, 50, 200, 0, 0.5, 'min')).
			toBe(30);

		expect(testModel.calcPos(
			undefined, 0, 150, 0, 50, 200, 0, 0.5, 'max')).
			toBe(50);

		expect(testModel.calcPos(
			undefined, 0, 50, 0, 50, 200, 0, 0.5, 'max')).
			toBe('newPos < fromPos');

		expect(testModel.calcPos(
			undefined, 0, 200, 0, 50, 200, 0, 0.5, 'min')).
			toBe('newPos > toPos');
	});

	test('calcPosKey, no Sticky',

		async () => {
			const conf: IConf = {
				min: 10,
				max: 100,
				from: 10,
				to: 100,
				step: 9,
				sticky: false,
				shiftOnKeyDown: 1,
				shiftOnKeyHold: 2,
			};
			const testModel = new sliderModel(conf);
			testModel.getConf(conf);
			testModel.start();

			expect(testModel.data.fromPos).toBe(0);
			expect(testModel.data.toPos).toBe(100);
			expect(testModel.data.fromVal).toBe('10');
			expect(testModel.data.toVal).toBe('100');
			expect(testModel.calcPosKey(
				'ArrowLeft', false, 'min')).
				toBe('too small newPos'); //from < min

			expect(testModel.calcPosKey(
				'ArrowLeft', true, 'min')).
				toBe('too small newPos'); //from < min

			expect(testModel.calcPosKey(
				'ArrowRight', false, 'max')).
				toBe('too big newPos');//to > max

			expect(testModel.calcPosKey(
				'ArrowRight', true, 'max')).
				toBe('too big newPos');//to > max
			await testModel.update({ from: 70, to: 70 });
			expect(testModel.data.fromPos).toBe(66.66666666666667);
			expect(testModel.data.toPos).toBe(66.66666666666667);
			expect(testModel.data.fromVal).toBe('10'); // почему не пересчиталось?
			expect(testModel.data.toVal).toBe('100');// почему не пересчиталось?

			expect(testModel.calcPosKey(
				'ArrowLeft', false, 'max')).
				toBe('too small newPos'); //from<to

			expect(testModel.calcPosKey(
				'ArrowRight', false, 'min')).
				toBe('too big newPos'); //to>from

			expect(testModel.calcPosKey(
				'ArrowLeft', false, 'min')).
				toBe(69);

			expect(testModel.calcPosKey(
				'ArrowLeft', true, 'min')).
				toBe(67);

			expect(testModel.calcPosKey(
				'ArrowRight', false, 'max')).
				toBe(71);

			expect(testModel.calcPosKey(
				'ArrowRight', true, 'max')).
				toBe(73);

		});


	test('calcPosKey, Sticky',
		async () => {

			const conf: IConf = {
				min: 10,
				max: 100,
				from: 10,
				to: 100,
				step: 9,
				sticky: true,
				shiftOnKeyDown: 1,
				shiftOnKeyHold: 2,
			};
			const testModel = new sliderModel(conf);
			testModel.getConf(conf);
			testModel.start();

			expect(testModel.data.fromPos).toBe(0);
			expect(testModel.data.toPos).toBe(100);
			expect(testModel.data.fromVal).toBe('10');
			expect(testModel.data.toVal).toBe('100');
			expect(testModel.calcPosKey(
				'ArrowLeft', false, 'min')).
				toBe('newPos<0'); //from < min

			expect(testModel.calcPosKey(
				'ArrowLeft', true, 'min')).
				toBe('newPos<0'); //from < min

			expect(testModel.calcPosKey(
				'ArrowRight', false, 'max')).
				toBe('newPos>100');//to > max

			expect(testModel.calcPosKey(
				'ArrowRight', true, 'max')).
				toBe('newPos>100');//to > max

			await testModel.update({ from: 70, to: 70 });
			expect(testModel.data.fromPos).toBe(70);
			expect(testModel.data.toPos).toBe(70);
			expect(testModel.data.fromVal).toBe('73');
			expect(testModel.data.toVal).toBe('73');

			expect(testModel.calcPosKey(
				'ArrowLeft', false, 'max')).
				toBe('too small newPos'); //from<to

			expect(testModel.calcPosKey(
				'ArrowRight', false, 'min')).
				toBe('too big newPos'); //to>from

			expect(testModel.calcPosKey(
				'ArrowLeft', false, 'min')).
				toEqual({ newPos: 60, newVal: '64' });

			expect(testModel.calcPosKey(
				'ArrowLeft', true, 'min')).
				toEqual({ newPos: 40, newVal: '46' });

			expect(testModel.calcPosKey(
				'ArrowRight', false, 'max')).
				toEqual({ newPos: 80, newVal: '82' });

			expect(testModel.calcPosKey(
				'ArrowRight', true, 'max')).
				toEqual({ newPos: 100, newVal: '100' });
		});


});

