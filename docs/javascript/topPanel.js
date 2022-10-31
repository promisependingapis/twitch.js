const smallScreen = 1050;

window.addEventListener('resize', selfCloseSmallScreen);
selfCloseSmallScreen();

function selfCloseSmallScreen() {
    if (window.innerWidth < smallScreen) {
        toggleSidePanel(false);
    }
}

function toggleSidePanel(forceState) {
    [...document.getElementsByClassName('ToggleLeftSide')].forEach((element) => {
        if (element.classList.contains('active') && (forceState === undefined || forceState === false)) {
            element.classList.remove('active');
            if (window.innerWidth < smallScreen) {
                document.documentElement.style.setProperty('--AmountOfViews', '1fr');
                document.getElementById('sideBar').style.opacity = '0';
            } else {
                document.getElementById('sideBar').style.opacity = '1';
                document.getElementById('sideBar').style.marginLeft = '-100%';
            }
            setTimeout(() => {
                if (!element.classList.contains('active')) {
                    document.documentElement.style.setProperty('--AmountOfViews', '1fr');
                    document.getElementById('sideBar').style.display = 'none';
                }
            }, 300);
        } else if (!element.classList.contains('active') && (forceState === undefined || forceState === true)) {
            element.classList.add('active');
            document.getElementById('sideBar').style.display = 'flex';
            if (window.innerWidth < smallScreen) {
                document.getElementById('sideBar').style.opacity = '0';
                document.getElementById('sideBar').style.marginLeft = '0';
                document.documentElement.style.setProperty('--AmountOfViews', '1fr');
            } else {
                document.getElementById('sideBar').style.opacity = '1';
                document.documentElement.style.setProperty('--AmountOfViews', '20rem 1fr');
            }
            setTimeout(() => {
                if (element.classList.contains('active')) {
                    document.getElementById('sideBar').style.opacity = '1';
                    document.getElementById('sideBar').style.marginLeft = '0';
                }
            }, 300);
        }
    });
}