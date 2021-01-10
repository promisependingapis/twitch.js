import { request } from "https://cdn.skypack.dev/@octokit/request";
var xhr = new XMLHttpRequest();
xhr.onload = async () => {
    const markdown = await request('POST /markdown', {
        text: xhr.response
    });
    document.getElementsByClassName('File-viewer').innerHTML = markdown;
};
xhr.open('get', "./README.md");
xhr.send();