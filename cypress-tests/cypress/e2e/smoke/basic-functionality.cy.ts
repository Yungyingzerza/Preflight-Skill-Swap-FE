describe("Smoke Tests - Basic Application Health", () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit("/");
  });

  it("should load the home page successfully", () => {
    // Check if the main elements are visible
    cy.get("body").should("be.visible");
    cy.title().should("not.be.empty");

    // Check if navbar is present
    cy.get("nav").should("be.visible");

    // Check if main content loads
    cy.get("main, section, .container").should("exist");
  });

  it("should display the correct page title", () => {
    cy.title().should("include", "Skill");
  });

  it("should have working navigation links", () => {
    // Test navigation to login page
    cy.contains("Login", { matchCase: false }).click();
    cy.url().should("include", "/login");

    // Go back to home
    cy.visit("/");
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("should display hero section with main content", () => {
    // Check for hero section elements
    cy.get("h1").should("be.visible");
    cy.get("h1").should("contain.text", "Skill");

    // Check for description text
    cy.contains("SkillSwap", { matchCase: false }).should("be.visible");

    // Check for CTA button
    cy.contains("Browse", { matchCase: false }).should("be.visible");
  });

  it("should have responsive design elements", () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.get("body").should("be.visible");
    cy.get("nav").should("be.visible");

    // Test tablet viewport
    cy.viewport(768, 1024);
    cy.get("body").should("be.visible");

    // Test desktop viewport
    cy.viewport(1280, 720);
    cy.get("body").should("be.visible");
  });

  it("should load all critical CSS and assets", () => {
    // Check if images load (if any)
    cy.get("img").each(($img) => {
      cy.wrap($img).should("be.visible");
      cy.wrap($img).should("have.attr", "src").and("not.be.empty");
    });

    // Check if fonts are loaded
    cy.get("body").should("have.css", "font-family");
  });

  it("should not have JavaScript errors in console", () => {
    cy.window().then((win) => {
      expect(win.console.error).to.not.have.been.called;
    });
  });

  it("should display footer information", () => {
    // Scroll to bottom to ensure footer is visible
    cy.scrollTo("bottom");
    cy.get("footer").should("be.visible");
  });

  it("should handle browser back button correctly", () => {
    // Navigate to login page
    cy.contains("Login", { matchCase: false }).click();
    cy.url().should("include", "/login");

    // Use browser back
    cy.go("back");
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("should load within acceptable time", () => {
    // Reload page and measure load time
    const start = Date.now();
    cy.reload();
    cy.get("body")
      .should("be.visible")
      .then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(5000); // Should load within 5 seconds
      });
  });
});
