const footer = document.createElement('footer');
footer.classList.add('footer');
const footerTitle = document.createElement('h4');
footerTitle.innerText = 'Twitch.JS';
footer.appendChild(footerTitle);
const footerParagraph = document.createElement('p');
footerParagraph.innerText = 'Created by ';
const footerParagraphLink = document.createElement('a');
footerParagraphLink.href = 'https://github.com/promisependingapis';
footerParagraphLink.innerText = 'Promise<Pending>Apis';
footerParagraph.appendChild(footerParagraphLink);
footer.appendChild(footerParagraph);
const footerParagraph2 = document.createElement('p');
footerParagraph2.classList.add('FooterStatistics');
const footerParagraph2Text = document.createElement('span');
footerParagraph2Text.classList.add('FooterStatisticsDownloads');
footerParagraph2Text.innerText = 'Loading';
footerParagraph2.appendChild(footerParagraph2Text);
footerParagraph2.appendChild(document.createTextNode(' downloads, '));
const footerParagraph2Text2 = document.createElement('span');
footerParagraph2Text2.classList.add('FooterStatisticsStars');
footerParagraph2Text2.innerText = 'Loading';
footerParagraph2.appendChild(footerParagraph2Text2);
footerParagraph2.appendChild(document.createTextNode(' stars, '));
const footerParagraph2Text3 = document.createElement('span');
footerParagraph2Text3.classList.add('FooterStatisticsContributors');
footerParagraph2Text3.innerText = 'Loading';
footerParagraph2.appendChild(footerParagraph2Text3);
footerParagraph2.appendChild(document.createTextNode(' contributors'));
footer.appendChild(footerParagraph2);
const footerButton = document.createElement('button');
footerButton.onclick = () => {
    window.location = 'https://github.com/promisependingapis/twitch.js';
};
footerButton.innerText = 'Github';
footer.appendChild(footerButton);


function addFooter() {
    document.getElementById('fileViewer').appendChild(footer);
}

function updateFooter() {
    [...document.getElementsByClassName('FooterStatisticsDownloads')].forEach((element) => {
        element.innerText = downloads.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    });
    [...document.getElementsByClassName('FooterStatisticsStars')].forEach((element) => {
        element.innerText = stars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    });
    [...document.getElementsByClassName('FooterStatisticsContributors')].forEach((element) => {
        element.innerText = contributors.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    });
}