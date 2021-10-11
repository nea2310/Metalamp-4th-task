
import './slider.scss';
import { sliderModel, sliderView, sliderController }
	from './mvc/controller/controller';




// eslint-disable-next-line no-undef
$.fn.Slider = function (options): JQuery {
	return this.each(function (i: number, el: Element) {
		if (!$.data(el, 'Slider')) {
			$.data(
				el,
				'Slider',
				new sliderController(
					new sliderModel(options), new sliderView(el, i))
			);
		}

	});

};

