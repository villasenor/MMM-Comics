var request = require("request");
var NodeHelper = require("node_helper");
var cheerio = require("cheerio");
var moment = require("moment");

module.exports = NodeHelper.create({

	start: function () {
		console.log("Starting node helper: " + this.name);
	},

	socketNotificationReceived: function (notification, payload) {
		var self = this;
		var comic = payload.config.comic;
		var random = payload.config.random;
		var dailyTime = payload.config.timeForDaily;
		var dailyStart = moment(dailyTime[0], "k").format();
		console.log(dailyStart);
		var dailyEnd = moment(dailyTime[1], "k").format();
		console.log(dailyEnd);
		if (moment().isBetween(dailyStart, dailyEnd)) { random = false };

		console.log("Comic -> Notification: " + notification + " Payload: " + comic);

		if (notification === "GET_COMIC") {

			switch (comic) {
				case "dilbert":
					this.getDilbert("en", random);
					break;
				case "dilbert_de":
					this.getDilbert("de", random);
					break;
				case "garfield":
					this.getGarfield(random);
					break;
				case "xkcd":
					this.getXkcd(random);
					break;
				case "nichtlustig":
					this.getNichtLustig(random);
					break;
				case "ruthe":
					this.getRuthe(random);
					break;
				default:
					console.log("Comic not found!");
			}
			//console.log("Comic " + comic + " was chosen")
		}
	},

	getGarfield: function (random) {
		var self = this;
		var url = "https://garfield.com/comic/";
		console.log("-> Garfield request");
		var start = new Date (1979, 1, 1);
    		var end = new Date();
		var randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
		url += moment(randomDate).format("YYYY/MM/DD") + "/";
		console.log("Trying url: "+url);
		request(url, function (error, response, body) {
			var $ = cheerio.load(body);
			var src = $(".img-responsive").attr('src');
			console.log("Garfield -> " + src);
			self.sendSocketNotification("COMIC", {
				img : src
			});
		});
		return;
	},

	getDilbert: function (lang, random) {
		var self = this;
		var url = (lang == "en") ? "https://dilbert.com/" : "https://www.ingenieur.de/unterhaltung/dilbert/" ;
		console.log("-> Dilbert request");
		if (random && (lang == "en")) {
			var start = new Date (2000, 1, 1);
			var end = new Date();
  			var randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
			//console.log("Random Date: "+randomDate);
			url += moment(randomDate).format("YYYY-MM-DD") + "/";
		}
		request(url, function (error, response, body) {
			var $ = cheerio.load(body);
			var imgClass = (lang == "en") ? ".img-comic" : ".size-large"
			var src = $(imgClass).attr('src');
			console.log("Dilbert -> " + src);
			self.sendSocketNotification("COMIC", {
				img : src
			});
		});
    	return;
	},

	getRuthe: function (random) {
		var self = this;
		var url = "http://ruthe.de/cartoon/";
		console.log("-> Ruthe request");
		if (random) {
			var randomNr = Math.floor((Math.random() * 3233) + 1);
			url += randomNr + "/datum/asc/"
		} else {
			url += "3233/datum/asc/"
		}
		request(url, function (error, response, body) {
			var $ = cheerio.load(body);
			var src = $("img").attr('src');
			console.log("Ruthe -> " + src);
			self.sendSocketNotification("COMIC", {
			  img : "http://ruthe.de" + src
		  });
		});
		return;
	},

	getXkcd: function (random) {
		var url = "http://xkcd.com/";
		request(url + "info.0.json", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var comic = JSON.parse(body);
				var current = comic.num;
			}
		});

		var date = new Date();
		var dayOfWeek = date.getDay();

		if (!random && [1,3,5].includes(dayOfWeek)) {
			url = url + current;
			console.log("Its Monwedfriday! Showing current xkcd comic!");
		} else {
			console.log("Parsing random comic")
			var randomNumber = Math.floor((Math.random() * current) + 1);
			// use "randomNumber = 1732;" to test with long comic
			url = "http://xkcd.com/" + randomNumber;
		}
		console.log(url);

		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var src = $("#comic").attr('src');
				console.log("xkcd -> " + src);
				self.sendSocketNotification("COMIC", {img : src});
			} else {
				console.log("Error "+error+": Comic could not be fetched");
			}
			return;
		});
	},
});
