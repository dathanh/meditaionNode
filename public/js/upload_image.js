$(function() {
    $('#release').click(function () {
        var data = {}, html = [],
            image = $('#avatarInput').data('image'),
            input = $('#avatarInput').data('inputCrop'),
            images = input.getImageData();

        data.src = input.cropToImage(images[0]);
        data.width = '150';

        $('.result').html(input.$image(data));
        $('#thumbnail').val(data.src);
        $('#uploadImageModal').modal('hide');

    });
});