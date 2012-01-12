$(document).bind("pageinit", function(event, data) {
  var fullscreen = function() {
    /* Some orientation changes leave the scroll position at something
     * that isn't 0,0. This is annoying for user experience. */
    scroll(0, 0);

    /* Calculate the geometry that our content area should take */
    var header = $(".header:visible");
    var footer = $(".footer:visible");
    var content = $(".content:visible");
    var viewport_height = $(window).height();
    
    var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
    /* XXX: Do this for iPhone only. */
    /* 60 px for 'url text field' (url bar): http://developer.apple.com/library/IOs/#documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html */
    content_height += 60; 
    //console.log("Viewport height: " + viewport_height);
    //console.log("Content height: " + content_height);
    
    /* Trim margin/border/padding height */
    content_height -= (content.outerHeight() - content.height());
    content.height(content_height);
  }; /* fullscreen */

  var flow_transition = function(target, data) {
    document.location.hash = "#" + target;
    storage.set("current_step", target);

    /* Save any data associated with this flow change */
    for (var key in data) {
      storage.set(key, data[key])
    }
  };

  var storage = {
    get: function(key) {
      //console.log("Fetch: " + key);
      return JSON.parse(window.localStorage[key]);
    },
    set: function(key, value) {
      //console.log(key + " => " + JSON.stringify(value));
      window.localStorage[key] = JSON.stringify(value);
    }
  };

  /* Some defaults until there's a server backend to query */
  storage.set("events", {
    "ibuprofen": { 
      choice: { "how many?": [ 1, 2, 3 ] }
    },
    "diaper": { 
      multichoice: { "features": [ "poop", "pee!" ] }
    },
  });

  /* Configure page generation */
  var page = document.location.hash.substring(1) || "index"
  var pageActiveCallback = {
    "main": function (event, data) {
      /* Generate list - window.localStorage.events */
      data.header.html("<h1>testing</h1>");
      data.footer.html("<h1>hello</h1>");
      var ul = $("<ul>");
      ul.attr("id", "event-chooser");
      ul.attr("data-role", "listview");
      ul.attr("data-inset", "true");
      ul.attr("data-filter", "true");
      var events = storage.get("events");
      for (var i in events) {
        var li = $("<li>");
        li.html(i);
        ul.append(li);
      }
      data.content.empty().append(ul);
      ul.bind("click", function(event, data) {
        var event_name = $(event.target).text();
        /* $.mobile.changePage doesn't seem to work for in-page transitions,
         * so let's just update the url hash manually. */
        /* XXX: Assert current flow state is 'main' */
        flow_transition("event-chosen", {
          event_name: event_name
        });
      });

      console.log(data);
    }, /* main */

    /* This page is for when an event is selected.
     * This page should allow the user to view history for this event
     * or create a new event. */
    "event-chosen": function (event, data) {
      var event_name = storage.get("event_name");
      var event_config = storage.get("events")[event_name];
      data.header.html("<h1>Event: " + event_name + "</h1>");
      data.content.html("Hello world");
      data.footer.html("testing");
      console.log(event_config);
    }, /* event-chosen */
  };

  $(document).bind("pagebeforechange", function(event, data) {
    /* Ignore page changes not done by URL */
    if (typeof data.toPage !== "string") {
      return;
    }

    var url = $.mobile.path.parseUrl(data.toPage);
    var page_name = url.hash.substring(1) || "main";

    var callback = pageActiveCallback[page_name] || function(e, d) {
      console.log("No callback for page " + page_name);
    };

    var page_id = "page-" + page_name;
    var page = $("#" + page_id);

    /* Make the page if it is not found */
    if (page.size() == 0) {
      console.log("Creating page for " + page);
      page = $("<div data-role='page'>")
      page.attr("id", page_id);
      page.append("<div data-role='header' class='header ui-header'></div>");
      page.append("<div data-role='content' class='content ui-content'></div>");
      page.append("<div data-role='footer' class='footer ui-footer'></div>");
      page.appendTo("body")
      page.trigger("create");
    }

    var builder = {
      header: page.children(":jqmData(role=header)"),
      content: page.children(":jqmData(role=content)"),
      footer: page.children(":jqmData(role=footer)")
    };

    console.log(builder.content.get(0));

    callback(event, builder);
    $("h1", builder.header).addClass("ui-title");
    $("h1", builder.footer).addClass("ui-title");
    $("h1", builder.footer).addClass("ui-title");

    event.preventDefault();
    $.mobile.changePage(page, { transition: data.transition || "slide" });
  }); /* event 'pagebeforechange' */

  /* Fake a pagebeforechange event when we load this site.
   * This lets us apply any dynamic changes on load/reload */
  $(document).trigger("pagebeforechange", {
    toPage: document.location.toString(),
    transition: "none"
  });

  /* Keep the page geometry full-screen */
  $(window).bind("orientationchange resize", fullscreen);
  $(document).bind("pagechange", function(event, data) {
    /* Build the listviews, if any */
    $(":jqmData(role=listview)").listview();
    fullscreen();
    console.log("OK 3");
  });
  //$(document).bind("pageshow", fullscreen);
}); /* on 'pageinit' */

