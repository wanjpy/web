import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import resources from '../assets/locales/resources';

let localLang = sessionStorage.getItem('lang');
const browserLang = navigator.language;
if (!localLang) {
  localLang = browserLang === 'zh-CN' ? 'zh-CN' : 'en-US';
}
// console.log(localLang)
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localLang,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

// export default i18n;
export const t = i18n.t.bind(i18n);

// const [t, i18n] = useTranslation();
export const changeLanguage = () => {
  const locale = i18n.language === "zh-CN" ? "en-US" : "zh-CN";
  i18n.changeLanguage(locale)
}