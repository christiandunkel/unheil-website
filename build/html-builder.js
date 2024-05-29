const _ = {
	fs: require('fs'),
	path: require('path')
};

const WEBSITE_TITLE = 'Unheil\'s Official Website';
const DESCRIPTION = 'Atmospheric / Depressive Black Metal from Germany'
const DOMAIN = 'unheil-something.com';
const SITE_NAME = 'Unheil';
const LOCALE = 'en_US';

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

	return await require('html-minifier-terser').minify(html, {
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

	const html = `
	
<html lang="${LOCALE.split('_')[0]}" dir="ltr" prefix="og: https://ogp.me/ns#">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1,user-scalable=1.0,minimum-scale=1.0" />
		<title>${encoded_title}</title>
		<link rel="preload" href="public/font/roboto-mono-regular.woff2" as="font" type="font/woff2" crossorigin="">
		<link rel="preload" href="public/font/roboto-mono-semi-bold.woff2" as="font" type="font/woff2" crossorigin="">
		<link rel="stylesheet" href="public/app.css" />
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
						sameAs: [
							'https://www.facebook.com/unheil',
							'https://www.instagram.com/unheil.official/',
							'https://www.youtube.com/channel/UC5HulZcnFufj5V1QEbcLr2g',
							'https://unheil.bandcamp.com',
							'https://open.spotify.com/intl-de/artist/6zEizcmXWMtqcPSBWdWO6o',
							'https://www.skullmerch.com/front-band.php?shop=68'
						]
					},
					copyrightHolder: {
						'@id': `${encoded_url}#band`
					}
				}
			}
		)}
		</script>
		</head>
	</head>
	<body>
		<nav class="navigation">
			<button class="navigation__button" data-scroll-to="home">home</button>
			<button class="navigation__button" data-scroll-to="events">events</button>
			<button class="navigation__button" data-scroll-to="gallery">gallery</button>
			<button class="navigation__button" data-scroll-to="about">about</button>
		</nav>
		<div id="home" class="home">
			<picture class="home__logo">
				<source srcset="public/image/logo-small.webp" type="image/webp" media="(max-width: 400px)">
				<img class="home__logo__img" src="public/image/logo-normal.webp" alt="Unheil Logo" fetchpriority="high">
			</picture>
			<h1 class="home__heading">Unheil</h1>
			<p class="home__tagline">Atmospheric / Depressive Black Metal from Germany</p>
		</div>
		<div id="events" class="events" style="min-height: 500px"></div>
		<div id="gallery" class="gallery" style="min-height: 500px"></div>
		<div id="about" class="about" style="min-height: 500px"></div>
		<script src="public/app.js" defer></script>
	</body>
</html>
	
	`;

	const public_path = _.path.join(__dirname, '..', 'index.html');
	const minified_html = await minifyHtml(html);
	_.fs.writeFileSync(public_path, minified_html);
};

module.exports = {
	build: buildPage
};