import { useMemo, useState } from 'react';

interface TreeNodeData {
  __type: 'folder' | 'file';
  name?: string;
  path?: string;
  children?: Record<string, TreeNodeData>;
}

function buildTree(files: Record<string, string>): TreeNodeData {
  const root: TreeNodeData = { __type: 'folder', children: {} };
  Object.keys(files).forEach((path) => {
    const parts = path.split('/');
    let node = root;
    parts.forEach((part, i) => {
      if (!node.children) node.children = {};
      if (i === parts.length - 1) {
        node.children[part] = { __type: 'file', path };
      } else {
        if (!node.children[part]) node.children[part] = { __type: 'folder', name: part, children: {} };
        node = node.children[part];
      }
    });
  });
  return root;
}

function TreeNodeView({
  name,
  node,
  depth = 0,
  selected,
  onSelect,
}: {
  name: string;
  node: TreeNodeData;
  depth?: number;
  selected: string | null;
  onSelect: (path: string) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  const isFile = node.__type === 'file';
  const ext = isFile ? name.split('.').pop() : '';
  const extColor: Record<string, string> = {
    tsx: '#61afef',
    ts: '#3178c6',
    json: '#d19a66',
    css: '#61dafb',
    md: '#98c379',
    mjs: '#e5c07b',
    env: '#c678dd',
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 text-xs py-1 px-1.5 rounded cursor-pointer transition-colors ${
          isFile && selected === node.path ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-400 hover:bg-zinc-700/30 hover:text-zinc-200'
        }`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={() => (isFile && node.path ? onSelect(node.path) : setOpen((o) => !o))}
      >
        <span className="text-[11px] opacity-60">
          {isFile ? '📄' : open ? '📂' : '📁'}
        </span>
        <span style={{ color: isFile ? extColor[ext || ''] || '#abb2bf' : undefined }}>
          {name}
        </span>
      </div>
      {!isFile && open && node.children &&
        Object.entries(node.children)
          .sort(([, a], [, b]) =>
            a.__type === 'folder' && b.__type === 'file'
              ? -1
              : a.__type === 'file' && b.__type === 'folder'
              ? 1
              : 0
          )
          .map(([n, child]) => (
            <TreeNodeView
              key={n}
              name={n}
              node={child}
              depth={depth + 1}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
    </div>
  );
}

interface FileTreeProps {
  files: Record<string, string>;
  selected: string | null;
  onSelect: (path: string) => void;
}

export function FileTree({ files, selected, onSelect }: FileTreeProps) {
  const tree = useMemo(() => buildTree(files), [files]);
  if (!tree.children) return null;

  return (
    <div className="font-mono">
      {Object.entries(tree.children).map(([n, child]) => (
        <TreeNodeView key={n} name={n} node={child} selected={selected} onSelect={onSelect} />
      ))}
    </div>
  );
}
