import { request } from "https://cdn.skypack.dev/@octokit/request";
var xhr = new XMLHttpRequest();
xhr.onload = async () => {
    await request('POST /markdown', {
        text: xhr.response
    });
};
xhr.open('get', "./README.md");
xhr.send();