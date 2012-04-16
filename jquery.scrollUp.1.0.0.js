/*
**    Preben Huybrechts
**    jQuery scrollUp
**    16th/April/2012
**    http://andersonferminiano.com/jqueryscrollUp/
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
        var mayLoadContent = $(target).scrollTop() < opts.heightOffset;
        if (mayLoadContent) {
            if (opts.beforeLoad != null) {
                opts.beforeLoad();
            }
            $(obj).children().attr('rel', 'loaded');
            $.ajax({
                type: opts.contentType,
                url: opts.contentPage,
                data: opts.contentData,
                success: function (data) {
                    var lastScrollHeight = $(obj).prop('scrollHeight');
                    $(obj).prepend(data);
                    $(obj).scrollTop($(obj).prop('scrollHeight') - lastScrollHeight);

                    var objectsRendered = $(obj).children('[rel!=loaded]');

                    if (opts.afterLoad != null) {
                        opts.afterLoad(objectsRendered);
                    }
                },
                dataType: 'html'
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
        'contentData': {},
        'beforeLoad': null,
        'afterLoad': null,
        'scrollTarget': null,
        'heightOffset': 0
    };
})(jQuery);