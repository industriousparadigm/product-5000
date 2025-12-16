# Database Schema

## Overview

Two main entities: Products and Ideas. A user can have many products, and each product can have many ideas.

## Entity: User (NextAuth managed)

NextAuth handles user storage. We store minimal user data.

| Field     | Type      | Description                        |
|-----------|-----------|-----------------------------------|
| id        | text      | Primary key (from GitHub)         |
| name      | text      | Display name from GitHub          |
| email     | text      | Email from GitHub                 |
| image     | text      | Avatar URL from GitHub            |

## Entity: Product

A product represents something the PM is building or managing.

| Field       | Type      | Description                              |
|-------------|-----------|------------------------------------------|
| id          | uuid      | Primary key                              |
| name        | text      | Product name (required)                  |
| description | text      | Optional longer description              |
| userId      | text      | Foreign key to user (owner)              |
| createdAt   | timestamp | When product was created                 |
| updatedAt   | timestamp | Last modification time                   |

**Why these fields:**
- `name` + `description`: Minimal metadata, enough to identify what this product is
- `userId`: Multi-tenancy - each user only sees their own products
- Timestamps: Useful for sorting and auditing

## Entity: Idea

An idea represents a potential feature, improvement, or hypothesis for a product.

| Field           | Type      | Description                                    |
|-----------------|-----------|------------------------------------------------|
| id              | uuid      | Primary key                                    |
| productId       | uuid      | Foreign key to product                         |
| name            | text      | Short name/title (required)                    |
| problem         | text      | What problem does this solve? (required)       |
| funnelStage     | text      | L1-L7 funnel position (nullable)              |
| impact          | integer   | Expected impact 1-10 (nullable)               |
| ease            | integer   | Implementation ease 1-10 (nullable)           |
| confidenceBasis | text      | Opinion, Anecdote, Data, or Validated         |
| smallestTest    | text      | What's the smallest test? (nullable)          |
| status          | text      | Parked, Testing, Validated, Shipped, Killed   |
| evidence        | text      | Notes on validation evidence (nullable)       |
| createdAt       | timestamp | When idea was created                          |
| updatedAt       | timestamp | Last modification time                         |

**Why these fields:**

- `name` + `problem`: The core of any idea - what is it and why does it matter
- `funnelStage`: L1-L7 maps to typical funnel stages (Awareness → Activation → ... → Referral). Helps spot gaps in where you're focusing
- `impact` + `ease`: The classic prioritization matrix. Impact×Ease gives a quick priority score
- `confidenceBasis`: Forces PMs to be honest about how confident they are. Validated > Data > Anecdote > Opinion
- `smallestTest`: Encourages lean thinking - what's the cheapest way to validate?
- `status`: Lifecycle tracking. Parked = backlog, Testing = actively validating, etc.
- `evidence`: Notes field for capturing what you learned

## Enums

### FunnelStage
```
L1 - Awareness
L2 - Acquisition
L3 - Activation
L4 - Revenue
L5 - Retention
L6 - Referral
L7 - Post-funnel (support, ops, etc.)
```

### ConfidenceBasis
```
Opinion   - "I think this would work"
Anecdote  - "A customer mentioned this"
Data      - "Analytics show X"
Validated - "We tested and confirmed"
```

### IdeaStatus
```
Parked    - In backlog, not actively pursuing
Testing   - Currently validating hypothesis
Validated - Test confirmed the hypothesis
Shipped   - Built and released
Killed    - Invalidated or abandoned
```

## Relationships

```
User (1) ─────< Product (many)
Product (1) ───< Idea (many)
```

## Indexes

- `products.userId` - Fast lookup of user's products
- `ideas.productId` - Fast lookup of product's ideas
- `ideas.status` - Fast filtering by status
- `ideas.funnelStage` - Fast filtering by funnel stage
