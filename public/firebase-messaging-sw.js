/* eslint-disable */
// Service Worker para Firebase Cloud Messaging (notificaciones push).
// Este archivo DEBE estar en la raíz del dominio (/firebase-messaging-sw.js).
// La config de Firebase se hardcodea aquí porque los SW no tienen acceso a las
// variables de entorno de Vite — la Firebase Web API Key NO es un secreto;
// la seguridad la proveen las Firestore Security Rules y App Check.

importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAplh4D8EbGGxn9vctzLoonYdF_1Jl_15w',   // ← reemplazar con VITE_FIREBASE_API_KEY
  authDomain: 'para-donde.firebaseapp.com',
  projectId: 'para-donde',
  storageBucket: 'para-donde.firebasestorage.app',
  messagingSenderId: '788473981937',
  appId: '1:788473981937:web:90c213f5b180c3a1a03250',
});

const messaging = firebase.messaging();

// Manejar mensajes en background (app cerrada o en segundo plano)
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  if (!title) return;

  self.registration.showNotification(title, {
    body: body ?? '',
    icon: '/favicon.ico',
    data: payload.data,
  });
});

// Al hacer click en la notificación, abrir la app o enfocarla
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const slug = event.notification.data?.slug;
  const url = slug ? `/destino/${slug}` : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      return clients.openWindow(url);
    }),
  );
});
