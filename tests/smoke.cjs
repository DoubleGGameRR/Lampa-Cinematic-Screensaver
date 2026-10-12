'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'plugin.js'), 'utf8');
const calls = { enable: 0, disable: 0, show: 0, stop: 0, requests: [] };
const values = { screensaver: false, screensaver_type: 'nature', screensaver_time: 10 };
const settings = [];
const events = {};
const timers = new Map();
const intervals = new Map();
let nextId = 0;
const setTimeoutFake = (f, ms) => { const id = ++nextId; timers.set(id, { f, ms }); return id; };
const clearTimeoutFake = (id) => timers.delete(id);
const setIntervalFake = (f, ms) => { const id = ++nextId; intervals.set(id, { f, ms }); return id; };
const clearIntervalFake = (id) => intervals.delete(id);
const advance = (limit) => {
    for (let i = 0; i < 20; i++) {
        const match = [...timers].find((entry) => entry[1].ms <= limit);
        if (!match) return;
        timers.delete(match[0]);
        match[1].f();
    }
    throw new Error('Potential timer loop');
};

function jq() {
    return {
        children: [], style: {}, value: '',
        css(obj) { Object.assign(this.style, obj); return this; },
        append(item) { this.children.push(item); return this; },
        remove() { this.children = []; return this; },
        text(value) { if (typeof value !== 'undefined') this.value = value; return this; }
    };
}
function newVideo() {
    const handlers = {};
    return {
        handlers, style: {}, paused: true, currentTime: 0, duration: 60,
        setAttribute() {}, addEventListener: (name, fn) => { handlers[name] = fn; },
        removeAttribute(key) { if (key === 'src') this.src = ''; },
        load() {
            if (this.src) {
                handlers.loadeddata?.();
                handlers.canplay?.();
            }
        },
        play() { this.paused = false; handlers.playing?.(); return Promise.resolve(); },
        pause() { this.paused = true; }
    };
}
function MockXHR() {}
MockXHR.prototype.open = function (_method, url) { this.url = url; };
MockXHR.prototype.send = function () {
    calls.requests.push(this.url);
    this.status = 200;
    this.responseText = JSON.stringify({
        current: { temperature_2m: 8.4, weather_code: 3, is_day: 1 }
    });
    this.readyState = 4;
    this.onreadystatechange();
};
MockXHR.prototype.abort = function () { this.aborted = true; };
const lampa = {
    Storage: {
        get: (key, fallback) => Object.hasOwn(values, key) ? values[key] : fallback,
        set: (key, value) => { values[key] = value; }
    },
    Screensaver: {
        class_list: { nature: function () {} },
        enable: () => { calls.enable++; },
        disable: () => { calls.disable++; },
        show: () => { calls.show++; },
        stop: () => { calls.stop++; },
        resetTimer() {}
    },
    SettingsApi: {
        addComponent() {},
        addParam: (x) => settings.push(x)
    },
    Player: {
        opened: () => false,
        listener: { follow: (name, fn) => { events[name] = fn; } }
    },
    Noty: { show: () => {} }
};
const window = { appready: true, Lampa: lampa };
const context = {
    window, Lampa: lampa, document: {
        createElement: newVideo, addEventListener() {}
    },
    XMLHttpRequest: MockXHR, $: jq, Date, Intl,
    setTimeout: setTimeoutFake, clearTimeout: clearTimeoutFake,
    setInterval: setIntervalFake, clearInterval: clearIntervalFake,
    console: { log() {} }
};
vm.runInNewContext(source, context, { filename: 'plugin.js' });
assert.equal(window.lampa_cinematic_screensaver_loaded, true);
assert.equal(typeof lampa.Screensaver.class_list.cinematic, 'function');
assert.equal(values.screensaver, true);
assert.equal(values.screensaver_type, 'cinematic');
assert.equal(values.screensaver_time, 3);
assert.deepEqual(settings.map((x) => x.param.name),
    ['lcs_enabled', 'lcs_time', 'lcs_mode', 'lcs_chapter', 'lcs_fade',
     'lcs_overlay', 'lcs_preview']);

const Saver = lampa.Screensaver.class_list.cinematic;
const screenshots = [];
for (const [mode, count] of [
    ['halloween', 9], ['autumn', 5], ['neon', 4], ['cozy', 3]
]) {
    values.lcs_mode = mode;
    const saver = new Saver();
    saver.chooseChapter();
    const chosen = Array.from({ length: count }, () => saver.takeClip());
    assert.equal(new Set(chosen).size, count);
    assert.ok(chosen.every((idx) => idx >= 0));
    screenshots.push({ mode, count });
}
values.lcs_mode = 'halloween';
values.lcs_chapter = '10';
const saver = new Saver();
saver.create();
assert.equal(saver.slots.length, 2);
assert.ok(saver.clockText.value.includes(':'));
assert.ok(saver.dateText.value.length > 4);
assert.match(saver.weatherText.value, /\+8°C/);
assert.equal(calls.requests.length, 1);
assert.ok(calls.requests[0].includes('latitude=48.88694'));
assert.ok(calls.requests[0].includes('longitude=24.75111'));
assert.ok(calls.requests[0].includes('timezone=Europe%2FKyiv'));
assert.equal(intervals.size, 2);
advance(100);
const original = saver.active;
const active = saver.slots[original].video;
active.duration = 60;
active.currentTime = 50;
active.handlers.timeupdate();
assert.equal(saver.pending, 1 - original);
assert.equal(saver.slots[saver.pending].loaded, true);
active.currentTime = 57.5;
active.handlers.timeupdate();
assert.equal(saver.swapping, true);
advance(150);
assert.equal(saver.slots[saver.pending].video.style.opacity, '1');
advance(3000);
assert.equal(saver.active, 1 - original);
assert.equal(saver.pending, -1);
assert.equal(saver.slots[original].clip, -1);
saver.destroy();
assert.equal(saver.destroyed, true);
assert.equal(intervals.size, 0);
assert.equal(saver.slots.length, 0);

const disabled = settings.find((x) => x.param.name === 'lcs_enabled');
values.lcs_enabled = false;
disabled.onChange();
assert.equal(values.screensaver, false);
assert.equal(values.screensaver_type, 'nature');
assert.equal(values.screensaver_time, 10);
events.start();
assert.ok(calls.disable >= 1);
console.log('PASS: 21 clips, 9 Halloween videos, smooth crossfade, 5–10 minute chapters, Mykytyntsi weather/clock, cleanup');
