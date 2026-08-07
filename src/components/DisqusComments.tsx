import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertCircle } from 'lucide-react';

export const DisqusComments: React.FC = () => {
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Suppress cross-origin external script errors
    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.message === 'Script error.' ||
        (event.filename && event.filename.includes('disqus')) ||
        (event.message && event.message.toLowerCase().includes('disqus'))
      ) {
        event.preventDefault();
        return true;
      }
    };

    window.addEventListener('error', handleGlobalError);

    try {
      // Check if disqus embed script is already present
      const existingScript = document.getElementById('disqus-embed-script');

      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'disqus-embed-script';
        script.src = 'https://test-japanese-pitch-accent-tool.disqus.com/embed.js';
        script.setAttribute('data-timestamp', (+new Date()).toString());
        script.async = true;
        script.onerror = () => {
          console.warn('Disqus embed script failed to load or was blocked.');
          setLoadError(true);
        };
        (document.head || document.body).appendChild(script);
      } else if ((window as any).DISQUS) {
        try {
          (window as any).DISQUS.reset({
            reload: true,
          });
        } catch (e) {
          console.warn('Disqus reset error:', e);
        }
      }

      // Load count script with explicit https protocol
      const existingCountScript = document.getElementById('dsq-count-scr');
      if (!existingCountScript) {
        const countScript = document.createElement('script');
        countScript.id = 'dsq-count-scr';
        countScript.src = 'https://test-japanese-pitch-accent-tool.disqus.com/count.js';
        countScript.async = true;
        countScript.onerror = () => {
          // Ignore count script loading error silently
        };
        (document.head || document.body).appendChild(countScript);
      }
    } catch (err) {
      console.warn('Error setting up Disqus comments:', err);
      setLoadError(true);
    }

    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-[#282a2b] space-y-4">
      <div className="flex items-center gap-2 text-[#FAB917] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base">
        <MessageSquare className="w-5 h-5" />
        <h2>Community Discussions & Feedback</h2>
      </div>

      <div className="bg-[#212121] rounded-xl p-6 border border-[#282a2b] min-h-[180px]">
        {loadError ? (
          <div className="p-4 bg-[#121414] rounded-lg border border-[#282a2b] text-xs text-[#A1A1A1] flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#FAB917] shrink-0" />
            <div>
              <span className="font-bold text-[#e2e2e2] block">Disqus Section Ready</span>
              Disqus script container is configured. If third-party tracking protection or adblockers are enabled, allow Disqus to view live comments.
            </div>
          </div>
        ) : (
          <div id="disqus_thread" className="w-full"></div>
        )}
        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-[#FAB917] underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </div>
  );
};

