




interface IObj {
	val?: number;
	pos?: number;
}


interface Imethods {
	calcFromPosition: boolean,
	calcToPosition: boolean,
	calcScale: boolean
	calcBar: boolean
	switchVertical: boolean
	switchRange: boolean
	switchScale: boolean
	switchBar: boolean
	switchTip: boolean
	updateControlPos: boolean
}

interface Idata {
	fromPos?: number
	toPos?: number
	marksArr?: { 'pos'?: number, 'val'?: number }[];
	intervalValue?: string
	stepValue?: string
	scaleBase?: string
	barWidth?: number
	barPos?: number
	fromVal?: string
	toVal?: string
	thumb?: Ithumb
}

interface Ithumb {
	type?: string,
	clientY?: number,
	clientX?: number,
	top?: number,
	left?: number,
	width?: number,
	height?: number,
	shiftBase?: number,
	moovingControl?: string,
	key?: string,
	repeat?: boolean
}





interface IConf {
	min?: number
	max?: number
	from?: number
	to?: number
	vertical?: boolean
	range?: boolean
	bar?: boolean
	tip?: boolean
	scale?: boolean
	scaleBase?: string
	step?: number
	interval?: number
	sticky?: boolean
	shiftOnKeyDown?: number
	shiftOnKeyHold?: number
	onStart?: Function
	onChange?: Function
	onUpdate?: Function
}


interface SliderOptions {
	min?: number
	max?: number
	from?: number
	to?: number
	range?: boolean
	bar?: boolean
	tip?: boolean
	scale?: boolean
	step?: number
	interval?: number
	sticky?: boolean
	shiftOnKeyDown?: number
	shiftOnKeyHold?: number
	//target?: string
	vertical?: boolean
	onStart?: Function
	onUpdate?: Function
	onChange?: Function
	scaleBase?: string
}


interface SliderFunction {
	// eslint-disable-next-line no-unused-vars
	(options: SliderOptions): JQuery;
}


interface Slider extends
	SliderFunction { }

interface JQuery {
	Slider: Slider;
}

export {
	IConf,
	IObj,
	Imethods,
	Idata,
};