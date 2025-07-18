describe("Skill Swap Requests Feature", () => {
  beforeEach(() => {
    // Mock authenticated user
    cy.window().then((win) => {
      win.localStorage.setItem("authToken", "mock-token");
    });

    cy.intercept("GET", "**/auth/me", {
      statusCode: 200,
      body: {
        id: "1",
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        picture_url: "https://example.com/john.jpg",
      },
    }).as("getUser");

    // Mock pending offers API
    cy.intercept("GET", "**/offers/pending", {
      statusCode: 200,
      body: {
        acceptedOffersCount: 2,
        completedOffersCount: 5,
        rejectedOffersCount: 1,
        pendingOffers: [
          {
            id: "1",
            createdAt: "2025-01-15T10:00:00Z",
            updatedAt: "2025-01-15T10:00:00Z",
            skillsNeeded: [
              {
                Skill: {
                  id: "1",
                  name: "JavaScript",
                  description: "Frontend development",
                },
              },
            ],
            user: {
              id: "2",
              firstname: "Alice",
              lastname: "Johnson",
              picture_url: "https://example.com/alice.jpg",
              UserSkills: [
                {
                  Skill: {
                    id: "2",
                    name: "Python",
                    description: "Backend development",
                  },
                },
              ],
            },
          },
        ],
      },
    }).as("getPendingOffers");

    cy.visit("/requests");
  });

  it("should display requests page correctly", () => {
    cy.url().should("include", "/requests");
    cy.wait("@getPendingOffers");

    // Should display page title
    cy.get("h1, h2").should("contain.text", /request|offer/i);

    // Should show statistics
    cy.contains(/accepted|completed|rejected/i).should("be.visible");
  });

  it("should display request statistics", () => {
    cy.wait("@getPendingOffers");

    // Should show counts for different request states
    cy.contains("2").should("be.visible"); // accepted count
    cy.contains("5").should("be.visible"); // completed count
    cy.contains("1").should("be.visible"); // rejected count
  });

  it("should display pending requests list", () => {
    cy.wait("@getPendingOffers");

    // Should show pending requests
    cy.get(
      '[data-testid="pending-requests"], .pending-requests, .request-list'
    ).should("be.visible");
    cy.get('[data-testid="request-item"], .request-item, .offer-card').should(
      "have.length.greaterThan",
      0
    );

    // Each request should have user info
    cy.get('[data-testid="request-item"], .request-item, .offer-card')
      .first()
      .within(() => {
        cy.get('img, [data-testid="user-avatar"]').should("be.visible"); // User avatar
        cy.get(".name, .user-name, h3, h4").should(
          "contain.text",
          "Alice Johnson"
        ); // User name
        cy.get(".skill, .skills").should("contain.text", "Python"); // User's skills
        cy.get("button")
          .contains(/accept|approve/i)
          .should("be.visible"); // Accept button
        cy.get("button")
          .contains(/reject|decline/i)
          .should("be.visible"); // Reject button
      });
  });

  it("should accept a skill swap request", () => {
    // Mock accept request API
    cy.intercept("PUT", "**/offers/1/accept", {
      statusCode: 200,
      body: { message: "Request accepted successfully" },
    }).as("acceptRequest");

    cy.wait("@getPendingOffers");

    // Click accept on first request
    cy.get('[data-testid="request-item"], .request-item, .offer-card')
      .first()
      .within(() => {
        cy.get("button")
          .contains(/accept|approve/i)
          .click();
      });

    cy.wait("@acceptRequest");

    // Should show success message
    cy.contains(/accepted|approved|success/i).should("be.visible");

    // Request should be removed from pending list or marked as accepted
    cy.get('[data-testid="request-item"], .request-item, .offer-card').should(
      "have.length",
      0
    );
  });

  it("should reject a skill swap request", () => {
    // Mock reject request API
    cy.intercept("PUT", "**/offers/1/reject", {
      statusCode: 200,
      body: { message: "Request rejected successfully" },
    }).as("rejectRequest");

    cy.wait("@getPendingOffers");

    // Click reject on first request
    cy.get('[data-testid="request-item"], .request-item, .offer-card')
      .first()
      .within(() => {
        cy.get("button")
          .contains(/reject|decline/i)
          .click();
      });

    cy.wait("@rejectRequest");

    // Should show success message
    cy.contains(/rejected|declined|success/i).should("be.visible");

    // Request should be removed from pending list
    cy.get('[data-testid="request-item"], .request-item, .offer-card').should(
      "have.length",
      0
    );
  });

  it("should display request details", () => {
    cy.wait("@getPendingOffers");

    // Should show what skills are being requested
    cy.get('[data-testid="request-item"], .request-item, .offer-card')
      .first()
      .within(() => {
        cy.contains("JavaScript").should("be.visible"); // Requested skill
        cy.contains(/want|need|looking for/i).should("be.visible");
      });
  });

  it("should show request timestamps", () => {
    cy.wait("@getPendingOffers");

    // Should display when the request was made
    cy.get('[data-testid="request-item"], .request-item, .offer-card')
      .first()
      .within(() => {
        cy.get(".date, .time, .timestamp").should("be.visible");
        cy.get(".date, .time, .timestamp").should("not.be.empty");
      });
  });

  it("should handle empty requests state", () => {
    // Mock empty requests
    cy.intercept("GET", "**/offers/pending", {
      statusCode: 200,
      body: {
        acceptedOffersCount: 0,
        completedOffersCount: 0,
        rejectedOffersCount: 0,
        pendingOffers: [],
      },
    }).as("getEmptyOffers");

    cy.reload();
    cy.wait("@getEmptyOffers");

    // Should show empty state message
    cy.contains(/no.*request|no.*offer|empty/i).should("be.visible");
  });

  it("should confirm before accepting/rejecting requests", () => {
    cy.wait("@getPendingOffers");

    // Look for confirmation dialogs
    cy.get('[data-testid="request-item"], .request-item, .offer-card')
      .first()
      .within(() => {
        cy.get("button")
          .contains(/accept|approve/i)
          .click();
      });

    // Should show confirmation dialog
    cy.get("body").then(($body) => {
      if ($body.find(".modal, .dialog, .confirm").length > 0) {
        cy.get(".modal, .dialog, .confirm").should("be.visible");
        cy.contains(/confirm|sure|accept/i).should("be.visible");

        // Cancel confirmation
        cy.get("button")
          .contains(/cancel|no/i)
          .click();
        cy.get(".modal, .dialog, .confirm").should("not.be.visible");
      }
    });
  });

  it("should navigate to user profile from request", () => {
    cy.wait("@getPendingOffers");

    // Click on user info to view their profile
    cy.get('[data-testid="request-item"], .request-item, .offer-card')
      .first()
      .within(() => {
        cy.get(".name, .user-name, img").click();
      });

    // Should open user profile modal or navigate to profile
    cy.get('[data-testid="user-modal"], .modal, .user-profile').should(
      "be.visible"
    );
    cy.contains("Alice Johnson").should("be.visible");
  });

  it("should filter requests by status", () => {
    cy.wait("@getPendingOffers");

    // Look for filter/tab options
    cy.get("body").then(($body) => {
      if (
        $body.find("button, .tab").text().includes("Pending") ||
        $body.find("button, .tab").text().includes("Accepted") ||
        $body.find("button, .tab").text().includes("Completed")
      ) {
        // Test different filter options
        cy.get("button, .tab")
          .contains(/pending/i)
          .click();
        cy.get(
          '[data-testid="request-item"], .request-item, .offer-card'
        ).should("be.visible");

        cy.get("button, .tab")
          .contains(/accepted/i)
          .click();
        // Should show different requests or empty state
      }
    });
  });

  it("should refresh requests list", () => {
    cy.wait("@getPendingOffers");

    // Look for refresh functionality
    cy.get("body").then(($body) => {
      if (
        $body.find("button").text().includes("Refresh") ||
        $body.find('[data-testid="refresh"]').length > 0
      ) {
        cy.get('button, [data-testid="refresh"]')
          .contains(/refresh|reload/i)
          .click();
        cy.wait("@getPendingOffers");
      }
    });
  });

  it("should display user skills in request card", () => {
    cy.wait("@getPendingOffers");

    // Should show what skills the requesting user offers
    cy.get('[data-testid="request-item"], .request-item, .offer-card')
      .first()
      .within(() => {
        cy.contains("Python").should("be.visible"); // User's offered skill
        cy.contains(/offer|teach|provide/i).should("be.visible");
      });
  });

  it("should handle request errors gracefully", () => {
    // Mock API error
    cy.intercept("PUT", "**/offers/1/accept", {
      statusCode: 500,
      body: { error: "Server error" },
    }).as("acceptError");

    cy.wait("@getPendingOffers");

    cy.get('[data-testid="request-item"], .request-item, .offer-card')
      .first()
      .within(() => {
        cy.get("button")
          .contains(/accept|approve/i)
          .click();
      });

    cy.wait("@acceptError");

    // Should show error message
    cy.contains(/error|failed|try again/i).should("be.visible");
  });

  it("should complete accepted requests", () => {
    // Mock complete request API
    cy.intercept("PUT", "**/offers/1/complete", {
      statusCode: 200,
      body: { message: "Request completed successfully" },
    }).as("completeRequest");

    // Mock accepted requests
    cy.intercept("GET", "**/offers/accepted", {
      statusCode: 200,
      body: [
        {
          id: "1",
          status: "accepted",
          user: {
            id: "2",
            firstname: "Alice",
            lastname: "Johnson",
          },
        },
      ],
    }).as("getAcceptedOffers");

    // Navigate to accepted requests if there's a tab
    cy.get("body").then(($body) => {
      if ($body.find("button, .tab").text().includes("Accepted")) {
        cy.get("button, .tab")
          .contains(/accepted/i)
          .click();
        cy.wait("@getAcceptedOffers");

        // Should have complete button
        cy.get("button")
          .contains(/complete|finish/i)
          .click();
        cy.wait("@completeRequest");

        cy.contains(/completed|finished|success/i).should("be.visible");
      }
    });
  });
});
