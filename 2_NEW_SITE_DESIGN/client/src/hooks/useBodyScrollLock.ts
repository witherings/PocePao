import { useEffect } from 'react';

let scrollLockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

export function useBodyScrollLock(isLocked: boolean = true) {
  useEffect(() => {
    if (!isLocked) return;

    const body = document.body;
    
    scrollLockCount++;
    
    if (scrollLockCount === 1) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      originalOverflow = body.style.overflow;
      originalPaddingRight = body.style.paddingRight;
      
      body.style.overflow = 'hidden';
      body.style.paddingRight = `${scrollbarWidth}px`;
      
      body.style.position = 'relative';
      body.style.touchAction = 'none';
    }
    
    return () => {
      scrollLockCount--;
      
      if (scrollLockCount === 0) {
        body.style.overflow = originalOverflow;
        body.style.paddingRight = originalPaddingRight;
        body.style.position = '';
        body.style.touchAction = '';
      }
    };
  }, [isLocked]);
}
