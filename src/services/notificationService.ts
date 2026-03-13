import * as Notifications from 'expo-notifications';

// Configure how notifications are displayed when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Schedules a weekly session reminder (0=Sunday, 1=Monday, ..., 6=Saturday)
// Expo WEEKLY trigger uses 1=Sunday, 2=Monday, ..., 7=Saturday
export async function scheduleWeeklySession(
  dayOfWeek: number,
  hour: number
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  // Map JS weekday (0=Sunday…6=Saturday) → Expo weekday (1=Sunday…7=Saturday)
  const expoWeekday = dayOfWeek === 0 ? 7 : dayOfWeek;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '4Coach - Zeit für Ihre Session! 🎯',
      body: 'Ihre wöchentliche Coaching-Session wartet auf Sie.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: expoWeekday,
      hour,
      minute: 0,
    },
  });
}

// Schedules a homework reminder for the given due date
export async function scheduleHomeworkReminder(dueDate: string): Promise<void> {
  const date = new Date(dueDate);
  date.setDate(date.getDate() - 1); // Remind one day before due
  if (date > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '4Coach - Hausaufgabe fällig! 📚',
        body: 'Ihre Coaching-Hausaufgabe ist morgen fällig.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });
  }
}

export async function cancelAll(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
