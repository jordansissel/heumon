$(document).bind("pageinit", function(event, data) {
  var flow = function(step, data) {
    document.location.hash = "#" + step;
    window.localStorage.flow = step;

    for (var key in data) {
      console.log(key + " => " + data[key]);
      window.localStorage.key = data[key];
    }
  };

  var storage = {
    get: function(key) {
      console.log("Fetch: " + key);
      return JSON.parse(window.localStorage[key]);
    },
    set: function(key, value) {
      console.log(key + " => " + JSON.stringify(value));
      window.localStorage[key] = JSON.stringify(value);
    }
  };

  storage.set("events", {
    "ibuprofen": { 
      choice: [ 1, 2, 3 ]
    },
    "diaper": { 
      multichoice: [ "poop", "pee!" ]
    },
  });

  /* The page is ready. */
  $("ul#event-chooser").bind("click", function(event, data) {
    var event_name = $(event.target).text();
    /* $.mobile.changePage doesn't seem to work for in-page transitions,
     * so let's just update the url hash manually. */
    flow("new", {
      event_name: event_name
    });
  });

  var page = document.location.hash.substring(1) || "index"
  var pageActiveCallback = {
    "main": function (event, data) {
      /* Generate list - window.localStorage.events */
      var ul = $("#main ul#event-chooser");
      console.log(ul);
      var events = storage.get("events");
      for (var i in events) {
        var li = $("<li>");
        li.html(i);
        ul.append(li);
      }
    }, /* main */
    "new": function (event, data) {
      $("#new div[data-role='header'] h1").html("Event: " + window.localStorage.event_name);
    }, /* new */
  };

  $(document).bind("pageshow", function(event, data) {
    var page = event.target.id;
    var callback = pageActiveCallback[page] || function(e, d) {
      console.log("No callback for page " + page);
    };
    callback(event, data);
  });

  //if (document.location.hash == "#" + window.localStorage.flow) {
    /* We reloaded the same page. */
    //$("#new div[data-role='header'] h1").html("Event: " + window.localStorage.event_name);
  //}
});

