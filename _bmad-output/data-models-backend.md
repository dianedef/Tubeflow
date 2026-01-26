# Data Models (Backend)

## Overview

Database schema defined in `convex/schema.ts`.

### Tables

#### `notes`

Stores user notes and generated summaries.

| Field           | Type          | Required | Description                          |
| --------------- | ------------- | -------- | ------------------------------------ |
| `_id`           | `id("notes")` | Yes      | System-generated ID                  |
| `_creationTime` | `number`      | Yes      | Timestamp                            |
| `userId`        | `string`      | Yes      | User ID from authentication provider |
| `title`         | `string`      | Yes      | Note title                           |
| `content`       | `string`      | Yes      | Note body content                    |
| `summary`       | `string`      | No       | AI-generated summary (optional)      |
