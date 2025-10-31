import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================
// 🔔 Browser Notification Utils
// ============================

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const showTweetNotification = (tweet: { content: string }) => {
  if (typeof window === "undefined") return;
  if (Notification.permission === "granted") {
    new Notification("New Tweet Alert 🚨", {
      body: tweet.content,
      icon: "/favicon.ico",
    });
  }
};
