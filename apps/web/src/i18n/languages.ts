import en from './en';
import hi from './hi';
import te from './te';
import ta from './ta';

export const LANGUAGES: Record<string, any> = {
    'en': en,
    'hi': hi,
    'te': te,
    'ta': ta
};

export const DEFAULT_LANG = 'en';
export const SUPPORTED_LANGS = Object.keys(LANGUAGES);