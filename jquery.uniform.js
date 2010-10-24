/*

Uniform v2.0 PRE
Copyright © 2009 Josh Pyles / Pixelmatrix Design LLC
http://pixelmatrixdesign.com

Requires jQuery 1.4 or newer

Much thanks to Thomas Reynolds and Buck Wilson for their help and advice on this

Disabling text selection is made possible by Mathias Bynens <http://mathiasbynens.be/>
and his noSelect plugin. <http://github.com/mathiasbynens/noSelect-jQuery-Plugin>

Also, thanks to David Kaneda and Eugene Bond for their contributions to the plugin

License:
MIT License - http://www.opensource.org/licenses/mit-license.php

Enjoy!

*/

(function($){
  //
  // Defaults
  //
  $.uniform = {
    defaults: {
      selectClass: 'selector',
      radioClass: 'radio',
      checkboxClass: 'checker',
      fileClass: 'uploader',
      filenameClass: 'filename',
      fileBtnClass: 'action',
      fileDefaultText: 'No file selected',
      fileBtnText: 'Choose File',
      checkedClass: 'checked',
      focusClass: 'focus',
      disabledClass: 'disabled',
      buttonClass: 'button',
      activeClass: 'active',
      hoverClass: 'hover',
      useID: true,
      idPrefix: 'uniform',
      resetSelector: false,
      autoHide: true,
      autoWidth: true
    }
  };
  //
  //Set up functions
  //
  $.uniform.init = function(o, $el){
    // Check if previously uniformed
    var d = $el.data("uniform");
    if(d !== undefined && d !== null){
      d.opts = $.extend(d.opts, o);
    }else{
      //start at the beginning
      //set up data object to start storing things
      $el.data("uniform", {});
      d = $el.data("uniform");
      d.wrapped = false;
      d.opts = o;
      d.type = $.uniform.elType($el);
    }
    $.uniform.run($el);
  };
  
  $.uniform.run = function($el){
    var d = $el.data("uniform");
    switch(d.type){
      case "input": $.uniform.doInput($el); break;
      case "textarea": $.uniform.doTextarea($el); break;
      case "select": $.uniform.doSelect($el); break;
      case "radio": $.uniform.doRadio($el); break;
      case "file": $.uniform.doFile($el); break;
      case "checkbox": $.uniform.doCheckbox($el); break;
      case "button": $.uniform.doButton($el); break;
    }
  }
  $.uniform.set = function(key, value, $el){
    if($el.data("uniform")){
      var d = $el.data("uniform");
      d.opts[key] = value;
      $.uniform.run($el);
    }
  };
  
  $.uniform.fetch = function(key, $el){
    if($el.data("uniform")){
      var d = $el.data("uniform");
      return d.opts[key];
    }
  };
    
  $.uniform.elType = function($el){
    var tagName = $el[0].tagName;
    if(tagName === "SELECT"){
      if($el.attr("multiple") !== true){
        if($el.attr("size") === undefined || $el.attr("size") <= 1){
          return "select";
        }else{
          return "invalid";
        }
      }else{
        return "invalid";
      }
    }else if(tagName === "INPUT"){
      var type = $el[0].type;
      if(type === "checkbox"){
        return "checkbox";
      }else if(type === "radio"){
        return "radio";
      }else if(type === "file"){
        return "file";
      }else if(type === "text" || type === "password" || type === "email"){
        return "input";
      }else if(type === "submit" || type === "reset" || type === "button"){
        return "button";
      }
    }else if(tagName === "TEXTAREA"){
      return "textarea";
    }else if(tagName === "A" || tagName === "BUTTON"){
      return "button";
    }
  };
    
  $.uniform.doInput = function($el){
    //get options and data
    var d = $el.data("uniform");
    
    if(!d.wrapped){
      //we need to apply proper classes
      $el.addClass($el.attr("type"));
      d.wrapped = true;
    }
  };
  
  $.uniform.doTextarea = function($el){
    var d = $el.data("uniform");
    
    if(!d.wrapped){
      $el.addClass("uniform");
      d.wrapped = true;
    }
  };
  
  $.uniform.doButton = function($el){
    //get options and data
    var btnText, tagName = $el[0].tagName, d = $el.data("uniform");
    
    if(d.wrapped !== true){
      $el.wrap("<div>").before("<span>");
      d.spanTag = $el.prev("span");
      d.divTag = $el.closest("div");
      $el.css("opacity", 0);
      d.wrapped = true;
    }
    
    $el.unbind(".uniform");
    d.divTag.removeClass().addClass(d.opts.buttonClass);
    $.uniform.setID($el);
    
    if(tagName == "A" || tagName == "BUTTON"){
      btnText = $el.text();
    }else if(tagName == "INPUT"){
      btnText = $el.attr("value");
    }
    
    btnText = (btnText == "") ? $el[0].type == "reset" ? "Reset" : "Submit" : btnText;
    d.spanTag.html(btnText);
    
    if($el.is(":disabled")) d.divTag.addClass(d.opts.disabledClass);
    
    d.divTag.bind({
      "mouseenter.uniform": function(){
        d.divTag.addClass(d.opts.hoverClass);
      },
      "mouseleave.uniform": function(){
        d.divTag.removeClass(d.opts.hoverClass).removeClass(d.opts.activeClass);
      },
      "mousedown.uniform touchbegin.uniform": function(){
        d.divTag.addClass(d.opts.activeClass);
      },
      "mouseup.uniform touchend.uniform": function(){
        d.divTag.removeClass(d.opts.activeClass);
      },
      "click.uniform touchend.uniform": function(e){
        if($(e.target).is("span") || $(e.target).is("div")){    
          if($el[0].dispatchEvent){
            var ev = document.createEvent('MouseEvents');
            ev.initEvent( 'click', true, true );
            $el[0].dispatchEvent(ev);
          }else{
            $el[0].click();
          }
        }
      }
    });
    
    $el.bind({
      "focus.uniform": function(){
        d.divTag.addClass(d.opts.focusClass);
      },
      "blur.uniform": function(){
        d.divTag.removeClass(d.opts.focusClass);
      },
      "restore.uniform": $.uniform.restore,
      "disable.uniform": $.uniform.disable,
      "enable.uniform": $.uniform.enable
    });

    $.uniform.noSelect(d.divTag);
  };
  
  $.uniform.doSelect = function($el){
    var d = $el.data("uniform");
    
    if(d.wrapped !== true){
      var width = $el.width();
      $el.wrap("<div>").before("<span>");
      d.divTag = $el.closest("div");
      d.spanTag = $el.prev("span");
      if(!$el.css("display") == "none" && d.opts.autoHide){
        d.divTag.hide();
      }
      $el.css("opacity", 0);
      if(d.opts.autoWidth === true) d.divTag.css("width", width);
      d.wrapped = true;
    }
    
    $el.unbind(".uniform");
    d.divTag.removeClass().addClass(d.opts.selectClass);
    $.uniform.setID($el);
    
    var selected = $el.find(":selected:first");
    
    if(selected.length == 0) selected = $el.find("option:first");
    
    d.spanTag.html(selected.html());
    
    $el.bind({
      "change.uniform": function() {
        d.spanTag.html($el.find(":selected").html());
        d.divTag.removeClass(d.opts.activeClass);
      },
      "focus.uniform": function() {
        d.divTag.addClass(d.opts.focusClass);
      },
      "blur.uniform": function() {
        d.divTag.removeClass(d.opts.focusClass).removeClass(d.opts.activeClass);
      },
      "mousedown.uniform touchbegin.uniform": function() {
        d.divTag.addClass(d.opts.activeClass);
      },
      "mouseup.uniform touchend.uniform": function() {
        d.divTag.removeClass(d.opts.activeClass);
      },
      "mouseenter.uniform": function() {
        d.divTag.addClass(d.opts.hoverClass);
      },
      "mouseleave.uniform": function() {
        d.divTag.removeClass(d.opts.hoverClass).removeClass(d.opts.activeClass);
      },
      "click.uniform touchend.uniform": function(){
        d.divTag.removeClass(d.opts.activeClass);
      },
      "keyup.uniform": function(){
        d.spanTag.text($el.find(":selected").html());
      },
      "restore.uniform": $.uniform.restore,
      "disable.uniform": $.uniform.disable,
      "enable.uniform": $.uniform.enable
    });
    
    if($el.is(":disabled")) d.divTag.addClass(d.opts.disabledClass);
    
    $.uniform.noSelect(d.spanTag);
  };
  
  $.uniform.doCheckbox = function($el){
    var d = $el.data("uniform");
    
    if(d.wrapped !== true){
      $el.wrap("<div>").wrap("<span>");
      d.divTag = $el.closest("div");
      d.spanTag = $el.closest("span");
      if(!$el.css("display") == "none" && d.opts.autoHide) d.divTag.hide();
      $el.css("opacity", 0);
      d.wrapped = true;
    }
    
    //reset events
    $el.unbind(".uniform");
    d.divTag.removeClass().addClass(d.opts.checkboxClass);
    d.spanTag.removeClass();
    $.uniform.setID($el);
    
    $el.bind({
      "focus.uniform": function(){
        d.divTag.addClass(d.opts.focusClass);
      },
      "blur.uniform": function(){
        d.divTag.removeClass(d.opts.focusClass);
      },
      "click.uniform touchend.uniform": function(){
        if(!$el.attr("checked")){
          d.spanTag.removeClass(d.opts.checkedClass);
        }else{
          d.spanTag.addClass(d.opts.checkedClass);
        }
      },
      "mousedown.uniform touchbegin.uniform": function() {
        d.divTag.addClass(d.opts.activeClass);
      },
      "mouseup.uniform touchend.uniform": function() {
        d.divTag.removeClass(d.opts.activeClass);
      },
      "mouseenter.uniform": function() {
        d.divTag.addClass(d.opts.hoverClass);
      },
      "mouseleave.uniform": function() {
        d.divTag.removeClass(d.opts.hoverClass).removeClass(d.opts.activeClass);
      },
      "check.uniform": $.uniform.check,
      "uncheck.uniform": $.uniform.uncheck,
      "disable.uniform": $.uniform.disable,
      "enable.uniform": $.uniform.enable,
      "restore.uniform": $.uniform.restore
    });
    
    if($el.attr("checked")) d.spanTag.addClass(d.opts.checkedClass);

    if($el.is(":disabled")) d.divTag.addClass(d.opts.disabledClass);
  };
  
  $.uniform.doRadio = function($el){
    var d = $el.data("uniform");
    
    if(d.wrapped !== true){
      $el.wrap("<div>").wrap("<span>");
      d.divTag = $el.closest("div");
      d.spanTag = $el.closest("span");
      if(!$el.css("display") == "none" && d.opts.autoHide) d.divTag.hide();
      $el.css("opacity", 0);
      d.wrapped = true;
    }
    
    //reset events
    $el.unbind(".uniform");
    d.divTag.removeClass().addClass(d.opts.radioClass);
    d.spanTag.attr("class", "");
    $.uniform.setID($el);
    
    $el.bind({
      "focus.uniform": function(){
        d.divTag.addClass(d.opts.focusClass);
      },
      "blur.uniform": function(){
        d.divTag.removeClass(d.opts.focusClass);
      },
      "click.uniform touchend.uniform": function(){
        if(!$el.attr("checked")){
          d.spanTag.removeClass(d.opts.checkedClass);
        }else{
          var classes = d.opts.radioClass.split(" ")[0];
          $("." + classes + " span").has("input[name="+$el.attr("name")+"]").removeClass(d.opts.checkedClass);
          d.spanTag.addClass(d.opts.checkedClass);
        }
      },
      "mousedown.uniform touchend.uniform": function() {
        if(!$el.is(":disabled")) d.divTag.addClass(d.opts.activeClass);
      },
      "mouseup.uniform touchbegin.uniform": function() {
        d.divTag.removeClass(d.opts.activeClass);
      },
      "mouseenter.uniform touchend.uniform": function() {
        d.divTag.addClass(d.opts.hoverClass);
      },
      "mouseleave.uniform": function() {
        d.divTag.removeClass(d.opts.hoverClass).removeClass(d.opts.activeClass);
      },
      "check.uniform": $.uniform.check,
      "uncheck.uniform": $.uniform.uncheck,
      "disable.uniform": $.uniform.disable,
      "enable.uniform": $.uniform.enable,
      "restore.uniform": $.uniform.restore
    });

    if($el.attr("checked")) d.spanTag.addClass(d.opts.checkedClass);

    if($el.is(":disabled")) d.divTag.addClass(d.opts.disabledClass);
  };
  
  $.uniform.doFile = function($el){
    var d = $el.data("uniform");
    
    if(d.wrapped !== true){
      var btnTag = $('<span>'+d.opts.fileBtnText+'</span>'), filenameTag = $('<span>'+d.opts.fileDefaultText+'</span>');
      $el.wrap("<div>").after(btnTag).after(filenameTag);
      d.divTag = $el.closest("div");
      d.filenameTag = $el.next();
      d.btnTag = d.filenameTag.next();
      if(!$el.css("display") === "none" && d.opts.autoHide) d.divTag.hide();
      $el.css("opacity", 0);
      d.wrapped = true;
    }
    
    $el.unbind(".uniform");
    d.divTag.removeClass().addClass(d.opts.fileClass);
    d.filenameTag.removeClass().addClass(d.opts.filenameClass);
    d.btnTag.removeClass().addClass(d.opts.fileBtnClass);
    $.uniform.setID($el);

    if(!$el.attr("size")){
      var divWidth = d.divTag.width();
      $el.attr("size", d.divWidth/10);
    }
    
    var setFilename = function(){
      var filename = $el.val();
      if (filename === ''){
        filename = d.opts.fileDefaultText;
      }else{
        filename = filename.split(/[\/\\]+/);
        filename = filename[(filename.length-1)];
      }
      d.filenameTag.text(filename);
    };

    setFilename();

    $el.bind({
      "focus.uniform": function(){
        d.divTag.addClass(d.opts.focusClass);
      },
      "blur.uniform": function(){
        d.divTag.removeClass(d.opts.focusClass);
      },
      "mousedown.uniform": function() {
        if(!$el.is(":disabled")) d.divTag.addClass(d.opts.activeClass);
      },
      "mouseup.uniform": function() {
        d.divTag.removeClass(d.opts.activeClass);
      },
      "mouseenter.uniform": function() {
        d.divTag.addClass(d.opts.hoverClass);
      },
      "mouseleave.uniform": function() {
        d.divTag.removeClass(d.opts.hoverClass).removeClass(d.opts.activeClass);
      },
      "restore.uniform": $.uniform.restore,
      "disable.uniform": $.uniform.disable,
      "enable.uniform": $.uniform.enable
    });

    // IE7 doesn't fire onChange until blur or second fire.
    if ($.browser.msie){
      // IE considers browser chrome blocking I/O, so it suspends timemouts until after the file has been selected.
      $el.bind('click.uniform.ie7', function() {
        setTimeout(setFilename, 0);
      });
    }else{
      $el.bind('change.uniform', setFilename);
    }

    if($el.attr("disabled")) d.divTag.addClass(d.opts.disabledClass);
    
    $.uniform.noSelect(d.filenameTag);
    $.uniform.noSelect(d.btnTag);
  };
  
  $.uniform.setID = function($el){
    var d = $el.data("uniform");
    if(d.opts.useID === true && $el.attr("id") !== "") d.divTag.attr("id", d.opts.idPrefix + "-" + $el.attr("id"));
  };
  
  $.uniform.noSelect = function(elem){
    function f() {
     return false;
    };
    $(elem).each(function() {
     this.onselectstart = this.ondragstart = f; // Webkit & IE
     $(this)
      .mousedown(f) // Webkit & Opera
      .css({ MozUserSelect: 'none' }); // Firefox
    });
  };
  
  $.uniform.check = function(){
    var d = $(this).data("uniform");
    this.checked = true;
    $.uniform.update(this);
  };
  
  $.uniform.uncheck = function(){
    this.checked = false;
    $.uniform.update(this);
  };
  
  $.uniform.disable = function(){
    var d = $(this).data("uniform");
    this.disabled = true;
    $.uniform.update(this);
  };
  
  $.uniform.enable = function(){
    var d = $(this).data("uniform");
    this.disabled = false;
    $.uniform.update(this);
  };
  
  $.uniform.update = function(elem){
    $(elem).each(function(){
      var $el = $(this);
      if($el.data("uniform")){
        $.uniform.run($el);
      }
    });
  };
  
  $.uniform.restore = function(){
    var t = $(this),
        type = t.data("uniform").type;
    
    if(type === "checkbox"){
      t.unwrap().unwrap();
    }else if(type === "select"){
      t.siblings("span").remove();
      t.unwrap();
    }else if(type === "radio"){
      t.unwrap().unwrap();
    }else if(type === "file"){
      t.siblings("span").remove();
      t.unwrap();
    }else if(type === "button"){
      t.siblings("span").remove();
      t.unwrap();
    }
    t.unbind(".uniform").css("opacity", "1");
  };
  
  if($.browser.msie && $.browser.version < 7){
    $.support.selectOpacity = false;
  }else{
    $.support.selectOpacity = true;
  }
  
  //
  // Define plug-in
  //
  $.fn.uniform = function(o1, o2){
    if(o1){
      if(typeof o1 == "object"){
        var o = $.extend($.uniform.defaults, o1);
        
        return this.each(function(){
          $.uniform.init(o, $(this));
        });
      }else if(typeof o1 == "string"){
        if(o2){
          return this.each(function(){
            $.uniform.set(o1, o2, $(this));
          });
        }else{
          return $.uniform.fetch(o1, $(this));
        }
      }
    }else{
      return this.each(function(){
        if($.support.selectOpacity){
          $.uniform.init($.uniform.defaults, $(this));
        }
      });
    }
  }
})(jQuery);