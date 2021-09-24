type CBNoArgs = () => void;
type CBControlElements = (arg1: IControlElements) => void;
type CBMouseEvent = (arg1: MouseEvent) => void;
type CBPointerEvent = (arg1: PointerEvent) => void;
type CBEvent = (arg1: Event) => void;
type CBStringEvent = (arg1: string, arg2: Event) => void;
type CBStringPointerEvent = (arg1: string, arg2: PointerEvent) => void;
type CBInputEvent = (arg1: InputEvent) => void;
type CBStringInputEvent = (arg1: string, arg2: InputEvent) => void;
type CBKeyboardEvent = (arg1: KeyboardEvent) => void;



type ControlPosUpdated = (arg1: HTMLElement, arg2: number) => void;
type ProgressBarUpdated = (arg1: string, arg2: string, arg3: boolean) => void;
type ControlValueUpdated = (arg1: HTMLElement, arg2: string) => void;
type StepValueUpdated = (arg1: string) => void;

interface IConf {
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



}


interface IControlElements {
	currentControlElem?: HTMLElement;
	// secondControl?: HTMLElement;
	// currentControlFlag?: boolean;
	shift?: number;
	moovingControl?: string;
	key?: string;
	repeat?: boolean;
	type?: string,
	clientY?: number,
	clientX?: number,
	top?: number,
	left?: number,
	width?: number,
	height?: number
}


interface IObj {
	val?: number;
	pos?: number;
}

interface IScaleLabels {
	elem?: HTMLElement;
	elemLeft?: number;
	elemRight?: number;
}
interface $Imethods {
	$calcFromPosition: boolean,
	$calcToPosition: boolean,
	$calcGrid: boolean
	$calcBar: boolean
	$calcScale: boolean
}

interface $Idata {
	$fromPos?: number
	$toPos?: number
	$marksArr?: { 'pos'?: number, 'val'?: number }[];
	$intervalValue?: string
	$stepValue?: string
	$gridType?: string
	$barWidth?: number
	$barPos?: number
	//	$newPos?: number
	$fromVal?: string
	$toVal?: string
}

export {
	CBNoArgs,
	CBControlElements,
	CBMouseEvent,
	CBPointerEvent,
	CBEvent,
	CBStringEvent,
	CBStringPointerEvent,
	CBInputEvent,
	CBStringInputEvent,
	CBKeyboardEvent,
	ControlPosUpdated,
	ProgressBarUpdated,
	ControlValueUpdated,
	StepValueUpdated,
	IConf,
	IControlElements,
	IObj,
	IScaleLabels,
	$Imethods,
	$Idata
};