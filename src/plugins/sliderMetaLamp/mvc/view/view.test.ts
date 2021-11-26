// import { sliderController } from './../../controller/controller';
// import { sliderModel } from './../../model/model';
import { sliderView } from './../view/view';
import { IConf } from './../interface';


const parent = document.createElement('input');
document.body.appendChild(parent);
const conf: IConf = {};

const testView = new sliderView(parent, 0);
testView.init({});
const testViewScale = testView.viewScale;
//const arr = testViewScale.slider.querySelectorAll('.rs__mark');





describe('ViewScale', () => {

	//console.log(arr.length);

	test('createScale', async () => {
		const conf = { vertical: true, scale: true };
		const switchScaleSpy = jest.spyOn(testViewScale, 'switchScale');
		testView.switchScale(conf);
		expect(switchScaleSpy).toBeCalledTimes(1);
		expect(switchScaleSpy).toBeCalledWith(conf);

	});
});
