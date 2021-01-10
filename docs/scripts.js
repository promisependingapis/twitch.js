import { request } from "https://cdn.skypack.dev/@octokit/request";
var xhr = new XMLHttpRequest();
xhr.onload = async () => {
    const markdown = await request('POST /markdown', {
        text: xhr.response
    });
    console.log(markdown.data);
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = markdown.data;
    document.getElementsByClassName('Content')[0].appendChild(htmlObject);
};
xhr.open('get', "./README.md");
xhr.send();