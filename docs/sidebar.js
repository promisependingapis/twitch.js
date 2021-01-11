var xhr = new XMLHttpRequest();
xhr.onload = async () => {
    const json = JSON.parse(xhr.response);
    json.classes.forEach((classValue) => {
        const br = document.createElement('br');
        const button = document.createElement('a');
        button.innerText = classValue.name;
        document.getElementsByClassName('SideBarClasses')[0].appendChild(button)
        document.getElementsByClassName('SideBarClasses')[0].appendChild(br)
    });
    json.typedefs.forEach((typedefValue) => {
        const br = document.createElement('br');
        const button = document.createElement('a');
        button.innerText = typedefValue.name;
        document.getElementsByClassName('SideBarTypedefs')[0].appendChild(button)
        document.getElementsByClassName('SideBarTypedefs')[0].appendChild(br)
    });
};
xhr.open('get', "./json/docs.json");
xhr.send();