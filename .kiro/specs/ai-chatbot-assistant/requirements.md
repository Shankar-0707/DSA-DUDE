# Requirements Document

## Introduction

The AI Chatbot Assistant is a floating chat widget integrated into the existing React + Node.js project. It appears as a small icon on every authenticated page. When clicked, it opens a chat panel where the user can converse with an AI in natural language. The AI handles two categories of requests:

1. **Project-aware operations** — the user can ask the chatbot to perform actions that the project already supports (fetch a problem approach, start a quiz, summarize a PDF, etc.) and the chatbot executes those operations on the user's behalf by calling the relevant backend services.
2. **General knowledge questions** — the user can ask anything (e.g., "Why is DSA important?") and the AI responds conversationally.

The chatbot maintains a short in-session conversation history so follow-up messages are contextually coherent.

---

## Glossary

- **Chatbot**: The AI-powered floating chat widget described in this document.
- **Chat_Widget**: The floating button and expandable panel rendered on the client side.
- **Chat_Session**: A single continuous conversation between a user and the Chatbot, lasting from widget open until the page is refreshed or the session is explicitly cleared.
- **Message**: A single unit of communication — either a user message or an AI response — within a Chat_Session.
- **Intent**: The action or topic the Chatbot infers from a user Message (e.g., `fetch_approach`, `start_quiz`, `general_question`).
- **Project_Operation**: Any action the Chatbot can perform by calling an existing backend service (Approaches, Visualize, PDF, Quiz).
- **Chatbot_Backend**: The new `/chatbot` route group added to the Node.js server that handles chat requests.
- **AI_Provider**: The underlying LLM service (Groq / Gemini) used via the existing `callGroq` / `callGemini` utilities.
- **Context_Window**: The last N messages from the Chat_Session sent to the AI_Provider to maintain conversational context.
- **Rate_Limiter**: The existing per-user request throttle middleware already used in the project.

---

## Requirements

### Requirement 1: Floating Chat Widget

**User Story:** As an authenticated user, I want a floating chat icon always visible on screen, so that I can open the chatbot at any time without navigating away from my current page.

#### Acceptance Criteria

1. THE Chat_Widget SHALL render a floating action button fixed to the bottom-right corner of the viewport on every authenticated route.
2. WHEN the user clicks the floating button, THE Chat_Widget SHALL expand into a chat panel displaying the conversation history of the current Chat_Session.
3. WHEN the chat panel is open and the user clicks the floating button again, THE Chat_Widget SHALL collapse the chat panel without clearing the Chat_Session.
4. WHILE the chat panel is open, THE Chat_Widget SHALL display a text input field and a send button.
5. THE Chat_Widget SHALL NOT render on unauthenticated routes (landing page, login, signup).

---

### Requirement 2: Sending and Receiving Messages

**User Story:** As a user, I want to type a message and receive an AI response, so that I can interact with the chatbot naturally.

#### Acceptance Criteria

1. WHEN the user submits a non-empty message, THE Chat_Widget SHALL append the user's Message to the chat panel immediately and send it to the Chatbot_Backend.
2. WHILE a response is being fetched, THE Chat_Widget SHALL display a loading indicator in the chat panel.
3. WHEN the Chatbot_Backend returns a response, THE Chat_Widget SHALL append the AI Message to the chat panel and remove the loading indicator.
4. IF the user submits an empty message, THEN THE Chat_Widget SHALL reject the submission without sending a request to the Chatbot_Backend.
5. IF the Chatbot_Backend returns an error, THEN THE Chat_Widget SHALL display a descriptive error message in the chat panel instead of a blank response.
6. THE Chat_Widget SHALL scroll to the latest Message automatically after each new Message is appended.

---

### Requirement 3: Conversation Context

**User Story:** As a user, I want the AI to remember what I said earlier in the same session, so that follow-up questions are answered coherently.

#### Acceptance Criteria

1. THE Chatbot_Backend SHALL include the last 10 Messages of the Chat_Session as the Context_Window when calling the AI_Provider.
2. WHEN the user sends a follow-up message that references a prior Message, THE Chatbot_Backend SHALL resolve the reference using the Context_Window.
3. WHEN the user closes and reopens the chat panel within the same page session, THE Chat_Widget SHALL restore the in-memory Chat_Session history.
4. WHEN the page is refreshed, THE Chat_Widget SHALL start a new Chat_Session with an empty history.

---

### Requirement 4: Intent Detection and Routing

**User Story:** As a user, I want the AI to understand whether I'm asking a general question or requesting a project operation, so that it responds or acts appropriately.

#### Acceptance Criteria

1. WHEN a Message is received, THE Chatbot_Backend SHALL classify the Intent as one of: `fetch_approach`, `search_problem`, `start_quiz`, `upload_pdf_prompt`, `general_question`, or `unknown`.
2. WHEN the Intent is a Project_Operation, THE Chatbot_Backend SHALL extract the required parameters from the Message (e.g., problem name, quiz topic, difficulty level).
3. WHEN the Intent is `general_question` or `unknown`, THE Chatbot_Backend SHALL forward the Message and Context_Window to the AI_Provider and return the plain-text response.
4. IF the Chatbot_Backend cannot extract required parameters for a Project_Operation, THEN THE Chatbot_Backend SHALL return a clarifying question asking the user for the missing information.

---

### Requirement 5: Fetch Problem Approach via Chat

**User Story:** As a user, I want to ask the chatbot for a problem's approach by name, so that I can get the approach without manually navigating to the Approaches section.

#### Acceptance Criteria

1. WHEN the Intent is `fetch_approach` and a problem name is provided, THE Chatbot_Backend SHALL call the existing AI approach service with the extracted problem name.
2. WHEN the approach is returned, THE Chatbot_Backend SHALL format the response to include the problem title, approach steps, time complexity, and available solution languages.
3. IF the AI approach service returns an error, THEN THE Chatbot_Backend SHALL return a user-friendly error message indicating the approach could not be fetched.
4. WHEN the approach is displayed, THE Chat_Widget SHALL render the approach steps as a structured list within the chat panel.

---

### Requirement 6: Search Problem by Name via Chat

**User Story:** As a user, I want to ask the chatbot to find a problem by name, so that I can get the problem description and constraints without leaving the current page.

#### Acceptance Criteria

1. WHEN the Intent is `search_problem` and a problem name is provided, THE Chatbot_Backend SHALL call the existing problem search service with the extracted name.
2. WHEN the problem is found, THE Chatbot_Backend SHALL return the problem title, description, constraints, difficulty, and tags.
3. IF the problem search service returns no result, THEN THE Chatbot_Backend SHALL inform the user that the problem was not found and suggest rephrasing.

---

### Requirement 7: Start a Quiz via Chat

**User Story:** As a user, I want to ask the chatbot to start a quiz on a topic, so that I can begin a quiz session through conversation.

#### Acceptance Criteria

1. WHEN the Intent is `start_quiz` and a topic is identified, THE Chatbot_Backend SHALL return a structured response containing the quiz topic, available difficulty levels, and a deep-link URL to the quiz page.
2. WHEN the difficulty level is also specified in the Message, THE Chatbot_Backend SHALL include the direct deep-link URL to that specific quiz level.
3. THE Chat_Widget SHALL render the deep-link URL as a clickable button that navigates the user to the quiz page.
4. IF the topic extracted from the Message does not match any available quiz topic, THEN THE Chatbot_Backend SHALL list the available topics and ask the user to choose one.

---

### Requirement 8: PDF / Resume Assistance via Chat

**User Story:** As a user, I want to ask the chatbot about my uploaded PDFs, so that I can get information about my documents without navigating to the PDF section.

#### Acceptance Criteria

1. WHEN the Intent is `upload_pdf_prompt`, THE Chatbot_Backend SHALL return a response directing the user to the PDF section with a deep-link URL.
2. THE Chat_Widget SHALL render the deep-link URL as a clickable button.
3. WHEN the user asks a general question about PDF features (e.g., "what can I do with PDFs here?"), THE Chatbot_Backend SHALL describe the PDF section's capabilities: upload, AI summary, Q&A, and history.

---

### Requirement 9: General Knowledge Responses

**User Story:** As a user, I want to ask the chatbot general questions unrelated to the project, so that I can get helpful answers without leaving the app.

#### Acceptance Criteria

1. WHEN the Intent is `general_question`, THE Chatbot_Backend SHALL send the Message and Context_Window to the AI_Provider with a system prompt that identifies the assistant as a helpful DSA and programming tutor.
2. THE Chatbot_Backend SHALL return the AI_Provider's plain-text response without modification.
3. WHEN the general question is related to DSA concepts (e.g., "explain dynamic programming"), THE Chatbot_Backend SHALL instruct the AI_Provider to respond with a clear explanation suitable for a student.

---

### Requirement 10: Authentication and Security

**User Story:** As a system operator, I want the chatbot endpoint to be protected, so that only authenticated users can use it.

#### Acceptance Criteria

1. THE Chatbot_Backend SHALL require a valid authenticated session for all `/chatbot` routes, using the existing `isAuthenticated` middleware.
2. IF a request to `/chatbot` is made without a valid session, THEN THE Chatbot_Backend SHALL return a 401 Unauthorized response.
3. THE Chatbot_Backend SHALL apply the existing Rate_Limiter to all `/chatbot` routes to prevent abuse.
4. THE Chatbot_Backend SHALL sanitize all user-provided message content before including it in prompts sent to the AI_Provider.

---

### Requirement 11: Response Formatting

**User Story:** As a user, I want chatbot responses to be clearly formatted, so that structured content like steps and links is easy to read.

#### Acceptance Criteria

1. WHEN the Chatbot_Backend returns a Project_Operation result, THE Chat_Widget SHALL render structured fields (lists, code snippets, links) using appropriate visual formatting.
2. WHEN the Chatbot_Backend returns a plain-text general answer, THE Chat_Widget SHALL render the text with basic markdown support (bold, italic, inline code, line breaks).
3. THE Chat_Widget SHALL visually distinguish user Messages from AI Messages using different alignment and background colors.

---

### Requirement 12: Error Handling and Resilience

**User Story:** As a user, I want the chatbot to handle failures gracefully, so that a backend error doesn't leave me with a broken UI.

#### Acceptance Criteria

1. IF the AI_Provider call times out after 30 seconds, THEN THE Chatbot_Backend SHALL return a 504 response with a message indicating the AI service is temporarily unavailable.
2. IF the AI_Provider returns a quota-exceeded error, THEN THE Chatbot_Backend SHALL attempt the fallback model sequence defined in the existing `callGemini` utility before returning an error.
3. WHEN the Chatbot_Backend returns any 4xx or 5xx response, THE Chat_Widget SHALL display a human-readable error message in the chat panel and re-enable the input field.
4. THE Chat_Widget SHALL NOT lose existing Chat_Session history when an error occurs.
