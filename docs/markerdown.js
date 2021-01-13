var xhr = new XMLHttpRequest();
xhr.onload = async () => {
    var md = new Remarkable();
    var MarkdownedHtml = md.render(xhr.response);
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = MarkdownedHtml.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"');
    document.getElementsByClassName('File-Viewer')[0].innerHTML = '';
    document.getElementsByClassName('File-Viewer')[0].appendChild(htmlObject);
    [...document.getElementsByTagName('code')].forEach((element) => {
        if(element.className.startsWith('language-')) {
            element.parentElement.style.borderRadius = '1.5vw';
            element.parentElement.style.margin = '0';
            element.parentElement.style.padding = '1vw';
            hljs.highlightBlock(element.parentElement);
        }
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
    [...document.getElementsByTagName('table')].forEach((element) => {
            element.style.border = '0px';
            element.style.borderCollapse = 'unset';
            element.children[0].style.backgroundColor = '#0000';
            element.children[0].children[0].style.color = '#FFF';
            [...element.children[0].children[0].children].forEach((element2) => {
                element2.style.setProperty('font-size', 'unset', 'important');
                element2.style.setProperty('border', '2px solid #777', 'important');
            })
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
                            var biggest = 0;
                            if (document.getElementsByClassName('FVProps')[0].scrollHeight && document.getElementsByClassName('FVProps')[0].scrollHeight > biggest) {
                                biggest = document.getElementsByClassName('FVProps')[0].scrollHeight;
                            } 
                            if (document.getElementsByClassName('FVMethods')[0].scrollHeight && document.getElementsByClassName('FVMethods')[0].scrollHeight > biggest) {
                                biggest = document.getElementsByClassName('FVMethods')[0].scrollHeight;
                            }
                            if (document.getElementsByClassName('FVEvents')[0] && document.getElementsByClassName('FVEvents')[0].scrollHeight > biggest) {
                                biggest = document.getElementsByClassName('FVEvents')[0].scrollHeight;
                            }
                            document.getElementsByClassName('FVMethods')[0] ? document.getElementsByClassName('FVMethods')[0].style.height = (biggest - ((2/100)*window.innerWidth)) + 'px' : '';
                            document.getElementsByClassName('FVProps')[0] ? document.getElementsByClassName('FVProps')[0].style.height = (biggest - ((2/100)*window.innerWidth)) + 'px' : '';
                            document.getElementsByClassName('FVEvents')[0] ? document.getElementsByClassName('FVEvents')[0].style.height = (biggest - ((2/100)*window.innerWidth)) + 'px' : '';
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
                                    prop.access !== 'private' ? proper += `<a onClick="GoToThing('${prop.name}')">` + prop.name + '</a><br>' : '';
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
                            if (element.events) {
                                var methoder = '';
                                methoder += '<div class="FVEvents"><p>Events:</p>'
                                element.events.forEach((event) => {
                                    methoder += `<a onClick="GoToThing('${event.name}')">` + event.name + '</a><br>';
                                });
                                methoder += '</div>';
                                Element.innerHTML += methoder;
                            }
                            if (element.props) {
                                Element.innerHTML += '<h3 class = "FVPropierts">Properties:</h3>';
                                element.props.forEach((prop) => {
                                    prop.access !== 'private' ? Element.innerHTML += '<h4 class="FileViewerPropriety' + prop.name + '">.' + prop.name + '<br><p>' + prop.description + '</p>' + (prop.type ? (((json.classes.find(values => values.name === prop.type[0][0][0])) || (json.typedefs.find(values => values.name === prop.type[0][0][0]))) ? '<sub>type: <a href="#' + prop.type[0][0][0] + '">' + prop.type[0][0][0] + '</a></sub>' : '<sub>type: <green>' + prop.type[0][0][0] + '<green></sub>') : '') + '</h4>': '';
                                });
                            }
                            if (element.methods) {
                                Element.innerHTML += '<h3 class = "FVMethodies">Methods:</h3>';
                                element.methods.forEach((prop) => {
                                    Element.innerHTML += '<h4 class="FileViewerPropriety' + prop.name + '">.' + prop.name + '<br><p>' + prop.description + '</p>' + (prop.returns && !prop.returns.types ? '<sub>return: <green>' + prop.returns[0][0][0] + (prop.returns[0][0][1] ? '<grayminus>' + prop.returns[0][0][1] + '</grayminus><greenplus>' + prop.returns[0][1][0] + '</greenplus><grayminus>' + prop.returns[0][1][1] + '</grayminus>' + (prop.returns[0][2] ? '<greenplus>' + prop.returns[0][2][0] + '</greenplus><grayminus>' + prop.returns[0][2][1] + '</grayminus>' : '') : '') + '</green></sub>' : '') + (prop.returns && prop.returns.types ? '<sub>return: <green>' + prop.returns.types[0][0][0] + (prop.returns.types[0][0][1] ? '<grayminus>' + prop.returns.types[0][0][1] + '</grayminus><greenplus>' + prop.returns.types[0][1][0] + '</greenplus>' +'<grayminus>' + prop.returns.types[0][1][1] + '</grayminus>': '') + '</green></sub>' : '') + '</h4>';
                                });
                            }
                            if (element.events) {
                                Element.innerHTML += '<h3 class = "FVMethodies">Events:</h3>';
                                element.events.forEach((prop) => {
                                    var table = {
                                        values: ['PARAMETERS', 'TYPE', 'DESCRIPTION'],
                                        string: '<table class="props-table">'
                                    }
                                    table.string += '<thead><tr>'
                                    table.values.forEach((value) => {
                                        table.string += '<th>' + value + '</th>'
                                    })
                                    table.string += '</tr></thead><tbody>'
                                    prop.params.forEach((param) => {
                                        table.string += '<tr>'
                                        table.string += '<td>' + param.name + '</td>'
                                        if (param.type) {
                                            table.string += '<td>'
                                            param.type.forEach((type) => {
                                                if (typeof type === 'object') {
                                                    type.forEach((typ) => {
                                                        if (typeof typ === 'object') {
                                                            table.string += (json.classes.find(values => values.name === typ.join('')) || json.typedefs.find(values => values.name === typ.join('')) ? '<a href="#' + typ.join('') +'">' + typ.join('') + '</a>' : '<green>' + typ.join('') + '</green>')
                                                        } else if (typeof typ === 'string') {
                                                            table.string += (json.classes.find(values => values.name === typ) || json.typedefs.find(values => values.name === typ) ? '<a href="#' + typ +'">' + typ + '</a>' : '<green>' + typ + '</green>')
                                                        }
                                                    });
                                                } else if (typeof type === 'string') {
                                                    table.string += (json.classes.find(values => values.name === type) || json.typefefs.find(values => values.name === type) ? '<a href="#' + type +'">' + type + '</a>' : '<green>' + type + '</green>')
                                                }
                                            })
                                            table.string += '</td>'
                                        }
                                        if (param.description) {table.string += '<td>' + param.description + '</td>'}
                                        table.string += '</tr>'
                                    })
                                    table.string += '</tbody></table>'
                                    Element.innerHTML += '<h4 class="FileViewerPropriety' + prop.name + '">' + prop.name + '<br><p>' + prop.description + '</p>' + table.string + '</h4>'
                                });
                            }
                        }
                        if (json.typedefs.find(values => values.name === location.hash.slice(1))) {
                            // typedefs
                            element = json.typedefs.find(values => values.name === location.hash.slice(1));
                            Element.innerHTML = '<h2 class="FVTitle">' + element.name + '</h2>';
                            Element.innerHTML += '<p class="FVDescription">About: <br><span>' + element.description + '</span></p>'
                            if (element.type) {
                                Element.innerHTML += '<h3 class="FVType">Types:</h3>'
                                element.type.forEach((type) => {
                                    if (typeof type === 'object') {
                                        type.forEach((typ) => {
                                            if (typeof typ === 'object') {
                                                type.forEach((ty) => {
                                                    if (typeof ty === 'object') {
                                                        Element.innerHTML += '<greenplus style="margin-left: 2vw">' + ty.join(' | ') + '</greenplus>'
                                                    } else if (typeof ty === 'string') {
                                                        Element.innerHTML += '<greenplus style="margin-left: 2vw">' + ty + '</greenplus>'
                                                    }
                                                })
                                            } else if (typeof typ === 'string') {
                                                Element.innerHTML += '<greenplus style="margin-left: 2vw">' + typ + '</greenplus>'
                                            }
                                        });
                                    } else if (typeof type === 'string') {
                                        Element.innerHTML += '<greenplus style="margin-left: 2vw">' + type + '</greenplus>'
                                    }
                                })
                                if (element.props) {Element.innerHTML += '<br><br><br><br>'}
                            }
                            if (element.props) {
                                var table = {
                                    values: [],
                                    string: '<table class="props-table">'
                                }
                                element.props.forEach((prop) => {
                                    if (prop.name) {table.values.push('PARAMETER')}
                                    if (prop.type) {table.values.push('TYPE')}
                                    if (typeof prop.optional === 'boolean') {table.values.push('OPTIONAL')}
                                    if (prop.default) {table.values.push('DEFAULT')}
                                    if (prop.description) {table.values.push('DESCRIPTION')}
                                });
                                table.values = [...new Set(table.values)];
                                table.string += '<thead><tr>'
                                table.values.forEach((value) => {
                                    table.string += '<th>' + value + '</th>'
                                })
                                table.string += '</tr></thead><tbody>'
                                element.props.forEach((prop) => {
                                    table.string += '<tr>'
                                    if (prop.name) {table.string += '<td>' + prop.name + '</td>'}
                                    if (prop.type) {
                                        table.string += '<td>'
                                        prop.type.forEach((type) => {
                                            if (typeof type === 'object') {
                                                type.forEach((typ) => {
                                                    if (typeof typ === 'object') {
                                                        table.string += (json.classes.find(values => values.name === typ.join('')) || json.typedefs.find(values => values.name === typ.join('')) ? '<a href="#' + typ.join('') +'">' + typ.join('') + '</a>' : '<green>' + typ.join('') + '</green>')
                                                    } else if (typeof typ === 'string') {
                                                        table.string += (json.classes.find(values => values.name === typ) || json.typedefs.find(values => values.name === typ) ? '<a href="#' + typ +'">' + typ + '</a>' : '<green>' + typ + '</green>')
                                                    }
                                                });
                                            } else if (typeof type === 'string') {
                                                table.string += (json.classes.find(values => values.name === type) || json.typefefs.find(values => values.name === type) ? '<a href="#' + type +'">' + type + '</a>' : '<green>' + type + '</green>')
                                            }
                                        })
                                        table.string += '</td>'
                                    }
                                    if (typeof prop.optional === 'boolean') {table.string += '<td>' + (prop.optional ? '✓' : '❌') + '</td>'}
                                    if (prop.default) {table.string += '<td>' + prop.default + '</td>'} else if (table.values.includes('DEFAULT')) {table.string += '<td>None</td>'}
                                    if (prop.description) {table.string += '<td>' + prop.description + '</td>'}
                                })
                                table.string += '</tbody></table>'
                                Element.innerHTML += table.string;
                            }
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