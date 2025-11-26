// KaTeX on-demand loader - only load CSS when math content is present
(function() {
  // Use DOMContentLoaded to ensure content is fully loaded before checking
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadKatexIfNeeded);
  } else {
    loadKatexIfNeeded();
  }

  function loadKatexIfNeeded() {
    // Check if page has math content by looking for common LaTeX delimiters
    const content = document.body.textContent || '';
    const hasMath = /\$.*?\$|\\\[.*?\\\]|\\\(.*?\\\)/.test(content) || 
                    document.querySelector('.katex, .katex-display, .katex-inline, span[class*="katex"]');
    
    if (hasMath) {
      // Create and append KaTeX CSS link
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      link.integrity = 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      console.log('KaTeX CSS loaded on-demand');
    }
  }
})();
