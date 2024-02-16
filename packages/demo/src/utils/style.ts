import {THEME_BACKGROUND_COLOR} from "../constants/common";

export const applyPreloadStyle = (bodyBackground?: string): void => {
  const backgroundColor = bodyBackground || localStorage.getItem(THEME_BACKGROUND_COLOR) || '#1A1A1A';

  document.body.style.backgroundColor = backgroundColor;

  localStorage.setItem(THEME_BACKGROUND_COLOR, backgroundColor);
};


export function toShort (text: string, preLength = 6, sufLength = 6): string {
  if (!text) {
    return '';
  }

  if (text.length > (preLength + sufLength + 1)) {
    return `${text.slice(0, preLength)}…${text.slice(-sufLength)}`;
  }

  return text;
}
