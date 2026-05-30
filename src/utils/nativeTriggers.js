import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
import { useWarscytheStore } from '../store/useWarscytheStore';

// Helper to show custom high-fantasy notifications/toasts in UI
export const triggerToast = (message, type = 'info') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `tactical-toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-inner">
      <span class="toast-marker"></span>
      <span class="toast-text">${message.toUpperCase()}</span>
    </div>
  `;
  container.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('toast-active'), 50);

  // Remove after 4s
  setTimeout(() => {
    toast.classList.remove('toast-active');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
};

// 1. HAPTICS TRIGGER
export const triggerHaptics = async (style = 'MEDIUM') => {
  try {
    // Check if we are running in Capacitor native context
    if (window.Capacitor && window.Capacitor.isPluginAvailable('Haptics')) {
      const impactStyle = ImpactStyle[style.toUpperCase()] || ImpactStyle.Medium;
      await Haptics.impact({ style: impactStyle });
    } else if (navigator.vibrate) {
      // Fallback to standard web vibration API
      const duration = style === 'HEAVY' ? 100 : style === 'MEDIUM' ? 50 : 25;
      navigator.vibrate(duration);
    }
  } catch (err) {
    console.warn('Haptics not supported/allowed:', err);
  }
};

// 2. LOCAL NOTIFICATIONS (STREAK PROTECTION)
export const requestNotificationPermission = async () => {
  try {
    if (window.Capacitor && window.Capacitor.isPluginAvailable('LocalNotifications')) {
      const status = await LocalNotifications.requestPermissions();
      return status.display === 'granted';
    } else if ('Notification' in window) {
      const status = await Notification.requestPermission();
      return status === 'granted';
    }
  } catch (err) {
    console.warn('Notification permission request failed:', err);
  }
  return false;
};

export const scheduleStreakAlert = async (hoursRemaining = 4) => {
  try {
    const isGranted = await requestNotificationPermission();
    if (!isGranted) return;

    const message = "STREAK CRISIS: YOUR WEAPON'S EDGE IS DECAYING. CONQUER A RITUAL NOW TO PRESERVE YOUR XP.";

    if (window.Capacitor && window.Capacitor.isPluginAvailable('LocalNotifications')) {
      // Clear pending protect notifications first
      await LocalNotifications.cancel({ notifications: [{ id: 888 }] });
      
      // Schedule alert in X hours
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "WARSCYTHE WARNING",
            body: message,
            id: 888,
            schedule: { at: new Date(Date.now() + hoursRemaining * 60 * 60 * 1000) },
            sound: null,
            attachments: null,
            actionTypeId: "",
            extra: null
          }
        ]
      });
    } else if ('Notification' in window) {
      // Fallback scheduling via setTimeout (for active browser sessions)
      setTimeout(() => {
        new Notification("WARSCYTHE WARNING", {
          body: message,
          icon: '/favicon.ico'
        });
      }, hoursRemaining * 60 * 60 * 1000);
    }
  } catch (err) {
    console.warn('Failed to schedule local notification:', err);
  }
};

// 3. OFFLINE DETECTION & NETWORK LISTENERS
export const initNetworkMonitoring = () => {
  try {
    const handleNetworkChange = (status) => {
      const isOnline = status.connected;
      if (isOnline) {
        triggerToast("RE-ESTABLISHED SYNC WITH SERVER", "success");
        const store = useWarscytheStore.getState();
        if (store.hasPendingChanges) {
          store.forceSync();
        }
      } else {
        triggerToast("ENTERED OFFLINE SANCTUM. PROGRESS SAVED LOCALLY.", "warning");
      }
    };

    if (window.Capacitor && window.Capacitor.isPluginAvailable('Network')) {
      Network.addListener('networkStatusChange', handleNetworkChange);
      // Initial check
      Network.getStatus().then(handleNetworkChange);
    } else {
      window.addEventListener('online', () => handleNetworkChange({ connected: true }));
      window.addEventListener('offline', () => handleNetworkChange({ connected: false }));
      // Initial check
      handleNetworkChange({ connected: navigator.onLine });
    }
  } catch (err) {
    console.warn('Network monitoring initialization failed:', err);
  }
};
