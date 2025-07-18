describe("Browse Skills Feature", () => {
  let fixtureData: any;

  before(() => {
    // Load fixture data once before all tests
    cy.fixture("skills").then((data) => {
      fixtureData = data;
    });
  });

  beforeEach(() => {
    // Set authentication cookie (HTTP-only cookie simulation)
    cy.setCookie("whoami", "test-jwt-token", {
      domain: "localhost",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    // Mock auth check with correct endpoint
    cy.intercept("GET", "**/auth/isauth", {
      statusCode: 200,
      body: {
        id: "793ce674-3949-4c8a-bc4c-361bd6077515",
        firstname: "John",
        lastname: "Doe",
        email: "test@example.com",
        picture_url: "https://example.com/john.jpg",
        bio: "Software developer passionate about teaching and learning new skills.",
      },
    }).as("getAuthUser");

    // Mock search API with correct endpoint and data structure
    cy.intercept("POST", "**/browse/search", (req) => {
      if (fixtureData && fixtureData.browseSearchResults) {
        const responseData = fixtureData.browseSearchResults;

        req.reply({
          statusCode: 200,
          body: responseData,
        });
      } else {
        req.reply({
          statusCode: 200,
          body: [],
        });
      }
    }).as("searchSkills");

    // Mock get target user data API
    cy.intercept("POST", "**/browse/get-target-user-data", (req) => {
      if (fixtureData && fixtureData.targetUserData) {
        const responseData = fixtureData.targetUserData;

        req.reply({
          statusCode: 200,
          body: responseData,
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            id: "user-2",
            firstname: "Alice",
            lastname: "Smith",
            email: "alice@example.com",
            picture_url: "https://example.com/alice.jpg",
            bio: "Experienced developer who loves sharing knowledge.",
            UserSkills: [],
            UserSkillLearns: [],
          },
        });
      }
    }).as("getTargetUserData");

    // Mock request swap API
    cy.intercept("POST", "**/browse/request-swap", {
      statusCode: 200,
      body: { message: "Request sent successfully!" },
    }).as("sendSwapRequest");

    cy.visit("/browse", { timeout: 1000 });
  });

  it("DEBUG: should test search API intercept", () => {
    cy.wait("@getAuthUser");

    // Log that we're starting the test
    cy.log("🚀 Starting search debug test");

    // Type in search box
    cy.get('input[placeholder="Search skills or users..."]').type("JavaScript");
    cy.log("✅ Typed 'JavaScript' in search box");

    // Click search button
    cy.get("button.btn.btn-primary").contains("Search").click();
    cy.log("✅ Clicked search button");

    // Wait for the API call
    cy.wait("@searchSkills").then((interception) => {
      cy.log("🎯 API call intercepted:", interception);
      cy.log("Request:", interception.request);
      cy.log("Response:", interception.response);
    });
  });

  it("should display browse page correctly", () => {
    cy.wait("@getAuthUser");
    cy.url().should("include", "/browse");

    // Check page title
    cy.contains("Discover Your Next Skill Partner").should("be.visible");

    // Should have search functionality with correct placeholder
    cy.get('input[placeholder="Search skills or users..."]').should(
      "be.visible"
    );
    cy.get("button.btn.btn-primary").contains("Search").should("be.visible");
  });

  it("should perform skill search and show merged results", () => {
    cy.wait("@getAuthUser");

    // Enter search term
    cy.get('input[placeholder="Search skills or users..."]').type("JavaScript");
    cy.get("button.btn.btn-primary").contains("Search").click();

    // Wait for search request
    cy.wait("@searchSkills");

    // Should display search results section (searchResults.length > 0)
    cy.get(".cursor-pointer").should("have.length.greaterThan", 0);

    // Verify merged results: Alice should appear once with multiple skills
    // (The Browse.tsx merges skills for same user_id)
    cy.contains("Alice Smith").should("be.visible");
    cy.contains("JavaScript").should("be.visible");
    cy.contains("React").should("be.visible");

    // Verify Bob appears separately (different user_id)
    cy.contains("Bob Johnson").should("be.visible");
    cy.contains("Python").should("be.visible");

    // Right panel should show placeholder until user is selected
    cy.contains("Select a user to view details").should("be.visible");
  });

  it("should display user skill cards with correct structure", () => {
    cy.wait("@getAuthUser");

    // Trigger search to show results
    cy.get('input[placeholder="Search skills or users..."]').type("JavaScript");
    cy.get("button.btn.btn-primary").contains("Search").click();
    cy.wait("@searchSkills");

    // Check for user cards with correct BrowseUser component structure
    cy.get(".cursor-pointer").should("have.length.greaterThan", 0);

    // Each card should have user information matching BrowseUser component
    cy.get(".cursor-pointer")
      .first()
      .within(() => {
        // User avatar
        cy.get(".avatar .w-16").should("be.visible");
        cy.get("img").should("be.visible");

        // User name
        cy.get("h2").should("contain.text", "Alice Smith");

        // Skills badges
        cy.get(".badge").should("be.visible");
        cy.get(".badge").should("contain.text", "JavaScript");
      });
  });

  it("should select user and show user details in right panel", () => {
    cy.wait("@getAuthUser");

    // Trigger search first
    cy.get('input[placeholder="Search skills or users..."]').type("JavaScript");
    cy.get("button.btn.btn-primary").contains("Search").click();
    cy.wait("@searchSkills");

    // Click on first user card
    cy.get(".cursor-pointer").first().click();

    // Should fetch target user data
    cy.wait("@getTargetUserData");

    // Should display user details in right panel
    cy.get(".shadow-2xl").within(() => {
      // User name in header
      cy.contains("Alice Smith").should("be.visible");

      // Skills to teach section
      cy.contains("Skills to Teach").should("be.visible");
      cy.contains("JavaScript").should("be.visible");
      cy.contains("React").should("be.visible");

      // Skills to learn section
      cy.contains("Skills to Learn").should("be.visible");
      cy.contains("Photography").should("be.visible");

      // About me section
      cy.contains("About Me").should("be.visible");
      cy.contains("Experienced developer who loves sharing knowledge.").should(
        "be.visible"
      );

      // Request swap button
      cy.get("button").contains("Request Swap").should("be.visible");
    });
  });

  it("should open request modal and send skill swap request", () => {
    cy.wait("@getAuthUser");

    // Trigger search and select user
    cy.get('input[placeholder="Search skills or users..."]').type("JavaScript");
    cy.get("button.btn.btn-primary").contains("Search").click();
    cy.wait("@searchSkills");

    cy.get(".cursor-pointer").first().click();
    cy.wait("@getTargetUserData");

    // Click Request Swap button
    cy.get("button").contains("Request Swap").click();

    // Should open modal with correct ID
    cy.get("#request-modal").should("be.visible");
    cy.get("#request-modal").within(() => {
      cy.contains("Choose a Skill to Request").should("be.visible");

      // Should show available skills
      cy.get("button").contains("JavaScript").should("be.visible");
      cy.get("button").contains("React").should("be.visible");

      // Click on a skill to request
      cy.get("button").contains("JavaScript").click();
    });

    // Should send request
    cy.wait("@sendSwapRequest");

    // Should show success toast
    cy.get(".toast .alert-success").should("be.visible");
    cy.contains("Request sent successfully!").should("be.visible");
  });

  it("should handle request error and show error toast", () => {
    cy.wait("@getAuthUser");

    // Mock error response
    cy.intercept("POST", "**/browse/request-swap", {
      statusCode: 400,
      body: { message: "You have already sent a request to this user" },
    }).as("sendSwapRequestError");

    // Trigger search and select user
    cy.get('input[placeholder="Search skills or users..."]').type("JavaScript");
    cy.get("button.btn.btn-primary").contains("Search").click();
    cy.wait("@searchSkills");

    cy.get(".cursor-pointer").first().click();
    cy.wait("@getTargetUserData");

    // Click Request Swap button and select skill
    cy.get("button").contains("Request Swap").click();
    cy.get("#request-modal").within(() => {
      cy.get("button").contains("JavaScript").click();
    });

    // Should send request and get error
    cy.wait("@sendSwapRequestError");

    // Should show error toast
    cy.get(".toast .alert-error").should("be.visible");
    cy.contains("You have already sent a request to this user").should(
      "be.visible"
    );
  });

  it("should close request modal", () => {
    cy.wait("@getAuthUser");

    // Open modal
    cy.get('input[placeholder="Search skills or users..."]').type("JavaScript");
    cy.get("button.btn.btn-primary").contains("Search").click();
    cy.wait("@searchSkills");

    cy.get(".cursor-pointer").first().click();
    cy.wait("@getTargetUserData");

    cy.get("button").contains("Request Swap").click();
    cy.get("#request-modal").should("be.visible");

    // Close modal using the close button
    cy.get("#request-modal").within(() => {
      cy.get("button").contains("Close").click();
    });

    // Modal should be closed
    cy.get("#request-modal").should("not.be.visible");
  });

  it("should handle empty search results correctly", () => {
    cy.wait("@getAuthUser");

    // Mock empty search results (API returns empty array)
    cy.intercept("POST", "**/browse/search", {
      statusCode: 200,
      body: [],
    }).as("emptySearch");

    cy.get('input[placeholder="Search skills or users..."]').type(
      "nonexistentskill123"
    );
    cy.get("button.btn.btn-primary").contains("Search").click();

    cy.wait("@emptySearch");

    // When API returns empty array, filteredResults will be empty,
    // so searchResults.length will be 0, showing "No search results found."
    cy.contains("No search results found.").should("be.visible");
  });

  it("should filter out current user from search results", () => {
    cy.wait("@getAuthUser");

    // Mock search results that include current user
    cy.intercept("POST", "**/browse/search", {
      statusCode: 200,
      body: [
        {
          id: "user-skill-current",
          user_id: "793ce674-3949-4c8a-bc4c-361bd6077515", // Current user ID
          skill_id: "1",
          User: {
            id: "793ce674-3949-4c8a-bc4c-361bd6077515",
            firstname: "John",
            lastname: "Doe",
            picture_url: "https://example.com/john.jpg",
          },
          Skill: { id: "1", name: "JavaScript" },
        },
        {
          id: "user-skill-other",
          user_id: "user-2",
          skill_id: "2",
          User: {
            id: "user-2",
            firstname: "Alice",
            lastname: "Smith",
            picture_url: "https://example.com/alice.jpg",
          },
          Skill: { id: "2", name: "React" },
        },
      ],
    }).as("searchWithCurrentUser");

    cy.get('input[placeholder="Search skills or users..."]').type("JavaScript");
    cy.get("button.btn.btn-primary").contains("Search").click();
    cy.wait("@searchWithCurrentUser");

    // Should only show Alice, not John (current user)
    cy.contains("Alice Smith").should("be.visible");
    cy.contains("John Doe").should("not.exist");
  });

  it("should display initial state correctly", () => {
    cy.wait("@getAuthUser");

    // Initially should show "No search results found" since searchResults is empty array
    cy.contains("No search results found.").should("be.visible");

    // After search results are displayed, should show placeholder in right panel
    cy.get('input[placeholder="Search skills or users..."]').type("JavaScript");
    cy.get("button.btn.btn-primary").contains("Search").click();
    cy.wait("@searchSkills");

    // Now should show "Select a user to view details" in the right panel
    cy.contains("Select a user to view details").should("be.visible");
  });

  it("should handle search input validation correctly", () => {
    cy.wait("@getAuthUser");

    // Initially shows "No search results found"
    cy.contains("No search results found.").should("be.visible");

    // Test empty search does nothing (no API call due to trim() check)
    cy.get("button.btn.btn-primary").contains("Search").click();
    // Should not make API call without search input due to handleSearch guard clause
    cy.get("@searchSkills.all").should("have.length", 0);
    // Should still show "No search results found"
    cy.contains("No search results found.").should("be.visible");

    // Test with whitespace only (should not make API call due to trim() check)
    cy.get('input[placeholder="Search skills or users..."]').type("   ");
    cy.get("button.btn.btn-primary").contains("Search").click();
    // Should not make API call with whitespace-only input due to handleSearch guard clause
    cy.get("@searchSkills.all").should("have.length", 0);
    // Should still show "No search results found"
    cy.contains("No search results found.").should("be.visible");

    // Test valid search (should make API call and show results)
    cy.get('input[placeholder="Search skills or users..."]')
      .clear()
      .type("JavaScript");
    cy.get("button.btn.btn-primary").contains("Search").click();
    cy.wait("@searchSkills");

    // Should show search results section now
    cy.contains("Alice Smith").should("be.visible");
    // Should show placeholder in right panel since no user selected yet
    cy.contains("Select a user to view details").should("be.visible");
  });
});
