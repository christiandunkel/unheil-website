'use strict';

const _ = {
	fs: require('fs'),
	path: require('path')
};

/**
 * checks for a valid date string
 */
const isValidDate = value =>

	typeof value === 'string' &&
	/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(value) &&
	!!(new Date(value));

/**
 * gets the data about all known events
 */
const getData = () => {
	const file_path = _.path.join(__dirname, 'events.json');
	const file_data = _.fs.readFileSync(file_path).toString();

	let json;
	try {
		json = JSON.parse(file_data);
	}
	catch (error) {
		console.error(error);
		throw new Error(`Failed to parse events JSON data at ${file_path}`);
	}

	if (!Array.isArray(json)) {
		throw new Error(`Events data must be an array, but found ${typeof json} at ${file_path}`);
	}

	let index = -1;
	const events = [];
	for (const event of json) {
		index++;

		if (!(typeof event === 'object' || !Array.isArray(event))) {
			throw new Error(`An event object must be an object, but got ${typeof event} instead at ${file_path}`);
		}

		const {start_date, end_date, name, place, url} = event;

		if (typeof name !== 'string' || name === '') {
			throw new Error(`Expected non-empty string as event name, but got ${typeof name} "${name}" instead at index ${index} at ${file_path}`);
		}

		if (!isValidDate(start_date)) {
			throw new Error(`Expected valid date as event start date, but got ${typeof start_date} "${start_date}" for event "${name}" at ${file_path}`);
		}

		if (!isValidDate(end_date)) {
			throw new Error(`Expected valid date as event start date, but got ${typeof start_date} "${start_date}" for event "${name}" at ${file_path}`);
		}

		const start_date_object = new Date(start_date);
		const end_date_object = new Date(end_date);

		if (start_date_object > end_date_object) {
			throw new Error(`Expected event start date to be equal or smaller than the end date, but "${start_date}>${end_date}" for event "${name}" at ${file_path}`);
		}

		if (typeof place !== 'string') {
			throw new Error(`Expected string as event place, but got ${typeof place} for event "${name}" at ${file_path}`);
		}

		if (typeof url !== 'string') {
			throw new Error(`Expected string as event URL, but got ${typeof url} for event "${name}" at ${file_path}`);
		}

		const start_day = start_date_object.getDate();
		const start_month = start_date_object.getMonth() + 1;
		const start_year = start_date_object.getFullYear();
		const end_day = end_date_object.getDate();
		const end_month = end_date_object.getMonth() + 1;
		const end_year = end_date_object.getFullYear();
		let formatted_date = `${end_day}.${end_month}.${end_year}`;

		if (start_year !== end_year || start_month !== end_month) {
			formatted_date = `${start_day}.${start_month}-${formatted_date}`;
		}
		else if (start_day !== end_day) {
			formatted_date = `${start_day}-${formatted_date}`;
		}

		const end_time = new Date(end_date_object);
		end_time.setHours(23);
		end_time.setMinutes(59);
		end_time.setSeconds(59);
		end_time.setMilliseconds(999);

		events.push({
			time: start_date_object.getTime(),
			// positive integer
			end_time: end_time.getTime(),
			/** non-empty string */
			date: formatted_date,
			/** non-empty string */
			name: name,
			/** string */
			place: place,
			/** string */
			url: url
		});
	}

	events.sort((event_a, event_b) => event_b.time - event_a.time);

	return events;
};

module.exports = {
	getData: getData
};