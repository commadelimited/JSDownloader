$(function(){

    'use strict';

    var socket = io.connect();

    socket.on('fileDone', function (data) {
        console.log('filedone');
        if (!data.success) {
            $message.removeClass('muted').addClass('text-error');
        }
        $('#messages ul li').addClass('downloading').append('. . . ');
    });

    socket.on('done', function (msg) {
        console.log('done');
        var filename = 'jsd-' + msg.name + '.zip';
        var $message = $('<li />').addClass('complete text-info').html('<a href="/serve/' + filename + '" target="_blank">Download complete</a>');
        if ($('#messages .text-error').length) {
            $message.removeClass('text-info').addClass('text-error').html('Download error');
        }
        $('#messages ul').append($message);
    });

    // retrieve recently downloaded URLs and populate the page with them.
    $.getJSON('/recent').then(
        function(data, result){
            var $ul = $('#extras .callout'),
                $item;

            data.downloads.forEach(function(download){
                $item = $('<li />').html('<a href="' + download + '" target="_blank">' + download + '</a>');
                $ul.append($item);
            });
        }
    );

    $(document).on('click', '#extras a', function(e){
        var $a = $(this),
            $input = $('#source_url');
        $input.val($a.attr('href'));
        e.preventDefault();
    });

});