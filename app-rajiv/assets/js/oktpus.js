$(document).ready(function(){
	$(".burger-menu").on("click", function(e){
		e.preventDefault();
		$(".container-fluid").addClass("show-menu");
		$(".show-menu").animate("slow");
		$(".home-menu-page").show();
	});
	$("#login-page").on("click", function(e){
		e.preventDefault();
		$(".login-page").show();
		$(".home-menu-page").hide();
		$(".container-fluid").removeClass("show-menu");
	});
	$("#signup-page").on("click", function(e){
		e.preventDefault();
		$(".signup-page").show();
		$(".home-menu-page").hide();
		$(".container-fluid").removeClass("show-menu");
	});
	$("#forgot-password").on("click", function(e){
		e.preventDefault();
		$(".forgot-pass-page").show();
		$(".home-menu-page").hide();
		$(".container-fluid").removeClass("show-menu");
	});
	$(".close-button").on("click", function(e){
		e.preventDefault();
		$(".container-fluid").removeClass("show-menu");
		$(this).parent().hide();
	});

		
	$(".search-input").keyup(function(){
		var searchField = $(this).val();
		if (searchField.length > 0) {
			$(".search-icon").removeClass("micro-phone").addClass("clear-text");
		}
		else{
			$(".search-icon").addClass("micro-phone").removeClass("clear-text");
		}
	});

	$(".clear-text").on("click", function(e){
		$(this).removeClass("clear-text");
		$(this).addClass("micro-phone");
	});

	$("#learn-more").on("click", function(e){
		e.preventDefault();
		$(".learn-more-page").show();
	});

	$(".input-filter input").keyup(function(){
		var searchField = $(this).val();
		if (searchField.length > 0) {
			$(this).parent().addClass("clear-text");
			$(".input-filter label").hide();
		}
		else{
			$(this).parent().removeClass("clear-text");
			$(".input-filter label").show();
		}
	});
	$(".select-choice").on("click", function(e){
		$(this).parent().next().slideToggle();
	});
});