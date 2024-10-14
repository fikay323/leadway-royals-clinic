// src/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCuVE8_cYA8BmZABHQX0wnJT5usBrrGkK0",
    authDomain: "leadway-royals-health-clinic.firebaseapp.com",
    projectId: "leadway-royals-health-clinic",
    storageBucket: "leadway-royals-health-clinic.appspot.com",
    messagingSenderId: "531581059645",
    appId: "1:531581059645:web:38bf09c6afb0b9712d2054"
});

// Retrieve Firebase Messaging instance to handle background messages
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
