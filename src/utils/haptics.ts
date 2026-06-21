import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// expo-haptics only works on iOS/Android. On web the calls reject, so we
// no-op there to keep the PWA build clean. Re-export the enums for callers.
const enabled = Platform.OS !== 'web';

export const ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle;
export const NotificationFeedbackType = Haptics.NotificationFeedbackType;

export function impact(style: Haptics.ImpactFeedbackStyle): void {
  if (enabled) Haptics.impactAsync(style).catch(() => {});
}

export function notify(type: Haptics.NotificationFeedbackType): void {
  if (enabled) Haptics.notificationAsync(type).catch(() => {});
}
