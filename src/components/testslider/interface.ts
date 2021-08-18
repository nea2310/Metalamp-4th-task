type CBNoArgs = () => void;
type CBControlElements = (arg1: IControlElements) => void;
type CBMouseEvent = (arg1: MouseEvent) => void;
type CBPointerEvent = (arg1: PointerEvent) => void;
type CBEvent = (arg1: Event) => void;
type CBStringEvent = (arg1: string, arg2: Event) => void;
type CBStringPointerEvent = (arg1: string, arg2: PointerEvent) => void;
type CBInputEvent = (arg1: InputEvent) => void;
type CBStringInputEvent = (arg1: string, arg2: InputEvent) => void;



type ControlPosUpdated = (arg1: HTMLElement, arg2: number) => void;
type ProgressBarUpdated = (arg1: string, arg2: string, arg3: boolean) => void;
type ControlValueUpdated = (arg1: HTMLElement, arg2: string) => void;
type StepValueUpdated = (arg1: string) => void;

interface IConf {
	bar?: boolean
	from?: number
	max?: number
	min?: number
	range?: boolean
	scale?: boolean
	step?: number
	target?: string
	tip?: boolean
	to?: number
	vertical?: boolean
	intervals?: number
}


interface IControlElements {
	currentControlElem?: HTMLElement;
	// secondControl?: HTMLElement;
	// currentControlFlag?: boolean;
	shift?: number;
	moovingControl?: string;
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
	ControlPosUpdated,
	ProgressBarUpdated,
	ControlValueUpdated,
	StepValueUpdated,
	IConf,
	IControlElements,
	IObj,
	IScaleLabels
};