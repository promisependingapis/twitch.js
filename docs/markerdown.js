import { request } from "https://cdn.skypack.dev/@octokit/request";
var xhr = new XMLHttpRequest();
xhr.onload = async () => {
    const markdown = await request('POST /markdown', {
        text: xhr.response
    });
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = markdown.data;
    document.getElementsByClassName('File-Viewer')[0].appendChild(htmlObject);
    [...document.getElementsByClassName('highlight')].forEach((element) => {
        hljs.highlightBlock(element);
        element.style.borderRadius = '1.5vw';
        element.children[0].style.margin = '0';
        element.children[0].style.padding = '1vw';
    });
    [...document.getElementsByTagName('li')].forEach((element) => {
        element.innerHTML = element.innerHTML.replaceAll('[ ]', '<input type="checkbox" disabled>');
        element.innerHTML = element.innerHTML.replaceAll('[X]', '<input type="checkbox" disabled checked>');
    });
};
xhr.open('get', "./README.md");
xhr.send();