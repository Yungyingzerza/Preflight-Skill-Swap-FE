describe("Backend API Tests", () => {
  const baseUrl = Cypress.env("apiUrl");

  // Test data
  const testUser = {
    firstname: "Test",
    lastname: "User",
    email: `test.user.${Date.now()}@example.com`,
    password: "testPassword123",
    bio: "Test bio for user",
    picture_url: "https://example.com/avatar.jpg",
  };

  const existingUser = {
    firstname: "Existing",
    lastname: "User",
    email: `existing.user@example.com`,
    password: "existingPassword123",
    bio: "Bio for existing user",
    picture_url: "https://example.com/existing-avatar.jpg",
  };

  describe("Authentication API", () => {
    beforeEach(() => {
      // Clear cookies before each test
      cy.clearCookies();
    });

    it("should register a new user", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/auth/register`,
        body: {
          firstname: testUser.firstname,
          lastname: testUser.lastname,
          email: testUser.email,
          password: testUser.password,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.include("successfully");
      });
    });

    it("should login with valid credentials", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/auth/login`,
        body: {
          email: testUser.email,
          password: testUser.password,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("id");
      });
    });

    it("should fail login with invalid credentials", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/auth/login`,
        body: {
          email: "nonexistent@example.com",
          password: "wrongpassword",
        },
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        //can be 401 or 404 depending on the implementation
        expect([401, 404]).to.include(response.status);
        expect(response.body).to.have.property("message");
      });
    });

    it("should check authentication status", () => {
      // Login first
      cy.request({
        method: "POST",
        url: `${baseUrl}/auth/login`,
        body: {
          email: existingUser.email,
          password: existingUser.password,
        },
      }).then(() => {
        // Check auth status
        cy.request({
          method: "GET",
          url: `${baseUrl}/auth/isauth`,
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.email).to.eq(existingUser.email);
          expect(response.body).to.have.property("id");
        });
      });
    });

    it("should logout user", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/auth/login`,
        body: {
          email: existingUser.email,
          password: existingUser.password,
        },
      }).then(() => {
        // Logout
        cy.request({
          method: "GET",
          url: `${baseUrl}/auth/logout`,
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("message");
        });
      });
    });
  });

  describe("Browse API", () => {
    beforeEach(() => {
      // Setup authenticated session
      cy.request({
        method: "POST",
        url: `${baseUrl}/auth/login`,
        body: {
          email: existingUser.email,
          password: existingUser.password,
        },
      });
    });

    it("should search for skills/users", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/browse/search`,
        body: {
          input: "Web",
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });

    it("should get target user data", () => {
      const targetUserId = "2fbad587-b125-4b7c-89e1-a052d41ad870";

      cy.request({
        method: "POST",
        url: `${baseUrl}/browse/get-target-user-data`,
        body: {
          targetUserId: targetUserId,
        },
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        // This might fail if user doesn't exist, but we test the endpoint structure
        expect([200, 404]).to.include(response.status);
        if (response.status === 200) {
          expect(response.body).to.have.property("id");
        }
      });
    });

    it("should send skill swap request", () => {
      const targetUserId = "2fbad587-b125-4b7c-89e1-a052d41ad870";
      const skillId = "864fe149-c860-4541-b68f-2dbcb9935ed9";

      cy.request({
        method: "POST",
        url: `${baseUrl}/browse/request-swap`,
        body: {
          targetUserId: targetUserId,
          skillId: skillId,
        },
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        // This might fail due to business logic, but we test the endpoint
        expect([200, 400, 404]).to.include(response.status);
        expect(response.body).to.have.property("message");
      });
    });
  });

  describe("Chat API", () => {
    beforeEach(() => {
      // Setup authenticated session

      cy.request({
        method: "POST",
        url: `${baseUrl}/auth/login`,
        body: {
          email: existingUser.email,
          password: existingUser.password,
        },
      });
    });

    it("should get all conversations", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/chat/`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("conversations");
        expect(response.body.conversations).to.be.an("array");
      });
    });

    it("should get conversation messages", () => {
      const conversationId = "933b07c2-7b7f-4fb4-b721-31aad00e50a9";

      cy.request({
        method: "GET",
        url: `${baseUrl}/chat/${conversationId}/`,
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 404]).to.include(response.status);
        if (response.status === 200) {
          expect(response.body).to.have.property("messages");
          expect(response.body.messages).to.be.an("array");
        }
      });
    });

    it("should send a message", () => {
      const conversationId = "933b07c2-7b7f-4fb4-b721-31aad00e50a9";
      const messageContent = "Hello, this is a test message!";

      cy.request({
        method: "POST",
        url: `${baseUrl}/chat/send`,
        body: {
          conversationId: conversationId,
          content: messageContent,
        },
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect([200, 201, 400, 404]).to.include(response.status);
        expect(response.body).to.have.property("message");
      });
    });
  });

  describe("Main/Profile API", () => {
    beforeEach(() => {
      // Setup authenticated session

      cy.request({
        method: "POST",
        url: `${baseUrl}/auth/login`,
        body: {
          email: existingUser.email,
          password: existingUser.password,
        },
      });
    });

    it("should edit user profile", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/main/edit-profile`,
        body: {
          firstname: "Updated First",
          lastname: "Updated Last",
          bio: "Updated bio",
          picture_url: "https://example.com/new-avatar.jpg",
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.include("success");
      });
    });

    it("should get user skills to learn", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/main/get-user-skills-learn`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });

    it("should get number of user skills", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/main/get-number-of-user-skills`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("userSkillsCount");
        expect(response.body).to.have.property("swapCompletedCount");
      });
    });

    it("should get user skills", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/main/get-user-skills`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });

    it("should edit user skills", () => {
      const skillsData = {
        skills: [
          { id: "864fe149-c860-4541-b68f-2dbcb9935ed9" },
          { id: "505ca86b-80c8-4031-be7b-6f8298415464" },
          { id: "dcae15bb-b5ab-4a31-9e99-60a2a8337c8f" },
          { id: "8fd6c5f7-a0ee-4858-a538-386970adcd0c" },
          { id: "7743a2b0-4463-4940-b304-7775f70cb6c2" },
          { id: "0c0f0e31-7bfd-46a9-aff8-d36bd4670cb1" },
        ],
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/main/edit-user-skills`,
        body: skillsData,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("message");
      });
    });

    it("should edit user skills to learn", () => {
      const skillsData = {
        skills: [
          { id: "864fe149-c860-4541-b68f-2dbcb9935ed9" },
          { id: "505ca86b-80c8-4031-be7b-6f8298415464" },
        ],
      };

      cy.request({
        method: "POST",
        url: `${baseUrl}/main/edit-user-skills-learn`,
        body: skillsData,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("message");
      });
    });

    it("should get swap history", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/main/get-swap-history`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });
  });

  describe("Request API", () => {
    beforeEach(() => {
      // Setup authenticated session
      cy.request({
        method: "POST",
        url: `${baseUrl}/auth/login`,
        body: {
          email: existingUser.email,
          password: existingUser.password,
        },
      });
    });

    it("should get pending offers", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/request/pending-offers`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("object");
      });
    });
  });

  describe("Security Tests", () => {
    it("should require authentication for protected endpoints", () => {
      cy.clearCookies();

      cy.request({
        method: "GET",
        url: `${baseUrl}/main/get-user-skills`,
        headers: {
          "Content-Type": "application/json",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
});
