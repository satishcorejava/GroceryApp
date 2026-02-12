import { useTranslation, type Language } from "../contexts/TranslationContext";
import { motion } from "motion/react";

const languages: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "te", name: "తెలుగు" },
  { code: "kn", name: "ಕನ್ನಡ" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex gap-2 flex-wrap">
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            language === lang.code
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          {lang.name}
        </motion.button>
      ))}
    </div>
  );
}
