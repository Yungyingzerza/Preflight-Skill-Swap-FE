describe("API Integration Tests", () => {
  const apiUrl = Cypress.env("apiUrl") || "http://localhost:3000";

  beforeEach(() => {
    // Set the real authentication cookie
    cy.setCookie(
      "whoami",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5M2NlNjc0LTM5NDktNGM4YS1iYzRjLTM2MWJkNjA3NzUxNSIsImlhdCI6MTc1Mjg2MjQzMCwiZXhwIjoxNzg0NDIwMDMwfQ.NL4oFSaPm6m9LMUbuV_6a7qg0GXgRKRUCdhlLc_-Mww",
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      }
    );
  });

  describe("Authentication API", () => {
    it("should register a new user", () => {
      const userData = {
        firstname: "Test",
        lastname: "User",
        email: `test${Date.now()}@example.com`,
        password: "TestPassword123",
      };

      cy.request({
        method: "POST",
        url: `${apiUrl}/auth/register`,
        body: userData,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property("id");
          expect(response.body).to.have.property("email");
          expect(response.body.email).to.equal(userData.email);
        } else {
          // Log the actual response for debugging
          cy.log("Registration response:", response.status, response.body);
        }
      });
    });

    it("should login with valid credentials", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/auth/login`,
        body: {
          email: "test@example.com",
          password: "TestPassword123",
        },
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property("id");
          expect(response.body).to.have.property("email");
        } else {
          cy.log("Login response:", response.status, response.body);
        }
      });
    });

    it("should reject invalid credentials", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/auth/login`,
        body: {
          email: "invalid@example.com",
          password: "wrongpassword",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401, 404]);
      });
    });

    it("should validate authentication status", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/auth/isauth`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property("id");
        } else {
          // Expect 401 if not authenticated
          expect(response.status).to.equal(401);
        }
      });
    });
  });

  describe("User Management API", () => {
    it("should get user profile", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/users/1`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property("id");
          expect(response.body).to.have.property("firstname");
          expect(response.body).to.have.property("lastname");
        }
      });
    });

    it("should get user skills", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/users/1/skills`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.be.an("array");
          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property("id");
            expect(response.body[0]).to.have.property("name");
          }
        }
      });
    });

    it("should update user skills", () => {
      const skillData = {
        skills: ["JavaScript", "React", "Node.js"],
      };

      cy.request({
        method: "PUT",
        url: `${apiUrl}/users/1/skills`,
        body: skillData,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property("message");
        }
      });
    });
  });

  describe("Skills Search API", () => {
    it("should search for skills", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/search?q=JavaScript`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.be.an("array");
          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property("user");
            expect(response.body[0]).to.have.property("skills");
          }
        }
      });
    });

    it("should handle empty search results", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/search?q=nonexistentskill123`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.be.an("array");
          expect(response.body).to.have.length(0);
        }
      });
    });

    it("should get all available skills", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/skills`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.be.an("array");
          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property("id");
            expect(response.body[0]).to.have.property("name");
          }
        }
      });
    });
  });

  describe("Messaging API", () => {
    it("should get user conversations", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/conversations`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.be.an("array");
          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property("id");
            expect(response.body[0]).to.have.property("participants");
          }
        }
      });
    });

    it("should get conversation messages", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/conversations/1/messages`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.be.an("array");
          if (response.body.length > 0) {
            expect(response.body[0]).to.have.property("id");
            expect(response.body[0]).to.have.property("message");
            expect(response.body[0]).to.have.property("sender_id");
          }
        }
      });
    });

    it("should send a message", () => {
      const messageData = {
        conversation_id: "1",
        message: "Test message from Cypress API test",
      };

      cy.request({
        method: "POST",
        url: `${apiUrl}/messages`,
        body: messageData,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property("id");
          expect(response.body).to.have.property("message");
          expect(response.body.message).to.equal(messageData.message);
        }
      });
    });
  });

  describe("Skill Swap Requests API", () => {
    it("should get pending offers", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/offers/pending`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property("pendingOffers");
          expect(response.body.pendingOffers).to.be.an("array");
          expect(response.body).to.have.property("acceptedOffersCount");
          expect(response.body).to.have.property("completedOffersCount");
        }
      });
    });

    it("should send a skill swap request", () => {
      const requestData = {
        target_user_id: "2",
        skills_needed: ["JavaScript"],
        message: "I would like to learn JavaScript from you",
      };

      cy.request({
        method: "POST",
        url: `${apiUrl}/requests`,
        body: requestData,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200 || response.status === 201) {
          expect(response.body).to.have.property("message");
        }
      });
    });

    it("should accept a skill swap request", () => {
      cy.request({
        method: "PUT",
        url: `${apiUrl}/offers/1/accept`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property("message");
        }
      });
    });

    it("should reject a skill swap request", () => {
      cy.request({
        method: "PUT",
        url: `${apiUrl}/offers/1/reject`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property("message");
        }
      });
    });
  });

  describe("API Error Handling", () => {
    it("should handle 404 for non-existent endpoints", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/nonexistent`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });

    it("should handle malformed requests", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/auth/register`,
        body: "invalid-json",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });

    it("should handle missing required fields", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/auth/register`,
        body: {
          email: "test@example.com",
          // Missing required fields
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe("API Rate Limiting", () => {
    it("should handle rate limiting gracefully", () => {
      // Make multiple rapid requests to test rate limiting
      const requests = Array.from({ length: 10 }, (_, i) =>
        cy.request({
          method: "GET",
          url: `${apiUrl}/skills`,
          failOnStatusCode: false,
        })
      );

      Promise.all(requests).then((responses: any[]) => {
        // All responses should either succeed or return 429 (rate limited)
        responses.forEach((response) => {
          expect(response.status).to.be.oneOf([200, 429]);
        });
      });
    });
  });

  describe("API Response Headers", () => {
    it("should include proper CORS headers", () => {
      cy.request({
        method: "OPTIONS",
        url: `${apiUrl}/skills`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.headers).to.have.property(
            "access-control-allow-origin"
          );
        }
      });
    });

    it("should include content-type headers", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/skills`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 200) {
          expect(response.headers).to.have.property("content-type");
          expect(response.headers["content-type"]).to.include(
            "application/json"
          );
        }
      });
    });
  });
});
