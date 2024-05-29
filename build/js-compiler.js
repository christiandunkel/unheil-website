const _ = {
	fs: require('fs'),
	path: require('path'),
	uglify: require('uglify-js')
};

/**
 * compiles the JS source code to the public JS code
 */
const buildJs = () => {
	const root = _.path.join(__dirname, '..');
	const file_path = _.path.join(root, 'js', 'app.js');
	const source_code = _.fs.readFileSync(file_path).toString();

	const minified = _.uglify.minify(source_code, {
		compress: {
			keep_infinity: true,
			passes: 2
		},
		output: {
			ascii_only: true,
			ast: false,
			code: true,
			wrap_iife: true
		}
	}).code;

	const public_path = _.path.join(root, 'public', 'app.js');
	_.fs.writeFileSync(public_path, minified);
};

module.exports = {
	build: buildJs
};