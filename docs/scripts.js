var xhr = new XMLHttpRequest();
xhr.onload = async () => {
    await Octokit.request('POST /markdown', {
        text: xhr.response
    });
};
xhr.open('get', "./README.md");
xhr.send();