import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { getWeeklyPlan } from '@/lib/weeklyPlan';
import { getAdvice, getDayNames, getReminderLabel } from '@/lib/i18n';

export type Language = 'en' | 'fr' | 'ar';
export type Mode = 'work' | 'vacation';
export type WeightEntry = { date: string; value: number };
export type Reminder = { id: string; time: string; enabled: boolean; notificationId?: string };
export type DailyLog = { waterGlasses: number; meals: Record<string, boolean>; exercises: Record<string, boolean>; schedule: Record<string, boolean> };
export type BalanceState = {
  language: Language;
  mode: Mode;
  profileName: string;
  currentWeight: number;
  targetWeight: number;
  weightUnit: 'kg' | 'lb';
  weightHistory: WeightEntry[];
  selectedDay: number;
  logs: Record<string, DailyLog>;
  remindersByMode: Record<Mode, Reminder[]>;
};

export const getTodayDay = () => new Date().getDay();
export const getDateKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const logKey = (mode: Mode, day: number) => `${mode}-${day}`;
const emptyLog = (): DailyLog => ({ waterGlasses: 0, meals: {}, exercises: {}, schedule: {} });

const defaultState: BalanceState = {
  language: 'en',
  mode: 'work',
  profileName: 'Alex',
  currentWeight: 72.4,
  targetWeight: 68,
  weightUnit: 'kg',
  weightHistory: [{ date: addDays(-5), value: 73.1 }, { date: addDays(-4), value: 72.9 }, { date: addDays(-3), value: 72.8 }, { date: addDays(-2), value: 72.6 }, { date: addDays(-1), value: 72.5 }, { date: addDays(0), value: 72.4 }],
  selectedDay: getTodayDay(),
  logs: { [`work-${getTodayDay()}`]: { waterGlasses: 5, meals: { [`d${getTodayDay()}-meal-0`]: true }, exercises: { [`d${getTodayDay()}-exercise-0`]: true }, schedule: {} } },
  remindersByMode: {
    work: [{ id: 'water', time: '09:00', enabled: true }, { id: 'movement', time: '11:15', enabled: false }, { id: 'weight', time: '08:30', enabled: true }],
    vacation: [{ id: 'water', time: '10:30', enabled: true }, { id: 'movement', time: '17:00', enabled: false }, { id: 'weight', time: '09:00', enabled: true }],
  },
};

type ContextValue = {
  state: BalanceState;
  hydrated: boolean;
  reminders: Reminder[];
  todayDay: number;
  getLog: (day?: number, mode?: Mode) => DailyLog;
  setSelectedDay: (day: number) => void;
  toggleWater: (index: number, day?: number, mode?: Mode) => void;
  toggleMeal: (id: string, day?: number, mode?: Mode) => void;
  toggleExercise: (id: string, day?: number, mode?: Mode) => void;
  toggleSchedule: (id: string, day?: number, mode?: Mode) => void;
  setMode: (mode: Mode) => void;
  setLanguage: (language: Language) => void;
  updateProfile: (name: string, currentWeight: number, targetWeight: number) => void;
  addWeight: (value: number) => void;
  toggleReminder: (id: string) => Promise<boolean>;
  resetToday: () => void;
  advice: string;
};

const BalanceContext = createContext<ContextValue | null>(null);
const STORAGE_KEY = '@daily-balance/state-v2';

function migrateStored(stored: string | null): BalanceState {
  if (!stored) return defaultState;
  try {
    const parsed = JSON.parse(stored) as Partial<BalanceState> & { waterGlasses?: number; meals?: { id: string; completed: boolean }[]; exercises?: { id: string; completed: boolean }[]; schedule?: { id: string; done: boolean }[]; reminders?: Reminder[] };
    if (parsed.logs) return { ...defaultState, ...parsed, remindersByMode: parsed.remindersByMode ?? defaultState.remindersByMode };
    const day = getTodayDay();
    const oldLog: DailyLog = {
      waterGlasses: parsed.waterGlasses ?? 0,
      meals: Object.fromEntries((parsed.meals ?? []).map((item) => [item.id, item.completed])),
      exercises: Object.fromEntries((parsed.exercises ?? []).map((item) => [item.id, item.completed])),
      schedule: Object.fromEntries((parsed.schedule ?? []).map((item) => [item.id, item.done])),
    };
    return { ...defaultState, ...parsed, selectedDay: day, logs: { [logKey(parsed.mode ?? 'work', day)]: oldLog }, remindersByMode: { work: parsed.reminders ?? defaultState.remindersByMode.work, vacation: defaultState.remindersByMode.vacation } };
  } catch {
    return defaultState;
  }
}

export function DailyBalanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BalanceState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const todayDay = getTodayDay();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => setState(migrateStored(stored))).catch(() => undefined).finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [state, hydrated]);

  const getLog = useCallback((day = state.selectedDay, mode = state.mode) => state.logs[logKey(mode, day)] ?? emptyLog(), [state.logs, state.mode, state.selectedDay]);
  const updateLog = useCallback((day: number, mode: Mode, updater: (log: DailyLog) => DailyLog) => {
    setState((current) => {
      const key = logKey(mode, day);
      return { ...current, logs: { ...current.logs, [key]: updater(current.logs[key] ?? emptyLog()) } };
    });
  }, []);
  const setSelectedDay = useCallback((day: number) => setState((current) => ({ ...current, selectedDay: day })), []);
  const toggleWater = useCallback((index: number, day = state.selectedDay, mode = state.mode) => updateLog(day, mode, (log) => ({ ...log, waterGlasses: log.waterGlasses === index + 1 ? index : index + 1 })), [state.mode, state.selectedDay, updateLog]);
  const toggleMeal = useCallback((id: string, day = state.selectedDay, mode = state.mode) => updateLog(day, mode, (log) => ({ ...log, meals: { ...log.meals, [id]: !log.meals[id] } })), [state.mode, state.selectedDay, updateLog]);
  const toggleExercise = useCallback((id: string, day = state.selectedDay, mode = state.mode) => updateLog(day, mode, (log) => ({ ...log, exercises: { ...log.exercises, [id]: !log.exercises[id] } })), [state.mode, state.selectedDay, updateLog]);
  const toggleSchedule = useCallback((id: string, day = state.selectedDay, mode = state.mode) => updateLog(day, mode, (log) => ({ ...log, schedule: { ...log.schedule, [id]: !log.schedule[id] } })), [state.mode, state.selectedDay, updateLog]);
  const setMode = useCallback((mode: Mode) => setState((current) => ({ ...current, mode })), []);
  const setLanguage = useCallback((language: Language) => setState((current) => ({ ...current, language })), []);
  const updateProfile = useCallback((name: string, currentWeight: number, targetWeight: number) => setState((current) => ({ ...current, profileName: name.trim() || 'Alex', currentWeight, targetWeight })), []);
  const addWeight = useCallback((value: number) => setState((current) => ({ ...current, currentWeight: value, weightHistory: [...current.weightHistory.filter((item) => item.date !== getDateKey()), { date: getDateKey(), value }].slice(-14) })), []);

  const toggleReminder = useCallback(async (id: string) => {
    const reminder = state.remindersByMode[state.mode].find((item) => item.id === id);
    if (!reminder) return false;
    const enabling = !reminder.enabled;
    if (enabling && Platform.OS !== 'web') {
      const currentPermission = await Notifications.getPermissionsAsync();
      const permission = currentPermission.granted ? currentPermission : await Notifications.requestPermissionsAsync();
      if (!permission.granted) return false;
      const [hour, minute] = reminder.time.split(':').map(Number);
      const notificationId = await Notifications.scheduleNotificationAsync({ content: { title: 'Daily Balance', body: getReminderLabel(state.language, id), sound: 'default' }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute } });
      setState((current) => ({ ...current, remindersByMode: { ...current.remindersByMode, [current.mode]: current.remindersByMode[current.mode].map((item) => item.id === id ? { ...item, enabled: true, notificationId } : item) } }));
      return true;
    }
    if (!enabling && reminder.notificationId && Platform.OS !== 'web') await Notifications.cancelScheduledNotificationAsync(reminder.notificationId);
    setState((current) => ({ ...current, remindersByMode: { ...current.remindersByMode, [current.mode]: current.remindersByMode[current.mode].map((item) => item.id === id ? { ...item, enabled: enabling, notificationId: undefined } : item) } }));
    return true;
  }, [state.language, state.mode, state.remindersByMode]);

  const resetToday = useCallback(() => setState((current) => ({ ...current, logs: { ...current.logs, [logKey(current.mode, todayDay)]: emptyLog() } })), [todayDay]);
  const todayLog = getLog(todayDay, state.mode);
  const todayPlan = getWeeklyPlan(state.language, todayDay);
  const completedMeals = todayPlan.meals.filter((meal) => todayLog.meals[meal.id]).length;
  const completedExercises = todayPlan.exercises.filter((exercise) => todayLog.exercises[exercise.id]).length;
  const schedule = state.mode === 'work' ? todayPlan.workSchedule : todayPlan.vacationSchedule;
  const completedTasks = completedMeals + completedExercises + schedule.filter((item) => todayLog.schedule[item.id]).length;
  const totalTasks = todayPlan.meals.length + todayPlan.exercises.length + schedule.length;
  const trend = state.weightHistory.length > 1 ? state.weightHistory[state.weightHistory.length - 1].value - state.weightHistory[0].value : 0;
  const advice = useMemo(() => getAdvice(state.language, { currentWeight: state.currentWeight, targetWeight: state.targetWeight, trend, waterGlasses: todayLog.waterGlasses, mealsDone: completedMeals, mealsTotal: todayPlan.meals.length, exerciseDone: completedExercises, exerciseTotal: todayPlan.exercises.length, tasksDone: completedTasks, tasksTotal: totalTasks }), [state.language, state.currentWeight, state.targetWeight, trend, todayLog, completedMeals, todayPlan.meals.length, completedExercises, todayPlan.exercises.length, completedTasks, totalTasks]);
  const value = useMemo(() => ({ state, hydrated, reminders: state.remindersByMode[state.mode], todayDay, getLog, setSelectedDay, toggleWater, toggleMeal, toggleExercise, toggleSchedule, setMode, setLanguage, updateProfile, addWeight, toggleReminder, resetToday, advice }), [state, hydrated, todayDay, getLog, setSelectedDay, toggleWater, toggleMeal, toggleExercise, toggleSchedule, setMode, setLanguage, updateProfile, addWeight, toggleReminder, resetToday, advice]);
  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
}

export function useDailyBalance() {
  const context = useContext(BalanceContext);
  if (!context) throw new Error('useDailyBalance must be used inside DailyBalanceProvider');
  return context;
}