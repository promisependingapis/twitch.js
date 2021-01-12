import { request } from "https://cdn.skypack.dev/@octokit/request";
var xhr = new XMLHttpRequest();
xhr.onload = async () => {
    const markdown = await request('POST /markdown', {
        text: xhr.response
    });
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = markdown.data;
    document.getElementsByClassName('File-Viewer')[0].innerHTML = '';
    document.getElementsByClassName('File-Viewer')[0].appendChild(htmlObject);
    [...document.getElementsByClassName('highlight')].forEach((element) => {
        hljs.highlightBlock(element);
        element.style.borderRadius = '1.5vw';
        element.children[0].style.margin = '0';
        element.children[0].style.padding = '1vw';
    });
    [...document.getElementsByTagName('li')].forEach((element) => {
        element.innerHTML = element.innerHTML.replaceAll('[ ]', '<input type="checkbox" disabled>');
        element.innerHTML = element.innerHTML.replaceAll('[X]', '<input type="checkbox" disabled checked>');
        element.innerHTML = element.innerHTML.replaceAll('[x]', '<input type="checkbox" disabled checked>');
    });
    [...document.getElementsByTagName('li')].forEach((element) => {
        if (element.children[0]) {
            element.children[0].href = '';
            element.children[0].outerHTML = element.children[0].outerHTML.replaceAll('href=\"\"', '');
        }
    });
};

function changePage() {
    [...document.getElementsByClassName('SideBarContent')[0].children].forEach((element) => {
        [...element.children].forEach((filds) => {
            if (location.hash === '') {
                xhr.open('get', "https://raw.githubusercontent.com/twitchapis/twitch.js/main/README.md");
                xhr.send();
            }
            if (filds.href && filds.href.split('#')[1] && ('#' + filds.href.split('#')[1]) === location.hash) {
                document.getElementById('SideBarSelected').id = '';
                filds.id = 'SideBarSelected';
                if (location.hash.slice(1) === 'GenWelcome') {
                    xhr.open('get', "https://raw.githubusercontent.com/twitchapis/twitch.js/main/README.md");
                    xhr.send();
                } else {
                    var dxhr = new XMLHttpRequest();
                    dxhr.onload = async () => {
                        function AdjustSize() {
                            if (document.getElementsByClassName('FVProps')[0].scrollHeight > document.getElementsByClassName('FVMethods')[0].scrollHeight) {
                                document.getElementsByClassName('FVMethods')[0].style.height = (document.getElementsByClassName('FVProps')[0].scrollHeight - ((2/100)*window.innerWidth)) + 'px';
                            } else {
                                document.getElementsByClassName('FVProps')[0].style.height = (document.getElementsByClassName('FVMethods')[0].scrollHeight - ((2/100)*window.innerWidth)) + 'px';
                            }
                        }
                        var Element = document.createElement('div');
                        document.getElementsByClassName('File-Viewer')[0].innerHTML = '';
                        window.removeEventListener('resize', AdjustSize);
                        var json = JSON.parse(dxhr.response);
                        if (json.classes.find(values => values.name === location.hash.slice(1))) {
                            // CLASSES
                            element = json.classes.find(values => values.name === location.hash.slice(1));
                            Element.innerHTML = '<h2 class="FVTitle">' + element.name + ' ' + (element.extends ? '<span>' + 'extends ' + (json.classes.find(values => values.name === element.extends[0][0][0]) ? '<a href="#' + element.extends[0][0][0] + '">' + element.extends[0][0][0] + '</a>' : '<green>' + element.extends[0][0][0] + '</green>') + '</span>' : '') + '</h2>';
                            Element.innerHTML += '<p class="FVDescription">About: <br><span>' + element.description + '</span></p>'
                            if (element.props) {
                                var proper = '';
                                proper += '<div class="FVProps"><p>Properties:</p>'
                                element.props.forEach((prop) => {
                                    proper += `<a onClick="GoToThing('${prop.name}')">` + prop.name + '</a><br>';
                                });
                                proper += '</div>';
                                Element.innerHTML += proper;
                            }
                            if (element.methods) {
                                var methoder = '';
                                methoder += '<div class="FVMethods"><p>Methods:</p>'
                                element.methods.forEach((method) => {
                                    methoder += `<a onClick="GoToThing('${method.name}')">` + method.name + '</a><br>';
                                });
                                methoder += '</div>';
                                Element.innerHTML += methoder;
                            }
                            if (element.props) {
                                Element.innerHTML += '<h3 class = "FVPropierts">Properties:</h3>';
                                element.props.forEach((prop) => {
                                    Element.innerHTML += '<h4 class="FileViewerPropriety' + prop.name + '">.' + prop.name + (prop.access === 'private' ? '<redbox>Private</redbox>' : '') + '<br><p>' + prop.description + '</p>' + (prop.type ? (((json.classes.find(values => values.name === prop.type[0][0][0])) || (json.typedefs.find(values => values.name === prop.type[0][0][0]))) ? '<sub>type: <a href="#' + prop.type[0][0][0] + '">' + prop.type[0][0][0] + '</a></sub>' : '<sub>type: <green>' + prop.type[0][0][0] + '<green></sub>') : '') + '</h4>'
                                });
                            }
                        }
                        if (json.typedefs.find(values => values.name === location.hash.slice(1))) {
                            // typedefs
                            Element.innerHTML = '<h2 class="FVTitle">Teste2</h2>';
                        }
                        /*
                         * Finish
                         */
                        document.getElementsByClassName('File-Viewer')[0].appendChild(Element);
                        if (json.classes.find(values => values.name === location.hash.slice(1)) && element.methods && element.props) {
                            AdjustSize()
                            window.addEventListener('resize', AdjustSize);
                        }
                    };
                    dxhr.open('get', "./json/docs.json");
                    dxhr.send();
                }
            }
            window.scroll(0,0)
        })
    });
}

changePage()
window.addEventListener('hashchange', changePage)