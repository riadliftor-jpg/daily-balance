import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useDailyBalance } from '@/context/DailyBalanceContext';
import { useCopy } from '@/lib/i18n';

export default function ProgressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, addWeight } = useDailyBalance();
  const t = useCopy(state.language);
  const [modal, setModal] = useState(false);
  const [weight, setWeight] = useState(state.currentWeight.toFixed(1));
  const range = useMemo(() => {
    const values = state.weightHistory.map((entry) => entry.value);
    return { min: Math.min(...values, state.targetWeight) - 0.5, max: Math.max(...values, state.currentWeight) + 0.5 };
  }, [state.weightHistory, state.targetWeight, state.currentWeight]);
  const delta = state.currentWeight - state.weightHistory[0].value;
  const chartHeight = 125;
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top, direction: state.language === 'ar' ? 'rtl' : 'ltr' }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 98 }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.kicker, { color: colors.primary }]}>{t.progress}</Text>
        <View style={styles.titleRow}><View><Text style={[styles.title, { color: colors.navy }]}>{t.weight}</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t.noPressure}</Text></View><Pressable testID="open-weight-entry" onPress={() => setModal(true)} style={({ pressed }) => [styles.addButton, { backgroundColor: colors.primary }, pressed && { opacity: 0.75 }]}><Feather name="plus" size={16} color={colors.card} /><Text style={[styles.addButtonText, { color: colors.card }]}>{t.add}</Text></Pressable></View>
        <View style={[styles.heroCard, { backgroundColor: colors.navy }]}>
          <View style={styles.heroTop}><View><Text style={[styles.heroLabel, { color: colors.mintStrong }]}>{t.current}</Text><Text style={[styles.heroValue, { color: colors.card }]}>{state.currentWeight.toFixed(1)} <Text style={styles.heroUnit}>{t.kg}</Text></Text></View><View style={styles.delta}><Feather name={delta <= 0 ? 'trending-down' : 'trending-up'} size={15} color={delta <= 0 ? colors.mintStrong : colors.coral} /><Text style={[styles.deltaText, { color: delta <= 0 ? colors.mintStrong : colors.coral }]}>{Math.abs(delta).toFixed(1)} {t.kg}</Text></View></View>
          <View style={styles.goalRow}><Text style={[styles.goalLabel, { color: colors.mint }]}>{t.target}</Text><Text style={[styles.goalValue, { color: colors.card }]}>{state.targetWeight.toFixed(1)} {t.kg}</Text></View>
          <View style={[styles.goalTrack, { backgroundColor: 'rgba(255,255,255,0.18)' }]}><View style={[styles.goalFill, { backgroundColor: colors.mintStrong, width: `${Math.min(100, Math.max(5, 100 - (Math.max(0, state.currentWeight - state.targetWeight) / 10) * 100))}%` }]} /></View>
        </View>
        <View style={styles.heading}><Text style={[styles.sectionTitle, { color: colors.navy }]}>{t.seeHistory}</Text><Text style={[styles.count, { color: colors.mutedForeground }]}>{state.weightHistory.length} {t.entries}</Text></View>
        <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <View style={[styles.targetLine, { bottom: ((state.targetWeight - range.min) / (range.max - range.min)) * chartHeight + 31, borderColor: colors.coral }]}><Text style={[styles.targetLabel, { color: colors.coral }]}>{t.target}</Text></View>
          <View style={[styles.chart, { height: chartHeight }]}>
            {state.weightHistory.map((entry, index) => {
              const x = state.weightHistory.length === 1 ? 50 : index / (state.weightHistory.length - 1) * 100;
              const y = chartHeight - ((entry.value - range.min) / (range.max - range.min)) * chartHeight;
              return <View key={entry.date} style={[styles.point, { left: `${x}%`, top: y, backgroundColor: index === state.weightHistory.length - 1 ? colors.primary : colors.lavenderStrong, borderColor: colors.card }]} />;
            })}
            <View style={styles.chartLine} />
          </View>
          <View style={styles.chartLabels}><Text style={[styles.chartLabel, { color: colors.mutedForeground }]}>{state.weightHistory[0]?.date.slice(5)}</Text><Text style={[styles.chartLabel, { color: colors.mutedForeground }]}>{state.weightHistory[state.weightHistory.length - 1]?.date.slice(5)}</Text></View>
        </View>
        <Text style={[styles.note, { color: colors.mutedForeground }]}>{t.progressNote}</Text>
      </ScrollView>
      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <View style={styles.modalBackdrop}><View style={[styles.modal, { backgroundColor: colors.card, paddingBottom: insets.bottom + 18 }]}><View style={styles.modalHandle} /><Text style={[styles.modalTitle, { color: colors.navy }]}>{t.logWeight}</Text><Text style={[styles.modalHint, { color: colors.mutedForeground }]}>{t.progressHint}</Text><TextInput autoFocus keyboardType="decimal-pad" value={weight} onChangeText={setWeight} placeholder={t.enterWeight} placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.navy }]} /><Pressable testID="save-weight" onPress={() => { const parsed = Number(weight.replace(',', '.')); if (Number.isFinite(parsed) && parsed > 0) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); addWeight(parsed); setModal(false); } }} style={[styles.save, { backgroundColor: colors.primary }]}><Text style={[styles.saveText, { color: colors.card }]}>{t.save}</Text></Pressable><Pressable onPress={() => setModal(false)} style={styles.cancel}><Text style={[styles.cancelText, { color: colors.mutedForeground }]}>{t.done}</Text></Pressable></View></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 26 },
  kicker: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '800', marginBottom: 7 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 19 },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.7 },
  subtitle: { fontSize: 12, marginTop: 5 },
  addButton: { paddingHorizontal: 13, height: 38, borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 5 },
  addButtonText: { fontSize: 12, fontWeight: '700' },
  heroCard: { borderRadius: 23, padding: 19, marginBottom: 26 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  heroLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700', marginBottom: 7 },
  heroValue: { fontSize: 35, fontWeight: '700', letterSpacing: -1 },
  heroUnit: { fontSize: 14, fontWeight: '600' },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  deltaText: { fontSize: 12, fontWeight: '700' },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalLabel: { fontSize: 11 },
  goalValue: { fontSize: 11, fontWeight: '700' },
  goalTrack: { height: 7, borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: '100%', borderRadius: 4 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 11 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  count: { fontSize: 11 },
  chartCard: { borderRadius: 21, padding: 17, marginBottom: 16, height: 193 },
  chart: { position: 'relative', marginTop: 15 },
  chartLine: { position: 'absolute', left: '3%', right: '3%', top: '52%', height: 2, backgroundColor: '#A8D9C8', transform: [{ rotate: '-4deg' }], opacity: 0.6 },
  point: { position: 'absolute', width: 11, height: 11, borderRadius: 6, borderWidth: 2, marginLeft: -5, marginTop: -5, zIndex: 2 },
  targetLine: { position: 'absolute', left: 17, right: 17, height: 1, borderTopWidth: 1, borderStyle: 'dashed', zIndex: 1 },
  targetLabel: { position: 'absolute', right: 0, top: -16, fontSize: 9, fontWeight: '700' },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  chartLabel: { fontSize: 10 },
  note: { fontSize: 12, lineHeight: 18, textAlign: 'center', paddingHorizontal: 18 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(23,52,59,0.4)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22 },
  modalHandle: { width: 36, height: 4, borderRadius: 3, backgroundColor: '#DCE8E2', alignSelf: 'center', marginBottom: 22 },
  modalTitle: { fontSize: 23, fontWeight: '700', marginBottom: 6 },
  modalHint: { fontSize: 12, marginBottom: 17 },
  input: { height: 52, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 17, marginBottom: 13 },
  save: { height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontSize: 14, fontWeight: '700' },
  cancel: { height: 43, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 13, fontWeight: '600' },
});