1. DELETE /events/2 returns 204 and the second call returns 404. Is DELETE still idempotent? Explain with what idempotent means.

Yes, DELETE is still idempotent.

An HTTP method is idempotent if making multiple identical requests has the same intended effect on the server state as making a single request.

State vs. Status Code: Idempotency is determined by the resource state on the server, not by the HTTP response status code.

The Server State: After the first DELETE /events/2, the resource is removed from the database/server. After the second DELETE /events/2, the resource remains deleted. The net effect on the server state is identical.

Response Codes: Returning 204 No Content (or 200 OK) on the first request and 404 Not Found on subsequent requests is standard REST API design.

2. The Vue app on port 5173 calls the API on port 3000. Which program blocks the response when CORS is not configured, and why can curl read it anyway?

The web browser running the Vue application blocks the response from being exposed to JavaScript code.

CORS (Cross-Origin Resource Sharing) is a browser-enforced security mechanism, not a server-side firewall or authentication check.

Web browsers enforce the Same-Origin Policy (SOP) to protect users from malicious sites making unauthorized cross-origin calls.

curl is a command-line client without a browser engine or DOM environment. It does not enforce SOP/CORS rules and outputs whatever payload the server responds with.

3.EventsController never writes new EventsService(). Who creates the service, when, and how many are created?

The NestJS Dependency Injection (DI) Container (the framework runtime).

During application bootstrap/startup, when NestJS builds the module tree, resolves dependencies, and instantiates registered providers.

Exactly one instance by default. Providers in NestJS are singleton-scoped across the application lifecycle unless explicitly configured with Request or Transient scope.

4. A client sends { "title": "Pitch Night", ..., "booked": 50 }. Which line of code refuses it, and what would happen to booked without it?

The request is rejected by configuring NestJS's global ValidationPipe with forbidNonWhitelisted: true:

app.useGlobalPipes(
new ValidationPipe({
whitelist: true,
forbidNonWhitelisted: true, // Throws an exception if unknown fields are present
}),
);

Without whitelist: true, the extra property "booked": 50 would pass into the controller/service body object, creating a Mass Assignment vulnerability where clients can overwrite internal database fields.

With whitelist: true but without forbidNonWhitelisted: true, NestJS would silently strip booked from the incoming payload, but the request itself would succeed without an error.

5. Architectural Placement of the "Not Enough Seats" Rule

The seat availability validation belongs in BookingsService rather than the controller or frontend form due to core software architecture principles:

Domain Integrity & Business Logic Separation:

Checking capacity and enforcing availability rules is domain logic. Services hold business logic, whereas controllers only handle HTTP orchestration (routing, status codes, DTO mapping).

Reusability Across Transport Layers:

If another component needs to create a booking (e.g., a background job processor, CLI tool, or WebSocket event handler), calling BookingsService.create() will consistently enforce seat limits. Putting validation in BookingsController would bypass safety checks for non-HTTP calls.

Security & Single Source of Truth:

Vue form validation is strictly for user experience (UX). Client-side checks can be bypassed using tools like curl or Postman. The server-side service layer must act as the authority.

Concurrency & Database Atomicity:

BookingsService coordinates directly with the database layer (e.g., within transactions or using atomic operations) to evaluate real-time seat availability and prevent race conditions.
