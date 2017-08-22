;superFiltro = ((typeof superFiltro !== 'undefined') ? superFiltro : {});
(function ($) {

    $.fn.suberFiltro = function (settings) {

        var o = {
            'attrKey': 'data-sf',

            'class-visible': 'sf-visible',
            'class-hidden': 'sf-hidden',
            'trigger-visible': 'sf-visible',
            'trigger-hidden': 'sf-hidden',

            'class-disabled': 'sf-disabled',
            'class-enabled': 'sf-enabled',
            'trigger-disabled': 'sf-disabled',
            'trigger-enabled': 'sf-enabled'
        };
        if (settings) $.extend(o, settings);

        return function () {
            return $(this).each(function () {

                var $this = $(this);
                var key = $this.attr(o['attrKey']);
                var context = (($this.attr('data-sf-context'))? $($this.parents($this.attr('data-sf-context'))[0]): $('body'));
                
                var valeu = $([
                    ':input[data-sf="' + key + '"]:not(:radio):not(:checkbox):not(:disabled):not(button)',
                    ':input:radio[data-sf="' + key + '"]:checked:not(:disabled)',
                    ':input:checkbox[data-sf="' + key + '"]:checked:not(:disabled)'
                ].join(', '), context).serializeArray();

                var process = function (c, t, f) {
                    if (!c) return;
                    c = JSON.parse(c);
                    if (!c[key]) return;
                    var show = true;
                    if (!!valeu) $.each(valeu, function (k, v) {
                        return show = (!v.value || ((typeof c[key][v.name]) === 'object' && !!(c[key][v.name][v.value])) || (c[key][v.name] === v.value));
                    });
                    if (show) t.call(); else f.call();
                };

                var target = $('[data-sf-show]');
                target.each(function (i, e) {
                    process($(e).attr('data-sf-show'), function () {
                        $(e).removeClass(o['class-hidden']).addClass(o['class-visible']).triggerHandler(o['trigger-visible']);
                    }, function () {
                        $(e).removeClass(o['class-visible']).addClass(o['class-hidden']).triggerHandler(o['trigger-hidden']);
                    });
                });

                target = $('[data-sf-hide]');
                target.each(function (i, e) {
                    process($(e).attr('data-sf-hide'), function () {
                        $(e).removeClass(o['class-visible']).addClass(o['class-hidden']).triggerHandler(o['trigger-hidden']);
                    }, function () {
                        $(e).removeClass(o['class-hidden']).addClass(o['class-visible']).triggerHandler(o['trigger-visible']);
                    });
                });

                target = $('[data-sf-disabled]');
                target.each(function (i, e) {
                    process($(e).attr('data-sf-disabled'), function () {
                        $(e).attr('disabled', true).removeClass(o['class-enabled']).addClass(o['class-disabled']).triggerHandler(o['trigger-disabled']);
                    }, function () {
                        $(e).attr('disabled', false).removeClass(o['class-disabled']).addClass(o['class-enabled']).triggerHandler(o['trigger-enabled']);
                    });
                });

                target = $('[data-sf-enabled]');
                target.each(function (i, e) {
                    process($(e).attr('data-sf-enabled'), function () {
                        $(e).attr('disabled', false).removeClass(o['class-disabled']).addClass(o['class-enabled']).triggerHandler(o['trigger-enabled']);
                    }, function () {
                        $(e).attr('disabled', true).removeClass(o['class-enabled']).addClass(o['class-disabled']).triggerHandler(o['trigger-disabled']);
                    });
                });

            });
        }
    };

    superFiltro = $.superFiltro = $.fn.suberFiltro;
    $(function () {
        $('body')
            .on('click', '[data-sf-click]', superFiltro({'attrKey': 'data-sf-click'}))
            .on('change', '[data-sf-change]', superFiltro({'attrKey': 'data-sf-change'}));
    });

})(jQuery);
