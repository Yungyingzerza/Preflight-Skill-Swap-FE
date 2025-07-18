describe("User Profile Feature", () => {
  beforeEach(() => {
    // Mock auth check
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

    // Mock user skills API (offered skills) - using correct endpoint
    cy.intercept("GET", "**/main/get-user-skills", {
      statusCode: 200,
      body: [
        { Skill: { id: "1", name: "JavaScript" } },
        { Skill: { id: "2", name: "React" } },
      ],
    }).as("getUserSkills");

    // Mock user learning skills API (skills to learn) - using correct endpoint
    cy.intercept("GET", "**/main/get-user-skills-learn", {
      statusCode: 200,
      body: [
        { Skill: { id: "3", name: "Python" } },
        { Skill: { id: "4", name: "Photography" } },
      ],
    }).as("getUserSkillsLearn");

    // Mock user stats API - using correct endpoint
    cy.intercept("GET", "**/main/get-number-of-user-skills", {
      statusCode: 200,
      body: {
        swapCompletedCount: 5,
      },
    }).as("getUserStats");

    // Mock swap history API - using correct endpoint
    cy.intercept("GET", "**/main/get-swap-history", {
      statusCode: 200,
      body: [
        {
          offer: {
            id: "offer-1",
            createdAt: "2024-01-15T10:30:00Z",
            Status: { id: "1", name: "completed" },
          },
          partnerUser: {
            firstname: "Alice",
            lastname: "Johnson",
          },
          partnerSkills: [
            { Skill: { name: "Node.js" } },
            { Skill: { name: "TypeScript" } },
          ],
        },
        {
          offer: {
            id: "offer-2",
            createdAt: "2024-01-20T14:20:00Z",
            Status: { id: "2", name: "accepted" },
          },
          partnerUser: {
            firstname: "Bob",
            lastname: "Smith",
          },
          partnerSkills: [{ Skill: { name: "Vue.js" } }],
        },
      ],
    }).as("getSwapHistory");

    // Mock all available skills for modal
    cy.intercept("GET", "**/skill", {
      statusCode: 200,
      body: [
        { id: "1", name: "JavaScript" },
        { id: "2", name: "React" },
        { id: "3", name: "Python" },
        { id: "4", name: "Photography" },
        { id: "5", name: "TypeScript" },
        { id: "6", name: "Vue.js" },
      ],
    }).as("getAllSkills");

    cy.visit("/", { timeout: 1000 });

    // Set the real authentication cookie with exact properties from JSON
    cy.setCookie(
      "whoami",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5M2NlNjc0LTM5NDktNGM4YS1iYzRjLTM2MWJkNjA3NzUxNSIsImlhdCI6MTc1Mjg2MjQzMCwiZXhwIjoxNzg0NDIwMDMwfQ.NL4oFSaPm6m9LMUbuV_6a7qg0GXgRKRUCdhlLc_-Mww",
      { path: "/", httpOnly: true, secure: false, sameSite: "lax" }
    );

    // Reload to apply cookie and load profile content
    cy.reload();
  });

  it("should display user profile information correctly", () => {
    cy.wait("@getAuthUser");
    cy.wait("@getUserSkills");
    cy.wait("@getUserSkillsLearn");
    cy.wait("@getUserStats");

    // Should display user avatar
    cy.get(".avatar img").should("be.visible");

    // Should display user name
    cy.contains("John Doe").should("be.visible");

    // Should display user bio
    cy.contains(
      "Software developer passionate about teaching and learning new skills."
    ).should("be.visible");

    // Should display swaps completed count
    cy.get("span.text-4xl.text-primary").contains("5").should("be.visible");
    cy.contains("Swaps Completed").should("be.visible");

    // Should have Edit Profile button
    cy.get("button").contains("Edit Profile").should("be.visible");
  });

  it("should display skills offered by default", () => {
    cy.wait("@getUserSkills");

    // Should show "My Skills" section
    cy.contains("My Skills").should("be.visible");
    cy.contains("Manage your skill set for swaps.").should("be.visible");

    // Should show Skills Offered tab as active (white background)
    cy.get("button")
      .contains("Skills Offered")
      .should("have.class", "bg-white");

    // Should display offered skills
    cy.get(".badge").contains("JavaScript").should("be.visible");
    cy.get(".badge").contains("React").should("be.visible");
  });

  it("should switch to learning skills tab", () => {
    cy.wait("@getUserSkillsLearn");

    // Click on Skills Learned tab
    cy.get("button").contains("Skills Learned").click();

    // Should show Skills Learned tab as active
    cy.get("button")
      .contains("Skills Learned")
      .should("have.class", "bg-white");

    // Should display learning skills
    cy.get(".badge").contains("Python").should("be.visible");
    cy.get(".badge").contains("Photography").should("be.visible");
  });

  it("should open skills modal when Add/Edit Skills button is clicked", () => {
    cy.wait("@getUserSkills");

    // Click Add/Edit Skills button
    cy.get("button").contains("Add/Edit Skills").click();

    // Wait for modal to open and skills to load
    cy.wait("@getAllSkills");

    // Should open skills modal
    cy.get("#skill-modal").should("be.visible");
    cy.get(".modal-box").should("be.visible");
    cy.contains("Skills Offered").should("be.visible");

    // Should display available skills with checkboxes
    cy.get(".checkbox").should("have.length.at.least", 3);
    cy.contains("JavaScript").should("be.visible");
    cy.contains("TypeScript").should("be.visible");
  });

  it("should manage skills in modal", () => {
    // Mock skill update API - using correct endpoint
    cy.intercept("POST", "**/main/edit-user-skills", {
      statusCode: 200,
      body: { message: "Skills updated successfully" },
    }).as("updateSkills");

    cy.wait("@getUserSkills");

    // Open skills modal
    cy.get("button").contains("Add/Edit Skills").click();
    cy.wait("@getAllSkills");

    // Check TypeScript skill (not currently selected)
    cy.get(".form-control")
      .contains("TypeScript")
      .parent()
      .find(".checkbox")
      .check();

    // Uncheck JavaScript skill (currently selected)
    cy.get(".form-control")
      .contains("JavaScript")
      .parent()
      .find(".checkbox")
      .uncheck();

    // Save changes
    cy.get("button").contains("Save").click();

    cy.wait("@updateSkills");

    // Modal should close
    cy.get("#skill-modal").should("not.be.visible");
  });

  it("should switch modal to learning skills mode", () => {
    // Mock learning skills update API - using correct endpoint
    cy.intercept("POST", "**/main/edit-user-skills-learn", {
      statusCode: 200,
      body: { message: "Learning skills updated successfully" },
    }).as("updateLearningSkills");

    cy.wait("@getUserSkillsLearn");

    // Switch to Skills Learned tab first
    cy.get("button").contains("Skills Learned").click();

    // Open skills modal
    cy.get("button").contains("Add/Edit Skills").click();
    cy.wait("@getAllSkills");

    // Modal should show "Skills Learned" title
    cy.get(".modal-box").contains("Skills Learned").should("be.visible");

    // Add a new learning skill
    cy.get(".form-control")
      .contains("Vue.js")
      .parent()
      .find(".checkbox")
      .check();

    // Save changes
    cy.get("button").contains("Save").click();

    cy.wait("@updateLearningSkills");
  });

  it("should display swap history", () => {
    cy.wait("@getSwapHistory");

    // Should show swap history section
    cy.contains("Swap History").should("be.visible");
    cy.contains("Overview of your past skill exchange transactions.").should(
      "be.visible"
    );

    // Should display swap history table
    cy.get("table").should("be.visible");
    cy.get("thead").within(() => {
      cy.contains("Partner").should("be.visible");
      cy.contains("Skill Exchanged").should("be.visible");
      cy.contains("Date").should("be.visible");
      cy.contains("Status").should("be.visible");
      cy.contains("Actions").should("be.visible");
    });

    // Should display swap entries
    cy.get("tbody tr").should("have.length", 2);

    // First swap (completed)
    cy.get("tbody tr")
      .first()
      .within(() => {
        cy.contains("Alice Johnson").should("be.visible");
        cy.contains("Node.js, TypeScript").should("be.visible");
        cy.contains("1/15/2024").should("be.visible");
        cy.get(".badge-success").contains("Completed").should("be.visible");
      });

    // Second swap (accepted - should have complete button)
    cy.get("tbody tr")
      .last()
      .within(() => {
        cy.contains("Bob Smith").should("be.visible");
        cy.contains("Vue.js").should("be.visible");
        cy.contains("1/20/2024").should("be.visible");
        cy.get(".badge-info").contains("Accepted").should("be.visible");
        cy.get("button").contains("Mark as Completed").should("be.visible");
      });
  });

  it("should mark swap as completed", () => {
    // Wait for initial data to load
    cy.wait("@getSwapHistory");

    // Mock complete offer API - using correct endpoint from useRequestPage
    cy.intercept("POST", "**/request/complete-offer/", {
      statusCode: 200,
      body: { message: "Offer completed successfully" },
    }).as("completeOffer");

    // Mock updated swap history after completion - using correct endpoint
    cy.intercept("GET", "**/main/get-swap-history", {
      statusCode: 200,
      body: [
        {
          offer: {
            id: "offer-1",
            createdAt: "2024-01-15T10:30:00Z",
            Status: { id: "1", name: "completed" },
          },
          partnerUser: {
            firstname: "Alice",
            lastname: "Johnson",
          },
          partnerSkills: [
            { Skill: { name: "Node.js" } },
            { Skill: { name: "TypeScript" } },
          ],
        },
        {
          offer: {
            id: "offer-2",
            createdAt: "2024-01-20T14:20:00Z",
            Status: { id: "3", name: "completed" },
          },
          partnerUser: {
            firstname: "Bob",
            lastname: "Smith",
          },
          partnerSkills: [{ Skill: { name: "Vue.js" } }],
        },
      ],
    }).as("getUpdatedSwapHistory");

    // Click "Mark as Completed" button for the accepted swap
    cy.get("tbody tr")
      .last()
      .within(() => {
        cy.get("button").contains("Mark as Completed").click();
      });

    cy.wait("@completeOffer");
    cy.wait("@getUpdatedSwapHistory");
  });

  it("should handle empty states correctly", () => {
    // Mock empty user skills - using correct endpoint
    cy.intercept("GET", "**/main/get-user-skills", {
      statusCode: 200,
      body: [],
    }).as("getEmptyUserSkills");

    // Mock empty learning skills - using correct endpoint
    cy.intercept("GET", "**/main/get-user-skills-learn", {
      statusCode: 200,
      body: [],
    }).as("getEmptyUserSkillsLearn");

    // Mock empty swap history - using correct endpoint
    cy.intercept("GET", "**/main/get-swap-history", {
      statusCode: 200,
      body: [],
    }).as("getEmptySwapHistory");

    cy.visit("/");

    cy.wait("@getEmptyUserSkills");
    cy.wait("@getEmptyUserSkillsLearn");
    cy.wait("@getEmptySwapHistory");

    // Should show empty state for offered skills
    cy.contains("No skills offered yet.").should("be.visible");

    // Switch to learning tab and check empty state
    cy.get("button").contains("Skills Learned").click();
    cy.contains("No skills learned yet.").should("be.visible");

    // Should show empty state for swap history
    cy.get("tbody tr").within(() => {
      cy.contains("No swap history available.").should("be.visible");
    });
  });
});
