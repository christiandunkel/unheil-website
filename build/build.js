const _ = {
	scss_compiler: require('./scss-compiler.js')
};

(async() => {
	console.log('Building CSS');
	_.scss_compiler.build();
})();