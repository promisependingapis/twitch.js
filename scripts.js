document.getElementsByClassName('Content')[0].style.marginTop = ((3.5/100)*window.innerWidth) + 'px';
document.getElementsByClassName('Content')[0].style.height = window.innerHeight - ((3.5/100)*window.innerWidth) + 'px';

window.onresize = () => {
    document.getElementsByClassName('Content')[0].style.marginTop = ((3.5/100)*window.innerWidth) + 'px';
    document.getElementsByClassName('Content')[0].style.height = window.innerHeight - ((3.5/100)*window.innerWidth) + 'px';
}

// https://stackoverflow.com/questions/247483/http-get-request-in-javascript
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

httpGetAsync('https://api.npmjs.org/downloads/range/2013-08-21:2100-08-21/@twitchapis/twitch.js', (json) => {
    var response = JSON.parse(json);
    var totalDownloads = 0;
    response.downloads.forEach((download) => {
        totalDownloads += download.downloads;
    })
    document.getElementsByClassName('TotalDownloads')[0].innerText = totalDownloads.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' downloads on npm';
    var TextArray = document.getElementsByClassName('FooterStatistics')[0].innerText.toString().split('Loading');
    TextArray.shift();
    document.getElementsByClassName('FooterStatistics')[0].innerText = totalDownloads.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + TextArray.join('Loading');

    httpGetAsync('https://api.github.com/repos/twitchapis/twitch.js', (json) => {
        var response = JSON.parse(json);
        document.getElementsByClassName('TotalStars')[0].innerText = response.stargazers_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' stars on Github';
        var TextArray = document.getElementsByClassName('FooterStatistics')[0].innerText.toString().split('Loading');
        document.getElementsByClassName('FooterStatistics')[0].innerText = TextArray[0] + response.stargazers_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' stars, Loading ' + TextArray[2];

        httpGetAsync('https://api.github.com/repos/twitchapis/twitch.js/stats/contributors', (json) => {
            var response = JSON.parse(json);
            document.getElementsByClassName('TotalContributors')[0].innerText = response.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' contributors on Github'
            var TextArray = document.getElementsByClassName('FooterStatistics')[0].innerText.toString().split('Loading');
            document.getElementsByClassName('FooterStatistics')[0].innerText = TextArray[0] + response.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' contributors';
        });
    });
});

hljs.initHighlightingOnLoad();

function CopyToClipboard(ElementName, fallbackColor) {
    var copyText = document.getElementsByClassName(ElementName)[0];
    navigator.clipboard.writeText(copyText.innerText).then(() => {
        copyText.style.setProperty('background-color', '#5555FF', 'important');
        var backupText = copyText.innerText;
        copyText.innerText = 'Copied to clipboard!';
        copyText.onclick = () => {};
        setTimeout(()=>{
            copyText.style.backgroundColor = fallbackColor;
            copyText.innerText = backupText;
            copyText.onclick = ()=>{CopyToClipboard(ElementName, fallbackColor)};
        }, 1500);
    });
} 