!function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(r,o,function(n){return t[n]}.bind(null,o));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=13)}({13:function(t,n,e){"use strict";e.r(n);var r=e(3),o=function(t,n,e,r){return new(e||(e=Promise))((function(o,i){function u(t){try{l(r.next(t))}catch(t){i(t)}}function a(t){try{l(r.throw(t))}catch(t){i(t)}}function l(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(u,a)}l((r=r.apply(t,n||[])).next())}))},i=function(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,e=t[Symbol.asyncIterator];return e?e.call(t):(t="function"==typeof __values?__values(t):t[Symbol.iterator](),n={},r("next"),r("throw"),r("return"),n[Symbol.asyncIterator]=function(){return this},n);function r(e){n[e]=t[e]&&function(n){return new Promise((function(r,o){(function(t,n,e,r){Promise.resolve(r).then((function(n){t({value:n,done:e})}),n)})(r,o,(n=t[e](n)).done,n.value)}))}}};var u;u=window.urlParams.get("lang"),o(void 0,void 0,void 0,(function*(){var t,n,e=(t=>"en"!==t?[t,"en"]:[t])(u).map(t=>(t=>o(void 0,void 0,void 0,(function*(){let n=yield fetch(`lang/${t}.json`);var e=new Date;return console.log(t,e.toLocaleTimeString()+":"+e.getMilliseconds()),n.ok?n.json():{}})))(t));for(let o of Array.from(r("[trans-tag"))){let u;try{for(var a,l=i(e);!(a=yield l.next()).done&&(u=a.value[r(o).attr("trans-tag")],!u););}catch(n){t={error:n}}finally{try{a&&!a.done&&(n=l.return)&&(yield n.call(l))}finally{if(t)throw t.error}}r(o).text(u)}})),r("html").attr("lang",window.urlParams.get("lang"))},3:function(t,n){t.exports=jQuery}});