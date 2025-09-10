import { Language } from './types';

const translations = {
  en: {
    welcomeTitle: "Welcome to Farmers Friend AI",
    welcomeSubtitle: "Your personal farming assistant. Ask a question or upload a photo to get started.",
    example1: "What are these spots on my tomato leaves?",
    example2: "How can I improve my soil's fertility naturally?",
    example3: "Identify this pest on my corn.",
    example4: "Is my plant getting enough light?",
    inputPlaceholder: "Ask about your farm or upload a photo...",
  },
  ta: {
    welcomeTitle: "ஃபார்மர்ஸ் ஃபிரெண்ட் AI-க்கு வரவேற்கிறோம்",
    welcomeSubtitle: "உங்கள் தனிப்பட்ட விவசாய உதவியாளர். தொடங்க ஒரு கேள்வியைக் கேட்கவும் அல்லது ஒரு புகைப்படத்தைப் பதிவேற்றவும்.",
    example1: "என் தக்காளி இலைகளில் உள்ள இந்த புள்ளிகள் என்ன?",
    example2: "என் மண்ணின் வளத்தை இயற்கையாக எப்படி மேம்படுத்துவது?",
    example3: "என் சோளத்தில் உள்ள இந்த பூச்சியை அடையாளம் காணவும்.",
    example4: "என் செடிக்கு போதுமான வெளிச்சம் கிடைக்கிறதா?",
    inputPlaceholder: "உங்கள் பண்ணையைப் பற்றி கேளுங்கள் அல்லது ஒரு புகைப்படத்தைப் பதிவேற்றவும்...",
  }
};

type TranslationKey = keyof typeof translations.en;

export const useTranslations = (lang: Language) => {
  return (key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key];
  };
};