
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage as ChatMessageType, Role, Theme, Language } from './types';
import { geminiService } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (preferDark) {
      setTheme(Theme.DARK);
    }
  }, []);

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const initChat = () => {
      try {
        const session = geminiService.createChat(language);
        setChatSession(session);
        setChatMessages([]); // Clear chat history on language change
      } catch (e: any) {
        setError(e.message || "Failed to initialize chat session. Check your API key.");
      }
    };
    initChat();
  }, [language]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = useCallback(async (message: string, image: { data: string; mimeType: string } | null) => {
    if (!chatSession) {
      setError("Chat session is not initialized.");
      return;
    }
    if (!message.trim() && !image) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessageType = {
      role: Role.USER,
      parts: [{ text: message }],
      image: image ? `data:${image.mimeType};base64,${image.data}` : undefined,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    const modelMessageId = Date.now();
    const initialModelMessage: ChatMessageType = {
      id: modelMessageId,
      role: Role.MODEL,
      parts: [{ text: "" }],
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, initialModelMessage]);

    try {
      const stream = await geminiService.sendMessageStream(chatSession, message, image);
      
      let fullResponse = "";
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setChatMessages(prev =>
          prev.map(msg =>
            msg.id === modelMessageId ? { ...msg, parts: [{ text: fullResponse }] } : msg
          )
        );
      }
    } catch (e: any) {
      const errorMessage = e.message || "An error occurred while fetching the response.";
      setError(errorMessage);
       setChatMessages(prev =>
        prev.map(msg =>
          msg.id === modelMessageId ? { ...msg, parts: [{ text: `Error: ${errorMessage}` }], isError: true } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [chatSession]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800 font-sans text-gray-800 dark:text-gray-200 antialiased">
      <Header theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-green-50 dark:bg-gray-900">
        {chatMessages.length === 0 ? (
           <WelcomeScreen onExampleClick={(query) => handleSendMessage(query, null)} language={language} />
        ) : (
          chatMessages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))
        )}
         {isLoading && chatMessages[chatMessages.length-1]?.role === Role.MODEL && (
            <ChatMessage message={{ role: Role.MODEL, parts: [{ text: '' }], timestamp: new Date() }} isLoading={true} />
        )}

      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        {error && <div className="text-red-500 dark:text-red-400 text-center text-sm mb-2">{error}</div>}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} language={language} />
      </footer>
    </div>
  );
};

export default App;