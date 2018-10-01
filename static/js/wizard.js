$(document).ready(function () {
    var $nav_tabs_li_len = 100 / $('.wizard .nav-tabs li').length;
    $('.wizard .nav-tabs li').css("width", $nav_tabs_li_len.toString() + '%');

    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();

    //Wizard
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

        var $target = $(e.target);

        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function (e) {
        e.preventDefault();
        var $active = $('.wizard .nav-tabs li.active');
        isok = 1;
        $('.inputform', $(this).parent()).each(function(){
            if($(this).val().length == 0){
                $(this).addClass('errorBorder');
                isok = 0;
            }
            else{
                $(this).removeClass('errorBorder');
            }
        });
        if(isok == 1){
            $active.next().removeClass('disabled');
            nextTab($active);
        }

    });


    $(".question-next-step").click(function (e) {
        e.preventDefault();
        var $active = $('.wizard .nav-tabs li.active');
        isok = 1;
        $('.inputform', $(this).parent()).each(function(){
            $('.form-error-message p', $(this).parent()).hide();
            if($(this).val().length == 0) {
                $(this).addClass('errorBorder');
                $('.form-error-message p', $(this).parent()).eq(0).show();
                $(this).next().show();
                isok = 0;
            }else if($(this).val().toLowerCase().trim() == "no"){
                isok = 1
                $(this).removeClass('errorBorder');
                $(this).next().hide();
                if (isok == 1){
                    $active.next().removeClass('disabled');
                    nextTab($active);
                }
            }else if($(this).val().trim() == $(this).attr('prev_answer').trim()){
                if (!($(this).val().toLowerCase().trim() == "yes" || $(this).val().toLowerCase().trim() == "no")) {
                    $(this).addClass('errorBorder');
                    $('.form-error-message p', $(this).parent()).eq(1).show();
                    $(this).next().show();
                    isok = 0;
                }
            }
            else{
                $(this).removeClass('errorBorder');
                $(this).next().hide();
            }
        });
        if(isok == 1){
            $active.next().removeClass('disabled');
            nextTab($active);
        }

    });

    $(".prev-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);

    });

    $('#wizard-save').click(function(e){
        e.preventDefault();
        $('#createform').submit();
    });

    $('#question-save-save').click(function(e){
        e.preventDefault();
        $('#questionform').submit();
    });

    $('#question-valbox').bind('input propertychange',function(){
        var $active = $('.wizard .nav-tabs li.active');
        if ($(this).val().toLowerCase().trim() == 'yes'){
            $('.sub-question').show();
        }else if ($(this).val().toLowerCase().trim() == 'no') {
            $('.sub-question').find('textarea').val('')
            $active.next().removeClass('disabled');
            $('.sub-question').hide();
        }else{
            $active.next().removeClass('disabled');
            $('.sub-question').hide();
        }
    });


    if ($('#question-valbox').val().toLowerCase() == 'yes'){
        $('.sub-question').show();
    }
});

function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}