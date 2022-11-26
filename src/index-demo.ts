import '@styles/styles';
import './slider-metalamp/index';

function requireAll(requireContext: any) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /.*\.(ts|scss)$/));
requireAll(require.context('./pages/', true, /.*\.(ts|scss)$/));
