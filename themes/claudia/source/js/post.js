var $posts = {
    scroller: function () {
        function Scroller() {
            this.callbacks = []
            return this
        }
        Scroller.prototype.bindScrollEvent = function () {
            var _that = this

            window.addEventListener('scroll', function (event) {
                var wait = false
                var beforeOffsetY = window.pageYOffset

                if (wait) return
                wait = true

                setTimeout(function () {
                    var params = {
                        event: event,
                        beforeOffsetY: beforeOffsetY,
                    }
                    _that.callbacks.forEach(function (func) { func(params) })

                    wait = false
                }, 150)
            })
        }

        return Scroller
    },
    showTopic: function (evt) {
        var topicEl = document.getElementById('postTopic')
        var postTitle = document.getElementById('postTitle')

        var postTitleCoordinate = postTitle.getBoundingClientRect()
        var threshold = postTitle.offsetTop + postTitleCoordinate.height

        // show title
        if (window.pageYOffset > threshold) {
            var beforeOffsetY = evt && evt.beforeOffsetY
            var isScrollToTop = beforeOffsetY - window.pageYOffset > 0

            topicEl.classList.remove('is-hidden-topic-bar')

            if (beforeOffsetY - window.pageYOffset === 0) {
                topicEl.classList.remove('is-switch-post-title')
                topicEl.classList.remove('is-show-post-title')
                topicEl.classList.remove('immediately-show')

                if (topicEl.classList.contains('is-show-scrollToTop-tips')) {
                    topicEl.classList.remove('is-show-scrollToTop-tips')
                    topicEl.classList.add('is-flash-scrollToTop-tips')
                }
                else {
                    topicEl.classList.add('immediately-show')
                }
            }
            // scroll to up👆
            else if (isScrollToTop) {
                // show scroll to top tips
                if (window.pageYOffset > window.innerHeight * 2) {
                    topicEl.classList.remove('immediately-show')
                    topicEl.classList.remove('is-show-post-title')
                    topicEl.classList.remove('is-switch-post-title')
                    topicEl.classList.remove('is-flash-scrollToTop-tips')

                    topicEl.classList.add('is-show-scrollToTop-tips')
                }
                // show post title
                else {
                    topicEl.classList.remove('immediately-show')
                    topicEl.classList.remove('is-show-post-title')
                    topicEl.classList.remove('is-show-scrollToTop-tips')
                    topicEl.classList.remove('is-flash-scrollToTop-tips')

                    topicEl.classList.add('is-switch-post-title')
                }
            }
            // scroll to down👇
            else if (beforeOffsetY - window.pageYOffset !== 0) {
                topicEl.classList.remove('immediately-show')
                topicEl.classList.remove('is-switch-post-title')
                topicEl.classList.remove('is-show-scrollToTop-tips')
                topicEl.classList.remove('is-flash-scrollToTop-tips')
                topicEl.classList.add('is-show-post-title')
            }
        }
        else{
            // hidden all
            topicEl.classList.remove('is-flash-scrollToTop-tips')
            topicEl.classList.remove('is-show-scrollToTop-tips')
            topicEl.classList.remove('is-switch-post-title')
            topicEl.classList.remove('is-show-post-title')
            topicEl.classList.remove('immediately-show')

            topicEl.classList.add('is-hidden-topic-bar')
        }
    },
    catalogueHighlight: function () {
        var directory = document.querySelectorAll('.toc a')
        if (directory.length === 0) {
            return false
        }

        var tocContainer = document.querySelector('.toc')
        return function () {
            var contentTocList = []
            var activeClassName = 'is-active'

            directory.forEach(function (link) {
                if (!link.href) return
                var id = decodeURI(link.href).split('#')[1]
                contentTocList.push(document.getElementById(id))
            })
            var spacing = 60
            var activeTopicEl = null
            var scrollTop = window.pageYOffset
            for (var i = 0; i < contentTocList.length; i++) {
                var currentTopic = contentTocList[i]

                if (currentTopic.offsetTop > scrollTop + spacing / 2) {
                    // jump to next loop
                    continue
                }

                if (!activeTopicEl) {
                    activeTopicEl = currentTopic
                } else if (currentTopic.offsetTop + spacing >= activeTopicEl.offsetTop - spacing) {
                    activeTopicEl = currentTopic
                }

                var beforeActiveEl = document.querySelector('.toc' + ' .' + activeClassName)
                beforeActiveEl && beforeActiveEl.classList.remove(activeClassName)

                var selectTarget = '.toc a[href="#' + encodeURI(activeTopicEl.id) + '"]'
                var direc = document.querySelector(selectTarget)
                direc.classList.add(activeClassName)

                var tocContainerHeight = tocContainer.getBoundingClientRect().height
                if (direc.offsetTop >= tocContainerHeight - spacing) {
                    tocContainer.scrollTo({
                        // top: direc.offsetTop - spacing,
                        top: direc.offsetTop + 100 - tocContainerHeight,
                    })
                }
                else {
                    tocContainer.scrollTo({ top: 0 })
                }
            }
        }
    },
    smoothScrollToTop: function() {
        var Y_TopValve = (window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop);
        if (Y_TopValve > 1) {
            window.requestAnimationFrame($posts.smoothScrollToTop);
            scrollTo(0, Math.floor(Y_TopValve * 0.85));
        } else {
            scrollTo(0, 0);
        }
    },
    addValineComment() {
        var el = document.getElementById('vcomments')
        new Valine({
            el: '#vcomments',
            appId: el.dataset.comment_valine_id,
            appKey: el.dataset.comment_valine_key
        })
    },
    addCodeCopyButtons: function() {
        var codeBlocks = document.querySelectorAll('pre code, .highlight code, pre[class*="language-"] code');
        
        codeBlocks.forEach(function(codeBlock) {
            var pre = codeBlock.closest('pre') || codeBlock.closest('.highlight');
            if (!pre || pre.querySelector('.copy-btn')) return;
            
            var copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '複製';
            copyBtn.setAttribute('title', '複製');
            
            copyBtn.addEventListener('click', function() {
                var text = codeBlock.textContent || codeBlock.innerText;
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(function() {
                        copyBtn.innerHTML = '已複製！';
                        copyBtn.classList.add('copied');
                        setTimeout(function() {
                            copyBtn.innerHTML = '複製';
                            copyBtn.classList.remove('copied');
                        }, 2000);
                    }).catch(function() {
                        $posts.fallbackCopyTextToClipboard(text, copyBtn);
                    });
                } else {
                    $posts.fallbackCopyTextToClipboard(text, copyBtn);
                }
            });
            
            pre.style.position = 'relative';
            pre.appendChild(copyBtn);
        });
    },
    fallbackCopyTextToClipboard: function(text, btn) {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            var successful = document.execCommand('copy');
            if (successful) {
                btn.innerHTML = '已複製！';
                btn.classList.add('copied');
                setTimeout(function() {
                    btn.innerHTML = '複製';
                    btn.classList.remove('copied');
                }, 2000);
            }
        } catch (err) {
            console.error('複製失敗:', err);
        }
        
        document.body.removeChild(textArea);
    },
    mounted: function () {
        // PrismJS 會自動初始化，不需要手動調用

        var Scroller = this.scroller()
        var scrollerInstance = new Scroller()

        var catalogueHighlight = this.catalogueHighlight()
        catalogueHighlight && scrollerInstance.callbacks.push(catalogueHighlight)

        scrollerInstance.callbacks.push(this.showTopic)

        scrollerInstance.bindScrollEvent()

        $claudia.fadeInImage(document.querySelectorAll('.post-content img'))

        document.getElementById('postTopic').addEventListener('click', this.smoothScrollToTop)

        window.Valine && this.addValineComment()
        
        // Add code copy buttons if enabled
        if (document.body.getAttribute('data-code-copy') === 'true') {
            this.addCodeCopyButtons()
        }
    }
}

$posts.mounted()
