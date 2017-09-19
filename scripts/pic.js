var Picimage = function() {
  /**
   * @param {Object} uri
   * @return {?}
   */
  function setup(uri) {
    uri = new URI(uri);
    return uri.filename() || "image" + index + ".jpg";
  }
  /**
   * @return {undefined}
   */
  function init() {
    $(document).on("click", "#" + idfirst + " .close", function() {
      done();
    });
    $(document).on("change", "#pick-image-check-all", function() {
      if ($(this).is(":checked")) {
        $("#" + idfirst + " .item .select input ").prop("checked", true);
      } else {
        $("#" + idfirst + " .item .select input ").prop("checked", false);
      }
    });
    $(document).on("click", "#" + idfirst + " .modal-footer .download-all-button ", function() {
      var zip = new JSZip;
      /** @type {number} */
      var i = 0;
      var last = $("#" + idfirst + " .item .select input:checked").length;
      /** @type {Array} */
      var paths = [];
      return 1 > last ? void alert("\uc120\ud0dd\ubaa9\ub85d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.") : void $.each($("#" + idfirst + " .item .select input "), function(dataAndEvents, el) {
        if (1 == $(el).is(":checked")) {
          var path = $(el).parents(".item").find(".img-wrapper .thumb").prop("src");
          var options = setup(path);
          JSZipUtils.getBinaryContent(path, function(dataAndEvents, funcToCall) {
            if (dataAndEvents) {
              paths.push(path);
            } else {
              var self = zip.folder("images");
              self.file(options, funcToCall, {
                binary : true
              });
            }
            if (i++, i == last) {
              if (paths.length > 0) {
                zip.file("error.txt", paths.join("\n"));
              }
              var r20 = zip.generate({
                type : "blob"
              });
              saveAs(r20, "image.zip");
            }
          });
        }
      });
    });
    $(document).on("mouseenter", "#" + idfirst + " .item ", function() {
      $(this).find(".menu").addClass("active");
    }).on("mouseleave", "#" + idfirst + " .item ", function() {
      $(this).find(".menu").removeClass("active");
    });
    $(document).keydown(function(event) {
      if (27 == event.keyCode) {
        done();
      }
    });
    $(document).on("click", "#" + idfirst + " .item .info-button", function() {
      $(this).parents(".item").find(".info").toggleClass("active");
    });
    $(document).on("click", "#" + idfirst + " .item .info input", function() {
      $(this).select();
    });
    $(document).on("click", "#" + idfirst + " .item .download-button", function() {
      var path = $(this).parents(".item").find(".thumb").prop("src");
      var elements = $("<a>").attr("href", path).attr("download", setup(path)).appendTo("body");
      elements[0].click();
      elements.remove();
    });
    $(document).on("click", "#" + idfirst + " .item .fullsize", function() {
      var htmlStartTag = $(this).parents(".item").find(".img-wrapper .thumb").prop("src");
      var template = get(chrome.extension.getURL("html/fullscreen.html"));
      $("body").append(Mustache.render(template, {
        images : modelData,
        current_src : htmlStartTag
      }));
      $(".pic-image-full").addClass("active");
      screenfull.request($(".pic-image-full")[0]);
    });
    $(document).on(screenfull.raw.fullscreenchange, "", function() {
      if (0 == screenfull.isFullscreen) {
        $(".pic-image-full").remove();
      }
    });
    $(document).on("click", ".pic-image-full .full-footer img", function() {
      console.log($(this).parents(".pic-image-full").find(".full-container .full-preview div img"));
      $(this).parents(".pic-image-full").find(".full-container .full-preview div img").attr("src", $(this).prop("src"));
    });
  }
  /**
   * @param {string} req
   * @return {?}
   */
  function get(req) {
    return $.ajax({
      type : "GET",
      url : req,
      cache : false,
      async : false
    }).responseText;
  }
  /**
   * @return {undefined}
   */
  function handler() {
    $("#" + idfirst).css("display", "block");
  }
  /**
   * @return {undefined}
   */
  function done() {
    $("#" + idfirst).remove();
  }
  /**
   * @return {?}
   */
  function initialize() {
    /** @type {Array} */
    var result = [];
    /** @type {number} */
    var idx = 0;
    return $.each($("img"), function(dataAndEvents, input) {
      if ($(input).prop("naturalWidth") > naturalWidth) {
        if ($(input).prop("naturalHeight") > naturalHeight) {
          result.push({
            src : $(input).prop("src"),
            index : idx
          });
          idx++;
        }
      }
    }), $.each($("div"), function(dataAndEvents, curr) {
      if ("" != $(curr).css("background-image")) {
        /** @type {(Array.<string>|null)} */
        var val = /^url\((['"]?)(.*)\1\)$/.exec($(curr).css("background-image"));
        if (val = val ? val[2] : "", "" != val) {
          var input = $("<img src='" + val + "' style='display:none;'>").appendTo("body");
          if ($(input).prop("naturalWidth") > naturalWidth) {
            if ($(input).prop("naturalHeight") > naturalHeight) {
              result.push({
                src : val,
                index : idx
              });
              idx++;
            }
          }
          input.remove();
        }
      }
    }), result;
  }
  /**
   * @param {?} modelData
   * @return {?}
   */
  function ready(modelData) {
    var template = get(chrome.extension.getURL("html/item.html"));
    var data = {
      images : modelData,
      /**
       * @return {?}
       */
      full_src : function() {
        return chrome.extension.getURL("images/fullsize.png");
      }
    };
    return Mustache.render(template, data);
  }
  /**
   * @return {?}
   */
  function onload() {
    if (modelData = initialize(), modelData.length < 1) {
      return void alert("\uc801\ud569\ud55c \uc774\ubbf8\uc9c0\ub97c \ucc3e\uc744\uc218 \uc5c6\uc2b5\ub2c8\ub2e4.");
    }
    var template = get(chrome.extension.getURL("html/modal.html"));
    var listStyleOptions = ready(modelData);
    $("body").append(Mustache.render(template, {
      items : listStyleOptions,
      count : modelData.length
    }));
    handler();
  }
  /** @type {string} */
  var idfirst = "pic-image-dummy";
  /** @type {number} */
  var naturalWidth = 160;
  /** @type {number} */
  var naturalHeight = 100;
  var modelData = void 0;
  return init(), {
    /** @type {function (): ?} */
    show : onload
  };
}();
