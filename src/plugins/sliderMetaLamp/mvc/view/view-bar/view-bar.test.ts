import { ViewBar } from './../../view/view-bar/view-bar';
const root = document.createElement('div');
document.body.appendChild(root);

const track = document.createElement('div');
track.className = 'rs-metalamp__track';
root.appendChild(track);
const testBar = new ViewBar(root, {});
const progressBar = document.
  getElementsByClassName('rs-metalamp__progressBar')[0] as HTMLElement;

describe('ViewControl', () => {

  test('toggle class vert on calling switchVertical method', async () => {
    expect(progressBar.classList.contains('rs-metalamp__progressBar_vert')).
      toBe(false);
    await testBar.switchVertical({ vertical: true });
    expect(progressBar.classList.contains('rs-metalamp__progressBar_vert')).
      toBe(true);
    await testBar.switchVertical({ vertical: false });
    expect(progressBar.classList.contains('rs-metalamp__progressBar_vert')).
      toBe(false);
  });

  test('toggle class hidden on calling switchBar method', async () => {
    expect(progressBar.classList.
      contains('rs-metalamp__progressBar_hidden')).
      toBe(true);
    await testBar.switchBar({ bar: true });
    expect(progressBar.classList.
      contains('rs-metalamp__progressBar_hidden')).
      toBe(false);
    await testBar.switchBar({ bar: false });
    expect(progressBar.classList.
      contains('rs-metalamp__progressBar_hidden')).
      toBe(true);
  });

  test('apply styles on calling updateBar method', async () => {
    expect(progressBar).
      toHaveProperty('style.left', '');
    expect(progressBar).
      toHaveProperty('style.width', '');
    expect(progressBar).
      toHaveProperty('style.bottom', '');
    expect(progressBar).
      toHaveProperty('style.height', '');

    await testBar.updateBar(50, 100, false);

    expect(progressBar).
      toHaveProperty('style.left', '50%');
    expect(progressBar).
      toHaveProperty('style.width', '100%');
    expect(progressBar).
      toHaveProperty('style.bottom', '');
    expect(progressBar).
      toHaveProperty('style.height', '');
    await testBar.updateBar(50, 100, true);

    expect(progressBar).
      toHaveProperty('style.left', '');
    expect(progressBar).
      toHaveProperty('style.width', '');
    expect(progressBar).
      toHaveProperty('style.bottom', '50%');
    expect(progressBar).
      toHaveProperty('style.height', '100%');
  });
});

