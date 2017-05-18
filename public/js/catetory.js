$(function() {
    $('.del').click(function(e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);
        //console.log('click');
        $.ajax({
            type: "DELETE",
            url: "/admin/catetory/list?id=" + id,
            success: function(results) {
                if (results.success === 1) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            },
            error: function() {
                console.log('error');
            }
        })
    })
})
