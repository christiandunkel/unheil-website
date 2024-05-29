const _ = {
	scss_compiler: require('./scss-compiler.js')
};

(async() => {

	console.log('Building CSS');
	require('./scss-compiler.js').build();

	console.log('Building JS');
	require('./js-compiler.js').build();

	console.log('Building HTML');
	await require('./html-builder.js').build();
})();