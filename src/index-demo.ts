import $ from 'jquery';

import '@styles/styles';
import './plugins/index.ts';

function requireAll(requireContext: any) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /.*\.(js|ts)$/));
requireAll(require.context('./pages/', true, /.*\.js$/));

