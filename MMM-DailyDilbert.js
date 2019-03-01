Module.register("MMM-DailyDilbert", {

    // Default module config.
    defaults: {
	comic: "nichtlustig",     // Choose between  ["dilbert", "xkcd", "garfield", "nichtlustig"]
        updateInterval : 10000 * 60, // 1 hours
        random: false,             // choose random comic each time (include an option to show daily comic at specific time!)
	timeForDaily: 7
    },

    start: function() {
        Log.info(this.config);
        Log.info("Starting module: " + this.name);

        this.dailyComic = "";
        this.getComic();
        
        self = this;
        if(self.config.updateInterval < 60000) {
			self.config.updateInterval = 60000;                    //IS THIS NEEDED?
		}			
		
        setInterval(function() {
            self.getComic();
        }, self.config.updateInterval);
    },

    // Define required scripts.
    getScripts: function() {
        return [];
    },

    getStyles: function() {
        return ["dilbert.css"];
    },

    getComic: function() {
        Log.info("Dilbert: Getting comic.");
        this.sendSocketNotification("GET_COMIC", {
            config: this.config
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "COMIC") {
            Log.info('Got comic from return: ' + payload.img);
            this.dailyComic = payload.img;
            this.updateDom(1000);
        }
    },

    notificationReceived: function(notification, payload, sender) {
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");

        var comicWrapper = document.createElement("div");
        comicWrapper.className = "dilbert-container";
    
        var img = document.createElement("img");
        img.id = "dilbert-content";
        img.src = this.dailyComic;
		img.classList.add('dilbert-image');
		comicWrapper.appendChild(img);
        wrapper.appendChild(comicWrapper);
        return wrapper;
    }
});
