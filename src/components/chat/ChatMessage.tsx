// src/components/chat/ChatMessage.tsx
"use client";

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './MarkdownRenderer';
import type { ReactNode } from 'react';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  isError?: boolean;
}

interface ChatMessageProps {
  message: Message;
  userIcon?: ReactNode;
  aiIcon?: ReactNode;
}

export function ChatMessage({ message, userIcon, aiIcon }: ChatMessageProps) {
  const isUser = message.type === 'user';

  return (
    <div className={cn('flex items-start gap-3 w-full', isUser ? 'justify-end pl-10' : 'justify-start pr-10')}>
      {!isUser && (
        <Avatar className="h-8 w-8 border border-border shadow-sm shrink-0">
          {aiIcon}
          {!aiIcon && <AvatarFallback>{message.type.toUpperCase().charAt(0)}</AvatarFallback>}
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-full rounded-xl p-3 text-sm leading-relaxed', // Removed shadow-md
          isUser ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground',
          message.isError ? 'bg-destructive text-destructive-foreground' : ''
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} {...props} />
              ) : (
                <code className={cn(className, "bg-muted/70 text-muted-foreground px-[0.4rem] py-[0.2rem] rounded-sm text-xs font-mono")} {...props}>
                  {children}
                </code>
              );
            },
            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 pl-2 space-y-1" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2 pl-2 space-y-1" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-border pl-4 italic my-2 text-muted-foreground" {...props} />,
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-3" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-semibold my-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-semibold my-2" {...props} />,
            strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
            em: ({node, ...props}) => <em className="italic" {...props} />,
            a: ({node, ...props}) => <a className="text-accent-foreground hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
          }}
          className="break-words"
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {isUser && (
         <Avatar className="h-8 w-8 border border-border shadow-sm shrink-0">
          {userIcon}
          {!userIcon && <AvatarFallback>{message.type.toUpperCase().charAt(0)}</AvatarFallback>}
        </Avatar>
      )}
    </div>
  );
}
