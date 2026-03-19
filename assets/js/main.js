/*
	Story by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);

		// Initialize view modals
		initViewModals();

		// Force hide modal on page load
		$('#viewModal').hide();

	});

	// Browser fixes.

	// IE: Flexbox min-height bug.
	if (browser.name == 'ie')
		(function () {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function () {

				var $x = $('.fullscreen');

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function () {

					if ($x.prop('scrollHeight') > $window.height())
						$x.css('height', 'auto');
					else
						$x.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		})();

	// Object fit workaround.
	if (!browser.canUse('object-fit'))
		(function () {

			$('.banner .image, .spotlight .image').each(function () {

				var $this = $(this),
					$img = $this.children('img'),
					positionClass = $this.parent().attr('class').match(/image-position-([a-z]+)/);

				// Set image.
				$this
					.css('background-image', 'url("' + $img.attr('src') + '")')
					.css('background-repeat', 'no-repeat')
					.css('background-size', 'cover');

				// Set position.
				switch (positionClass.length > 1 ? positionClass[1] : '') {

					case 'left':
						$this.css('background-position', 'left');
						break;

					case 'right':
						$this.css('background-position', 'right');
						break;

					default:
					case 'center':
						$this.css('background-position', 'center');
						break;

				}

				// Hide original.
				$img.css('opacity', '0');

			});

		})();

	// Smooth scroll.
	$('.smooth-scroll').scrolly();
	$('.smooth-scroll-middle').scrolly({ anchor: 'middle' });

	// Wrapper.
	$wrapper.children()
		.scrollex({
			top: '30vh',
			bottom: '30vh',
			initialize: function () {
				$(this).addClass('is-inactive');
			},
			terminate: function () {
				$(this).removeClass('is-inactive');
			},
			enter: function () {
				$(this).removeClass('is-inactive');
			},
			leave: function () {

				var $this = $(this);

				if ($this.hasClass('onscroll-bidirectional'))
					$this.addClass('is-inactive');

			}
		});

	// Items.
	$('.items')
		.scrollex({
			top: '30vh',
			bottom: '30vh',
			delay: 50,
			initialize: function () {
				$(this).addClass('is-inactive');
			},
			terminate: function () {
				$(this).removeClass('is-inactive');
			},
			enter: function () {
				$(this).removeClass('is-inactive');
			},
			leave: function () {

				var $this = $(this);

				if ($this.hasClass('onscroll-bidirectional'))
					$this.addClass('is-inactive');

			}
		})
		.children()
		.wrapInner('<div class="inner"></div>');

	// Gallery.
	$('.gallery')
		.wrapInner('<div class="inner"></div>')
		.prepend(browser.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
		.scrollex({
			top: '30vh',
			bottom: '30vh',
			delay: 50,
			initialize: function () {
				$(this).addClass('is-inactive');
			},
			terminate: function () {
				$(this).removeClass('is-inactive');
			},
			enter: function () {
				$(this).removeClass('is-inactive');
			},
			leave: function () {

				var $this = $(this);

				if ($this.hasClass('onscroll-bidirectional'))
					$this.addClass('is-inactive');

			}
		})
		.children('.inner')
		//.css('overflow', 'hidden')
		.css('overflow-y', browser.mobile ? 'visible' : 'hidden')
		.css('overflow-x', browser.mobile ? 'scroll' : 'hidden')
		.scrollLeft(0);

	// Style #1.
	// ...

	// Style #2.
	$('.gallery')
		.on('wheel', '.inner', function (event) {

			var $this = $(this),
				delta = (event.originalEvent.deltaX * 10);

			// Cap delta.
			if (delta > 0)
				delta = Math.min(25, delta);
			else if (delta < 0)
				delta = Math.max(-25, delta);

			// Scroll.
			$this.scrollLeft($this.scrollLeft() + delta);

		})
		.on('mouseenter', '.forward, .backward', function (event) {

			var $this = $(this),
				$inner = $this.siblings('.inner'),
				direction = ($this.hasClass('forward') ? 1 : -1);

			// Clear move interval.
			clearInterval(this._gallery_moveIntervalId);

			// Start interval.
			this._gallery_moveIntervalId = setInterval(function () {
				$inner.scrollLeft($inner.scrollLeft() + (5 * direction));
			}, 10);

		})
		.on('mouseleave', '.forward, .backward', function (event) {

			// Clear move interval.
			clearInterval(this._gallery_moveIntervalId);

		});

	// Lightbox.
	$('.gallery.lightbox')
		.on('click', 'a', function (event) {

			var $a = $(this),
				$gallery = $a.parents('.gallery'),
				$modal = $gallery.children('.modal'),
				$modalImg = $modal.find('img'),
				href = $a.attr('href');

			// Not an image? Bail.
			if (!href.match(/\.(jpg|gif|png|mp4)$/))
				return;

			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Locked? Bail.
			if ($modal[0]._locked)
				return;

			// Lock.
			$modal[0]._locked = true;

			// Set src.
			$modalImg.attr('src', href);

			// Set visible.
			$modal.addClass('visible');

			// Focus.
			$modal.focus();

			// Delay.
			setTimeout(function () {

				// Unlock.
				$modal[0]._locked = false;

			}, 600);

		})
		.on('click', '.modal', function (event) {

			var $modal = $(this),
				$modalImg = $modal.find('img');

			// Locked? Bail.
			if ($modal[0]._locked)
				return;

			// Already hidden? Bail.
			if (!$modal.hasClass('visible'))
				return;

			// Lock.
			$modal[0]._locked = true;

			// Clear visible, loaded.
			$modal
				.removeClass('loaded')

			// Delay.
			setTimeout(function () {

				$modal
					.removeClass('visible')

				setTimeout(function () {

					// Clear src.
					$modalImg.attr('src', '');

					// Unlock.
					$modal[0]._locked = false;

					// Focus.
					$body.focus();

				}, 475);

			}, 125);

		})
		.on('keypress', '.modal', function (event) {

			var $modal = $(this);

			// Escape? Hide modal.
			if (event.keyCode == 27)
				$modal.trigger('click');

		})
		.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
		.find('img')
		.on('load', function (event) {

			var $modalImg = $(this),
				$modal = $modalImg.parents('.modal');

			setTimeout(function () {

				// No longer visible? Bail.
				if (!$modal.hasClass('visible'))
					return;

				// Set loaded.
				$modal.addClass('loaded');

			}, 275);

		});

	// ============ VIEW MOMENT REFLECTIONS ============

	// My personal reflections for each moment
	const myReflections = {
		1: {
			title: 'ESL',
			description: "Gee, J. P. (1989). Literacy, discourse, and linguistics: Introduction. Journal of Education, 171(1), 5–17.",
			reflection: `My experience in ESL shows that literacy is more than just learning to read and write. It is about gaining access to a community and a way of participating within it. The literacy practice I was developing at the time was learning how to communicate in English while also understanding classroom norms and social interactions. It went beyond vocabulary and grammar. As Gee explains, “Discourses are ways of being in the world” (Gee, p.142). Gee's work helps explain why I initially felt excluded in the main classroom despite being physically present. I had not yet developed the language and social practices needed to fully participate. However, ESL provided a space where I could begin building that discourse, showing that literacy is deeply tied to identity, interaction, and belonging rather than just functional language skills.`,
		},
		2: {
			title: 'Split Systems',
			description: 'Vygotsky, L. S. (1978). Mind and society: The development of higher mental processes (M. Cole, V. John‑Steiner, S. Scribner, & E. Souberman, Eds.). Harvard University Press.',
			reflection: 'Learning English after first developing literacy in Chinese shows that literacy is more than just knowing words or grammar. It is about learning to think, communicate, and participate in a new cultural and social environment. The literacy practice I was developing at the time involved figuring out how to connect what I knew in Chinese with English, using mental translations, gestures, and other strategies to make sense of the language. As Vygotsky explains, “Many of them employ auxiliary gestures as a means of uniting the written and spoken symbol; others employ drawings that depict the appropriate objects” (Vygotsky, p.30). This helps explain why I initially struggled to fully use English in school settings. Over time, I began understanding English in a way that went beyond mechanics, showing that literacy is closely tied to cognition, social participation, and identity.'
		},
		3: {
			title: 'Fitness	',
			description: 'Jewitt, C. (2008). Multimodality and literacy in school classrooms. Review of Research in Education, 32(1), 241–267.',
			reflection: `Meeting someone who invited me to the gym changed not just my routine, but how I participate in a community. Showing up consistently, learning gym culture, and building a community through working out was about more than exercise; it was about learning a new set of practices, norms, and ways of being with others. As Jewitt explains in her work on literacies, “new modes are created, and existing modes are transformed” (Jewitt, p.247). This highlights how the ways we make meaning change depending on the social context and practice. This ties closely with my experience with joining the gym. It meant adapting to new routines and communication styles, and in doing so I became part of that community. If I hadn’t had that experience, I probably wouldn’t be the person I am today, showing that participation and identity are shaped through specific and meaningful practices rather than just solitary skills.`,
		},
		4: {
			title: 'Robotics',
			description: 'Bakhtin, M. M. (1981). The dialogic imagination: Four essays (M. Holquist & C. Emerson, Eds.). University of Texas Press.',
			reflection: 'My experience in that middle school robotics class shows that a single opportunity can shape not just what you like to do, but how you percieve yourself and the world. Before robotics, I had never really spent time with code. Once I started learning it, I became the coder on our team and slowly grew into that role. The literacy practice I was building wasn’t just typing words on a screen; it was learning a way of thinking and participating in a technical community. As Bakhtin explains, “Language, for the individual consciousness, lies on the borderline between oneself and the other. The word in language is half someone else’s… prior to this moment… it exists in other people’s mouths, in other people’s contexts” (Bakhtin, p.77). This idea helps explain why coding culture felt so foreign at first. I was appropriating not just terms, but contexts and ways of interacting that belonged to others. Over time, as I made that “language” my own and learned the norms and habits of programming, it became part of who I am.'
		},
		5: {
			title: 'Different',
			reflection: 'My experience attending a middle school where I was one of the only Asian students shows that literacy is about more than just reading and writing; it’s about learning to participate in a community. At the time, the literacy practice I was developing involved picking up on how my peers interacted, the words they used, their gestures, and their overall demeanor. I spent a lot of effort observing and imitating these behaviors so I could fit in and communicate more effectively. This experience taught me that literacy includes understanding the unspoken rules of social interaction and how identity is shaped through participation. It wasn’t just about speaking English correctly; it was about learning how to belong and navigate a new social environment.'
		},
		6: {
			title: 'My Multimodal Literacy Autobiography',
			description: 'Vygotsky, L. S. (1978). Mind and society: The development of higher mental processes (M. Cole, V. John‑Steiner, S. Scribner, & E. Souberman, Eds.). Harvard University Press. (Original work written 1930)',
			reflection: 'When I’m creating this website, I’m defining what literacy means to me and how I want to communicate my ideas, values, and experiences. The layout, the buttons, the colors, and even what I choose to include or leave out all reflect how I make meaning visually and textually. The process isn’t just technical; it’s shaped by tools, interactions, and support I’ve had over time. Vygotsky’s idea of the Zone of Proximal Development helps explain this, “the distance between the actual developmental level as determined by independent problem solving and the level of potential development as determined through problem solving under adult guidance or in collaboration with more capable peers” (Vygotsky, p.86). Designing this site shows how my current skills grew out of social interaction, collaboration, and guidance I received and how I’m now working independently within that zone to create something meaningful. In this way, my website becomes a reflection of both who I am and who I’ve become through social, cultural, and participation.'
		}
	};

	let currentViewMoment = null;

	function initViewModals() {
		// Create modal structure
		createViewModal();

		// Bind events
		bindViewModalEvents();
	}

	function createViewModal() {
		// Check if modal already exists
		if ($('#viewModal').length) return;

		const modalHTML = `
        <div id="viewModal" class="writing-modal">
            <div class="writing-modal-content">
                <span class="close-modal">&times;</span>
                <h2 id="modalTitle"></h2>
                <div class="moment-meta" id="momentDate"></div>
                <p id="modalDescription" class="moment-description"></p>
                <div class="reflection-content" id="reflectionContent">
                    <!-- Reflection text will go here -->
                </div>
                <div class="modal-buttons">
                    <button class="close-btn">Close</button>
                </div>
            </div>
        </div>
    `;

		$('body').append(modalHTML);
	}

	function bindViewModalEvents() {
		// Open modal when view button is clicked
		$(document).on('click', '.view-moment', function (e) {
			e.preventDefault();
			currentViewMoment = $(this).data('moment');
			const reflection = myReflections[currentViewMoment];

			// Set modal content
			$('#modalTitle').text(reflection.title);
			$('#modalDescription').text(reflection.description);
			$('#momentDate').text(reflection.date);

			// Format reflection text with paragraphs
			const formattedReflection = reflection.reflection
				.split('\n\n')
				.map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
				.join('');

			$('#reflectionContent').html(formattedReflection);

			// Show modal
			$('#viewModal').fadeIn(300);
		});

		// Close modal
		$(document).on('click', '.close-modal, .close-btn', function () {
			$('#viewModal').fadeOut(300);
		});

		// Click outside to close
		$(window).on('click', function (e) {
			if ($(e.target).hasClass('writing-modal')) {
				$('#viewModal').fadeOut(300);
			}
		});

		// Escape key to close
		$(document).on('keydown', function (e) {
			if (e.keyCode === 27) {
				$('#viewModal').fadeOut(300);
			}
		});
	}

	function saveEntry(content) {
		// Save to localStorage
		localStorage.setItem('moment_' + currentMoment, content);
		localStorage.setItem('moment_' + currentMoment + '_time', Date.now().toString());

		// Show notification
		$('#saveNotification').fadeIn(300).delay(2000).fadeOut(300);

		// Update last saved time
		const date = new Date();
		$('#lastSaved').text('Last saved: ' + date.toLocaleDateString() + ' at ' + date.toLocaleTimeString());

		// Add saved badge to button if not exists
		const $button = $('[data-moment="' + currentMoment + '"]');
		if (!$button.find('.saved-badge').length && content.trim() !== '') {
			$button.append('<span class="saved-badge">Saved</span>');
		}
	}

	function loadSavedBadges() {
		for (let i = 1; i <= 6; i++) {
			const saved = localStorage.getItem('moment_' + i);
			if (saved && saved.trim() !== '') {
				const $button = $('[data-moment="' + i + '"]');
				if (!$button.find('.saved-badge').length) {
					$button.append('<span class="saved-badge">Saved</span>');
				}
			}
		}
	}

	// Make sure to also add the CSS for the writing modals
	// You'll need to add this CSS to your main.css file

})(jQuery);