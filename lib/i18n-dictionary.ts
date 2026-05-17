export type LocaleKey = "en" | "hi" | "mr";
export type DictionaryKey =
  | "socialPresence"
  | "socialPresenceDesc"
  | "lightMode"
  | "darkMode"
  | "systemTheme"
  | "askAi"
  | "changelog"
  | "newBadge"
  | "toggleMenu";

export const i18nDictionary: Record<LocaleKey, Record<DictionaryKey, string>> = {
  en: {
    socialPresence: "Social Presence",
    socialPresenceDesc: "We make it easy to connect with us on every platform.",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    systemTheme: "System Theme",
    askAi: "Ask AI",
    changelog: "Changelog",
    newBadge: "New",
    toggleMenu: "Toggle menu",
  },
  hi: {
    socialPresence: "सोशल मीडिया",
    socialPresenceDesc: "हमसे हर प्लेटफ़ॉर्म पर जुड़ना आसान है।",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    systemTheme: "सिस्टम थीम",
    askAi: "AI से पूछें",
    changelog: "चेंजलॉग",
    newBadge: "नया",
    toggleMenu: "मेनू टॉगल करें",
  },
  mr: {
    socialPresence: "सोशल मीडिया",
    socialPresenceDesc: "आम्हाला सर्व प्लॅटफॉर्मवर कनेक्ट करणे सोपे आहे.",
    lightMode: "लाईट मोड",
    darkMode: "डार्क मोड",
    systemTheme: "सिस्टम थीम",
    askAi: "AI ला विचारा",
    changelog: "चेंजलॉग",
    newBadge: "नवीन",
    toggleMenu: "मेनू टॉगल करा",
  },
};

export function getDictionary(lang: string | null | undefined): Record<DictionaryKey, string> {
  const normalizedLang = (lang === "hi" || lang === "mr") ? lang : "en";
  return i18nDictionary[normalizedLang as LocaleKey];
}
