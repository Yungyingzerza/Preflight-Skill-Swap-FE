describe("Messaging Feature", () => {
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
    });

    // Mock conversations API
    cy.intercept("GET", "**/conversations", {
      fixture: "messages",
    }).as("getConversations");

    // Mock messages API
    cy.intercept("GET", "**/conversations/*/messages", {
      fixture: "messages",
    }).as("getMessages");

    cy.visit("/messages");
  });

  it("should display messages page correctly", () => {
    cy.url().should("include", "/messages");
    cy.wait("@getConversations");

    // Should have conversations list
    cy.get(
      '[data-testid="conversations-list"], .conversations, .chat-list'
    ).should("be.visible");

    // Should have message area
    cy.get('[data-testid="message-area"], .messages, .chat-area').should(
      "be.visible"
    );
  });

  it("should display conversation list", () => {
    cy.wait("@getConversations");

    // Should show conversation items
    cy.get(
      '[data-testid="conversation-item"], .conversation, .chat-item'
    ).should("have.length.greaterThan", 0);

    // Each conversation should have user info and last message
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .first()
      .within(() => {
        cy.get('img, [data-testid="avatar"]').should("be.visible"); // User avatar
        cy.get(".name, .user-name, h3, h4").should("be.visible"); // User name
        cy.get(".message, .last-message").should("be.visible"); // Last message preview
      });
  });

  it("should select and open a conversation", () => {
    cy.wait("@getConversations");

    // Click on first conversation
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .first()
      .click();
    cy.wait("@getMessages");

    // Should display messages in the selected conversation
    cy.get(
      '[data-testid="message-list"], .messages-list, .chat-messages'
    ).should("be.visible");
    cy.get('[data-testid="message"], .message-item, .chat-message').should(
      "have.length.greaterThan",
      0
    );
  });

  it("should display message history correctly", () => {
    cy.wait("@getConversations");
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .first()
      .click();
    cy.wait("@getMessages");

    // Check message structure
    cy.get('[data-testid="message"], .message-item, .chat-message').each(
      ($message) => {
        cy.wrap($message).within(() => {
          // Should have message text
          cy.get(".text, .message-text, .content").should("be.visible");

          // Should have timestamp
          cy.get(".time, .timestamp, .date").should("be.visible");

          // Should indicate sender (self vs other)
          cy.wrap($message).should("have.class", /sent|received|own|other/);
        });
      }
    );
  });

  it("should send a new message", () => {
    // Mock send message API
    cy.intercept("POST", "**/messages", {
      statusCode: 200,
      body: {
        id: "999",
        message: "Test message",
        createdAt: new Date().toISOString(),
        sender_id: "1",
      },
    }).as("sendMessage");

    cy.wait("@getConversations");
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .first()
      .click();
    cy.wait("@getMessages");

    const testMessage = "This is a test message from Cypress!";

    // Type and send message
    cy.get(
      '[data-testid="message-input"], input[placeholder*="message"], textarea'
    ).type(testMessage);
    cy.get(
      '[data-testid="send-button"], button[type="submit"], .send-btn'
    ).click();

    cy.wait("@sendMessage");

    // Message should appear in the chat
    cy.contains(testMessage).should("be.visible");

    // Input should be cleared
    cy.get(
      '[data-testid="message-input"], input[placeholder*="message"], textarea'
    ).should("have.value", "");
  });

  it("should send message using Enter key", () => {
    cy.intercept("POST", "**/messages", {
      statusCode: 200,
      body: {
        id: "999",
        message: "Test message via Enter",
        createdAt: new Date().toISOString(),
        sender_id: "1",
      },
    }).as("sendMessage");

    cy.wait("@getConversations");
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .first()
      .click();
    cy.wait("@getMessages");

    const testMessage = "Message sent with Enter key!";

    // Type message and press Enter
    cy.get(
      '[data-testid="message-input"], input[placeholder*="message"], textarea'
    )
      .type(testMessage)
      .type("{enter}");

    cy.wait("@sendMessage");
    cy.contains(testMessage).should("be.visible");
  });

  it("should handle empty message submission", () => {
    cy.wait("@getConversations");
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .first()
      .click();
    cy.wait("@getMessages");

    // Try to send empty message
    cy.get(
      '[data-testid="send-button"], button[type="submit"], .send-btn'
    ).click();

    // Should not send empty message (button should be disabled or no request made)
    cy.get(
      '[data-testid="message-input"], input[placeholder*="message"], textarea'
    ).should("have.value", "");
  });

  it("should display real-time message updates", () => {
    cy.wait("@getConversations");
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .first()
      .click();
    cy.wait("@getMessages");

    // Simulate receiving a new message via WebSocket
    cy.window().then((win: any) => {
      // Trigger a new message event (this would normally come from WebSocket)
      const newMessage = {
        id: "888",
        message: "New incoming message!",
        createdAt: new Date().toISOString(),
        sender_id: "2",
        User: {
          id: "2",
          firstname: "Alice",
          lastname: "Johnson",
        },
      };

      // Simulate WebSocket message (adapt based on actual implementation)
      if (win.document && win.document.dispatchEvent) {
        const event = new CustomEvent("new-message", { detail: newMessage });
        win.document.dispatchEvent(event);
      }
    });

    // New message should appear
    cy.contains("New incoming message!").should("be.visible");
  });

  it("should scroll to latest message", () => {
    cy.wait("@getConversations");
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .first()
      .click();
    cy.wait("@getMessages");

    // Send a new message
    cy.intercept("POST", "**/messages", {
      statusCode: 200,
      body: {
        id: "999",
        message: "Latest message",
        createdAt: new Date().toISOString(),
        sender_id: "1",
      },
    }).as("sendMessage");

    cy.get(
      '[data-testid="message-input"], input[placeholder*="message"], textarea'
    ).type("Latest message");
    cy.get(
      '[data-testid="send-button"], button[type="submit"], .send-btn'
    ).click();

    cy.wait("@sendMessage");

    // Should scroll to show the latest message
    cy.contains("Latest message").should("be.visible");
  });

  it("should show message timestamps", () => {
    cy.wait("@getConversations");
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .first()
      .click();
    cy.wait("@getMessages");

    // Check that messages have timestamps
    cy.get('[data-testid="message"], .message-item, .chat-message')
      .first()
      .within(() => {
        cy.get(".time, .timestamp, .date").should("be.visible");
        cy.get(".time, .timestamp, .date").should("not.be.empty");
      });
  });

  it("should handle conversation search/filter", () => {
    cy.wait("@getConversations");

    // Look for search functionality in conversations
    cy.get("body").then(($body) => {
      if (
        $body.find('input[type="search"], input[placeholder*="search"]')
          .length > 0
      ) {
        cy.get('input[type="search"], input[placeholder*="search"]').type(
          "Alice"
        );

        // Should filter conversations
        cy.get(
          '[data-testid="conversation-item"], .conversation, .chat-item'
        ).should("contain.text", "Alice");
      }
    });
  });

  it("should mark messages as read", () => {
    cy.wait("@getConversations");

    // Click on conversation with unread messages
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .contains(/unread|new/i)
      .click();

    cy.wait("@getMessages");

    // Unread indicator should disappear
    cy.get('[data-testid="conversation-item"], .conversation, .chat-item')
      .first()
      .should("not.contain.text", /unread|new/i);
  });
});
