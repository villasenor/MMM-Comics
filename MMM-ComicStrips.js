Module.register("MMM-ComicStrips", {

    // Default module config.
    defaults: {
      comic: "dilbert",         // Choose between  ["dilbert", "xkcd", "garfield", "peanuts", "nichtlustig", "ruthe", "dilbert_de"]
      updateInterval : 1000 * 60 * 1,  // 1 hour
      random: false,                // choose random comic each time (include an option to show daily comic at specific time!)
      coloredImage: false,
      comicWidth: 300,
      timeForDaily: [7, 23],
      debug: true
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
        return ["comic.css"];
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
