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

(function($, undefined){
  $.support.selectOpacity = (!$.browser.msie || $.browser.version > 6);
  
  // Proxy function
  $.fn.uniform = function() {
    var params = Array.prototype.slice.call(arguments);
    
    var detectElementType = function(el){
      var $el     = $(el),
          tagName = el.tagName,
          result  = false;
      
      if (
           (tagName === "SELECT") &&
           ($el.attr("multiple") !== true) &&
           (
             $el.attr("size") === undefined || 
             ($el.attr("size") <= 1)
           )
         ) {
        result = "uniformSelect";
      } else if (tagName === "INPUT") {
        var type = el.type;
        if (type === "text" || type === "password" || type === "email") {
          result = "uniformInput";
        } else if (type === "submit" || type === "reset" || type === "button") {
          result = "uniformButton";
        } else {
          result = "uniform" + type.charAt(0).toUpperCase() + type.slice(1);
        }
      } else if (tagName === "TEXTAREA") {
        result = "uniformTextarea";
      }else if (tagName === "A" || tagName === "BUTTON") {
        result = "uniformButton";
      }
      
      return result;
    };
    
    return $(this).each(function() {
      var $el  = $(this),
          type = detectElementType(this);
      if (type && $.isFunction($.fn[type])) {
        $el[type].apply($el, params);
      }
    });
  };
  
  var uniformBase = function() {};
  uniformBase.prototype = $.extend(true, new $.Widget(), {
    // Options
    options: {
      selectClass:     'selector',
      radioClass:      'radio',
      checkboxClass:   'checker',
      fileClass:       'uploader',
      filenameClass:   'filename',
      fileBtnClass:    'action',
      fileDefaultText: 'No file selected',
      fileBtnText:     'Choose File',
      checkedClass:    'checked',
      focusClass:      'focus',
      disabledClass:   'disabled',
      buttonClass:     'button',
      activeClass:     'active',
      hoverClass:      'hover',
      useID:            true,
      idPrefix:         'uniform',
      resetSelector:    false,
      autoHide:         true,
      autoWidth:        true
    },
    
    _setID: function(){
      var d = this.element.data("uniform");
      if(this.options.useID === true && this.element.attr("id") !== "") this.divTag.attr("id", this.options.idPrefix + "-" + this.element.attr("id"));
    },
    
    _disableTextSelection: function(el){
      function f() {
       return false;
      };
      $(el).each(function() {
       this.onselectstart = this.ondragstart = f; // Webkit & IE
       $(this)
        .mousedown(f) // Webkit & Opera
        .css({ MozUserSelect: 'none' }); // Firefox
      });
    },
    
    destroy: function(){
      this.element.unbind(".uniform").css("opacity", "1");
		  $.Widget.prototype.destroy.call(this);
    }/*,
    
    refresh: function(elem){
      $(elem).each(function(){
        if(this.element.data("uniform")){
          $.uniform.run(this.element);
        }
      });
    },
      
	  _setOption: function( key, value ) {
		  $.Widget.prototype._setOption.apply( this, arguments );
		  if ( key === "disabled" ) {
			  if ( value ) {
				  this.element.attr( "disabled", true );
			  } else {
				  this.element.removeAttr( "disabled" );
			  }
		  }
		  this._resetButton();
	  }*/
  });
  
  var wrappedBase = function() {};
  wrappedBase.prototype = $.extend(true, new uniformBase(), {
    _init: function(){
      var self = this;
      
      this.element.wrap("<div>").before("<span>");
      this.spanTag = this.element.prev("span");
      this.divTag  = this.element.closest("div");
      this.element.css("opacity", 0);
      this.wrapped = true;
      
      this.element.unbind(".uniform");
      
      if(this.element.is(":disabled")) {
        this.divTag.addClass(this.options.disabledClass);
      }
      
      this.divTag.bind({
        "mouseenter.uniform": function(){
          self.divTag.addClass(self.options.hoverClass);
        },
        "mouseleave.uniform": function(){
          self.divTag.removeClass(self.options.hoverClass).removeClass(this.options.activeClass);
        },
        "mousedown.uniform touchbegin.uniform": function(){
          self.divTag.addClass(self.options.activeClass);
        },
        "mouseup.uniform touchend.uniform": function(){
          self.divTag.removeClass(self.options.activeClass);
        }
      });
      
      this.element.bind({
        "focus.uniform": function(){
          self.divTag.addClass(self.options.focusClass);
        },
        "blur.uniform": function(){
          self.divTag.removeClass(self.options.focusClass);
        }
      });
    }
  });
  
  var radioCheckBase = function() {};
  radioCheckBase.prototype = $.extend(true, new wrappedBase(), {
    _init: function(){
      var self = this;
      
		  wrappedBase.prototype._init.call(this);
      this.spanTag.removeClass();
      this._setID(this.element);
      
      if(this.element.attr("checked")) {
        this.spanTag.addClass(this.options.checkedClass);
      }
    },
      
	  check: function() {
		  return this._setOption( "checked", false );
	  },
	  
	  uncheck: function() {
		  return this._setOption( "unchecked", true );
	  },
    
    destroy: function(){
      this.element.unwrap().unwrap();
		  wrappedBase.prototype.destroy.call(this);
    }
	});
	
  $.widget("uniform.uniformTextarea", uniformBase, {
    _init: function(){
      this.element.addClass("uniform");
    }
  });
  
  $.widget("uniform.uniformInput", uniformBase, {
    _init: function(){
      this.element.addClass(this.element.attr("type"));
    }
  });
  
  $.widget("uniform.uniformButton", wrappedBase, {
    _init: function(){
      //get options and data
      var btnText = "", 
          self    = this,
          tagName = this.element.tagName;
      
		  wrappedBase.prototype._init.call(this);
      
      this.divTag.removeClass().addClass(this.options.buttonClass);
      this._setID(this.element);
      
      if(tagName == "A" || tagName == "BUTTON"){
        btnText = this.element.text();
      }else if(tagName == "INPUT"){
        btnText = this.element.attr("value");
      }
      btnText = (btnText === "") ? (this.element[0].type === "reset") ? "Reset" : "Submit" : btnText;
      this.spanTag.html(btnText);
      
      this.divTag.bind({
        "click.uniform touchend.uniform": function(e){
          if($(e.target).is("span") || $(e.target).is("div")){    
            if(self.element[0].dispatchEvent){
              var ev = document.createEvent('MouseEvents');
              ev.initEvent( 'click', true, true );
              self.element[0].dispatchEvent(ev);
            }else{
              self.element[0].click();
            }
          }
        }
      });

      this._disableTextSelection(this.divTag);
    },
    
    destroy: function(){
      this.element.siblings("span").remove();
      this.element.unwrap();
      
		  wrappedBase.prototype.destroy.call(this);
    }
  });
  
  $.widget("uniform.uniformSelect", wrappedBase, {
    _init: function(){
      var self = this;
    
      var width = this.element.width();
		  wrappedBase.prototype._init.call(this);
      if(this.options.autoWidth === true) {
        this.divTag.css("width", width);
      }
		  
      this.divTag.removeClass().addClass(this.options.selectClass);
      this._setID(this.element);
      
      var selected = this.element.find(":selected:first");
      
      if(selected.length === 0) {
        selected = this.element.find("option:first");
      }
      
      this.spanTag.html(selected.html());
      
      this.element.bind({
        "change.uniform": function() {
          self.spanTag.html(self.element.find(":selected").html());
          self.divTag.removeClass(self.options.activeClass);
        },
        "click.uniform touchend.uniform": function(){
          self.divTag.removeClass(self.options.activeClass);
        },
        "keyup.uniform": function(){
          self.spanTag.text(self.element.find(":selected").html());
        }
      });
      
      this._disableTextSelection(this.spanTag);
    },
    
    destroy: function(){
      this.element.siblings("span").remove();
      this.element.unwrap();
      
		  wrappedBase.prototype.destroy.call(this);
    }
  });
  
  $.widget("uniform.uniformCheckbox", radioCheckBase, {
    _init: function(){
      var self = this;
      
		  radioCheckBase.prototype._init.call(this);
      this.divTag.removeClass().addClass(this.options.checkboxClass);
      
      this.element.bind({
        "click.uniform touchend.uniform": function(){
          if(!self.element.attr("checked")){
            self.spanTag.removeClass(self.options.checkedClass);
          }else{
            self.spanTag.addClass(self.options.checkedClass);
          }
        },
        "mousedown.uniform touchbegin.uniform": function() {
          self.divTag.addClass(self.options.activeClass);
        },
        "mouseup.uniform touchend.uniform": function() {
          self.divTag.removeClass(self.options.activeClass);
        },
        "mouseenter.uniform": function() {
          self.divTag.addClass(self.options.hoverClass);
        }
      });
    }
  });
  
  $.widget("uniform.uniformRadio", radioCheckBase, {
    _init: function(){
      var self = this;
      
		  radioCheckBase.prototype._init.call(this);
      this.divTag.removeClass().addClass(this.options.radioClass);
      
      this.element.bind({
        "click.uniform touchend.uniform": function(){
          if(!self.element.attr("checked")){
            self.spanTag.removeClass(self.options.checkedClass);
          }else{
            var classes = self.options.radioClass.split(" ")[0];
            $("." + classes + " span").has("input[name="+self.element.attr("name")+"]").removeClass(self.options.checkedClass);
            self.spanTag.addClass(self.options.checkedClass);
          }
        },
        "mousedown.uniform touchend.uniform": function() {
          if(!self.element.is(":disabled")) self.divTag.addClass(self.options.activeClass);
        },
        "mouseup.uniform touchbegin.uniform": function() {
          self.divTag.removeClass(self.options.activeClass);
        },
        "mouseenter.uniform touchend.uniform": function() {
          self.divTag.addClass(self.options.hoverClass);
        }
      });
    }
  });
  
  $.widget("uniform.uniformFile", uniformBase, {
    _init: function(){
      var self = this;
      
      var btnTag = $('<span>'+this.options.fileBtnText+'</span>'), filenameTag = $('<span>'+this.options.fileDefaultText+'</span>');
      this.element.wrap("<div>").after(btnTag).after(filenameTag);
      this.divTag = this.element.closest("div");
      this.filenameTag = this.element.next();
      this.btnTag = this.filenameTag.next();
      if(!this.element.css("display") === "none" && this.options.autoHide) this.divTag.hide();
      this.element.css("opacity", 0);
      this.wrapped = true;
      
      this.element.unbind(".uniform");
      this.divTag.removeClass().addClass(this.options.fileClass);
      this.filenameTag.removeClass().addClass(this.options.filenameClass);
      this.btnTag.removeClass().addClass(this.options.fileBtnClass);
      this._setID(this.element);

      if(!this.element.attr("size")){
        var divWidth = this.divTag.width();
        this.element.attr("size", this.divWidth/10);
      }
      
      var setFilename = function(){
        var filename = self.element.val();
        if (filename === ''){
          filename = self.options.fileDefaultText;
        }else{
          filename = filename.split(/[\/\\]+/);
          filename = filename[(filename.length-1)];
        }
        self.filenameTag.text(filename);
      };

      setFilename();

      // IE7 doesn't fire onChange until blur or second fire.
      if ($.browser.msie){
        // IE considers browser chrome blocking I/O, so it suspends timemouts until after the file has been selectethis.
        this.element.bind('click.uniform.ie7', function() {
          setTimeout(setFilename, 0);
        });
      }else{
        this.element.bind('change.uniform', setFilename);
      }

      if(this.element.attr("disabled")) {
        this.divTag.addClass(this.options.disabledClass);
      }
      
      this._disableTextSelection(this.filenameTag);
      this._disableTextSelection(this.btnTag);
    },
    
    destroy: function(){
      this.element.siblings("span").remove();
      this.element.unwrap();
      
		  uniformBase.prototype.destroy.call(this);
    }
  });
})(jQuery);
