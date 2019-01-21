$( document ).ready(function() {
	$('.mobile-logo').on('click', function(){
		// add multiple classes here
		if($('.page-menu').hasClass('show')) {
			$('.page-menu').removeClass('show');
			$('body').removeClass('fixed');
		} else {
			$('.page-menu').addClass('show');
			$('body').addClass('fixed');
		}
	});
});
