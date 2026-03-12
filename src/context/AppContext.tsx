import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AppState, UserGoal, Session, Milestone } from '../types';
import * as storageService from '../services/storageService';

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER_GOAL'; payload: UserGoal }
  | { type: 'SET_SESSIONS'; payload: Session[] }
  | { type: 'SET_MILESTONES'; payload: Milestone[] }
  | { type: 'SET_CURRENT_SESSION'; payload: Session | null }
  | { type: 'UPSERT_SESSION'; payload: Session }
  | { type: 'ADD_MILESTONE'; payload: Milestone };

const initialState: AppState = {
  userGoal: null,
  sessions: [],
  milestones: [],
  currentSession: null,
  isLoading: true,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER_GOAL':
      return { ...state, userGoal: action.payload };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'SET_MILESTONES':
      return { ...state, milestones: action.payload };
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload };
    case 'UPSERT_SESSION': {
      const exists = state.sessions.findIndex((s) => s.id === action.payload.id);
      const updated =
        exists >= 0
          ? state.sessions.map((s) => (s.id === action.payload.id ? action.payload : s))
          : [...state.sessions, action.payload];
      return { ...state, sessions: updated };
    }
    case 'ADD_MILESTONE':
      return { ...state, milestones: [...state.milestones, action.payload] };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  setUserGoal: (goal: UserGoal) => Promise<void>;
  loadData: () => Promise<void>;
  createSession: (session: Session) => Promise<void>;
  updateSession: (session: Session) => Promise<void>;
  completeHomework: (sessionId: string) => Promise<void>;
  addMilestone: (milestone: Milestone) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [goal, sessions, milestones] = await Promise.all([
        storageService.getUserGoal(),
        storageService.getSessions(),
        storageService.getMilestones(),
      ]);
      if (goal) dispatch({ type: 'SET_USER_GOAL', payload: goal });
      dispatch({ type: 'SET_SESSIONS', payload: sessions });
      dispatch({ type: 'SET_MILESTONES', payload: milestones });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const setUserGoal = async (goal: UserGoal) => {
    await storageService.saveUserGoal(goal);
    dispatch({ type: 'SET_USER_GOAL', payload: goal });
  };

  const createSession = async (session: Session) => {
    await storageService.saveSession(session);
    dispatch({ type: 'UPSERT_SESSION', payload: session });
    dispatch({ type: 'SET_CURRENT_SESSION', payload: session });
  };

  const updateSession = async (session: Session) => {
    await storageService.saveSession(session);
    dispatch({ type: 'UPSERT_SESSION', payload: session });
    dispatch({ type: 'SET_CURRENT_SESSION', payload: session });
  };

  const completeHomework = async (sessionId: string) => {
    const session = state.sessions.find((s) => s.id === sessionId);
    if (!session) return;
    const updated: Session = {
      ...session,
      homework: { ...session.homework, completed: true },
    };
    await storageService.saveSession(updated);
    dispatch({ type: 'UPSERT_SESSION', payload: updated });
  };

  const addMilestone = async (milestone: Milestone) => {
    const milestones = [...state.milestones, milestone];
    await storageService.saveMilestones(milestones);
    dispatch({ type: 'ADD_MILESTONE', payload: milestone });
  };

  return (
    <AppContext.Provider
      value={{ state, setUserGoal, loadData, createSession, updateSession, completeHomework, addMilestone }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
