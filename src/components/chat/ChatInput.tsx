// src/components/chat/ChatInput.tsx
"use client";

import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string; // Added placeholder prop
}

export function ChatInput({ onSubmit, isLoading, placeholder = "Send a message..." }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;
    const currentMessage = message;
    setMessage(''); 
    if (textareaRef.current) { 
        textareaRef.current.style.height = 'auto';
    }
    await onSubmit(currentMessage);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };
  
  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`; 
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);


  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 p-2 rounded-xl bg-muted">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder} // Use placeholder prop
        className="flex-1 resize-none min-h-[2.5rem] max-h-[12.5rem]  overflow-y-auto rounded-lg border-0 bg-transparent p-2.5 pr-20 text-sm shadow-none focus-visible:ring-0 focus:ring-transparent focus:outline-none"
        rows={1}
        disabled={isLoading}
        aria-label="Chat message input"
      />
      <div className="absolute right-3 bottom-3 flex flex-col gap-1">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={isLoading || !message.trim()} className="h-9 w-9 shrink-0 rounded-md">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p>Send</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="hidden md:flex items-center justify-center text-xs text-muted-foreground">
            <CornerDownLeft size={12} className="mr-1"/> Shift+Enter for new line
        </div>
      </div>
    </form>
  );
}
