if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const o=e=>n(e,c),r={module:{uri:c},exports:t,require:o};s[c]=Promise.all(i.map((e=>r[e]||o(e)))).then((e=>(a(...e),t)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"2986ab26dbc205435f4d9c9677d5ce15"},{url:"/_next/static/chunks/117-4df1be8b96935fb5.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/2e5b0c64-27ca6bcb1098adcd.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/304-98d73a01ef29b356.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/4bd1b696-6e8a75cbda7aa3b2.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/684-2d9e7a22f0368c5e.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/932-95c90a1c4380aadf.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/97-fb64a96969021b68.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/app/_not-found/page-b72775331b0d468e.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/app/favorites/page-01ca4089e030d45a.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/app/layout-94eeef7f1de1e38d.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/app/login/page-0256646be26f0b0e.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/app/movie/%5Bid%5D/page-f288d6065cc8bf7c.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/app/not-found-0b0c4472fae97c65.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/app/page-18817cfa679a311c.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/app/profile/page-e866957595e3a6ce.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/app/search/page-f6a35c279b37de19.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/app/watchlist/page-cf65fef8bd79d823.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/bc9e92e6-1659ef1ff9147eae.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/ee560e2c-3e800ebee7e3b748.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/fc2f6fa8-f66e1488fc192822.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/framework-859199dea06580b0.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/main-3ed9cfff8bca26e4.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/main-app-3dff2eb594b9dc1c.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/pages/_app-b3eb694be5fbf7e0.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/pages/_error-bd129d02791125e2.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-f5d59c4ffd9ab5dd.js",revision:"lTJ-2Obm58MoACixn-Yqk"},{url:"/_next/static/css/5aa3e4841d7ee4ed.css",revision:"5aa3e4841d7ee4ed"},{url:"/_next/static/lTJ-2Obm58MoACixn-Yqk/_buildManifest.js",revision:"4b19178c06406574c9682eb6fdff5358"},{url:"/_next/static/lTJ-2Obm58MoACixn-Yqk/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/747892c23ea88013-s.woff2",revision:"a0761690ccf4441ace5cec893b82d4ab"},{url:"/_next/static/media/93f479601ee12b01-s.p.woff2",revision:"da83d5f06d825c5ae65b7cca706cb312"},{url:"/_next/static/media/a1386beebedccca4-s.woff2",revision:"d3aa06d13d3cf9c0558927051f3cb948"},{url:"/_next/static/media/b957ea75a84b6ea7-s.p.woff2",revision:"0bd523f6049956faaf43c254a719d06a"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icon-192x192.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/icon-512x512.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/icons/icon-128x128.png",revision:"f799680b52c22e93a3ee1417a12caa38"},{url:"/icons/icon-144x144.png",revision:"a45e37216ca8dac2a0b3ba376936a8db"},{url:"/icons/icon-152x152.png",revision:"f844cb69cc2b33a5e31164a10d87d8a3"},{url:"/icons/icon-192x192.png",revision:"6828a6057610df67e701a20874d1ce22"},{url:"/icons/icon-384x384.png",revision:"220cc125644f2e1289788619b322e0d6"},{url:"/icons/icon-512x512.png",revision:"d14fe29c6c725210cf253f4178e92ac8"},{url:"/icons/icon-72x72.png",revision:"b9e5f48cbef6ea5547570a97cc160505"},{url:"/icons/icon-96x96.png",revision:"5c168a3a1dec995a1d0ee9be0512cff5"},{url:"/logo.lottie",revision:"caed6de9228e6cd8341461d7351a5dab"},{url:"/logo.png",revision:"ba7c701e4edcaf21aa1097b77d47ac07"},{url:"/manifest.json",revision:"ea6f88ef9a66318f8d9b81c7aee3c954"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/styles.css",revision:"5b377da542310878f292d8735520b7d5"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
