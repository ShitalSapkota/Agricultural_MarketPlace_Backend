# Agricultural Farmer Backend Plan

## 1. Project Goal

Build a production-ready backend for an agricultural marketplace and farm management platform.

The backend will support:

- Farmer registration and farm profiles
- Customer accounts
- Product and category management
- Inventory and product availability
- Shopping cart management
- Orders and order status tracking
- Payments and payment records
- Product reviews and ratings
- Image and document uploads
- JWT authentication and role-based authorization
- PostgreSQL persistence through Prisma ORM
- REST APIs built with NestJS

The implementation should replace the current JSON-file user storage with PostgreSQL. The existing `src/user` feature can be migrated into the new `users` feature during the database stage.

---

## 2. Target Architecture

```text
Backend Agricultural Farmer Project
|
+-- REST API (NestJS)
|      |
|      +-- Authentication (JWT)
|      |
|      +-- PostgreSQL Database (Prisma ORM)
|      |
|      +-- Validation and Error Handling
|      |
|      +-- Role-Based Access Control
|      |
|      +-- File Uploads
|      |
|      +-- Testing and Documentation
|
+-- API Modules
       |
       +-- auth/
       +-- users/
       +-- farmers/
       +-- products/
       +-- orders/
       +-- cart/
       +-- payments/
       +-- categories/
       +-- reviews/
       +-- uploads/
       +-- common/
       +-- database/
       +-- config/
```

---

## 3. Final Source Folder Structure

```text
src/
|
+-- main.ts
+-- app.module.ts
+-- app.controller.ts
+-- app.service.ts
|
+-- auth/
|   +-- auth.module.ts
|   +-- auth.controller.ts
|   +-- auth.service.ts
|   +-- strategies/
|   |   +-- jwt.strategy.ts
|   +-- guards/
|   |   +-- jwt-auth.guard.ts
|   |   +-- roles.guard.ts
|   +-- decorators/
|   |   +-- current-user.decorator.ts
|   |   +-- roles.decorator.ts
|   +-- dto/
|       +-- login.dto.ts
|       +-- register.dto.ts
|       +-- refresh-token.dto.ts
|
+-- users/
|   +-- users.module.ts
|   +-- users.controller.ts
|   +-- users.service.ts
|   +-- dto/
|   |   +-- create-user.dto.ts
|   |   +-- update-user.dto.ts
|   |   +-- change-password.dto.ts
|   +-- entities/
|       +-- user-response.entity.ts
|
+-- farmers/
|   +-- farmers.module.ts
|   +-- farmers.controller.ts
|   +-- farmers.service.ts
|   +-- dto/
|   |   +-- create-farmer-profile.dto.ts
|   |   +-- update-farmer-profile.dto.ts
|   |   +-- update-farm.dto.ts
|   +-- entities/
|       +-- farmer-response.entity.ts
|
+-- products/
|   +-- products.module.ts
|   +-- products.controller.ts
|   +-- products.service.ts
|   +-- dto/
|   |   +-- create-product.dto.ts
|   |   +-- update-product.dto.ts
|   |   +-- product-filter.dto.ts
|   +-- entities/
|       +-- product-response.entity.ts
|
+-- orders/
|   +-- orders.module.ts
|   +-- orders.controller.ts
|   +-- orders.service.ts
|   +-- dto/
|   |   +-- create-order.dto.ts
|   |   +-- update-order-status.dto.ts
|   |   +-- order-filter.dto.ts
|   +-- entities/
|       +-- order-response.entity.ts
|
+-- cart/
|   +-- cart.module.ts
|   +-- cart.controller.ts
|   +-- cart.service.ts
|   +-- dto/
|       +-- add-cart-item.dto.ts
|       +-- update-cart-item.dto.ts
|
+-- payments/
|   +-- payments.module.ts
|   +-- payments.controller.ts
|   +-- payments.service.ts
|   +-- dto/
|   |   +-- create-payment.dto.ts
|   |   +-- payment-webhook.dto.ts
|   +-- gateways/
|       +-- payment-gateway.interface.ts
|       +-- mock-payment.gateway.ts
|
+-- categories/
|   +-- categories.module.ts
|   +-- categories.controller.ts
|   +-- categories.service.ts
|   +-- dto/
|       +-- create-category.dto.ts
|       +-- update-category.dto.ts
|
+-- reviews/
|   +-- reviews.module.ts
|   +-- reviews.controller.ts
|   +-- reviews.service.ts
|   +-- dto/
|       +-- create-review.dto.ts
|       +-- update-review.dto.ts
|
+-- uploads/
|   +-- uploads.module.ts
|   +-- uploads.controller.ts
|   +-- uploads.service.ts
|   +-- storage/
|       +-- storage.interface.ts
|       +-- local-storage.service.ts
|       +-- object-storage.service.ts
|
+-- common/
|   +-- decorators/
|   +-- filters/
|   +-- guards/
|   +-- interceptors/
|   +-- pipes/
|   +-- middleware/
|   +-- pagination/
|   +-- types/
|   +-- constants/
|
+-- database/
|   +-- database.module.ts
|   +-- prisma.service.ts
|   +-- prisma-exception.filter.ts
|
+-- config/
    +-- configuration.ts
    +-- env.validation.ts
```

Database files:

```text
prisma/
+-- schema.prisma
+-- migrations/
+-- seed.ts
```

---

## 4. Module Responsibilities

### `auth/`

Responsible for authentication, not user profile management.

Features:

- Register a user
- Login with email and password
- Hash passwords with bcrypt
- Issue JWT access tokens
- Optionally issue refresh tokens
- Validate JWT payloads
- Protect routes with `JwtAuthGuard`
- Restrict routes with `RolesGuard`
- Expose the authenticated user through `@CurrentUser()`

Suggested endpoints:

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

JWT payload should contain a stable user identifier and role, for example:

```text
{
  sub: userId,
  email: userEmail,
  role: CUSTOMER | FARMER | ADMIN
}
```

Never store plain-text passwords. Never return `passwordHash` in API responses.

### `users/`

Responsible for account records and user profile operations.

Features:

- Find users by ID or email
- Update profile details
- Change password through the auth flow
- Deactivate accounts instead of immediately deleting them
- Admin user management
- Role assignment and account status

Suggested endpoints:

```text
GET    /users/me
PATCH  /users/me
PATCH  /users/me/password
GET    /users/:id
GET    /users                 # admin only
PATCH  /users/:id/role        # admin only
PATCH  /users/:id/status      # admin only
```

### `farmers/`

Responsible for farmer-specific information separate from the base user account.

Features:

- Farmer profile
- Farm name and description
- Farm address and location
- Crop or production information
- Verification status
- Farmer dashboard summaries

Suggested endpoints:

```text
POST  /farmers/profile
GET   /farmers/profile
PATCH /farmers/profile
GET   /farmers/:id
GET   /farmers/:id/products
```

A farmer profile should reference one user. Do not duplicate login fields in the farmer table.

### `products/`

Responsible for products listed by farmers.

Features:

- Create, update, publish, and archive products
- Product name, description, price, unit, and stock quantity
- Product category
- Product images
- Product search, filtering, sorting, and pagination
- Availability checks
- Farmer ownership checks

Suggested endpoints:

```text
POST   /products                    # farmer
GET    /products                    # public
GET    /products/:id                # public
PATCH  /products/:id                # owner/admin
DELETE /products/:id                # owner/admin
PATCH  /products/:id/status         # owner/admin
```

Always validate price and quantity as positive values. Check ownership before allowing a farmer to modify a product.

### `categories/`

Responsible for product classification.

Features:

- Create and edit categories
- Activate or deactivate categories
- List active categories publicly
- Prevent deletion when products still use a category

Suggested endpoints:

```text
GET    /categories
GET    /categories/:id
POST   /categories                  # admin
PATCH  /categories/:id              # admin
DELETE /categories/:id              # admin
```

### `cart/`

Responsible for the current shopping cart of an authenticated customer.

Features:

- Get current cart
- Add product to cart
- Change quantity
- Remove one item
- Clear cart
- Validate product availability before checkout

Suggested endpoints:

```text
GET    /cart
POST   /cart/items
PATCH  /cart/items/:productId
DELETE /cart/items/:productId
DELETE /cart
```

The cart is not the order. At checkout, copy validated product prices and quantities into order items so future price changes do not alter old orders.

### `orders/`

Responsible for order creation and order lifecycle.

Features:

- Create an order from the current cart
- Store immutable order item snapshots
- Calculate subtotal, delivery fee, discount, and total
- Track order status
- Allow customers to view their orders
- Allow farmers to view relevant order items
- Allow admins to manage order status

Suggested statuses:

```text
PENDING_PAYMENT
PAID
CONFIRMED
PROCESSING
READY_FOR_DELIVERY
DELIVERED
CANCELLED
REFUNDED
```

Suggested endpoints:

```text
POST  /orders
GET   /orders
GET   /orders/:id
PATCH /orders/:id/cancel
PATCH /orders/:id/status            # farmer/admin, according to rules
```

Order creation must use a database transaction. Recheck stock inside the transaction and reduce inventory atomically.

### `payments/`

Responsible for payment records and payment provider integration.

Initial implementation:

- Create a payment record for an order
- Use a mock gateway during development
- Keep the gateway behind an interface
- Update payment and order status only after verified payment results
- Add webhook handling later for a real provider

Suggested endpoints:

```text
POST /payments/intent
GET  /payments/:id
POST /payments/webhook
```

Never trust a payment status sent directly by a client. Verify provider webhooks and make webhook processing idempotent.

### `reviews/`

Responsible for product ratings and written reviews.

Rules:

- Only authenticated customers can create reviews
- A customer can review only a product they purchased and received
- One review per customer per order item or product, according to the business rule
- Customers can edit or remove their own reviews
- Admins can moderate reviews

Suggested endpoints:

```text
GET    /products/:productId/reviews
POST   /products/:productId/reviews
PATCH  /reviews/:id
DELETE /reviews/:id
```

### `uploads/`

Responsible for product, farmer, and profile images.

Implementation order:

1. Start with local disk storage for development.
2. Validate file type and maximum size.
3. Generate safe unique filenames.
4. Store only the file URL and metadata in PostgreSQL.
5. Move to object storage for production without changing feature modules.

Suggested endpoints:

```text
POST /uploads/image
DELETE /uploads/:id
```

Do not trust the original filename or MIME type alone. Validate the file and restrict allowed extensions and size.

### `common/`

Reusable cross-cutting code:

- JWT and role decorators
- Global exception filters
- Request logging
- Response transformation
- Pagination types and helpers
- Shared validation pipes
- Common API response types
- Application constants

Keep business rules out of `common/`. Domain logic belongs in its feature module.

### `database/`

Responsible for Prisma integration.

Features:

- Provide one `PrismaService`
- Connect and disconnect with application lifecycle hooks
- Expose Prisma through `DatabaseModule`
- Translate known Prisma errors into API errors
- Provide transaction helpers where useful

Use Prisma migrations for schema changes. Do not edit the database manually in normal development.

### `config/`

Responsible for validated configuration.

Configuration should include:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_SECRET` if refresh tokens are used
- `JWT_REFRESH_EXPIRES_IN`
- `CORS_ORIGIN`
- Upload storage settings
- Payment provider settings

Fail application startup when required environment variables are missing.

---

## 5. Database Design

Start with these Prisma models:

```text
User
- id
- email
- passwordHash
- firstName
- lastName
- phone
- role
- status
- createdAt
- updatedAt

FarmerProfile
- id
- userId
- farmName
- description
- address
- city
- country
- verificationStatus
- createdAt
- updatedAt

Category
- id
- name
- slug
- description
- isActive
- createdAt
- updatedAt

Product
- id
- farmerId
- categoryId
- name
- slug
- description
- price
- unit
- stockQuantity
- isPublished
- createdAt
- updatedAt

ProductImage
- id
- productId
- url
- altText
- sortOrder
- createdAt

Cart
- id
- userId
- createdAt
- updatedAt

CartItem
- id
- cartId
- productId
- quantity
- createdAt
- updatedAt

Order
- id
- customerId
- status
- subtotal
- deliveryFee
- total
- shippingAddress
- createdAt
- updatedAt

OrderItem
- id
- orderId
- productId
- farmerId
- productNameSnapshot
- unitPriceSnapshot
- quantity
- lineTotal

Payment
- id
- orderId
- provider
- providerPaymentId
- status
- amount
- currency
- paidAt
- createdAt
- updatedAt

Review
- id
- productId
- customerId
- rating
- comment
- createdAt
- updatedAt

Upload
- id
- ownerId
- url
- storageKey
- mimeType
- size
- createdAt
```

Important database rules:

- Use UUIDs or cuid IDs consistently.
- Add unique constraints to email, slugs, and provider payment IDs.
- Add indexes for email, product category, farmer, order customer, and order status.
- Use decimal-safe numeric types for money.
- Use enums for role, status, payment status, and order status.
- Add foreign keys with deliberate delete behavior.
- Use soft deletion or archive flags for products and users where history matters.
- Add timestamps to every business entity.

---

## 6. Step-by-Step Implementation Plan

### Phase 0: Stabilize the current project

1. Confirm the project builds with `npm run build`.
2. Run the existing tests with `npm test`.
3. Keep the current JSON user implementation only as a temporary reference.
4. Do not add new features to the JSON storage layer.
5. Commit the current working state before the database migration.

### Phase 1: Configure PostgreSQL and Prisma

1. Install or start PostgreSQL locally.
2. Create a development database.
3. Add a `.env` file with `DATABASE_URL`.
4. Add `.env` to `.gitignore` and commit `.env.example` instead.
5. Add the Prisma schema under `prisma/schema.prisma`.
6. Configure `prisma.config.ts` for the ORM schema path when required by the installed Prisma version.
7. Create the `User` model first.
8. Generate the Prisma client.
9. Create the first migration.
10. Verify the migration with Prisma Studio or a database client.

Typical commands:

```powershell
npx prisma validate
npx prisma generate
npx prisma migrate dev --name create_users
npx prisma studio
```

Use the exact command options supported by the installed Prisma version if the CLI reports a version-specific change.

### Phase 2: Add the database module

1. Create `src/database/database.module.ts`.
2. Create `src/database/prisma.service.ts`.
3. Register `PrismaService` as a global provider or import `DatabaseModule` explicitly.
4. Add connection lifecycle handling.
5. Add a health check that confirms the API can reach PostgreSQL.
6. Add tests for connection setup and common database errors.

### Phase 3: Migrate users from JSON to PostgreSQL

1. Create the `User` Prisma model.
2. Add `UsersModule`, `UsersController`, and `UsersService`.
3. Replace `readFileSync` and `writeFileSync` with Prisma queries.
4. Preserve existing user API behavior where practical.
5. Add password hashing fields without exposing them in responses.
6. Create a one-time seed or migration script for the two existing JSON users if they are needed.
7. Remove the JSON write behavior after database tests pass.
8. Remove or archive the old `src/user` implementation.

### Phase 4: Implement configuration and validation

1. Add `@nestjs/config` if it is not already installed.
2. Create typed configuration in `src/config/configuration.ts`.
3. Validate environment variables at startup.
4. Add global `ValidationPipe` with transformation and whitelist settings.
5. Add a consistent error response format.
6. Configure CORS and request body limits.

### Phase 5: Implement authentication and authorization

1. Add `AuthModule`.
2. Create registration DTO validation.
3. Hash passwords with bcrypt before saving.
4. Create login validation.
5. Issue JWT access tokens.
6. Implement `JwtStrategy` and `JwtAuthGuard`.
7. Add role enums: `CUSTOMER`, `FARMER`, `ADMIN`.
8. Implement `Roles` decorator and `RolesGuard`.
9. Protect private endpoints.
10. Add tests for valid login, invalid login, expired token, missing token, and insufficient role.

### Phase 6: Implement farmer profiles and categories

1. Add `FarmerProfile` migration.
2. Add farmer profile CRUD endpoints.
3. Restrict farmer profile creation to farmer accounts.
4. Add category CRUD endpoints.
5. Restrict category administration to admins.
6. Add unique slugs and active/inactive behavior.
7. Test ownership and role restrictions.

### Phase 7: Implement products and inventory

1. Add `Product` and `ProductImage` models.
2. Add product creation for farmers.
3. Add public product listing with pagination.
4. Add filtering by category, farmer, price, and availability.
5. Add ownership checks for updates and deletion.
6. Add archive behavior instead of destructive deletion where orders reference products.
7. Add inventory validation.
8. Add product unit and money validation.

### Phase 8: Implement cart and orders

1. Add `Cart` and `CartItem` models.
2. Create one active cart per customer.
3. Add cart item validation.
4. Add order and order item models.
5. Implement checkout from cart in a transaction.
6. Snapshot product name and price into order items.
7. Recheck inventory during checkout.
8. Clear the cart only after successful order creation.
9. Add customer, farmer, and admin order views.
10. Implement allowed order status transitions.

### Phase 9: Implement payments

1. Add `Payment` model.
2. Create a payment gateway interface.
3. Implement a mock gateway for local development.
4. Create payment intent endpoint.
5. Connect successful payment to order status.
6. Add webhook verification and idempotency.
7. Add failure and cancellation handling.
8. Integrate a real provider only after order logic is stable.

### Phase 10: Implement reviews and uploads

1. Add review creation rules based on completed orders.
2. Add product review listing and average rating calculation.
3. Add review moderation for admins.
4. Add local image upload for development.
5. Validate upload size, extension, MIME type, and ownership.
6. Store upload metadata in PostgreSQL.
7. Add an object-storage adapter for production.

### Phase 11: Testing and API quality

1. Unit-test every service's business rules.
2. Controller-test validation and authorization behavior.
3. Add e2e tests for:
   - registration and login
   - farmer product creation
   - public product listing
   - cart checkout
   - payment success/failure
   - review authorization
4. Add test database setup and cleanup.
5. Add Swagger/OpenAPI documentation.
6. Add pagination and standard response examples.
7. Add linting and formatting to the development workflow.

### Phase 12: Production readiness

1. Use environment variables for all secrets.
2. Use PostgreSQL migrations during deployment.
3. Configure structured logging.
4. Add health and readiness endpoints.
5. Add rate limiting for login and public endpoints.
6. Add request correlation IDs.
7. Configure secure CORS.
8. Configure HTTPS at the deployment layer.
9. Add database backups and monitoring.
10. Review authorization on every write endpoint.
11. Run build, lint, unit tests, and e2e tests in CI.
12. Deploy only after migrations pass in a staging environment.

---

## 7. Recommended Build Order

Implement in this exact dependency order:

```text
1. Configuration
2. DatabaseModule and PrismaService
3. User model and UsersModule
4. AuthModule and JWT guards
5. Roles and authorization
6. Farmer profiles
7. Categories
8. Products and inventory
9. Cart
10. Orders
11. Payments
12. Reviews
13. Uploads
14. Swagger, tests, logging, and deployment
```

Do not build payments before orders, and do not build orders before products and inventory. The domain dependencies flow from identity to ownership to catalog to checkout.

---

## 8. API Conventions

Use a versioned API prefix:

```text
/api/v1
```

Examples:

```text
GET /api/v1/products?page=1&limit=20
POST /api/v1/auth/login
GET /api/v1/users/me
POST /api/v1/orders
```

Recommended conventions:

- Use plural resource names.
- Use HTTP status codes consistently.
- Return DTOs, not Prisma entities directly.
- Never expose password hashes or internal payment secrets.
- Validate request bodies, query parameters, and route parameters.
- Use pagination for collections.
- Return consistent error objects.
- Use UTC timestamps.
- Document authentication requirements in Swagger.

---

## 9. Environment File

Create `.env.example`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/agricultural_farmer
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=replace-with-another-long-random-secret
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3001
UPLOAD_DRIVER=local
UPLOAD_DIRECTORY=./uploads
PAYMENT_DRIVER=mock
```

Never commit real secrets to Git.

---

## 10. First Milestone

The first completed milestone should be:

```text
PostgreSQL + Prisma
        |
        +-- User model
        +-- DatabaseModule
        +-- UsersModule
        +-- AuthModule
        +-- JWT login
        +-- Protected /users/me endpoint
        +-- Unit and e2e tests
```

Acceptance criteria:

- The application starts with a valid `DATABASE_URL`.
- Users are stored in PostgreSQL, not `users.json`.
- Registration hashes the password.
- Login returns a JWT.
- Protected routes reject missing or invalid tokens.
- `/users/me` returns the authenticated user's safe profile.
- Password hashes are never returned.
- Migrations can create the database schema from an empty database.
- `npm run build`, lint, unit tests, and e2e tests pass.

After this milestone is stable, continue with farmer profiles and products.
