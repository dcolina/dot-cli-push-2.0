"use strict";
(function () {

	var plugins = {
		bootstrapModalDialog: $('.modal'),
		bootstrapTabs: $(".tabs-custom"),
		mfp: $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]'),
		mfpGallery: $('[data-lightbox^="gallery"]'),
		popover: $('[data-toggle="popover"]'),
		lightGallery: $("[data-lightgallery='group']"),
		lightGalleryItem: $("[data-lightgallery='item']"),
		lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
	};

	

	// Initialize scripts that require a finished document
	$(function () {

		/**
		 * @desc Booking form actions
		 */

		$('#book').click( function () {
            var goto = $("#destination").val();
            window.location.href = goto;
		});

		
		/**
		 * @desc Toggles Search Label on focus
		 */
		$('.site-search').on('focus blur', toggleFocus);

		function toggleFocus(e){
			console.log(e);
			if( e.type == 'focus' ){
				$('.search-label').addClass('label-active');
			}
			else{
				$('.search-label').removeClass("label-active")
			}
		}

		/**
		 * @desc Initialize the gallery with set of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} addClass - additional gallery class
		 */
		function initLightGallery(itemsToInit, addClass) {
			$(itemsToInit).lightGallery({
				thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
				selector: "[data-lightgallery='item']",
				autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
				pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
				addClass: addClass,
				mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
				loop: $(itemsToInit).attr("data-lg-loop") !== "false"
			});
		}

		/**
		 * @desc Initialize the gallery with dynamic addition of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} addClass - additional gallery class
		 */
		function initDynamicLightGallery(itemsToInit, addClass) {
			$(itemsToInit).on("click", function () {
				$(itemsToInit).lightGallery({
					thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
					selector: "[data-lightgallery='item']",
					autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
					pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
					addClass: addClass,
					mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
					loop: $(itemsToInit).attr("data-lg-loop") !== "false",
					dynamic: true,
					dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
				});
			});
		}

		/**
		 * @desc Initialize the gallery with one image
		 * @param {object} itemToInit - jQuery object
		 * @param {string} addClass - additional gallery class
		 */
		function initLightGalleryItem(itemToInit, addClass) {
			$(itemToInit).lightGallery({
				selector: "this",
				addClass: addClass,
				counter: false,
				youtubePlayerParams: {
					modestbranding: 1,
					showinfo: 0,
					rel: 0,
					controls: 0
				},
				vimeoPlayerParams: {
					byline: 0,
					portrait: 0
				}
			});
		}

		// Stop vioeo in bootstrapModalDialog
		if (plugins.bootstrapModalDialog.length) {
			for (var i = 0; i < plugins.bootstrapModalDialog.length; i++) {
				var modalItem = $(plugins.bootstrapModalDialog[i]);

				modalItem.on('hidden.bs.modal', $.proxy(function () {
					var activeModal = $(this),
							rdVideoInside = activeModal.find('video'),
							youTubeVideoInside = activeModal.find('iframe');

					if (rdVideoInside.length) {
						rdVideoInside[0].pause();
					}

					if (youTubeVideoInside.length) {
						var videoUrl = youTubeVideoInside.attr('src');

						youTubeVideoInside
						.attr('src', '')
						.attr('src', videoUrl);
					}
				}, modalItem))
			}
		}

		// Popovers
		if (plugins.popover.length) {
			if (window.innerWidth < 767) {
				plugins.popover.attr('data-placement', 'bottom');
				plugins.popover.popover();
			}
			else {
				plugins.popover.popover();
			}
		}


		// Bootstrap tabs
		if (plugins.bootstrapTabs.length) {
			for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
				var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

				//If have slick carousel inside tab - resize slick carousel on click
				if (bootstrapTabsItem.find('.slick-slider').length) {
					bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
						var $this = $(this);
						var setTimeOutTime = 300;

						setTimeout(function () {
							$this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
						}, setTimeOutTime);
					}, bootstrapTabsItem));
				}
			}
		}


		// Magnific Popup
		if (plugins.mfp.length || plugins.mfpGallery.length) {
			if (plugins.mfp.length) {
				for (var i = 0; i < plugins.mfp.length; i++) {
					var mfpItem = plugins.mfp[i];

					$(mfpItem).magnificPopup({
						type: mfpItem.getAttribute("data-lightbox")
					});
				}
			}
			if (plugins.mfpGallery.length) {
				for (var i = 0; i < plugins.mfpGallery.length; i++) {
					var mfpGalleryItem = $(plugins.mfpGallery[i]).find('[data-lightbox]');

					for (var c = 0; c < mfpGalleryItem.length; c++) {
						$(mfpGalleryItem).addClass("mfp-" + $(mfpGalleryItem).attr("data-lightbox"));
					}

					mfpGalleryItem.end()
					.magnificPopup({
						delegate: '[data-lightbox]',
						type: "image",
						gallery: {
							enabled: true
						}
					});
				}
			}
		}

		// UI To Top
		$().UItoTop({
			easingType: 'easeOutQuad',
			containerClass: 'ui-to-top mdi mdi-chevron-up'
		});

		
		// lightGallery
		if (plugins.lightGallery.length) {
			for (var i = 0; i < plugins.lightGallery.length; i++) {
				initLightGallery(plugins.lightGallery[i]);
			}
		}

		// lightGallery item
		if (plugins.lightGalleryItem.length) {
			// Filter carousel items
			var notCarouselItems = [];

			for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
				if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
						!$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
						!$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
					notCarouselItems.push(plugins.lightGalleryItem[z]);
				}
			}

			plugins.lightGalleryItem = notCarouselItems;

			for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
				initLightGalleryItem(plugins.lightGalleryItem[i]);
			}
		}

		// Dynamic lightGallery
		if (plugins.lightDynamicGalleryItem.length) {
			for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
				initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
			}
		}

	});
}());