/* Lampa Cinematic Screensaver 2.2.0
 * Native Lampa Screensaver adapter. Free 4K videos from Pexels.
 * https://github.com/DoubleGGameRR/Lampa-Cinematic-Screensaver
 */
(function () {
    'use strict';

    if (window.lampa_cinematic_screensaver_loaded) return;
    window.lampa_cinematic_screensaver_loaded = true;

    var PREFIX = 'lcs_';
    var COMPONENT = 'lcs_cinematic';
    var MAX_LOAD_MS = 30000;
    var CLIPS = [
        // Video-only collection: moving drone footage, rain, animated flames/fog.
        { theme:'autumn', name:'Пролёт над осенним лесом', url:'https://videos.pexels.com/video-files/5563083/5563083-uhd_3840_2160_24fps.mp4', duration:30, page:'https://www.pexels.com/video/beautiful-trees-in-the-forest-during-autumn-5563083/' },
        { theme:'halloween', name:'Огненная 3D-тыква', url:'https://videos.pexels.com/video-files/9867271/9867271-uhd_3840_2160_24fps.mp4', duration:20, page:'https://www.pexels.com/ru-ru/video/9867271/' },
        { theme:'halloween', name:'Призрак среди тыкв', url:'https://videos.pexels.com/video-files/33791637/14343127_3840_2160_25fps.mp4', duration:20, page:'https://www.pexels.com/video/spooky-halloween-ghost-and-pumpkin-decor-33791637/' },
        // Each URL is the UHD 3840x2160 variant returned by Pexels's download redirect.
        { theme:'autumn', name:'Туманная осенняя дорога', url:'https://videos.pexels.com/video-files/10323686/10323686-hd_3840_2160_30fps.mp4', duration:60, page:'https://www.pexels.com/video/driving-ground-road-through-forest-to-fields-in-autumn-10323686/' },
        { theme:'autumn', name:'Ручей среди красной листвы', url:'https://videos.pexels.com/video-files/10402872/10402872-hd_3840_2160_24fps.mp4', duration:72, page:'https://www.pexels.com/video/stream-in-forest-10402872/' },
        { theme:'autumn', name:'Золотой лес', url:'https://videos.pexels.com/video-files/7209440/7209440-uhd_3840_2160_30fps.mp4', duration:60, page:'https://www.pexels.com/video/forest-during-autumn-season-7209440/' },
        { theme:'autumn', name:'Туман над лесным озером', url:'https://videos.pexels.com/video-files/13602957/13602957-uhd_3840_2160_30fps.mp4', duration:68, page:'https://www.pexels.com/video/fog-over-lake-and-woods-13602957/' },
        { theme:'autumn', name:'Осенняя лесная река', url:'https://videos.pexels.com/video-files/6435067/6435067-uhd_3840_2160_30fps.mp4', duration:60, page:'https://www.pexels.com/video/flowing-river-in-the-forest-6435067/' },
        { theme:'halloween', name:'Тыква и мистический туман', url:'https://videos.pexels.com/video-files/33791668/14343144_3840_2160_25fps.mp4', duration:72, page:'https://www.pexels.com/video/spooky-halloween-pumpkin-with-fog-effect-33791668/' },
        { theme:'halloween', name:'Череп при свечах', url:'https://videos.pexels.com/video-files/1730395/1730395-uhd_3840_2160_25fps.mp4', duration:60, page:'https://www.pexels.com/video/a-skull-with-lighted-tea-candles-1730395/' },
        { theme:'halloween', name:'Мистические свечи', url:'https://videos.pexels.com/video-files/33791642/14343115_3840_2160_25fps.mp4', duration:51, page:'https://www.pexels.com/video/spooky-candlelit-halloween-atmosphere-33791642/' },
        { theme:'halloween', name:'Череп в тумане', url:'https://videos.pexels.com/video-files/33791646/14343055_3840_2160_25fps.mp4', duration:47, page:'https://www.pexels.com/video/spooky-skull-with-candle-lights-for-halloween-33791646/' },
        { theme:'halloween', name:'Резные тыквы', url:'https://videos.pexels.com/video-files/34168522/14485465_3840_2160_25fps.mp4', duration:37, page:'https://www.pexels.com/video/carving-pumpkins-for-a-spooky-halloween-34168522/' },
        { theme:'halloween', name:'Призрак и светящиеся тыквы', url:'https://videos.pexels.com/video-files/29142708/12588140_3840_2160_25fps.mp4', duration:21, page:'https://www.pexels.com/video/spooky-halloween-decor-with-ghost-figure-29142708/' },
        { theme:'halloween', name:'Осенние украшения и фонари', url:'https://videos.pexels.com/video-files/34388791/14567828_3840_2160_25fps.mp4', duration:21, page:'https://www.pexels.com/video/halloween-pumpkin-carving-workshop-setup-34388791/' },
        { theme:'halloween', name:'Мистическая рука в свечах', url:'https://videos.pexels.com/video-files/33791640/14343167_3840_2160_25fps.mp4', duration:19, page:'https://www.pexels.com/video/spooky-halloween-hand-amidst-flickering-candles-33791640/' },
        { theme:'halloween', name:'Светящиеся тыквы в темноте', url:'https://videos.pexels.com/video-files/34189220/14491974_3840_2160_25fps.mp4', duration:18, page:'https://www.pexels.com/video/spooky-halloween-jack-o-lanterns-in-darkness-34189220/' },
        { theme:'neon', name:'Тихая дождливая улица', url:'https://videos.pexels.com/video-files/15596316/15596316-uhd_3840_2160_24fps.mp4', duration:17, page:'https://www.pexels.com/video/a-rainy-night-in-a-city-street-with-motorcycles-parked-on-the-side-15596316/' },
        { theme:'neon', name:'Дождливый Лондон', url:'https://videos.pexels.com/video-files/5108691/5108691-uhd_3840_2160_30fps.mp4', duration:16, page:'https://www.pexels.com/video/rainy-night-5108691/' },
        { theme:'neon', name:'Огни у реки', url:'https://videos.pexels.com/video-files/12737255/12737255-uhd_3840_2160_24fps.mp4', duration:25, page:'https://www.pexels.com/video/city-at-night-12737255/' },
        { theme:'neon', name:'Ночной город', url:'https://videos.pexels.com/video-files/32013493/13644866_3840_2160_25fps.mp4', duration:20, page:'https://www.pexels.com/video/nighttime-street-scene-with-neon-signs-32013493/' },
        { theme:'cozy', name:'Свеча крупным планом', url:'https://videos.pexels.com/video-files/14171491/14171491-uhd_3840_2160_25fps.mp4', duration:237, page:'https://www.pexels.com/video/flame-in-wax-candle-14171491/' },
        { theme:'cozy', name:'Камин в гостиной', url:'https://videos.pexels.com/video-files/2110972/2110972-uhd_3840_2160_30fps.mp4', duration:30, page:'https://www.pexels.com/video/a-fireplace-in-a-living-room-2110972/' },
        { theme:'cozy', name:'Горящий камин', url:'https://videos.pexels.com/video-files/10482174/10482174-hd_3840_2160_24fps.mp4', duration:30, page:'https://www.pexels.com/video/close-up-on-fire-in-fireplace-10482174/' }
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
    function loadNativeBackup() {
        var existing = storage('native_backup_v1', null);
        if (existing && typeof existing === 'object' &&
            typeof existing.type === 'string' && existing.time) return existing;
        var snapshot = {
            active: getNative('screensaver', false),
            type: getNative('screensaver_type', 'nature'),
            time: getNative('screensaver_time', 3)
        };
        // Older installations might have started with our type already active.
        if (snapshot.type === 'cinematic') {
            snapshot = { active: false, type: 'nature', time: 3 };
        }
        try { Lampa.Storage.set(PREFIX + 'native_backup_v1', snapshot); }
        catch (error) {}
        return snapshot;
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
            if (!playerOpened()) Lampa.Screensaver.enable();
            else Lampa.Screensaver.disable();
        }
    }

    var THEME_ORDER = ['autumn', 'halloween', 'neon', 'cozy'];

    function Cinematic() {
        this.root = null;
        this.slots = [];
        this.active = -1;
        this.pending = -1;
        this.theme = '';
        this.themeStarted = 0;
        this.chapterOrder = [];
        this.chapterIndex = 0;
        this.playlist = [];
        this.playIndex = 0;
        this.lastClip = -1;
        this.failedClips = {};
        this.failedCount = 0;
        this.destroyed = false;
        this.swapping = false;
        this.transitionTimer = null;
        this.loadingTimer = null;
        this.startTimer = null;
        this.info = null;
        this.currentMode = mode();
        this.widget = null;
        this.clockText = null;
        this.dateText = null;
        this.tempText = null;
        this.weatherText = null;
        this.clockTimer = null;
        this.weatherTimer = null;
        this.weatherRequest = null;
        this.weatherUpdated = false;
        this.clockPanel = null;
        this.weatherPanel = null;
        this.motionTimer = null;
        this.motionPosition = 0;
        this.motionStalls = 0;
    }

    Cinematic.prototype.fade = function () {
        var value = parseInt(setting('fade', '2800'), 10);
        return value === 1600 || value === 2800 || value === 4000 ? value : 2800;
    };

    Cinematic.prototype.minutes = function () {
        var value = parseInt(setting('chapter', '7'), 10);
        return value === 5 || value === 7 || value === 10 ? value : 7;
    };

    Cinematic.prototype.create = function () {
        var self = this;
        this.root = $('<div class="lcs-screen"></div>');
        this.root.css({
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            overflow: 'hidden', background: '#08060b'
        });
        for (var i = 0; i < 2; i++) {
            (function (slotIndex) {
                var video = document.createElement('video');
                video.setAttribute('muted', '');
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('preload', 'auto');
                video.autoplay = false;
                video.playsInline = true;
                video.muted = true;
                video.defaultMuted = true;
                video.volume = 0;
                video.controls = false;
                video.preload = 'auto';
                video.style.cssText =
                    'position:absolute;top:0;left:0;width:100%;height:100%;' +
                    'object-fit:cover;opacity:0;z-index:' + (slotIndex+1) + ';' +
                    'transition:opacity ' + self.fade() + 'ms ease-in-out;' +
                    'background:transparent;';
                self.slots.push({
                    video: video, clip: -1, loaded: false,
                    starting: false, playing: false, exhausted: false
                });
                self.root.append(video);
                video.addEventListener('loadeddata', function () { self.onLoaded(slotIndex); });
                video.addEventListener('canplay', function () { self.onLoaded(slotIndex); });
                video.addEventListener('playing', function () { self.onPlaying(slotIndex); });
                video.addEventListener('timeupdate', function () { self.onTime(slotIndex); });
                video.addEventListener('ended', function () { self.onEnded(slotIndex); });
                video.addEventListener('error', function () { self.onError(slotIndex); });
            })(i);
        }
        this.info = $('<div></div>').css({
            position: 'absolute', bottom: '6%', left: '5%', width: '90%',
            color: '#e9d8ef', fontSize: '1.25em', opacity: 0, zIndex: 9,
            pointerEvents: 'none', textShadow: '0 2px 12px #000'
        });
        this.root.append(this.info);
        this.buildWeatherClock();
        this.chooseChapter();
        this.startClip(0, this.takeClip(), true);
        this.startMotionGuard();
    };

    Cinematic.prototype.chooseChapter = function () {
        this.currentMode = mode();
        if (this.currentMode === 'shuffle' || this.currentMode === 'cycle') {
            if (this.chapterIndex >= this.chapterOrder.length) {
                this.chapterOrder = THEME_ORDER.slice();
                if (this.currentMode === 'shuffle') shuffle(this.chapterOrder);
                if (this.chapterOrder.length > 1 && this.chapterOrder[0] === this.theme) {
                    this.chapterOrder.push(this.chapterOrder.shift());
                }
                this.chapterIndex = 0;
            }
            this.theme = this.chapterOrder[this.chapterIndex++];
        } else {
            this.theme = this.currentMode;
        }
        this.themeStarted = Date.now();
        this.playlist = [];
        this.playIndex = 0;
    };

    function shuffle(items) {
        for (var i = items.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var swap = items[i];
            items[i] = items[j];
            items[j] = swap;
        }
    }

    Cinematic.prototype.takeClip = function () {
        if (Date.now() - this.themeStarted >= this.minutes() * 60000) {
            this.chooseChapter();
        }
        if (this.playIndex >= this.playlist.length) {
            this.playlist = [];
            for (var i = 0; i < CLIPS.length; i++) {
                if (CLIPS[i].theme === this.theme && !this.failedClips[i]) this.playlist.push(i);
            }
            shuffle(this.playlist);
            // Always start each chapter with an unmistakably moving video.
            var highlights = {
                autumn: 'Пролёт над осенним лесом',
                halloween: 'Огненная 3D-тыква',
                neon: 'Дождливый Лондон',
                cozy: 'Горящий камин'
            };
            var highlight = highlights[this.theme];
            if (this.playlist.length && this.lastClip < 0 && highlight) {
                for (var h = 0; h < this.playlist.length; h++) {
                    if (CLIPS[this.playlist[h]].name === highlight) {
                        var first = this.playlist[0];
                        this.playlist[0] = this.playlist[h];
                        this.playlist[h] = first;
                        break;
                    }
                }
            }
            if (this.playlist.length > 1 && this.playlist[0] === this.lastClip) {
                this.playlist.push(this.playlist.shift());
            }
            this.playIndex = 0;
        }
        while (this.playIndex < this.playlist.length &&
               this.failedClips[this.playlist[this.playIndex]]) this.playIndex++;
        if (this.playIndex >= this.playlist.length) return -1;
        this.lastClip = this.playlist[this.playIndex++];
        return this.lastClip;
    };

    Cinematic.prototype.clearLoading = function () {
        clearTimeout(this.loadingTimer);
        this.loadingTimer = null;
    };

    Cinematic.prototype.resetVideo = function (slot) {
        var target = this.slots[slot];
        if (!target) return;
        var video = target.video;
        try {
            video.pause();
            video.removeAttribute('src');
            video.load();
        } catch (error) {}
        target.clip = -1;
        target.loaded = false;
        target.starting = false;
        target.playing = false;
        target.exhausted = false;
        video.style.opacity = '0';
    };

    Cinematic.prototype.startClip = function (slot, index, initial) {
        if (this.destroyed) return;
        if (index < 0) {
            this.reportUnavailable();
            return;
        }
        this.resetVideo(slot);
        var target = this.slots[slot];
        target.clip = index;
        target.video.muted = true;
        target.video.volume = 0;
        target.video.style.zIndex = initial ? '2' : '3';
        target.video.style.transition = 'opacity ' + this.fade() + 'ms ease-in-out';
        target.video.src = CLIPS[index].url;
        if (!initial) this.pending = slot;
        this.clearLoading();
        var self = this;
        this.loadingTimer = setTimeout(function () {
            if (!self.destroyed && target.clip === index && !target.loaded) self.onError(slot);
        }, MAX_LOAD_MS);
        try {
            target.video.load();
            if (initial) {
                this.active = slot;
                this.startPlaying(slot);
            }
        } catch (error) {
            this.onError(slot);
        }
    };

    Cinematic.prototype.startPlaying = function (slot) {
        if (this.destroyed || slot < 0) return;
        var target = this.slots[slot];
        if (!target || target.starting || target.playing) return;
        target.starting = true;
        target.video.muted = true;
        target.video.volume = 0;
        var self = this;
        try {
            var promise = target.video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    if (!self.destroyed && target.clip >= 0 && !target.playing) {
                        self.onError(slot);
                    }
                });
            }
        } catch (error) { this.onError(slot); }
    };

    Cinematic.prototype.onLoaded = function (slot) {
        if (this.destroyed) return;
        var target = this.slots[slot];
        if (target.clip < 0) return;
        target.loaded = true;
        this.clearLoading();
        if (slot === this.pending) this.checkTransition();
    };

    Cinematic.prototype.onPlaying = function (slot) {
        if (this.destroyed) return;
        var target = this.slots[slot];
        if (target.clip < 0) return;
        target.playing = true;
        target.starting = false;
        this.failedCount = 0;
        this.clearLoading();
        if (slot === this.pending) {
            this.crossfade();
        } else if (slot === this.active) {
            this.motionPosition = -1;
            this.motionStalls = 0;
            var self = this;
            this.startTimer = setTimeout(function () {
                if (!self.destroyed) target.video.style.opacity = '1';
            }, 90);
        }
    };

    Cinematic.prototype.queueNext = function () {
        if (this.destroyed || this.pending >= 0 || this.swapping || this.active < 0) return;
        var next = this.takeClip();
        if (next < 0) {
            this.reportUnavailable();
            return;
        }
        this.startClip(1 - this.active, next, false);
    };

    Cinematic.prototype.checkTransition = function () {
        if (this.destroyed || this.swapping || this.pending < 0) return;
        if (!this.slots[this.pending].loaded) return;
        var current = this.slots[this.active];
        if (!current) return;
        var video = current.video;
        var left = video.duration - video.currentTime;
        if (current.exhausted || (isFinite(left) && left <= this.fade() / 1000 + 0.7)) {
            this.startPlaying(this.pending);
        }
    };

    Cinematic.prototype.onTime = function (slot) {
        if (this.destroyed || slot !== this.active || this.swapping) return;
        var current = this.slots[slot], video = current.video;
        if (!isFinite(video.duration) || video.duration <= 0) return;
        var left = video.duration - video.currentTime;
        if (left <= Math.max(14, this.fade()/1000 + 5)) this.queueNext();
        if (left <= this.fade() / 1000 + 0.7) this.checkTransition();
    };

    Cinematic.prototype.onEnded = function (slot) {
        if (this.destroyed || slot !== this.active || this.swapping) return;
        this.slots[slot].exhausted = true;
        this.queueNext();
        this.checkTransition();
        // HTML5 video preserves the last decoded frame while the next video buffers.
    };

    Cinematic.prototype.crossfade = function () {
        if (this.destroyed || this.swapping || this.pending < 0) return;
        var oldSlot = this.active;
        var newSlot = this.pending;
        var old = this.slots[oldSlot].video;
        var next = this.slots[newSlot].video;
        this.swapping = true;
        next.style.zIndex = '3';
        old.style.zIndex = '2';
        next.style.opacity = '0';
        var self = this;
        clearTimeout(this.startTimer);
        this.startTimer = setTimeout(function () {
            if (self.destroyed) return;
            next.style.opacity = '1';
            old.style.opacity = '0';
            self.transitionTimer = setTimeout(function () {
                if (self.destroyed) return;
                self.active = newSlot;
                self.motionPosition = -1;
                self.motionStalls = 0;
                self.pending = -1;
                self.swapping = false;
                self.resetVideo(oldSlot);
                next.style.zIndex = '2';
                // If a clip is very short, prebuffer the next one immediately.
                self.onTime(newSlot);
            }, self.fade() + 100);
        }, 100);
    };

    // A decoder can display its first frame indefinitely without firing "error".
    // Detect that state and skip the broken stream instead of showing a "photo".
    Cinematic.prototype.startMotionGuard = function () {
        var self = this;
        this.motionPosition = -1;
        this.motionStalls = 0;
        this.motionTimer = setInterval(function () {
            if (self.destroyed || self.swapping || self.active < 0) return;
            var target = self.slots[self.active];
            if (!target || target.clip < 0) return;
            if (target.video.ended) {
                self.onEnded(self.active);
                return;
            }
            if (!target.playing) return; // The initial load watchdog handles that case.
            var position = Number(target.video.currentTime);
            if (!isFinite(position)) return;
            if (position > self.motionPosition + 0.12) {
                self.motionPosition = position;
                self.motionStalls = 0;
            } else {
                self.motionStalls++;
                if (self.motionStalls >= 3) {
                    self.motionStalls = 0;
                    self.onError(self.active);
                }
            }
        }, 6000);
    };

    Cinematic.prototype.onError = function (slot) {
        if (this.destroyed || this.swapping) return;
        var target = this.slots[slot];
        if (!target || target.clip < 0) return;
        this.failedClips[target.clip] = true;
        this.failedCount++;
        this.clearLoading();
        this.resetVideo(slot);
        if (slot === this.pending) {
            this.pending = -1;
            this.queueNext();
        } else if (slot === this.active) {
            this.active = -1;
            if (this.failedCount >= CLIPS.length) {
                this.reportUnavailable();
            } else {
                var next = this.takeClip();
                this.startClip(slot, next, true);
            }
        }
    };

    Cinematic.prototype.reportUnavailable = function () {
        if (!this.info || this.destroyed) return;
        this.info.text('Видео недоступны. Проверьте интернет или попробуйте другую тему.');
        this.info.css({ opacity: 1 });
    };

    // Location: Микитинці / Mykytyntsi, Ivano-Frankivsk, Ukraine
    // Coordinates 48°53'13"N, 24°45'4"E (Wikidata).
    // Free non-commercial Open-Meteo endpoint, no key required.
    Cinematic.prototype.buildWeatherClock = function () {
        if (setting('overlay', 'true') === 'false') return;
        var self = this;
        // Two independent, large but unobtrusive overlays.
        // Weather: bottom left. Clock & date: bottom right.
        this.weatherPanel = $('<div class="lcs-weather"></div>').css({
            position: 'absolute', left: '3.5%', bottom: '4%', zIndex: 25,
            width: '37%', maxWidth: '630px', padding: '20px 28px 22px',
            borderRadius: '17px', borderLeft: '4px solid rgba(255,164,74,0.8)',
            background: 'linear-gradient(90deg,rgba(7,6,13,0.79),rgba(7,6,13,0.20))',
            color: '#fff', pointerEvents: 'none',
            textShadow: '0 2px 11px rgba(0,0,0,0.96)',
            boxShadow: '0 6px 30px rgba(0,0,0,0.22)'
        });
        var place = $('<div></div>').text('МИКИТИНЦЫ').css({
            fontSize: '24px', fontWeight: '600', letterSpacing: '2px',
            color: '#f6e5d1'
        });
        var region = $('<div></div>').text('Ивано-Франковская область').css({
            fontSize: '18px', marginTop: '5px', color: '#e3dce8'
        });
        this.tempText = $('<div></div>').text('—°C').css({
            fontSize: '64px', lineHeight: '1.05', fontWeight: '400',
            marginTop: '14px', fontVariantNumeric: 'tabular-nums'
        });
        this.weatherText = $('<div></div>').text('Получаем погоду…').css({
            fontSize: '27px', marginTop: '6px', color: '#fff', fontWeight: '400'
        });
        var source = $('<div></div>').text('Погода: Open-Meteo').css({
            fontSize: '14px', marginTop: '12px', color: '#d2cbd7'
        });
        this.weatherPanel.append(place);
        this.weatherPanel.append(region);
        this.weatherPanel.append(this.tempText);
        this.weatherPanel.append(this.weatherText);
        this.weatherPanel.append(source);
        this.root.append(this.weatherPanel);

        this.clockPanel = $('<div class="lcs-clock"></div>').css({
            position: 'absolute', right: '3.5%', bottom: '4%', zIndex: 25,
            width: '34%', maxWidth: '580px', padding: '22px 28px 24px',
            borderRadius: '17px', borderRight: '4px solid rgba(175,130,255,0.72)',
            background: 'linear-gradient(270deg,rgba(7,6,13,0.77),rgba(7,6,13,0.18))',
            color: '#fff', textAlign: 'right', pointerEvents: 'none',
            textShadow: '0 2px 12px rgba(0,0,0,0.96)',
            boxShadow: '0 6px 30px rgba(0,0,0,0.20)'
        });
        this.clockText = $('<div></div>').css({
            fontSize: '88px', fontWeight: '300', lineHeight: '1.04',
            letterSpacing: '2px', fontVariantNumeric: 'tabular-nums'
        });
        this.dateText = $('<div></div>').css({
            fontSize: '28px', fontWeight: '400', color: '#f0e9f6',
            marginTop: '12px'
        });
        this.clockPanel.append(this.clockText);
        this.clockPanel.append(this.dateText);
        this.root.append(this.clockPanel);
        this.widget = this.weatherPanel; // Keep legacy reference for integrations.
        this.refreshClock();
        this.loadWeather();
        this.clockTimer = setInterval(function () { self.refreshClock(); }, 15000);
        this.weatherTimer = setInterval(function () { self.loadWeather(); }, 20 * 60000);
    };

    Cinematic.prototype.refreshClock = function () {
        if (this.destroyed || !this.clockText) return;
        var now = new Date(), time, date;
        try {
            // Europe/Kiev is the backward-compatible IANA zone alias on older Tizen.
            time = new Intl.DateTimeFormat('ru-RU', {
                timeZone: 'Europe/Kiev', hour: '2-digit', minute: '2-digit',
                hour12: false
            }).format(now);
            date = new Intl.DateTimeFormat('ru-RU', {
                timeZone: 'Europe/Kiev', weekday: 'long', day: 'numeric', month: 'long'
            }).format(now);
        } catch (error) {
            time = now.toLocaleTimeString('ru-RU').slice(0, 5);
            date = now.toLocaleDateString('ru-RU', {
                weekday: 'long', day: 'numeric', month: 'long'
            });
        }
        this.clockText.text(time);
        this.dateText.text(date.charAt(0).toUpperCase() + date.slice(1));
    };

    function weatherDescription(code, daytime) {
        if (code === 0) return (daytime ? '☀  Ясно' : '☾  Ясная ночь');
        if (code === 1 || code === 2) return '⛅  Переменная облачность';
        if (code === 3) return '☁  Облачно';
        if (code === 45 || code === 48) return '☁  Туман';
        if (code === 51 || code === 53 || code === 55 ||
            code === 56 || code === 57) return '☂  Морось';
        if (code === 61 || code === 63 || code === 65 ||
            code === 66 || code === 67 || code === 80 ||
            code === 81 || code === 82) return '☂  Дождь';
        if (code === 71 || code === 73 || code === 75 || code === 77 ||
            code === 85 || code === 86) return '❄  Снег';
        if (code === 95 || code === 96 || code === 99) return 'ϟ  Гроза';
        return 'Погода';
    }

    Cinematic.prototype.loadWeather = function () {
        if (this.destroyed || !this.weatherText || this.weatherRequest) return;
        if (typeof XMLHttpRequest === 'undefined') {
            this.weatherUnavailable();
            return;
        }
        var self = this;
        var request = new XMLHttpRequest();
        this.weatherRequest = request;
        var completed = false;
        var finish = function (success) {
            if (completed) return;
            completed = true;
            if (self.weatherRequest === request) self.weatherRequest = null;
            if (!self.destroyed && !success) self.weatherUnavailable();
        };
        request.onreadystatechange = function () {
            if (request.readyState !== 4) return;
            if (self.destroyed) { finish(false); return; }
            if (request.status !== 200) { finish(false); return; }
            try {
                var response = JSON.parse(request.responseText);
                var w = response && response.current;
                if (!w || typeof w.temperature_2m !== 'number') {
                    finish(false);
                    return;
                }
                var temperature = Math.round(w.temperature_2m);
                var signed = (temperature > 0 ? '+' : '') + temperature + '°C';
                self.tempText.text(signed);
                self.weatherText.text(
                    weatherDescription(Number(w.weather_code), Number(w.is_day) === 1));
                self.weatherUpdated = true;
                finish(true);
            } catch (error) { finish(false); }
        };
        request.onerror = function () { finish(false); };
        request.ontimeout = function () { finish(false); };
        request.timeout = 12000;
        try {
            request.open('GET',
                'https://api.open-meteo.com/v1/forecast' +
                '?latitude=48.88694&longitude=24.75111' +
                '&current=temperature_2m,weather_code,is_day' +
                '&timezone=Europe%2FKyiv&forecast_days=1',
                true);
            request.send(null);
        } catch (error) { finish(false); }
    };

    Cinematic.prototype.weatherUnavailable = function () {
        if (this.weatherText && !this.weatherUpdated) {
            if (this.tempText) this.tempText.text('—°C');
            this.weatherText.text('Погода временно недоступна');
        }
    };

    Cinematic.prototype.render = function () {
        return this.root;
    };

    Cinematic.prototype.destroy = function () {
        this.destroyed = true;
        this.clearLoading();
        clearTimeout(this.startTimer);
        clearTimeout(this.transitionTimer);
        clearInterval(this.clockTimer);
        clearInterval(this.weatherTimer);
        clearInterval(this.motionTimer);
        if (this.weatherRequest) {
            try { this.weatherRequest.abort(); } catch (error) {}
            this.weatherRequest = null;
        }
        for (var i = 0; i < this.slots.length; i++) this.resetVideo(i);
        this.slots = [];
        if (this.root) this.root.remove();
        this.root = null;
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
            param: { name: PREFIX + 'chapter', type: 'select', values: {
                '5': '5 минут', '7': '7 минут', '10': '10 минут'
            }, 'default': '7' },
            field: { name: 'Время одной темы', description: 'Длинные тематические сцены из нескольких UHD-роликов' }
        });
        Lampa.SettingsApi.addParam({
            component: COMPONENT,
            param: { name: PREFIX + 'fade', type: 'select', values: {
                '1600': 'Плавно · 1.6 с', '2800': 'Кинематографично · 2.8 с', '4000': 'Очень плавно · 4 с'
            }, 'default': '2800' },
            field: { name: 'Переходы', description: 'Настоящий crossfade: новое видео поверх предыдущего' }
        });
        Lampa.SettingsApi.addParam({
            component: COMPONENT,
            param: { name: PREFIX + 'overlay', type: 'trigger', 'default': true },
            field: { name: 'Время, дата и погода', description: 'Слева — погода, справа — крупные часы и дата' }
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
        previousNative = loadNativeBackup();
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
        console.log('[Cinematic Screensaver] 2.2.0 ready: 24 motion clips, split weather/clock, playback watchdog');
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
