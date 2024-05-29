const _ = {
	babel: require('@babel/core'),
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
	let transpiled;

	try {
		transpiled = _.babel.transformSync(source_code, {
			assumptions: {
				ignoreFunctionLength: true,
				ignoreToPrimitiveHint: true,
				iterableIsArray: true,
				mutableTemplateObject: true,
				noDocumentAll: true,
				noNewArrows: true,
				objectRestNoSymbols: true,
				pureGetters: false,
				setComputedProperties: true,
				setSpreadProperties: true,
				skipForOfIteratorClosing: true
			},
			generatorOpts: {
				compact: true
			},
			parserOpts: {
				strictMode: true
			},
			presets: [
				['@babel/preset-env']
			],
			sourceType: 'script',
			targets: '> .1% or last 8 years and not IE > 0 and not ie_mob > 0 and not op_mini all'
		});
	}
	catch (error) {
		console.error(error);
		throw new Error(`Failed to transpile JS file at ${file_path}`);
	}

	const minified = _.uglify.minify(transpiled.code, {
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