$(function(){

    'use strict';

    var socket = io.connect();

    socket.on('fileDone', function (data) {
        if (!data.success) {
            $message.removeClass('muted').addClass('text-error');
        }
        $('#messages ul li').append('...');
    });

    socket.on('done', function (msg) {
        var filePath = '/' + msg.dir + '.zip';
        var $message = $('<li />').addClass('complete text-info').html('<a href="' + filePath.replace('/.', '.') + '" target="_blank">Download complete</a>');
        if ($('#messages .text-error').length) {
            $message.removeClass('text-info').addClass('text-error').html('Download error');
        }
        $('#messages ul').append($message);
    });

    $(document).on('click', '#extras a', function(e){
        var $a = $(this),
            $input = $('#source_url');
        $input.val($a.attr('href'));
        e.preventDefault();
    });

});