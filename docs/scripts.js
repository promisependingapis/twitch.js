import { Octokit } from "https://cdn.skypack.dev/@octokit/core";
var xhr = new XMLHttpRequest();
xhr.onload = () => {
    Octokit.request('POST /markdown', {
        text: xhr.response
    });
};
xhr.open('get', "./README.md");
xhr.send();