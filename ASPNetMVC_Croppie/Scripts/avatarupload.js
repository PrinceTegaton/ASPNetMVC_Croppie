//Author: Prince Tegaton
//github.com/princetegaton

$.fn.disable = function () {
    this.attr('disabled', 'disabled');
};

$.fn.enable = function () {
    this.removeAttr('disabled');
};

$(function () {
    $('#btn_startavatarupload').click(function () {
        $('#avatar_filebrowser').click();
    });

    var $uploadCrop;

    $('#avatar_filebrowser').change(function () {
        readAvatar(this);
        $('.avatar-pre-select').hide();
        $uploadCrop = $('#cropper').croppie({
            viewport: {
                width: 300,
                height: 300,
                type: 'square',
            },
            boundary: {
                width: 600,
                height: 400
            },
            enforceBoundary: false,
            enableExif: true
        });
    });

    function readAvatar(input) {
        //if ($(this).files && $(this).files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $uploadCrop.croppie('bind', {
                url: e.target.result
            }).then(function () {
                //console.log('jQuery bind complete');
            });
        }

        reader.readAsDataURL(input.files[0]);
        $('#controlbar').fadeIn();
        //}
        //else {
        //    alert('Seems like someone is using an old browser!');
        //}
    }

    $('[data-rotate-avatar]').click(function () {

    });

    $('#btn_previewavatar').click(function (ev) {
        $uploadCrop.croppie('result', {
            type: 'rawcanvas',
            // size: { width: 300, height: 300 },
            format: 'jpeg'
        }).then(function (canvas) {
            $('#avatarsample').attr('src', canvas.toDataURL());
            $('#btn_saveavatar').fadeIn();
        });
    });

    $('#btn_saveavatar').click(function () {
        var btn = $(this);
        preventRefresh = true;

        $.ajax({
            url: '/Home/UploadCroppedAvatar',
            dataType: 'json', type: 'post',
            data: { 'UserID': $('#UserID').val(), 'ImageData': $('#avatarsample').attr('src') },
            beforeSend: function () { btn.disable() },
            complete: function () { btn.enable() },
            success: function (result) {
                if (result.status == 200) {
                    alert(result.message);

                    preventRefresh = false;
                    $('#btn_saveavatar').disable();
                    $('.avatar-pre-select').fadeIn();
                    $('.croppie-container').hide();
                    $('#controlbar').fadeOut();
                } else {
                    alert('Not going well\n' + result.message);
                }
            },
            error: function () {
                alert('Error\n' + errorMsg);
            }
        });
    });
});