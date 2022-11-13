import render from '../../shared/render/render';

const pageSelector = '.js-index';
const page = document.querySelector(pageSelector);

if (page) {
  render(page, pageSelector);
}
