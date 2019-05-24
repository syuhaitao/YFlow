; (function($, window, document,undefined) {
  $.fn.YFlow = function(options){
    var dc = new DiagramController(this,options);
    return dc.init();
  }
  })(jQuery, window, document)
