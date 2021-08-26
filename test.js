const test = require('ava');
const m = require('.');
const fs = require('fs');

const fixture1 = JSON.parse(fs.readFileSync('fixtures/event.json').toString());
const fixture2 = JSON.parse(fs.readFileSync('fixtures/dynamodb-event.json').toString());
const fixture3 = JSON.parse(fs.readFileSync('fixtures/event2.json').toString());

function fn(t, event, prefix, delim) {
    const ctx = Object.assign({}, {req: event}, t.context.ctx);
    m(prefix, delim)(ctx);
    return ctx;
}

test.beforeEach(t => {
    t.context.ctx = {
        request: {},
        throw: (code, msg) => {
            throw new Error(`${code} - ${msg}`);
        }
    };
});

test('do nothing if it\'s not an EventBridge event', t => {
    const result = fn(t, fixture2);
    t.falsy(result.request.body);
    t.falsy(result.path);
    t.falsy(result.method);
});

test('result', t => {
    const result = fn(t, fixture1, 'events', ':');
    t.is(result.path, 'events:test');
    t.is(result.method, 'post');
    t.deepEqual((result.request.body),{
        _id: {
            enumerable: true,
            value: '79ad0470-b35b-3229-3e06-45f1b2b7ef0e',
        },
        "test": "Test"
    });
});

test('path mapping', t => {
    t.is(fn(t, fixture3, 'foo', ':').path, 'foo:test');
});
