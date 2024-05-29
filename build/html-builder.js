'use strict';

const _ = {
	events_reader: require('./events-reader.js'),
	html_minifier_terser: require('html-minifier-terser'),
	fs: require('fs'),
	path: require('path')
};

const WEBSITE_TITLE = 'Unheil\'s Official Website';
const DESCRIPTION = 'Atmospheric / Depressive Black Metal made in Germany'
// URL of the final website
const DOMAIN = 'example.com';
const SITE_NAME = 'Unheil';
const LOCALE = 'en_US';

const SOCIAL_MEDIA = [
	{
		name: 'Facebook',
		url: 'https://www.facebook.com/unheil',
		// https://fontawesome.com facebook-f.svg
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"/></svg>'
	},
	{
		name: 'Instagram',
		url: 'https://www.instagram.com/unheil.official/',
		// https://fontawesome.com instagram.svg
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>'
	},
	{
		name: 'YouTube',
		url: 'https://www.youtube.com/channel/UC5HulZcnFufj5V1QEbcLr2g',
		// https://fontawesome.com youtube.svg
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>'
	},
	{
		name: 'Bandcamp',
		url: 'https://unheil.bandcamp.com',
		// https://fontawesome.com bandcamp.svg
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256S119 504 256 504 504 393 504 256 393 8 256 8zm48.2 326.1h-181L207.9 178h181z"/></svg>'
	},
	{
		name: 'Spotify',
		url: 'https://open.spotify.com/intl-de/artist/6zEizcmXWMtqcPSBWdWO6o',
		// https://fontawesome.com spotify.svg
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/></svg>'
	}
];

/**
 * replaces reserved HTML characters with character entities, e.g. 'a&b' -> 'a&amp;b'
 */
const encodeHtml = string => {

	if (typeof string !== 'string') {
		throw new Error(`Expected a string, but got ${typeof string} "${string}"`);
	}

	return string.replace(/[<>&"']/g, match => `&#${match.charCodeAt(0)};`);
};

/**
 * minifies the given HTML code
 */
const minifyHtml = async(html) => {

	if (typeof html !== 'string') {
		throw new Error(`Expected a string, but got ${typeof html} "${html}"`);
	}

	return await _.html_minifier_terser.minify(html, {
		// remove whitespace, combines multiply spaces into a single one (or zero, if no spaces are needed there)
		collapseWhitespace: true,
		conservativeCollapse: false,
		html5: true,
		keepClosingSlash: true,
		minifyCSS: true,
		minifyJS: true,
		processScripts: ['application/ld+json'],
		// do not sort attributes, as <meta name=""> tags may not be properly identified by Lighthouse, if the name attribute isn't first
		sortAttributes: false,
		sortClassName: true,
		removeComments: true
	});
};

/**
 * generates the code for the index HTML page
 */
const buildPage = async() => {
	const encoded_title = encodeHtml(WEBSITE_TITLE);
	const encoded_description = encodeHtml(DESCRIPTION);
	const encoded_url = `https://${encodeHtml(DOMAIN)}`;
	const encoded_site_name = encodeHtml(SITE_NAME);
	const preview_image = `${encoded_url}/public/image/preview.webp`;
	const preview_image_width = 1200;
	const preview_image_height = 630;
	const cache_invalidator = Math.floor(Math.random() * 10000000000).toString(36);

	const html = `
	
<html lang="${LOCALE.split('_')[0]}" dir="ltr" prefix="og: https://ogp.me/ns#">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1,user-scalable=1.0,minimum-scale=1.0" />
		<title>${encoded_title}</title>
		<link rel="preload" href="public/font/roboto-mono-regular.woff2" as="font" type="font/woff2" crossorigin="">
		<link rel="preload" href="public/font/roboto-mono-semi-bold.woff2" as="font" type="font/woff2" crossorigin="">
		<link rel="stylesheet" href="public/app.css?${cache_invalidator}" />
		<link rel="canonical" href="${encoded_url}" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black" />
		<meta name="robots" content="index, follow" />
		<meta name="description" content="${encoded_description}" />
		<meta property="og:description" content="${encoded_description}" />
		<meta name="keywords" content="unheil,germany,band,music,atmospheric metal,black metal,depressive black metal" />
		<meta property="og:url" content="${encoded_url}" />
		<meta property="og:title" content="${encoded_title}" />
		<meta property="og:site_name" content="${encoded_site_name}" />
		<meta property="og:locale" content="${LOCALE}" />
		<meta name="thumbnail" content="${preview_image}" />
		<meta property="og:image" content="${preview_image}" />
		<meta property="og:image:width" content="${preview_image_width}" />
		<meta property="og:image:height" content="${preview_image_height}" />
		<meta property="og:type" content="image/webp" />
		<script type="application/ld+json">
		${JSON.stringify(
			{
				'@context': 'http://schema.org',
				'@type': 'WebPage',
				'@id': `${encoded_url}/#webpage`,
				url: encoded_url,
				name: encoded_title,
				description: encoded_description,
				inLanguage: LOCALE,
				isPartOf: {
					'@type': 'WebSite',
					'@id': `${encoded_url}#website`,
					url: encoded_url,
					name: encoded_site_name,
					description: encoded_description,
					publisher: {
						'@type': 'Organization',
						'@id': `${encoded_url}#band`,
						url: encoded_url,
						name: encoded_site_name,
						sameAs: SOCIAL_MEDIA.map(({url}) => url)
					},
					copyrightHolder: {
						'@id': `${encoded_url}#band`
					}
				},
				primaryImageOfPage: {
					'@type': 'ImageObject',
					'@id': `${encoded_url}/#primaryimage`,
					inLanguage: LOCALE,
					url: preview_image,
					contentUrl: preview_image,
					width: preview_image_width,
					height: preview_image_height
				}
			}
		)}
		</script>
		</head>
	</head>
	<body>
		<nav class="navigation">
			<button class="navigation__button" data-scroll-to="home">
				<span class="navigation__button__inner">home</span>
			</button>
			<button class="navigation__button" data-scroll-to="events">
				<span class="navigation__button__inner">events</span>
			</button>
			<button class="navigation__button" data-scroll-to="gallery">
				<span class="navigation__button__inner">gallery</span>
			</button>
			<button class="navigation__button" data-scroll-to="about">
				<span class="navigation__button__inner">about</span>
			</button>
		</nav>
		<div id="home" class="home">
			<div class="home__box">
			<img class="home__box__logo" src="public/image/logo.webp" alt="Unheil Logo" fetchpriority="high">
				<h1 class="home__box__heading">${encoded_site_name}</h1>
				<p class="home__box__tagline">${encoded_description}</p>
				<div class="home__box__social-media">
					${
						SOCIAL_MEDIA.reduce((total, {name, url, icon}) => {
							const encoded_name = encodeHtml(name);
							return total + `<a class="home__box__social-media__link" href="${encodeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${encoded_name}" title="${encoded_name}">
								<span class="home__box__social-media__link__inner">${icon}</span>
							</a>`
						}, '')
					}
				</div>
			</div>
		</div>
		<div id="events" class="events">
			<h2 class="heading">events</h2>
			<div class="events__image">
				<img class="events__image__img" src="public/image/band.webp" />
			</div>
			<div class="events__list">
			${
				_.events_reader.getData().reduce((total, {date, end_time, name, place, url}) => {
					return total + `<div class="events__list__event" data-event-end-time="${end_time}">
						<span class="events__list__event__date">${encodeHtml(date)}</span>
						<span class="events__list__event__place">${encodeHtml(place)}</span>
						<a class="events__list__event__link" href="${url ? encodeHtml(url) : 'javascript: void(0)'}" target="_blank" rel="noopener noreferrer">${encodeHtml(name)}</a>
					</div>`
				}, '')
			}
			</div>
		</div>
		<div id="gallery" class="gallery" style="min-height: 500px"></div>
		<div id="about" class="about" style="min-height: 500px"></div>
		<script src="public/app.js?${cache_invalidator}" defer></script>
	</body>
</html>
	
	`;

	console.log(  );

	const public_path = _.path.join(__dirname, '..', 'index.html');
	const minified_html = await minifyHtml(html);
	_.fs.writeFileSync(public_path, minified_html);
};

module.exports = {
	build: buildPage
};