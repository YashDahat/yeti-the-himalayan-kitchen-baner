# Feature Enrichment — Attempt 1

Generated: 2026-07-07

Each section is one LLM call (~5–8K tokens). The instruction tells the generator how all files in the feature interact and what contracts they must honour.

---

## Shared Backend (Core)

**Name:** `shared-backend-core`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/yetithehimalayankitchenbaner/exception/GlobalExceptionHandler.java` — EXCEPTION layer — centralizes exception handling across the application, returning consistent `ErrorResponse` DTOs for various error conditions.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/exception/ResourceNotFoundException.java` — EXCEPTION layer — a custom unchecked exception indicating that a requested resource could not be found.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/ErrorResponse.java` — DTO layer — defines the standard structure for error responses returned by the API.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/SpaController.java` — CONTROLLER layer — handles all non-API and non-static requests by forwarding them to the frontend's `index.html` for client-side routing.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/config/AdminInitializer.java` — CONFIG layer — initializes a default administrator user if one does not already exist, ensuring initial access to the admin portal.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/config/DataSeeder.java` — CONFIG layer — populates the database with initial sample menu categories and menu items for development and demonstration purposes.

**Feature Instruction:**

This `shared-backend-core` feature provides foundational backend components essential for the application's operation, including global exception handling, single-page application (SPA) routing, and initial data seeding. It ensures a consistent error response format across the API, correctly routes frontend requests, and sets up initial administrative users and sample menu data upon application startup.

### Global Exception Handling
The `GlobalExceptionHandler` centralizes the handling of various exceptions thrown by controllers and services. It catches specific exceptions like `ResourceNotFoundException` and general `Exception` types, mapping them to appropriate HTTP status codes and formatting the response using the `ErrorResponse` DTO. This ensures a consistent and predictable error structure for API consumers. The `ResourceNotFoundException` is a custom exception used when a requested entity cannot be found, allowing for specific error handling.

### SPA Routing
The `SpaController` is responsible for forwarding all non-API and non-static file requests to the `index.html` file. This is crucial for enabling client-side routing in the React single-page application, allowing the frontend to manage its own routes without requiring explicit backend routes for every possible URL path.

### Application Initialization and Data Seeding
Upon application startup, two configuration components run:

1.  **AdminInitializer**: This component ensures that an initial administrator user exists in the system. It injects `UserService` from the `shared-backend-auth` feature. If no admin user is found, it calls `userService.registerAdmin(String email, String password)` to create a new admin user with predefined credentials. This is vital for initial setup and access to the admin portal. The `UserService` method `findByEmail(String email): Optional<User>` is used to check for existing admin users.

2.  **DataSeeder**: This component populates the database with essential sample data, such as menu item categories and menu items. It injects `MenuItemRepository` and `MenuItemCategoryRepository` from the `menu-backend` feature. It creates instances of `MenuItemCategory` and `MenuItem` entities and persists them using `menuItemCategoryRepository.saveAll(List<MenuItemCategory>)` and `menuItemRepository.saveAll(List<MenuItem>)`. This provides a ready-to-use dataset for development, testing, and demonstration purposes.

### Cross-Feature Interactions
-   `AdminInitializer` interacts with `shared-backend-auth`'s `UserService` by calling `userService.findByEmail(String email): Optional<User>` to check for an existing admin and `userService.registerAdmin(String email, String password): User` to create a new admin user if necessary.
-   `DataSeeder` interacts with `menu-backend`'s `MenuItemRepository` and `MenuItemCategoryRepository` by calling `saveAll(Iterable<MenuItem>)` and `saveAll(Iterable<MenuItemCategory>)` respectively to populate initial menu data.

---

## Shared Backend (Authentication)

**Name:** `shared-backend-auth`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/User.java` — MODEL layer — Represents a user account in the database, storing authentication details and roles.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/Role.java` — MODEL layer — Enum defining the distinct roles a user can have within the application.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/repository/UserRepository.java` — REPOSITORY layer — Provides data access operations for the User entity, including custom queries like finding a user by email.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/service/UserService.java` — SERVICE layer — Implements business logic for user registration and acts as Spring Security's UserDetailsService to load user details for authentication.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/AuthController.java` — CONTROLLER layer — Exposes REST endpoints for user registration and login, returning JWTs upon successful authentication.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/AuthRequest.java` — DTO layer — Data Transfer Object used for incoming user login and registration requests.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/AuthResponse.java` — DTO layer — Data Transfer Object used for outgoing authentication responses, containing the generated JWT.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/config/SecurityConfig.java` — CONFIG layer — Configures Spring Security for the application, defining authentication providers, password encoders, and authorization rules for API endpoints.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/security/JwtAuthFilter.java` — CONFIG layer — A custom Spring Security filter that intercepts incoming requests to validate JWTs from the Authorization header and set the security context.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/util/JwtUtil.java` — UTIL layer — Provides utility methods for generating, parsing, and validating JSON Web Tokens (JWTs) using a configured secret key.

**Feature Instruction:**

This feature provides the core backend authentication and authorization mechanisms for Yeti - The Himalayan Kitchen. It encompasses user registration, login, JWT generation, and request authorization using Spring Security.

## User Management and Authentication Flow
1.  **User Registration**: A new user (customer or admin) sends an `AuthRequest` to `AuthController.register`. The `AuthController` delegates to `UserService.registerUser(User user)`. `UserService` encrypts the password using `PasswordEncoder` (defined in `SecurityConfig`) and saves the new `User` entity to the `UserRepository`.
2.  **User Login**: A user sends an `AuthRequest` (email and password) to `AuthController.login`. The `AuthController` uses Spring Security's `AuthenticationManager` to authenticate the user. Upon successful authentication, `JwtUtil.generateToken(String email, Role role)` is called to create a JSON Web Token (JWT). This JWT is then returned to the client within an `AuthResponse`.
3.  **JWT Validation and Authorization**: For subsequent authenticated requests, the client includes the JWT in the `Authorization` header (e.g., `Bearer <token>`). The `JwtAuthFilter` (a custom Spring Security filter) intercepts these requests. It extracts the JWT, validates it using `JwtUtil.validateToken(String token, UserDetails userDetails)`, and retrieves user details via `UserService.loadUserByUsername(String email)`. If the token is valid, the filter sets the `SecurityContextHolder` with the authenticated user, allowing Spring Security to enforce authorization rules defined in `SecurityConfig`.

## Security Configuration (`SecurityConfig.java`)
*   **Password Encoding**: Defines a `BCryptPasswordEncoder` bean for secure password hashing.
*   **CORS**: Configures Cross-Origin Resource Sharing to allow requests from the frontend application.
*   **CSRF**: Disables CSRF protection as JWTs are used for stateless authentication.
*   **Authentication Manager**: Exposes the `AuthenticationManager` as a bean, obtained from `AuthenticationConfiguration.getAuthenticationManager()`, which is used by `AuthController` for user authentication.
*   **Authorization Rules**: Configures endpoint access using `HttpSecurity`:
    *   `/api/v1/auth/**` endpoints (registration, login) are publicly accessible (`permitAll()`).
    *   `/api/v1/admin/**` endpoints require the user to have the `ADMIN` role (`hasRole("ADMIN")`).
    *   `/api/**` (all other API endpoints) require the user to be authenticated (`authenticated()`).
    *   `anyRequest().permitAll()` is the final rule to allow access to static frontend resources and SPA routes.
*   **JWT Filter Integration**: The `JwtAuthFilter` is added to the Spring Security filter chain before `UsernamePasswordAuthenticationFilter` to ensure JWT validation occurs first.

## JWT Utility (`JwtUtil.java`)
*   Provides methods for generating, parsing, and validating JWTs. It uses `io.jsonwebtoken` (jjwt) library.
*   `getSigningKey()` uses `Decoders.BASE64.decode(jwt.secret)` to decode the secret key from application properties.
*   `generateToken(String email, Role role)` creates a JWT with the user's email as the subject and role as a claim.
*   `validateToken(String token, UserDetails userDetails)` verifies the token's signature and expiration.

## Circular Dependency Resolution
To prevent a circular bean dependency between `SecurityConfig`, `JwtAuthFilter`, and `UserService`:
*   `JwtAuthFilter`'s `UserDetailsService` (or `UserService`) parameter is annotated with `@Lazy`.
*   The `AuthenticationManager` is exposed as a separate `@Bean` method in `SecurityConfig` by calling `AuthenticationConfiguration.getAuthenticationManager()`.

## Role Authority Consistency
*   `SecurityConfig` uses `hasRole("ADMIN")` for authorization.
*   `UserService` will return `SimpleGrantedAuthority("ROLE_" + role.name())` when constructing `UserDetails` objects, ensuring consistency with Spring Security's role prefixing.

## Local Storage Key for JWT
The JWT token will be stored in the browser's `localStorage` using the key `'token'` by the `authentication-ui` feature.

## Error Handling
Authentication failures (e.g., invalid credentials) will result in `401 Unauthorized` responses. Other exceptions will be handled by the `shared-backend-core` feature's `GlobalExceptionHandler`.

---

## Menu Management (Backend)

**Name:** `menu-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/MenuItem.java` — JPA Entity model — represents a single item on the restaurant's menu, including its details and association with a category.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/MenuItemCategory.java` — JPA Entity model — represents a category for menu items (e.g., Appetizers, Main Course, Desserts).
- `backend/src/main/java/com/yetithehimalayankitchenbaner/repository/MenuItemRepository.java` — Spring Data JPA repository — provides data access operations for MenuItem entities, including custom queries like findByCategoryId(UUID).
- `backend/src/main/java/com/yetithehimalayankitchenbaner/repository/MenuItemCategoryRepository.java` — Spring Data JPA repository — provides data access operations for MenuItemCategory entities, including custom queries like findByName(String).
- `backend/src/main/java/com/yetithehimalayankitchenbaner/service/MenuService.java` — SERVICE layer — implements business logic for menu items and categories, including CRUD operations; uses MenuItemDto for item operations and MenuItemCategory entities for category operations.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/MenuController.java` — REST controller — exposes public-facing endpoints for fetching menu items and categories.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/AdminMenuController.java` — REST controller — exposes admin-only endpoints for managing (CRUD) menu items and categories, secured with hasRole('ADMIN').
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/MenuItemDto.java` — Data Transfer Object — used for menu item API requests and responses, encapsulating item details.

**Feature Instruction:**

This feature provides a comprehensive backend solution for managing the restaurant's menu, encompassing both menu items and their categories. It exposes public APIs for customers to browse the menu and authenticated admin-only APIs for full CRUD (Create, Read, Update, Delete) operations. The implementation adheres to Spring Boot 3 and Jackson 3 conventions.

## Core Components:

1.  **Models (`MenuItem.java`, `MenuItemCategory.java`):** These JPA entities define the structure and persistence mapping for menu items and categories. `MenuItem` includes fields such as `name`, `description`, `price`, `imageUrl`, `available`, and establishes a many-to-one relationship with `MenuItemCategory`. `MenuItemCategory` primarily contains a `name`. Both models incorporate `id` (UUID), `createdAt`, and `updatedAt` fields for auditing purposes.

2.  **Repositories (`MenuItemRepository.java`, `MenuItemCategoryRepository.java`):** These are Spring Data JPA interfaces that extend `JpaRepository` to facilitate database interactions. They define standard CRUD methods and custom finder methods, such as `findByCategoryId(UUID categoryId)` in `MenuItemRepository` for retrieving items by category, and `findByName(String name)` in `MenuItemCategoryRepository` for finding a category by its name.

3.  **DTO (`MenuItemDto.java`):** This Data Transfer Object serves as the contract for both request and response bodies related to menu item operations. It includes fields like `id`, `name`, `description`, `price`, `categoryId`, `categoryName`, `imageUrl`, and `available`, all annotated with appropriate Bean Validation constraints to ensure data integrity.

4.  **Service (`MenuService.java`):** This layer encapsulates the business logic for menu management. It orchestrates interactions with `MenuItemRepository` and `MenuItemCategoryRepository` to perform all CRUD operations. All public methods within the service accept and return `MenuItemDto` for menu item operations. For menu category operations, the service directly accepts and returns `MenuItemCategory` entities. The service handles error conditions by throwing `ResourceNotFoundException` (from `shared-backend-core`) if an entity cannot be found during an operation.

    *   **Menu Item Operations:**
        1.  `List<MenuItemDto> getAllMenuItems()`: Retrieves all available menu items. Maps `MenuItem` entities to `MenuItemDto`.
        2.  `MenuItemDto getMenuItemById(UUID id)`: Fetches a single menu item by its unique ID. Throws `ResourceNotFoundException` if the item is not found. Maps `MenuItem` to `MenuItemDto`.
        3.  `List<MenuItemDto> getMenuItemsByCategory(UUID categoryId)`: Retrieves all menu items associated with a specific category ID. Throws `ResourceNotFoundException` if the category is not found. Maps `MenuItem` entities to `MenuItemDto`.
        4.  `MenuItemDto createMenuItem(MenuItemDto menuItemDto)`: Creates a new menu item. Steps:
            a.  Validate `menuItemDto`.
            b.  Find the `MenuItemCategory` by `menuItemDto.getCategoryId()`. Throws `ResourceNotFoundException` if the category is not found.
            c.  Map `menuItemDto` to a new `MenuItem` entity, setting its category.
            d.  Save the `MenuItem` entity using `MenuItemRepository`.
            e.  Map the saved `MenuItem` back to a `MenuItemDto` and return.
        5.  `MenuItemDto updateMenuItem(UUID id, MenuItemDto menuItemDto)`: Updates an existing menu item. Steps:
            a.  Find the existing `MenuItem` by `id`. Throws `ResourceNotFoundException` if not found.
            b.  Find the `MenuItemCategory` by `menuItemDto.getCategoryId()`. Throws `ResourceNotFoundException` if the category is not found.
            c.  Update the fields of the found `MenuItem` entity from `menuItemDto`, including its category.
            d.  Save the updated `MenuItem` entity using `MenuItemRepository`.
            e.  Map the updated `MenuItem` back to a `MenuItemDto` and return.
        6.  `void deleteMenuItem(UUID id)`: Deletes a menu item by its ID. Throws `ResourceNotFoundException` if the item is not found.

    *   **Menu Category Operations:**
        1.  `List<MenuItemCategory> getAllMenuItemCategories()`: Retrieves all menu item categories.
        2.  `MenuItemCategory getMenuItemCategoryById(UUID id)`: Fetches a single menu item category by its unique ID. Throws `ResourceNotFoundException` if the category is not found.
        3.  `MenuItemCategory createMenuItemCategory(MenuItemCategory category)`: Creates a new menu item category. Steps:
            a.  Save the `MenuItemCategory` entity using `MenuItemCategoryRepository`.
            b.  Return the saved `MenuItemCategory`.
        4.  `MenuItemCategory updateMenuItemCategory(UUID id, MenuItemCategory category)`: Updates an existing menu item category. Steps:
            a.  Find the existing `MenuItemCategory` by `id`. Throws `ResourceNotFoundException` if not found.
            b.  Update the `name` field of the found `MenuItemCategory` entity from the provided `category` object.
            c.  Save the updated `MenuItemCategory` entity using `MenuItemCategoryRepository`.
            d.  Return the updated `MenuItemCategory`.
        5.  `void deleteMenuItemCategory(UUID id)`: Deletes a menu item category by its ID. Throws `ResourceNotFoundException` if the category is not found.

5.  **Controllers (`MenuController.java`, `AdminMenuController.java`):** These classes expose the RESTful API endpoints.

    *   **`MenuController.java`:** Provides public, unauthenticated REST endpoints for fetching menu information. It injects `MenuService` and maps service responses to appropriate HTTP responses.

    *   **`AdminMenuController.java`:** Provides admin-only REST endpoints for full CRUD operations on menu items and categories. All endpoints within this controller are secured with `@PreAuthorize("hasRole('ADMIN')")`. It injects `MenuService` and handles the mapping between incoming request bodies (e.g., `MenuItemDto` for items, or a simple JSON object `{"name": "Category Name"}` for categories) and service method calls.

## Inter-file Wiring:
*   `MenuController` and `AdminMenuController` both inject `MenuService`.
*   `MenuService` injects `MenuItemRepository` and `MenuItemCategoryRepository`.
*   The `MenuItem` model has a `@ManyToOne` relationship with the `MenuItemCategory` model.

## Error Handling:
*   `MenuService` methods throw `ResourceNotFoundException` when an entity is not found. These exceptions are caught by the `GlobalExceptionHandler` (from `shared-backend-core`) which translates them into HTTP 404 Not Found responses.

---

## Reservation System (Backend)

**Name:** `reservation-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/Reservation.java` — MODEL layer — represents a customer's table reservation entity in the database.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/ReservationStatus.java` — MODEL layer — enum defining the possible statuses for a reservation.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/repository/ReservationRepository.java` — REPOSITORY layer — provides data access operations for Reservation entities.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/service/ReservationService.java` — SERVICE layer — implements business logic for creating, retrieving, updating, and deleting reservations; calls ReservationRepository.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/ReservationController.java` — CONTROLLER layer — exposes public REST endpoints for creating and retrieving reservations.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/AdminReservationController.java` — CONTROLLER layer — exposes admin-only REST endpoints for managing all reservations.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/CreateReservationRequest.java` — DTO layer — data transfer object for creating new reservation requests.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/ReservationResponse.java` — DTO layer — data transfer object for returning reservation details.

**Feature Instruction:**

This feature implements the backend logic for managing table reservations at Yeti - The Himalayan Kitchen. It includes data models for reservations and their statuses, a repository for persistence, a service layer for business logic, and two REST controllers: one for public reservation creation and retrieval, and another for administrative management of all reservations.

## Data Models
- `ReservationStatus.java`: An enum defining the possible states of a reservation: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`.
- `Reservation.java`: The JPA entity representing a reservation. It includes fields for `id` (UUID), `customerName` (String), `customerEmail` (String), `customerPhone` (String), `reservationDate` (LocalDate), `reservationTime` (LocalTime), `numberOfGuests` (int), `status` (ReservationStatus), `specialRequests` (String, nullable), `createdAt` (LocalDateTime), and `updatedAt` (LocalDateTime). The `status` field defaults to `PENDING` upon creation.

## Data Transfer Objects (DTOs)
- `CreateReservationRequest.java`: Used for incoming requests to create a new reservation. It contains `customerName`, `customerEmail`, `customerPhone`, `reservationDate`, `reservationTime`, `numberOfGuests`, and `specialRequests`. All fields except `specialRequests` are mandatory and include appropriate validation annotations (`@NotBlank`, `@Email`, `@NotNull`, `@Min`).
- `ReservationResponse.java`: Used for outgoing responses, providing full details of a reservation. It includes all fields from the `Reservation` entity.

## Persistence Layer
- `ReservationRepository.java`: Extends `JpaRepository<Reservation, UUID>`, providing standard CRUD operations. It also declares a custom finder method `findByReservationDateBetween(LocalDate startDate, LocalDate endDate): List<Reservation>` to allow fetching reservations within a date range.

## Service Layer
- `ReservationService.java`: This service orchestrates the business logic for reservations. It injects `ReservationRepository`.
  - `createReservation(CreateReservationRequest request): ReservationResponse`:
    1. Validates the `CreateReservationRequest`. If the requested date/time is in the past, throw `IllegalArgumentException`.
    2. Creates a new `Reservation` entity, mapping fields from the request.
    3. Sets the initial `status` to `ReservationStatus.PENDING`.
    4. Sets `createdAt` and `updatedAt` to the current `LocalDateTime`.
    5. Saves the new reservation using `reservationRepository.save()`.
    6. Returns a `ReservationResponse` mapped from the saved entity.
  - `getReservationById(UUID id): ReservationResponse`:
    1. Retrieves a `Reservation` by its `id` using `reservationRepository.findById(id)`.
    2. If not found, throws `ResourceNotFoundException` (from `shared-backend-core`).
    3. Returns a `ReservationResponse` mapped from the found entity.
  - `getAllReservations(): List<ReservationResponse>`:
    1. Retrieves all `Reservation` entities using `reservationRepository.findAll()`.
    2. Maps each entity to a `ReservationResponse` and returns the list.
  - `getReservationsByDateRange(LocalDate startDate, LocalDate endDate): List<ReservationResponse>`:
    1. Retrieves `Reservation` entities within the specified date range using `reservationRepository.findByReservationDateBetween(startDate, endDate)`.
    2. Maps each entity to a `ReservationResponse` and returns the list.
  - `updateReservationStatus(UUID id, ReservationStatus newStatus): ReservationResponse`:
    1. Retrieves the `Reservation` by `id` using `reservationRepository.findById(id)`.
    2. If not found, throws `ResourceNotFoundException`.
    3. Updates the `status` field of the retrieved reservation to `newStatus`.
    4. Updates the `updatedAt` field to the current `LocalDateTime`.
    5. Saves the updated reservation using `reservationRepository.save()`.
    6. Returns a `ReservationResponse` mapped from the updated entity.
  - `deleteReservation(UUID id): void`:
    1. Checks if a reservation with the given `id` exists using `reservationRepository.existsById(id)`.
    2. If not found, throws `ResourceNotFoundException`.
    3. Deletes the reservation using `reservationRepository.deleteById(id)`.

## Controller Layer
- `ReservationController.java`: Handles public-facing API endpoints for reservations. It injects `ReservationService`.
  - `POST /api/v1/reservations`: Creates a new reservation. Consumes `CreateReservationRequest` and returns `ReservationResponse` (HTTP 201 Created). Handles `IllegalArgumentException` with HTTP 400 Bad Request.
  - `GET /api/v1/reservations/{id}`: Retrieves a reservation by ID. Returns `ReservationResponse` (HTTP 200 OK). Handles `ResourceNotFoundException` with HTTP 404 Not Found.
- `AdminReservationController.java`: Handles admin-only API endpoints for reservations. It injects `ReservationService`. All endpoints in this controller require the `ADMIN` role.
  - `GET /api/v1/admin/reservations`: Retrieves all reservations. Optionally accepts `startDate` and `endDate` query parameters (format YYYY-MM-DD) to filter reservations by date range. Returns `List<ReservationResponse>` (HTTP 200 OK).
  - `GET /api/v1/admin/reservations/{id}`: Retrieves a specific reservation by ID. Returns `ReservationResponse` (HTTP 200 OK). Handles `ResourceNotFoundException` with HTTP 404 Not Found.
  - `PUT /api/v1/admin/reservations/{id}/status`: Updates the status of a reservation. Consumes a `ReservationStatus` enum value in the request body and returns `ReservationResponse` (HTTP 200 OK). Handles `ResourceNotFoundException` with HTTP 404 Not Found and `IllegalArgumentException` (e.g., invalid status) with HTTP 400 Bad Request.
  - `DELETE /api/v1/admin/reservations/{id}`: Deletes a reservation by ID. Returns HTTP 204 No Content on success. Handles `ResourceNotFoundException` with HTTP 404 Not Found.

## Security Configuration
- The public endpoints `/api/v1/reservations` (POST) and `/api/v1/reservations/{id}` (GET) must be `permitAll()` in `SecurityConfig`.
- All admin endpoints under `/api/v1/admin/reservations/**` must be secured with `hasRole("ADMIN")`.

---

## Order Management (Backend Core)

**Name:** `order-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/Order.java` — MODEL layer — Represents a customer's food order, linking to user, order items, and payment details.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/OrderItem.java` — MODEL layer — Represents a single line item within an Order, capturing menu item details at the time of order.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/OrderStatus.java` — MODEL layer — Enum defining the possible statuses for a customer order.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/repository/OrderRepository.java` — REPOSITORY layer — Provides data access operations for Order entities.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/repository/OrderItemRepository.java` — REPOSITORY layer — Provides data access operations for OrderItem entities.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/service/OrderService.java` — SERVICE layer — Implements business logic for order creation, retrieval, and status management; delegates persistence to OrderRepository and OrderItemRepository, user validation to UserService, menu item retrieval to MenuService, and payment initiation to PaymentService.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/OrderController.java` — CONTROLLER layer — Exposes authenticated REST endpoints for customers to manage their orders.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/AdminOrderController.java` — CONTROLLER layer — Exposes admin-only REST endpoints for comprehensive order management.

**Feature Instruction:**

The Order Management (Backend Core) feature provides the foundational backend logic for customers to place food orders and for administrators to manage these orders. It encompasses data models, persistence layers, business logic, and REST API endpoints.

## DTO Contracts (from order-backend-api feature)
This feature consumes the following DTOs defined in the `order-backend-api` feature:

### CreateOrderRequest
Used for submitting a new order. It includes customer details and a list of items.
- `userId`: `UUID` (Required) - The ID of the user placing the order. This will be extracted from the authenticated user's context in the controller.
- `deliveryAddress`: `String` (Required, NotBlank) - The full delivery address for the order.
- `contactPhone`: `String` (Required, NotBlank) - The contact phone number for delivery.
- `notes`: `String` (Optional) - Any special instructions or notes for the order.
- `orderItems`: `List<OrderItemRequest>` (Required, NotEmpty, Valid) - A list of items included in the order.

### OrderItemRequest
Represents a single item within a `CreateOrderRequest`.
- `menuItemId`: `UUID` (Required) - The ID of the menu item being ordered.
- `quantity`: `int` (Required, Min=1) - The quantity of the menu item.

### OrderResponse
Used for returning detailed information about an order.
- `orderId`: `UUID` - The unique identifier of the order.
- `userId`: `UUID` - The ID of the user who placed the order.
- `orderDate`: `java.time.LocalDateTime` - The timestamp when the order was placed.
- `totalAmount`: `java.math.BigDecimal` - The total cost of the order.
- `status`: `OrderStatus` - The current status of the order (e.g., PENDING, DELIVERED).
- `deliveryAddress`: `String` - The delivery address.
- `contactPhone`: `String` - The contact phone number.
- `notes`: `String` - Any notes associated with the order.
- `orderItems`: `List<OrderItemResponse>` - A list of items in the order.

### OrderItemResponse
Represents a single item within an `OrderResponse`.
- `orderItemId`: `UUID` - The unique identifier of the order item.
- `menuItemId`: `UUID` - The ID of the menu item.
- `menuItemName`: `String` - The name of the menu item at the time of order.
- `quantity`: `int` - The quantity ordered.
- `priceAtOrder`: `java.math.BigDecimal` - The price of the item at the time of order.

## File Implementations

### `Order.java` (Model)
This JPA entity represents a customer's food order. It will have a one-to-many relationship with `OrderItem`.
- Fields:
    - `id`: `UUID` (Primary Key, Generated)
    - `userId`: `UUID` (Foreign Key to User from shared-backend-auth)
    - `orderDate`: `java.time.LocalDateTime` (Defaults to current timestamp)
    - `totalAmount`: `java.math.BigDecimal`
    - `status`: `OrderStatus` (Enum)
    - `deliveryAddress`: `String`
    - `contactPhone`: `String`
    - `notes`: `String` (Nullable)
    - `orderItems`: `List<OrderItem>` (OneToMany, mappedBy="order", CascadeType.ALL, OrphanRemoval=true)

### `OrderItem.java` (Model)
This JPA entity represents a single line item within an `Order`. It will have a many-to-one relationship with `Order`.
- Fields:
    - `id`: `UUID` (Primary Key, Generated)
    - `order`: `Order` (ManyToOne, Foreign Key to Order)
    - `menuItemId`: `UUID` (Foreign Key to MenuItem from menu-backend)
    - `menuItemName`: `String` (Denormalized, stores the name at the time of order)
    - `quantity`: `int`
    - `priceAtOrder`: `java.math.BigDecimal` (Stores the price at the time of order)

### `OrderStatus.java` (Enum)
This enum defines the possible states of a customer order.
- Values: `PENDING`, `CONFIRMED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`.

### `OrderRepository.java` (Repository)
Extends `JpaRepository` for `Order` entities. It will provide standard CRUD operations and custom query methods.
- Custom Methods:
    - `findByUserId(UUID userId): List<Order>`
    - `findByStatus(OrderStatus status): List<Order>`

### `OrderItemRepository.java` (Repository)
Extends `JpaRepository` for `OrderItem` entities. It will provide standard CRUD operations.

### `OrderService.java` (Service)
This service handles the core business logic for order creation, retrieval, and status updates. It interacts with `OrderRepository`, `OrderItemRepository`, `UserService` (from `shared-backend-auth`), `MenuService` (from `menu-backend`), and `PaymentService` (from `payment-backend`).

- Dependencies:
    - `OrderRepository orderRepository`
    - `OrderItemRepository orderItemRepository`
    - `UserService userService` (from `shared-backend-auth`)
    - `MenuService menuService` (from `menu-backend`)
    - `PaymentService paymentService` (from `payment-backend`)

- Public Methods:
    - `createOrder(CreateOrderRequest request, UUID userId): OrderResponse`
        1.  Validate that the `userId` exists using `userService.loadUserByUsername(userId.toString())`. If the user is not found, throw `ResourceNotFoundException`.
        2.  Initialize `totalAmount = BigDecimal.ZERO`.
        3.  Create a new `Order` entity. Set `userId`, `orderDate` to `LocalDateTime.now()`, `status` to `OrderStatus.PENDING`, and populate `deliveryAddress`, `contactPhone`, `notes` from the `request`.
        4.  Create a `List<OrderItem>` to store the order items.
        5.  For each `OrderItemRequest` in `request.getOrderItems()`:
            a.  Call `menuService.getMenuItemById(itemRequest.getMenuItemId())` to retrieve `MenuItemDto` from the `menu-backend` feature.
            b.  If `MenuItemDto` is not found, throw `ResourceNotFoundException` with a message indicating the missing menu item.
            c.  If `itemRequest.getQuantity()` is less than 1, throw `IllegalArgumentException`.
            d.  Calculate the item's subtotal: `itemRequest.getQuantity().multiply(menuItemDto.getPrice())`.
            e.  Add the item's subtotal to `totalAmount`.
            f.  Create an `OrderItem` entity. Set its `order` to the newly created `Order` entity, `menuItemId` from `itemRequest`, `menuItemName` from `MenuItemDto.getName()`, `quantity` from `itemRequest`, and `priceAtOrder` from `MenuItemDto.getPrice()`.
            g.  Add the `OrderItem` to the list.
        6.  Set `order.setTotalAmount(totalAmount)`.
        7.  Set `order.setOrderItems(orderItems)`.
        8.  Save the `Order` entity using `orderRepository.save(order)`.
        9.  Call `paymentService.createPaymentOrder(order.getId(), totalAmount, userId)` (from `payment-backend`) to initiate the payment process. This call should return a `PaymentOrderResponse` which can be used by the frontend.
        10. Map the saved `Order` and its `OrderItem`s to an `OrderResponse` DTO, including mapping `OrderItem`s to `OrderItemResponse`.
        11. Return the `OrderResponse`.
        - Error cases: `ResourceNotFoundException` (HTTP 404) if user or menu item not found. `IllegalArgumentException` (HTTP 400) for invalid quantity.

    - `getOrderById(UUID orderId): OrderResponse`
        1.  Retrieve the `Order` entity by `orderId` using `orderRepository.findById(orderId)`.
        2.  If the `Order` is not found, throw `ResourceNotFoundException`.
        3.  Map the `Order` and its associated `OrderItem`s to an `OrderResponse` DTO.
        4.  Return the `OrderResponse`.
        - Error cases: `ResourceNotFoundException` (HTTP 404) if order not found.

    - `getOrdersByUserId(UUID userId): List<OrderResponse>`
        1.  Retrieve a list of `Order` entities by `userId` using `orderRepository.findByUserId(userId)`.
        2.  Map each `Order` and its `OrderItem`s to an `OrderResponse` DTO.
        3.  Return the `List<OrderResponse>`.

    - `getAllOrders(): List<OrderResponse>`
        1.  Retrieve all `Order` entities using `orderRepository.findAll()`.
        2.  Map each `Order` and its `OrderItem`s to an `OrderResponse` DTO.
        3.  Return the `List<OrderResponse>`.

    - `updateOrderStatus(UUID orderId, OrderStatus newStatus): OrderResponse`
        1.  Retrieve the `Order` entity by `orderId` using `orderRepository.findById(orderId)`.
        2.  If the `Order` is not found, throw `ResourceNotFoundException`.
        3.  Update the `status` of the `Order` entity to `newStatus`.
        4.  Save the updated `Order` entity using `orderRepository.save(order)`.
        5.  Map the updated `Order` to an `OrderResponse` DTO.
        6.  Return the `OrderResponse`.
        - Error cases: `ResourceNotFoundException` (HTTP 404) if order not found.

    - `cancelOrder(UUID orderId): OrderResponse`
        1.  Retrieve the `Order` entity by `orderId` using `orderRepository.findById(orderId)`.
        2.  If the `Order` is not found, throw `ResourceNotFoundException`.
        3.  If the current `order.getStatus()` is `DELIVERED` or `CANCELLED`, throw `IllegalStateException` with a message like "Order cannot be cancelled in its current status."
        4.  Set the `status` of the `Order` entity to `OrderStatus.CANCELLED`.
        5.  Save the updated `Order` entity using `orderRepository.save(order)`.
        6.  Map the updated `Order` to an `OrderResponse` DTO.
        7.  Return the `OrderResponse`.
        - Error cases: `ResourceNotFoundException` (HTTP 404) if order not found. `IllegalStateException` (HTTP 400) if order cannot be cancelled.

### `OrderController.java` (Controller)
This REST controller exposes authenticated endpoints for customers to place new orders and view their order history. All endpoints require authentication and the `CUSTOMER` role.

- Dependencies:
    - `OrderService orderService`

- API Endpoints:
    - `POST /api/v1/orders`
        - Description: Allows an authenticated customer to place a new order.
        - Request Body: `CreateOrderRequest` (JSON)
        - Response Body: `OrderResponse` (JSON, 201 Created)
        - Logic:
            1.  Extract `userId` from `AuthenticationPrincipal UserDetails`.
            2.  Call `orderService.createOrder(request, userId)`.
            3.  Return `ResponseEntity.status(HttpStatus.CREATED).body(orderResponse)`.
        - Error cases: `400 Bad Request` for validation errors (`MethodArgumentNotValidException`), `404 Not Found` for non-existent menu items or user (`ResourceNotFoundException`).

    - `GET /api/v1/orders`
        - Description: Retrieves all orders placed by the currently authenticated customer.
        - Response Body: `List<OrderResponse>` (JSON, 200 OK)
        - Logic:
            1.  Extract `userId` from `AuthenticationPrincipal UserDetails`.
            2.  Call `orderService.getOrdersByUserId(userId)`.
            3.  Return `ResponseEntity.ok(orderResponses)`.

    - `GET /api/v1/orders/{orderId}`
        - Description: Retrieves a specific order by ID for the currently authenticated customer. Ensures the order belongs to the customer.
        - Path Variable: `orderId` (UUID)
        - Response Body: `OrderResponse` (JSON, 200 OK)
        - Logic:
            1.  Extract `userId` from `AuthenticationPrincipal UserDetails`.
            2.  Call `orderService.getOrderById(orderId)`.
            3.  If `orderResponse.getUserId()` does not equal `userId`, throw `AccessDeniedException` (or `ResourceNotFoundException` to prevent enumeration).
            4.  Return `ResponseEntity.ok(orderResponse)`.
        - Error cases: `404 Not Found` if order does not exist or does not belong to the user (`ResourceNotFoundException`). `403 Forbidden` if `AccessDeniedException` is thrown.

    - `PUT /api/v1/orders/{orderId}/cancel`
        - Description: Allows an authenticated customer to cancel one of their own orders.
        - Path Variable: `orderId` (UUID)
        - Response Body: `OrderResponse` (JSON, 200 OK)
        - Logic:
            1.  Extract `userId` from `AuthenticationPrincipal UserDetails`.
            2.  Call `orderService.getOrderById(orderId)`.
            3.  If `orderResponse.getUserId()` does not equal `userId`, throw `AccessDeniedException`.
            4.  Call `orderService.cancelOrder(orderId)`.
            5.  Return `ResponseEntity.ok(updatedOrderResponse)`.
        - Error cases: `404 Not Found` if order does not exist or does not belong to the user. `400 Bad Request` if the order cannot be cancelled in its current state (`IllegalStateException`).

### `AdminOrderController.java` (Controller)
This REST controller exposes admin-only endpoints for viewing and managing all customer orders. All endpoints require authentication and the `ADMIN` role.

- Dependencies:
    - `OrderService orderService`

- API Endpoints:
    - `GET /api/v1/admin/orders`
        - Description: Retrieves all customer orders.
        - Response Body: `List<OrderResponse>` (JSON, 200 OK)
        - Logic:
            1.  Call `orderService.getAllOrders()`.
            2.  Return `ResponseEntity.ok(orderResponses)`.

    - `GET /api/v1/admin/orders/{orderId}`
        - Description: Retrieves a specific order by ID.
        - Path Variable: `orderId` (UUID)
        - Response Body: `OrderResponse` (JSON, 200 OK)
        - Logic:
            1.  Call `orderService.getOrderById(orderId)`.
            2.  Return `ResponseEntity.ok(orderResponse)`.
        - Error cases: `404 Not Found` if order does not exist (`ResourceNotFoundException`).

    - `PUT /api/v1/admin/orders/{orderId}/status`
        - Description: Updates the status of a specific order.
        - Path Variable: `orderId` (UUID)
        - Request Body: `Map<String, String>` containing a `status` field (e.g., `{"status": "CONFIRMED"}`)
        - Response Body: `OrderResponse` (JSON, 200 OK)
        - Logic:
            1.  Extract `newStatusString` from the request body map.
            2.  Parse `newStatusString` into an `OrderStatus` enum. Handle `IllegalArgumentException` if the status string is invalid.
            3.  Call `orderService.updateOrderStatus(orderId, newStatus)`.
            4.  Return `ResponseEntity.ok(updatedOrderResponse)`.
        - Error cases: `404 Not Found` if order does not exist. `400 Bad Request` for invalid status string (`IllegalArgumentException`).

## Security Configuration (shared-backend-auth)

- The `SecurityConfig` in `shared-backend-auth` must be updated to include authorization rules for these endpoints:
    - `/api/v1/orders/**`: Requires `authenticated()` and `hasRole('CUSTOMER')`.
    - `/api/v1/admin/orders/**`: Requires `hasRole('ADMIN')`.

Example `SecurityConfig` snippet:
```

java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/auth/**").permitAll()
    .requestMatchers("/api/v1/orders/**").hasRole("CUSTOMER")
    .requestMatchers("/api/v1/admin/orders/**").hasRole("ADMIN")
    .requestMatchers("/api/**").authenticated()
    .anyRequest().permitAll()
)


```

---

## Order Management (Backend API)

**Name:** `order-backend-api`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/CreateOrderRequest.java` — DTO layer — defines the structure for incoming requests to create a new order, including a list of `OrderItemRequest` objects and delivery information.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/OrderItemRequest.java` — DTO layer — defines the structure for a single item within a `CreateOrderRequest`, specifying the menu item ID and quantity.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/OrderResponse.java` — DTO layer — defines the structure for outgoing responses, providing comprehensive details of an order, including its status, total amount, and a list of `OrderItemResponse` objects.

**Feature Instruction:**

The `order-backend-api` feature defines the Data Transfer Objects (DTOs) used for creating and retrieving customer orders. These DTOs serve as the contract between the frontend and the backend for order-related operations.

`CreateOrderRequest.java` and `OrderItemRequest.java` are used together to encapsulate the data required when a customer places a new order. `CreateOrderRequest` contains the overall order details such as delivery address, contact phone, and an optional note, along with a list of `OrderItemRequest` objects. Each `OrderItemRequest` specifies the `menuItemId` and `quantity` for a particular menu item being ordered. These DTOs ensure that incoming order creation requests are well-structured and validated using standard Jakarta Bean Validation annotations like `@NotBlank`, `@NotNull`, and `@Min`.

`OrderResponse.java` is used to send detailed order information back to the client. It provides a comprehensive view of an order, including its unique `id`, the `userId` who placed it, `orderDate`, `totalAmount`, current `status` (e.g., PENDING, DELIVERED), delivery details, and a list of `OrderItemResponse` objects. The `OrderItemResponse` (which would typically be an inner class or a separate DTO derived from the `OrderItem` entity) includes details like `id`, `menuItemId`, `menuItemName`, `quantity`, and `priceAtOrder`.

These DTOs are consumed by the `OrderService` and `OrderController` within the `order-backend` feature. For instance, `OrderController.createOrder(CreateOrderRequest request, UserDetails userDetails)` receives a `CreateOrderRequest` in its request body, and `OrderController.getOrderById(UUID orderId, UserDetails userDetails)` returns an `OrderResponse`.

---

## Payment Processing (Backend)

**Name:** `payment-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/yetithehimalayankitchenbaner/service/PaymentService.java` — SERVICE layer — implements `createPaymentOrder(UUID orderId, BigDecimal amount): PaymentOrderResponse` to create Razorpay orders and `verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature): boolean` to validate payment webhooks; delegates order status updates to `OrderService`.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/PaymentController.java` — CONTROLLER layer — exposes REST endpoints for initiating payments via `initiatePayment(UUID orderId, BigDecimal amount): ResponseEntity<PaymentOrderResponse>` and handling Razorpay webhooks via `verifyPayment(PaymentVerificationRequest request): ResponseEntity<String>`.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/PaymentOrderResponse.java` — DTO layer — defines the structure for outgoing responses containing Razorpay order details.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/PaymentVerificationRequest.java` — DTO layer — defines the structure for incoming requests from Razorpay webhooks for payment verification.

**Feature Instruction:**

This feature handles payment processing using Razorpay. It provides functionality to create payment orders and verify payment signatures, integrating with the existing order-backend feature to update order statuses.

## Payment Flow:
1.  **Initiate Payment Request**: The frontend sends a POST request to `/api/v1/payments/initiate` with the `orderId` and `amount` for which payment needs to be initiated.
2.  **Controller to Service**: `PaymentController.initiatePayment` receives the request and calls `PaymentService.createPaymentOrder(UUID orderId, BigDecimal amount)`.
3.  **Razorpay Order Creation**: `PaymentService.createPaymentOrder` performs the following steps:
    a.  It calls `orderService.getOrderById(orderId)` to retrieve the order details from the `order-backend` feature. This is to ensure the amount passed from the frontend matches the actual order total.
    b.  It constructs a JSON payload for the Razorpay API to create an order, including the `amount` (converted to paise), `currency` (e.g., "INR"), `receipt` (our internal `orderId`), and `payment_capture` (set to 1 for automatic capture).
    c.  It makes an authenticated API call to the Razorpay Orders API (`https://api.razorpay.com/v1/orders`) using the configured Razorpay Key ID and Secret.
    d.  Upon successful creation, it extracts the Razorpay order ID and other relevant details.
    e.  It constructs and returns a `PaymentOrderResponse` containing the Razorpay order ID, amount, currency, our internal order ID (as receipt), and the Razorpay public key ID.
4.  **Response to Frontend**: `PaymentController.initiatePayment` returns the `PaymentOrderResponse` to the frontend, which then uses these details to open the Razorpay checkout modal.

## Payment Verification (Webhook) Flow:
1.  **Razorpay Webhook**: After a successful payment, Razorpay sends a webhook notification (POST request) to `/api/v1/payments/verify`.
2.  **Controller to Service**: `PaymentController.verifyPayment` receives the `PaymentVerificationRequest` containing `razorpayOrderId`, `razorpayPaymentId`, and `razorpaySignature`. It calls `PaymentService.verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature)`.
3.  **Signature Verification**: `PaymentService.verifyPaymentSignature` performs the following steps:
    a.  It constructs the data string to be signed: `razorpayOrderId + "|" + razorpayPaymentId`.
    b.  It uses Razorpay's utility methods (e.g., `Utils.verifyPaymentSignature`) to verify the `razorpaySignature` against the constructed data string and the configured Razorpay Secret.
    c.  If the signature is valid:
        i.  It extracts the internal `orderId` from the `razorpayOrderId` (assuming Razorpay order ID contains or can be mapped to our internal order ID, or by fetching the order details from Razorpay if needed. For simplicity, assume `razorpayOrderId` can be used to derive the internal `orderId` or is directly passed in the `receipt` field during order creation).
        ii. It calls `orderService.updateOrderStatus(orderId, OrderStatus.CONFIRMED)` from the `order-backend` feature to mark the order as confirmed.
        iii. It returns `true` indicating successful verification and order update.
    d.  If the signature is invalid, it logs the error and returns `false`.
4.  **Response to Razorpay**: `PaymentController.verifyPayment` returns an appropriate HTTP status (e.g., 200 OK for success, 400 Bad Request for failure) to acknowledge the webhook.

## Error Handling:
-   Any exceptions during Razorpay API calls or signature verification should be caught and handled, potentially throwing custom exceptions (e.g., `PaymentGatewayException`) or `IllegalArgumentException`.
-   `PaymentController` should use `@ExceptionHandler` or rely on `GlobalExceptionHandler` from `shared-backend-core` to return appropriate `ErrorResponse` DTOs with HTTP status codes (e.g., 400 Bad Request, 500 Internal Server Error).

## Dependencies:
-   `PaymentService` injects `OrderService` from the `order-backend` feature to fetch and update order details.
-   Razorpay API client (e.g., `com.razorpay.RazorpayClient`) will be used within `PaymentService`.

## Security:
-   The `/api/v1/payments/initiate` endpoint requires authentication (e.g., `@PreAuthorize("isAuthenticated()")`).
-   The `/api/v1/payments/verify` webhook endpoint must be publicly accessible (`permitAll()`) as it is called by Razorpay directly.

---

## Blog Management (Backend)

**Name:** `blog-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/BlogPost.java` — MODEL layer — defines the `BlogPost` entity, representing a single blog post or story in the database.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/repository/BlogPostRepository.java` — REPOSITORY layer — provides data access operations for `BlogPost` entities, extending Spring Data JPA's `JpaRepository`.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/service/BlogService.java` — SERVICE layer — implements business logic for managing blog posts, including `getAllBlogPosts(): List<BlogPostDto>`, `getBlogPostById(UUID): BlogPostDto`, `createBlogPost(BlogPostDto): BlogPostDto`, `updateBlogPost(UUID, BlogPostDto): BlogPostDto`, and `deleteBlogPost(UUID): void`.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/BlogController.java` — CONTROLLER layer — provides public-facing REST endpoints for fetching blog posts: `GET /api/v1/blog` and `GET /api/v1/blog/{id}`.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/AdminBlogController.java` — CONTROLLER layer — provides admin-only REST endpoints for CRUD operations on blog posts: `GET /api/v1/admin/blog`, `GET /api/v1/admin/blog/{id}`, `POST /api/v1/admin/blog`, `PUT /api/v1/admin/blog/{id}`, and `DELETE /api/v1/admin/blog/{id}`.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/BlogPostDto.java` — DTO layer — defines the structure for blog post data transfer, used for both request and response bodies in the API.

**Feature Instruction:**

The Blog Management (Backend) feature provides a complete set of functionalities for managing blog posts, including public access for viewing and admin-only access for full CRUD operations. It consists of a `BlogPost` entity for persistence, a `BlogPostRepository` for data access, a `BlogService` for business logic, and two controllers: `BlogController` for public read-only access and `AdminBlogController` for authenticated administrative operations.

**1. Data Model (`BlogPost.java`):**
   - Represents a blog post with fields: `id` (UUID, primary key), `title` (String, not null), `content` (String, not null), `author` (String, not null), `publicationDate` (LocalDateTime, not null), `imageUrl` (String, nullable), `createdAt` (LocalDateTime), and `updatedAt` (LocalDateTime).
   - `createdAt` and `updatedAt` should be automatically managed (e.g., using `@CreatedDate` and `@LastModifiedDate` with `@EntityListeners(AuditingEntityListener.class)`).

**2. Data Transfer Object (`BlogPostDto.java`):**
   - Used for transferring blog post data between the service layer and controllers.
   - Contains fields: `id` (UUID), `title` (String), `content` (String), `author` (String), `publicationDate` (LocalDateTime), and `imageUrl` (String).
   - Should include validation annotations like `@NotBlank` for `title`, `content`, and `author`.

**3. Repository Layer (`BlogPostRepository.java`):**
   - Extends `JpaRepository<BlogPost, UUID>` to provide standard CRUD operations for `BlogPost` entities.
   - No custom query methods are required for the current scope.

**4. Service Layer (`BlogService.java`):**
   - Injects `BlogPostRepository`.
   - Implements the following public methods:
     - `public List<BlogPostDto> getAllBlogPosts()`:
       1. Fetches all `BlogPost` entities from `BlogPostRepository`.
       2. Converts them to `BlogPostDto` objects.
       3. Returns the list of `BlogPostDto`.
     - `public BlogPostDto getBlogPostById(UUID id)`:
       1. Attempts to find a `BlogPost` by `id` using `BlogPostRepository.findById()`.
       2. If not found, throws `ResourceNotFoundException` (from `shared-backend-core`) with a message like "Blog post not found with ID: " + id.
       3. If found, converts the `BlogPost` entity to `BlogPostDto`.
       4. Returns the `BlogPostDto`.
     - `public BlogPostDto createBlogPost(BlogPostDto blogPostDto)`:
       1. Converts the incoming `blogPostDto` to a `BlogPost` entity.
       2. Sets `createdAt` and `updatedAt` (if not handled by auditing).
       3. Saves the `BlogPost` entity using `BlogPostRepository.save()`.
       4. Converts the saved `BlogPost` back to `BlogPostDto`.
       5. Returns the created `BlogPostDto`.
     - `public BlogPostDto updateBlogPost(UUID id, BlogPostDto blogPostDto)`:
       1. Calls `getBlogPostById(id)` to ensure the blog post exists. This will throw `ResourceNotFoundException` if not found.
       2. Updates the fields (`title`, `content`, `author`, `publicationDate`, `imageUrl`) of the existing `BlogPost` entity with values from `blogPostDto`.
       3. Sets `updatedAt` (if not handled by auditing).
       4. Saves the updated `BlogPost` entity using `BlogPostRepository.save()`.
       5. Converts the saved `BlogPost` back to `BlogPostDto`.
       6. Returns the updated `BlogPostDto`.
     - `public void deleteBlogPost(UUID id)`:
       1. Calls `getBlogPostById(id)` to ensure the blog post exists. This will throw `ResourceNotFoundException` if not found.
       2. Deletes the `BlogPost` entity by `id` using `BlogPostRepository.deleteById()`.

**5. Public Controller (`BlogController.java`):**
   - Annotated with `@RestController` and `@RequestMapping("/api/v1/blog")`.
   - Injects `BlogService`.
   - Exposes public read-only endpoints:
     - `GET /api/v1/blog`: `public ResponseEntity<List<BlogPostDto>> getAllBlogPosts()`
       - Calls `blogService.getAllBlogPosts()`.
       - Returns `ResponseEntity.ok()` with the list of `BlogPostDto`.
     - `GET /api/v1/blog/{id}`: `public ResponseEntity<BlogPostDto> getBlogPostById(@PathVariable UUID id)`
       - Calls `blogService.getBlogPostById(id)`.
       - Returns `ResponseEntity.ok()` with the `BlogPostDto`.
       - Handles `ResourceNotFoundException` by returning `ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)` (or an `ErrorResponse` if using `GlobalExceptionHandler`).

**6. Admin Controller (`AdminBlogController.java`):**
   - Annotated with `@RestController` and `@RequestMapping("/api/v1/admin/blog")`.
   - All methods must be secured with `@PreAuthorize("hasRole('ADMIN')")`.
   - Injects `BlogService`.
   - Exposes admin CRUD endpoints:
     - `GET /api/v1/admin/blog`: `public ResponseEntity<List<BlogPostDto>> getAllBlogPosts()`
       - Calls `blogService.getAllBlogPosts()`.
       - Returns `ResponseEntity.ok()` with the list of `BlogPostDto`.
     - `GET /api/v1/admin/blog/{id}`: `public ResponseEntity<BlogPostDto> getBlogPostById(@PathVariable UUID id)`
       - Calls `blogService.getBlogPostById(id)`.
       - Returns `ResponseEntity.ok()` with the `BlogPostDto`.
       - Handles `ResourceNotFoundException` by returning `ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)`.
     - `POST /api/v1/admin/blog`: `public ResponseEntity<BlogPostDto> createBlogPost(@Valid @RequestBody BlogPostDto blogPostDto)`
       - Calls `blogService.createBlogPost(blogPostDto)`.
       - Returns `ResponseEntity.status(HttpStatus.CREATED).body()` with the created `BlogPostDto`.
       - Handles validation errors (e.g., `@Valid` will trigger `MethodArgumentNotValidException` caught by `GlobalExceptionHandler`).
     - `PUT /api/v1/admin/blog/{id}`: `public ResponseEntity<BlogPostDto> updateBlogPost(@PathVariable UUID id, @Valid @RequestBody BlogPostDto blogPostDto)`
       - Calls `blogService.updateBlogPost(id, blogPostDto)`.
       - Returns `ResponseEntity.ok()` with the updated `BlogPostDto`.
       - Handles `ResourceNotFoundException` and validation errors.
     - `DELETE /api/v1/admin/blog/{id}`: `public ResponseEntity<Void> deleteBlogPost(@PathVariable UUID id)`
       - Calls `blogService.deleteBlogPost(id)`.
       - Returns `ResponseEntity.noContent().build()`.
       - Handles `ResourceNotFoundException`.

**Error Handling:**
- `ResourceNotFoundException` (from `shared-backend-core`) should be used when an entity is not found. The `GlobalExceptionHandler` (from `shared-backend-core`) will convert this to a `404 Not Found` HTTP response.
- Other exceptions like `IllegalArgumentException` should also be handled by `GlobalExceptionHandler` to return `400 Bad Request`.

**Security Configuration:**
- The `SecurityConfig` (from `shared-backend-auth`) must be updated to permit all requests to `/api/v1/blog/**` and require `ADMIN` role for `/api/v1/admin/blog/**`.
  - `.requestMatchers("/api/v1/blog/**").permitAll()`
  - `.requestMatchers("/api/v1/admin/blog/**").hasRole("ADMIN")`

---

## Testimonial Management (Backend)

**Name:** `testimonial-backend`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/yetithehimalayankitchenbaner/model/Testimonial.java` — MODEL layer — defines the `Testimonial` entity with fields for author, content, rating, creation timestamp, and approval status.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/repository/TestimonialRepository.java` — REPOSITORY layer — Spring Data JPA repository for `Testimonial` entities, providing standard CRUD operations and custom query methods like `findByApproved(boolean approved)`.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/service/TestimonialService.java` — SERVICE layer — implements `getAllApprovedTestimonials(): List<TestimonialDto>`, `getAllTestimonials(): List<TestimonialDto>`, `getTestimonialById(UUID id): TestimonialDto`, `createTestimonial(TestimonialDto testimonialDto): TestimonialDto`, `updateTestimonial(UUID id, TestimonialDto testimonialDto): TestimonialDto`, `approveTestimonial(UUID id): TestimonialDto`, and `deleteTestimonial(UUID id): void`.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/TestimonialController.java` — CONTROLLER layer — public-facing REST controller for fetching approved testimonials via `getAllApprovedTestimonials()` and `getTestimonialById(UUID id)`.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/controller/AdminTestimonialController.java` — CONTROLLER layer — admin-only REST controller for CRUD operations on testimonials, including `getAllTestimonials()`, `getTestimonialById(UUID id)`, `createTestimonial(TestimonialDto testimonialDto)`, `updateTestimonial(UUID id, TestimonialDto testimonialDto)`, `approveTestimonial(UUID id)`, and `deleteTestimonial(UUID id)`.
- `backend/src/main/java/com/yetithehimalayankitchenbaner/dto/TestimonialDto.java` — DTO layer — defines the structure for incoming requests and outgoing responses related to testimonials.

**Feature Instruction:**

This feature provides a complete backend solution for managing customer testimonials, including public access to approved testimonials and administrative control for CRUD operations. It consists of a JPA entity (`Testimonial`), a Spring Data JPA repository (`TestimonialRepository`), a DTO (`TestimonialDto`), a service layer (`TestimonialService`) for business logic, and two REST controllers (`TestimonialController` for public access and `AdminTestimonialController` for authenticated admin operations).

### Testimonial.java
This is the JPA entity representing a customer testimonial. It will be mapped to a database table. It includes fields for a unique identifier, the author's name, the testimonial content, a rating, creation timestamp, and an approval status.

### TestimonialDto.java
This DTO is used for transferring testimonial data between the service layer and the controllers. It mirrors the `Testimonial` entity but includes validation annotations for incoming requests and is used for both request and response bodies.

### TestimonialRepository.java
This interface extends `JpaRepository` to provide standard CRUD operations for `Testimonial` entities. It will also include a custom finder method to retrieve testimonials based on their approval status.

### TestimonialService.java
`TestimonialService` encapsulates the business logic for testimonials. It interacts with `TestimonialRepository` to perform database operations and maps entities to DTOs and vice-versa. It handles fetching, creating, updating, approving, and deleting testimonials.

#### Public Methods:
1.  `public List<TestimonialDto> getAllApprovedTestimonials()`
    *   **Logic:**
        1.  Call `testimonialRepository.findByApproved(true)` to retrieve all approved `Testimonial` entities.
        2.  Map each `Testimonial` entity to a `TestimonialDto`.
        3.  Return the list of `TestimonialDto`.
    *   **Error Cases:** None.

2.  `public List<TestimonialDto> getAllTestimonials()`
    *   **Logic:**
        1.  Call `testimonialRepository.findAll()` to retrieve all `Testimonial` entities.
        2.  Map each `Testimonial` entity to a `TestimonialDto`.
        3.  Return the list of `TestimonialDto`.
    *   **Error Cases:** None.

3.  `public TestimonialDto getTestimonialById(UUID id)`
    *   **Logic:**
        1.  Call `testimonialRepository.findById(id)`.
        2.  If the testimonial is not found, throw a `ResourceNotFoundException` (from `shared-backend-core`).
        3.  Map the found `Testimonial` entity to a `TestimonialDto`.
        4.  Return the `TestimonialDto`.
    *   **Error Cases:** `ResourceNotFoundException` if no testimonial with the given ID exists.

4.  `public TestimonialDto createTestimonial(TestimonialDto testimonialDto)`
    *   **Logic:**
        1.  Create a new `Testimonial` entity from the `testimonialDto`.
        2.  Set `createdAt` to `LocalDateTime.now()`.
        3.  Set `approved` to `false` by default.
        4.  Call `testimonialRepository.save()` with the new `Testimonial` entity.
        5.  Map the saved `Testimonial` entity back to a `TestimonialDto`.
        6.  Return the `TestimonialDto`.
    *   **Error Cases:** None (validation handled by DTO annotations).

5.  `public TestimonialDto updateTestimonial(UUID id, TestimonialDto testimonialDto)`
    *   **Logic:**
        1.  Call `testimonialRepository.findById(id)`.
        2.  If the testimonial is not found, throw a `ResourceNotFoundException`.
        3.  Update the existing `Testimonial` entity with data from `testimonialDto` (authorName, content, rating, approved).
        4.  Call `testimonialRepository.save()` with the updated `Testimonial` entity.
        5.  Map the saved `Testimonial` entity back to a `TestimonialDto`.
        6.  Return the `TestimonialDto`.
    *   **Error Cases:** `ResourceNotFoundException` if no testimonial with the given ID exists.

6.  `public TestimonialDto approveTestimonial(UUID id)`
    *   **Logic:**
        1.  Call `testimonialRepository.findById(id)`.
        2.  If the testimonial is not found, throw a `ResourceNotFoundException`.
        3.  Set the `approved` field of the found `Testimonial` entity to `true`.
        4.  Call `testimonialRepository.save()` with the updated `Testimonial` entity.
        5.  Map the saved `Testimonial` entity back to a `TestimonialDto`.
        6.  Return the `TestimonialDto`.
    *   **Error Cases:** `ResourceNotFoundException` if no testimonial with the given ID exists.

7.  `public void deleteTestimonial(UUID id)`
    *   **Logic:**
        1.  Call `testimonialRepository.findById(id)`.
        2.  If the testimonial is not found, throw a `ResourceNotFoundException`.
        3.  Call `testimonialRepository.deleteById(id)`.
    *   **Error Cases:** `ResourceNotFoundException` if no testimonial with the given ID exists.

### TestimonialController.java
This controller exposes public API endpoints for fetching testimonials. It injects `TestimonialService` and calls its methods. Endpoints are publicly accessible.

### AdminTestimonialController.java
This controller exposes administrative API endpoints for CRUD operations on testimonials. It injects `TestimonialService` and calls its methods. All endpoints in this controller must be secured with `@PreAuthorize("hasRole('ADMIN')")` to ensure only authenticated administrators can access them. It will handle mapping `TestimonialDto` to and from JSON request/response bodies.

### Inter-file Wiring
- `TestimonialService` injects `TestimonialRepository`.
- `TestimonialController` injects `TestimonialService`.
- `AdminTestimonialController` injects `TestimonialService`.

### Security Configuration
Ensure that `/api/v1/testimonials/**` endpoints are `permitAll()` in `SecurityConfig` (from `shared-backend-auth`).
Ensure that `/api/v1/admin/testimonials/**` endpoints are `hasRole("ADMIN")` in `SecurityConfig` (from `shared-backend-auth`).

```

java
// Example SecurityConfig snippet (within securityFilterChain method)
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/auth/**").permitAll()
    .requestMatchers("/api/v1/testimonials/**").permitAll()
    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/**").authenticated()
    .anyRequest().permitAll()
)


```

---

## Core UI & Pages

**Name:** `core-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/api/client.ts` — SERVICE layer — configures a global Axios instance (`apiClient`) with JWT token interceptors for all API requests.
- `frontend/src/App.tsx` — COMPONENT layer — the root component that sets up `react-router-dom` for all public and admin routes, integrating `Layout`, `AdminLayout`, and `ProtectedRoute`.
- `frontend/src/components/Layout.tsx` — COMPONENT layer — provides the main layout for public-facing pages, including the `Header`, `Footer`, and a floating WhatsApp CTA.
- `frontend/src/components/Header.tsx` — COMPONENT layer — renders the site-wide header with navigation links and a dynamic authentication call-to-action.
- `frontend/src/components/Footer.tsx` — COMPONENT layer — renders the site-wide footer with business contact information, social media links, and navigation.
- `frontend/src/pages/HomePage.tsx` — PAGE layer — the landing page featuring an immersive hero section, featured menu items, a reservation callout, and a testimonials section.
- `frontend/src/pages/AboutPage.tsx` — PAGE layer — displays the story of the restaurant, its culinary philosophy, and photos of the ambiance.
- `frontend/src/pages/ContactPage.tsx` — PAGE layer — provides contact information, business hours, an embedded Google Map, and a contact form.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#2c2c2e] text-white
- Primary CTA: bg-[#d4a843] hover:bg-[#b88e3a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#d4a843]
- Section bg: bg-white (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

This feature, Core UI & Pages, establishes the foundational structure and public-facing pages for the Yeti - The Himalayan Kitchen application. It encompasses the global Axios client configuration, application routing, and core layout components (Header, Footer, Layout). It also defines the primary public pages: Home, About, and Contact. All components and pages within this feature must adhere strictly to the defined Design Tokens for styling.

### `frontend/src/api/client.ts`
This file configures an Axios instance (`apiClient`) that will be used for all API calls across the frontend application. It includes an interceptor to automatically attach the JWT token to outgoing requests. The token is retrieved from `localStorage` using the key 'token'.

1.  **Axios Instance**: Create an Axios instance with a base URL pointing to the backend API (e.g., `/api/v1`).
2.  **Request Interceptor**: Implement a request interceptor that checks for a JWT token in `localStorage` under the key 'token'. If a token exists, it should be added to the `Authorization` header as a Bearer token (`Bearer <token>`).
3.  **Response Interceptor (Error Handling)**: Implement a response interceptor to handle common API errors, such as 401 Unauthorized responses, by redirecting the user to the login page or clearing the token.

### `frontend/src/App.tsx`
This is the root component of the application, responsible for setting up `react-router-dom` for navigation. It defines all public and admin routes, utilizing `Layout` for public pages, `AdminLayout` for admin pages, and `ProtectedRoute` to secure admin routes.

1.  **Router Setup**: Use `BrowserRouter` from `react-router-dom`.
2.  **Auth Context**: Wrap the entire application with `AuthContext.Provider` (from `authentication-ui`) to provide authentication state globally.
3.  **Public Routes**: Define routes for public pages, each wrapped by the `Layout` component:
    *   `/` (HomePage)
    *   `/menu` (MenuPage from `menu-ui`)
    *   `/reservations` (ReservationPage from `reservation-ui`)
    *   `/order-confirmation` (OrderConfirmationPage from `order-ui`)
    *   `/profile` (ProfilePage from `order-ui`)
    *   `/blog` (BlogPage from `blog-ui`)
    *   `/blog/:id` (BlogPostPage from `blog-ui`)
    *   `/gallery` (Placeholder for a future gallery page)
    *   `/about` (AboutPage)
    *   `/contact` (ContactPage)
    *   `/login` (LoginPage from `authentication-ui`)
4.  **Admin Routes**: Define routes for admin pages, each wrapped by `ProtectedRoute` (from `authentication-ui`) and `AdminLayout` (from `admin-portal`). `ProtectedRoute` ensures only authenticated users with the 'ADMIN' role can access these routes.
    *   `/admin` (AdminDashboardPage from `admin-portal`)
    *   `/admin/menu` (AdminMenuPage from `menu-ui`)
    *   `/admin/reservations` (AdminReservationsPage from `reservation-ui`)
    *   `/admin/orders` (AdminOrdersPage from `order-ui`)
    *   `/admin/blog` (AdminBlogPage from `blog-ui`)
    *   `/admin/testimonials` (AdminTestimonialsPage from `testimonial-ui`)

### `frontend/src/components/Layout.tsx`
This component provides the main layout structure for all public-facing pages. It includes the `Header`, `Footer`, and a floating WhatsApp Call-to-Action (CTA) button.

1.  **Structure**: Render the `Header` component, then the `children` prop, followed by the `Footer` component.
2.  **WhatsApp CTA**: Implement a fixed-position floating button (e.g., bottom-right) that links to the business's WhatsApp number (`https://wa.me/917030555077`). Style it with a distinct background color (e.g., green) and an icon.

### `frontend/src/components/Header.tsx`
This component renders the site-wide header, including the business logo, navigation links, and a dynamic call-to-action button (Login/Profile).

1.  **Logo**: Display the business name "Yeti - The Himalayan Kitchen" as a prominent, clickable logo linking to the home page.
2.  **Navigation**: Include navigation links for Home, Menu, Reservations, Blog, About, and Contact. Use `NavLink` from `react-router-dom` for active link styling.
3.  **Auth CTA**: Dynamically render either a "Login" button (linking to `/login`) or a "Profile" button (linking to `/profile`) based on the user's authentication status (obtained from `AuthContext`).
4.  **Styling**: Apply `bg-[#2c2c2e]` for the background and `text-white` for text, as per Design Tokens.

### `frontend/src/components/Footer.tsx`
This component provides the site-wide footer, displaying essential business information, social media links, and a subset of navigation links.

1.  **Business Info**: Display the business name "Yeti - The Himalayan Kitchen", address ("First Floor, Yeti - The Himalayan Kitchen, Baner, Atria Building, Baner Rd, Kapil Malhar, Baner Gaon, Baner, Pune, Maharashtra 411069"), and phone number ("070305 55077"). Include placeholder opening hours (e.g., "Mon-Sun: 11:00 AM - 11:00 PM").
2.  **Social Media**: Include placeholder links and icons for Facebook, Instagram, and Twitter.
3.  **Navigation**: Reiterate key navigation links such as Home, Menu, About, and Contact.
4.  **Copyright**: Add a copyright notice.

### `frontend/src/pages/HomePage.tsx`
This page serves as the landing page, designed to be immersive and inviting. It features a hero section, highlights featured menu items, prompts for reservations, and showcases customer testimonials.

1.  **Hero Section**: 
    *   Background: Use `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80` as the hero image, with a `bg-black bg-opacity-50` overlay.
    *   Content: A prominent `h1` with "Yeti - The Himalayan Kitchen" and a subheadline like "An Authentic Culinary Journey to the Peaks of Flavor." Include a primary CTA button "Explore Our Menu" linking to `/menu` and a secondary CTA "Book a Table" linking to `/reservations`.
2.  **Featured Menu Section**: A section titled "Our Signature Dishes" or "Taste the Himalayas." Include placeholder content for 3-4 featured menu items, each with an image, name, short description, and price. This section will eventually fetch data from the `menu-backend` via `menu-ui` hooks.
3.  **Reservation Callout Section**: A compelling section encouraging users to book a table, with a heading like "Experience the Warmth of Himalayan Hospitality" and a CTA button "Make a Reservation" linking to `/reservations`.
4.  **Testimonials Section**: Integrate the `TestimonialsSection` component (from `testimonial-ui`) to display customer reviews.

### `frontend/src/pages/AboutPage.tsx`
This page tells the story of Yeti - The Himalayan Kitchen, its culinary philosophy, and showcases the restaurant's ambiance.

1.  **Hero Section**: A smaller hero section with a title "Our Story" and a relevant background image (e.g., a cozy restaurant interior or mountain landscape).
2.  **Our Story Section**: Narrative text about the restaurant's origins, passion for Himalayan cuisine, and the journey of bringing authentic flavors to Pune. Use an inviting and narrative-driven tone.
3.  **Culinary Philosophy Section**: Describe the restaurant's commitment to fresh ingredients, traditional cooking methods, and unique spice blends. Highlight signature aspects of Himalayan cooking.
4.  **Ambiance Gallery Section**: A grid or carousel of high-quality images showcasing the restaurant's interior, decor, and dining experience, reflecting the immersive visual direction.

### `frontend/src/pages/ContactPage.tsx`
This page provides all necessary contact information, business hours, an embedded map, and a contact form.

1.  **Hero Section**: A smaller hero section with a title "Get in Touch" and a relevant background image.
2.  **Contact Details Section**: Display the business name, full address ("First Floor, Yeti - The Himalayan Kitchen, Baner, Atria Building, Baner Rd, Kapil Malhar, Baner Gaon, Baner, Pune, Maharashtra 411069"), phone number ("070305 55077"), and a placeholder email address (e.g., "info@yetihimalayankitchen.com").
3.  **Business Hours Section**: Display placeholder opening hours (e.g., "Monday - Sunday: 11:00 AM - 11:00 PM").
4.  **Our Location Section (Map)**: Embed a Google Map centered at the coordinates `18.559531, 73.805844` (assuming a second coordinate for Pune). Include a marker for the restaurant's location.
5.  **Contact Form Section**: A simple contact form with fields for Name, Email, Subject, and Message. Include a submit button. This form will be a placeholder and not connected to a backend endpoint in this feature.


---

## Authentication UI

**Name:** `authentication-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/context/AuthContext.tsx` — React context for managing global authentication state, including user information (email, role), JWT token, authentication status, and loading state. It provides `login`, `logout`, `register`, and `checkAuth` functions.
- `frontend/src/hooks/useAuth.ts` — Custom React hook for easy access to the authentication context, providing the current user's authentication state and functions.
- `frontend/src/services/authService.ts` — Service layer for handling authentication API calls to the backend, including user login and registration.
- `frontend/src/types/auth.ts` — TypeScript types and interfaces related to authentication, including request and response DTOs and user structure.
- `frontend/src/pages/LoginPage.tsx` — Frontend page component that provides user interface for both logging in and registering new accounts.
- `frontend/src/components/ProtectedRoute.tsx` — React component that acts as a wrapper to restrict access to its child routes only to authenticated users.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#3a2f2a] text-white
- Primary CTA: bg-[#d4a843] hover:bg-[#b88e3a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#d4a843]
- Section bg: bg-white (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

This `authentication-ui` feature provides a complete user authentication flow for the Yeti - The Himalayan Kitchen application, including user login, registration, session management, and route protection. It consists of a React Context (`AuthContext.tsx`) to manage global authentication state, a custom hook (`useAuth.ts`) for easy access to this context, a service (`authService.ts`) to interact with the backend authentication API, TypeScript types (`auth.ts`) for data structures, a login/registration page (`LoginPage.tsx`), and a route guard component (`ProtectedRoute.tsx`).

### Authentication Flow
1.  **User Interaction**: Users access the `LoginPage.tsx` to either log in with existing credentials or register a new account. This page will present a clean, intuitive form, styled according to the design tokens, with clear calls to action like "Embark on Your Culinary Journey" for login and "Join the Himalayan Family" for registration.
2.  **API Calls**: When a user submits the login or registration form, `LoginPage.tsx` invokes the `login` or `register` functions provided by the `useAuth` hook. These functions, in turn, call the respective methods in `authService.ts`.
3.  **Backend Communication**: `authService.ts` makes HTTP POST requests to the `shared-backend-auth` feature's API endpoints: `/api/v1/auth/login` for login and `/api/v1/auth/register` for registration. It sends an `AuthRequest` object containing `email` and `password` and expects an `AuthResponse` containing a `token`.
4.  **State Management**: Upon successful authentication, `authService.ts` returns the `AuthResponse` to `AuthContext.tsx`. `AuthContext.tsx` then stores the received JWT `token` in `localStorage` under the key `'token'`. It also decodes the JWT (using a client-side JWT decoding library) to extract the user's `email` and `role` (ADMIN or CUSTOMER) and updates the global authentication state, setting `isAuthenticated` to `true` and populating the `user` object. The `isLoading` state is managed throughout this process.
5.  **Route Protection**: The `ProtectedRoute.tsx` component is used to wrap routes that require authentication. It checks the `isAuthenticated` status from `useAuth`. If the user is not authenticated, they are redirected to the `LoginPage.tsx`. If they are authenticated, the child components are rendered. Admin-specific routes will require additional role-based checks, which can be implemented within `ProtectedRoute` or a similar component.
6.  **Session Persistence**: On application load, `AuthContext.tsx` attempts to retrieve the JWT from `localStorage`. If a token exists, it validates it (e.g., by checking its expiry) and re-establishes the user's authenticated state, preventing immediate logout on refresh.

### File Interactions
*   `LoginPage.tsx` utilizes `useAuth.ts` for authentication actions and `core-ui`'s `Layout` component for consistent page structure.
*   `ProtectedRoute.tsx` relies on `useAuth.ts` to determine authentication status.
*   `useAuth.ts` consumes the `AuthContext.tsx`.
*   `AuthContext.tsx` calls `authService.ts` for backend authentication and stores the JWT in `localStorage` using the key `'token'`.
*   `authService.ts` uses `frontend/src/api/client.ts` for making HTTP requests and relies on types defined in `auth.ts`.
*   `frontend/src/api/client.ts` (from `shared-backend-core` or a generic client) will be configured to automatically attach the JWT from `localStorage` (key: `'token'`) to outgoing requests to protected backend endpoints.

### Public Methods and Data Structures

**`AuthContext.tsx`**
*   `AuthContext.Provider`: Provides the authentication state and functions to its children.
*   `login(email: string, password: string): Promise<void>`: Authenticates a user, stores the token, sets user data, and redirects.
*   `register(email: string, password: string): Promise<void>`: Registers a new user, stores the token, sets user data, and redirects.
*   `logout(): void`: Clears authentication state and token, then redirects to login.
*   `checkAuth(): Promise<void>`: Verifies existing token on app load.

**`useAuth.ts`**
*   `useAuth(): { user: User | null, token: string | null, isAuthenticated: boolean, isLoading: boolean, login: (email: string, password: string) => Promise<void>, register: (email: string, password: string) => Promise<void>, logout: () => void }`: Provides convenient access to authentication context values and functions.

**`authService.ts`**
*   `login(request: AuthRequest): Promise<AuthResponse>`: Sends a POST request to `/api/v1/auth/login`.
*   `register(request: AuthRequest): Promise<AuthResponse>`: Sends a POST request to `/api/v1/auth/register`.

**`auth.ts`**
*   `AuthRequest`: `{ email: string, password: string }`
*   `AuthResponse`: `{ token: string }`
*   `User`: `{ email: string, role: 'ADMIN' | 'CUSTOMER' }`
*   `Role`: `'ADMIN' | 'CUSTOMER'`

**`LoginPage.tsx`**
*   Renders a form for user login and registration. It will have two tabs or sections, one for 'Login' and one for 'Register'.
*   The login form will have fields for `email` and `password` and a submit button with the text "Login to Your Account".
*   The registration form will have fields for `email` and `password` and a submit button with the text "Create New Account".
*   On successful login/registration, the user is redirected to the home page (`/`) or `/admin/dashboard` if the role is 'ADMIN'.
*   Error messages from the backend (e.g., invalid credentials) should be displayed prominently to the user.

**`ProtectedRoute.tsx`**
*   Takes `children: React.ReactNode` as a prop.
*   If `isLoading` from `useAuth` is true, it renders a simple loading indicator (e.g., a spinning icon or "Loading...").
*   If `isAuthenticated` is false, it uses `react-router-dom`'s `Navigate` component to redirect the user to `/login`.
*   If `isAuthenticated` is true, it renders the `children` prop.


---

## Admin Portal Shell

**Name:** `admin-portal`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/AdminLayout.tsx` — COMPONENT layer — Provides the consistent layout for all admin pages, including a navigation sidebar and a main content area.
- `frontend/src/pages/admin/AdminDashboardPage.tsx` — PAGE layer — The main landing page for the admin panel, displaying a welcome message and quick navigation links to other admin sections.

**Feature Instruction:**

## Design Tokens
- Admin Layout Sidebar: bg-[#2C3E50] text-white
- Admin Sidebar Link: text-white hover:text-[#E67E22] transition-colors duration-200
- Admin Sidebar Active Link: text-[#E67E22] font-semibold
- Admin Page Background: bg-[#F8F8F8]
- Admin Heading Text: text-[#4A2C2A]
- Admin Body Text: text-gray-700
- Admin Primary Button: bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200
- Admin Card: bg-white rounded-lg shadow-sm p-6 border border-gray-100

The `admin-portal` feature provides the foundational structure and landing page for the administrative interface of Yeti - The Himalayan Kitchen. It consists of `AdminLayout.tsx`, which defines the overall visual and navigational shell for all admin pages, and `AdminDashboardPage.tsx`, serving as the entry point to the admin panel.

### AdminLayout.tsx
This component acts as the main layout wrapper for all pages within the `/admin` route. It ensures a consistent look and feel, providing a persistent sidebar for navigation and a main content area where specific admin pages are rendered.

**Structure:**
1.  The component will render a `div` with a flex layout to contain the sidebar and the main content.
2.  **Sidebar:**
    *   Positioned on the left, with a fixed width (e.g., `w-64`).
    *   Styled with `bg-[#2C3E50]` and `text-white` for the background and default text color.
    *   Contains the restaurant's name/logo at the top, styled appropriately (e.g., `text-2xl font-bold text-white p-4`).
    *   Includes a navigation list (`<nav>`) with `NavLink` components from `react-router-dom`.
    *   Each `NavLink` will point to a specific admin management page. The links should be styled with `Admin Sidebar Link` tokens.
        *   "Dashboard" -> `/admin/dashboard`
        *   "Menu Management" -> `/admin/menu` (from `menu-ui` feature)
        *   "Reservations" -> `/admin/reservations` (from `reservation-ui` feature)
        *   "Orders" -> `/admin/orders` (from `order-ui` feature)
        *   "Blog Posts" -> `/admin/blog` (from `blog-ui` feature)
        *   "Testimonials" -> `/admin/testimonials` (from `testimonial-ui` feature)
    *   The active `NavLink` will apply `Admin Sidebar Active Link` tokens.
    *   A "Logout" button will be present at the bottom of the sidebar, styled as a button and utilizing the `logout` function from the `useAuth` hook.
3.  **Main Content Area:**
    *   Occupies the remaining width, allowing child components (admin pages) to be rendered within it.
    *   Styled with `bg-[#F8F8F8]` for the background.
    *   The `children` prop will be rendered within this area, typically wrapped in a `div` for consistent padding (e.g., `p-8`).
4.  **Authentication:**
    *   `AdminLayout` will import and use the `useAuth` hook from `authentication-ui` (`frontend/src/hooks/useAuth.ts`).
    *   The `logout` function from `useAuth` will be called when the logout button is clicked.
    *   This component assumes it is protected by a `ProtectedRoute` (from `authentication-ui`) that ensures the user is authenticated and has the `ADMIN` role before rendering `AdminLayout` and its children.

**Public Functions:**
*   `AdminLayout(props: { children: React.ReactNode }): JSX.Element`
    *   Renders the admin dashboard layout, including a navigation sidebar and the main content area for child routes.

### AdminDashboardPage.tsx
This page serves as the initial view when an administrator logs into the portal. It provides a high-level overview and quick access to various management sections.

**Structure:**
1.  The page content will be rendered as a child of `AdminLayout`.
2.  **Header Section:**
    *   A prominent `h1` welcoming the administrator: "Welcome, Administrator! Your Himalayan Kitchen Command Center Awaits."
    *   Styled with `text-4xl font-bold text-[#4A2C2A]`.
    *   A brief, inviting sub-headline: "Navigate through the heart of Yeti - The Himalayan Kitchen's operations."
3.  **Overview Section:**
    *   A `div` containing a grid of placeholder "cards" or "widgets" for key statistics.
    *   Each card will be styled with `Admin Card` tokens.
    *   Example cards with placeholder content:
        *   **Today's Reservations:** `<h2>Today's Reservations</h2><p className="text-3xl font-bold">12</p><p>New bookings for today</p>`
        *   **Pending Orders:** `<h2>Pending Orders</h2><p className="text-3xl font-bold">5</p><p>Awaiting processing</p>`
        *   **New Testimonials:** `<h2>New Testimonials</h2><p className="text-3xl font-bold">3</p><p>Ready for review</p>`
        *   **Menu Items:** `<h2>Total Menu Items</h2><p className="text-3xl font-bold">78</p><p>Available for customers</p>`
4.  **Quick Links Section:**
    *   A section providing direct links to the main management pages.
    *   Each link will be a button or a card, styled with `Admin Primary Button` tokens, encouraging navigation.
    *   Example buttons using `Link` from `react-router-dom`:
        *   "Manage Menu" (to `/admin/menu`)
        *   "View Reservations" (to `/admin/reservations`)
        *   "Process Orders" (to `/admin/orders`)
        *   "Edit Blog Posts" (to `/admin/blog`)
        *   "Review Testimonials" (to `/admin/testimonials`)

**Public Functions:**
*   `AdminDashboardPage(): JSX.Element`
    *   Renders the main admin dashboard content, including a welcome message, overview statistics (placeholders), and quick navigation links.

### Inter-file Wiring
`AdminDashboardPage.tsx` will be rendered as a child of `AdminLayout.tsx` via `react-router-dom` routing configuration. The `AdminLayout` component provides the `children` prop, into which `AdminDashboardPage` (and other admin pages) will be injected.

### Cross-Feature Contracts
*   **`authentication-ui`:**
    *   `AdminLayout.tsx` will import and use the `useAuth` hook from `frontend/src/hooks/useAuth.ts` to access the `logout` function, which is called when the admin user clicks the 'Logout' button. The `token` localStorage key used by `authentication-ui` is `'token'`. `AdminLayout` relies on `useAuth` for managing authentication state and actions.

---

## Menu UI

**Name:** `menu-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/admin/AdminMenuPage.tsx` — Admin interface for creating, updating, and deleting menu items and categories.
- `frontend/src/pages/MenuPage.tsx` — Public-facing page displaying the restaurant's menu.
- `frontend/src/hooks/useMenu.ts` — React Query hook for fetching and managing menu data.
- `frontend/src/services/menuService.ts` — Service layer — implements getAllMenuItems(): Promise<MenuItemDto[]>, getMenuItemById(id: string): Promise<MenuItemDto>, getAllMenuItemCategories(): Promise<MenuItemCategory[]>, getMenuItemCategoryById(id: string): Promise<MenuItemCategory>, createMenuItem(item: Omit<MenuItemDto, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>): Promise<MenuItemDto>, updateMenuItem(id: string, item: Omit<MenuItemDto, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>): Promise<MenuItemDto>, deleteMenuItem(id: string): Promise<void>, createMenuItemCategory(name: string): Promise<MenuItemCategory>, updateMenuItemCategory(id: string, name: string): Promise<MenuItemCategory>, deleteMenuItemCategory(id: string): Promise<void>.
- `frontend/src/types/menu.ts` — Generated from the backend API contract — TypeScript types and interfaces for menu items and categories.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A2B4C] text-white
- Primary CTA: bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#FF9933]
- Section bg: bg-white (odd sections) / bg-[#F5F5F5] (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

This feature provides the user interface for displaying the restaurant's menu to customers and an administrative interface for managing menu items and categories. It consists of TypeScript types, a service layer for API interactions, React Query hooks for data management, and two main pages: `MenuPage.tsx` for public viewing and `AdminMenuPage.tsx` for administrative CRUD operations.

### `frontend/src/types/menu.ts`
This file defines the TypeScript interfaces for `MenuItemDto` and `MenuItemCategory`, directly mirroring the backend DTOs from the `menu-backend` feature. These types ensure strong typing across the frontend application when dealing with menu data.

### `frontend/src/services/menuService.ts`
This service acts as the primary interface for all menu-related API calls. It uses `axios` from `@/api/client.ts` to communicate with the `menu-backend` API. All functions return Promises that resolve to the appropriate data types or void for deletion operations.

**Public Functions:**
1.  `getAllMenuItems(): Promise<MenuItemDto[]>`
    *   Calls `GET /api/v1/menus/items`.
    *   Returns a list of all menu items.
2.  `getMenuItemById(id: string): Promise<MenuItemDto>`
    *   Calls `GET /api/v1/menus/items/{id}`.
    *   Returns a single menu item by its ID. Throws an error if not found.
3.  `getAllMenuItemCategories(): Promise<MenuItemCategory[]>`
    *   Calls `GET /api/v1/menus/categories`.
    *   Returns a list of all menu item categories.
4.  `getMenuItemCategoryById(id: string): Promise<MenuItemCategory>`
    *   Calls `GET /api/v1/menus/categories/{id}`.
    *   Returns a single menu item category by its ID. Throws an error if not found.
5.  `createMenuItem(item: Omit<MenuItemDto, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>): Promise<MenuItemDto>`
    *   Calls `POST /api/v1/admin/menus/items` with the item data.
    *   Returns the created menu item. Requires authentication (ADMIN role).
6.  `updateMenuItem(id: string, item: Omit<MenuItemDto, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>): Promise<MenuItemDto>`
    *   Calls `PUT /api/v1/admin/menus/items/{id}` with the updated item data.
    *   Returns the updated menu item. Requires authentication (ADMIN role).
7.  `deleteMenuItem(id: string): Promise<void>`
    *   Calls `DELETE /api/v1/admin/menus/items/{id}`.
    *   Deletes the menu item. Requires authentication (ADMIN role).
8.  `createMenuItemCategory(name: string): Promise<MenuItemCategory>`
    *   Calls `POST /api/v1/admin/menus/categories` with `{ name: string }` as request body.
    *   Returns the created category. Requires authentication (ADMIN role).
9.  `updateMenuItemCategory(id: string, name: string): Promise<MenuItemCategory>`
    *   Calls `PUT /api/v1/admin/menus/categories/{id}` with `{ name: string }` as request body.
    *   Returns the updated category. Requires authentication (ADMIN role).
10. `deleteMenuItemCategory(id: string): Promise<void>`
    *   Calls `DELETE /api/v1/admin/menus/categories/{id}`.
    *   Deletes the category. Requires authentication (ADMIN role).

### `frontend/src/hooks/useMenu.ts`
This file provides React Query hooks for managing menu data, abstracting the `menuService` calls and providing caching, loading states, and error handling. Each hook interacts with the `menuService` to perform its respective operation.

**Public Functions:**
1.  `useMenuItems(): UseQueryResult<MenuItemDto[], Error>`
    *   Fetches all menu items using `menuService.getAllMenuItems()`.
2.  `useMenuItem(id: string): UseQueryResult<MenuItemDto, Error>`
    *   Fetches a single menu item by ID using `menuService.getMenuItemById(id)`.
3.  `useCategories(): UseQueryResult<MenuItemCategory[], Error>`
    *   Fetches all menu item categories using `menuService.getAllMenuItemCategories()`.
4.  `useCategory(id: string): UseQueryResult<MenuItemCategory, Error>`
    *   Fetches a single menu item category by ID using `menuService.getMenuItemCategoryById(id)`.
5.  `useCreateMenuItem(): UseMutationResult<MenuItemDto, Error, Omit<MenuItemDto, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'>>`
    *   Mutation hook for creating a menu item using `menuService.createMenuItem()`.
    *   On success, invalidates the `['menuItems']` and `['categories']` queries.
6.  `useUpdateMenuItem(): UseMutationResult<MenuItemDto, Error, { id: string, item: Omit<MenuItemDto, 'id' | 'categoryName' | 'createdAt' | 'updatedAt'> }>`
    *   Mutation hook for updating a menu item using `menuService.updateMenuItem()`.
    *   On success, invalidates the `['menuItems']` and `['menuItem', id]` queries.
7.  `useDeleteMenuItem(): UseMutationResult<void, Error, string>`
    *   Mutation hook for deleting a menu item using `menuService.deleteMenuItem()`.
    *   On success, invalidates the `['menuItems']` and `['categories']` queries.
8.  `useCreateMenuItemCategory(): UseMutationResult<MenuItemCategory, Error, string>`
    *   Mutation hook for creating a menu item category using `menuService.createMenuItemCategory()`.
    *   On success, invalidates the `['categories']` and `['menuItems']` queries.
9.  `useUpdateMenuItemCategory(): UseMutationResult<MenuItemCategory, Error, { id: string, name: string }>`
    *   Mutation hook for updating a menu item category using `menuService.updateMenuItemCategory()`.
    *   On success, invalidates the `['categories']` and `['category', id]` queries.
10. `useDeleteMenuItemCategory(): UseMutationResult<void, Error, string>`
    *   Mutation hook for deleting a menu item category using `menuService.deleteMenuItemCategory()`.
    *   On success, invalidates the `['categories']` and `['menuItems']` queries.

### `frontend/src/pages/MenuPage.tsx`
This page displays the public-facing menu of Yeti - The Himalayan Kitchen. It uses `Layout` from `core-ui` and fetches menu data using `useMenu` hooks. It also integrates with `CartContext` from `order-ui` to allow users to add items to their order.

**Structure and Content:**
*   Wraps content in `<Layout>`. 
*   **Hero Section:**
    *   `className="relative h-[50vh] bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80)' }}`
    *   `<div className="absolute inset-0 bg-black bg-opacity-50" />`
    *   `<h1>` text: "Savor the Authentic Flavors of Yeti - The Himalayan Kitchen"
    *   `<p>` sub-text: "Embark on a culinary journey to the heart of the Himalayas."
*   **Menu Categories Section:**
    *   `Section container` with `bg-[#F5F5F5]`.
    *   Displays a list of menu categories fetched using `useCategories()`.
    *   Each category is a clickable filter button (e.g., `bg-[#8B4513] hover:bg-[#6F360F] text-white rounded-full px-4 py-2`).
*   **Menu Items Section:**
    *   `Section container` with `bg-white`.
    *   Displays menu items fetched using `useMenuItems()`, filtered by the selected category.
    *   Each menu item is rendered as a `Card` (`bg-white rounded-xl shadow-md border border-gray-100 p-6`).
    *   Each card includes:
        *   High-quality image (`imageUrl`).
        *   Item `name` (e.g., `text-xl font-semibold text-[#1A2B4C]`).
        *   Item `description` (e.g., `text-gray-700`).
        *   Item `price` (e.g., `text-lg font-bold text-[#FF9933]`).
        *   An "Add to Order" button (`Primary CTA` styling) that calls `addItemToCart` from `CartContext`.
*   **Error Handling:** Displays a user-friendly message if menu items or categories fail to load.
*   **Loading State:** Shows a loading spinner or skeleton UI while data is being fetched.

### `frontend/src/pages/admin/AdminMenuPage.tsx`
This page provides an administrative interface for managing menu items and categories. It uses `AdminLayout` from `admin-portal` and leverages the `useMenu` hooks for all CRUD operations. It will use `react-hook-form` and `zod` for form validation.

**Structure and Content:**
*   Wraps content in `<AdminLayout>`.
*   **Admin Menu Management (Categories) Section:**
    *   `Section container` with `bg-white`.
    *   Heading: "Manage Menu Categories" (e.g., `text-2xl font-bold text-[#1A2B4C]`)
    *   Form for creating new categories:
        *   Input for `name` (string, required).
        *   Submit button (`Primary CTA` styling) that calls `useCreateMenuItemCategory`.
    *   Table displaying existing categories fetched using `useCategories()`:
        *   Columns: `ID`, `Name`, `Actions`.
        *   Edit button for each category (opens a modal/form for `useUpdateMenuItemCategory`).
        *   Delete button for each category (confirms and calls `useDeleteMenuItemCategory`).
*   **Admin Menu Management (Items) Section:**
    *   `Section container` with `bg-[#F5F5F5]`.
    *   Heading: "Manage Menu Items" (e.g., `text-2xl font-bold text-[#1A2B4C]`)
    *   Form for creating new menu items:
        *   Inputs for `name` (string, required), `description` (string, required), `price` (string, required, converted to number), `categoryId` (dropdown, required, populated from `useCategories()`), `imageUrl` (string, optional), `available` (boolean checkbox).
        *   Zod schema for validation:
            *   `name`: `z.string().min(1, 'Name is required')`
            *   `description`: `z.string().min(1, 'Description is required')`
            *   `price`: `z.string().min(1, 'Price is required').regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')`
            *   `categoryId`: `z.string().uuid('Invalid category selected')`
            *   `imageUrl`: `z.string().url('Invalid URL format').optional().or(z.literal(''))`
            *   `available`: `z.boolean().default(true)`
        *   Submit button (`Primary CTA` styling) that calls `useCreateMenuItem`.
    *   Table displaying existing menu items fetched using `useMenuItems()`:
        *   Columns: `ID`, `Name`, `Category`, `Price`, `Available`, `Actions`.
        *   Edit button for each item (opens a modal/form for `useUpdateMenuItem`).
        *   Delete button for each item (confirms and calls `useDeleteMenuItem`).
*   **Error Handling:** Displays `toast` notifications for success/error messages from mutations.
*   **Loading State:** Shows loading indicators for data fetching and mutation submissions.


---

## Reservation UI

**Name:** `reservation-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/admin/AdminReservationsPage.tsx` — Admin interface page for viewing and managing all reservations. It uses `useReservations` to fetch and modify reservation data.
- `frontend/src/pages/ReservationPage.tsx` — Public-facing page for customers to submit new table reservations. It uses `useCreateReservation` to interact with the backend.
- `frontend/src/hooks/useReservations.ts` — React Query hook for creating, fetching, updating, and deleting reservation data. It abstracts API calls via `reservationService.ts`.
- `frontend/src/services/reservationService.ts` — Service layer for making direct API calls related to reservations. It provides functions for creating, fetching, updating, and deleting reservations.
- `frontend/src/types/reservation.ts` — TypeScript type definitions for reservation-related data structures, mirroring backend DTOs.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#36454F] text-white
- Primary CTA: bg-[#D2691E] hover:bg-[#A0522D] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#D2691E]
- Section bg: bg-white (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed
- Admin Table Header: bg-gray-200 text-gray-700
- Admin Table Row: bg-white hover:bg-gray-50

This feature provides the user interface for customers to make table reservations and for administrators to manage those reservations. It consists of two main pages: `ReservationPage.tsx` for customer bookings and `AdminReservationsPage.tsx` for admin management. These pages interact with the backend via `reservationService.ts` and `useReservations.ts` React Query hooks, which in turn use the `reservation-backend` API.

### `frontend/src/types/reservation.ts`
This file defines the TypeScript interfaces for reservation-related data, mirroring the DTOs from the `reservation-backend` feature. It will export `ReservationStatus`, `CreateReservationRequest`, and `ReservationResponse`.

### `frontend/src/services/reservationService.ts`
This service acts as an intermediary for all API calls related to reservations. It uses `frontend/src/api/client.ts` (from the `shared-backend-core` feature) to make HTTP requests. It will contain the following asynchronous functions:

1.  `createReservation(request: CreateReservationRequest): Promise<ReservationResponse>`:
    -   Sends a POST request to `/api/v1/reservations` with the `CreateReservationRequest` as the body.
    -   Returns the `ReservationResponse` from the backend.
    -   Handles network errors and API response errors.

2.  `getAllReservations(startDate?: string, endDate?: string): Promise<ReservationResponse[]>`:
    -   Sends a GET request to `/api/v1/admin/reservations`.
    -   Optionally includes `startDate` and `endDate` as query parameters for filtering.
    -   Returns a list of `ReservationResponse` objects.

3.  `getReservationById(id: string): Promise<ReservationResponse>`:
    -   Sends a GET request to `/api/v1/admin/reservations/{id}`.
    -   Returns a single `ReservationResponse` object.

4.  `updateReservationStatus(id: string, newStatus: ReservationStatus): Promise<ReservationResponse>`:
    -   Sends a PUT request to `/api/v1/admin/reservations/{id}/status` with a JSON body `{ "newStatus": newStatus }`.
    -   Returns the updated `ReservationResponse`.

5.  `deleteReservation(id: string): Promise<void>`:
    -   Sends a DELETE request to `/api/v1/admin/reservations/{id}`.
    -   Returns nothing on success.

### `frontend/src/hooks/useReservations.ts`
This file provides React Query hooks for managing reservation data, abstracting the `reservationService.ts` calls and providing caching, loading states, and error handling. It will export the following hooks:

1.  `useCreateReservation()`:
    -   Uses `useMutation` from React Query.
    -   Calls `reservationService.createReservation`.
    -   On successful creation, invalidates the `['reservations']` query key to refresh any lists of reservations.
    -   Returns the mutation object with `mutate` function, `isLoading`, `isError`, `isSuccess`, and `error`.

2.  `useReservations(startDate?: string, endDate?: string)`:
    -   Uses `useQuery` from React Query with the query key `['reservations', startDate, endDate]`.
    -   Calls `reservationService.getAllReservations(startDate, endDate)`.
    -   Returns the query object with `data` (List<ReservationResponse>), `isLoading`, `isError`, and `error`.

3.  `useReservation(id: string)`:
    -   Uses `useQuery` from React Query with the query key `['reservation', id]`.
    -   Calls `reservationService.getReservationById(id)`.
    -   Returns the query object with `data` (ReservationResponse), `isLoading`, `isError`, and `error`.

4.  `useUpdateReservationStatus()`:
    -   Uses `useMutation` from React Query.
    -   Calls `reservationService.updateReservationStatus`.
    -   On successful update, invalidates the `['reservations']` and `['reservation', id]` query keys.
    -   Returns the mutation object with `mutate` function, `isLoading`, `isError`, `isSuccess`, and `error`.

5.  `useDeleteReservation()`:
    -   Uses `useMutation` from React Query.
    -   Calls `reservationService.deleteReservation`.
    -   On successful deletion, invalidates the `['reservations']` query key.
    -   Returns the mutation object with `mutate` function, `isLoading`, `isError`, `isSuccess`, and `error`.

### `frontend/src/pages/ReservationPage.tsx`
This page provides a public-facing form for customers to book a table. It will be wrapped in the `Layout` component from `core-ui`.

**Structure:**
-   **Hero Section:**
    -   Full-width background image: `url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80)` with a `bg-black bg-opacity-50` overlay.
    -   `h1` with `text-4xl md:text-6xl font-bold text-white` displaying "Embark on a Culinary Journey: Reserve Your Table at Yeti - The Himalayan Kitchen".
    -   Subheadline: "Experience the authentic flavors of the Himalayas in a warm and inviting atmosphere."
-   **Reservation Form Section:**
    -   Container: `<section className="py-16 px-4"><div className="max-w-7xl mx-auto">`
    -   `h2` with `text-3xl font-bold text-gray-800 mb-8` displaying "Book Your Himalayan Feast".
    -   A form for reservation details, using `react-hook-form` and `zod` for validation. The form fields will include:
        -   `customerName`: Text input, required.
        -   `customerEmail`: Email input, required.
        -   `customerPhone`: Text input, required.
        -   `reservationDate`: Date picker, required.
        -   `reservationTime`: Time picker, required (e.g., dropdown with 30-minute intervals).
        -   `numberOfGuests`: Number input, required, minimum 1.
        -   `specialRequests`: Textarea, optional.
    -   The form will use the `useCreateReservation` hook from `useReservations.ts`.
    -   On successful submission, display a success message (e.g., a toast notification) and clear the form.
    -   On error, display an error message.
    -   Submit button: "Confirm Reservation" with `Primary CTA` styling.

### `frontend/src/pages/admin/AdminReservationsPage.tsx`
This page provides an administrative interface for viewing and managing all reservations. It will be wrapped in the `AdminLayout` component from `admin-portal`.

**Structure:**
-   **Header Section:**
    -   `h1` with `text-3xl font-bold text-gray-800 mb-6` displaying "Manage Reservations".
-   **Filter Section:**
    -   Date range pickers (start date, end date) to filter reservations. These will update the `startDate` and `endDate` parameters passed to `useReservations`.
    -   A "Filter" button.
-   **Reservations Table:**
    -   A table displaying all reservations fetched using `useReservations`.
    -   Table columns: `ID`, `Customer Name`, `Email`, `Phone`, `Date`, `Time`, `Guests`, `Special Requests`, `Status`, `Actions`.
    -   Each row will display reservation details.
    -   The `Status` column will have a dropdown or buttons to update the reservation status (e.g., PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW) using `useUpdateReservationStatus`.
    -   An "Edit" button (if more detailed editing is needed, though status update is primary).
    -   A "Delete" button for each reservation, using `useDeleteReservation`.
    -   Loading state: Display a loading spinner or message when fetching data.
    -   Error state: Display an error message if fetching fails.


---

## Ordering & Checkout UI

**Name:** `order-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/admin/AdminOrdersPage.tsx` — Admin interface for viewing all customer orders and updating their status, consuming `useAllOrders` and `useUpdateOrderStatus` from `useOrders.ts`.
- `frontend/src/pages/OrderConfirmationPage.tsx` — Public page displaying a summary of a successfully placed order and its current status, consuming `useOrderById` from `useOrders.ts`.
- `frontend/src/pages/ProfilePage.tsx` — Customer profile page showing personal details and a complete order history, consuming `useAuth` from `authentication-ui` and `useOrdersByCurrentUser` from `useOrders.ts`.
- `frontend/src/hooks/useOrders.ts` — React Query hook for creating and managing order data, providing mutations for order creation, cancellation, and status updates, and queries for fetching orders by user or all orders.
- `frontend/src/services/orderService.ts` — Frontend service for all order-related API calls, including creating orders, fetching user-specific orders, fetching all orders for admin, and updating/cancelling orders.
- `frontend/src/types/order.ts` — Generated from the backend API contract — defines TypeScript types for orders and order items.
- `frontend/src/context/CartContext.tsx` — React context for managing the state of the customer's shopping cart, providing functions to add, remove, update, and retrieve cart items.
- `frontend/src/services/paymentService.ts` — Frontend service for payment-related API calls, specifically for initiating and verifying Razorpay payments.
- `frontend/src/types/payment.ts` — Generated from the backend API contract — defines TypeScript types for payment processing.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#36454F] text-white
- Primary CTA: bg-[#CC5500] hover:bg-[#A34300] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#CC5500]
- Section bg: bg-white (odd sections) / bg-gray-50 (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed
- Admin Table Header: bg-gray-200 text-gray-700 font-semibold

## Feature Overview: Ordering & Checkout UI
This feature provides the complete user interface for customers to manage their shopping cart, proceed through checkout, view order confirmations, and review their order history. It also includes an administrative interface for managing all customer orders. The UI integrates with the `order-backend` and `payment-backend` features for data persistence and transaction processing, and with `menu-ui` for menu item details. Authentication is handled by `authentication-ui`.

## Data Models (`frontend/src/types/order.ts`, `frontend/src/types/payment.ts`)
These files define the TypeScript interfaces that mirror the backend DTOs for orders and payments. They ensure type safety and consistency across the frontend application. The `OrderResponse` and `CreateOrderRequest` types, along with `OrderItemRequest` and `OrderItemResponse`, are derived directly from the `order-backend-api` contracts. Similarly, `PaymentOrderResponse` and `PaymentVerificationRequest` are derived from `payment-backend` contracts.

## Cart Management (`frontend/src/context/CartContext.tsx`)
`CartContext.tsx` establishes a React Context for managing the customer's shopping cart state. It provides the following public functions:
1.  `addToCart(item: MenuItemDto, quantity: number)`: Adds a `MenuItemDto` (from `menu-ui`) to the cart. If the item is already in the cart, its quantity is updated. The cart state is stored in local storage to persist across sessions.
2.  `removeFromCart(menuItemId: string)`: Removes an item from the cart based on its `menuItemId`.
3.  `updateItemQuantity(menuItemId: string, quantity: number)`: Updates the quantity of a specific item in the cart. If `quantity` is 0 or less, the item is removed.
4.  `clearCart()`: Empties the entire cart.
5.  `getCartTotal(): number`: Calculates and returns the total price of all items currently in the cart.
6.  `getCartItems(): CartItem[]`: Returns the current list of items in the cart, where `CartItem` is `{ menuItem: MenuItemDto, quantity: number }`.

Components needing cart functionality will consume this context using `useContext(CartContext)`.

## API Services (`frontend/src/services/orderService.ts`, `frontend/src/services/paymentService.ts`)
These services encapsulate all direct API calls to the backend, using the `axios` instance from `frontend/src/api/client.ts` which handles authentication tokens.

### `orderService.ts`
-   `createOrder(orderData: CreateOrderRequest): Promise<OrderResponse>`: Sends a `POST` request to `/api/v1/orders` to create a new order. The `orderData` includes `orderItems`, `deliveryAddress`, `contactPhone`, and `notes`.
-   `getOrdersByCurrentUser(): Promise<OrderResponse[]>`: Sends a `GET` request to `/api/v1/orders` to retrieve all orders for the currently authenticated user.
-   `getOrderById(orderId: string): Promise<OrderResponse>`: Sends a `GET` request to `/api/v1/orders/{orderId}` to fetch a specific order.
-   `cancelOrder(orderId: string): Promise<OrderResponse>`: Sends a `PUT` request to `/api/v1/orders/{orderId}/cancel` to change an order's status to `CANCELLED`.
-   `getAllOrders(): Promise<OrderResponse[]>`: Sends a `GET` request to `/api/v1/admin/orders` to retrieve all orders (admin access only).
-   `updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderResponse>`: Sends a `PUT` request to `/api/v1/admin/orders/{orderId}/status` to update an order's status (admin access only).

### `paymentService.ts`
-   `initiatePayment(orderId: string, amount: number): Promise<PaymentOrderResponse>`: Sends a `POST` request to `/api/v1/payments/initiate` to initiate a payment. Returns Razorpay order details.
-   `verifyPayment(verificationData: PaymentVerificationRequest): Promise<string>`: Sends a `POST` request to `/api/v1/payments/verify` to verify the payment signature after a successful Razorpay transaction. Returns a success message or throws an error.

## React Hooks (`frontend/src/hooks/useOrders.ts`)
This file provides React Query hooks that abstract the `orderService` calls, managing loading states, error handling, and data caching. These hooks are consumed by pages and components.
-   `useCreateOrder()`: Returns a mutation hook for creating a new order. On success, it invalidates relevant order queries.
-   `useOrdersByCurrentUser()`: Returns a query hook for fetching orders associated with the logged-in user.
-   `useOrderById(orderId: string)`: Returns a query hook for fetching a single order by its ID.
-   `useCancelOrder()`: Returns a mutation hook for cancelling an order. On success, it invalidates the specific order query and the current user's orders query.
-   `useAllOrders()`: Returns a query hook for fetching all orders, intended for admin use.
-   `useUpdateOrderStatus()`: Returns a mutation hook for updating an order's status, intended for admin use. On success, it invalidates the specific order query and the all orders query.

## Customer-Facing Pages

### Order Confirmation Page (`frontend/src/pages/OrderConfirmationPage.tsx`)
This page displays a summary of a successfully placed order. It wraps its content in `<Layout>` from `core-ui`.

**Sections:**
1.  **Hero Section**: A full-width section with a background image (e.g., `url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80)`) with a `bg-black bg-opacity-50` overlay. Contains a `h1` with `text-4xl md:text-6xl font-bold text-white` displaying "Your Culinary Journey Confirmed!" and a subheadline "Thank you for your order at Yeti - The Himalayan Kitchen, Baner. Your adventure begins now."
2.  **Order Summary Section**: Uses `<section className="py-16 px-4"><div className="max-w-7xl mx-auto">`. Displays the order details fetched using `useOrderById` (retrieving `orderId` from URL parameters). It shows the `orderId`, `orderDate`, `totalAmount`, `status`, `deliveryAddress`, `contactPhone`, `notes`, and a list of `orderItems` (displaying `menuItemName`, `quantity`, `priceAtOrder`). Each item is presented in a `Card` style. The status should be highlighted using appropriate colors (e.g., `text-green-600` for 'CONFIRMED', `text-yellow-600` for 'PENDING').
3.  **Next Steps Section**: Provides a call to action, such as a button to "Explore More of Our Menu" (linking to `/menu`) using the `Primary CTA` style, and a link to "View Your Order History" (linking to `/profile`) using a `Brand text accent` style.

### Profile Page (`frontend/src/pages/ProfilePage.tsx`)
This page allows authenticated customers to view their personal details and a history of their orders. It wraps its content in `<Layout>` from `core-ui`.

**Sections:**
1.  **Hero Section**: A full-width section with a background image (e.g., `url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)`) with a `bg-black bg-opacity-50` overlay. Contains a `h1` with `text-4xl md:text-6xl font-bold text-white` displaying "Your Himalayan Profile" and a subheadline "Manage your details and explore your past culinary adventures at Yeti - The Himalayan Kitchen, Baner."
2.  **Profile Details Section**: Uses `<section className="py-16 px-4"><div className="max-w-7xl mx-auto">`. Displays the user's email (from `useAuth`). Placeholder for future personal details editing. Uses `Card` style for display.
3.  **Order History Section**: Uses `<section className="py-16 px-4 bg-gray-50"><div className="max-w-7xl mx-auto">`. Displays a list of orders fetched using `useOrdersByCurrentUser`. Each order is presented in a `Card` style, showing `orderDate`, `totalAmount`, `status`, and a button to "View Details" (linking to `/order-confirmation/{orderId}`). Orders should be sorted by `orderDate` in descending order. The status should be highlighted.

## Admin-Facing Page

### Admin Orders Page (`frontend/src/pages/admin/AdminOrdersPage.tsx`)
This page provides administrators with a comprehensive view of all customer orders and the ability to update their statuses. It wraps its content in `<AdminLayout>` from `admin-portal`.

**Sections:**
1.  **Header Section**: Contains a `h1` with `text-3xl font-bold text-gray-800` displaying "Manage Customer Orders".
2.  **Orders Table Section**: Uses `<section className="py-8 px-4"><div className="max-w-7xl mx-auto">`. Displays a sortable and filterable table of all orders fetched using `useAllOrders`. The table columns include `orderId`, `userId`, `orderDate`, `totalAmount`, `deliveryAddress`, `contactPhone`, `status`, and "Actions".
    -   The `status` column should be an editable dropdown (e.g., `<select>`) allowing administrators to change the `OrderStatus` using `useUpdateOrderStatus`. The dropdown options should be `PENDING`, `CONFIRMED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`.
    -   The "Actions" column includes a button to "View Details" (linking to `/admin/orders/{orderId}`) and potentially a "Cancel Order" button using `useCancelOrder`.
    -   The table header uses `Admin Table Header` style.

## Inter-file Wiring
-   `AdminOrdersPage.tsx`, `OrderConfirmationPage.tsx`, and `ProfilePage.tsx` all import and utilize hooks from `frontend/src/hooks/useOrders.ts`.
-   `frontend/src/hooks/useOrders.ts` imports and calls functions from `frontend/src/services/orderService.ts`.
-   `frontend/src/services/orderService.ts` and `frontend/src/services/paymentService.ts` both import and use the `api` client from `frontend/src/api/client.ts`.
-   `frontend/src/context/CartContext.tsx` imports `MenuItemDto` from `frontend/src/types/menu.ts` (from `menu-ui`) to define its `CartItem` structure.
-   `ProfilePage.tsx` imports and uses `useAuth` from `authentication-ui` to display user details.
-   `OrderConfirmationPage.tsx` and `ProfilePage.tsx` are wrapped in `<Layout>` from `core-ui`.
-   `AdminOrdersPage.tsx` is wrapped in `<AdminLayout>` from `admin-portal`.


---

## Blog UI

**Name:** `blog-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/BlogPage.tsx` — Public page displaying a grid or list of all blog posts.
- `frontend/src/pages/BlogPostPage.tsx` — Public page displaying the full content of a single blog post.
- `frontend/src/pages/admin/AdminBlogPage.tsx` — Admin interface for creating, editing, and deleting blog posts.
- `frontend/src/hooks/useBlog.ts` — React Query hook for fetching and managing blog post data, exposing useBlogPosts(), useBlogPost(id), useCreateBlogPost(), useUpdateBlogPost(), and useDeleteBlogPost().
- `frontend/src/services/blogService.ts` — Service layer for blog-related API calls, providing getAllBlogPosts(), getBlogPostById(id), createBlogPost(post), updateBlogPost(id, post), and deleteBlogPost(id).
- `frontend/src/types/blog.ts` — Generated from the backend API contract — defines TypeScript types and interfaces for blog posts.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A2B3C] text-white
- Primary CTA: bg-[#FF9933] hover:bg-[#E68A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#FF9933]
- Section bg: bg-white (odd sections) / bg-[#F5F5F5] (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-gray-700 leading-relaxed

## Overview
This feature implements the user interface for the blog functionality, allowing public users to browse blog posts and administrators to manage them. It consists of TypeScript types, a frontend service for API interaction, React Query hooks for data management, and three React pages: a public list of blog posts, a public detail view for a single blog post, and an administrative interface for CRUD operations on blog posts.

## `frontend/src/types/blog.ts`
This file defines the TypeScript interfaces for blog post data, mirroring the `BlogPostDto` from the `blog-backend` feature. It will export the `BlogPostDto` interface and a `CreateUpdateBlogPostDto` interface for data sent during creation or update operations.

```

typescript
export interface BlogPostDto {
  id: string;
  title: string;
  content: string;
  author: string;
  publicationDate: string; // ISO 8601 string, e.g., '2023-10-27T10:00:00'
  imageUrl: string;
}

// For creating or updating a blog post, 'id' is omitted as it's generated by the backend or passed in the URL.
export interface CreateUpdateBlogPostDto extends Omit<BlogPostDto, 'id'> {}


```

## `frontend/src/services/blogService.ts`
This service handles all direct API calls related to blog posts. It uses the `axios` instance from `frontend/src/api/client.ts` to communicate with the `blog-backend` endpoints. All methods return Promises resolving to `BlogPostDto` or `void`.

### Public Functions:
1.  **`getAllBlogPosts(): Promise<BlogPostDto[]>`**
    *   **Logic**: Makes a GET request to `/api/v1/blog` to fetch all blog posts.
    *   **Error Cases**: Throws `Error` if the API call fails.
2.  **`getBlogPostById(id: string): Promise<BlogPostDto>`**
    *   **Logic**: Makes a GET request to `/api/v1/blog/{id}` to fetch a single blog post by its ID.
    *   **Error Cases**: Throws `Error` if the API call fails or the post is not found (404).
3.  **`createBlogPost(post: CreateUpdateBlogPostDto): Promise<BlogPostDto>`**
    *   **Logic**: Makes a POST request to `/api/v1/admin/blog` with the `CreateUpdateBlogPostDto` as the request body. The backend will generate the `id` and `createdAt`/`updatedAt`.
    *   **Error Cases**: Throws `Error` if the API call fails (e.g., 400 Bad Request).
4.  **`updateBlogPost(id: string, post: CreateUpdateBlogPostDto): Promise<BlogPostDto>`**
    *   **Logic**: Makes a PUT request to `/api/v1/admin/blog/{id}` with the `CreateUpdateBlogPostDto` as the request body. The `id` in the path specifies which blog post to update.
    *   **Error Cases**: Throws `Error` if the API call fails (e.g., 400 Bad Request, 404 Not Found).
5.  **`deleteBlogPost(id: string): Promise<void>`**
    *   **Logic**: Makes a DELETE request to `/api/v1/admin/blog/{id}` to remove a blog post.
    *   **Error Cases**: Throws `Error` if the API call fails (e.g., 404 Not Found).

## `frontend/src/hooks/useBlog.ts`
This file provides React Query hooks for managing blog post data, abstracting API calls and providing caching, loading states, and mutation capabilities. It depends on `blogService.ts` for actual API interaction.

### Public Functions:
1.  **`useBlogPosts(): UseQueryResult<BlogPostDto[], Error>`**
    *   **Logic**: Fetches all blog posts using `blogService.getAllBlogPosts()`. Caches results with React Query.
2.  **`useBlogPost(id: string): UseQueryResult<BlogPostDto, Error>`**
    *   **Logic**: Fetches a single blog post by ID using `blogService.getBlogPostById(id)`. Caches results.
3.  **`useCreateBlogPost(): UseMutationResult<BlogPostDto, Error, CreateUpdateBlogPostDto>`**
    *   **Logic**: Provides a mutation function to create a new blog post using `blogService.createBlogPost()`. On success, invalidates the `blogPosts` query to refetch the list.
4.  **`useUpdateBlogPost(): UseMutationResult<BlogPostDto, Error, { id: string, post: CreateUpdateBlogPostDto }>`**
    *   **Logic**: Provides a mutation function to update an existing blog post using `blogService.updateBlogPost()`. On success, invalidates both the `blogPosts` query and the specific `blogPost` query for the updated ID.
5.  **`useDeleteBlogPost(): UseMutationResult<void, Error, string>`**
    *   **Logic**: Provides a mutation function to delete a blog post using `blogService.deleteBlogPost()`. On success, invalidates the `blogPosts` query.

## `frontend/src/pages/BlogPage.tsx`
This page displays a public list of all blog posts in an immersive and authentic layout, reflecting the Himalayan theme. It uses the `Layout` component from `core-ui` for consistent navigation and footer.

### Structure and Content:
1.  **Layout**: Wraps content in `<Layout>`. Uses `useBlogPosts()` to fetch data.
2.  **Hero Section**: 
    *   `className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)' }}`
    *   Overlay: `<div className="absolute inset-0 bg-black bg-opacity-50" />`
    *   Content: Centered `div` with `Hero h1` style: `<h1>Journey Through Our Stories</h1>` and a subheadline: `<p className="text-xl text-white mt-4">Discover the tales and traditions behind Yeti - The Himalayan Kitchen.</p>`
3.  **Blog Post Grid Section**: 
    *   `Section container` style.
    *   Heading: `<h2>Our Latest Adventures</h2>` (text-3xl md:text-4xl font-bold text-[#1A2B3C] mb-8 text-center)
    *   Grid: Displays `BlogPostDto` items in a responsive grid (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`). Each card uses `Card` design token.
    *   Each blog post card should display `imageUrl`, `title`, a truncated `content` (excerpt), `author`, and `publicationDate`. A "Read More" button (Primary CTA style) links to `BlogPostPage` for the specific post (`/blog/{id}`).
    *   Loading/Error states: Display appropriate messages using `isLoading` and `isError` from `useBlogPosts`.

## `frontend/src/pages/BlogPostPage.tsx`
This page displays the full content of a single blog post, providing a rich reading experience. It uses the `Layout` component from `core-ui`.

### Structure and Content:
1.  **Layout**: Wraps content in `<Layout>`. Uses `useBlogPost(id)` to fetch data, where `id` is extracted from the URL parameters.
2.  **Blog Post Content Section**: 
    *   `Section container` style.
    *   Conditional rendering: If `isLoading`, display a loading spinner. If `isError` or `!blogPost`, display a "Blog post not found" message.
    *   Once loaded, display:
        *   `imageUrl` (full width, e.g., `w-full h-96 object-cover rounded-lg mb-8`)
        *   `title` (text-4xl font-bold text-[#1A2B3C] mb-4)
        *   `author` and `publicationDate` (text-gray-600 text-sm mb-6)
        *   `content` (rich text, using `Body` style, e.g., `prose lg:prose-xl max-w-none` for styling if a rich text editor is used, otherwise simple `<p>` tags).
    *   Back button: A button (e.g., `text-[#FF9933] hover:underline`) to navigate back to `/blog`.

## `frontend/src/pages/admin/AdminBlogPage.tsx`
This page provides an administrative interface for managing blog posts, allowing authenticated administrators to create, view, edit, and delete blog entries. It uses the `AdminLayout` component from `admin-portal`.

### Structure and Content:
1.  **Layout**: Wraps content in `<AdminLayout>`. Uses `useBlogPosts()`, `useCreateBlogPost()`, `useUpdateBlogPost()`, and `useDeleteBlogPost()`.
2.  **Header Section**: 
    *   Heading: `<h1>Manage Blog Posts</h1>` (text-3xl font-bold text-[#1A2B3C])
    *   "Add New Blog Post" button (Primary CTA style) that triggers a modal or navigates to a form for creating a new post.
3.  **Blog Post List Table**: 
    *   Displays all blog posts in a sortable, filterable table.
    *   Columns: `Title`, `Author`, `Publication Date`, `Image URL`, `Actions`.
    *   Each row includes buttons for "Edit" and "Delete" for the respective blog post.
    *   Loading/Error states: Display appropriate messages.
4.  **Create/Edit Blog Post Form (Modal/Drawer)**:
    *   Triggered by "Add New Blog Post" or "Edit" buttons.
    *   Uses `react-hook-form` with `zod` for validation based on `CreateUpdateBlogPostDto`.
    *   Form fields:
        *   `title`: `z.string().min(1, 'Title is required')`
        *   `author`: `z.string().min(1, 'Author is required')`
        *   `content`: `z.string().min(1, 'Content is required')`
        *   `imageUrl`: `z.string().url('Must be a valid URL').min(1, 'Image URL is required')`
        *   `publicationDate`: `z.string().min(1, 'Publication date is required')` (for date picker, format as ISO string)
    *   Submission: Calls `useCreateBlogPost().mutate()` or `useUpdateBlogPost().mutate()`.
    *   Error handling: Display form errors and API errors.

### Zod Schema for Create/Update:
```

typescript
import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  publicationDate: z.string().min(1, 'Publication date is required'), // Expects ISO string
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;


```

### Inter-file Wiring:
- `BlogPage.tsx` and `BlogPostPage.tsx` import and use `useBlog.ts` hooks.
- `AdminBlogPage.tsx` imports and uses `useBlog.ts` hooks.
- `useBlog.ts` imports and calls functions from `blogService.ts`.
- `blogService.ts` imports `BlogPostDto` and `CreateUpdateBlogPostDto` from `blog.ts` and uses the `axios` instance from `frontend/src/api/client.ts`.
- `BlogPage.tsx` and `BlogPostPage.tsx` are wrapped by `<Layout>` from `core-ui`.
- `AdminBlogPage.tsx` is wrapped by `<AdminLayout>` from `admin-portal`.


---

## Testimonials UI

**Name:** `testimonial-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/TestimonialsSection.tsx` — COMPONENT layer — displays a list of approved customer testimonials on public-facing pages, such as the homepage.
- `frontend/src/pages/admin/AdminTestimonialsPage.tsx` — PAGE layer — provides the administrative interface for viewing, creating, updating, approving, and deleting customer testimonials.
- `frontend/src/hooks/useTestimonials.ts` — HOOK layer — provides React Query hooks for fetching and mutating testimonial data, abstracting API calls for components.
- `frontend/src/services/testimonialService.ts` — SERVICE layer — handles all API calls related to testimonials, including fetching approved testimonials for public display and full CRUD for admin.
- `frontend/src/types/testimonial.ts` — Generated from the backend API contract — defines the TypeScript interface for a testimonial.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#2c3e50] text-white
- Primary CTA: bg-[#f4c430] hover:bg-[#e0b02a] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: bg-[#8B4513] hover:bg-[#7a3b10] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#f4c430]
- Section bg: bg-white (odd sections) / bg-[#f5f5f5] (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#4a4a4a] leading-relaxed
- Testimonial Card Background: bg-white shadow-lg rounded-lg p-6
- Testimonial Text: text-gray-700 italic
- Testimonial Author: font-semibold text-[#2c3e50]

This `testimonial-ui` feature provides both public-facing display of approved customer testimonials and an administrative interface for full CRUD operations on all testimonials. It consists of a type definition file, a service for API interactions, a set of React Query hooks, a reusable component for public display, and an admin page.

### 1. `frontend/src/types/testimonial.ts`
This file defines the TypeScript interfaces for `Testimonial`, `CreateTestimonialRequest`, and `UpdateTestimonialRequest`. These types are derived directly from the `TestimonialDto` data shape provided by the `testimonial-backend` feature, ensuring type safety across the frontend application. The `id` field will be a `string` (representing UUIDs), `authorName` and `content` will be `string`, `rating` will be `number` (integer 1-5), `createdAt` will be `string` (representing `java.time.LocalDateTime`), and `approved` will be `boolean`.

### 2. `frontend/src/services/testimonialService.ts`
This service file encapsulates all direct API calls to the `testimonial-backend`. It uses the `client` (an Axios instance) from `@/api/client.ts` to make HTTP requests. All functions return `Promise<Testimonial[]>` or `Promise<Testimonial>` or `Promise<void>`.

- **`getAllApprovedTestimonials(): Promise<Testimonial[]>`**
  - Calls `GET /api/v1/testimonials` to fetch only approved testimonials for public display.
- **`getAllTestimonials(): Promise<Testimonial[]>`**
  - Calls `GET /api/v1/admin/testimonials` to fetch all testimonials (approved and unapproved) for the admin interface.
- **`getTestimonialById(id: string): Promise<Testimonial>`**
  - Calls `GET /api/v1/admin/testimonials/{id}` to retrieve a single testimonial by its ID.
- **`createTestimonial(testimonial: CreateTestimonialRequest): Promise<Testimonial>`**
  - Calls `POST /api/v1/admin/testimonials` with the `CreateTestimonialRequest` body to add a new testimonial.
- **`updateTestimonial(id: string, testimonial: UpdateTestimonialRequest): Promise<Testimonial>`**
  - Calls `PUT /api/v1/admin/testimonials/{id}` with the `UpdateTestimonialRequest` body to modify an existing testimonial.
- **`approveTestimonial(id: string): Promise<Testimonial>`**
  - Calls `PUT /api/v1/admin/testimonials/{id}/approve` to change a testimonial's status to approved.
- **`deleteTestimonial(id: string): Promise<void>`**
  - Calls `DELETE /api/v1/admin/testimonials/{id}` to remove a testimonial.

### 3. `frontend/src/hooks/useTestimonials.ts`
This file provides React Query hooks that abstract the `testimonialService` functions, providing caching, loading states, and error handling for components. Each hook invalidates relevant queries on successful mutations to ensure data freshness.

- **`useAllApprovedTestimonials(): UseQueryResult<Testimonial[], Error>`**
  - Fetches approved testimonials using `testimonialService.getAllApprovedTestimonials`.
- **`useAllTestimonials(): UseQueryResult<Testimonial[], Error>`**
  - Fetches all testimonials using `testimonialService.getAllTestimonials`.
- **`useTestimonial(id: string): UseQueryResult<Testimonial, Error>`**
  - Fetches a single testimonial by ID using `testimonialService.getTestimonialById`. Enabled only if `id` is provided.
- **`useCreateTestimonial(): UseMutationResult<Testimonial, Error, CreateTestimonialRequest>`**
  - Mutates to create a testimonial using `testimonialService.createTestimonial`. Invalidates `testimonials` and `approvedTestimonials` queries on success.
- **`useUpdateTestimonial(): UseMutationResult<Testimonial, Error, { id: string, testimonial: UpdateTestimonialRequest }>`**
  - Mutates to update a testimonial using `testimonialService.updateTestimonial`. Invalidates `testimonials` and `approvedTestimonials` queries on success.
- **`useApproveTestimonial(): UseMutationResult<Testimonial, Error, string>`**
  - Mutates to approve a testimonial using `testimonialService.approveTestimonial`. Invalidates `testimonials` and `approvedTestimonials` queries on success.
- **`useDeleteTestimonial(): UseMutationResult<void, Error, string>`**
  - Mutates to delete a testimonial using `testimonialService.deleteTestimonial`. Invalidates `testimonials` and `approvedTestimonials` queries on success.

### 4. `frontend/src/components/TestimonialsSection.tsx`
This component is responsible for displaying a visually appealing section of approved customer testimonials on public pages, such as the homepage. It will utilize the `useAllApprovedTestimonials` hook to fetch data.

- **Structure and Content:**
  - The component will be wrapped in a section container using the `Section container` design token.
  - It will feature a prominent heading like "Hear From Our Adventurous Guests" and a sub-headline, both styled with appropriate text colors and sizes from the design tokens.
  - Testimonials will be displayed in a grid layout, with each testimonial rendered within a card using the `Testimonial Card Background` design token.
  - Each card will show the testimonial `content` (italicized, `Testimonial Text`), `rating` (represented by star icons using the `Brand text accent` color), and `authorName` (`Testimonial Author`).
  - Loading and error states from the hook should be handled gracefully.

### 5. `frontend/src/pages/admin/AdminTestimonialsPage.tsx`
This page provides the full administrative interface for managing testimonials. It will be accessible only to authenticated `ADMIN` users and will be wrapped in the `<AdminLayout>` component from the `admin-portal` feature. It will use the `useAllTestimonials`, `useCreateTestimonial`, `useUpdateTestimonial`, `useApproveTestimonial`, and `useDeleteTestimonial` hooks.

- **Structure and Content:**
  - The page content will be enclosed within `<AdminLayout>`.
  - A main heading "Manage Testimonials" will be displayed.
  - A table will list all testimonials, including their `id`, `authorName`, `content`, `rating`, `createdAt`, and `approved` status. Each row will include action buttons for "Edit", "Approve" (if not approved), "Unapprove" (if approved), and "Delete".
  - Functionality for creating new testimonials will be provided, likely through a modal or dedicated form. This form will use `react-hook-form` with `zod` for validation. The `zod` schema for `CreateTestimonialRequest` will ensure `authorName` and `content` are `z.string().min(1)`, `rating` is `z.coerce.number().min(1).max(5)`, and `approved` is `z.boolean().optional()`.
  - Similarly, an edit form (also using `react-hook-form` and `zod` for `UpdateTestimonialRequest`) will be implemented for updating existing testimonials.
  - All buttons and form elements will adhere to the `Primary CTA` and `Secondary CTA` design tokens for consistent styling.
  - Loading, error, and success states for all CRUD operations should be clearly communicated to the user.


---

## Infrastructure

**Name:** `infrastructure`  
**Type:** INFRA  
**Change required:** true

**Files in this feature:**
- `.github/workflows/deploy.yml`

**Feature Instruction:**

_Not enriched (INFRA or skipped)._

---

