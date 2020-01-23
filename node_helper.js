/****************
Node helper for MMM-Comics module
****************/

var request = require("request");
var NodeHelper = require("node_helper");
var cheerio = require("cheerio");
var moment = require("moment");

module.exports = NodeHelper.create({

  config: [],

  start: function () {
    console.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_COMIC") {
      this.config = payload.config;
      var comic = payload.comic.toLowerCase();
      var random = payload.config.random;
      var dailyTime = payload.config.timeForDaily;
      var dailyStart = moment(dailyTime[0], "k").format();
      var dailyEnd = moment(dailyTime[1], "k").format();
      if (moment().isBetween(dailyStart, dailyEnd)) { random = false; }

      this.log("Notification: " + notification + " Payload: " + comic);

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
        case "peanuts":
          this.getPeanuts(random);
          break;
        case "calvin+hobbes":
          this.getCalvinandHobbes(random);
          break;
        /*case "nichtlustig":
          this.getNichtLustig(random);
          break;*/
        case "ruthe":
          this.getRuthe(random);
          break;
        default:
          this.log("Comic not found!");
      }
    }
  },

  getGarfield: function (random) {
    var self = this;
    var url = "https://garfield.com/comic/";
    this.log("-> Garfield request");
    var start = new Date (1979, 1, 1);
    var end = new Date();
    var comicDate = (random) ? new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())) : end;
    url += moment(comicDate).format("YYYY/MM/DD") + "/";
    this.log("Trying url: "+url);
    request(url, function (error, response, body) {
      var $ = cheerio.load(body);
      var src = $(".img-responsive").attr('src');
      self.log("Garfield -> " + src);
      self.sendSocketNotification("COMIC", {
        img : src
      });
    });
    return;
  },

  getPeanuts: function (random) {
    var self = this;
    var url = "https://www.gocomics.com/peanuts/";
    this.log("-> Peanuts request");
    var start = new Date (1952, 1, 1);
    var end = new Date();
    var comicDate = (random) ? new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())) : end;
    url += moment(comicDate).format("YYYY/MM/DD") + "/";
    this.log("Trying url: "+url);
    request(url, function (error, response, body) {
      var $ = cheerio.load(body);
      var src = $(".item-comic-image .img-fluid").attr('src');
      self.log("Peanuts -> " + src);
      self.sendSocketNotification("COMIC", {
        img : src
      });
    });
    return;
  },

  getCalvinandHobbes: function (random) {
    var self = this;
    var url = "https://www.gocomics.com/calvinandhobbes/";
    this.log("-> Calvin and Hobbes request");
    var start = new Date (1985, 11, 18);
    var end = new Date(1995, 12, 31);
    var comicDate = (random) ? new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())) : end;
    url += moment(comicDate).format("YYYY/MM/DD") + "/";
    this.log("Trying url: "+url);
    request(url, function (error, response, body) {
      var $ = cheerio.load(body);
      //console.log($(".img-fluid"));
      var src = $(".item-comic-image .img-fluid").attr('src');
      self.log("Calvin and Hobbes -> " + src);
      self.sendSocketNotification("COMIC", {
        img : src
      });
    });
    return;
  },

  getDilbert: function (lang, random) {
    var self = this;
    var url = (lang == "en") ? "https://dilbert.com/" : "https://www.ingenieur.de/unterhaltung/dilbert/" ;
    this.log("-> Dilbert request");
    if (random && (lang == "en")) {
      var start = new Date (2000, 1, 1);
      var end = new Date();
      var randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      this.log("Random Date: "+randomDate);
      url += moment(randomDate).format("YYYY-MM-DD") + "/";
    }
    request(url, function (error, response, body) {
      var $ = cheerio.load(body);
      var imgClass = (lang == "en") ? ".img-comic" : ".size-large";
      var src = $(imgClass).attr('src');
      self.log("Dilbert -> " + src);
      self.sendSocketNotification("COMIC", {
        img : src
      });
    });
    return;
  },

  getRuthe: function (random) {
    var self = this;
    var url = "http://ruthe.de/cartoon/";
    this.log("Ruthe request");
    if (random) {
      var randomNr = Math.floor((Math.random() * 3233) + 1);
      url += randomNr;
    } else {
      url += "3233";
    }
    this.log("Ruthe URL: "+url);
    request(url, function (error, response, body) {
      var $ = cheerio.load(body);
      var src = $("#link_archive > img").attr('src');
      self.log("Ruthe -> " + src);
      self.sendSocketNotification("COMIC", {
        img : "http://ruthe.de" + src
      });
    });
    return;
  },

  /*getNichtLustig: function (random) {
    var self = this;
    var url = "http://static.nichtlustig.de/toondb";
    this.log("Nichtlustig request");
    var min = 501;
    var max = 150422;
    var randomNr = Math.floor((Math.random() * 149922) + 501);
    url += randomNr.padStart(6, '0') + ".html";
    this.log("Nichtlustig Comic URL: "+url);
    request(url, function (error, response, body) {
      var $ = cheerio.load(body);
      var src = $("").attr('');
      self.log("Nichtlustig comic -> " + src);
      self.sendSocketNotification("COMIC", {
        img : ""
      });
    });
    return;
  },*/

  getXkcd: function (random) {
    var self = this;
    var baseUrl = "http://xkcd.com/";
    request(baseUrl + "info.0.json", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var comic = JSON.parse(body);
        var current = comic.num;

        var date = new Date();
        var dayOfWeek = date.getDay();
        var url = "http://xkcd.com/";

        if (!random && [1,3,5].includes(dayOfWeek)) {
          url = url + current;
          self.log("Its Monwedfriday! Showing current xkcd comic!");
        } else {
          self.log("It's not Monwedfriday! Parsing random comic");
          var randomNumber = Math.floor((Math.random() * current) + 1);
          url = "http://xkcd.com/" + randomNumber;
        }
        self.log(url);
        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var src = $("#comic img").attr('src');
            self.log("xkcd src -> " + src);
            self.sendSocketNotification("COMIC", {img : src});
          } else {
            self.log("Error "+error+": Comic could not be fetched");
          }
        });
      }
    });
  },

  log: function (msg) {
    if (this.config && this.config.debug) {
      console.log(this.name + ":", JSON.stringify(msg));
    }
  },
});
