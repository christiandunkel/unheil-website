'use strict';

const _ = {
	fs: require('fs'),
	path: require('path'),
	sharp: require('sharp')
};

// both width and height must be at least this size
const MIN_SIZE = 450;
const ROOT_DIRECTORY = _.path.join(__dirname, '..');
const OUTPUT_URL = 'public/gallery/';
const OUTPUT_DIRECTORY = _.path.join(ROOT_DIRECTORY, 'public', 'gallery');

/**
 * builds the public image files for the gallery
 */
const buildImages = async() => {

	_.fs.rmSync(OUTPUT_DIRECTORY, {
		recursive: true,
		force: true
	});
	_.fs.mkdirSync(OUTPUT_DIRECTORY);

	for (const {width, height, input_path, output_path, thumbnail_output_path} of await getData()) {
		for (const is_thumbnail of [true, false]) {
			const min_size = 360;
			let output_width;
			let output_height;

			if (is_thumbnail) {
				output_width = min_size;
				output_height = Math.floor(output_width * height / width);
				if (output_height < min_size) {
					output_height = min_size;
					output_width = Math.floor(output_height * width / height);
				}
			}
			else {
				if (width < height) {
					output_height = Math.min(height, 720);
					output_width = Math.floor(output_height * width / height);
				}
				else {
					output_width = Math.min(width, 1280);
					output_height = Math.floor(output_width * height / width);
				}
			}

			try {
				await _.sharp(input_path)
					.resize(output_width, output_height, {
						fit: _.sharp.fit.inside,
						position: 'centre',
						withoutEnlargement: true
					})
					.webp({
						// https://sharp.pixelplumbing.com/api-output#webp
						effort: 6,
						quality: is_thumbnail ? 76 : 72
					})
					.toFile(is_thumbnail ? thumbnail_output_path : output_path);
			}
			catch (error) {
				console.error(error);
				throw new Error(`Failed resizing and compressing image at ${input_path}`);
			}
		}
	}
};

/**
 * gets the data about all known events
 */
const getData = async() => {
	const directory = _.path.join(ROOT_DIRECTORY, 'images');
	const images = [];

	for (const base_name of _.fs.readdirSync(directory)) {
		const path = _.path.join(directory, base_name);
		if (!_.fs.statSync(path).isFile()) {
			continue;
		}

		const extension = _.path.extname(path);
		if (extension === '.json') {
			continue;
		}

		const valid_extensions = ['.jpg', '.jpeg', '.png', '.webp'];
		if (!valid_extensions.includes(extension)) {
			throw new Error(`Found image with unsupported extension at ${path}`);
		}

		if (!/^[a-z0-9_\-]+\.[a-z]+$/i.test(base_name)) {
			throw new Error(`Found image that contains invalid characters in its file name at ${path}`);
		}

		const {width, height} = await _.sharp(path).metadata();
		if (width < MIN_SIZE || height < MIN_SIZE) {
			throw new Error(`Images must be at least ${MIN_SIZE}x${min_heiMIN_SIZEght}px. Found image sized ${width}x${height}px at ${path}`);
		}

		const data_file = `${path}.json`;
		if (!_.fs.existsSync(data_file)) {
			throw new Error(`Missing data file for image ${base_name} that should be located at ${data_file}`);
		}

		const meta_data = _.fs.readFileSync(data_file).toString();
		let meta_json;
		try {
			meta_json = JSON.parse(meta_data);
		}
		catch (error) {
			console.error(error);
			throw new Error(`Failed to parse image meta data as JSON at ${data_file}`);
		}

		if (!(typeof meta_json === 'object' || !Array.isArray(meta_json))) {
			throw new Error(`Meta data must be an object, but got ${typeof meta_json} instead at ${data_file}`);
		}

		const {alt_text} = meta_json;
		if (typeof alt_text !== 'string') {
			throw new Error(`Expected a key alt_text as string, but got ${typeof alt_text} at ${data_file}`);
		}

		const output_basename = _.path.basename(base_name, extension) +
			// add the index of the extension to make sure that images like `abc.jpg` and `abc.webp` end up with separate output paths
			`.${valid_extensions.indexOf(extension)}`;

		images.push({
			alt_text: alt_text,
			width: width,
			height: height,
			input_path: path,
			thumbnail_output_path: _.path.join(OUTPUT_DIRECTORY, `${output_basename}.thumbnail.webp`),
			thumbnail_output_url: OUTPUT_URL + `${output_basename}.thumbnail.webp`,
			output_path: _.path.join(OUTPUT_DIRECTORY, `${output_basename}.webp`),
			output_url: OUTPUT_URL + `${output_basename}.webp`
		});
	}

	return images;
};

module.exports = {
	build: buildImages,
	getData: getData
};