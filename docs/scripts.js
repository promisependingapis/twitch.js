document.getElementsByClassName('File-Viewer')[0].style.marginTop = ((3.5/100)*window.innerWidth) + 'px';
document.getElementsByClassName('File-Viewer')[0].style.height = window.innerHeight - ((3.5/100)*window.innerWidth) + 'px';
setTimeout(() => {
    document.getElementsByTagName('body')[0].style.height = document.getElementsByTagName('html')[0].scrollHeight + ((3.5/100)*window.innerWidth) + 'px';
}, 300);
window.onresize = () => {
    document.getElementsByClassName('File-Viewer')[0].style.marginTop = ((3.5/100)*window.innerWidth) + 'px';
    document.getElementsByClassName('File-Viewer')[0].style.height = window.innerHeight - ((3.5/100)*window.innerWidth) + 'px';
}