(() => {

	/**
	 * enables navigation button to scroll to their corresponding section on a click
	 */
	const initializeNavigationButtons = () => {
		const attribute = 'data-scroll-to';
		const buttons = document.querySelectorAll(`[${attribute}]`);
		for (let i = 0, len = buttons.length; i < len; i++) {
			const button = buttons[i];
			let target;
			let is_running;
			button.addEventListener('click', () => {
				if (is_running) return;
				is_running = true;
				if (!target) {
					const target_id = button.getAttribute(attribute);
					target ||= document.querySelector(`#${target_id}`);
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
				element.classList.add('events__list__event--over');
			}
		}
	};

	initializeNavigationButtons();
	initializeEvents();
})();