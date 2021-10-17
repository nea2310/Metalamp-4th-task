import './slider.scss';
const obj = $('.rs__wrapper').Slider({
	min: -10,
	max: 100,
	from: 0,
	to: 70,
	step: 2,
	shiftOnKeyDown: 1,
	shiftOnKeyHold: 2,
	sticky: false,
	//intervals: 26,
	//vertical: true,
	//range: false

}).data('Slider'); // вернёт объект для одного элемента

console.log(obj);
//obj.testAPI();
//obj.update({ from: -10, min: -20 });

