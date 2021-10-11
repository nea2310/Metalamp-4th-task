import '@styles/styles';
import '@plugins/java-import';

// eslint-disable-next-line no-unused-vars
import $ from 'jquery';

function requireAll(requireContext: any) {
	return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /^\.\/(?!.*(?:__tests__)).*\.((jsx?)|(tsx?))$/));
requireAll(require.context('./pages/', true, /^\.\/(?!.*(?:__tests__)).*\.((jsx?)|(tsx?))$/));

