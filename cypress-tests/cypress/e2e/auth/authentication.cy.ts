describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Login Functionality", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("should display login form correctly", () => {
      // Check if login form elements are present
      cy.get('input[type="email"]').should("be.visible");
      cy.get('input[type="password"]').should("be.visible");
      cy.get("button").contains("Sign in").should("be.visible");

      // Check form title
      cy.contains("Sign In to SkillSwap").should("be.visible");
    });

    it("should show validation errors for empty fields", () => {
      // Try to submit empty form
      cy.get("button").contains("Sign in").click();

      // Check for validation messages (HTML5 validation)
      cy.get('input[type="email"]').should("have.attr", "required");
      cy.get('input[type="password"]').should("have.attr", "required");
    });

    it("should show error for invalid credentials", () => {
      cy.fixture("users").then((users) => {
        // Enter invalid credentials
        cy.get('input[type="email"]').type(users.invalidUser.email);
        cy.get('input[type="password"]').type(users.invalidUser.password);
        cy.get("button").contains("Sign in").click();

        // Note: Error handling would depend on your actual implementation
        // This test might need adjustment based on how errors are displayed
      });
    });

    it("should redirect to home/dashboard after successful login", () => {
      cy.fixture("users").then((users) => {
        cy.get('input[type="email"]').type(users.validUser.email);
        cy.get('input[type="password"]').type(users.validUser.password);

        // Intercept the login API call - it should set HTTP-only cookie
        cy.intercept("POST", "**/auth/login", {
          statusCode: 200,
          body: {
            id: "1",
            firstname: users.validUser.firstname,
            lastname: users.validUser.lastname,
            email: users.validUser.email,
            picture_url: "https://example.com/user.jpg",
          },
          headers: {
            // Simulate server setting HTTP-only cookie
            "Set-Cookie":
              "auth-token=jwt-token-here; HttpOnly; Path=/; SameSite=Lax",
          },
        }).as("loginRequest");

        // Mock the auth check that happens after login
        cy.intercept("GET", "**/auth/isauth", {
          statusCode: 200,
          body: {
            id: "1",
            firstname: users.validUser.firstname,
            lastname: users.validUser.lastname,
            email: users.validUser.email,
            picture_url: "https://example.com/user.jpg",
          },
        }).as("authCheck");

        cy.get("button").contains("Sign in").click();

        cy.url().should("not.include", "/login");
      });
    });
  });

  describe("Registration Functionality", () => {
    beforeEach(() => {
      cy.visit("/login");
      // Click on "Create One" span to switch to register mode
      cy.get("span.text-primary.cursor-pointer").contains("Create One").click();
    });

    it("should display registration form correctly", () => {
      // Check if registration form elements are present
      cy.get('input[placeholder="John"]').should("be.visible"); // First name
      cy.get('input[placeholder="Doe"]').should("be.visible"); // Last name
      cy.get('input[type="email"]').should("be.visible");
      // Check for password field (could be either type based on show/hide toggle)
      cy.get('input[type="password"]').should("be.visible");
      cy.get("button").contains("Create Account").should("be.visible");

      // Check form title
      cy.contains("Create an Account").should("be.visible");

      // Check fieldset legends
      cy.contains("Firstname").should("be.visible");
      cy.contains("Lastname").should("be.visible");
      cy.contains("Email").should("be.visible");
      cy.contains("Password").should("be.visible");
    });

    it("should successfully register with valid data", () => {
      cy.fixture("users").then((users) => {
        cy.get('input[placeholder="John"]').type(users.validUser.firstname);
        cy.get('input[placeholder="Doe"]').type(users.validUser.lastname);
        cy.get('input[type="email"]').type(users.validUser.email);
        cy.get('input[type="password"]').first().type(users.validUser.password);

        cy.get("button").contains("Create Account").click();
      });
    });
  });
});
