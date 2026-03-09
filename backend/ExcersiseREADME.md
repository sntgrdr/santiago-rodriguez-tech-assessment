# Overall Approach and Architecture

The system is structured as a Rails API application with two main responsibilities drive the architecture:

# 1 Ingest endpoints

- Normalize and merge incoming data from CRM and HRM systems.

- Deduplicate people records and maintain relationships with their external identities.

# 2 Query endpoints

- Retrieve people records with filtering (email, source, department).

- Return paginated results using Pagy.

# Development Approach

The implementation followed an iterative development workflow, maintaining small pull requests with clearly defined scopes.
Each PR delivered a small, functional improvement to the system, gradually building toward a more complete and cohesive solution. This approach helped ensure that:

- Each change was easy to review and validate.

- Features were introduced incrementally.

- The architecture evolved in a controlled and maintainable way.

# Service-Oriented Design

Business logic is encapsulated in service objects, keeping controllers thin and focused on request handling.

Key services include:

- People::IngestService
Handles ingestion and normalization of a single person record.

- People::BatchIngestService
Handles batch ingestion, delegating each record to IngestService within a transaction.

- People::ExternalIdentitySyncService
Manages external identities, ensuring last_synced_at is updated or created

- People::PayloadStrategies
Implements a Strategy Pattern to normalize payloads coming from different sources.

- People::QueryService
Encapsulates filtering logic and pagination for retrieving people records.

This separation ensures clear responsibilities, easier testing, and better extensibility.

# Key Design Decisions

## Strategy Pattern for Payload Normalization

Different external systems provide data in different formats.
A Strategy Pattern was implemented to isolate source-specific normalization logic.

This allows new sources to be added without modifying the ingestion pipeline — only a new strategy class is required.

## Normalization

Normalization occurs during ingestion to ensure consistent internal data:

Emails are downcased and stripped

String fields are trimmed

Batch normalization is applied in BatchIngestService

This ensures that deduplication and comparisons are reliable.

## Idempotent Ingestion

The ingestion process is designed to be idempotent.

Re-ingesting the same record will update the existing person rather than create duplicates.

External identities are tracked separately per source.

The email attribute for Person and uniquenes of source scoped by external_id in ExternalIdentity are ensured by database-level unique indexes. And validating by these attributes ensures idempotency.

## Batch Processing

Batch ingestion uses database transactions to guarantee consistency.

If any record in the batch fails validation, the entire batch is rolled back, preventing partial writes.

## Deduplication

Deduplication occurs at two levels:

Person

A person is uniquely identified by their email address, which is normalized before lookup.

To prevent race conditions and ensure integrity, a database-level unique index is used.

And the ExternalIdentity model ensures that each source can maintain its own reference to the same person.

## Conflict Resolution

When multiple sources provide information about the same person, predefined source-of-truth rules determine which fields take precedence.

This logic is implemented inside IngestService.

# Performance and Scalability Considerations

Several decisions were made to ensure the system performs efficiently and scales well.

## Batch Ingestion

BatchIngestService processes multiple records inside a single transaction, minimizing database overhead and ensuring atomicity.

## Database Indexes

Indexes are used to optimize lookups:

Unique index on normalized email

Composite index on source + external_id

## Query Optimization

The query service uses includes(:external_identities) to avoid N+1 queries when returning people records.

## Pagination

The API uses Pagy to efficiently paginate large result sets.

## Service-Oriented Architecture

By isolating logic into services, the system is easier to scale, refactor, and test.

## Potential Improvements / Extensions
### Enhanced Normalization

Normalization rules could be expanded to support more sophisticated transformations (for example, handling capitalization or alternate formats).

Additionally, normalization could further leverage the Strategy Pattern, allowing different normalization strategies to be applied depending on the source system.

### Service Structure and Organization

As the number of services grows, the current structure under:

/services/people

could become too dense. With more time, the service layer could be reorganized into subdomains or functional groups to maintain clarity and scalability.

### Integration Testing with External Sources

Once the external systems are better understood (or if new sources are introduced), integration tests could be added to validate the ingestion pipeline using real or simulated external payloads.

This would ensure the system remains reliable as external schemas evolve.

## Background Processing for Large Batches

Batch ingestion could be moved to background jobs (e.g., Sidekiq) to support very large ingestion workloads without blocking API requests.

## Observability and Metrics

Adding structured logging and ingestion metrics would make it easier to monitor:

batch sizes

ingestion failures

source-specific sync activity