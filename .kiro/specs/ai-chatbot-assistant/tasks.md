# Implementation Plan: AI Chatbot Assistant

## Overview

Implement a floating chat widget on all authenticated pages backed by a new `/chatbot` Express route group. The server detects intent, routes to existing services or a general AI handler, and returns structured responses. The client renders typed message bubbles with markdown and deep-link support.

## Tasks

- [x] 1. Set up server-side chatbot feature folder and route skeleton
  - Create `server/features/chatbot/` directory with `chatbot.routes.js`, `chatbot.controller.js`, `chatbot.service.js`
  - Register `POST /chatbot/message` route with `isAuthenticated` and `aiRateLimiter` middleware
  - Mount `/chatbot` router in `server/app.js`
  - _Requirements: 10.1, 10.3_

- [x] 2. Implement message sanitization utility
  - [x] 2.1 Write `sanitizeMessage(text)` in `chatbot.service.js`
    - Strip prompt-injection patterns: `ignore previous instructions`, `system:`, role-override phrases
    - Return sanitized string safe to embed in AI prompts
    - _Requirements: 10.4_

  - [ ]* 2.2 Write property test for message sanitization (Property 9)
    - **Property 9: Message sanitization removes prompt injection patterns**
    - **Validates: Requirements 10.4**
    - Use `fast-check` `injectionArbitrary` generating strings that contain known injection phrases
    - Assert sanitized output does not contain any injection pattern verbatim

- [x] 3. Implement intent detection
  - [x] 3.1 Write `detectIntent(message)` in `chatbot.service.js`
    - Call `callGroq` with the classification prompt from the design doc
    - Parse JSON response; fall back to `callGemini` if Groq fails
    - Return `{ intent, params }` with `intent: "unknown"` if both providers fail
    - Valid intents: `fetch_approach`, `search_problem`, `start_quiz`, `upload_pdf_prompt`, `general_question`, `unknown`
    - _Requirements: 4.1, 4.2, 12.2_

  - [ ]* 3.2 Write property test for intent classification (Property 5)
    - **Property 5: Intent classification returns a valid intent**
    - **Validates: Requirements 4.1**
    - Use `fast-check` `fc.string({ minLength: 1 })` as arbitrary input
    - Assert returned `intent` is always one of the six valid intent strings

- [x] 4. Implement intent handlers in `chatbot.service.js`
  - [x] 4.1 Implement `handleFetchApproach(params, history)`
    - Reuse `solveProblem` logic from `ai.service.js` (import and call directly)
    - Return `{ type: "approach", content, data: ApproachData }`
    - Return clarifying question if `params.problemName` is missing
    - _Requirements: 4.4, 5.1, 5.2, 5.3_

  - [ ]* 4.2 Write property test for approach response shape (Property 6)
    - **Property 6: Approach response contains all required fields**
    - **Validates: Requirements 5.2**
    - Use `fast-check` arbitrary generating valid `ApproachData`-shaped objects
    - Assert `formatApproachResponse` output always has non-empty `title`, `approach` array, `complexity`, and `solutions`

  - [x] 4.3 Implement `handleSearchProblem(params, history)`
    - Reuse `searchProblemByName` logic from `ai.service.js`
    - Return `{ type: "problem", content, data: ProblemData }`
    - Return clarifying question if `params.problemName` is missing
    - _Requirements: 4.4, 6.1, 6.2, 6.3_

  - [ ]* 4.4 Write property test for problem search response shape (Property 7)
    - **Property 7: Problem search response contains all required fields**
    - **Validates: Requirements 6.2**
    - Use `fast-check` arbitrary generating valid `ProblemData`-shaped objects
    - Assert `formatProblemResponse` output always has non-empty `title`, `problem`, `constraints`, `difficulty`, and `tags` array

  - [x] 4.5 Implement `handleStartQuiz(params)`
    - Validate extracted `topic` against the static `VALID_TOPICS` list
    - Build deep-link URL: `/quiz/{topic}` or `/quiz/{topic}/{level}` if level provided
    - Return `{ type: "quiz", content, data: QuizData }` on match
    - Return available topics list as `general_question` response if topic unrecognized
    - _Requirements: 4.4, 7.1, 7.2, 7.4_

  - [ ]* 4.6 Write property test for quiz response shape (Property 8)
    - **Property 8: Quiz response contains topic, levels, and a valid URL**
    - **Validates: Requirements 7.1**
    - Use `fast-check` `fc.constantFrom(...VALID_TOPICS)` as arbitrary
    - Assert `data.url` starts with `/quiz/`, `data.levels` is non-empty, `data.topic` is non-empty

  - [x] 4.7 Implement `handlePdfPrompt()`
    - Return static `{ type: "pdf_link", content: "...", data: null }` with deep-link to `/documents`
    - _Requirements: 8.1, 8.3_

  - [x] 4.8 Implement `handleGeneralQuestion(message, history)`
    - Build conversation prompt with system role (DSA/programming tutor persona)
    - Include `history` as context window (last 10 messages)
    - Call `callGroq`; fall back to `callGemini` on failure
    - Return `{ type: "text", content, data: null }`
    - _Requirements: 3.1, 3.2, 4.3, 9.1, 9.2, 9.3_

- [x] 5. Implement `processMessage` and wire up the controller
  - [x] 5.1 Implement `processMessage(userId, message, history)` in `chatbot.service.js`
    - Call `detectIntent`, route to the correct handler, return structured response
    - Wrap in try/catch; throw typed errors for timeout (>30 s) and service failures
    - _Requirements: 4.1, 4.2, 4.3, 12.1, 12.2_

  - [x] 5.2 Implement `handleMessage(req, res)` in `chatbot.controller.js`
    - Validate `message` is a non-empty string; return 400 otherwise
    - Call `sanitizeMessage`, then `processMessage`
    - Map service errors to correct HTTP status codes (400, 504, 503)
    - _Requirements: 10.1, 10.2, 12.1_

- [x] 6. Checkpoint — server side complete
  - Ensure all server-side tests pass, ask the user if questions arise.

- [x] 7. Implement context window helper and add API function on the client
  - [x] 7.1 Write `buildContextWindow(messages)` utility in `client/src/features/chatbot/chatbot.utils.js`
    - Accept the full `messages` array; return the last 10 mapped to `{ role, content }` with `"ai"` mapped to `"assistant"`
    - _Requirements: 3.1, 3.4_

  - [ ]* 7.2 Write property test for context window slicing (Property 4)
    - **Property 4: Context window is capped at 10 messages**
    - **Validates: Requirements 3.1**
    - Use `fast-check` `fc.array(messageArbitrary, { minLength: 0, maxLength: 30 })`
    - Assert `buildContextWindow(history).length === Math.min(history.length, 10)`
    - Assert returned slice equals `history.slice(-10)` mapped correctly

  - [x] 7.3 Add `sendChatMessage(message, history)` to `client/src/api/api.jsx`
    - `axiosInstance.post("/chatbot/message", { message, history })`
    - _Requirements: 2.1_

- [x] 8. Implement `ChatMessage` sub-component
  - Create `client/src/components/ChatMessage.jsx`
  - Render `type: "text"` with lightweight markdown (bold, italic, inline code, line breaks)
  - Render `type: "approach"` with title, `<ol>` steps, complexity badge, language tags
  - Render `type: "problem"` with title, description, constraints, difficulty badge, tags
  - Render `type: "quiz"` with topic, difficulty buttons, and a `navigate(url)` action button
  - Render `type: "pdf_link"` with a `navigate("/documents")` action button
  - Render `type: "error"` in destructive/red style
  - Visually distinguish user vs AI messages (alignment + background)
  - _Requirements: 5.4, 7.3, 8.2, 11.1, 11.2, 11.3_

- [x] 9. Implement `ChatWidget` component
  - [x] 9.1 Create `client/src/components/ChatWidget.jsx` with core state and toggle logic
    - State: `isOpen`, `messages`, `input`, `isLoading`
    - Fixed `bottom-6 right-6` floating button; toggle `isOpen` on click without clearing messages
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 9.2 Write property test for toggle preserving history (Property 1)
    - **Property 1: Toggle preserves conversation history**
    - **Validates: Requirements 1.3, 3.3**
    - Use `fast-check` `fc.array(messageArbitrary, { minLength: 1 })`
    - Render `ChatWidget` with pre-seeded messages, toggle open→closed→open, assert messages array is identical

  - [x] 9.3 Implement message submission logic in `ChatWidget`
    - Validate non-empty/non-whitespace input before sending
    - Append user message immediately; show loading indicator; call `sendChatMessage`; append AI response
    - Re-enable input and hide loader on success or error
    - On error: append `{ role: "ai", type: "error" }` message without clearing history
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 12.3, 12.4_

  - [ ]* 9.4 Write property test for non-empty submission growing message list (Property 2)
    - **Property 2: Non-empty message submission grows the message list**
    - **Validates: Requirements 2.1, 2.3**
    - Use `fast-check` `fc.string({ minLength: 1 }).filter(s => s.trim().length > 0)`
    - Assert messages length increases by exactly 1 after user message appended (before response)

  - [ ]* 9.5 Write property test for whitespace rejection (Property 3)
    - **Property 3: Whitespace-only messages are rejected**
    - **Validates: Requirements 2.4**
    - Use `fast-check` `fc.stringOf(fc.constantFrom(' ', '\t', '\n'), { minLength: 1 })`
    - Assert no API call is made and messages array is unchanged

  - [ ]* 9.6 Write property test for error preserving chat history (Property 10)
    - **Property 10: Error responses preserve existing chat history**
    - **Validates: Requirements 12.4**
    - Mock `sendChatMessage` to reject with a 500 error
    - Use `fast-check` `fc.array(messageArbitrary)` for existing messages
    - Assert first N+1 messages are unchanged and last message is an error message

  - [x] 9.7 Implement auto-scroll behavior in `ChatWidget`
    - Use `useRef` on the message list container and `useEffect` to scroll to bottom after each messages update
    - _Requirements: 2.6_

  - [x] 9.8 Render `ChatWidget` inside `ProtectedRoute` in `client/src/components/ProtectedRoute.jsx`
    - Import and render `<ChatWidget />` alongside `{children}` so it appears on every authenticated route
    - _Requirements: 1.1, 1.5_

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` and should run a minimum of 100 iterations
- Server-side tests live in `server/features/chatbot/chatbot.test.js`; client-side tests live alongside their components
- The server does not persist chat history — it is entirely client-managed in React state
