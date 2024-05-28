const _ = {
	fs: require('fs'),
	path: require('path'),
	sass: require('sass')
};

/**
 * compiles the SCSS source code to the public CSS code
 */
const buildCss = () => {
	const root = _.path.join(__dirname, '..');
	const file_path = _.path.join(root, 'scss', 'app.scss');
	let result, error;

	try {
		// options: https://sass-lang.com/documentation/js-api/interfaces/Options
		// output: https://sass-lang.com/documentation/js-api/interfaces/CompileResult
		result = _.sass.compile(file_path, {
			sourceMap: false,
			style: 'compressed',
			sync: 'sync',
			verbose: true
		});
	}
	catch (caught_error) {
		error = caught_error;
	}

	if (error || typeof result.css !== 'string') {
		console.error(error);
		throw new Error(`Failed to compile SCSS to CSS at ${file_path}`);
	}

	const public_path = _.path.join(root, 'public', 'app.css');
	_.fs.writeFileSync(public_path, result.css);
};

module.exports = {
	build: buildCss
};