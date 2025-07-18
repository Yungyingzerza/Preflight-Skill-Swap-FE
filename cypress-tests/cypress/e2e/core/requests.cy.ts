describe("Skill Swap Requests Feature", () => {
  let fixtureData: any;

  beforeEach(() => {
    // Load fixture data first
    cy.fixture("requests").then((data) => {
      fixtureData = data;
    });

    // Mock authentication with Redux store population
    cy.intercept("GET", "**/auth/isauth", {
      statusCode: 200,
      body: {
        id: "user-test-1",
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        picture_url: "https://example.com/john.jpg",
        bio: "Software developer",
      },
    }).as("getAuth");

    // Mock pending offers API - using actual endpoint from useRequestPage.ts
    cy.intercept("GET", "**/request/pending-offers", (req) => {
      req.reply({
        statusCode: 200,
        body: fixtureData?.pendingOffers || fixtureData?.emptyPendingOffers,
      });
    }).as("getPendingOffers");

    // Mock accept offer API
    cy.intercept("POST", "**/request/accept-offer/", (req) => {
      const { offerId, skillId } = req.body;
      req.reply({
        statusCode: 200,
        body: {
          message: "Offer accepted successfully",
          offerId,
          skillId,
        },
      });
    }).as("acceptOffer");

    // Mock reject offer API
    cy.intercept("POST", "**/request/reject-offer/", (req) => {
      const { offerId } = req.body;
      req.reply({
        statusCode: 200,
        body: {
          message: "Offer rejected successfully",
          offerId,
        },
      });
    }).as("rejectOffer");

    cy.visit("/requests");
  });

  it("should display requests page correctly", () => {
    cy.url().should("include", "/requests");
    cy.wait("@getPendingOffers");

    // Should display main page title
    cy.get(".archivo-700.text-2xl").should(
      "contain.text",
      "Incoming Skill Swap Requests"
    );

    // Should display dashboard title (on medium+ screens)
    cy.get(".hidden.md\\:flex .archivo-700.text-2xl").should(
      "contain.text",
      "Request Dashboard"
    );

    // Should show the requests grid container
    cy.get(
      ".flex.flex-row.gap-5.flex-wrap.justify-center.md\\:justify-start"
    ).should("be.visible");
  });

  it("should display request statistics dashboard", () => {
    cy.wait("@getPendingOffers");

    // Should show statistics cards (on medium+ screens)
    cy.get(".hidden.md\\:flex.flex-col.gap-5").within(() => {
      // Pending Requests card
      cy.contains("Pending Requests").should("be.visible");
      cy.get(".archivo-700.text-2xl").should("contain.text", "2"); // Number of pending offers

      // Accepted Swaps card
      cy.contains("Accepted Swaps").should("be.visible");
      cy.get(".archivo-700.text-2xl").should("contain.text", "3"); // acceptedOffersCount

      // Rejected Requests card
      cy.contains("Rejected Requests").should("be.visible");
      cy.get(".archivo-700.text-2xl").should("contain.text", "2"); // rejectedOffersCount
    });
  });

  it("should display pending requests list", () => {
    cy.wait("@getPendingOffers");

    // Should show request cards using RequestUser component
    cy.get(
      ".flex.flex-col.gap-5.border.border-\\[\\#E5E5E5\\].rounded-lg.p-4.min-w-64"
    ).should("have.length", 2);

    // Check first request card
    cy.get(
      ".flex.flex-col.gap-5.border.border-\\[\\#E5E5E5\\].rounded-lg.p-4.min-w-64"
    )
      .first()
      .within(() => {
        // User info section
        cy.get(".flex.flex-row.gap-2.items-center").within(() => {
          cy.get(".avatar .w-12.rounded-full img").should("be.visible");
          cy.get(".archivo-600.text-lg").should(
            "contain.text",
            "Alice Johnson"
          );
        });

        // Offer skills section
        cy.contains("Offer:").should("be.visible");
        cy.get(".badge.badge-soft.badge-primary").should(
          "contain.text",
          "Python"
        );
        cy.get(".badge.badge-soft.badge-primary").should(
          "contain.text",
          "React"
        );

        // Request skill section
        cy.contains("Request:").should("be.visible");
        cy.get(".badge.badge-soft.badge-error").should(
          "contain.text",
          "JavaScript"
        );

        // Action buttons
        cy.get("button").contains("Accept").should("be.visible");
        cy.get("button").contains("Reject").should("be.visible");
      });
  });

  it("should open accept modal and handle skill selection", () => {
    cy.wait("@getPendingOffers");

    // Click accept button on first request
    cy.get(
      ".flex.flex-col.gap-5.border.border-\\[\\#E5E5E5\\].rounded-lg.p-4.min-w-64"
    )
      .first()
      .within(() => {
        cy.get("button").contains("Accept").click();
      });

    // Should open the accept modal
    cy.get("#accept-modal").should("be.visible");
    cy.get("#accept-modal").within(() => {
      cy.get("h3").should("contain.text", "Choose a Skill to Request");

      // Should show available skills to choose from
      cy.get(".btn.btn-outline.btn-primary").should("contain.text", "Python");
      cy.get(".btn.btn-outline.btn-primary").should("contain.text", "React");

      // Click on a skill to accept
      cy.get(".btn.btn-outline.btn-primary").contains("Python").click();
    });

    cy.wait("@acceptOffer");

    // Modal should close and request should be processed
    cy.get("#accept-modal").should("not.be.visible");
  });

  it("should reject a skill swap request", () => {
    cy.wait("@getPendingOffers");

    // Click reject button on first request
    cy.get(
      ".flex.flex-col.gap-5.border.border-\\[\\#E5E5E5\\].rounded-lg.p-4.min-w-64"
    )
      .first()
      .within(() => {
        cy.get("button").contains("Reject").click();
      });

    cy.wait("@rejectOffer");

    // Should refresh the data (component calls getPendingOffers again)
    cy.wait("@getPendingOffers");
  });

  it("should display correct skill badges", () => {
    cy.wait("@getPendingOffers");

    // Check skill badge styling for offered skills (primary)
    cy.get(".badge.badge-soft.badge-primary.rounded-xl.text-xs").should(
      "contain.text",
      "Python"
    );
    cy.get(".badge.badge-soft.badge-primary.rounded-xl.text-xs").should(
      "contain.text",
      "React"
    );

    // Check skill badge styling for requested skills (error/red)
    cy.get(".badge.badge-soft.badge-error.rounded-xl.text-xs").should(
      "contain.text",
      "JavaScript"
    );
  });

  it("should handle modal interactions correctly", () => {
    cy.wait("@getPendingOffers");

    // Open accept modal
    cy.get(
      ".flex.flex-col.gap-5.border.border-\\[\\#E5E5E5\\].rounded-lg.p-4.min-w-64"
    )
      .first()
      .within(() => {
        cy.get("button").contains("Accept").click();
      });

    // Should be able to close modal without selecting
    cy.get("#accept-modal").within(() => {
      cy.get("button").contains("Close").click();
    });

    // Modal should close
    cy.get("#accept-modal").should("not.be.visible");
  });

  it("should display user avatars and information correctly", () => {
    cy.wait("@getPendingOffers");

    // Check first user info
    cy.get(
      ".flex.flex-col.gap-5.border.border-\\[\\#E5E5E5\\].rounded-lg.p-4.min-w-64"
    )
      .first()
      .within(() => {
        cy.get(".avatar .w-12.rounded-full img").should(
          "have.attr",
          "src",
          "https://example.com/alice.jpg"
        );
        cy.get(".avatar .w-12.rounded-full img").should(
          "have.attr",
          "alt",
          "Alice Johnson"
        );
        cy.get(".archivo-600.text-lg").should("contain.text", "Alice Johnson");
      });

    // Check second user info
    cy.get(
      ".flex.flex-col.gap-5.border.border-\\[\\#E5E5E5\\].rounded-lg.p-4.min-w-64"
    )
      .eq(1)
      .within(() => {
        cy.get(".avatar .w-12.rounded-full img").should(
          "have.attr",
          "src",
          "https://example.com/bob.jpg"
        );
        cy.get(".avatar .w-12.rounded-full img").should(
          "have.attr",
          "alt",
          "Bob Wilson"
        );
        cy.get(".archivo-600.text-lg").should("contain.text", "Bob Wilson");
      });
  });

  it("should handle API errors gracefully", () => {
    // Mock API error for accept
    cy.intercept("POST", "**/request/accept-offer/", {
      statusCode: 500,
      body: { error: "Server error" },
    }).as("acceptError");

    cy.wait("@getPendingOffers");

    // Try to accept a request
    cy.get(
      ".flex.flex-col.gap-5.border.border-\\[\\#E5E5E5\\].rounded-lg.p-4.min-w-64"
    )
      .first()
      .within(() => {
        cy.get("button").contains("Accept").click();
      });

    // Select a skill in modal
    cy.get("#accept-modal").within(() => {
      cy.get(".btn.btn-outline.btn-primary").first().click();
    });

    cy.wait("@acceptError");

    // Component should handle error (specific error handling depends on implementation)
    // The component will likely log the error to console
  });

  it("should refresh data after accepting offer", () => {
    cy.wait("@getPendingOffers");

    // Accept an offer
    cy.get(
      ".flex.flex-col.gap-5.border.border-\\[\\#E5E5E5\\].rounded-lg.p-4.min-w-64"
    )
      .first()
      .within(() => {
        cy.get("button").contains("Accept").click();
      });

    cy.get("#accept-modal").within(() => {
      cy.get(".btn.btn-outline.btn-primary").first().click();
    });

    cy.wait("@acceptOffer");

    // Should fetch updated data
    cy.wait("@getPendingOffers");
  });

  it("should refresh data after rejecting offer", () => {
    cy.wait("@getPendingOffers");

    // Reject an offer
    cy.get(
      ".flex.flex-col.gap-5.border.border-\\[\\#E5E5E5\\].rounded-lg.p-4.min-w-64"
    )
      .first()
      .within(() => {
        cy.get("button").contains("Reject").click();
      });

    cy.wait("@rejectOffer");

    // Should fetch updated data
    cy.wait("@getPendingOffers");
  });

  it("should display statistics icons correctly", () => {
    cy.wait("@getPendingOffers");

    // Check that statistics cards have appropriate SVG icons
    cy.get(".hidden.md\\:flex.flex-col.gap-5").within(() => {
      // Each card should have an SVG icon
      cy.get("svg.size-6.stroke-gray-500").should("have.length", 3);
    });
  });

  it("should show proper responsive layout", () => {
    cy.wait("@getPendingOffers");

    // Dashboard should be hidden on small screens
    cy.get(".hidden.md\\:flex.flex-col.gap-5").should("exist");

    // Main title should have different padding on different screen sizes
    cy.get(".archivo-700.text-2xl.p-5.md\\:p-0").should(
      "contain.text",
      "Incoming Skill Swap Requests"
    );

    // Request cards should center on small screens, left-align on medium+
    cy.get(
      ".flex.flex-row.gap-5.flex-wrap.justify-center.md\\:justify-start"
    ).should("be.visible");
  });
});
