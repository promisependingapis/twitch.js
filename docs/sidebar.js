var xhra = new XMLHttpRequest();
xhra.onload = async () => {
    const json = JSON.parse(xhra.response);
    json.classes.forEach((classValue) => {
        const br = document.createElement('br');
        const button = document.createElement('a');
        button.innerText = classValue.name;
        button.href = '#' + classValue.name;
        document.getElementsByClassName('SideBarClasses')[0].appendChild(button);
        document.getElementsByClassName('SideBarClasses')[0].appendChild(br);
    });
    json.typedefs.forEach((typedefValue) => {
        const br = document.createElement('br');
        const button = document.createElement('a');
        button.innerText = typedefValue.name;
        button.href = '#' + typedefValue.name;
        document.getElementsByClassName('SideBarTypedefs')[0].appendChild(button);
        document.getElementsByClassName('SideBarTypedefs')[0].appendChild(br);
    });
};
xhra.open('get', "./json/docs.json");
xhra.send();