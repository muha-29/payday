import { useProfile } from './useProfile';
import { LANGUAGES, DEFAULT_LANG } from '../i18n/languages';

export function useI18n() {
    const { profile } = useProfile();

    const lang = profile?.language || DEFAULT_LANG;
    console.log('Current language:', lang);
    const dict = LANGUAGES[lang] || LANGUAGES[DEFAULT_LANG];
    console.log('Using dictionary:', dict);

    function t(key: string) {
        return dict[key] || key;
    }

    return { t, lang };
}