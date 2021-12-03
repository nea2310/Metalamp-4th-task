import { sliderViewBar } from './../../view/view-bar/view-bar';
const root = document.createElement('div');
document.body.appendChild(root);

const track = document.createElement('div');
track.className = 'rs__track';
root.appendChild(track);
const testBar = new sliderViewBar(root, {});
const progressBar =
	document.getElementsByClassName('rs__progressBar')[0] as HTMLElement;

describe('ViewControl', () => {

	test('toggle class vert on calling switchVertical method', async () => {
		expect(progressBar.classList.contains('vert')).
			toBe(false);
		await testBar.switchVertical({ vertical: true });
		expect(progressBar.classList.contains('vert')).
			toBe(true);
		await testBar.switchVertical({ vertical: false });
		expect(progressBar.classList.contains('vert')).
			toBe(false);
	});

	test('toggle class hidden on calling switchBar method', async () => {
		expect(progressBar.classList.contains('hidden')).
			toBe(true);
		await testBar.switchBar({ bar: true });
		expect(progressBar.classList.contains('hidden')).
			toBe(false);
		await testBar.switchBar({ bar: false });
		expect(progressBar.classList.contains('hidden')).
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

