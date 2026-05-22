// ═══════════════════════════════════════════════════════════
// Odyssey HQ — Service Worker (알림 처리)
// ═══════════════════════════════════════════════════════════
const SW_VERSION = 'v1.0';

// ── 설치 ────────────────────────────────────────────────────
self.addEventListener('install', e => {
  console.log('[SW] Installed', SW_VERSION);
  self.skipWaiting();
});

// ── 활성화 ──────────────────────────────────────────────────
self.addEventListener('activate', e => {
  console.log('[SW] Activated', SW_VERSION);
  e.waitUntil(clients.claim());
});

// ── 메인 스레드에서 메시지 수신 → 알림 표시 ─────────────────
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, badge, tag, data } = e.data.payload;
    e.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon:  icon  || '/icon-192.png',
        badge: badge || '/icon-192.png',
        tag:   tag   || 'odyssey-hq',
        vibrate: [200, 100, 200],
        data:  data  || {},
        actions: [
          { action: 'open',    title: '열기' },
          { action: 'dismiss', title: '닫기' },
        ],
      })
    );
  }
});

// ── 알림 클릭 처리 ──────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;

  // 앱 창 포커스 또는 새 탭 열기
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
