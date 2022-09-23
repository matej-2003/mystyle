$(function() {
	$(".alert").prepend(
		$("<span>&times;</span>").addClass("alert_close").click(function() {
			this.parentElement.style['display'] = "none";
		})
	);
	$(".alert.autoclose").fadeOut(5000, "swing");
});