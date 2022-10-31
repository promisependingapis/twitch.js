// https://stackoverflow.com/questions/247483/http-get-request-in-javascript
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.onerror = function() {
        console.log('Error: ' + xmlHttp.statusText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

var stars = 0;
var downloads = 0;
var contributors = 0;

httpGetAsync('https://api.npmjs.org/downloads/range/2013-08-21:2100-08-21/@twitchapis/twitch.js', (json) => {
    var response = JSON.parse(json);
    var totalDownloads = 0;
    response.downloads.forEach((download) => {
        totalDownloads += download.downloads;
    });
    downloads = totalDownloads;
});

httpGetAsync('https://api.github.com/repos/twitchapis/twitch.js', (json) => {
    var response = JSON.parse(json);
    stars = response.stargazers_count;

});

httpGetAsync('https://api.github.com/repos/twitchapis/twitch.js/stats/contributors', (json) => {
    var response = JSON.parse(json);
    contributors = response.length;
});
