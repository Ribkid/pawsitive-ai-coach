import { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your PawsitiveAI training assistant. I'm here to help you with dog training questions, create personalized training plans, and provide guidance on positive reinforcement techniques. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get current user and dog context for training plan creation
      // In a real implementation, you would get these from context
      const currentUser = await getCurrentUser();
      const userDogs = await getUserDogs(currentUser?.id);
      
      // Call edge function for chat completion
      const response = await fetch('https://krubbpnebqatomzpivij.supabase.co/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          userId: currentUser?.id,
          dogId: userDogs?.[0]?.id, // Use first dog for now
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      
      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // If training plan was created, add a special message
      if (data.trainingPlanCreated) {
        const planMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: '🎉 Your personalized training plan has been created! You can view it in your Dashboard under "Training Plans".',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, planMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. In the meantime, you can explore our knowledge base for training tips!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to get user and dog info
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('sb-krubbpnebqatomzpivij-auth-token');
      if (!token) return null;
      
      const { data: { user } } = await supabase.auth.getUser(token);
      return user;
    } catch {
      return null;
    }
  };

  const getUserDogs = async (userId: string) => {
    try {
      const { data: dogs } = await supabase
        .from('dogs')
        .select('*')
        .eq('user_id', userId)
        .limit(1);
      return dogs || [];
    } catch {
      return [];
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your PawsitiveAI training assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  const value = {
    messages,
    isOpen,
    isLoading,
    toggleChat,
    sendMessage,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}