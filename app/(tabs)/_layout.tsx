import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useDailyBalance } from '@/context/DailyBalanceContext';

export default function TabLayout() {
  const colors = useColors();
  const { state } = useDailyBalance();
  const labels = state.language === 'fr' ? { home: 'Accueil', plan: 'Plan', progress: 'Progrès', settings: 'Réglages' } : state.language === 'ar' ? { home: 'الرئيسية', plan: 'الخطة', progress: 'التقدم', settings: 'الإعدادات' } : { home: 'Home', plan: 'Plan', progress: 'Progress', settings: 'Settings' };
  const isWeb = Platform.OS === 'web';
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.mutedForeground, tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border, borderTopWidth: isWeb ? 1 : 0, elevation: 0, height: isWeb ? 84 : 66, paddingTop: 8 }, tabBarLabelStyle: { fontSize: 10, fontWeight: '600' } }}>
      <Tabs.Screen name="index" options={{ title: labels.home, tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} /> }} />
      <Tabs.Screen name="plan" options={{ title: labels.plan, tabBarIcon: ({ color }) => <Feather name="calendar" size={20} color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: labels.progress, tabBarIcon: ({ color }) => <Feather name="trending-down" size={20} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: labels.settings, tabBarIcon: ({ color }) => <Feather name="sliders" size={20} color={color} /> }} />
    </Tabs>
  );
}
