# Range slider Metalamp

## Demo production version
https://nea2310.github.io/Metalamp-4th-task/index.html

## Getting started
Download the project from https://github.com/nea2310/Metalamp-4th-task

## Install dependencies 

* Node version v14.21.1

* Install npm packages:
  ``` npm i ```

## Project build 

* Run on a devserver:
  ```npm start```  
go to http://localhost:8080/

* Production build (plugin plus demonstration page):
  ```npm run buildDemo```

* Production build (plugin only):
  ```npm run build```

* Run testing:
  ```npm run test```

## Dependency
[jQuery](https://jquery.com/)<br>

## Usage
Include styles from /dist/assets/css directory and, Jquery and scripts from /dist/assets/js directory in your project. 
Jquery is a mandatory dependency and should be included before the plugin:
  ```
  <link href="[path to the file]/plugin.css" rel="stylesheet" type="text/css">
  <script src="[path to the file]/jquery-[version].js"></script>
  <script src="[path to the file]/plugin.js"></script>
  ```

## Initialization
  ```
<input id="my-element">
$('#my-element').SliderMetaLamp([options])
  ```

## Access to an instance of the plugin
  ```
$('#my-element').data('SliderMetaLamp')
  ```
## Examples

Initialization with min and max values defined in data-attributes:
  ```
<input id="my-element" data-min="-10" data-max="20">
$('#my-element').Slider()
  ```

Initialization with min and max values defined in the configuration object:
  ```
<input id="my-element">
$('#my-element').Slider({min: -10, max: 20})
  ```
## Using events:
  ```
$('#my-element').Slider({
  onStart: (data) => {
    console.log(data);
  },
  onUpdate: (data) => {
    console.log(data);
  },
  onChange: (data) => {
    console.log(data);
  }
})
  ```
## Using API
  ```
// Initialize an instance
const $rangeSlider = $('#my-element').Slider().data('SliderMetaLamp');

// Get configuration of the instance
const startConf = $rangeSlider.getData();

// Update configuration of the instance
$rangeSlider.update({from: 2, to: 6});

// Disable the instance
$rangeSlider.disable();

// Enable the instance
$rangeSlider.enable();

// Destroy the instance
$rangeSlider.destroy();
  ```

## Values validation

* If value of a numeric parameter is passed as a string which can be converted to number, it will be converted to number:  
{min: '10'} -> {min: 10}. In any other case it will be defaulted: {min: '10 deg'} -> {min: 0}.

* If any numeric parameter value (e.g. min, max, etc.) isn't compatible with its dependant parameters values (e.g. max value is smaller than min value {min: 10, max: 0}) - incorrect parameter will be defaulted: {min: 10, max: 0} -> {min: 10, max: 20}.

* If value of a boolean parameter:
- is passed as 'true' (string), it will be converted to true (boolean): {bar: 'true'} -> {bar: true};
- is passed as 'false' (string), it will be converted to false (boolean): {bar: 'false'} -> {bar: false};
- any other non-boolean value will be converted to false (boolean): {bar: 10} -> {bar: false};

* If value of a string parameter doesn't match any of its possible values - it will be defaulted:
{scalebase: 10} -> {scalebase: 'step'};


## Configuration object interface
  ```
{
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
  ```


## Options

* **min** - minimal value of the slider  
Type: number  
Can be negative: yes  
Can be zero: yes  
Can be fractional: yes  
Default: 0  
Setting via configuration object: {min: -10}  
Setting via data-attribute: data-min="-10"  


* **max** - maximal value of the slider  
Type: number  
Can be negative: yes  
Can be zero: yes  
Can be fractional: yes  
Default: min value plus 10  
Setting via configuration object: {max: 10}  
Setting via data-attribute: data-max="10"  


* **from** - left/bottom control position (in double mode); control position (in single mode)  
Type: number  
Can be negative: yes  
Can be zero: yes  
Can be fractional: yes  
Default: equals to min value  
Setting via configuration object: {from: 10}  
Setting via data-attribute: data-from="10"  


* **to** - right/top control position (in double mode)  
Type: number  
Can be negative: yes  
Can be zero: yes  
Can be fractional: yes  
Default: equals to max value  
Setting via configuration object: {to: 10}  
Setting via data-attribute: data-to="10"  


* **round** - the number of digits after the point to round from/to value
Type: number  
Can be negative: no  
Can be zero: yes  
Can be fractional: no  
Default: equals to 0  
Setting via configuration object: {round: 2}  
Setting via data-attribute: data-round="2"  


* **scalebase** - the approach of scale breaking into gaps  
Type: string  
Possible values:  
  - "step" - scale is broken into gaps where each gap is equal to the amount of units set in the parameter "step"  
  - "interval" - scale is brogen into amount of gaps set in the parameter "interval"  
Default: "step"  


* **step** - number of units between two neighbor scale marks  
Type: number  
Can be negative: no  
Can be zero: no  
Can be fractional: yes  
Default: equals to 1/2 of the slider track  
Setting via configuration object: {step: 1}  
Setting via data-attribute: data-step="1"  
Applicable only together with scaleBase equal to "step"  


* **interval** - number of units between two neighbor scale marks  
Type: number  
Can be negative: no  
Can be zero: no  
Can be fractional: yes  
Default: equals to 1/2 of the slider track  
Setting via configuration object: {interval: 10}  
Setting via data-attribute: data-interval="10"  
Applicable only together with scaleBase equal to "interval"  


* **shiftonkeydown** - number of positions, the control shifts on a single push of a key (arrow left/right/up/down) on a keyboard  
Type: number  
Can be negative: no  
Can be zero: no  
Can be fractional: if scalebase = step: yes; if scalebase = interval: no  
Default: equals to 1/2 of the slider track  
Setting via configuration object: {shiftonkeydown: 1}  
Setting via data-attribute: data-shiftonkeydown="1"  


* **shiftonkeydown** - number of positions, the control shifts on a hold of a key (arrow left/right/up/down) on a keyboard  
Type: number  
Can be negative: no  
Can be zero: no  
Can be fractional: if scalebase = step: yes; if scalebase = interval: no  
Default: equals to 1/2 of the slider track  
Setting via configuration object: {shiftonkeyhold: 2}  
Setting via data-attribute: data-shiftonkeyhold="2"  


* **vertical** - vertical or horyzontal view of the slider  
Type: boolean  
Default: false  
Setting via configuration object: {vertical: true}  
Setting via data-attribute: data-vertical="true"  


* **range** - double (two controls) or single (one control) view of the slider  
Type: boolean  
Default: true  
Setting via configuration object: {range: false}  
Setting via data-attribute: data-range="false"  


* **sticky** - mode of control movement along the slider track: smooth mooving (non-sticky) or jumping from one scale-mark to another  
Type: boolean  
Default: false  
Setting via configuration object: {sticky: true}  
Setting via data-attribute: data-sticky="true"  


* **scale** - mode of slider scale (visible or hidden)  
Type: boolean  
Default: true  
Setting via configuration object: {scale: false}  
Setting via data-attribute: data-scale="false"  


* **bar** - mode of slider progress-bar (visible or hidden)  
Type: boolean  
Default: true  
Setting via configuration object: {bar: false}  
Setting via data-attribute: data-bar="false"  


* **tip** - mode of slider tips (visible or hidden)  
Type: boolean  
Default: true  
Setting via configuration object: {tip: false}  
Setting via data-attribute: data-tip="false"  


## Events
* **onStart(data)** - callback on the first start of the plugin  
data - configuration object matching configuration object interface  
Type: function  
Default: null  


* **onChange(data)** - callback on each user’s interaction with the plugin  
data - configuration object matching configuration object interface  
Type: function  
Default: null  


* **onUpdate(data)**- callback on "update" public API method calling  
data - configuration object matching configuration object interface  
Type: function  
Default: null  


## API

* **getData()**
Returns configuration object matching configuration object interface  

* **update(data)**
data - configuration object matching configuration object interface  
Updates plugin configuration  

* **disable()**
Blocks the plugin

* **enable()**
Unblocks previously blocked plugin

* **destroy()**
Deletes an instance of the plugin and removes its elements from DOM

## UML 
<a href="./UML/uml.png">UML class diagram</a>


