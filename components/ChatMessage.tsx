
import React from 'react';
import { ChatMessage as ChatMessageType, Role } from '../types';
import { BotIcon, UserIcon } from './icons/Icons';

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
}

const parseMarkdown = (text: string) => {
    // Escape HTML to prevent XSS, except for our own tags.
    const escapeHtml = (unsafe: string) => 
        unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");

    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    let inList = false;

    const processLine = (line: string) => {
        // **bold** => <strong>bold</strong>
        let processed = escapeHtml(line).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // [text](url) => <a href="url" ...>text</a>
        processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-green-600 dark:text-green-400 hover:underline">$1</a>');
        return processed;
    }

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul className="list-disc list-inside space-y-1 my-2" key={`list-${elements.length}`}>
                    {listItems.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: processLine(item) }} />)}
                </ul>
            );
            listItems = [];
        }
        inList = false;
    };

    lines.forEach((line, index) => {
        if (line.startsWith('* ') || line.startsWith('- ')) {
            if (!inList) inList = true;
            listItems.push(line.substring(2));
        } else {
            flushList();
            if (line.trim() !== '') {
                elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: processLine(line) }} />);
            }
        }
    });

    flushList();
    return elements;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.role === Role.USER;

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="flex flex-col items-end gap-2 max-w-xl">
          <div className="bg-green-600 text-white rounded-xl rounded-br-none px-4 py-3">
             {message.image && <img src={message.image} alt="User upload" className="rounded-lg mb-2 max-w-xs" />}
            <p>{message.parts.map(part => part.text).join('')}</p>
          </div>
        </div>
         <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
          <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </div>
      </div>
    );
  }

  // AI / Model message
  return (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <BotIcon className="h-6 w-6 text-green-700 dark:text-green-400" />
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-xl rounded-bl-none px-4 py-3 max-w-xl border border-gray-200 dark:border-gray-600 shadow-sm">
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-300"></span>
                </div>
            ) : (
                <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200">
                    {parseMarkdown(message.parts.map(part => part.text).join(''))}
                </div>
            )}
        </div>
    </div>
  );
};

export default ChatMessage;