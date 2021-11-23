
import './sliderMetaLamp.scss';
import { sliderModel, sliderView, sliderController }
	from './mvc/controller/controller';

// eslint-disable-next-line no-undef
$.fn.Slider = function (options): JQuery {
	return this.each(function (i: number, el: Element) {
		if (!$.data(el, 'SliderMetaLamp')) {
			$.data(
				el,
				'SliderMetaLamp',
				new sliderController(
					new sliderModel(options), new sliderView(el, i))
			);
		}
	});
};
console.log($);

let plugin = $;
export { plugin };

