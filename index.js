'use strict';

module.exports = (prefix, delim) => {
    prefix = prefix || 'events';
    delim = delim || '.'
    return ctx => {
        if (!ctx.path && ctx.req.source && ctx.req.source.split(delim)[0] === prefix) {
            ctx.request.body = ctx.req.detail;
            Object.defineProperty(ctx, 'path', {enumerable: true, value: ctx.req.source});
            Object.defineProperty(ctx, 'method', {enumerable: true, value: 'post'});
            ctx.request.body['_id'] = {enumerable: true, value: ctx.req.id};
            console.log(ctx);
        }
    };
};
