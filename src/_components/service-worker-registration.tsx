"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Check if service worker is already registered
      navigator.serviceWorker
        .getRegistration("/sw.js")
        .then((existingRegistration) => {
          if (existingRegistration) {
            console.log("SW already registered: ", existingRegistration);
            return;
          }

          // Only register if not already registered
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("SW registered: ", registration);
            })
            .catch((registrationError) => {
              console.log("SW registration failed: ", registrationError);
            });
        })
        .catch((error) => {
          console.log("Error checking SW registration: ", error);
        });
    }
  }, []);

  return null; // This component doesn't render anything
}
