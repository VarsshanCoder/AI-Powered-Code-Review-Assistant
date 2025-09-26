import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderIcon, 
  FolderOpenIcon, 
  DocumentIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

interface FileTreeProps {
  data: FileNode[];
  onFileSelect?: (path: string) => void;
}

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  onFileSelect?: (path: string) => void;
}

function FileTreeNode({ node, level, onFileSelect }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect?.(node.path);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.05 }}
        whileHover={{ x: 4, backgroundColor: 'hsl(var(--accent))' }}
        onClick={handleClick}
        className={`flex items-center py-1 px-2 cursor-pointer rounded transition-colors`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {node.type === 'folder' && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="mr-1"
          >
            <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        )}

        {node.type === 'folder' ? (
          isExpanded ? (
            <FolderOpenIcon className="w-4 h-4 mr-2 text-blue-500" />
          ) : (
            <FolderIcon className="w-4 h-4 mr-2 text-blue-500" />
          )
        ) : (
          <DocumentIcon className="w-4 h-4 mr-2 text-muted-foreground ml-5" />
        )}

        <span className="text-sm select-none">{node.name}</span>
      </motion.div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children!.map((child, index) => (
              <FileTreeNode
                key={`${child.path}-${index}`}
                node={child}
                level={level + 1}
                onFileSelect={onFileSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FileTree({ data, onFileSelect }: FileTreeProps) {
  return (
    <div className="py-2">
      {data.map((node, index) => (
        <FileTreeNode
          key={`${node.path}-${index}`}
          node={node}
          level={0}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
}