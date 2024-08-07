'use strict';

const _ = {
	events_reader: require('./events-reader.js'),
	image_compiler: require('./image-compiler.js'),
	html_minifier_terser: require('html-minifier-terser'),
	crypto: require('crypto'),
	fs: require('fs'),
	path: require('path')
};

const WEBSITE_TITLE = 'Official Unheil - Black Metal made in Germany';
const DESCRIPTION = 'Atmospheric / Depressive Black Metal made in Germany'
// URL of the final website
const DOMAIN = 'example.com';
const SITE_NAME = 'Unheil';
const LOCALE = 'en_US';
const EMAIL = 'unheil666@gmx.de';

const SOCIAL_MEDIA = [
	{
		name: 'Facebook',
		url: 'https://www.facebook.com/unheil',
		// https://fontawesome.com/icons/facebook-f?f=brands&s=solid
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"/></svg>'
	},
	{
		name: 'Instagram',
		url: 'https://www.instagram.com/unheil.official/',
		// https://iconmonstr.com/instagram-1-svg/
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.984 16.815c2.596 0 4.706-2.111 4.706-4.707 0-1.409-.623-2.674-1.606-3.538-.346-.303-.735-.556-1.158-.748-.593-.27-1.249-.421-1.941-.421s-1.349.151-1.941.421c-.424.194-.814.447-1.158.749-.985.864-1.608 2.129-1.608 3.538 0 2.595 2.112 4.706 4.706 4.706zm.016-8.184c1.921 0 3.479 1.557 3.479 3.478 0 1.921-1.558 3.479-3.479 3.479s-3.479-1.557-3.479-3.479c0-1.921 1.558-3.478 3.479-3.478zm5.223.369h6.777v10.278c0 2.608-2.114 4.722-4.722 4.722h-14.493c-2.608 0-4.785-2.114-4.785-4.722v-10.278h6.747c-.544.913-.872 1.969-.872 3.109 0 3.374 2.735 6.109 6.109 6.109s6.109-2.735 6.109-6.109c.001-1.14-.327-2.196-.87-3.109zm2.055-9h-12.278v5h-1v-5h-1v5h-1v-4.923c-.346.057-.682.143-1 .27v4.653h-1v-4.102c-1.202.857-2 2.246-2 3.824v3.278h7.473c1.167-1.282 2.798-2 4.511-2 1.722 0 3.351.725 4.511 2h7.505v-3.278c0-2.608-2.114-4.722-4.722-4.722zm2.722 5.265c0 .406-.333.735-.745.735h-2.511c-.411 0-.744-.329-.744-.735v-2.53c0-.406.333-.735.744-.735h2.511c.412 0 .745.329.745.735v2.53z"/></svg>'
	},
	{
		name: 'YouTube',
		url: 'https://www.youtube.com/channel/UC5HulZcnFufj5V1QEbcLr2g',
		// https://iconmonstr.com/youtube-6-svg/
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>'
	},
	{
		name: 'Bandcamp',
		url: 'https://unheil.bandcamp.com',
		full_text: 'Buy the music',
		// https://fontawesome.com/icons/bandcamp?f=brands&s=solid
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256S119 504 256 504 504 393 504 256 393 8 256 8zm48.2 326.1h-181L207.9 178h181z"/></svg>'
	},
	{
		name: 'Spotify',
		url: 'https://open.spotify.com/intl-de/artist/6zEizcmXWMtqcPSBWdWO6o',
		// https://fontawesome.com/icons/spotify?f=brands&s=solid
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/></svg>'
	},
	{
		name: 'Skullmerch',
		url: 'https://www.skullmerch.com/front-band.php?shop=68',
		full_text: 'Get the merch',
		// https://fontawesome.com/icons/skull?f=classic&s=solid
		icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 398.9c58.5-41.1 96-104.1 96-174.9C512 100.3 397.4 0 256 0S0 100.3 0 224c0 70.7 37.5 133.8 96 174.9c0 .4 0 .7 0 1.1v64c0 26.5 21.5 48 48 48h48V464c0-8.8 7.2-16 16-16s16 7.2 16 16v48h64V464c0-8.8 7.2-16 16-16s16 7.2 16 16v48h48c26.5 0 48-21.5 48-48V400c0-.4 0-.7 0-1.1zM96 256a64 64 0 1 1 128 0A64 64 0 1 1 96 256zm256-64a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>'
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

let SOCIAL_MEDIA_LINKS;

/**
 * gets the HTML code for the social media links in the home section
 */
const getSocialMediaLinksHtml = () => {
	if (!SOCIAL_MEDIA_LINKS) {
		const links_fullwidth = [];
		const links_regular = [];

		for (const {name, url, full_text, icon} of SOCIAL_MEDIA) {
			const encoded_name = encodeHtml(name);
			const label = full_text ? '' : ` aria-label="${encoded_name}" title="${encoded_name}"`;

			const html = `<a class="social-media__link" href="${encodeHtml(url)}" target="_blank" rel="noopener noreferrer"${label}>
				<span class="social-media__link__inner">${
					icon +
					(full_text ? `<span>${encodeHtml(full_text)}</span>` : '')
				}</span>
			</a>`;

			if (full_text) {
				links_fullwidth.push(html);
			}
			else {
				links_regular.push(html);
			}
		}

		SOCIAL_MEDIA_LINKS = {
			fullwidth: `<div class="social-media social-media--fullwidth">${links_fullwidth.join(' ')}</div>`,
			regular: `<div class="social-media">${links_regular.join('')}</div>`
		};
	}
	return SOCIAL_MEDIA_LINKS;
};

/**
 * gets the HTML code to display the current events
 */
const getEventsHtml = () => {
	const data = _.events_reader.getData();
	if (data.length === 0) {
		return '<p class="events__none-defined-message">There are currently no events.</p>';
	}

	return `<div class="events__list">
		<ol class="events__list__inner">
			${
				data.reduce((total, {date, end_time, name, place, url}) => {
					const encoded_name = encodeHtml(name);
					return total + `<li class="events__list__inner__event" data-event-end-time="${end_time}">
						<span class="events__list__inner__event__info">${
							encodeHtml(date) +
							(place ? `<br /><span class="events__list__inner__event__info__place">${encodeHtml(place)}</span>` : '')
						}</span>
						<span class="events__list__inner__event__name">${
							url ? `<a href="${encodeHtml(url)}" target="_blank" rel="noopener noreferrer">${encodeHtml(encoded_name)}</a>` : encoded_name
						}</span>
					</li>`
				}, '')
			}
		</ol>
	</div>`;
};

/**
 * generates a hash unique to the contents of a file
 */
const getFileHash = file_path => {
	const file_content = _.fs.readFileSync(file_path).toString();
	return _.crypto.createHash('md5').update(file_content).digest('hex').slice(0, 12);
};

/**
 * generates the code for the index HTML page
 */
const buildPage = async() => {
	const encoded_title = encodeHtml(WEBSITE_TITLE);
	const encoded_description = encodeHtml(DESCRIPTION);
	const encoded_url = `https://${encodeHtml(DOMAIN)}`;
	const encoded_site_name = encodeHtml(SITE_NAME);
	const encoded_email = encodeHtml(EMAIL);
	const preview_image = `${encoded_url}/public/image/preview.webp`;
	const preview_image_width = 1200;
	const preview_image_height = 630;
	const css_location = 'public/app.css';
	const css_hash = getFileHash(_.path.join(__dirname, '..', css_location));
	const css_url = `${css_location}?${css_hash}`;
	const js_location = 'public/app.js';
	const js_hash = getFileHash(_.path.join(__dirname, '..', js_location));
	const js_url = `${js_location}?${js_hash}`;

	const html = `
<html lang="${LOCALE.split('_')[0]}" dir="ltr" prefix="og: https://ogp.me/ns#">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1,user-scalable=1.0,minimum-scale=1.0" />
		<title>${encoded_title}</title>
		<link rel="preload" href="public/font/roboto-mono-regular.woff2" as="font" type="font/woff2" crossorigin="">
		<link rel="preload" href="public/font/roboto-mono-semi-bold.woff2" as="font" type="font/woff2" crossorigin="">
		<link rel="stylesheet" href="${css_url}" />
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
		<link rel="canonical" href="${encoded_url}" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black" />

		<!-- disable indexing by search machines, but would need to be enabled on the actual website -->
		<meta name="robots" content="noindex, nofollow" />
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
			<button class="navigation__button" data-scroll-to="about">
				<span class="navigation__button__inner">about</span>
			</button>
		</nav>
		<header id="home" class="home">
			<div class="home__box">
			<img class="home__box__logo" src="public/image/logo.webp" alt="Unheil Logo" fetchpriority="high">
				<h1 class="home__box__heading">${encoded_site_name}</h1>
				<p class="home__box__tagline">${encoded_description}</p>
				${getSocialMediaLinksHtml().fullwidth}
			</div>
		</header>
		<section id="events" class="events">
			<h2 class="events__heading">events</h2>
			${getEventsHtml()}
			<picture class="events__image">
				<source srcset="public/image/band-small.webp" type="image/webp" media="(max-width: 500px)">
				<img class="events__image__img" src="public/image/band-regular.webp" loading="lazy" />
			</picture>
		</section>
		<section id="about" class="about">
			<h2 class="about__heading">about</h2>
			<p class="about__description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
			<div class="about__gallery">
				${
					(await _.image_compiler.getData()).reduce((total, {alt_text, thumbnail_output_url, output_url}) =>
						total + `<button class="about__gallery__image" data-open-image-menu="${output_url}" aria-label="Open image" title="Open image" aria-controls="image-menu" aria-expanded="false" aria-haspopup="dialog">
							<span class="about__gallery__image__inner">
								<img class="about__gallery__image__inner__img" src="${thumbnail_output_url}" alt="${alt_text}" loading="lazy" />
							</span>
						</button>`,
					'')
				}
			</div>
		</section>
		<footer class="footer">
			${getSocialMediaLinksHtml().regular}
			<p class="footer__text">This website is hosted on GitHub pages. To find out what data GitHub collects, check out their <a class="footer__text__link" href="https://docs.github.com/en/site-policy">privacy policy</a>. To get in contact, write an e-mail at <a class="footer__text__link" href="mailto:${encoded_email}">${encoded_email}</a>.</p>
		</footer>
		<div id="image-menu" class="image-menu" role="dialog" aria-modal="true">
			<button class="image-menu__close-button" aria-label="Close" title="Close" aria-controls="image-menu" aria-expanded="false">
				<!-- https://fontawesome.com/icons/xmark?f=classic&s=solid -->
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
			</button>
		</div>
		<script src="${js_url}" defer></script>
	</body>
</html>`;

	const public_path = _.path.join(__dirname, '..', 'index.html');
	const minified_html = await minifyHtml(html);
	_.fs.writeFileSync(public_path, minified_html);
};

module.exports = {
	build: buildPage
};