AI-Powered Documentation Generator
This project is an intelligent web application designed to automatically generate accurate and comprehensive API documentation directly from a codebase. It leverages a modern microservice architecture, a vector database for efficient semantic search, and a large language model (LLM) for documentation generation. By implementing a sophisticated Retrieval Augmented Generation (RAG) pipeline, the system significantly reduces the risk of AI hallucination, ensuring that all generated documentation is grounded in the actual source code.

Key Features
GitHub Integration: Securely connect your GitHub account to ingest code from private and public repositories.

Intelligent Code Parsing: Utilizes the Tree-sitter parser to create an Abstract Syntax Tree (AST), enabling a deep, structural understanding of the code.

Semantic Code Chunking: Code is intelligently broken down into meaningful, context-rich chunks (e.g., functions, classes, methods) rather than arbitrary lines.

Vector Database (Qdrant): Stores code embeddings and metadata to allow for lightning-fast, semantic similarity searches.

Hallucination Mitigation: Employs advanced Retrieval Augmented Generation (RAG) techniques, precise prompt engineering, and a verifier agent to ensure documentation is factual and directly derived from the code.

