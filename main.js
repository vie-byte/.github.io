/* ================================
   八福 - メインJavaScript
   ================================ */

// フォント読み込みチェック
document.fonts.ready.then(() => {
    console.log('Fonts loaded');
    document.body.classList.add('fonts-loaded');
});

// 言語切り替え機能
function changeLanguage() {
    const desktopLang = document.getElementById('languageSelect');
    const mobileLang = document.getElementById('languageSelectMobile');
    
    // アクティブなセレクトボックスから言語を取得
    let lang;
    if (desktopLang && desktopLang === document.activeElement) {
        lang = desktopLang.value;
        if (mobileLang) mobileLang.value = lang;
    } else if (mobileLang && mobileLang === document.activeElement) {
        lang = mobileLang.value;
        if (desktopLang) desktopLang.value = lang;
    } else {
        // フォールバック
        lang = desktopLang ? desktopLang.value : (mobileLang ? mobileLang.value : 'ja');
    }
    
    // data属性を持つすべての要素を取得
    const elements = document.querySelectorAll('[data-ja]');
    
    elements.forEach(element => {
        // 該当する言語のテキストを取得
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // HTMLタグを含む場合はinnerHTMLを使用
            if (text.includes('<') || text.includes('>')) {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // 言語設定を保存
    localStorage.setItem('selectedLanguage', lang);
}

// DOMContentLoaded イベント
document.addEventListener('DOMContentLoaded', function() {
    
    // 保存された言語設定を適用
    const savedLang = localStorage.getItem('selectedLanguage') || 'ja';
    const langSelect = document.getElementById('languageSelect');
    const langMobile = document.getElementById('languageSelectMobile');
    
    if (langSelect) {
        langSelect.value = savedLang;
    }
    if (langMobile) {
        langMobile.value = savedLang;
    }
    
    // 日本語以外の場合は言語を切り替え
    if (savedLang !== 'ja') {
        changeLanguage();
    }
    
    // ハンバーガーメニュー
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // ハンバーガーアニメーション
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // メニューリンクをクリックしたら閉じる
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // スムーススクロール
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // モバイルメニューを閉じる
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
    
    // スクロールアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 一度表示したら監視を解除（パフォーマンス向上）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を監視
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
    
    // ヘッダーのスクロール効果
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // スクロール方向を判定
        if (currentScroll > lastScroll && currentScroll > 100) {
            // 下スクロール時：ヘッダーを隠す
            header.style.transform = 'translateY(-100%)';
        } else {
            // 上スクロール時：ヘッダーを表示
            header.style.transform = 'translateY(0)';
        }
        
        // スクロール位置に応じてヘッダーの背景を変更
        if (currentScroll > 50) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        }
        
        lastScroll = currentScroll;
    });
    
    // ページ遷移時のローディング効果
    const pageLinks = document.querySelectorAll('a:not([href^="#"]):not([href^="http"]):not([href^="mailto"]):not([href^="tel"])');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.includes('#')) {
                e.preventDefault();
                
                // フェードアウト効果
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
    
    // ページ読み込み時のフェードイン
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    });
});

// 言語選択の変更イベント（グローバル関数として定義）
window.changeLanguage = changeLanguage;