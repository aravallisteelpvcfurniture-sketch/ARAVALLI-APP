
'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const GoogleAd = () => {
  const adPushed = useRef(false);

  useEffect(() => {
    if (adPushed.current) {
      return;
    }
    
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adPushed.current = true;
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    return (
        <div
            className="flex h-32 w-full items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500"
        >
            Google Ad (Visible in Production)
        </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
      data-ad-slot={process.env.NEXT_PUBLIC_GOOGLE_AD_SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

    
