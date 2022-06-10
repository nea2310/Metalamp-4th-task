// eslint-disable-next-line no-unused-vars
import $ from 'jquery';

import '@styles/styles';
import './slider-metalamp/index.ts';

function requireAll(requireContext: any) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /.*\.(ts|scss)$/));
requireAll(require.context('./pages/', true, /.*\.scss$/));
