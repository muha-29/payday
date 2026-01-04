import en from './en';
import hi from './hi';
import te from './te';
import ta from './ta';

export const LANGUAGES: Record<string, any> = {
    'en-IN': en,
    'hi-IN': hi,
    'te-IN': te,
    'ta-IN': ta
};

export const DEFAULT_LANG = 'en-IN';
export const SUPPORTED_LANGS = Object.keys(LANGUAGES);