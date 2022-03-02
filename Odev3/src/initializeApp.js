// Initialize App
const idCount = new idCounter();
const root = document.querySelector("#root");
const app = new App({ targetElement: root });
app.render();