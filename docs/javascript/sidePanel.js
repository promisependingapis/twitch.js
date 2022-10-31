var manuallyChangedTheme = false;
var closeWhenChangePage = false;
// PageOptions

function toggleTheme() {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    [...document.getElementsByClassName("themeToggleIcon")].forEach(
      (element) => {
        element.src = "./assets/images/themeToggle-dark.svg";
      }
    );
    localStorage.setItem("pageTheme", "light");
  } else {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    [...document.getElementsByClassName("themeToggleIcon")].forEach(
      (element) => {
        element.src = "./assets/images/themeToggle-light.svg";
      }
    );
    localStorage.setItem("pageTheme", "dark");
  }
  manuallyChangedTheme = true;
}

function changeBorderRadius(amount) {
  if (amount) {
    document.documentElement.style.setProperty(
      "--border-radius-percentage",
      amount / 100
    );
    localStorage.setItem(
      "border-radius-percentage",
      document.documentElement.style.getPropertyValue(
        "--border-radius-percentage"
      )
    );
  } else {
    const borderRadiusPercentage = localStorage.getItem(
      "border-radius-percentage"
    );
    document.documentElement.style.setProperty(
      "--border-radius-percentage",
      borderRadiusPercentage
    );
    document.getElementById("roundnessSlider").value = (borderRadiusPercentage * 100);
  }
}
changeBorderRadius();
document.getElementById("roundnessSlider").addEventListener("input", () => {
  changeBorderRadius(document.getElementById("roundnessSlider").value);
});
document.getElementById("roundnessSlider").addEventListener("dblclick", () => {
  document.getElementById("roundnessSlider").value = 100;
  changeBorderRadius(100);
});

function changeContrast(amount) {
  if (amount) {
    document.documentElement.style.setProperty(
      "--contrast-percentage",
      amount / 100
    );
    localStorage.setItem(
      "contrast-percentage",
      document.documentElement.style.getPropertyValue("--contrast-percentage")
    );
  } else {
    const contrastPercentage = localStorage.getItem("contrast-percentage");
    document.documentElement.style.setProperty(
      "--contrast-percentage",
      contrastPercentage
    );
    document.getElementById("contrastnessSlider").value = contrastPercentage * 100;
  }
}
changeContrast();
document.getElementById("contrastnessSlider").addEventListener("input", () => {
  changeContrast(document.getElementById("contrastnessSlider").value);
});
document
  .getElementById("contrastnessSlider")
  .addEventListener("dblclick", () => {
    document.getElementById("contrastnessSlider").value = 100;
    changeContrast(100);
  });

// IndexPage

window.addEventListener("resize", adjustSideBarHeight);
adjustSideBarHeight();

function adjustSideBarHeight() {
  const height = (0.02 * window.innerHeight) + (0.02 * window.innerWidth);
  document.getElementById("sideBar").style.height = (window.innerHeight - height) + "px";
  if (getComputedStyle(document.getElementById("sideBar")).position === "fixed") {
    closeWhenChangePage = true;
  } else {
    closeWhenChangePage = false;
  }
  updatePGMethods();
}

function generateSideBar(json) {
  if (!json.children) return;
  json.children.forEach((item) => {
    if (item.kind === 128 || item.kind === 8 || item.kind === 256) {
      if (item.flags.isPrivate) return;
      const itemHtml = document.createElement("a");
      itemHtml.href = '#' + item.name;
      itemHtml.classList.add('sideBarLink');
      itemHtml.classList.add(item.name);
      itemHtml.innerText = item.name;
      itemHtml.addEventListener('click', () => {
        if (closeWhenChangePage) {
          setTimeout(() => {
            toggleSidePanel(false);
          }, 250);
        }
      });
      if (document.getElementsByClassName("sidebar" + item.kindString)[0]) {
        document.getElementsByClassName("sidebar" + item.kindString)[0].appendChild(itemHtml);
      } else {
        const container = document.createElement("details");
        container.open = true;
        const title = document.createElement("summary");
        title.innerText = item.kindString + ":";
        container.appendChild(title);
        const childrenContainer = document.createElement("div");
        childrenContainer.classList.add("sidebar" + item.kindString);
        childrenContainer.appendChild(itemHtml);
        container.appendChild(childrenContainer);
        document.getElementById("sideBarContent").appendChild(container);
      }
    }
    generateSideBar(item);
  });
}

// ./json/docs.json
fetch("./json/docs.json", {
  mode: "cors",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
})
  .then((file) => file.json())
  .then((json) => {
    generateSideBar(json);
    changePage();
  });

const theme = localStorage.getItem("pageTheme");
if (theme) {
  manuallyChangedTheme = true;
  if (theme === 'dark') {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
    [...document.getElementsByClassName("themeToggleIcon")].forEach(
      (element) => {
        element.src = "./assets/images/themeToggle-light.svg";
      }
    );
  } else {
    document.body.classList.add("light");
    document.body.classList.remove("dark");
    [...document.getElementsByClassName("themeToggleIcon")].forEach(
      (element) => {
        element.src = "./assets/images/themeToggle-dark.svg";
      }
    );
  }
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !manuallyChangedTheme) {
  document.body.classList.add("dark");
  document.body.classList.remove("light");
  [...document.getElementsByClassName("themeToggleIcon")].forEach(
    (element) => {
      element.src = "./assets/images/themeToggle-light.svg";
    }
  );
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches && !manuallyChangedTheme) {
  document.body.classList.add("light");
  document.body.classList.remove("dark");
  [...document.getElementsByClassName("themeToggleIcon")].forEach(
    (element) => {
      element.src = "./assets/images/themeToggle-dark.svg";
    }
  );
}