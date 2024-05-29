(() => {

	/**
	 * enables navigation button to scroll to their corresponding section on a click
	 */
	const initializeNavigationButtons = () => {
		const scroll_to_attribute = 'data-scroll-to';
		const scroll_to_buttons = document.querySelectorAll(`[${scroll_to_attribute}]`);
		const offset = 120;
		for (let i = 0, len = scroll_to_buttons.length; i < len; i++) {
			const button = scroll_to_buttons[i];
			let target;
			button.addEventListener('click', () => {
				button.disabled = true;
				if (!target) {
					const target_id = button.getAttribute(scroll_to_attribute);
					target ||= document.querySelector(`#${target_id}`);
				}
				setTimeout(() => {
					button.disabled = false;
					const element_y = Math.round(target.getBoundingClientRect().top);
					const scroll_y = Math.max(0, element_y - offset + window.scrollY);
					if ('scrollBehavior' in document.body.style) {
						scrollTo({
							top: scroll_y,
							behavior: 'smooth'
						});
					}
					else {
						scrollTo(0, scroll_y);
					}
					
					// force focus on the section that comes into view
					const onBlur = () => {
						target.removeEventListener('blur', onBlur);
						target.removeAttribute('tabindex');
					};
					target.addEventListener('blur', onBlur);
					target.tabIndex = 0;
					target.focus();
				}, 90);
			});
		}
	};

	initializeNavigationButtons();
})();