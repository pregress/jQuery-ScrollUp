/*
 **    Preben Huybrechts
 **    jQuery scrollUp
 **    16 April 2012
 **    You may use this script for free, but keep my credits.
 **    Thank you.
 */
(function ($) {
    $.fn.scrollUp = function (options) {
        var opts = $.extend($.fn.scrollUp.defaults, options);
        var target = opts.scrollTarget;
        if (target == null) {
            target = obj;
        }
        opts.scrollTarget = target;
        return this.each(function () {
            $.fn.scrollUp.init($(this), opts);
        });
    };
    $.fn.stopScrollUp = function () {
        return this.each(function () {
            $(this).attr('scrollUp', 'disabled');
        });
    };
    $.fn.scrollUp.loadContent = function (obj, opts) {
        var target = opts.scrollTarget;
        var mayLoadContent = $(obj).attr("scrollUp") == "enabled" && $(target).scrollTop() < opts.heightOffset && !opts.isLoading;
        if (mayLoadContent) {
            if (opts.beforeLoad != null) {
                opts.beforeLoad();
            }
            $(obj).children().attr('rel', 'loaded');
            opts.isLoading = true;
            $.ajax({
                type: opts.contentType,
                url: opts.contentPage,
                data: opts.contentData,
                success: function (data) {
                    var lastScrollHeight = $(obj).prop('scrollHeight');
                    // data prepend event delegate
                    if (opts.setPrepend != null) {
                        opts.setPrepend(data, $(obj));
                    }else{
                        $(obj).prepend(data);
                    }
                    // position move effect
                    if (opts.animateScroll) {
                        $(target).animate({'scrollTop' : $(obj).prop('scrollHeight') - lastScrollHeight },1000);
                    } else {
                        $(target).scrollTop($(obj).prop('scrollHeight') - lastScrollHeight);
                    }
                    var objectsRendered = $(obj).children('[rel!=loaded]'); // get rendered items
                    // event delegate after load
                    if (opts.afterLoad != null) {
                        opts.afterLoad(objectsRendered, data);
                    }
                    var loadingTimeoutID = setTimeout(function(){
                        opts.isLoading = false;
                        clearTimeout(loadingTimeoutID);
                    },1000);
                },
                dataType: opts.dataType
            });
        }
    };
    $.fn.scrollUp.init = function (obj, opts) {
        var target = opts.scrollTarget;
        $(obj).attr('scrollUp', 'enabled');
        $(target).scroll(function (event) {
            if ($(obj).attr('scrollUp') == 'enabled') {
                $.fn.scrollUp.loadContent(obj, opts);
            }
            else {
                event.stopPropagation();
            }
        });
        $.fn.scrollUp.loadContent(obj, opts);
    };
    $.fn.scrollUp.defaults = {
        'contentPage': null,
        'contentType': 'GET',
        'dataType':'html',
        'contentData': {},
        'beforeLoad': null,
        'afterLoad': null,
        'setPrepend':null,
        'scrollTarget': null,
        'heightOffset': 0,
        'isLoading': false,
        'animateScroll': true
    };
})(jQuery);