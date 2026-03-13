import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserGoal, Session, Milestone } from '../types';

const KEYS = {
  USER_GOAL: '@4coach_user_goal',
  SESSIONS: '@4coach_sessions',
  MILESTONES: '@4coach_milestones',
};

export async function saveUserGoal(goal: UserGoal): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_GOAL, JSON.stringify(goal));
}

export async function getUserGoal(): Promise<UserGoal | null> {
  const data = await AsyncStorage.getItem(KEYS.USER_GOAL);
  return data ? JSON.parse(data) : null;
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
}

export async function getSessions(): Promise<Session[]> {
  const data = await AsyncStorage.getItem(KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
}

export async function saveSession(session: Session): Promise<void> {
  const sessions = await getSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  await saveSessions(sessions);
}

export async function saveMilestones(milestones: Milestone[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.MILESTONES, JSON.stringify(milestones));
}

export async function getMilestones(): Promise<Milestone[]> {
  const data = await AsyncStorage.getItem(KEYS.MILESTONES);
  return data ? JSON.parse(data) : [];
}
