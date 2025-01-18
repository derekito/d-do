import React, { useEffect } from 'react';

export function NotificationPermission() {
  useEffect(() => {
    const requestPermission = async () => {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    };

    requestPermission();
  }, []);

  return null;
} 