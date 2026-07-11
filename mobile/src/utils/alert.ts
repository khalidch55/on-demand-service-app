import { Alert, Platform } from 'react-native';

/** Cross-platform alert — React Native Alert does not work on web. */
export function showAlert(
  title: string,
  message: string,
  onOk?: () => void,
) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    onOk?.();
  } else {
    Alert.alert(
      title,
      message,
      onOk ? [{ text: 'OK', onPress: onOk }] : undefined,
    );
  }
}

/** Cross-platform confirm dialog — multi-button Alert does not work on web. */
export function showConfirm(
  title: string,
  message: string,
  onConfirm: () => void,
  options?: { confirmText?: string; cancelText?: string },
) {
  const confirmText = options?.confirmText ?? 'Yes';
  const cancelText = options?.cancelText ?? 'No';

  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: cancelText, style: 'cancel' },
      { text: confirmText, onPress: onConfirm },
    ]);
  }
}
