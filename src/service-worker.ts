import { build, files, version } from '$service-worker';

const CACHE = `budget-planner-${version}`;
const ASSETS = [...build, ...files, '/offline.html'];

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
			)
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	const request = event.request;
	const url = new URL(request.url);
	if (request.method !== 'GET' || url.origin !== location.origin) return;
	// Never store personalized pages, API responses, or authentication responses here.
	if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;
	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request).catch(async () => {
				const cache = await caches.open(CACHE);
				return (await cache.match('/offline.html')) ?? Response.error();
			})
		);
		return;
	}
	if (ASSETS.includes(url.pathname)) {
		event.respondWith(
			caches.open(CACHE).then(async (cache) => (await cache.match(request)) ?? fetch(request))
		);
	}
});
