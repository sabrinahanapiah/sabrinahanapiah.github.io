$( document ).ready(function() {	
	$('.mobile-logo').on('click', function(){
		if($('.page-menu').hasClass('show')) {
			$('.page-menu').removeClass('show');
		} else {
			$('.page-menu').addClass('show');
		}
	}); 
});