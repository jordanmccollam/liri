require("dotenv").config();
var fs = require('fs');
var axios = require('axios');
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');

var spotify = new Spotify(keys.spotify);


// ANCHOR prompt
inquirer
    .prompt(
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "commands"
        },
    ).then(answers => {

        switch(answers.commands) {
            case 'concert-this':
                inquirer.prompt({
                    type: "input",
                    message: "Who do you want to see?",
                    name: "artist"
                }).then(answers => {
                    concertThis(answers.artist);
                })
            break;
            case 'spotify-this-song':
                inquirer.prompt({
                    type: "input",
                    message: "What song do you want to spotify?",
                    name: "song"
                }).then(answers => {
                    spotifyThis(answers.song);
                })
            break;
            case 'movie-this':
                inquirer.prompt({
                    type: "input",
                    message: "What movie do you want to look up?",
                    name: "movie"
                }).then(answers => {
                    movieThis(answers.movie.split(" ").join("+"));
                })
            break;
            case 'do-what-it-says':
                doWhatItSays();
            break;
        }

    })




// ANCHOR Concert
function concertThis(artist) {
    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    console.log(url);
    axios
    .get(url)
    .then(function(response){
        console.log("Venue Name: " + response.data[0].venue.name);
        console.log("Venue Location: " + response.data[0].venue.city);
        var convertedDate = moment(response.data[0].datetime).format("MM/DD/YYYY");
        console.log("Concert Date: " + convertedDate);
    })
}

// ANCHOR Spotify
function spotifyThis(song) {
    if (!song) {
        spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            } else {
                console.log("Artist: " + data.tracks.items[5].artists[0].name);
                console.log("Song: " + data.tracks.items[5].name);
                console.log("Preview URL: " + data.tracks.items[5].preview_url);
                console.log("Album: " + data.tracks.items[5].album.name);
            }
        })
    } else {
        spotify.search({ type: 'track', query: song }, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            } else {
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Song: " + data.tracks.items[0].name);
                console.log("Preview URL: " + data.tracks.items[0].preview_url);
                console.log("Album: " + data.tracks.items[0].album.name);
            }
        })
    }
}

// ANCHOR Movie
function movieThis(movie) {
    if (!movie) {
        axios
        .get("http://www.omdbapi.com/?apikey=trilogy&t=mr+nobody")
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
    } else {
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
}

// ANCHOR Do what it says
function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) throw err;

        var dataArr = data.split(",");
        var parameter = dataArr[1];
        
        if (data.includes("spotify-this-song")) {
            spotifyThis(parameter);
        }
        else if (data.includes("concert-this")) {
            concertThis(parameter);
        }
        else if (data.includes("movie-this")) {
            movieThis(parameter.split(" ").join("+"));
        }
    })
}




