import { useEffect, useState } from 'react';

declare type ExtendedDocumentType = Document & { msHidden?: boolean; webkitHidden?: boolean };
const document = window.document as ExtendedDocumentType;

const getBrowserVisibilityProp = () => {
  if (document.hidden && typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    return 'visibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    return 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    return 'webkitvisibilitychange';
  }
};

const getBrowserDocumentHiddenProp = () => {
  if (typeof document.hidden !== 'undefined') {
    return 'hidden';
  } else if (typeof document.msHidden !== 'undefined') {
    return 'msHidden';
  } else if (typeof document.webkitHidden !== 'undefined') {
    return 'webkitHidden';
  }
};

const getIsDocumentHidden = () => {
  const hiddenState = getBrowserDocumentHiddenProp();
  if (hiddenState) {
    return !document[hiddenState];
  }

  return true;
};

export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(getIsDocumentHidden());
  const onVisibilityChange = () => setIsVisible(getIsDocumentHidden());

  const handlePageVisible = () => {
    onVisibilityChange();
  };

  const handlePageBlur = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const visibilityChange = getBrowserVisibilityProp();
    if (visibilityChange) {
      document.addEventListener(visibilityChange, onVisibilityChange, false);
    }

    window.addEventListener('focus', handlePageVisible, false);
    window.addEventListener('blur', handlePageBlur, false);
    return () => {
      if (visibilityChange) {
        document.removeEventListener(visibilityChange, onVisibilityChange);
      }

      window.removeEventListener('focus', handlePageVisible);
      window.removeEventListener('blur', handlePageBlur);
    };
  });

  return isVisible;
};
