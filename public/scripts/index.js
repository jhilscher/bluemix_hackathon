// index.js


var loadComments = function() {
    
        $.ajax({
            type : 'GET', 
            url  : 'api/getComments'
        })
        .done(function(data) {
            $('#commentsContainer').html(data);
            console.info('success loading comments'); 
        });

    
};

var deleteComment = function(id) {

        console.info("deleteComment %s", id);

        var data = {
            'id'  : id
        };

        $.ajax({
            type  : 'DELETE', 
            url   : 'api/deleteComment' + '?' + $.param({"id": id}), 
        })
        .done(function(data) {

            console.info(data); 

            loadComments();
        }).fail(function(err) {
            console.error(err);
        });

};

var analyzeComment = function(id) {

        console.info("anaylizeComment %s", id);

        var data = {
            'id'  : id
        };

        $.ajax({
            type  : 'POST', 
            url   : 'api/analyzeComment',
            data  : data,
            encode : true 
        })
        .done(function(data) {
            var ele = $('#keywords-' + id);
            ele.show();

            var text = data.keywords.map(function(elem){
                    return elem.text;
                }).join(", ");
            ele.html(text);

            console.info(data); 

        }).fail(function(err) {
            console.error(err);
        });

};



$(document).ready(function() {

    console.info("jquery initializied");
 

    var loading = $('#loading').hide();
    $(document)
    .ajaxStart(function () {
        loading.show();
    })
    .ajaxStop(function () {
        loading.hide();
    });


    // Comment abschicken
    $('#commentform').submit(function(event) {

        console.info("commentform submitted");

        var data = {
            'commenttext'  : $('#commentform textarea[name=commenttext]').val(),
            'username' : $('#commentform input[name=username]').val(),
        };

        $.ajax({
            type        : 'POST', 
            url         : 'api/insertcomment', 
            data        : data,
            encode      : true
        })
        .done(function(data) {

            console.info(data); 

            $('#commentform').trigger("reset");;

            loadComments();
        }).fail(function(err) {
            console.error(err);
        });

        event.preventDefault();
    });


    loadComments();
});