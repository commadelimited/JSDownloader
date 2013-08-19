$(function(){

    'use strict';

    var socket = io.connect('http://0.0.0.0');

    socket.on('fileDone', function (data) {
        var $message = $('<li />').html(data.name).addClass('muted');
        if (!data.success) {
            $message.removeClass('muted').addClass('text-error');
        }
        $('#messages ul').append($message);
    });

    socket.on('done', function (data) {
        var $message = $('<h3 />').addClass('text-info').html('Download complete');
        if ($('#messages .text-error').length) {
            $message.removeClass('text-info').addClass('text-error').html('Download error');
        }
        $('#messages').append($message);
    });

    $(document).on('click', '#recent a', function(e){
        var $a = $(this),
            $input = $('#source_url');
        $input.val($a.attr('href'));
        e.preventDefault();
    });

});