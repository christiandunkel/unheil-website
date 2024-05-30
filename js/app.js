(() => {

	/**
	 * enables navigation button to scroll to their corresponding section on a click
	 */
	const initializeNavigationButtons = () => {
		const attribute = 'data-scroll-to';
		const buttons = document.querySelectorAll(`[${attribute}]`);
		let is_running;
		for (let i = 0, len = buttons.length; i < len; i++) {
			const button = buttons[i];
			let target;
			button.addEventListener('click', () => {
				if (is_running) return;
				is_running = true;
				if (!target) {
					const target_id = button.getAttribute(attribute);
					target = document.querySelector(`#${target_id}`);
				}
				setTimeout(() => {
					const element_y = Math.round(target.getBoundingClientRect().top);
					const scroll_y = element_y + window.scrollY;

					// force focus on the section that comes into view
					// should be called before the scroll is run, as otherwise the scroll is laggy and sometimes slightly off in position
					const onBlur = () => {
						target.removeEventListener('blur', onBlur);
						target.removeAttribute('tabindex');
					};
					target.addEventListener('blur', onBlur);
					target.tabIndex = 0;
					target.focus({
						preventScroll: true
					});

					if ('scrollBehavior' in document.body.style) {
						scrollTo({
							top: scroll_y,
							behavior: 'smooth'
						});
					}
					else {
						scrollTo(0, scroll_y);
					}

					is_running = false;
				}, 90);
			});
		}
	};

	/**
	 * marks events that are already over
	 */
	const initializeEvents = () => {
		const attribute = 'data-event-end-time';
		const elements = document.querySelectorAll(`[${attribute}]`);
		for (let i = 0, len = elements.length; i < len; i++) {
			const element = elements[i];
			const end_time = parseInt(element.getAttribute(attribute));
			if (Date.now() > end_time) {
				element.classList.add('events__list__event--is-over');
			}
		}
	};

	/**
	 * initializes the image gallery of the about section
	 */
	const initializeImageGallery = () => {
		let opener_button;
		let is_open = false;
		const menu_open_class = 'image-menu-is-open';
		const menu = document.querySelector('.image-menu');
		const close_button = menu.querySelector('.image-menu__close-button');

		let inner_element;
		let image_container;
		let image_element;
		const loadImageIntoMenu = url => {
			const image_hidden_class = 'image-menu__inner__image__img--hidden';
			if (!inner_element) {
				inner_element = document.createElement('div');
				inner_element.className = 'image-menu__inner';
				image_container = document.createElement('div');
				image_container.className = 'image-menu__inner__image';
				image_element = document.createElement('img');
				image_element.className = 'image-menu__inner__image__img';
				image_element.onload = () => {
					image_container.style.maxWidth = image_element.naturalWidth;
					image_element.classList.remove(image_hidden_class);
				};
				image_container.appendChild(image_element);
				inner_element.appendChild(image_container);
				menu.appendChild(inner_element);
			}
			image_container.style.removeProperty('max-width');
			image_element.classList.add(image_hidden_class);
			image_element.src = url;
		};

		const closeMenu = () => {
			if (is_open) {
				is_open = false;
				document.body.classList.remove(menu_open_class);
				for (const toggle_button of all_buttons) {
					toggle_button.setAttribute('aria-expanded', 'false');
				}
				opener_button.focus();
				opener_button = undefined;
			}
		};

		// prevent user's focus leaving the image-menu while it's open
		close_button.addEventListener('keydown', event => {
			if (is_open && event.key === 'Tab') {
				event.preventDefault();
			}
		});

		menu.addEventListener('click', event => {
			const target = event.target;
			if (target === menu || target === inner_element) {
				closeMenu();
			}
		});
		close_button.addEventListener('click', closeMenu);

		const attribute = 'data-open-image-menu';
		const all_buttons = [close_button];
		const buttons = document.querySelectorAll(`[${attribute}]`);
		for (let i = 0, len = buttons.length; i < len; i++) {
			const button = buttons[i];
			all_buttons.push(button);
			let image_url;
			button.addEventListener('click', () => {
				image_url ||= button.getAttribute(attribute);
				loadImageIntoMenu(image_url);
				document.body.classList.add(menu_open_class);
				for (const toggle_button of all_buttons) {
					toggle_button.setAttribute('aria-expanded', 'true');
				}
				close_button.focus();
				opener_button = button;
				is_open = true;
			});
		}
	};

	initializeNavigationButtons();
	initializeEvents();
	initializeImageGallery();
})();