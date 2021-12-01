import { sliderViewBar } from './../../view/view-bar/view-bar';
const root = document.createElement('div');
document.body.appendChild(root);

const track = document.createElement('div');
track.className = 'rs__track';
root.appendChild(track);
const testBar = new sliderViewBar(root, {});

describe('ViewControl', () => {

	test('toggle class vert on calling switchVertical method', async () => {
		expect(testBar.progressBar.classList.contains('vert')).
			toBe(false);
		await testBar.switchVertical({ vertical: true });
		expect(testBar.progressBar.classList.contains('vert')).
			toBe(true);
		await testBar.switchVertical({ vertical: false });
		expect(testBar.progressBar.classList.contains('vert')).
			toBe(false);
	});

	test('toggle class hidden on calling switchBar method', async () => {
		expect(testBar.progressBar.classList.contains('hidden')).
			toBe(true);
		await testBar.switchBar({ bar: true });
		expect(testBar.progressBar.classList.contains('hidden')).
			toBe(false);
		await testBar.switchBar({ bar: false });
		expect(testBar.progressBar.classList.contains('hidden')).
			toBe(true);
	});

	test('apply styles on calling updateBar method', async () => {
		expect(testBar.progressBar).
			toHaveProperty('style.left', '');
		expect(testBar.progressBar).
			toHaveProperty('style.width', '');
		expect(testBar.progressBar).
			toHaveProperty('style.bottom', '');
		expect(testBar.progressBar).
			toHaveProperty('style.height', '');

		await testBar.updateBar(50, 100, false);

		expect(testBar.progressBar).
			toHaveProperty('style.left', '50%');
		expect(testBar.progressBar).
			toHaveProperty('style.width', '100%');
		expect(testBar.progressBar).
			toHaveProperty('style.bottom', '');
		expect(testBar.progressBar).
			toHaveProperty('style.height', '');
		await testBar.updateBar(50, 100, true);

		expect(testBar.progressBar).
			toHaveProperty('style.left', '');
		expect(testBar.progressBar).
			toHaveProperty('style.width', '');
		expect(testBar.progressBar).
			toHaveProperty('style.bottom', '50%');
		expect(testBar.progressBar).
			toHaveProperty('style.height', '100%');
	});
});

