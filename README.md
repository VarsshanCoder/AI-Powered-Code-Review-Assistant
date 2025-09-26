# AI-Powered Code Review Assistant

An intelligent system that analyzes code repositories and provides automated AI-driven code reviews with actionable suggestions for improvement.

## 🚀 Features

### Core Capabilities
- **AI-Powered Code Quality Analysis** - Score commits & pull requests based on readability, maintainability, complexity
- **Security Vulnerability Detection** - Detect SQL injection risks, unsafe dependencies, weak cryptography
- **Performance Optimization Suggestions** - Highlight redundant loops, inefficient queries, memory leaks
- **GitHub/GitLab/Bitbucket Integration** - Automatically review PRs and commits with webhook support
- **Custom Rule Engine** - Define organization-specific coding standards
- **Real-Time Collaborative Review** - Multiple developers can join live review sessions

### Next-Gen AI Features
- **AI Pair Programmer Mode** - Real-time AI coding buddy for live refactoring
- **Generative Auto-Patches** - AI generates ready-to-merge patches for critical issues
- **Context-Aware Learning** - AI learns repo style/architecture and adapts suggestions
- **ELI5 Mode** - AI explains issues in simple terms for beginners
- **Code Trend Forecasting** - AI predicts potential problem areas before they become bugs

## 🏗 Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **AI Layer**: OpenAI API + Hugging Face Transformers
- **Frontend**: React.js + TypeScript + Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Real-time**: Socket.IO
- **Deployment**: Docker + Kubernetes ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Environment Setup

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd AI-Powered-Code-Review-Assistant
\`\`\`

2. Set up environment variables:
\`\`\`bash
# Backend (.env)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/code_review_db"
OPENAI_API_KEY="your-openai-api-key"
HUGGINGFACE_API_KEY="your-huggingface-api-key"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
JWT_SECRET="your-jwt-secret"
\`\`\`

### Development Setup

1. **Using Docker (Recommended)**:
\`\`\`bash
npm run docker:up
\`\`\`

2. **Manual Setup**:
\`\`\`bash
# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Setup database
cd ../backend
npm run prisma:migrate
npm run prisma:generate

# Start development servers
npm run dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

## 📁 Project Structure

\`\`\`
AI-Powered-Code-Review-Assistant/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic & AI integration
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Utilities
│   ├── prisma/             # Database schema & migrations
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── store/          # State management
│   └── Dockerfile
├── shared/                 # Shared types & utilities
└── docker-compose.yml      # Development environment
\`\`\`

## 🔧 API Endpoints

### Reviews
- `POST /api/reviews` - Create new review
- `GET /api/reviews` - List reviews
- `GET /api/reviews/:id` - Get review details
- `POST /api/reviews/:id/comments` - Add comment

### AI Analysis
- `POST /api/ai/analyze` - Analyze code
- `POST /api/ai/explain` - Explain issue
- `POST /api/ai/auto-fix` - Generate auto-fix

### Repositories
- `GET /api/repositories` - List repositories
- `POST /api/repositories` - Add repository
- `GET /api/repositories/:id` - Get repository

## 🤖 AI Integration

The system integrates with multiple AI services:

1. **OpenAI GPT-4** - Code analysis, explanations, auto-fixes
2. **Hugging Face CodeBERT** - Code embeddings and similarity
3. **Custom Rule Engine** - Organization-specific patterns

## 🔒 Security Features

- **SAST Scanning** - Static application security testing
- **Secrets Detection** - Prevent exposure of sensitive information
- **Dependency Analysis** - Check for vulnerable packages
- **Custom Security Rules** - Organization-specific security patterns

## 🚀 Deployment

### Docker Production
\`\`\`bash
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### Kubernetes
\`\`\`bash
kubectl apply -f k8s/
\`\`\`

## 📊 Monitoring & Analytics

- Real-time review metrics
- Code quality trends
- Security vulnerability tracking
- Performance optimization insights
- Team collaboration analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community discussions