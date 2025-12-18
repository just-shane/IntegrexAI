
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { gemini } from '../services/geminiService';

interface ChatInterfaceProps {
  initialMessage?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Welcome to IntegrexAI. I'm ready to assist with your Mazak multi-tasking operations. Are we programming in Mazatrol today, or do you have a specific EIA/ISO question?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let fullResponse = '';
      const modelMessageId = (Date.now() + 1).toString();
      
      // Add initial empty model message
      setMessages(prev => [...prev, {
        id: modelMessageId,
        role: 'model',
        content: '',
        timestamp: new Date()
      }]);

      const stream = gemini.sendMessageStream(text);
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? { ...msg, content: fullResponse } : msg
        ));
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'model',
        content: "I encountered an error connecting to the controller interface. Please check your connection.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-orange-600 text-white rounded-br-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  {msg.role === 'user' ? 'Operator' : 'IntegrexAI'}
                </span>
                <span className="text-[10px] opacity-40">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {msg.content || (isLoading && msg.role === 'model' ? 'Thinking...' : '')}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-6 bg-slate-900/50 border-t border-slate-800">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="max-w-4xl mx-auto flex items-end space-x-3 bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-lg"
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about Mazatrol units, G-code syntax, or machine alarms..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none py-3 px-2 max-h-32 text-sm md:text-base font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-md active:scale-95"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-500 mt-3 font-medium uppercase tracking-widest">
          Precision Multi-Tasking Assistant v1.4 • Powered by Gemini Flash
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
