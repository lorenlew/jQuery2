(function ($) {
    'use strict';

    var pathToCss = 'https://googledrive.com/host/0B9O_SRRli0dGQ3dFT1NmZENvUFU';
    var cssLink = '<link rel="stylesheet" href="' + pathToCss + '" type="text/css" />';

    (function () {
        jQuery('head').append(cssLink);
    })();

    function Loupe(element, options) {
        var self = this;
        var nativeWidth = null;
        var nativeHeight = null;
        var $element = $(element);

        function initSettings() {
            if (options.delay && typeof options.delay === 'number') {
                options.delay = {
                    show: options.delay,
                    hide: options.delay
                };
            }
            if (options.scale && typeof options.scale === 'number') {
                options.scale = options.scale;
            }
            self.options = $.extend({}, $.fn.loupeView.defaults, options);
        }

        function init() {
            var eventOn = 'mousemove';
            var eventOut = 'mouseleave';

            nativeWidth = 0;
            nativeHeight = 0;

            $element.wrap('<div class="under-loupe">');
            $element
                .parent('.under-loupe')
                .append('<div class="loupe">');
            $element
                .siblings('.loupe')
                .css({
                    background: 'url(\'' + $element.attr('src') + '\') no-repeat',
                    transform: 'scale(' + self.options.scale + ')'
                });

            $element
                .parent('.under-loupe')
                .on(eventOn, positionLoupe)
                .on(eventOut, positionLoupe);
        }

        function positionLoupe(e) {
            var container = $(e.currentTarget);
            var $image = container.children('img');
            var $loupe = container.children('.loupe');

            if (!nativeWidth && !nativeHeight) {
                var image = new Image();
                image.src = $image.attr('src');
                nativeWidth = image.width;
                nativeHeight = image.height;
            } else {
                var loupeViewOffset = container.offset();
                var loupeXCoordinate = e.pageX - loupeViewOffset.left;
                var loupeYCoordinate = e.pageY - loupeViewOffset.top;

                if (loupeXCoordinate < container.width() &&
                    loupeYCoordinate < container.height() &&
                    loupeXCoordinate > 0 &&
                    loupeYCoordinate > 0) {

                    $loupe.fadeIn(self.options.delay.show);
                } else {
                    $loupe.fadeOut(self.options.delay.show);
                }
                if ($loupe.is(':visible')) {
                    var innerPositionX =
                        Math.round(loupeXCoordinate / container.width() * nativeWidth - $loupe.width() / 2) * -1;
                    var innerPositionY =
                        Math.round(loupeYCoordinate / container.height() * nativeHeight - $loupe.height() / 2) * -1;

                    var backgroundPosition = innerPositionX + 'px ' + innerPositionY + 'px';
                    var offsetLeft = loupeXCoordinate - $loupe.width() / 2;
                    var offsetTop = loupeYCoordinate - $loupe.height() / 2;

                    $loupe
                        .css({
                            left: offsetLeft,
                            top: offsetTop,
                            backgroundPosition: backgroundPosition
                        });
                }
            }
        }

        initSettings();
        init();
    }

    $.fn.loupeView = function (option) {
        return this.each(function () {
            return new Loupe(this, option);
        });
    };

    $.fn.loupeView.defaults = {
        delay: 0,
        scale: 1
    };

})(jQuery);