$(function() {
    $('.del').click(function(e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);
        //console.log('click');
        $.ajax({
            type: "DELETE",
            url: "/admin/movie/list?id=" + id,
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
        });
    });
    $('#douban').blur(function() {
        var douban = $(this);
        var id = douban.val();
        console.log(id);
        if (id) {
            $.ajax({
                url: "https://api.douban.com/v2/movie/subject/"+id,
                cache:true,
                type:'get',
                dataType:'jsonp',
                crossDomain:true,
                jsonp:'callback',
                success: function(data) {
                    $('#inputTitle').val(data.title);
                    $('#inputDoctor').val(data.directors[0].name);
                    $('#inputCountry').val(data.countries[0]);
                    $('#inputLanguage').val(data.languages);
                    $('#inputPoster').val(data.images.large);
                    $('#inputFlash').val(data.schedule_url);
                    $('#inpuTyear').val(data.year);
                    $('#inputSummary').val(data.summary);
                },
                error: function() {
                    console.log('error');
                }
            });
        }
    })
})
