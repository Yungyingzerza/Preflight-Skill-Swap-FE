/// <reference types="cypress" />

// Custom commands for Skill Swap application

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with email and password
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<Element>;

      /**
       * Custom command to register a new user
       * @example cy.register('John', 'Doe', 'john@example.com', 'password123')
       */
      register(
        firstname: string,
        lastname: string,
        email: string,
        password: string
      ): Chainable<Element>;

      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<Element>;

      /**
       * Custom command to check if user is authenticated
       * @example cy.checkAuth()
       */
      checkAuth(): Chainable<Element>;

      /**
       * Custom command to navigate through the app
       * @example cy.navigateTo('browse')
       */
      navigateTo(
        page: "home" | "browse" | "messages" | "profile" | "requests"
      ): Chainable<Element>;

      /**
       * Custom command to search for skills
       * @example cy.searchSkills('JavaScript')
       */
      searchSkills(searchTerm: string): Chainable<Element>;

      /**
       * Custom command to send a message
       * @example cy.sendMessage('Hello there!')
       */
      sendMessage(message: string): Chainable<Element>;

      /**
       * Custom command to wait for loading to complete
       * @example cy.waitForLoading()
       */
      waitForLoading(): Chainable<Element>;
    }
  }
}

// Login command
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.waitForLoading();
});

// Register command
Cypress.Commands.add(
  "register",
  (firstname: string, lastname: string, email: string, password: string) => {
    cy.visit("/login");
    cy.get('[data-testid="register-tab"]').click();
    cy.get('[data-testid="firstname-input"]').type(firstname);
    cy.get('[data-testid="lastname-input"]').type(lastname);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="register-button"]').click();
    cy.waitForLoading();
  }
);

// Logout command
Cypress.Commands.add("logout", () => {
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should("include", "/");
});

// Check authentication
Cypress.Commands.add("checkAuth", () => {
  cy.window()
    .its("localStorage")
    .invoke("getItem", "authToken")
    .should("exist");
});

// Navigation command
Cypress.Commands.add(
  "navigateTo",
  (page: "home" | "browse" | "messages" | "profile" | "requests") => {
    const routes = {
      home: "/",
      browse: "/browse",
      messages: "/messages",
      profile: "/",
      requests: "/requests",
    };

    cy.visit(routes[page]);
    cy.waitForLoading();
  }
);

// Search skills command
Cypress.Commands.add("searchSkills", (searchTerm: string) => {
  cy.get('[data-testid="search-input"]').clear().type(searchTerm);
  cy.get('[data-testid="search-button"]').click();
  cy.wait(1000); // Wait for search results
});

// Send message command
Cypress.Commands.add("sendMessage", (message: string) => {
  cy.get('[data-testid="message-input"]').type(message);
  cy.get('[data-testid="send-button"]').click();
});

// Wait for loading command
Cypress.Commands.add("waitForLoading", () => {
  cy.get('[data-testid="loading"]', { timeout: 10000 }).should("not.exist");
  cy.get("body").should("be.visible");
});
