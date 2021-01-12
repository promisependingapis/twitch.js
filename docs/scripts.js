document.getElementsByClassName('File-Viewer')[0].style.marginTop = ((3.5/100)*window.innerWidth) + 'px';
document.getElementsByClassName('File-Viewer')[0].style.height = window.innerHeight - ((3.5/100)*window.innerWidth) + 'px';
document.getElementsByClassName('SideBar')[0].style.marginTop = ((8.5/100)*window.innerWidth) + 'px';
document.getElementsByClassName('SideBar')[0].style.height = window.innerHeight - ((8.5/100)*window.innerWidth) + 'px';
window.onresize = () => {
    document.getElementsByClassName('File-Viewer')[0].style.marginTop = ((3.5/100)*window.innerWidth) + 'px';
    document.getElementsByClassName('File-Viewer')[0].style.height = window.innerHeight - ((3.5/100)*window.innerWidth) + 'px';
    document.getElementsByClassName('SideBar')[0].style.marginTop = ((8.5/100)*window.innerWidth) + 'px';
    document.getElementsByClassName('SideBar')[0].style.height = window.innerHeight - ((8.5/100)*window.innerWidth) + 'px';
}

function GoToThing(Thing) {
    document.getElementsByClassName('FileViewerPropriety' + Thing)[0].scrollIntoView();
    window.scrollTo({
        top: (window.scrollY - ((12/100)*window.innerWidth)),
        behavior: 'smooth'
    })
}