import ViewBar from './ViewBar';

const root = document.createElement('div');
document.body.appendChild(root);

const track = document.createElement('div');
track.className = 'slider-metalamp__track';
root.appendChild(track);
const testBar = new ViewBar(root);
const progressBar = document
  .getElementsByClassName('slider-metalamp__progress-bar')[0];

describe('ViewControl', () => {
  test('apply styles on calling updateBar method', () => {
    expect(progressBar)
      .toHaveProperty('style.left', '');
    expect(progressBar)
      .toHaveProperty('style.width', '');
    expect(progressBar)
      .toHaveProperty('style.bottom', '');
    expect(progressBar)
      .toHaveProperty('style.height', '');

    testBar.updateBar(50, 100, true, false);

    expect(progressBar)
      .toHaveProperty('style.left', '50%');
    expect(progressBar)
      .toHaveProperty('style.width', '50%');
    expect(progressBar)
      .toHaveProperty('style.bottom', '');
    expect(progressBar)
      .toHaveProperty('style.height', '');
    testBar.updateBar(50, 100, true, true);

    expect(progressBar)
      .toHaveProperty('style.left', '');
    expect(progressBar)
      .toHaveProperty('style.width', '');
    expect(progressBar)
      .toHaveProperty('style.bottom', '50%');
    expect(progressBar)
      .toHaveProperty('style.height', '50%');
  });
});
