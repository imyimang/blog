'use strict';

const urlFor = hexo.extend.helper.get('url_for');

const IMAGE_SRC_REGEX = /(<img\b[^>]*\ssrc=["'])(?![a-zA-Z][a-zA-Z0-9+.-]*:|\/|#|data:)([^"']+)(["'])/gi;

hexo.extend.filter.register('after_render:html', function (html) {
  if (!html) {
    return html;
  }

  return html.replace(IMAGE_SRC_REGEX, (match, prefix, src, suffix) => {
    const normalized = urlFor.call(hexo, src.trim());
    return `${prefix}${normalized}${suffix}`;
  });
});
