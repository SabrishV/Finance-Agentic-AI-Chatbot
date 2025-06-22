// src/app/(app)/page.tsx - Main Chat Page
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
// UserProfileForm is removed
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage, Message } from '@/components/chat/ChatMessage';
import { personalizedOnboarding, PersonalizedOnboardingOutput } from '@/ai/flows/onboarding-flow'; // Input type not needed here
import { maintainConversationContext, MaintainConversationContextOutput } from '@/ai/flows/context-management-flow';
import useLocalStorage from '@/hooks/use-local-storage';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DollarSign, UserCircle, Loader2 } from 'lucide-react'; // Changed Brain to DollarSign for AI icon
import { useToast } from '@/hooks/use-toast';
// Button import might not be needed directly unless for other UI elements

// UserProfile interface might be redefined or removed if not directly used for form
// export interface UserProfile extends PersonalizedOnboardingInput {
//   onboardingSummary?: string;
// }

export default function ChatPage() {
  // Removed isOnboardingComplete and userProfile related to form onboarding
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.CONVERSATION_HISTORY,
    ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsComponentMounted(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      // A slight delay can help ensure the DOM has updated, especially with new messages.
      setTimeout(() => {
        scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // Effect for initial AI greeting or loading existing chat
  useEffect(() => {
    if (isComponentMounted) {
      if (!conversationHistory) { // New user, AI starts the conversation
        setIsLoading(true);
        personalizedOnboarding()
          .then((result: PersonalizedOnboardingOutput) => {
            const aiGreeting: Message = { type: 'ai', content: result.initialAiMessage, id: Date.now().toString() };
            setMessages([aiGreeting]);
            setConversationHistory(`AI: ${result.initialAiMessage}`);
            toast({ title: "Welcome!", description: "Your financial sage is ready to assist." });
          })
          .catch(error => {
            console.error("Initial greeting error:", error);
            const errorMessage: Message = { type: 'ai', content: "I seem to be having trouble starting our conversation. Please refresh.", id: Date.now().toString(), isError: true };
            setMessages([errorMessage]);
            toast({ title: "Initialization Error", description: "Could not start the conversation. Please try refreshing.", variant: "destructive" });
          })
          .finally(() => setIsLoading(false));
      } else if (messages.length === 0) { // Existing history, reconstruct messages
        const historyLines = conversationHistory.split('\n');
        const reconstructedMessages: Message[] = [];
        let currentSpeaker: 'ai' | 'user' | null = null;
        let currentContent: string[] = [];

        historyLines.forEach((line, index) => {
            const lineId = `hist-${index}`;
            if (line.startsWith('User: ')) {
                if (currentSpeaker && currentContent.length > 0) {
                    reconstructedMessages.push({type: currentSpeaker, content: currentContent.join('\n'), id: `${lineId}-prev`});
                }
                currentSpeaker = 'user';
                currentContent = [line.substring(6)];
            } else if (line.startsWith('AI: ')) {
                 if (currentSpeaker && currentContent.length > 0) {
                    reconstructedMessages.push({type: currentSpeaker, content: currentContent.join('\n'), id: `${lineId}-prev`});
                }
                currentSpeaker = 'ai';
                currentContent = [line.substring(4)];
            } else if (currentSpeaker) { // Handles multi-line messages
                currentContent.push(line);
            }
        });
         if (currentSpeaker && currentContent.length > 0) { // Push the last gathered message
            reconstructedMessages.push({type: currentSpeaker, content: currentContent.join('\n'), id: `hist-last`});
        }
        if (reconstructedMessages.length > 0) {
            setMessages(reconstructedMessages);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComponentMounted, conversationHistory]); // Removed setMessages, setConversationHistory, toast from deps

  // handleOnboardingSubmit is removed as onboarding is now conversational

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const newUserMessage: Message = { type: 'user', content: userInput, id: Date.now().toString() };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);
    
    // Optimistically update conversation history for the context management flow
    const tempHistory = conversationHistory + `\nUser: ${userInput}`;

    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const result: MaintainConversationContextOutput = await maintainConversationContext({
        userInput,
        conversationHistory: tempHistory, // Use optimistically updated history
      });
      const aiResponse: Message = { type: 'ai', content: result.aiResponse, id: (Date.now() + 1).toString() };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setConversationHistory(result.updatedConversationHistory); // Set the full updated history from the flow
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessageContent = "I apologize, but I encountered a slight difficulty in processing that. Could you perhaps rephrase or try again shortly?";
      const errorMessage: Message = { type: 'ai', content: errorMessageContent, id: (Date.now() + 1).toString(), isError: true };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      toast({ title: "A Moment's Pause", description: "There was a slight hiccup. Please try your query again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isComponentMounted) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // The UserProfileForm is no longer rendered here. Chat interface is always primary.
  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
      <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollAreaRef}>
        <div className="space-y-6 pb-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              userIcon={<UserCircle className="w-full h-full text-primary-foreground/80" />}
              aiIcon={<DollarSign className="w-full h-full text-primary" />} // Changed icon
            />
          ))}
          {/* Show thinking indicator only if the last message was from user and AI is loading */}
          {isLoading && messages.length > 0 && messages[messages.length-1]?.type === 'user' && (
             <ChatMessage
              message={{id: 'loading', type: 'ai', content: 'The Sage is contemplating...'}}
              aiIcon={<DollarSign className="w-full h-full text-primary animate-pulse" />} // Changed icon
            />
          )}
           {/* Show initial loading when messages are empty and history is also empty (first load) */}
          {isLoading && messages.length === 0 && (
             <ChatMessage
              message={{id: 'initial-loading', type: 'ai', content: 'The Sage is preparing their wisdom...'}}
              aiIcon={<DollarSign className="w-full h-full text-primary animate-pulse" />}
            />
          )}
        </div>
      </ScrollArea>
      <div className="p-3 sm:p-4 border-t border-border bg-background/80 backdrop-blur-sm">
        <ChatInput onSubmit={handleSendMessage} isLoading={isLoading} placeholder="Converse with the Financial Sage..." />
      </div>
    </div>
  );
}
