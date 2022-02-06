import { _$ as $ } from './sliderMetaLamp';
import {
  IConf,
} from './../../plugins/sliderMetaLamp/mvc/interface';
import { Controller }
  from './mvc/controller/controller';

describe('sliderMetaLamp', () => {
  const parent = document.createElement('input');
  document.body.appendChild(parent);
  const slider = $(parent).Slider({}).data('SliderMetaLamp');

  const updateSpy = jest.spyOn(slider, 'update');
  const getDataSpy = jest.spyOn(slider, 'getData');
  const disableSpy = jest.spyOn(slider, 'disable');
  const enableSpy = jest.spyOn(slider, 'enable');
  const destroySpy = jest.spyOn(slider, 'destroy');

  const conf: IConf = {
    min: 10,
    max: 100,
    from: 20,
    to: 70,
    vertical: false,
    range: true,
    bar: true,
    tip: true,
    scale: true,
    scaleBase: 'step',
    step: 10,
    interval: 0,
    sticky: false,
    shiftOnKeyDown: 1,
    shiftOnKeyHold: 1,
  };

  test(' Initialize plugin on a DOM-element ', () => {
    expect(slider).toBeInstanceOf(Controller);
  });

  test(' Should call API update', () => {
    slider.update(conf);
    expect(updateSpy).toBeCalledTimes(1);
  });

  test(' Should call API getData', () => {
    slider.getData();
    expect(getDataSpy).toBeCalledTimes(1);
  });

  test(' Should call API disable', () => {
    slider.disable();
    expect(disableSpy).toBeCalledTimes(1);
  });

  test(' Should call API enable', () => {
    slider.enable();
    expect(enableSpy).toBeCalledTimes(1);
  });

  test(' Should call API destroy', () => {
    slider.destroy();
    expect(destroySpy).toBeCalledTimes(1);
  });
});


