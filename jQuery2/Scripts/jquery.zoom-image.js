(function ($)
{
    "use strict";

    var pathToCss = 'https://googledrive.com/host/0B9O_SRRli0dGQ3dFT1NmZENvUFU';
    var cssLink = '<link rel="stylesheet" href="' + pathToCss + '" type="text/css" />';

    (function ()
    {
        jQuery('head').append(cssLink);
    })();

    var LoupeView = function (element, options)
    {
        this.init('loupeView', element, options);
    };

    LoupeView.prototype = {
        constructor: LoupeView,
        init: function (type, element, options)
        {
            var event = 'mousemove', eventOut = 'mouseleave';

            this.type = type;
            this.$element = $(element);
            this.options = this.getOptions(options);
            this.nativeWidth = 0;
            this.nativeHeight = 0;

            this.$element.wrap('<div class="under-loupe">');
            this.$element.parent('.under-loupe').append('<div class="loupe">');
            this.$element.siblings(".loupe").css("background", "url('" + this.$element.attr("src") + "') no-repeat");

            this.$element.parent('.under-loupe').on(event + '.' + this.type, $.proxy(this.check, this));
            this.$element.parent('.under-loupe').on(eventOut + '.' + this.type, $.proxy(this.check, this));
        },
        getOptions: function (options)
        {
            options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data());

            if (options.delay && typeof options.delay === 'number') {
                options.delay = {
                    show: options.delay,
                    hide: options.delay
                };
            }

            return options;
        },
        check: function (e)
        {
            var container = $(e.currentTarget);
            var self = container.children('img');
            var loupe = container.children(".loupe");

            if (!this.nativeWidth && !this.nativeHeight) {
                var image = new Image();
                image.src = self.attr("src");

                this.nativeWidth = image.width;
                this.nativeHeight = image.height;

            } else {

                var loupeViewOffset = container.offset();
                var mx = e.pageX - loupeViewOffset.left;
                var my = e.pageY - loupeViewOffset.top;

                if (mx < container.width() && my < container.height() && mx > 0 && my > 0) {
                    loupe.fadeIn(100);
                } else {
                    loupe.fadeOut(100);
                }

                if (loupe.is(":visible")) {
                    var rx = Math.round(mx / container.width() * this.nativeWidth - loupe.width() / 2) * -1;
                    var ry = Math.round(my / container.height() * this.nativeHeight - loupe.height() / 2) * -1;
                    var bgp = rx + "px " + ry + "px";

                    var px = mx - loupe.width() / 2;
                    var py = my - loupe.height() / 2;

                    loupe.css({ left: px, top: py, backgroundPosition: bgp });
                }
            }
        }
    };

    $.fn.loupeView = function (option)
    {
        return this.each(function ()
        {
            var $this = $(this),
                data = $this.data('loupeView'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('tooltip', (data = new LoupeView(this, options)));
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.loupeView.Constructor = LoupeView;

    $.fn.loupeView.defaults = {
        delay: 0
    };

})(jQuery);