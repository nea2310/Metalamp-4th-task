
import { sliderViewScale } from './../view/view-scale/view-scale';
import { sliderViewPanel } from './../view/view-panel/view-panel';
import { sliderViewControl } from
	'./../view/view-control/view-control';
import { sliderViewGrid } from './../view/view-grid/view-grid';
import { sliderViewBar } from './../view/view-bar/view-bar';

class sliderView {

	viewScale: sliderViewScale;
	viewControl: sliderViewControl;
	viewPanel: sliderViewPanel;
	viewGrid: sliderViewGrid;
	viewBar: sliderViewBar;

	totalWidth: number;

	slider: HTMLElement;
	startWidth: number;

	constructor(root: string) {
		/*Находим корневой элемент*/
		this.slider = document.querySelector(root);
		this.totalWidth = 0; //-------------------------------- ширина врапера слайдера
		this.viewScale = new sliderViewScale(root);
		this.viewControl = new sliderViewControl(root);
		this.viewPanel = new sliderViewPanel(root);
		this.viewGrid = new sliderViewGrid(root);
		this.viewBar = new sliderViewBar(root);
	}

	// Удаление слайдера
	deleteSlider() {
		this.slider.firstChild.remove();
		this.slider.nextElementSibling.remove();
	}
}



export { sliderView };

