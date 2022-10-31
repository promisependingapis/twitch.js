function textToHTML(text) {
  var md = new Remarkable();
  var MarkdownHtml = md.render(text);
  var htmlObject = document.createElement("div");
  htmlObject.innerHTML = MarkdownHtml.replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"');
  
  [...htmlObject.getElementsByTagName("code")].forEach((element) => {
    if (element.className.startsWith("language-")) {
      element.parentElement.className = "blockOfCode";
      element.innerHTML = hljs.highlightAuto(
        element.parentElement.innerText
      ).value;
      [...element.children].forEach((cElement) => {
        if (!cElement.className.includes("hljs-")) {
          cElement.className = "hljs-string";
          [...cElement.children].forEach((CCElement) => {
            CCElement.outerHTML = CCElement.innerHTML;
          });
        }
      });
      element.innerHTML = element.innerHTML.replaceAll(
        "const ",
        '<span class="hljs-variableKeyWord">const </span>'
      );
    }
  });
  [...htmlObject.getElementsByTagName("li")].forEach((element) => {
    element.innerHTML = element.innerHTML.replaceAll(
      "[ ]",
      '<input type="checkbox" disabled>'
    );
    element.innerHTML = element.innerHTML.replaceAll(
      "[X]",
      '<input type="checkbox" disabled checked>'
    );
    element.innerHTML = element.innerHTML.replaceAll(
      "[x]",
      '<input type="checkbox" disabled checked>'
    );
  });
  [...htmlObject.getElementsByTagName("li")].forEach((element) => {
    [...element.children].forEach((element) => {
      if (element.tagName === "A") {
        element.href = "#";
      }
    })
  });
  [...htmlObject.getElementsByTagName("table")].forEach((element) => {
    element.style.border = "0px";
    element.className = "readme-table";
    element.style.borderCollapse = "unset";
    element.children[0].style.backgroundColor = "#0000";
    element.children[0].children[0].style.color = "#FFF";
    element.children[0].children[0].style.display = "flex";
    element.children[0].children[0].style.flexDirection = "row";
    [...element.children[0].children[0].children].forEach((element2) => {
      element2.style.setProperty("font-size", "unset", "important");
      element2.style.setProperty(
        "border",
        "2px solid var(--complementary-color)",
        "important"
      );
      element2.style.setProperty("margin-left", "0.25rem");
      element2.style.setProperty("margin-right", "0.25rem");
      element2.style.setProperty("display", "block", "important");
      element2.style.setProperty(
        "background-color",
        "var(--box-color)",
        "important"
      );
      element2.className = "readme-table-cell";
    });
  });
  return htmlObject;
}

var xhr = new XMLHttpRequest();
xhr.onload = async () => {
  const html = textToHTML(xhr.response);
  html.classList.add("Viewer");
  document.getElementById("fileViewer").innerHTML = "";
  document.getElementById("fileViewer").appendChild(html);
  addFooter();
  updateFooter();
};

function renderFileViewer(json) {
  // Its a element path
  const foundElements = [];
  var elementPath = window.location.hash.substring(1);
  document.getElementById("fileViewer").innerHTML = "";
  function search(json) {
    if (!json.children) return;
    json.children.forEach((item => {
      if ((item.kind === 128 || item.kind === 8 || item.kind === 256) && item.name === elementPath) {
        if (item.flags.isPrivate) return;
        foundElements.push(item);
      }
      search(item);
    }));
  }
  search(json);
  if (foundElements.length > 0) {
    foundElements.forEach((element) => {
      const viewer = document.createElement('fieldset');
      viewer.classList.add('Viewer');
      viewer.classList.add('open');
      const legend = document.createElement('legend');
      const legendSubText = document.createElement('span');
      legendSubText.classList.add('legendSubText');
      legendSubText.classList.add('redText');
      legendSubText.innerText = element.name;
      if (element.extendedTypes) {
        const extendsElement = document.createElement('span');
        extendsElement.innerText = ' extends ';
        extendsElement.classList.add('grayText');
        element.extendedTypes.forEach((extendedType, index) => {
          const green = document.createElement('span');
          green.classList.add('greenText');
          green.innerText = extendedType.name;
          extendsElement.appendChild(green);
          if (element.extendedTypes.length - 1 !== index) {
            const comma = document.createElement('span');
            comma.innerText = ', ';
            extendsElement.appendChild(comma);
          }
        })
        legendSubText.appendChild(extendsElement);
      }
      legend.innerText = element.kindString;
      legend.appendChild(legendSubText);
      legend.onclick = () => {
        if (viewer.classList.contains('open')) {
          viewer.classList.remove('open');
          viewer.classList.add('closed');
        } else {
          viewer.classList.add('open');
          viewer.classList.remove('closed');
        }
      };
      viewer.appendChild(legend);
      renderElementFileViewer(element, viewer);
      document.getElementById('fileViewer').appendChild(viewer);
    });
  } else {
    window.location.hash = "";
    changePage();
  }
}

function getTypeExists(name) {
  return document.getElementById('sideBar').querySelectorAll("[href='#" + name + "']").length > 0;
}

function renderParameterBox(parameter) {
  const parameterBoxDiv = document.createElement('div');
  const parameterBox = document.createElement("table");
  parameterBox.classList.add("parameterBox");
  parameterBox.classList.add("hideOnMobile");
  const parameterBoxHead = document.createElement("thead");
  const parameterBoxHeader = document.createElement("tr");
  const parameterBoxHeaderName = document.createElement("th");
  parameterBoxHeaderName.innerText = "Name";
  const parameterBoxHeaderType = document.createElement("th");
  parameterBoxHeaderType.innerText = "Type";
  const parameterBoxHeaderDescription = document.createElement("th");
  parameterBoxHeaderDescription.innerText = "Description";
  const parameterBoxHeaderIsOptional = document.createElement("th");
  parameterBoxHeaderIsOptional.innerText = "Optional";
  const parameterBoxHeaderDefaultValue = document.createElement("th");
  parameterBoxHeaderDefaultValue.innerText = "Default Value";
  parameterBoxHeader.appendChild(parameterBoxHeaderName);
  parameterBoxHeader.appendChild(parameterBoxHeaderType);
  parameterBoxHeader.appendChild(parameterBoxHeaderIsOptional);
  parameterBoxHeader.appendChild(parameterBoxHeaderDefaultValue);
  parameterBoxHeader.appendChild(parameterBoxHeaderDescription);
  parameterBoxHead.appendChild(parameterBoxHeader);
  parameterBox.appendChild(parameterBoxHead);
  const parameterBoxBody = document.createElement("tbody");
  parameter.forEach((parameter) => {
    const parameterBoxRow = document.createElement("tr");
    const parameterBoxRowName = document.createElement("td");
    parameterBoxRowName.innerText = parameter.name;
    const parameterBoxRowType = document.createElement("td");
    parameterBoxRowType.appendChild(renderTypeText(parameter.type));
    const parameterBoxRowIsOptional = document.createElement("td");
    parameterBoxRowIsOptional.innerText = parameter.flags.isOptional ? '✅' : '❌';
    const parameterBoxRowDefaultValue = document.createElement("td");
    parameterBoxRowDefaultValue.innerText = parameter.defaultValue ? parameter.defaultValue : 'None';
    const parameterBoxRowDescription = document.createElement("td");
    parameterBoxRowDescription.innerText = parameter.comment ? parameter.comment.text ? parameter.comment.text : parameter.comment.summary.map((summary) => summary.text).join('\n') : '';
    parameterBoxRow.appendChild(parameterBoxRowName);
    parameterBoxRow.appendChild(parameterBoxRowType);
    parameterBoxRow.appendChild(parameterBoxRowIsOptional);
    parameterBoxRow.appendChild(parameterBoxRowDefaultValue);
    parameterBoxRow.appendChild(parameterBoxRowDescription);
    parameterBoxBody.appendChild(parameterBoxRow);
  });
  parameterBox.appendChild(parameterBoxBody);
  parameterBoxDiv.appendChild(parameterBox);
  // -------------[ Mobile layout table]-[Start]----------------
  const parameterBoxMobile = document.createElement('table');
  parameterBoxMobile.classList.add('parameterBoxMobile');
  parameterBoxMobile.classList.add('showOnlyOnMobile');
  parameterBoxMobile.setAttribute('aria-hidden', 'true');
  // Name
  const parameterBoxNameRow = document.createElement('tr');
  const parameterBoxNameRowTitle = document.createElement('th');
  const parameterBoxNameRowTitleText = document.createElement('span');
  parameterBoxNameRowTitleText.innerText = 'Name';
  parameterBoxNameRowTitle.appendChild(parameterBoxNameRowTitleText);
  parameterBoxNameRow.appendChild(parameterBoxNameRowTitle);
  // Type
  const parameterBoxTypeRow = document.createElement('tr');
  const parameterBoxTypeRowTitle = document.createElement('th');
  const parameterBoxTypeRowTitleText = document.createElement('span');
  parameterBoxTypeRowTitleText.innerText = 'Type';
  parameterBoxTypeRowTitle.appendChild(parameterBoxTypeRowTitleText);
  parameterBoxTypeRow.appendChild(parameterBoxTypeRowTitle);
  // Description
  const parameterBoxDescriptionRow = document.createElement('tr');
  const parameterBoxDescriptionRowTitle = document.createElement('th');
  const parameterBoxDescriptionRowTitleText = document.createElement('span');
  parameterBoxDescriptionRowTitleText.innerText = 'Description';
  parameterBoxDescriptionRowTitle.appendChild(parameterBoxDescriptionRowTitleText);
  parameterBoxDescriptionRow.appendChild(parameterBoxDescriptionRowTitle);
  // Optional
  const parameterBoxOptionalRow = document.createElement('tr');
  const parameterBoxOptionalRowTitle = document.createElement('th');
  const parameterBoxOptionalRowTitleText = document.createElement('span');
  parameterBoxOptionalRowTitleText.innerText = 'Optional';
  parameterBoxOptionalRowTitle.appendChild(parameterBoxOptionalRowTitleText);
  parameterBoxOptionalRow.appendChild(parameterBoxOptionalRowTitle);
  // Default Value
  const parameterBoxDefaultValueRow = document.createElement('tr');
  const parameterBoxDefaultValueRowTitle = document.createElement('th');
  const parameterBoxDefaultValueRowTitleText = document.createElement('span');
  parameterBoxDefaultValueRowTitleText.innerText = 'Default Value';
  parameterBoxDefaultValueRowTitle.appendChild(parameterBoxDefaultValueRowTitleText);
  parameterBoxDefaultValueRow.appendChild(parameterBoxDefaultValueRowTitle);
  parameter.forEach((parameter) => {
    // name
    const parameterBoxNameRowValue = document.createElement('td');
    parameterBoxNameRowValue.innerText = parameter.name;
    parameterBoxNameRow.appendChild(parameterBoxNameRowValue);
    // type
    const parameterBoxTypeRowValue = document.createElement('td');
    const exists = getTypeExists(parameter.type.name);
    const parameterBoxTypeRowValueClick = document.createElement(exists ? "a" : "span");
    parameterBoxTypeRowValueClick.innerText = parameter.type.name ? parameter.type.name : 'any';
    if (exists) {
      parameterBoxTypeRowValueClick.href = "#" + parameter.type.name;
      parameterBoxTypeRowValueClick.classList.add("blueText");
    }
    parameterBoxTypeRowValue.appendChild(parameterBoxTypeRowValueClick);
    parameterBoxTypeRow.appendChild(parameterBoxTypeRowValue);
    // description
    const parameterBoxDescriptionRowValue = document.createElement('td');
    parameterBoxDescriptionRowValue.innerText = parameter.comment ? parameter.comment.text ? parameter.comment.text : parameter.comment.summary.map((summary) => summary.text).join('\n') : '';
    parameterBoxDescriptionRow.appendChild(parameterBoxDescriptionRowValue);
    // optional
    const parameterBoxOptionalRowValue = document.createElement('td');
    parameterBoxOptionalRowValue.innerText = parameter.flags.isOptional ? '✅' : '❌';
    parameterBoxOptionalRow.appendChild(parameterBoxOptionalRowValue);
    // default value
    const parameterBoxDefaultValueRowValue = document.createElement('td');
    parameterBoxDefaultValueRowValue.innerText = parameter.defaultValue ? parameter.defaultValue : 'None';
    parameterBoxDefaultValueRow.appendChild(parameterBoxDefaultValueRowValue);
  });
  parameterBoxMobile.appendChild(parameterBoxNameRow);
  parameterBoxMobile.appendChild(parameterBoxTypeRow);
  parameterBoxMobile.appendChild(parameterBoxOptionalRow);
  parameterBoxMobile.appendChild(parameterBoxDefaultValueRow);
  parameterBoxMobile.appendChild(parameterBoxDescriptionRow);
  parameterBoxDiv.appendChild(parameterBoxMobile);
  return parameterBoxDiv;
}

function drawIndexBox(name, content) {
  const indexBox = document.createElement('div');
  indexBox.classList.add('FVBox');
  const title = document.createElement('p');
  title.innerText = name;
  indexBox.appendChild(title);
  content.forEach((item) => {
    if (item.flags.isPrivate || item.flags.isExternal) return;
    const indexBoxName = document.createElement('a');
    indexBoxName.classList.add('FVBoxItem');
    indexBoxName.innerText = item.name;
    indexBoxName.onclick = () => {
      document.getElementById('scrollableProperty' + item.name).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      setTimeout(() => {
        document.getElementById('scrollableProperty' + item.name).parentElement.parentElement.parentElement.style.transition = 'all 0.25s ease-in';
        document.getElementById('scrollableProperty' + item.name).parentElement.parentElement.parentElement.style.border = '0.3rem solid var(--complementary-color)';
        document.getElementById('scrollableProperty' + item.name).parentElement.parentElement.parentElement.style.background = 'var(--focus-background-color)';
        document.getElementById('scrollableProperty' + item.name).parentElement.parentElement.parentElement.style.transform = 'rotateX(90deg)';
        setTimeout(() => {
          document.getElementById('scrollableProperty' + item.name).parentElement.parentElement.parentElement.style.transform = 'rotateX(0deg)';
        }, 250);
        setTimeout(() => {
          document.getElementById('scrollableProperty' + item.name).parentElement.parentElement.parentElement.style.transition = 'none';
          document.getElementById('scrollableProperty' + item.name).parentElement.parentElement.parentElement.style.transform = '';
          setTimeout(() => {
            document.getElementById('scrollableProperty' + item.name).parentElement.parentElement.parentElement.style.transition = 'all 0.5s ease';
            document.getElementById('scrollableProperty' + item.name).parentElement.parentElement.parentElement.style.border = '';
            document.getElementById('scrollableProperty' + item.name).parentElement.parentElement.parentElement.style.background = '';
          }, 10);
        }, 1000);
      }, 500);
    }
    indexBox.appendChild(indexBoxName);
  });

  return indexBox;
}

function generateToolTip(text, tooltip) {
  const tooltipElement = document.createElement('toolTippedElement');
  const tooltipText = document.createElement('span');
  tooltipText.innerText = text;
  tooltipText.classList.add('redText');
  tooltipElement.appendChild(tooltipText);
  const tooltipTooltip = document.createElement('tooltip');
  const tooltipTooltipText = document.createElement('span');
  tooltipTooltipText.innerText = tooltip;
  tooltipTooltip.appendChild(tooltipTooltipText);
  tooltipTooltip.classList.add('tooltip');
  tooltipElement.appendChild(tooltipTooltip);
  return tooltipElement;
}

function drawFileViewerItemDetails(name, item, description) {
  const propertyBox = document.createElement('div');
  propertyBox.classList.add('FileViewerItemDetails');
  const title = document.createElement('h4');
  const titleText = document.createElement('span');
  titleText.innerText = '.';
  titleText.appendChild(name);
  title.appendChild(titleText);
  if (item.flags.isOptional) {
    title.appendChild(generateToolTip('?', 'Optional Parameter'));
  }
  const textAfterTitle = document.createElement('span');
  textAfterTitle.innerText = ':';
  textAfterTitle.classList.add('grayText');
  title.appendChild(textAfterTitle);

  propertyBox.appendChild(title);

  const contentBox = document.createElement('div');
  contentBox.classList.add('FileViewerItemDetailsData');

  const propertyBoxEffect = document.createElement('div');
  propertyBoxEffect.classList.add('FileViewerItemDetailsEffect');
  contentBox.appendChild(propertyBoxEffect);
  contentBox.appendChild(description);

  propertyBox.appendChild(contentBox);
  return propertyBox;
}

function renderTypeText(type, typeOfShowing, isChildren) {
  const text = document.createElement('div');
  text.style.display = 'inline-block';
  if (type.name) {
    const exists = getTypeExists(type.name);
    const typeText = document.createElement(exists ? 'a' : 'span');
    typeText.classList.add(exists ? 'blueText' : 'greenText');
    exists ? typeText.setAttribute('href', '#' + type.name) : null;
    typeText.innerText = type.name;
    text.appendChild(typeText);
    if (type.typeArguments) {
      const openBracket = document.createElement('span');
      openBracket.innerText = '<';
      openBracket.classList.add('grayText');
      text.appendChild(openBracket);
      type.typeArguments.forEach((typeArgument, index) => {
        text.appendChild(renderTypeText(typeArgument, typeOfShowing, true));
        if (index < type.typeArguments.length - 1) {
          const comma = document.createElement('span');
          comma.innerText = ', ';
          comma.classList.add('grayText');
          text.appendChild(comma);
        }
      });
      const closeBracket = document.createElement('span');
      closeBracket.innerText = '>';
      closeBracket.classList.add('grayText');
      text.appendChild(closeBracket);
    }
  } else if (type.type === 'union') {
    type.types.forEach((typer, index) => {
      text.appendChild(renderTypeText(typer, typeOfShowing, true));
      if (index !== type.types.length - 1) {
        const openSmallBracket = document.createElement('span');
        openSmallBracket.innerText = typeOfShowing ? ' | ' : ' or ';
        openSmallBracket.classList.add('grayText');
        text.appendChild(openSmallBracket);
      }
    });
  } else if (type.type === 'array') {
    text.appendChild(renderTypeText(type.elementType, typeOfShowing, true));
    const brackets = document.createElement('span');
    brackets.innerText = '[]';
    brackets.classList.add('grayText');
    text.appendChild(brackets);
  }
  if (text.children.length === 0 && !isChildren) {
    const anyText = document.createElement('span');
    anyText.innerText = 'any';
    anyText.classList.add('greenText');
    text.appendChild(anyText);
  }
  return text;
}

function renderElementFileViewer(element, viewer) {
  // --------[ Element printTitle ]---------
  const printTitle = document.createElement('h2');
  printTitle.innerText = element.kindString + ' ' + element.name;
  printTitle.classList.add('FVTitle');
  printTitle.classList.add('printOnly');
  printTitle.classList.add('separator');
  printTitle.setAttribute('aria-hidden', 'true');
  // --------[ Element printTitle {extends} ]---------
  if (element.extendedTypes) {
    const extendsElement = document.createElement('span');
    extendsElement.innerText = ' extends ';
    element.extendedTypes.forEach((extendedType, index) => {
      const green = document.createElement('span');
      green.classList.add('greenText');
      green.innerText = extendedType.name;
      extendsElement.appendChild(green);
      if (element.extendedTypes.length - 1 !== index) {
        const comma = document.createElement('span');
        comma.innerText = ', ';
        extendsElement.appendChild(comma);
      }
    })
    printTitle.appendChild(extendsElement);
  }
  const printTitleFlood = printTitle.cloneNode(true);
  printTitleFlood.classList.remove('separator');
  viewer.appendChild(printTitle);

  // --------[ Element About ]---------
  // Todo: Add about

  // --------[ Element Index Boxes ]---------
  if (element.children) {
    const printingLayoutGroupDiv = document.createElement('div');
    printingLayoutGroupDiv.classList.add('printLayoutGroup');
    const constructor = element.children.filter((child) => child.kind === 512);
    if (constructor.length > 0) {
      const constructorBox = document.createElement('fieldset');
      const title = document.createElement('legend');
      title.innerText = 'Constructor';
      constructorBox.appendChild(title);

      constructor.forEach((constructor) => {
        const signatureBox = document.createElement('code');
        signatureBox.classList.add('signatureBox');
        signatureBox.classList.add('blockOfCode');

        const reservedKeyWord = document.createElement('span');
        reservedKeyWord.classList.add('redText');
        reservedKeyWord.innerText = 'new';
        signatureBox.appendChild(reservedKeyWord);
        
        const className = document.createElement('span');
        className.classList.add('blueText');
        className.innerText = ' ' + element.name;
        signatureBox.appendChild(className);

        const parameters = document.createElement('span');
        const startParameters = document.createElement('span');
        startParameters.classList.add('grayText');
        startParameters.innerText = '(';
        parameters.appendChild(startParameters);

        var parameterBox = null;
        
        if (constructor.signatures) {
          constructor.signatures.forEach((signature) => {
            if (signature.parameters) {
              signature.parameters.forEach((parameter, index) => {
                const parameterName = document.createElement('span');
                parameterName.classList.add('orangeText');
                parameterName.innerText = parameter.name;
                parameters.appendChild(parameterName);
                const separator = document.createElement('span');
                separator.classList.add('grayText');
                separator.innerText = ': ';
                parameters.appendChild(separator);
                parameters.appendChild(renderTypeText(parameter.type));
                if (signature.parameters.length - 1 !== index) {
                  const comma = document.createElement('span');
                  comma.classList.add('grayText');
                  comma.innerText = ', ';
                  parameters.appendChild(comma);
                }
              });
              parameterBox = renderParameterBox(signature.parameters);
            }
          });
        }
        const endParameters = document.createElement('span');
        endParameters.classList.add('grayText');
        endParameters.innerText = ');';
        parameters.appendChild(endParameters);
        signatureBox.appendChild(parameters);
        constructorBox.appendChild(signatureBox);
        const space = document.createElement('br');
        constructorBox.append(space);
        parameterBox ? constructorBox.appendChild(parameterBox) : null;
      });

      printingLayoutGroupDiv.appendChild(constructorBox);
    }

    const PGMethods = document.createElement('div');
    PGMethods.classList.add('PGMethods');

    const properties = element.children.filter((child) => child.kind === 1024);
    const methods = element.children.filter((child) => child.kind === 2048);
    const others = element.children.filter((child) => child.kind !== 512 && child.kind !== 1024 && child.kind !== 2048);
    
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('contentContainer');
    
    if (properties.length > 0) {
      const propertiesIndexBox = drawIndexBox('Properties', properties);
      const propertiesBox = document.createElement('details');
      propertiesBox.open = true;
      const title = document.createElement('summary');
      title.innerText = 'Properties';
      propertiesBox.appendChild(title);
      var countedProperties = 0;
      properties.forEach((property) => {
        if (property.flags.isPrivate || property.flags.isExternal) return;
        countedProperties++;

        const description = document.createElement('div');
        description.classList.add('description');
        if (property.comment) {
          const text = document.createElement('p');
          text.innerText = property.comment.shortText;
          description.appendChild(text);
        }

        const type = document.createElement('span');
        const typeText = document.createElement('span');
        typeText.innerText = 'type: ';
        typeText.appendChild(renderTypeText(property.type));
        type.appendChild(typeText);
        description.appendChild(type);
        const name = document.createElement('span');
        name.id = 'scrollableProperty' + property.name;
        name.innerText = property.name;
        propertiesBox.appendChild(drawFileViewerItemDetails(name, property, description));
        description.appendChild(printTitleFlood.cloneNode(true));
      });
      if (countedProperties > 0) {
        PGMethods.appendChild(propertiesIndexBox);
        contentContainer.appendChild(printTitle.cloneNode(true));
        contentContainer.appendChild(propertiesBox);
      }
    }
    if (methods.length > 0) {
      const methodsIndexBox = drawIndexBox('Methods', methods);
      const methodsBox = document.createElement('details');
      methodsBox.open = true;
      const title = document.createElement('summary');
      title.innerText = 'Methods';
      methodsBox.appendChild(title);
      var countedMethods = 0;
      methods.forEach((method) => {
        if (method.flags.isPrivate || method.flags.isExternal) return;
        const description = document.createElement('div');
        description.classList.add('description');
        const name = document.createElement('span');
        name.id = 'scrollableProperty' + method.name;
        name.innerText = method.name;
        const openParenteses = document.createElement('span');
        openParenteses.innerText = '(';
        openParenteses.classList.add('grayText');
        name.append(openParenteses);
        if (method.signatures) {
          method.signatures.forEach((signature) => {
            if (signature.parameters) {
              signature.parameters.forEach((parameter, index) => {
                const parameterName = document.createElement('span');
                parameterName.classList.add('orangeText');
                parameterName.innerText = parameter.name;
                name.appendChild(parameterName);
                const separator = document.createElement('span');
                separator.classList.add('grayText');
                separator.innerText = ': ';
                name.appendChild(separator);
                name.append(renderTypeText(parameter.type, true));
                if (signature.parameters.length - 1 !== index) {
                  const comma = document.createElement('span');
                  comma.classList.add('grayText');
                  comma.innerText = ', ';
                  name.appendChild(comma);
                }
              });
              const parameters = renderParameterBox(signature.parameters);
              description.appendChild(parameters);
            }
            if (signature.comment) {
              if (signature.comment.blockTags) {
                signature.comment.blockTags.forEach((tag) => {
                  const desc = tag.content.map((content) => content.text).join(', ').replace(/ *\[[^\]]*\] */g, "").replaceAll('-', '');
                  if (!desc) return;
                  const text = document.createElement('div');
                  text.classList.add('blockOfTags');
                  const textPrefix = document.createElement('p');
                  textPrefix.classList.add('redText');
                  textPrefix.innerText = tag.tag.slice(1) + ':\t';
                  const textContent = desc;
                  text.appendChild(textPrefix);
                  text.appendChild(textToHTML(textContent));
                  description.appendChild(text);
                })
              }
            }
            const returns = document.createElement('span');
            const returnsText = document.createElement('span');
            returnsText.innerText = 'returns: ';
            returnsText.classList.add('grayText');
            returns.appendChild(returnsText);
            returns.appendChild(renderTypeText(signature.type));
            description.appendChild(returns);
          });
        }
        
        const closeParenteses = document.createElement('span');
        closeParenteses.innerText = ')';
        closeParenteses.classList.add('grayText');
        name.appendChild(closeParenteses);

        methodsBox.appendChild(drawFileViewerItemDetails(name, method, description));
        description.appendChild(printTitleFlood.cloneNode(true));
        countedMethods++;
      });
      if (countedMethods > 0) {
        PGMethods.appendChild(methodsIndexBox);
        contentContainer.appendChild(printTitle.cloneNode(true));;
        contentContainer.appendChild(methodsBox);
      }
    }
    if (others.length > 0) {
      const othersIndexBox = drawIndexBox('Misc', others);
      PGMethods.appendChild(othersIndexBox);
      const othersBox = document.createElement('details');
      othersBox.open = true;
      const title = document.createElement('summary');
      title.innerText = 'Misc';
      othersBox.appendChild(title);
      var countedOthers = 0;
      others.forEach((other) => {
        if (other.flags.isPrivate || other.flags.isExternal) return;
        countedOthers++;
        const description = document.createElement('div');
        description.classList.add('description');
        const name = document.createElement('span');
        name.id = 'scrollableProperty' + other.name;
        name.innerText = other.name;
        const value = document.createElement('span');
        value.innerText = '= ';
        value.classList.add('grayText');
        const valueText = document.createElement('span');
        valueText.innerText = other.type.value;
        valueText.classList.add('greenText');
        value.appendChild(valueText);
        description.appendChild(value);
        othersBox.appendChild(drawFileViewerItemDetails(name, other, description));
        description.appendChild(printTitleFlood.cloneNode(true));
      });
      if (countedOthers > 0) {
        contentContainer.appendChild(printTitle.cloneNode(true));;
      }
      contentContainer.appendChild(othersBox);
    }

    printingLayoutGroupDiv.appendChild(PGMethods);
    viewer.appendChild(printingLayoutGroupDiv);
    viewer.appendChild(contentContainer);
  }
}

function updateSideBar() {
  const currentSelectedItem = document.getElementById("SideBarSelected");

  if (currentSelectedItem) {
    currentSelectedItem.id = "";
  }

  if (!window.location.hash.startsWith("#") || !window.location.hash.length > 1) return;

  const selectedItem = document.querySelector(
    '[href="' + window.location.hash + '"]'
  );

  if (selectedItem) {
    selectedItem.id = "SideBarSelected";
  }
}

function changePage() {
  updateSideBar();
  if (window.location.hash.startsWith("#") && window.location.hash.length > 1) {
    // Its a element path
    fetch("./json/docs.json", {
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((file) => file.json())
      .then((json) => {
        renderFileViewer(json);
        updatePGMethods();
        adjustElements();
        addFooter();
        updateFooter();
        document.getElementById('fileViewer').scrollTo(0, 0, 'smooth');
      });
  } else {
    // HomePage
    document.getElementsByClassName('welcomeSideBarItem')[0].id = "SideBarSelected";
    window.location.hash = "";
    xhr.open('get', "https://raw.githubusercontent.com/twitchapis/twitch.js/main/README.md");
    xhr.send();
  }
}

function updatePGMethods() {
  if (!document.getElementsByClassName("PGMethods")[0]) return;
  var amountOfBoxes =
    document.getElementsByClassName("PGMethods")[0].children.length;

  const maxAmount = getComputedStyle(document.documentElement).getPropertyValue(
    "--maxAmountOfBoxes"
  );

  if (amountOfBoxes > maxAmount) {
    amountOfBoxes = maxAmount;
  }

  var styledBoxes = "";
  for (var i = 0; i < amountOfBoxes; i++) {
    styledBoxes += "1fr ";
  }

  document
    .getElementsByClassName("PGMethods")[0]
    .style.setProperty("--amountOfBoxes", styledBoxes);
}

changePage();
window.addEventListener("hashchange", changePage);
