import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

export default function ChatButton() {
  const { isOpen, toggleChat } = useChat();

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </button>
  );
}