🧠 AI-Powered Documentation Generator
An intelligent web application that automatically generates accurate, comprehensive, and context-aware API documentation directly from your codebase. Built on a modern microservice architecture, it integrates with GitHub, performs deep code analysis, and uses LLMs and semantic search to produce developer-grade docs — without the hallucinations.

🚀 Key Features
🔗 GitHub Integration
Securely connect your GitHub account to ingest code from both public and private repositories with ease.

🌲 Intelligent Code Parsing
Leverages Tree-sitter to generate an Abstract Syntax Tree (AST), enabling a precise and structural understanding of your codebase.

🧩 Semantic Code Chunking
Breaks code into meaningful units — such as functions, classes, and methods — instead of arbitrary lines, enhancing the LLM’s comprehension and reducing irrelevant context.

📚 Vector Database with Qdrant
Uses Qdrant to store code embeddings and metadata, enabling high-speed, semantically relevant retrieval of source code during documentation generation.

🛡️ Hallucination Mitigation
Combines Retrieval Augmented Generation (RAG) with:

Precision prompt engineering

A verifier agent

Tight grounding in real source code
To ensure factual, traceable documentation and minimize hallucination risks.

🧠 How It Works
Connect GitHub → Pulls the repo and parses it using Tree-sitter.

Parse & Chunk Code → Creates AST and breaks code into logical chunks.

Embed & Store → Embeddings of the code chunks are stored in Qdrant.

Retrieve & Generate → When documentation is requested, relevant chunks are retrieved semantically and passed to the LLM in a RAG pipeline.

Verify Output → A verifier agent ensures the generated docs are grounded in the actual code.
