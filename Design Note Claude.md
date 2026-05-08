# DesignNote: Chrome Extension Product Spec

## The Problem

Vibe coding with AI is fast but communication is lossy. You're looking at your app in the browser, you see something wrong with a card, a button is misaligned, the spacing feels off, a section needs a total rethink. Then you have to mentally translate what you're seeing into a text prompt and hope the AI understands. There's no shared reference point between you and the model.

DesignNote closes that gap. It lets you point directly at the thing you mean and annotate it, tweak it, then hand all of that context to Claude in one clean prompt.

---

## Core Concept

A sidebar overlay that activates on any webpage and turns your browser into a design annotation workspace. You inspect, comment, and style elements visually. When you're done, you hit "Copy Prompt" and Claude gets the full picture.

---

## Feature Breakdown

### Element Selection and Annotation

When the extension is open, hovering over the page highlights elements with a glowing outline (similar to browser devtools but friendlier). Clicking an element "pins" it and opens a comment bubble anchored to that element. You can write freeform notes like "this feels too cramped, needs more breathing room" or "wrong font weight, should match the heading above." Multiple elements can be pinned simultaneously. Each pinned element gets a numbered badge so the prompt can reference them clearly.

### Style Editor Panel

Once an element is selected, a lightweight style panel appears in the sidebar showing the most useful CSS properties for that element: spacing (padding, margin, gap), typography (font size, weight, line height, color), border radius, background, and shadow. You can tweak values with sliders or direct input. The changes apply live on the page so you can see the effect immediately. The original and modified values are both tracked so the prompt can describe exactly what changed and what the intent was.

### Prompt Builder

This is the core output. After you've annotated and styled, you hit one button and get a single structured prompt that includes all of your comments per element with CSS selectors so Claude knows exactly what you're referring to, a before/after diff of any style changes you made, and any freeform notes you added. The prompt is written in a way that's natural to send to Claude Code or paste into a chat.

**Example output:**

> I made the following design changes and have some feedback on my current UI. Please update the code to match.
>
> Element 1 (`.hero-card .cta-button`): Increase border radius from 4px to 12px, font weight from 400 to 600. Comment: feels too flat and weak visually.
>
> Element 2 (`.sidebar nav`): No style changes. Comment: this section is too wide on desktop, feels like it's eating too much horizontal space. Consider capping it at 240px.

### Session Persistence

Annotations persist while the extension is open so you can navigate around, make changes, come back, and keep building your prompt without losing work. A clear-all button resets the session.

---

## UX Principles

The tool should feel like a Post-it note that understands CSS. It should never feel like devtools. The style panel should expose only the properties that designers actually care about, not the full computed style dump. The comment flow should feel like leaving feedback in Figma, not writing code.

The prompt output is the product. Everything else is scaffolding toward that one button.

---

## V1 Scope

V1 keeps it tight. Element selection, freeform comments, a focused style editor covering spacing / typography / border / color, and a single copy-to-clipboard prompt output. No accounts, no syncing, no history. Just a sharp tool you open when you're mid-session and need to communicate design intent to Claude.

---

## V2 Ideas

- Screenshot capture of the annotated element included in the prompt so you can send it as a multimodal message
- A diff view that shows the visual before/after side by side
- A "send directly to Claude" integration that opens a conversation with the prompt pre-loaded
- Support for annotating responsive breakpoints

---

## Tech Stack

Manifest V3 Chrome extension. The sidebar UI is a React app injected as a content script with a shadow DOM so it never conflicts with the host page's styles. Element highlighting and style injection handled through the content script directly. No backend needed for V1, everything is local state.
