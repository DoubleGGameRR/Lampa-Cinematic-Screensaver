/* Lampa Cinematic Screensaver 1.0.0
 * Native Lampa Screensaver adapter. Free 4K videos from Pexels.
 * https://github.com/DoubleGGameRR/Lampa-Cinematic-Screensaver
 */
(function () {
    'use strict';

    if (window.lampa_cinematic_screensaver_loaded) return;
    window.lampa_cinematic_screensaver_loaded = true;

    var PREFIX = 'lcs_';
    var COMPONENT = 'lcs_cinematic';
    var MAX_LOAD_MS = 20000;
    var CLIPS = [
        { theme: 'autumn', name: 'Осенняя река', url: 'https://videos.pexels.com/video-files/5698883/5698883-uhd_3840_2160_30fps.mp4', page: 'https://www.pexels.com/video/forest-in-autumn-5698883/' },
        { theme: 'autumn', name: 'Осенний лес', url: 'https://videos.pexels.com/video-files/5592328/5592328-uhd_3840_2160_24fps.mp4', page: 'https://www.pexels.com/video/low-angle-shot-of-autumn-forest-5592328/' },
        { theme: 'autumn', name: 'Лес с высоты', url: 'https://videos.pexels.com/video-files/10286777/10286777-hd_3840_2160_24fps.mp4', page: 'https://www.pexels.com/video/forest-on-hill-in-autumn-10286777/' },
        { theme: 'halloween', name: 'Тыква в тумане', url: 'https://videos.pexels.com/video-files/33791636/14343079_3840_2160_25fps.mp4', page: 'https://www.pexels.com/video/creepy-halloween-jack-o-lantern-scene-33791636/' },
        { theme: 'halloween', name: 'Хэллоуинские фонари', url: 'https://videos.pexels.com/video-files/34189220/14491974_3840_2160_25fps.mp4', page: 'https://www.pexels.com/video/spooky-halloween-jack-o-lanterns-in-darkness-34189220/' },
        { theme: 'neon', name: 'Городские огни', url: 'https://videos.pexels.com/video-files/16834483/16834483-uhd_3840_2160_24fps.mp4', page: 'https://www.pexels.com/video/a-car-is-parked-in-front-of-a-neon-sign-16834483/' },
        { theme: 'neon', name: 'Неоновые улицы', url: 'https://videos.pexels.com/video-files/32013493/13644866_3840_2160_25fps.mp4', page: 'https://www.pexels.com/video/nighttime-street-scene-with-neon-signs-32013493/' },
        { theme: 'cozy', name: 'Уютная гостиная', url: 'https://videos.pexels.com/video-files/2110972/2110972-uhd_3840_2160_30fps.mp4', page: 'https://www.pexels.com/video/a-fireplace-in-a-living-room-2110972/' },
        { theme: 'cozy', name: 'Живой огонь', url: 'https://videos.pexels.com/video-files/10482174/10482174-hd_3840_2160_24fps.mp4', page: 'https://www.pexels.com/video/close-up-on-fire-in-fireplace-10482174/' }
    ];

    var ready = false;
    var previousNative = null;

    function storage(name, fallback) {
        try { return Lampa.Storage.get(PREFIX + name, fallback); }
        catch (error) { return fallback; }
    }
    function setting(name, fallback) {
        return String(storage(name, fallback));
    }
    function enabled() {
        return setting('enabled', 'true') !== 'false';
    }
    function getNative(key, fallback) {
        try { return Lampa.Storage.get(key, fallback); }
        catch (error) { return fallback; }
    }
    function setNative(key, value) {
        try { Lampa.Storage.set(key, value); } catch (error) {}
    }
    function notify(message) {
        try { if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show(message); }
        catch (error) {}
    }
    function getFade() {
        var value = parseInt(setting('fade', '900'), 10);
        return value === 500 || value === 900 || value === 1400 ? value : 900;
    }
    function mode() {
        var value = setting('mode', 'shuffle');
        return /^(shuffle|cycle|autumn|halloween|neon|cozy)$/.test(value) ? value : 'shuffle';
    }
    function nativeScreensaver() {
        return Lampa && Lampa.Screensaver &&
            Lampa.Screensaver.class_list && Lampa.Screensaver.resetTimer;
    }
    function playerOpened() {
        try { return !!(Lampa.Player && Lampa.Player.opened && Lampa.Player.opened()); }
        catch (error) { return false; }
    }
    function applyNative() {
        if (!nativeScreensaver()) return;
        if (enabled()) {
            setNative('screensaver', true);
            setNative('screensaver_type', 'cinematic');
            setNative('screensaver_time', Number(setting('time', '3')) || 3);
            if (playerOpened()) Lampa.Screensaver.disable();
            else Lampa.Screensaver.enable();
        } else {
            Lampa.Screensaver.stop();
            if (previousNative) {
                setNative('screensaver', previousNative.active);
                setNative('screensaver_type', previousNative.type);
                setNative('screensaver_time', previousNative.time);
            } else setNative('screensaver', false);
            Lampa.Screensaver.resetTimer();
        }
    }

    function Cinematic() {
        this.root = null;
        this.video = null;
        this.timer = null;
        this.stallTimer = null;
        this.current = -1;
        this.tried = {};
        this.triedCount = 0;
        this.destroyed = false;
        this.transitioning = false;
        this.starting = false;
        this.started = false;
        this.lastTime = -1;
        this.queue = [];
        this.order = [];
        this.index = 0;
    }

    Cinematic.prototype.create = function () {
        var self = this;
        this.root = $('<div class="lcs-screen"></div>');
        this.root.css({
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            overflow: 'hidden', background: '#06040a'
        });
        var video = document.createElement('video');
        this.video = video;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('preload', 'auto');
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.controls = false;
        video.style.cssText =
            'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;' +
            'background:#06040a;opacity:0;transition:opacity ' + getFade() + 'ms ease;';
        this.root.append(video);

        // One decoder at a time: more reliable for Samsung Tizen than dual 4K videos.
        video.addEventListener('playing', function () {
            if (self.destroyed) return;
            self.starting = false;
            self.started = true;
            self.transitioning = false;
            self.tried = {};
            self.triedCount = 0;
            self.lastTime = -1;
            self.clearStall();
            self.armStall();
            setTimeout(function () {
                if (!self.destroyed) video.style.opacity = '1';
            }, 70);
        });
        video.addEventListener('timeupdate', function () {
            if (self.destroyed || self.transitioning || !self.started) return;
            if (video.currentTime > self.lastTime + 0.25) {
                self.lastTime = video.currentTime;
                self.armStall();
            }
            if (isFinite(video.duration) &&
                video.duration > 0 && video.currentTime >= video.duration - 1.4) {
                self.next();
            }
        });
        video.addEventListener('ended', function () { self.next(); });
        video.addEventListener('error', function () {
            if (!self.destroyed && !self.transitioning) self.failed();
        });
        video.addEventListener('stalled', function () {
            if (!self.destroyed && !self.transitioning) self.armStall();
        });

        this.preparePlaylist();
        this.next();
    };

    Cinematic.prototype.preparePlaylist = function () {
        var type = mode(), i;
        this.order = [];
        for (i = 0; i < CLIPS.length; i++) {
            if (type === 'shuffle' || type === 'cycle' || CLIPS[i].theme === type) {
                this.order.push(i);
            }
        }
        if (type === 'shuffle') {
            for (i = this.order.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = this.order[i];
                this.order[i] = this.order[j];
                this.order[j] = tmp;
            }
            if (this.order.length > 1 && this.order[0] === this.current) {
                this.order.push(this.order.shift());
            }
        }
        this.index = 0;
    };

    Cinematic.prototype.pick = function () {
        if (this.index >= this.order.length) this.preparePlaylist();
        if (!this.order.length) return -1;
        return this.order[this.index++];
    };

    Cinematic.prototype.clearStall = function () {
        clearTimeout(this.stallTimer);
        this.stallTimer = null;
    };

    Cinematic.prototype.armStall = function () {
        var self = this;
        this.clearStall();
        this.stallTimer = setTimeout(function () { self.failed(); }, MAX_LOAD_MS);
    };

    Cinematic.prototype.clearTimers = function () {
        clearTimeout(this.timer);
        this.timer = null;
        this.clearStall();
    };

    Cinematic.prototype.next = function () {
        var self = this;
        if (this.destroyed || this.transitioning) return;
        this.transitioning = true;
        this.clearTimers();
        this.video.style.opacity = '0';
        this.timer = setTimeout(function () {
            if (self.destroyed) return;
            self.playNext();
        }, this.started ? getFade() : 0);
    };

    Cinematic.prototype.playNext = function () {
        var self = this;
        if (this.destroyed) return;
        this.clearTimers();
        this.transitioning = false;
        this.started = false;
        this.starting = false;
        var next = this.pick();
        if (next < 0) { this.failed(); return; }
        this.current = next;
        this.starting = true;
        var video = this.video;
        video.pause();
        video.style.opacity = '0';
        video.muted = true;
        video.volume = 0;
        video.src = CLIPS[next].url;
        this.armStall();
        try {
            video.load();
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    // A loadeddata retry helps on older Tizen WebViews.
                    if (!self.destroyed && self.starting) {
                        self.timer = setTimeout(function () {
                            if (!self.destroyed && self.starting) self.failed();
                        }, 2500);
                    }
                });
            }
        } catch (error) { this.failed(); }
    };

    Cinematic.prototype.failed = function () {
        var self = this;
        if (this.destroyed || this.transitioning) return;
        this.clearTimers();
        this.starting = false;
        this.started = false;
        this.tried[this.current] = true;
        this.triedCount = Object.keys(this.tried).length;
        this.video.style.opacity = '0';
        this.transitioning = true;
        this.timer = setTimeout(function () {
            self.transitioning = false;
            if (self.destroyed) return;
            if (self.triedCount >= self.order.length) {
                self.video.pause();
                self.video.removeAttribute('src');
                self.root.append($('<div></div>').text('Видео недоступны. Проверьте интернет и попробуйте позже.').css({
                    position: 'absolute', top: '48%', left: '5%', width: '90%',
                    color: '#baaac7', textAlign: 'center', fontSize: '1.5em'
                }));
                return;
            }
            self.playNext();
        }, 250);
    };

    Cinematic.prototype.render = function () {
        return this.root;
    };

    Cinematic.prototype.destroy = function () {
        this.destroyed = true;
        this.clearTimers();
        if (this.video) {
            this.video.pause();
            this.video.removeAttribute('src');
            this.video.load();
            this.video = null;
        }
        if (this.root) {
            this.root.remove();
            this.root = null;
        }
    };

    function addSettings() {
        if (!Lampa.SettingsApi || !Lampa.SettingsApi.addComponent || !Lampa.SettingsApi.addParam) {
            notify('Cinematic: настройки в этой версии Lampa недоступны');
            return;
        }
        Lampa.SettingsApi.addComponent({
            component: COMPONENT,
            name: 'Cinematic Screensaver',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m8 9 7 3-7 3z"/></svg>'
        });
        Lampa.SettingsApi.addParam({
            component: COMPONENT,
            param: { name: PREFIX + 'enabled', type: 'trigger', 'default': true },
            field: { name: 'Включить заставку', description: 'Автоматический запуск при бездействии' },
            onChange: applyNative
        });
        Lampa.SettingsApi.addParam({
            component: COMPONENT,
            param: { name: PREFIX + 'time', type: 'select', values: {
                '1': '1 минута', '3': '3 минуты', '5': '5 минут', '10': '10 минут'
            }, 'default': '3' },
            field: { name: 'Время бездействия', description: 'По умолчанию — 3 минуты' },
            onChange: applyNative
        });
        Lampa.SettingsApi.addParam({
            component: COMPONENT,
            param: { name: PREFIX + 'mode', type: 'select', values: {
                shuffle: 'Все темы случайно',
                cycle: 'Все темы по порядку',
                autumn: 'Только осень',
                halloween: 'Только Halloween',
                neon: 'Только неоновый город',
                cozy: 'Только камин и уют'
            }, 'default': 'shuffle' },
            field: { name: 'Подборка видео', description: 'Осень, Halloween, неон, уют' }
        });
        Lampa.SettingsApi.addParam({
            component: COMPONENT,
            param: { name: PREFIX + 'fade', type: 'select', values: {
                '500': 'Быстро', '900': 'Плавно', '1400': 'Очень плавно'
            }, 'default': '900' },
            field: { name: 'Переходы', description: 'Мягкое затемнение между роликами' }
        });
        Lampa.SettingsApi.addParam({
            component: COMPONENT,
            param: { name: PREFIX + 'preview', type: 'button' },
            field: { name: 'Показать сейчас', description: 'Запустить заставку без ожидания' },
            onChange: function () {
                if (!enabled()) { notify('Сначала включите заставку'); return; }
                if (playerOpened()) { notify('Закройте фильм перед предпросмотром'); return; }
                if (nativeScreensaver()) Lampa.Screensaver.show('cinematic');
            }
        });
    }

    function init() {
        if (ready || !window.Lampa) return;
        ready = true;
        if (!nativeScreensaver()) {
            notify('Cinematic: эта версия Lampa не поддерживает встроенный Screensaver');
            return;
        }
        previousNative = {
            active: getNative('screensaver', false),
            type: getNative('screensaver_type', 'nature'),
            time: getNative('screensaver_time', 3)
        };
        Lampa.Screensaver.class_list.cinematic = Cinematic;
        addSettings();
        if (Lampa.Player && Lampa.Player.listener && Lampa.Player.listener.follow) {
            Lampa.Player.listener.follow('create', function () {
                if (nativeScreensaver()) Lampa.Screensaver.disable();
            });
            Lampa.Player.listener.follow('start', function () {
                if (nativeScreensaver()) Lampa.Screensaver.disable();
            });
            Lampa.Player.listener.follow('external', function () {
                if (nativeScreensaver()) Lampa.Screensaver.disable();
            });
            Lampa.Player.listener.follow('destroy', function () {
                if (nativeScreensaver()) applyNative();
            });
        }
        document.addEventListener('visibilitychange', function () {
            if (document.hidden && nativeScreensaver()) Lampa.Screensaver.stop();
            else if (!document.hidden && nativeScreensaver()) applyNative();
        });
        applyNative();
        console.log('[Cinematic Screensaver] 1.0.0 ready, 9 curated UHD clips');
    }

    if (window.appready && window.Lampa) init();
    else if (window.Lampa && Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') init();
        });
    } else {
        var attempts = 0;
        var watch = setInterval(function () {
            attempts++;
            if (window.Lampa && window.appready) { clearInterval(watch); init(); }
            if (attempts > 60) clearInterval(watch);
        }, 500);
    }
})();
