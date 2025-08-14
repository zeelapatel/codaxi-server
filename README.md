# Codaxi - Server 🚀

[![GitHub Repo](https://img.shields.io/badge/github-codaxi--server-blue?logo=github)](https://github.com/zeelapatel/codaxi-server.git)

Backend server for Codaxi — an AI-powered API documentation generator that analyzes your codebase and creates rich, contextual docs effortlessly.

---

## Table of Contents
- 🎯 [Features](#-features)
- 🛠️ [Tech Stack](#-tech-stack)
- ⚙️ [Requirements](#-requirements)
- 🚀 [Quickstart](#-quickstart)
- 🔧 [Configuration](#-configuration)
- 📡 [API Endpoints](#-api-endpoints)
- 📁 [Folder Structure](#-folder-structure)
- 🤝 [Contributing](#-contributing)
- 📄 [License](#-license)
- 🙏 [Acknowledgements](#-acknowledgements)

---

## 🎯 Features
- Analyze project directories to generate file lists, directory trees, and dependency graphs  
- Integrates with OpenAI and ChromaDB for code analysis and embedding  
- Uses Sequelize ORM with PostgreSQL for robust data management  
- Enforces clean architecture with dependency rules via Dependency Cruiser  
- Modular Express.js backend with clear route handlers and service layers  

---

## 🛠️ Tech Stack
- **Node.js** & **Express.js** — Server runtime and web framework  
- **Sequelize** — ORM for PostgreSQL  
- **PostgreSQL** — Relational database  
- **OpenAI API** — AI-powered code understanding  
- **ChromaDB** — Vector database for embeddings  
- **Dependency Cruiser** — Dependency analysis and enforcement  
- **TypeScript** — Type safety and developer experience  

---

## ⚙️ Requirements
- Node.js v16+  
- PostgreSQL 12+  
- Access to OpenAI API (API key)  
- Git  

---

## 🚀 Quickstart

### 1. Clone the repo
```bash
git clone https://github.com/zeelapatel/codaxi-server.git
cd codaxi-server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables  
Create a `.env` file in the root directory (see [Configuration](#-configuration))

### 4. Run database migrations
```bash
npx sequelize-cli db:migrate
```

### 5. Start the server
```bash
npm run start
```

### 6. Run tests
```bash
npm run test
```

---

## 🔧 Configuration

Create a `.env` file with the following variables:

| Variable           | Description                              | Example                  |
|--------------------|------------------------------------------|--------------------------|
| `DATABASE_URL`     | PostgreSQL connection string              | `postgres://user:pass@localhost:5432/codaxi` |
| `OPENAI_API_KEY`   | API key for OpenAI services                | `sk-xxxxxx`              |
| `CHROMA_DB_URL`    | URL for ChromaDB instance (if applicable) | `http://localhost:8000`  |
| `PORT`             | Server listening port                      | `4000`                   |

---

## 📡 API Endpoints (Summary)

| Method | Endpoint                 | Description                          |
|--------|--------------------------|------------------------------------|
| POST   | `/projects/analyze`      | Analyze a project directory         |
| GET    | `/projects/:id`          | Retrieve project analysis results   |
| POST   | `/docs/generate`         | Generate API documentation          |
| ...    | ...                      | ...                                |

*For full API documentation, refer to the `/docs` route or API spec.*

---

## 📁 Folder Structure

```
codaxi-server/
├── src/
│   ├── controllers/        # Route handlers
│   ├── services/           # Business logic (e.g. ProjectAnalysisService)
│   ├── models/             # Sequelize models
│   ├── migrations/         # DB migrations
│   ├── utils/              # Helper functions
│   └── config/             # Configuration files
├── .dependency-cruiser.js  # Dependency rules config
├── .gitignore
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for bug fixes, features, or improvements.  
Make sure to follow the existing code style and write tests for new features.

---

## 📄 License

This project is currently **Unassigned**. Please check the repository for updates on licensing.

---

## 🙏 Acknowledgements

- [OpenAI](https://openai.com) for AI-powered code analysis  
- [ChromaDB](https://www.chromadb.com) for embedding storage  
- [Dependency Cruiser](https://github.com/sverweij/dependency-cruiser) for dependency management  
- Inspired by modern backend best practices and clean architecture principles  

---

Thank you for checking out Codaxi! 🚀  
Happy coding and documenting! 📚✨
