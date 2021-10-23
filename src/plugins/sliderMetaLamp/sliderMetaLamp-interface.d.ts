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
	intervals?: number
	sticky?: boolean
	shiftOnKeyDown?: number
	shiftOnKeyHold?: number
	target?: string
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

