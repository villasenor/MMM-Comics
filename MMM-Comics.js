Module.register("MMM-Comics", {

    // Default module config.
    defaults: {
        comics: ["dilbert", "xkcd", "garfield", "peanuts", "calvin+hobbes"],
        // Choose one or more of ["dilbert", "xkcd", "garfield", "peanuts", "calvin+hobbes", "ruthe", "dilbert_de"]
        updateInterval : 1000 * 60 * 10,	// 10 minutes
        random: false,				// choose random comic  (you can limit for the daily comic using the timeForDaily method)
        coloredImage: false,
        maxWidth: 500,
        maxHeight: 500,
        timeForDaily: [6, 9],			//place start and end hour here, divided by comma, e.g. [6, 8], please use 24h format! Ignored if random: false.
        debug: false
    },

    start: function() {
        var counter = 0;
        this.log("Starting module: " + this.name);
        this.dailyComic = "";
        this.getComic(this.config.comics[counter]);
        var self = this;
        setInterval(function() {
            counter = (counter === self.config.comics.length - 1) ? 0 : counter + 1;
            self.getComic(self.config.comics[counter]);
        }, self.config.updateInterval);
    },

    getStyles: function() {
        return ["comics.css"];
    },

    getComic: function(comic) {
        this.log("Getting comic.");
        this.sendSocketNotification("GET_COMIC", {
            comic: comic,
            config: this.config
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "COMIC") {
            this.dailyComic = payload.img;
            this.log("Comic source: " + this.dailyComic);
            this.updateDom(500);
        }
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        var comicWrapper = document.createElement("div");
        comicWrapper.className = "comic-container";
        comicWrapper.style.width = this.config.maxWidth + "px";
        comicWrapper.style.height = this.config.maxHeight + "px";
        var img = document.createElement("img");
        img.id = "comic-content";
        img.src = this.dailyComic;
        this.log("Original width: "+img.naturalWidth+", Original height: "+img.naturalHeight);
        /*if (this.config.maxWidth) {
            img.width = this.config.maxWidth;
        }*/
      	if (this.config.coloredImage) {
      	    img.className = 'colored-image';
      	} else {
            img.className = 'bw-image';
      	};
        comicWrapper.appendChild(img);
        wrapper.appendChild(comicWrapper);
        return wrapper;
    },

    log: function (msg) {
        if (this.config && this.config.debug) {
            console.log(this.name + ":", JSON.stringify(msg));
        }
    },

});
