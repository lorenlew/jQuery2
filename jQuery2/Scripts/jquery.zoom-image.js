(function ($) {
    'use strict';

    var pathToCss = 'https://googledrive.com/host/0B9O_SRRli0dGQ3dFT1NmZENvUFU';
    var cssLink = '<link rel="stylesheet" href="' + pathToCss + '" type="text/css" />';

    (function () {
        jQuery('head').append(cssLink);
    })();

    var LoupeView = function (element, options) {
        var type = 'loupeView';
        this.init(type, element, options);
    };

    LoupeView.prototype = {
        constructor: LoupeView,
        init: function (type, element, options) {
            var eventOn = 'mousemove';
            var eventOut = 'mouseleave';

            this.type = type;
            this.$element = $(element);
            this.options = this.getOptions(options);
            this.nativeWidth = 0;
            this.nativeHeight = 0;

            this.$element.wrap('<div class="under-loupe">');
            this.$element.parent('.under-loupe').append('<div class="loupe">');
            this.$element.siblings('.loupe').css('background', 'url(\'' + this.$element.attr('src') + '\') no-repeat');

            this.$element.parent('.under-loupe').on(eventOn + '.' + this.type, $.proxy(this.check, this));
            this.$element.parent('.under-loupe').on(eventOut + '.' + this.type, $.proxy(this.check, this));
        },
        getOptions: function (options) {
            options = $.extend({}, $.fn[this.type].defaults, options);

            if (options.delay && typeof options.delay === 'number') {
                options.delay = {
                    show: options.delay,
                    hide: options.delay
                };
            }
            return options;
        },
        check: function (e) {
            var container = $(e.currentTarget);
            var self = container.children('img');
            var loupe = container.children('.loupe');

            if (!this.nativeWidth && !this.nativeHeight) {
                var image = new Image();
                image.src = self.attr('src');

                this.nativeWidth = image.width;
                this.nativeHeight = image.height;

            } else {

                var loupeViewOffset = container.offset();
                var loupeXCoordinate = e.pageX - loupeViewOffset.left;
                var loupeYCoordinate = e.pageY - loupeViewOffset.top;

                if (loupeXCoordinate < container.width() && loupeYCoordinate < container.height() && loupeXCoordinate > 0 && loupeYCoordinate > 0) {
                    loupe.fadeIn(this.options.delay.show);
                } else {
                    loupe.fadeOut(this.options.delay.show);
                }

                if (loupe.is(':visible')) {
                    var innerXPosition = Math.round(loupeXCoordinate / container.width() * this.nativeWidth - loupe.width() / 2) * -1;
                    var innerYposition = Math.round(loupeYCoordinate / container.height() * this.nativeHeight - loupe.height() / 2) * -1;
                    var backgroundPosition = innerXPosition + 'px ' + innerYposition + 'px';

                    var offsetLeft = loupeXCoordinate - loupe.width() / 2;
                    var offsetTop = loupeYCoordinate - loupe.height() / 2;

                    loupe.css({ left: offsetLeft, top: offsetTop, backgroundPosition: backgroundPosition });
                }
            }
        }
    };

    $.fn.loupeView = function (option) {
        return this.each(function () {
            var loupItem = new LoupeView(this, option);
        });
    };

    $.fn.loupeView.constructor = LoupeView;

    $.fn.loupeView.defaults = {
        delay: 0
    };

})(jQuery);