$(document).ready(function() {
    $('body').on('click', '.published', function() {
        var status = $(this).hasClass('switch-on') ? 0 : 1,
            id = $(this).attr('data'),
            controller = $(this).attr('data-controller'),
            type = $(this).attr('data-type') ? $(this).attr('data-type') : 'status',
            that = this;
        $.ajax({
            url: '/admin/' + controller + '/change-' + type,
            dataType: 'json',
            type: 'POST',
            data: {
                id: id,
                status: status
            },
            global: false,
            success: function(response) {
                if (status == 0) {
                    $(that).removeClass('switch-on').addClass('switch-off')
                } else {
                    $(that).removeClass('switch-off').addClass('switch-on')
                }
                toastr['success'](response.message);
            },
            error: function(response) {
                toastr['error'](response.responseJSON.message);
            }
        });
    });

    $(  "input[type='checkbox']").on('change', function(){
        var favor = $('input[data="'+ $(this).attr('data') +'"]').prop( "checked" )? "1":"0";
        id = $(this).attr('data'),
        controller = $(this).attr('data-controller'),
        type ="favorite",
        that = this;
        $.ajax({
            url: '/admin/' + controller + '/change-' + type,
            dataType: 'json',
            type: 'POST',
            data: {
                id: id,
                favor: favor
            },
            global: false,
            success: function(response) {
                toastr['success'](response.message);

            },
            error: function(response) {
                toastr['error'](response.responseJSON.message);
            }
            });
            
        });    
    
$('.iCheck-helper').on('click', function(){
    var id = $(this).prev().attr('data');
    $(  'input[data="'+ id +'"]').change();        
    });
    
});


