/**
 * @author Michael Hemingway
 * Navigation
 *
 * 
 */
// (function ($) {
// 	'use strict'

// 	const overlayNav = $('.overlay-nav')
// 	const	overlayContent = $('.overlay-content')
// 	const toggleNav = $('.nav-trigger')
// 	const navigation = $('.primary-nav')
	 
// 	toggleNav.on('click', function(){
// 		if(!toggleNav.hasClass('close-nav')) {
// 			// navigation is not visible yet
// 		} else {
// 			// animate cross icon into a menu icon
// 			toggleNav.removeClass('close-nav');
// 			// animate the content layer
// 			overlayContent.children('span').animate({
// 				translateZ: 0,
// 				scaleX: 1,
// 				scaleY: 1,
// 			}, 500, 'easeInCubic', function(){
// 				//hide navigation
// 				navigation.removeClass('fade-in');
// 				//scale to zero the navigation layer
// 				overlayNav.children('span').animate({
// 					translateZ: 0,
// 					scaleX: 0,
// 					scaleY: 0,
// 				}, 0);
// 				//reduce to opacity of the content layer with the is-hidden class
// 				overlayContent.addClass('is-hidden').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
// 					//wait for the end of the transition and scale to zero the content layer
// 					overlayContent.children('span').animate({
// 						translateZ: 0,
// 						scaleX: 0,
// 						scaleY: 0,
// 					}, 0, function(){overlayContent.removeClass('is-hidden')});
	 
// 				});
// 			});
// 		}
// 	});


// }(jQuery)); 
