// Import commands.js using ES2015 syntax:
import "./commands";
// import "@cypress/code-coverage/support"; // Disabled to prevent frontend dependency

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
// This CSS will hide request/xhr commands in the Cypress command log
Cypress.on("window:before:load", (win: any) => {
  if (win.top && win.top.document) {
    const existingStyle = win.top.document.head.querySelector(
      "[data-hide-command-log-request]"
    );
    if (!existingStyle) {
      const style = win.top.document.createElement("style");
      style.innerHTML =
        ".command-name-request, .command-name-xhr { display: none }";
      style.setAttribute("data-hide-command-log-request", "");
      win.top.document.head.appendChild(style);
    }
  }
});
