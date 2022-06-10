import ViewBar from '../../view/view-bar/view-bar';

const conf = {
  min: 10,
  max: 100,
  from: 20,
  to: 70,
  vertical: false,
  range: true,
  bar: false,
  tip: true,
  scale: true,
  scaleBase: 'step',
  step: 10,
  interval: 0,
  sticky: false,
  shiftOnKeyDown: 1,
  shiftOnKeyHold: 1,
  onStart: () => true,
  onChange: () => true,
  onUpdate: () => true,
};
const root = document.createElement('div');
document.body.appendChild(root);

const track = document.createElement('div');
track.className = 'slider-metalamp__track';
root.appendChild(track);
const testBar = new ViewBar(root, conf);
const progressBar = document
  .getElementsByClassName('slider-metalamp__progressBar')[0] as HTMLElement;

describe('ViewControl', () => {
  test('toggle class _orientation_vertical on calling switchVertical method', async () => {
    expect(progressBar.classList.contains('slider-metalamp__progressBar__orientation_vertical'))
      .toBe(false);
    await testBar.switchVertical({
      ...conf,
      vertical: true,
      bar: true,
    });
    expect(progressBar.classList.contains('slider-metalamp__progressBar__orientation_vertical'))
      .toBe(true);
    await testBar.switchVertical({
      ...conf,
      bar: true,
    });
    expect(progressBar.classList.contains('slider-metalamp__progressBar__orientation_vertical'))
      .toBe(false);
  });

  test('toggle class hidden on calling switchBar method', async () => {
    expect(progressBar.classList
      .contains('slider-metalamp__progressBar_hidden'))
      .toBe(true);
    await testBar.switchBar({
      ...conf,
      bar: true,
    });
    expect(progressBar.classList
      .contains('slider-metalamp__progressBar_hidden'))
      .toBe(false);
    await testBar.switchBar(conf);
    expect(progressBar.classList
      .contains('slider-metalamp__progressBar_hidden'))
      .toBe(true);
  });

  test('apply styles on calling updateBar method', async () => {
    expect(progressBar)
      .toHaveProperty('style.left', '');
    expect(progressBar)
      .toHaveProperty('style.width', '');
    expect(progressBar)
      .toHaveProperty('style.bottom', '');
    expect(progressBar)
      .toHaveProperty('style.height', '');

    await testBar.updateBar(50, 100, false);

    expect(progressBar)
      .toHaveProperty('style.left', '50%');
    expect(progressBar)
      .toHaveProperty('style.width', '100%');
    expect(progressBar)
      .toHaveProperty('style.bottom', '');
    expect(progressBar)
      .toHaveProperty('style.height', '');
    await testBar.updateBar(50, 100, true);

    expect(progressBar)
      .toHaveProperty('style.left', '');
    expect(progressBar)
      .toHaveProperty('style.width', '');
    expect(progressBar)
      .toHaveProperty('style.bottom', '50%');
    expect(progressBar)
      .toHaveProperty('style.height', '100%');
  });
});
