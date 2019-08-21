Module.register("MMM-Comics", {

    // Default module config.
    defaults: {
      comic: "dilbert",         // Choose between  ["dilbert", "xkcd", "garfield", "peanuts", "nichtlustig", "ruthe", "dilbert_de"]
      updateInterval : 1000 * 60 * 1,  // 1 hour
      random: false,                // choose random comic  (you can limit for the daily comic using the timeForDaily method)
      coloredImage: false,
      comicWidth: 500,
      timeForDaily: [6, 8],      //place start and end hour here, divided by comma, e.g. [6, 8], please use 24h format!
      debug: false
    },

    start: function() {
        Log.info(this.config);
        Log.info("Starting module: " + this.name);

        this.dailyComic = "";
        this.getComic();

        self = this;

        setInterval(function() {
            self.getComic();
        }, self.config.updateInterval);
    },

    // Define required scripts.
    getScripts: function() {
        return [];
    },

    getStyles: function() {
        return ["MMM-Comics.css"];
    },

    getComic: function() {
        Log.info("[MMM-Comics] Getting comic.");
        this.sendSocketNotification("GET_COMIC", {
            config: this.config
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "COMIC") {
            this.dailyComic = payload.img;
            console.log("Comic source: "+this.dailyComic);
            this.updateDom(1000);
        }
    },

    notificationReceived: function(notification, payload, sender) {
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        var comicWrapper = document.createElement("div");
        comicWrapper.className = "comic-container";
        var img = document.createElement("img");
        img.id = "comic-content";
        img.src = this.dailyComic;
        if (this.config.comicWidth) {
          img.width = this.config.comicWidth;
        }
      	if (this.config.coloredImage) {
      		img.className = 'colored-image';
      	} else {
      		img.className = 'bw-image';
      	};
	      comicWrapper.appendChild(img);
        wrapper.appendChild(comicWrapper);
        return wrapper;
    }
});
