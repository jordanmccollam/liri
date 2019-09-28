require("dotenv").config();
var fs = require('fs');
var axios = require('axios');
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];

// inquirer
//     .prompt([
//         {
//             type: "list",
//             message: "What would you like to do?",

//         }
//     ])


switch(command) {
    case 'concert-this':
        concertThis();
    break;
    case 'spotify-this-song':
        spotifyThis();
    break;
    case 'movie-this':
        movieThis();
    break;
    case 'do-what-it-says':
        doWhatItSays();
    break;
    default:
        console.log(command + " is not a valid command");
}



// ANCHOR Concert
function concertThis() {
    var artist = process.argv[3];

    axios
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response){
        console.log(response.data[0].venue.name);
        console.log(response.data[0].venue.city);
        var convertedDate = moment(response.data[0].datetime).format("MM/DD/YYYY");
        console.log(convertedDate);
    })
}

// ANCHOR Spotify
function spotifyThis() {
    var song = process.argv[3];

    if (!song) {
        spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            } else {
                console.log(data.tracks.items[5].artists[0].name);
                console.log(data.tracks.items[5].name);
                console.log(data.tracks.items[5].preview_url);
                console.log(data.tracks.items[5].album.name);
            }
        })
    } else {
        spotify.search({ type: 'track', query: song }, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            } else {
                console.log(data.tracks.items[0].artists[0].name);
                console.log(data.tracks.items[0].name);
                console.log(data.tracks.items[0].preview_url);
                console.log(data.tracks.items[0].album.name);
            }
        })
    }
}

// ANCHOR Movie
function movieThis() {
    var movie = process.argv[3];

    axios
    .get("http://www.omdbapi.com/?apikey=trilogy&t=" + movie + "")
    .then(function(response) {
        console.log("Title: " + response.data.Title);
        console.log("Release Year: " + response.data.Year);
        console.log("IMDB: " + response.data.imdbRating);
        console.log("Rotton Tomatoes: " + response.data.Ratings[1].Value);
        console.log("Country Produced: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
    })
}

// ANCHOR Do what it says
// function doWhatItSays() {

//     fs.readFile("random.txt", "utf8", function(err, data) {
//         if (err) throw err;
        
        
//     })
// }




