'use strict';

const _ = {
	html_builder: require('./html-builder.js'),
	js_compiler: require('./js-compiler.js'),
	scss_compiler: require('./scss-compiler.js')
};

(async() => {

	console.log('Building CSS');
	_.scss_compiler.build();

	console.log('Building JS');
	_.js_compiler.build();

	console.log('Building HTML');
	_.html_builder.build();
})();