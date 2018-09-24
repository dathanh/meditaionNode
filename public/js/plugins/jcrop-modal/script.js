$(function(){
    $('#avatarInput').change(function(){
        $(this).inputToCrop({
            cropSize: cropSize,
            boxHeight: 300,
            boxWidth: $('.process-photo').width()
        });
        $('#release').attr('disabled', false);
    });

	$("#avatarInputLink").click(function(e){
		e.preventDefault();
		$("#avatarInput").trigger('click');
		return false;
	});
});
