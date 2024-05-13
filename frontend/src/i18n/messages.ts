import { LOCALES } from './locales';
import enMessages from '../lang/en-US.json';
import ruMessages from '../lang/ru-RU.json';

export const messages = {
  [LOCALES.ENGLISH]: {
    name: 'English',
    messages: enMessages
  },
  [LOCALES.RUSSIAN]: {
    name: 'Русский',
    messages: ruMessages
  },
};
