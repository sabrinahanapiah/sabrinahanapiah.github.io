$( document ).ready(function() {
	$('.mobile-logo').on('click', function(){
		// add multiple classes here
		if($('.page-menu').hasClass('show')) {
			$('.page-menu').removeClass('show');
		} else {
			$('.page-menu').addClass('show');
		}
	});
});
