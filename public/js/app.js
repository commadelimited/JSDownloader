$(function(){

    $(document).on('click', '#links a', function(e){
        var $a = $(this),
            $input = $('#source_url');
        $input.val($a.attr('href'));
        e.preventDefault();
    });

});