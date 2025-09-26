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
      >\n        {node.type === 'folder' && (\n          <motion.div\n            animate={{ rotate: isExpanded ? 90 : 0 }}\n            transition={{ duration: 0.2 }}\n            className=\"mr-1\"\n          >\n            <ChevronRightIcon className=\"w-4 h-4 text-muted-foreground\" />\n          </motion.div>\n        )}\n        \n        {node.type === 'folder' ? (\n          isExpanded ? (\n            <FolderOpenIcon className=\"w-4 h-4 mr-2 text-blue-500\" />\n          ) : (\n            <FolderIcon className=\"w-4 h-4 mr-2 text-blue-500\" />\n          )\n        ) : (\n          <DocumentIcon className=\"w-4 h-4 mr-2 text-muted-foreground ml-5\" />\n        )}\n        \n        <span className=\"text-sm select-none\">{node.name}</span>\n      </motion.div>\n\n      <AnimatePresence>\n        {isExpanded && hasChildren && (\n          <motion.div\n            initial={{ height: 0, opacity: 0 }}\n            animate={{ height: 'auto', opacity: 1 }}\n            exit={{ height: 0, opacity: 0 }}\n            transition={{ duration: 0.2 }}\n            className=\"overflow-hidden\"\n          >\n            {node.children!.map((child, index) => (\n              <FileTreeNode\n                key={`${child.path}-${index}`}\n                node={child}\n                level={level + 1}\n                onFileSelect={onFileSelect}\n              />\n            ))}\n          </motion.div>\n        )}\n      </AnimatePresence>\n    </div>\n  );\n}\n\nexport function FileTree({ data, onFileSelect }: FileTreeProps) {\n  return (\n    <div className=\"py-2\">\n      {data.map((node, index) => (\n        <FileTreeNode\n          key={`${node.path}-${index}`}\n          node={node}\n          level={0}\n          onFileSelect={onFileSelect}\n        />\n      ))}\n    </div>\n  );\n}"}