# API Contracts (Backend)

## Overview

Backend API powered by Convex.

### Notes API (`convex/notes.ts`)

| Function     | Type     | Args                            | Description                                                                  |
| ------------ | -------- | ------------------------------- | ---------------------------------------------------------------------------- |
| `getNotes`   | Query    | `{}`                            | Get all notes for the authenticated user                                     |
| `getNote`    | Query    | `{ id: v.id("notes") }`         | Get a specific note by ID                                                    |
| `createNote` | Mutation | `{ title, content, isSummary }` | Create a new note. Triggers async summary generation if `isSummary` is true. |
| `deleteNote` | Mutation | `{ noteId }`                    | Delete a note by ID                                                          |

### OpenAI API (`convex/openai.ts`)

| Function       | Type              | Args                     | Description                           |
| -------------- | ----------------- | ------------------------ | ------------------------------------- |
| `openaiKeySet` | Query             | `{}`                     | Check if OpenAI API key is configured |
| `summary`      | Internal Action   | `{ id, title, content }` | Generate summary using GPT-4          |
| `saveSummary`  | Internal Mutation | `{ id, summary }`        | Save generated summary to database    |
