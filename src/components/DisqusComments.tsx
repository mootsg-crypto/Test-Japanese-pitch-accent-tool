import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

export const DisqusComments: React.FC = () => {
  useEffect(() => {
    // Check if disqus embed script is already present
    const existingScript = document.getElementById('disqus-embed-script');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'disqus-embed-script';
      script.src = 'https://test-japanese-pitch-accent-tool.disqus.com/embed.js';
      script.setAttribute('data-timestamp', (+new Date()).toString());
      script.async = true;
      (document.head || document.body).appendChild(script);
    } else if ((window as any).DISQUS) {
      // If already loaded, reset Disqus to re-render comments
      (window as any).DISQUS.reset({
        reload: true,
      });
    }

    // Also load count script if not present
    const existingCountScript = document.getElementById('dsq-count-scr');
    if (!existingCountScript) {
      const countScript = document.createElement('script');
      countScript.id = 'dsq-count-scr';
      countScript.src = '//test-japanese-pitch-accent-tool.disqus.com/count.js';
      countScript.async = true;
      (document.head || document.body).appendChild(countScript);
    }
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-[#282a2b] space-y-4">
      <div className="flex items-center gap-2 text-[#FAB917] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base">
        <MessageSquare className="w-5 h-5" />
        <h2>Community Discussions & Feedback</h2>
      </div>

      <div className="bg-[#212121] rounded-xl p-6 border border-[#282a2b] min-h-[180px]">
        <div id="disqus_thread" className="w-full"></div>
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
