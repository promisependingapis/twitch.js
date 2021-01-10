import { request } from "https://cdn.skypack.dev/@octokit/request";
var xhr = new XMLHttpRequest();
xhr.onload = async () => {
    const markdown = await request('POST /markdown', {
        text: xhr.response
    });
    console.log(markdown);
    document.getElementsByClassName('File-viewer').innerHTML = markdown.data;
};
xhr.open('get', "./README.md");
xhr.send();