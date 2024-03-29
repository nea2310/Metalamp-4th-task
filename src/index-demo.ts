import '@styles/styles';
import './slider-metalamp/index';

function requireAll(requireContext: __WebpackModuleApi.RequireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./assets/styles/', true, /.*\.(scss)$/));
requireAll(require.context('./components/', true, /.*\.(ts|scss)$/));
requireAll(require.context('./pages/', true, /.*\.(ts|scss)$/));
