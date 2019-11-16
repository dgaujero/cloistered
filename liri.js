require("dotenv").config();

var axios = require("axios");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var fs = require("fs");
var moment = require('moment');
var spotify = new Spotify(keys.spotify);

var userInput = "";
var action = process.argv[2];
userInput = process.argv.slice(3).join("+");

switch (action) {
    case "concert-this":
        concert();
        break;

    case "spotify-this-song":
        music();
        break;

    case "movie-this":
        getMovie();
        break;

    case "do-what-it-says":
        doIt();
        break;
}

function concert() {
    axios.get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp").then(
        function (response) {
            for (i = 0; i < response.data.length; i++) {
                var venue = response.data[i].venue.name;
                var city = response.data[i].venue.city;
                var date = response.data[i].datetime;
                // var newDate = date.split("T")
                // console.log(newDate[0]);
                // console.log(newDate[1]);
                var date2 = new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                });
                console.log("Venue: " + venue);
                console.log("City: " + city);
                console.log("Date: " + moment(date).format("MM/DD/YYYY"));
                console.log("==================================")
            };
        });
};

function music() {
    spotify
        .search({ type: 'track', query: userInput })
        .then(function (response) {
            for (let i = 0; i < response.tracks.items.length; i++) {
                if (i == 0) {
                    var artists = response.tracks.items[0].artists;
                    var artistStr = "Artists: ";
                    for (let j = 0; j < artists.length; j++) {
                        artistStr += artists[j].name;
                    }
                    console.log(artistStr);
                    console.log("Song name: " + response.tracks.items[0].name);
                    console.log("Song link: " + response.tracks.items[0].external_urls.spotify);
                    console.log("Album name: " + response.tracks.items[0].album.name);
                };
            }
            // console.log(Object.keys(response.tracks));
        })
        .catch(function (err) {
            console.log(err);
        });
};

function getMovie() {
    if (userInput == undefined) {
        axios.get("http://www.omdbapi.com/?apikey=trilogy&i=tt0485947&type=movie").then(
            function (response1) {
                var title = "Title: " + response1.data.Title;
                var year = "Year: " + response1.data.Year;
                var country = "Country: " + response1.data.Country;
                var plot = "Plot: " + response1.data.Plot;
                var actors = "Actors: " + response1.data.Actors;
                console.log(title);
                console.log(year);
                console.log(country);
                console.log(plot);
                console.log(actors);
            }
        );
    }
    else {
        var movieQueryURL = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
        axios.request(movieQueryURL).then(function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country Where Produced: " + response.data.Country);
            console.log("Movie Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
          });
    }
};

function doIt() {
    
    fs.readFile("random.txt", "utf8", function(error, data) {
        if(error) {
          return console.log(error);
        }
        console.log(data);
        var randomTxt = data.split(",");
        userInput = randomTxt[1];
        music();
      });
}
