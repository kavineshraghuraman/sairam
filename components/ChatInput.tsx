
import React, { useState, useRef, useCallback } from 'react';
import { PaperclipIcon, SendIcon, XIcon } from './icons/Icons';
import { Language } from '../types';
import { useTranslations } from '../i18n';

interface ChatInputProps {
  onSendMessage: (message: string, image: { data: string; mimeType: string } | null) => void;
  isLoading: boolean;
  language: Language;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, language }) => {
  const [inputValue, setInputValue] = useState('');
  const [imageFile, setImageFile] = useState<{ file: File, preview: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations(language);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        alert("Image size exceeds 4MB limit.");
        return;
      }
      setImageFile({ file, preview: URL.createObjectURL(file) });
    }
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const fileToBase64 = (file: File): Promise<{ data: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve({ data: base64Data, mimeType: file.type });
        };
        reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading || (!inputValue.trim() && !imageFile)) return;

    let imagePayload: { data: string, mimeType: string } | null = null;
    if (imageFile) {
        imagePayload = await fileToBase64(imageFile.file);
    }
    
    onSendMessage(inputValue, imagePayload);
    setInputValue('');
    handleRemoveImage();
  }, [inputValue, imageFile, isLoading, onSendMessage]);


  return (
    <div className="max-w-3xl mx-auto">
       <form onSubmit={handleSubmit} className="relative">
        {imageFile && (
            <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
                <div className="relative">
                    <img src={imageFile.preview} alt="Preview" className="h-20 w-20 rounded-md object-cover"/>
                    <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                        <XIcon className="h-3 w-3" />
                    </button>
                </div>
            </div>
        )}
        <div className="flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 focus-within:ring-2 focus-within:ring-green-500 transition-shadow duration-200">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                className="hidden"
                id="file-upload"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Attach image"
            >
                <PaperclipIcon className="h-6 w-6" />
            </button>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('inputPlaceholder')}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-transparent border-none focus:outline-none focus:ring-0 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || (!inputValue.trim() && !imageFile)}
                className="p-2 rounded-full text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                aria-label="Send message"
            >
                <SendIcon className="h-6 w-6" />
            </button>
        </div>
       </form>
    </div>
  );
};

export default ChatInput;