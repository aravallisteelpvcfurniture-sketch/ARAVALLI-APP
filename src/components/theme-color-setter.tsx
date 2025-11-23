'use client';

import React, { useEffect } from 'react';

const ThemeColorSetter = () => {
  useEffect(() => {
    const lightColor = 'hsl(220 80% 55%)';
    const darkColor = 'hsl(220 80% 65%)';

    const setMetaThemeColor = (color: string) => {
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', color);
    };

    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      setMetaThemeColor(e.matches ? darkColor : lightColor);
    };

    setMetaThemeColor(matcher.matches ? darkColor : lightColor);

    matcher.addEventListener('change', onChange);

    return () => {
      matcher.removeEventListener('change', onChange);
    };
  }, []);

  return null;
};

export default ThemeColorSetter;
