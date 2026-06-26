import { useState } from 'react';
import { Icon } from './Icon';

function syntaxHL(code: string, ext?: string): string {
  if (['json'].includes(ext || '')) {
    return code
      .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="text-purple-400">$1</span>:')
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="text-green-400">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-amber-400">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="text-cyan-400">$1</span>');
  }
  return code
    .replace(/\/\/.+/g, '<span class="text-zinc-600">$&</span>')
    .replace(
      /\b(import|export|from|default|const|let|var|function|return|async|await|interface|type|extends|implements|class|new|if|else|for|while|true|false|null|undefined)\b/g,
      '<span class="text-purple-400">$1</span>'
    )
    .replace(
      /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
      '<span class="text-green-400">$1</span>'
    )
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber-400">$1</span>');
}

interface CodeViewerProps {
  files: Record<string, string>;
  selected: string | null;
}

export function CodeViewer({ files, selected }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const code = selected ? files[selected] || '' : '';
  const ext = (selected || '').split('.').pop();

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#08080f]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800/60 border-b border-zinc-700/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-zinc-500 ml-2">
            {selected?.split('/').pop()}
          </span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-700/40 hover:bg-zinc-600/40 rounded-md border border-zinc-700/30 transition-all"
        >
          <Icon name={copied ? 'check' : 'copy'} size={11} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <pre className="text-xs leading-relaxed">
          <code dangerouslySetInnerHTML={{ __html: syntaxHL(code, ext) }} />
        </pre>
      </div>
    </div>
  );
}
