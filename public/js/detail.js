$(function() {
    $('.comment').click(function(e) {
        var target = $(this);
        var toid = target.data('tid');
        var commentid = target.data('cid');
        if ($('#toId').length > 0) {
            $('#toId').val(toid);
        } else {
            $('<input>').attr({
                type: 'hidden',
                id: 'toId',
                name: 'comment[tid]',
                value: toid
            }).appendTo('#commentForm');
        }
        if ($('#commentId').length > 0) {
            $('#commentId').val(commentid);
        } else {
            $('<input>').attr({
                type: 'hidden',
                id: 'commentId',
                name: 'comment[cid]',
                value: commentid
            }).appendTo('#commentForm');
        }
    })
})
