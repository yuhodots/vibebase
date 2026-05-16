"""Domain services.

Services orchestrate business logic by composing repositories and owning
the transaction boundary. API routers should call services instead of
querying the database directly.
"""
