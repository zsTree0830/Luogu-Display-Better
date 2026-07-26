// ==UserScript==
// @name         Luogu Display Better
// @namespace    https://www.luogu.com.cn/user/1362278
// @version      1.0.0
// @description  Change your Luogu style what you like best
// @author       zsTree & Ashstrider
// @match        *://www.luogu.com.cn/*
// @icon         https://fecdn.luogu.com.cn/columba/static.325908fec383795b.logo-single-color.svg
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let borderRadius;
    let blurValue;
    let opacityValue;
    let cardRounded;
    let picRounded;
    let bgFullscreen;
    let adBlock;
    let customCSS;

    function initVarible() {
        borderRadius = parseFloat(localStorage.getItem("LuoguDisplayBetter-borderRadius") ?? 15);
        blurValue = parseFloat(localStorage.getItem("LuoguDisplayBetter-blur") ?? 10);
        opacityValue = parseFloat(localStorage.getItem("LuoguDisplayBetter-opacity") ?? 75);
        cardRounded = localStorage.getItem("LuoguDisplayBetter-cardRounded") ?? true;
        picRounded = localStorage.getItem("LuoguDisplayBetter-picRounded") ?? true;
        adBlock = localStorage.getItem("LuoguDisplayBetter-adBlock") ?? false;
        bgFullscreen = localStorage.getItem("LuoguDisplayBetter-bgFullscreen") ?? true;
        customCSS = localStorage.getItem("LuoguDisplayBetter-customCSS") ?? '';
    }

    function applyRounded() {
        const old = document.getElementById('ldb-rounded-style');
        if (old) old.remove();
        if (isNaN(borderRadius)) return;
        let style = document.createElement('style');
        style.id = 'ldb-rounded-style';
        const radius = borderRadius + 'px';
        let css = `.swal2-popup.swal2-modal.swal2-show { border-radius: ${radius} !important; }`;
        if (cardRounded) {
            css += `.l-card, .lg-article, .card { border-radius: ${radius} !important; }`;
            css += `.l-form-layout, .am-panel { border-radius: ${radius} !important; }`;
        }
        if (document.querySelector('.user-header-top')) css += `.user-header-top { border-top-left-radius: ${radius}; border-top-right-radius: ${radius}; } .user-header-bottom { border-bottom-left-radius: ${radius}; border-bottom-right-radius: ${radius}; }`;
        if (document.querySelector('.user-nav')) css += `.user-nav { border-bottom-left-radius: ${radius}; border-bottom-right-radius: ${radius}; }`;
        if (document.querySelector('.test-case')) css += `.test-case { border-radius: 10px; }`;
        if (picRounded) css += `img { border-radius: ${Math.min(borderRadius, 8)}px !important; }`;
        if (document.querySelector('.article-banner')) css += `html.ldb-bgfullscreen .article-banner.article-banner { border-top-left-radius: ${radius} !important; border-top-right-radius: ${radius} !important; }`;
        if (document.querySelector('.article-content')) css += `html.ldb-bgfullscreen .article-content.article-content { border-bottom-left-radius: ${radius} !important; border-bottom-right-radius: ${radius} !important; }`;
        if (document.querySelector('.toc')) css += `html.ldb-bgfullscreen .toc.toc { border-radius: .5em !important; }`;
        style.innerHTML = css;
        document.head.append(style);
    }

    function applyCardBlur() {
        const old = document.getElementById('ldb-blur-style');
        if (old) old.remove();
        if (blurValue === undefined || isNaN(blurValue)) {
            return;
        }
        const style = document.createElement('style');
        style.id = 'ldb-blur-style';
        const val = blurValue === 0 ? 'none' : `blur(${blurValue}px)`;
        const css = `.lg-article, .card, .l-card, .theme-page { backdrop-filter: ${val} !important; }` +
                    `.theme-page { --theme-card-backdrop-filter: ${val} !important; }` +
                    `.top-bar, .sidebar, .nav-group, nav.lfe-body, .user-nav, .header-layout { backdrop-filter: ${val} !important; }` +
                    `html.ldb-bgfullscreen .article-banner,` +
                    `html.ldb-bgfullscreen .lfe-marked-wrap { backdrop-filter: ${val} !important; }`;
        style.innerHTML = css;
        document.head.append(style);
    }

    function applyCardOpacity() {
        const old = document.getElementById('ldb-opacity-style');
        if (old) old.remove();
        if (opacityValue === undefined || isNaN(opacityValue)) {
            return;
        }
        const style = document.createElement('style');
        style.id = 'ldb-opacity-style';
        const alpha = opacityValue / 100;
        const css = `.lg-article, .l-card, .card { background-color: rgba(255, 255, 255, ${alpha}) !important; }` +
                    `.theme-page { --theme-card-background: rgba(255, 255, 255, ${alpha}) !important; }` +
                    `.top-bar, nav.lfe-body, .user-nav, .header-layout { background-color: rgba(255, 255, 255, ${alpha}) !important; }` +
                    `.sidebar, .nav-group { background-color: rgba(255, 255, 255, ${alpha}) !important; }` +
                    `nav.lfe-body > div { background-color: rgba(255, 255, 255, ${alpha}) !important; }` +
                    `.user-header-bottom { background-color: rgba(255, 255, 255, ${alpha}) !important; }` +
                    `.top-bar { --theme-navi-back: rgba(255, 255, 255, ${alpha}) !important; }`;
        style.innerHTML = css;
        document.head.append(style);
    }

    function applyBgFullscreen() {
        const oldStyle = document.getElementById('ldb-bgfullscreen-style');
        if (oldStyle) oldStyle.remove();
        document.documentElement.classList.remove('ldb-bgfullscreen');

        const themePage = document.querySelector('.theme-page');
        if (themePage && themePage._ldbThemeVars) {
            for (const [key, value] of Object.entries(themePage._ldbThemeVars)) {
                themePage.style.setProperty(key, value);
            }
            delete themePage._ldbThemeVars;
        }

        if (!bgFullscreen) return;

        let bgImage = null;

        const themeScript = document.getElementById('luogu-theme');
        if (themeScript) {
            try {
                const themeData = JSON.parse(themeScript.textContent);
                if (themeData?.lBody?.image) {
                    bgImage = `url("${themeData.lBody.image}")`;
                }
            } catch (e) {
            }
        }

        if (!bgImage) {
            const bgDiv = document.querySelector('.header-layout .background');
            if (bgDiv) {
                const style = getComputedStyle(bgDiv);
                const img = style.backgroundImage;
                if (img && img !== 'none') bgImage = img;
            }
        }

        if (!bgImage && themePage) {
            const style = getComputedStyle(themePage);
            const img = style.getPropertyValue('--theme-body-image').trim();
            if (img && img !== 'none') {
                const urlMatch = img.match(/url\(["']?([^"')]+)["']?\)/);
                bgImage = urlMatch ? `url("${urlMatch[1]}")` : `url("${img.replace(/^["']|["']$/g, '')}")`;
            }
        }

        if (!bgImage || bgImage === 'none') return;

        const nav = document.querySelector('.container nav');
        if (nav && location.pathname === '/') nav.classList.remove('user-nav');

        document.documentElement.classList.add('ldb-bgfullscreen');

        const styleEl = document.createElement('style');
        styleEl.id = 'ldb-bgfullscreen-style';
        styleEl.textContent = `
            .header-layout.tiny[data-v-7ddab1d5], .lfe-body[data-v-12f19ddc] {
                background: transparent !important;
            }
            .article-banner + div[data-v-fc349d1c] {
                background: transparent !important;
            }
            html.ldb-bgfullscreen .lcolor-bg-background {
                background: transparent !important;
            }
            html.ldb-bgfullscreen .article-banner.article-banner {
                background: rgba(245, 245, 245, ${opacityValue / 100}) !important;
            }
            html.ldb-bgfullscreen .article-content.article-content {
                background: rgba(255, 255, 255, ${opacityValue / 100}) !important;
            }
            html.ldb-bgfullscreen .toc.toc {
                background: white !important;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .15), 0 0 1px 0 rgba(0, 0, 0, .5) inset;
                padding: 3px 8px;
            }

            html.ldb-bgfullscreen {
                background-image: ${bgImage} !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
                background-size: cover !important;
                background-attachment: fixed !important;
            }
            html.ldb-bgfullscreen body {
                background: transparent !important;
                background-image: none !important;
            }
            html.ldb-bgfullscreen main.lfe-body {
                background: transparent !important;
            }
            html.ldb-bgfullscreen .main-container,
            html.ldb-bgfullscreen .wrapper,
            html.ldb-bgfullscreen .columba-content-wrap,
            html.ldb-bgfullscreen .sidebar-container {
                background: transparent !important;
            }
            html.ldb-bgfullscreen .header-layout .background {
                opacity: 0;
            }
            html.ldb-bgfullscreen .wrapper.wrapped:not(.header-layout) .background {
                display: none;
            }
            html.ldb-bgfullscreen .wrapper.wrapped:not(.header-layout) {
                background: transparent !important;
            }
            html.ldb-bgfullscreen .footer {
                background: transparent !important;
            }
            html.ldb-bgfullscreen .theme-page {
                background: transparent !important;
            }
            html.ldb-bgfullscreen .top-bar,
            html.ldb-bgfullscreen .sidebar,
            html.ldb-bgfullscreen .nav-group,
            html.ldb-bgfullscreen nav.lfe-body,
            html.ldb-bgfullscreen nav.lfe-body > div,
            html.ldb-bgfullscreen .user-nav,
            html.ldb-bgfullscreen .header-layout {
                background: transparent !important;
                background-color: transparent !important;
            }
            html.ldb-bgfullscreen .top-bar {
                --theme-navi-back: transparent !important;
            }
            html.ldb-bgfullscreen body::before,
            html.ldb-bgfullscreen body::after,
            html.ldb-bgfullscreen #app::before,
            html.ldb-bgfullscreen #app::after {
                background: none !important;
                background-image: none !important;
            }
            html.ldb-bgfullscreen #app {
                background: transparent !important;
            }
        `;
        document.head.appendChild(styleEl);

        if (themePage) {
            const themeVars = ['--theme-body-image', '--theme-body-color', '--theme-body-mid-mask', '--theme-body-color-filter'];
            const saved = themePage._ldbThemeVars = {};
            for (const v of themeVars) {
                const val = themePage.style.getPropertyValue(v);
                if (val) saved[v] = val;
                themePage.style.setProperty(v, 'none');
            }
            themePage.style.setProperty('--theme-body-back', 'transparent');
        }
    }

    function applyAdBlock() {
        if (!adBlock) return;
        const ad = document.querySelector('.side div[data-v-ce0b4304]');
        if (!ad) return;
        ad.remove();
    }

    function applyCustomCSS() {
        const old = document.getElementById('ldb-custom-style');
        if (old) old.remove();
        if (!customCSS || customCSS.trim() === '') return;
        const style = document.createElement('style');
        style.id = 'ldb-custom-style';
        style.textContent = customCSS;
        document.head.appendChild(style);
    }

    function applyAll() {
        applyRounded();
        applyCardOpacity();
        applyCardBlur();
        applyBgFullscreen();
        applyAdBlock();
        applyCustomCSS();
        updatePanelStyle();
    }

    function updatePanelStyle() {
        if (!panelElement) return;
        const bv = blurValue != null ? blurValue : 0;
        const ov = opacityValue != null ? opacityValue : 100;
        panelElement.style.backdropFilter = `blur(${bv}px)`;
        panelElement.style.webkitBackdropFilter = `blur(${bv}px)`;
        panelElement.style.background = `rgba(255, 255, 255, ${ov / 100})`;
        panelElement.style.color = '#1e1e2f';
    }

    function saveAndApply(key, value) {
        localStorage.setItem(key, value);
        initVarible();
        applyAll();
    }

    let panelCreated = false;
    let panelElement = null;

    function createPanel() {
        if (panelCreated) return;
        panelCreated = true;

        const panelHTML = `
            <div id="ldb-panel" class="l-card hidden">
                <button id="ldb-panel-close" aria-label="关闭">×</button>
                <h2>插件设置</h2>
                <h3>卡片模糊度</h3>
                <p>
                    <input id="ldb-panel-blur" type="range" min="0" max="30" value="${blurValue != null ? blurValue : 10}" />
                    <span id="blur-value">${blurValue != null ? blurValue : 10}px</span>
                </p>
                <h3>卡片不透明度</h3>
                <p>
                    <input id="ldb-panel-opacity" type="range" min="0" max="100" value="${opacityValue != null ? opacityValue : 75}" />
                    <span id="opacity-value">${opacityValue != null ? opacityValue : 75}%</span>
                </p>
                <h3>圆角曲度</h3>
                <p>
                    <input id="ldb-panel-rounded" type="range" min="0" max="30" value="${borderRadius != null ? borderRadius : 15}" />
                    <span id="rounded-value">${borderRadius != null ? borderRadius : 15}px</span>
                </p>
                <p>
                    <input id="ldb-panel-card-rounded" type="checkbox" ${cardRounded ? 'checked' : ''} />
                    <label for="ldb-panel-card-rounded">卡片圆角</label>
                </p>
                <p>
                    <input id="ldb-panel-pic-rounded" type="checkbox" ${picRounded ? 'checked' : ''} />
                    <label for="ldb-panel-pic-rounded">图片圆角</label>
                </p>
                <p>
                    <input id="ldb-panel-bgfullscreen" type="checkbox" ${bgFullscreen ? 'checked' : ''} />
                    <label for="ldb-panel-bgfullscreen">背景全屏（在 <a href="/theme/list" target="_blank">主题</a> 内页首选项卡设置背景图片）</label>
                </p>
                <p>
                    <input id="ldb-panel-adblock" type="checkbox" ${adBlock ? 'checked' : ''} />
                    <label for="ldb-panel-adblock">关闭广告</label>
                </p>
                <h3>自定义 CSS</h3>
                <p>
                    <input id="ldb-panel-customCSS" value="${customCSS}" />
                </p>
                <button id="ldb-panel-reset">还原设置</button>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = panelHTML;
        panelElement = container.firstElementChild;
        document.body.appendChild(panelElement);

        const css = `
            #ldb-panel {
                position: fixed;
                right: 35px;
                top: 50%;
                transform: translateY(-50%);
                padding: 28px 24px 24px;
                background: rgba(255, 255, 255, ${(opacityValue != null ? opacityValue : 75) / 100});
                backdrop-filter: blur(${blurValue != null ? blurValue : 10}px);
                -webkit-backdrop-filter: blur(${blurValue != null ? blurValue : 10}px);
                border-radius: 24px;
                box-shadow: 0 12px 40px rgba(0,0,0,0.15);
                color: #1e1e2f;
                transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
                z-index: 1000;
                width: min(350px, 50vw);
                max-width: 90vw;
            }
            #ldb-panel.hidden {
                opacity: 0;
                visibility: hidden;
                transform: translateY(-50%) scale(0.96);
                pointer-events: none;
            }
            #ldb-panel-close {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #ff4d4f;
                border: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.12);
                color: #fff;
                font-size: 22px;
                line-height: 1;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background 0.2s, transform 0.2s;
            }
            #ldb-panel-close:hover { background: #e04345; transform: scale(1.06); }
            #ldb-panel-close:active { transform: scale(0.92); }
            #ldb-panel h2 { margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #2c3e50; }
            #ldb-panel h3 { margin: 18px 0 6px 0; font-size: 15px; font-weight: 500; color: #34495e; }
            #ldb-panel p { margin: 6px 0 12px 0; display: flex; align-items: center; gap: 10px; font-size: 14px; }
            #ldb-panel input[type="range"] { flex: 1; accent-color: #000; height: 4px; border-radius: 2px; background: #dce3e8; cursor: pointer; }
            #ldb-panel input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #000; box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: pointer; }
            #ldb-panel input[type="checkbox"] { margin-right: 8px; width: 18px; height: 18px; accent-color: #000; cursor: pointer; }
            #ldb-panel label { cursor: pointer; user-select: none; }
            #ldb-panel-customCSS {
                width: 100%;
                min-height: 60px;
                max-height: 200px;
                padding: 6px 8px;
                font-family: monospace;
                font-size: 13px;
                resize: vertical;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }
            #ldb-panel-reset {
                display: inline-block;
                margin-top: 10px;
                padding: 8px 24px;
                background: #ecf0f1;
                border: none;
                border-radius: 30px;
                font-size: 14px;
                font-weight: 500;
                color: #2c3e50;
                cursor: pointer;
                transition: background 0.2s, transform 0.1s;
                box-shadow: 0 1px 4px rgba(0,0,0,0.05);
            }
            #ldb-panel-reset:hover { background: #d5dbe0; }
            #ldb-panel-reset:active { transform: scale(0.96); }
            #blur-value, #opacity-value, #rounded-value { display: inline-block; width: 45px; text-align: center; font-weight: 500; }
            #ldb-panel a { color: #0d3d41; text-decoration: none; }
            #ldb-panel a:hover { text-decoration: underline; }
            @media (max-width: 350px) { #ldb-panel { width: 90vw; padding: 20px 16px; right: 10px; } }
        `;
        const styleEl = document.createElement('style');
        styleEl.textContent = css;
        document.head.appendChild(styleEl);

        const roundedSlider = document.getElementById('ldb-panel-rounded');
        const roundedDisplay = document.getElementById('rounded-value');
        const closeBtn = document.getElementById('ldb-panel-close');
        const blurSlider = document.getElementById('ldb-panel-blur');
        const blurDisplay = document.getElementById('blur-value');
        const opacitySlider = document.getElementById('ldb-panel-opacity');
        const opacityDisplay = document.getElementById('opacity-value');
        const cardRoundedCb = document.getElementById('ldb-panel-card-rounded');
        const picRoundedCb = document.getElementById('ldb-panel-pic-rounded');
        const bgFullscreenCb = document.getElementById('ldb-panel-bgfullscreen');
        const adBlockCb = document.getElementById('ldb-panel-adblock');
        const customCssInput = document.getElementById('ldb-panel-customCSS');
        const resetBtn = document.getElementById('ldb-panel-reset');

        closeBtn.addEventListener('click', () => panelElement.classList.add('hidden'));

        blurSlider.addEventListener('input', function() {
            blurDisplay.textContent = this.value + 'px';
            saveAndApply("LuoguDisplayBetter-blur", this.value);
        });

        opacitySlider.addEventListener('input', function() {
            opacityDisplay.textContent = this.value + '%';
            saveAndApply("LuoguDisplayBetter-opacity", this.value);
        });

        roundedSlider.addEventListener('input', function() {
            roundedDisplay.textContent = this.value + 'px';
            saveAndApply("LuoguDisplayBetter-borderRadius", this.value);
        });

        cardRoundedCb.addEventListener('change', function() {
            saveAndApply("LuoguDisplayBetter-cardRounded", this.checked);
        });

        picRoundedCb.addEventListener('change', function() {
            saveAndApply("LuoguDisplayBetter-picRounded", this.checked);
        });

        bgFullscreenCb.addEventListener('change', function() {
            saveAndApply("LuoguDisplayBetter-bgFullscreen", this.checked);
        });

        adBlockCb.addEventListener('change', function() {
            saveAndApply("LuoguDisplayBetter-adBlock", this.checked);
        });

        customCssInput.addEventListener('input', function() {
            customCSS = this.value;
            saveAndApply("LuoguDisplayBetter-customCSS", this.value);
        });

        resetBtn.addEventListener('click', function() {
            localStorage.setItem("LuoguDisplayBetter-borderRadius", 15);
            localStorage.setItem("LuoguDisplayBetter-blur", 10);
            localStorage.setItem("LuoguDisplayBetter-cardRounded", true);
            localStorage.setItem("LuoguDisplayBetter-picRounded", true);
            localStorage.setItem("LuoguDisplayBetter-adBlock", false);
            localStorage.setItem("LuoguDisplayBetter-bgFullscreen", true);
            localStorage.setItem("LuoguDisplayBetter-opacity", 75);
            localStorage.setItem("LuoguDisplayBetter-customCSS", '');
            initVarible();
            blurSlider.value = blurValue;
            roundedSlider.value = borderRadius;
            blurDisplay.textContent = blurValue + 'px';
            opacitySlider.value = 75;
            opacityDisplay.textContent = '75%';
            roundedDisplay.textContent = '15px';
            cardRoundedCb.checked = true;
            picRoundedCb.checked = true;
            bgFullscreenCb.checked = true;
            adBlockCb.checked = false;
            customCssInput.value = '';
            applyAll();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !panelElement.classList.contains('hidden')) {
                panelElement.classList.add('hidden');
            }
        });
    }

    function togglePanel() {
        if (!panelElement) return;
        panelElement.classList.toggle('hidden');
    }

    function addCustomButton() {
        if (document.querySelector(`.sidebar.lside.bar.hide.nav-scrollbar`)) {
            const ul = document.querySelector('.nav-group.on-expand ul[data-v-a119941e]');
            if (!ul) return;
            if (ul.querySelector(`#stylePluginSettingButton`)) return;
            const sampleLi = ul.querySelector('li');
            if (!sampleLi) return;
            const newLi = document.createElement('li');
            for (const attr of sampleLi.attributes) {
                if (attr.name.startsWith('data-v-')) {
                    newLi.setAttribute(attr.name, attr.value);
                }
            }
            newLi.setAttribute('title', '美化插件设置');
            const newA = document.createElement('a');
            const sampleA = sampleLi.querySelector('a');
            if (sampleA) {
                for (const attr of sampleA.attributes) {
                    if (attr.name.startsWith('data-v-')) {
                        newA.setAttribute(attr.name, attr.value);
                    }
                }
                newA.className = sampleA.className;
                newA.setAttribute('disabled', sampleA.getAttribute('disabled') || 'false');
            }
            newA.href = '#';
            newA.id = 'stylePluginSettingButton';
            const span = document.createElement('span');
            const sampleSpan = sampleLi.querySelector('span.title');
            if (sampleSpan) {
                for (const attr of sampleSpan.attributes) {
                    if (attr.name.startsWith('data-v-')) {
                        span.setAttribute(attr.name, attr.value);
                    }
                }
                span.className = sampleSpan.className;
            }
            span.textContent = '美化插件设置';
            newA.appendChild(document.createComment(''));
            newA.appendChild(span);
            newLi.appendChild(newA);
            newA.addEventListener('click', function(event) {
                event.preventDefault();
                togglePanel();
            });
            ul.appendChild(newLi);
            return;
        }

        const appsContainer = document.querySelector('.apps');
        if (!appsContainer) return;
        if (appsContainer.querySelector(`#stylePluginSettingButton`)) return;
        const sample = appsContainer.querySelector('a');
        if (!sample) return;
        const newLink = document.createElement('a');
        for (const attr of sample.attributes) {
            if (attr.name.startsWith('data-v-')) {
                newLink.setAttribute(attr.name, attr.value);
            }
        }
        newLink.setAttribute('colorscheme', sample.getAttribute('colorscheme') || 'none');
        newLink.className = sample.className;
        newLink.href = '#';
        newLink.innerText = '美化插件设置';
        newLink.id = 'stylePluginSettingButton';
        newLink.addEventListener('click', function(event) {
            event.preventDefault();
            togglePanel();
        });
        appsContainer.appendChild(newLink);
    }

    function init() {
        const firstUsed = localStorage.getItem("LuoguDisplayBetter-FirstUsed") == null;
        if (firstUsed) {
            localStorage.setItem("LuoguDisplayBetter-FirstUsed", false);
            localStorage.setItem("LuoguDisplayBetter-borderRadius", 15);
            localStorage.setItem("LuoguDisplayBetter-blur", 10);
            localStorage.setItem("LuoguDisplayBetter-cardRounded", true);
            localStorage.setItem("LuoguDisplayBetter-picRounded", true);
            localStorage.setItem("LuoguDisplayBetter-adBlock", false);
            localStorage.setItem("LuoguDisplayBetter-bgFullscreen", true);
            localStorage.setItem("LuoguDisplayBetter-opacity", 75);
            localStorage.setItem("LuoguDisplayBetter-customCSS", '');
        }
        initVarible();
        createPanel();
        if (firstUsed) togglePanel();
        addCustomButton();
        applyAll();
        const observer = new MutationObserver(() => {
            addCustomButton();
            if (document.querySelector('.theme-page')) applyAll();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("load", init);
})();
