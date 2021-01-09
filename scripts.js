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