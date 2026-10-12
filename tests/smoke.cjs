'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '..', 'plugin.js'), 'utf8');

function boot() {
    const values = {
        screensaver: false,
        screensaver_time: 10,
        screensaver_type: 'nature'
    };
    const params = [];
    const events = {};
    const calls = { enable: 0, disable: 0, stop: 0, show: 0 };
    const lampa = {
        Storage: {
            get: (key, fallback) => Object.prototype.hasOwnProperty.call(values, key)
                ? values[key] : fallback,
            set: (key, value) => { values[key] = value; }
        },
        Player: {
            opened: () => false,
            listener: { follow: (name, callback) => { events[name] = callback; } }
        },
        Screensaver: {
            class_list: { nature: function Nature() {} },
            resetTimer: () => {},
            enable: () => { calls.enable++; },
            disable: () => { calls.disable++; },
            stop: () => { calls.stop++; },
            show: () => { calls.show++; }
        },
        SettingsApi: {
            addComponent: (component) => { calls.component = component; },
            addParam: (param) => { params.push(param); }
        },
        Noty: { show: () => {} }
    };
    const window = { appready: true, Lampa: lampa };
    const document = { addEventListener: () => {} };
    const context = {
        Lampa: lampa, window, document,
        setTimeout: () => 0, clearTimeout: () => {},
        setInterval: () => 0, clearInterval: () => {},
        console: { log: () => {} }
    };
    vm.runInNewContext(script, context, { filename: 'plugin.js' });
    return { lampa, window, values, params, events, calls, context };
}

const app = boot();
assert.equal(app.window.lampa_cinematic_screensaver_loaded, true);
assert.equal(typeof app.lampa.Screensaver.class_list.cinematic, 'function');
assert.equal(app.values.screensaver, true);
assert.equal(app.values.screensaver_type, 'cinematic');
assert.equal(app.values.screensaver_time, 3);
assert.equal(app.params.length, 5);
assert.deepEqual(
    app.params.map((p) => p.param.name),
    ['lcs_enabled', 'lcs_time', 'lcs_mode', 'lcs_fade', 'lcs_preview']
);

const Saver = app.lampa.Screensaver.class_list.cinematic;
const all = new Saver();
all.preparePlaylist();
assert.equal(all.order.length, 9);
assert.equal(new Set(all.order).size, 9);

app.values.lcs_mode = 'autumn';
const autumn = new Saver();
autumn.preparePlaylist();
assert.equal(autumn.order.length, 3);
app.values.lcs_mode = 'halloween';
const halloween = new Saver();
halloween.preparePlaylist();
assert.equal(halloween.order.length, 2);
app.values.lcs_mode = 'neon';
const neon = new Saver();
neon.preparePlaylist();
assert.equal(neon.order.length, 2);
app.values.lcs_mode = 'cozy';
const cozy = new Saver();
cozy.preparePlaylist();
assert.equal(cozy.order.length, 2);

const preview = app.params.find((p) => p.param.name === 'lcs_preview');
preview.onChange();
assert.equal(app.calls.show, 1);
app.events.start();
assert.equal(app.calls.disable, 1);
app.events.destroy();
assert.ok(app.calls.enable >= 2);

const toggle = app.params.find((p) => p.param.name === 'lcs_enabled');
app.values.lcs_enabled = false;
toggle.onChange();
assert.equal(app.values.screensaver, false);
assert.equal(app.values.screensaver_type, 'nature');
assert.equal(app.values.screensaver_time, 10);
assert.ok(app.calls.stop >= 1);

console.log('PASS: native integration, settings, playlist selection, preview and restore');
