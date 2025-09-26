# AI-Powered Code Review Assistant

A production-ready, full-stack AI-powered code review assistant with modern animated UI/UX, comprehensive AI integration, and enterprise-grade features.

## 🚀 Features

### Core Features
- **AI Code Review Engine**: Multi-language analysis with OpenAI and Hugging Face integration
- **Real-time Collaboration**: Live review sessions with AI co-reviewer
- **Multi-Git Provider Support**: GitHub, GitLab, and Bitbucket integration
- **Intelligent Analytics**: Code quality trends and team performance metrics
- **Custom Rule Engine**: Organization-specific coding standards
- **Automated Workflows**: CI/CD integration with pre-deployment checks

### UI/UX Features
- **Animated Dark/Light Mode**: Smooth transitions and theme persistence
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Interactive Dashboard**: Animated cards, charts, and metrics
- **Repository Explorer**: Collapsible file tree with inline AI comments
- **Collaboration Tools**: Live sessions with typing animations
- **Gamification**: Achievement system with animated badges

### Next-Gen AI Features
- **AI Pair Programmer**: Live coding assistance
- **Generative Auto-Patches**: Ready-to-merge pull requests
- **Explain Like I'm Five**: Beginner-friendly code explanations
- **Ethical AI Lens**: Bias and safety detection

## 🏗 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** with Zod validation
- **Socket.IO Client** for real-time features

### Backend
- **Node.js** with Express and TypeScript
- **Prisma ORM** with PostgreSQL
- **Redis** for caching and sessions
- **Socket.IO** for real-time communication
- **OpenAI API** for AI analysis
- **Hugging Face Transformers** for embeddings

### Infrastructure
- **Docker** containerization
- **Kubernetes** orchestration
- **Nginx** reverse proxy
- **PostgreSQL** primary database
- **Redis** cache and message broker

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-code-review-assistant
```

2. **Backend Setup**
```bash
cd backend
cp .env.example .env
# Edit .env with your API keys and configurations
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **Docker Setup (Recommended)**
```bash
cd docker
cp .env.example .env
# Edit .env with your configurations
docker-compose up -d
```

### API Keys Required
- **OpenAI API Key**: For AI code analysis
- **Hugging Face API Key**: For embeddings and transformers
- **GitHub/GitLab/Bitbucket**: For repository integration

## 📦 Docker Deployment

### Development
```bash
cd docker
docker-compose -f docker-compose.yml up -d
```

### Production
```bash
cd docker
docker-compose -f docker-compose.prod.yml up -d
```

## ☸️ Kubernetes Deployment

### Apply Kubernetes manifests
```bash
kubectl apply -f docker/k8s/namespace.yaml
kubectl apply -f docker/k8s/postgres.yaml
kubectl apply -f docker/k8s/redis.yaml
kubectl apply -f docker/k8s/backend.yaml
kubectl apply -f docker/k8s/frontend.yaml
kubectl apply -f docker/k8s/ingress.yaml
```

### Build and push Docker images
```bash
# Backend
docker build -t your-registry/ai-code-review-backend:latest ./backend
docker push your-registry/ai-code-review-backend:latest

# Frontend
docker build -t your-registry/ai-code-review-frontend:latest ./frontend
docker push your-registry/ai-code-review-frontend:latest
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ai_code_review

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Git Providers
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_WEBHOOK_SECRET=your-github-webhook-secret

# Redis
REDIS_URL=redis://localhost:6379
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🏛 Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Backend API   │────│   AI Services   │
│   (React)       │    │   (Node.js)     │    │ (OpenAI/HF)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         │              ┌─────────────────┐              
         │              │   Database      │              
         └──────────────│  (PostgreSQL)   │              
                        └─────────────────┘              
                                │                        
                        ┌─────────────────┐              
                        │     Cache       │              
                        │    (Redis)      │              
                        └─────────────────┘              
```

### Database Schema
- **Users & Organizations**: Multi-tenant user management
- **Repositories & Files**: Git provider integration
- **Reviews & Comments**: AI analysis and human feedback
- **Integrations**: Third-party service connections
- **Analytics**: Performance and quality metrics

## 🛠 Development

### Database Migrations
```bash
cd backend
npx prisma migrate dev --name your-migration-name
npx prisma generate
```

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Generation
```bash
# Generate Prisma client
npx prisma generate

# Database introspection
npx prisma db pull
```

## 🔌 VS Code Extension

The project includes a VS Code extension for inline AI code reviews:

### Installation
1. Open VS Code
2. Install from marketplace or load from `vscode-extension/` directory
3. Configure API endpoint in extension settings

### Features
- Inline AI review comments
- Animated sidebar panel
- Real-time code analysis
- Auto-fix suggestions

## 🚀 Deployment Options

### Cloud Platforms
- **AWS**: EKS, RDS, ElastiCache
- **Google Cloud**: GKE, Cloud SQL, Memory Store
- **Azure**: AKS, Azure Database, Azure Cache
- **DigitalOcean**: Kubernetes, Managed Database

### CI/CD Integration
- GitHub Actions workflows included
- Docker registry integration
- Automated testing and deployment

## 🔐 Security

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Session management with Redis

### API Security
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation with Zod

### Infrastructure Security
- Container security scanning
- Non-root user containers
- Network policies
- TLS/SSL encryption

## 📊 Monitoring

### Health Checks
- Application health endpoints
- Database connectivity checks
- Redis connectivity verification

### Logging
- Structured logging with Winston
- Request/response logging
- Error tracking and reporting

### Metrics
- Application performance metrics
- Database query performance
- API response times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Document API changes
- Follow conventional commits

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Repository Endpoints
- `GET /api/repositories` - List repositories
- `POST /api/repositories` - Connect repository
- `GET /api/repositories/:id` - Get repository details
- `POST /api/repositories/:id/analyze` - Trigger AI analysis

### Review Endpoints
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:id` - Get review details
- `POST /api/reviews/:id/comments` - Add comment

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

2. **Redis Connection Failed**
   - Check Redis is running
   - Verify REDIS_URL in .env
   - Check network connectivity

3. **AI Analysis Failed**
   - Verify OpenAI API key
   - Check Hugging Face API key
   - Monitor API rate limits

4. **Frontend Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 integration
- Hugging Face for transformer models
- The React and Node.js communities
- Contributors and maintainers

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Join our community discussions

---

**Built with ❤️ for developers, by developers**