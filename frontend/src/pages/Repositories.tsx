import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  StarIcon,
  EyeIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { FileTree } from '../components/ui/FileTree';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const repositories = [
  {
    id: 1,
    name: 'frontend-app',
    description: 'React TypeScript frontend application',
    language: 'TypeScript',
    stars: 42,
    watchers: 12,
    lastUpdate: '2 hours ago',
    status: 'active'
  },
  {
    id: 2,
    name: 'backend-api',
    description: 'Node.js Express API server',
    language: 'JavaScript',
    stars: 28,
    watchers: 8,
    lastUpdate: '1 day ago',
    status: 'active'
  },
  {
    id: 3,
    name: 'data-service',
    description: 'Python data processing service',
    language: 'Python',
    stars: 15,
    watchers: 5,
    lastUpdate: '3 days ago',
    status: 'archived'
  }
];

const fileTreeData = [
  {
    name: 'src',
    type: 'folder' as const,
    path: '/src',
    children: [
      {
        name: 'components',
        type: 'folder' as const,
        path: '/src/components',
        children: [
          { name: 'Button.tsx', type: 'file' as const, path: '/src/components/Button.tsx' },
          { name: 'Card.tsx', type: 'file' as const, path: '/src/components/Card.tsx' }
        ]
      },
      {
        name: 'pages',
        type: 'folder' as const,
        path: '/src/pages',
        children: [
          { name: 'Dashboard.tsx', type: 'file' as const, path: '/src/pages/Dashboard.tsx' },
          { name: 'Settings.tsx', type: 'file' as const, path: '/src/pages/Settings.tsx' }
        ]
      },
      { name: 'App.tsx', type: 'file' as const, path: '/src/App.tsx' },
      { name: 'index.tsx', type: 'file' as const, path: '/src/index.tsx' }
    ]
  },
  {
    name: 'public',
    type: 'folder' as const,
    path: '/public',
    children: [
      { name: 'index.html', type: 'file' as const, path: '/public/index.html' }
    ]
  },
  { name: 'package.json', type: 'file' as const, path: '/package.json' },
  { name: 'README.md', type: 'file' as const, path: '/README.md' }
];

export function Repositories() {
  const [selectedRepo, setSelectedRepo] = useState(repositories[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRepos = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <FolderIcon className="w-8 h-8 mr-3" />
          Repositories
        </h1>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Repository
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repository List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Repository Cards */}
          <div className="space-y-3">
            {filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedRepo(repo)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedRepo.id === repo.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{repo.name}</h3>
                  <Badge variant={repo.status === 'active' ? 'success' : 'secondary'}>
                    {repo.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{repo.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        repo.language === 'TypeScript' ? 'bg-blue-500' :
                        repo.language === 'JavaScript' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      {repo.language}
                    </span>
                    <span className="flex items-center">
                      <StarIcon className="w-3 h-3 mr-1" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center">
                      <EyeIcon className="w-3 h-3 mr-1" />
                      {repo.watchers}
                    </span>
                  </div>
                  <span>{repo.lastUpdate}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* File Explorer */}
        <AnimatedCard delay={0.3} className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <CodeBracketIcon className="w-5 h-5 mr-2" />
              {selectedRepo.name} - File Explorer
            </h3>
            <Button variant="outline" size="sm">
              Start Review
            </Button>
          </div>
          
          <div className="border border-border rounded-lg p-4 bg-muted/20 max-h-96 overflow-y-auto">
            <FileTree 
              data={fileTreeData} 
              onFileSelect={(path) => console.log('Selected file:', path)}
            />
          </div>
        </AnimatedCard>
      </div>
    </motion.div>
  );
}