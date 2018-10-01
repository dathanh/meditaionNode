$(document).ready(function() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    generateSelectBox();

    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": "7000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    var message = $('#flash-message').val(),
        typeMessage = $('#flash-message-type').val();
    if (message && typeMessage) {
        toastr[typeMessage](message);
    }

    $('body').on('click', '.btn-save', function() {
        $(this).attr('disabled', true);
        $(this).parent().parent().parent().submit();
    });

    $('body').on('click', 'button[type="reset"]', function() {
        $('.i-checks').iCheck('uncheck');
        $('.chosen-select').chosen('destroy');
        $('button[type="reset"]').parents('form').find('.has-error .error').hide();
        $('button[type="reset"]').parents('form').find('.has-error').removeClass('has-error');
        generateSelectBox();
    });

});

function generateSelectBox() {
    var config = {
        '.chosen-select'           : {},
        '.chosen-select-deselect'  : {allow_single_deselect:true},
        '.chosen-select-no-single' : {disable_search_threshold:10},
        '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
        '.chosen-select-width'     : {width:"95%"}
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }
}
