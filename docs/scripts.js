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
    })
};
xhr.open('get', "./README.md");
xhr.send();