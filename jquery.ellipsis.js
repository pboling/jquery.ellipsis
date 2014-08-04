/**
 * Inspired by http://stackoverflow.com/questions/536814/insert-ellipsis-into-html-tag-if-content-too-wide
 * Inspiration for options design from sakura-sky/jquery-ellipsis
 */
(function($) {
  $.fn.ellipsis = function(options) {
    options = $.extend({
      ellipsis: '&hellip;',
      multilineClass: 'multiline',
      tooltipClass: 'has_tooltip',
      tooltipSpanClass: 'ellipsis_tooltip',
      trimFunction: $.fn.ellipsis.trimLastWord,
      heightFunction:$.fn.ellipsis.height,
      widthFunction:$.fn.ellipsis.width
    }, options);

    return this.each(function()
    {
      var el = $(this),
        text,
        multiline,
        hasTooltip,
        needsTooltip,
        completeText,
        t,
        func;
      if(el.css("overflow") === "hidden")
      {
        text = el.html();
        multiline = el.hasClass(options.multilineClass);
        hasTooltip = el.hasClass(options.tooltipClass);
        needsTooltip = false;
        completeText = el.text();
        // Operate on invisible clone
        t = $(this.cloneNode(true))
          .hide()
          .css('position', 'absolute')
          .css('overflow', 'visible')
          .css('max-height','none')
          .width(multiline ? el.width() : 'auto')
          .height(multiline ? 'auto' : el.height());

        el.after(t);

        func = multiline ? options.heightFunction : options.widthFunction;
        //trim, then trim trailing spaces and dashes
        text = $.trim(text).replace(/[\s-]+$/,'');
        while (text.length > 0 && func(t, el))
        {
          needsTooltip = true;
          // If there are no spaces in the text then we handle that case differently
          if (text.match(/[\W]/)) {
            text = options.trimFunction(text.substr(0, text.length - 1));
          // No spaces in the string at all, so can only reduce based on size of container
          } else {
            text = text.substr(0, text.length - 1);
          }
          // trim, then trim trailing spaces and dashes
          text = $.trim(text).replace(/[\s-]+$/,'');
          //replace with slimmer text for next round
          t.html(text + options.ellipsis);
        }

        if(hasTooltip && needsTooltip){
          el.css("overflow","visible");
          t.append("<span class='"+options.tooltipSpanClass+"'>"+completeText+"</span>");
        }

        el.html(t.html());
        t.remove();
      }
    });
  };
  $.fn.ellipsis.height = function (t, el) { return t.height() > el.height() || t.height() > el.parents().first().height(); };
  $.fn.ellipsis.width = function (t, el) { return t.width() > el.width() || t.width() > el.parents().first().width(); };
  $.fn.ellipsis.trimLastWord = function (str) {
    // split on non-Word chars
    var lastWord = str.split(/[\W-]/).pop(),
      n = str.lastIndexOf(lastWord);
    // shed the last word
    if (n >= 0 && n + lastWord.length >= str.length) {
        str = str.substring(0, n);
    }
    // check for a br tag on the end, and remove it if there is one.
    n = str.indexOf('<br>', str.length - 4);
    if (n >= 0) {
      str = str.substring(0, n);
    }
    // check for a '.' at the end.  Remove it if found.
    if (str.charAt(str.length - 1) === '.') {
      str = str.substring(0, str.length - 1);
    }
    return str;
  };
})(jQuery);
