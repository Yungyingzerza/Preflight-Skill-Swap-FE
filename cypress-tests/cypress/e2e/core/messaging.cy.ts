describe("Messaging Feature", () => {
  let fixtureData: any;

  beforeEach(() => {
    // Load fixture data first
    cy.fixture("messages").then((data) => {
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

    // Mock conversations API - using actual endpoint from useChat.ts
    cy.intercept("GET", "**/chat/", (req) => {
      req.reply({
        statusCode: 200,
        body: { conversations: fixtureData?.conversations || [] },
      });
    }).as("getConversations");

    // Mock conversation messages API - using actual endpoint pattern
    cy.intercept("GET", "**/chat/*/", (req) => {
      req.reply({
        statusCode: 200,
        body: { messages: fixtureData?.messages || [] },
      });
    }).as("getMessages");

    // Mock send message API
    cy.intercept("POST", "**/chat/send", (req) => {
      const { conversationId, content } = req.body;
      const newMessage = {
        id: `msg-${Date.now()}`,
        message: content,
        is_read: false,
        createdAt: new Date().toISOString(),
        sender_id: "user-test-1",
        User: {
          id: "user-test-1",
          firstname: "John",
          lastname: "Doe",
          picture_url: "https://example.com/john.jpg",
        },
      };
      req.reply({
        statusCode: 200,
        body: newMessage,
      });
    }).as("sendMessage");

    cy.visit("/messages");
  });

  it("should display messages page correctly", () => {
    cy.url().should("include", "/messages");
    cy.wait("@getConversations");

    // Should have the Messages header
    cy.get(".text-lg.md\\:text-xl.archivo-700")
      .should("be.visible")
      .and("contain.text", "Messages");

    // Should have conversations sidebar
    cy.get(".flex.flex-col.w-32.md\\:w-72").should("be.visible");

    // Should have main chat area
    cy.get(".flex.flex-col.w-full").should("be.visible");

    // Should show placeholder when no conversation selected
    cy.contains("Select a conversation to start chatting").should("be.visible");
  });

  it("should display conversation list", () => {
    cy.wait("@getConversations");

    // Should show conversation items using ConversationUser component
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md").should(
      "have.length.greaterThan",
      0
    );

    // Each conversation should have user info and last message
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md")
      .first()
      .within(() => {
        // User avatar
        cy.get(".avatar .w-14.rounded-full img").should("be.visible");

        // User name and last message (on medium+ screens)
        cy.get(".hidden.flex-col.gap-2.truncate.md\\:flex").should("exist");
        cy.get(".text-xl.inter-600").should("be.visible"); // User name
        cy.get(".text-sm.inter-500.text-gray-500.truncate").should(
          "be.visible"
        ); // Last message
      });
  });

  it("should select and open a conversation", () => {
    cy.wait("@getConversations");

    // Click on first conversation
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md").first().click();
    cy.wait("@getMessages");

    // Should display conversation header with participant info
    cy.get(
      ".flex.flex-row.gap-2.border-b.border-\\[\\#E5E5E5\\].p-4.items-center.w-full"
    ).should("be.visible");
    cy.get(".archivo-700.text-lg").should("contain.text", "Alice Johnson");

    // Should display messages in chat format
    cy.get(".chat").should("have.length.greaterThan", 0);
  });

  it("should display message history correctly", () => {
    cy.wait("@getConversations");
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md").first().click();
    cy.wait("@getMessages");

    // Check message structure using DaisyUI chat components
    cy.get(".chat").each(($chat) => {
      cy.wrap($chat).within(() => {
        // Should have chat bubble with message text
        cy.get(".chat-bubble").should("be.visible");

        // Should have chat header with sender name
        cy.get(".chat-header").should("be.visible");

        // Should have chat footer with timestamp
        cy.get(".chat-footer time").should("be.visible");

        // Should have chat image (avatar)
        cy.get(".chat-image.avatar img").should("be.visible");
      });
    });

    // Check message alignment (chat-start vs chat-end)
    cy.get(".chat-start").should("exist"); // Messages from others
    cy.get(".chat-end").should("exist"); // Messages from current user
  });

  it("should send a new message", () => {
    cy.wait("@getConversations");
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md").first().click();
    cy.wait("@getMessages");

    const testMessage = "This is a test message from Cypress!";

    // Type message in input field
    cy.get('input[placeholder="Type your message..."]').type(testMessage);

    // Click send button
    cy.get(".btn.btn-primary").click();

    cy.wait("@sendMessage");

    // Message should appear in the chat
    cy.contains(testMessage).should("be.visible");

    // Input should be cleared
    cy.get('input[placeholder="Type your message..."]').should(
      "have.value",
      ""
    );
  });

  it("should send message using Enter key", () => {
    cy.wait("@getConversations");
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md").first().click();
    cy.wait("@getMessages");

    const testMessage = "Message sent with Enter key!";

    // Type message and press Enter
    cy.get('input[placeholder="Type your message..."]')
      .type(testMessage)
      .type("{enter}");

    cy.wait("@sendMessage");
    cy.contains(testMessage).should("be.visible");
  });

  it("should handle empty message submission", () => {
    cy.wait("@getConversations");
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md").first().click();
    cy.wait("@getMessages");

    // Try to send empty message
    cy.get(".btn.btn-primary").click();

    // Should not make API call for empty message
    cy.get("@sendMessage.all").should("have.length", 0);
  });

  it("should scroll to latest message", () => {
    cy.wait("@getConversations");
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md").first().click();
    cy.wait("@getMessages");

    // Send a new message
    const testMessage = "Latest message";
    cy.get('input[placeholder="Type your message..."]').type(testMessage);
    cy.get(".btn.btn-primary").click();

    cy.wait("@sendMessage");

    // Should scroll to show the latest message (chat container auto-scrolls)
    cy.contains(testMessage).should("be.visible");
    cy.get(".w-full.h-full.flex.flex-col.gap-4.p-5.overflow-y-auto").should(
      "be.visible"
    );
  });

  it("should show message timestamps", () => {
    cy.wait("@getConversations");
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md").first().click();
    cy.wait("@getMessages");

    // Check that messages have timestamps
    cy.get(".chat")
      .first()
      .within(() => {
        cy.get(".chat-footer time").should("be.visible");
        cy.get(".chat-footer time").should("not.be.empty");
      });
  });

  it("should handle no conversations state", () => {
    // Mock empty conversations response
    cy.intercept("GET", "**/chat/", {
      statusCode: 200,
      body: { conversations: [] },
    }).as("getEmptyConversations");

    cy.reload();
    cy.wait("@getEmptyConversations");

    // Should show "No conversations found" message
    cy.contains("No conversations found").should("be.visible");
  });

  it("should display conversation last message preview", () => {
    cy.wait("@getConversations");

    // Check that conversations show last message preview
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md")
      .first()
      .within(() => {
        // Should show last message text or "No messages yet"
        cy.get(".text-sm.inter-500.text-gray-500.truncate").should(
          "contain.text",
          "Hi! I'm interested in your JavaScript skills."
        );
      });
  });

  it("should show participant info in conversation header", () => {
    cy.wait("@getConversations");
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md").first().click();
    cy.wait("@getMessages");

    // Should show participant avatar and name in header
    cy.get(
      ".flex.flex-row.gap-2.border-b.border-\\[\\#E5E5E5\\].p-4.items-center.w-full"
    ).within(() => {
      cy.get(".avatar .w-14.rounded-full img").should("be.visible");
      cy.get(".archivo-700.text-lg").should("contain.text", "Alice Johnson");
    });
  });

  it("should handle message content properly", () => {
    cy.wait("@getConversations");
    cy.get(".flex.flex-row.w-full.p-1.gap-2.rounded-md").first().click();
    cy.wait("@getMessages");

    // Check specific message content
    cy.get(".chat-bubble").should("contain.text", "Hello! How are you?");
    cy.get(".chat-bubble").should(
      "contain.text",
      "I'm doing great! Would you like to swap JavaScript skills?"
    );
  });
});
