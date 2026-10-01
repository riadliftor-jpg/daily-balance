import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDailyBalance } from '@/context/DailyBalanceContext';
import { useColors } from '@/hooks/useColors';
import { useCopy, getDayNames } from '@/lib/i18n';
import { getWeeklyPlan } from '@/lib/weeklyPlan';

type Language = 'ar' | 'fr' | 'en';

const romanticMessages: Record<Language, string[]> = {
  ar: [
    'Narimane ❤️ وجودك يجعل يومي أجمل.',
    'لغز اليوم: شيء لا يُرى، لكن القلب يشعر به… ما هو؟ ❤️',
    'Narimane، لو كان للحب عنوان، لاخترت عنوانك أنتِ. 🌹',
    'رسالة سرية لكِ: أنتِ أجمل مفاجأة في أيامي. 💌',
    'اقتربي قليلًا… لدي شيء صغير أريد أن أهمسه لقلبك. 😉❤️',
    'هناك شخص واحد يجعل الابتسامة تأتي بلا سبب… أنتِ تعرفين من تكونين. ❤️',
    'لو كان بإمكاني إرسال حضن عبر الشاشة، لوصل إليك الآن. 🤍',
  ],
  fr: [
    'Narimane ❤️ ta présence rend mes journées plus belles.',
    'Petite énigme : on ne peut pas le voir, mais le cœur le ressent… qu’est-ce que c’est ? ❤️',
    'Narimane, si l’amour avait une adresse, je choisirais la tienne. 🌹',
    'Message secret : tu es ma plus jolie surprise. 💌',
    'Approche-toi… j’ai un petit secret à murmurer à ton cœur. 😉❤️',
    'Il y a une personne qui fait sourire sans raison… tu sais qui tu es. ❤️',
    'Si je pouvais envoyer un câlin à travers l’écran, il serait déjà chez toi. 🤍',
  ],
  en: [
    'Narimane ❤️ you make my days brighter just by being there.',
    'Today’s riddle: you cannot see it, but your heart can feel it… what is it? ❤️',
    'Narimane, if love had an address, I would choose yours. 🌹',
    'Secret message: you are my favorite surprise. 💌',
    'Come a little closer… I have a tiny secret to whisper to your heart. 😉❤️',
    'There is someone who makes me smile for no reason… you know who you are. ❤️',
    'If I could send a hug through the screen, it would already be with you. 🤍',
  ],
};

function RomanticWelcome({
  language,
  colors,
}: {
  language: Language;
  colors: any;
}) {
  const day = new Date().getDate();
  const message = romanticMessages[language][day % romanticMessages[language].length];
  const animationType = day % 3;

  const scale = useRef(new Animated.Value(0.55)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const [opened, setOpened] = useState(false);

  const openMessage = () => {
    if (opened) return;
    setOpened(true);

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    ).catch(() => undefined);

    scale.setValue(animationType === 1 ? 0.65 : 0.35);
    opacity.setValue(0);

    const main = Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 65,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    if (animationType === 2) {
      rotate.setValue(-1);
      Animated.parallel([
        main,
        Animated.sequence([
          Animated.timing(rotate, { toValue: 1, duration: 140, useNativeDriver: true }),
          Animated.timing(rotate, { toValue: -1, duration: 140, useNativeDriver: true }),
          Animated.spring(rotate, { toValue: 0, friction: 4, useNativeDriver: true }),
        ]),
      ]).start();
    } else {
      Animated.parallel([
        main,
        Animated.sequence([
          Animated.timing(heartScale, { toValue: 1.3, duration: 170, useNativeDriver: true }),
          Animated.spring(heartScale, { toValue: 1, friction: 4, useNativeDriver: true }),
        ]),
      ]).start();
    }
  };

  const rotateValue = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  const surpriseText =
    language === 'ar'
      ? 'لديكِ مفاجأة صغيرة ❤️'
      : language === 'fr'
        ? 'Tu as une petite surprise ❤️'
        : 'You have a little surprise ❤️';

  const tapText =
    language === 'ar'
      ? 'اضغطي لاكتشافها'
      : language === 'fr'
        ? 'Appuie pour la découvrir'
        : 'Tap to discover it';

  return (
    <Pressable
      onPress={openMessage}
      accessibilityLabel="Narimane romantic message"
      style={({ pressed }) => [
        styles.romanticCard,
        { backgroundColor: colors.coral, opacity: pressed ? 0.94 : 1 },
      ]}
    >
      <Animated.View style={[styles.heartCircle, { transform: [{ scale: heartScale }] }]}>
        <Text style={styles.heart}>♥</Text>
      </Animated.View>

      <View style={styles.romanticBody}>
        <Text style={styles.romanticName}>Narimane</Text>

        {!opened ? (
          <>
            <Text style={styles.romanticHint}>{surpriseText}</Text>
            <Text style={styles.romanticTap}>{tapText}</Text>
          </>
        ) : (
          <Animated.View
            style={{
              opacity,
              transform: [{ scale }, { rotate: rotateValue }],
            }}
          >
            <Text
              style={[
                styles.romanticMessage,
                { textAlign: language === 'ar' ? 'right' : 'left' },
              ]}
            >
              {message}
            </Text>
          </Animated.View>
        )}
      </View>

      <Feather
        name={opened ? 'heart' : 'gift'}
        size={22}
        color="#FFFFFF"
        style={styles.gift}
      />
    </Pressable>
  );
}

function CheckButton({
  checked,
  colors,
}: {
  checked: boolean;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.checkButton,
        {
          backgroundColor: checked ? colors.primary : colors.background,
          borderColor: checked ? colors.primary : colors.border,
        },
      ]}
    >
      {checked ? <Feather name="check" size={15} color="#FFFFFF" /> : null}
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const {
    state,
    getLog,
    toggleWater,
    toggleMeal,
    toggleExercise,
    toggleSchedule,
    advice,
  } = useDailyBalance();

  const t = useCopy(state.language);
  const todayDay = new Date().getDay();
  const plan = getWeeklyPlan(state.language, todayDay);
  const log = getLog(todayDay, state.mode);
  const schedule =
    state.mode === 'work' ? plan.workSchedule : plan.vacationSchedule;

  const completedMeals = plan.meals.filter((item) => log.meals[item.id]).length;
  const completedExercises = plan.exercises.filter(
    (item) => log.exercises[item.id],
  ).length;
  const completedSchedule = schedule.filter(
    (item) => log.schedule[item.id],
  ).length;
  const completedTasks =
    completedMeals + completedExercises + completedSchedule;
  const totalTasks =
    plan.meals.length + plan.exercises.length + schedule.length;

  const waterProgress = Math.min(100, (log.waterGlasses / 8) * 100);

  const progress = useMemo(() => {
    const current = Number(state.currentWeight);
    const target = Number(state.targetWeight);
    const start = 73.5;

    if (!Number.isFinite(current) || !Number.isFinite(target)) return 0;
    if (current <= target) return 100;
    if (start <= target) return 0;

    return Math.round(
      Math.min(100, Math.max(0, ((start - current) / (start - target)) * 100)),
    );
  }, [state.currentWeight, state.targetWeight]);

  const dayName = getDayNames(state.language)[todayDay];

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(state.language === 'ar' ? 'ar' : state.language, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date()),
    [state.language],
  );

  const displayName =
    state.profileName && state.profileName !== 'Alex'
      ? state.profileName
      : 'Narimane';

  const direction = state.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 18,
            paddingBottom: insets.bottom + 112,
          },
        ]}
      >
        <View style={[styles.header, { direction }]}>
          <View style={styles.headerText}>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
              {dateLabel}
            </Text>
            <Text style={[styles.greeting, { color: colors.navy }]}>
              {t.greeting}, {displayName}
            </Text>
            <Text style={[styles.dayLabel, { color: colors.primary }]}>
              {dayName} · {t.today}
            </Text>
          </View>

          <View style={[styles.iconButton, { backgroundColor: colors.card }]}>
            <Feather name="heart" size={19} color={colors.coral} />
          </View>
        </View>

        <RomanticWelcome language={state.language} colors={colors} />

        <View style={[styles.modeCard, { backgroundColor: colors.mint, direction }]}>
          <View style={styles.modeCopy}>
            <Text style={[styles.modeTitle, { color: colors.navy }]}>
              {state.mode === 'work' ? t.work : t.vacation}
            </Text>
            <Text style={[styles.modeSubtitle, { color: colors.secondaryForeground }]}>
              {state.mode === 'work' ? t.workSubtitle : t.vacationSubtitle}
            </Text>
          </View>

          <View style={[styles.modePill, { backgroundColor: colors.card }]}>
            <Feather
              name={state.mode === 'work' ? 'briefcase' : 'sun'}
              size={15}
              color={colors.primary}
            />
            <Text style={[styles.modePillText, { color: colors.navy }]}>
              {state.mode === 'work' ? t.work : t.vacation}
            </Text>
          </View>
        </View>

        <View style={[styles.sectionHeading, { direction }]}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>
            {t.today}
          </Text>
          <Text style={[styles.sectionMeta, { color: colors.mutedForeground }]}>
            {completedTasks}/{totalTasks} {t.tasks}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <View style={[styles.metricIcon, { backgroundColor: colors.lavender }]}>
              <Feather name="activity" size={18} color={colors.lavenderStrong} />
            </View>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
              {t.weight}
            </Text>
            <Text style={[styles.metricValue, { color: colors.navy }]}>
              {Number(state.currentWeight).toFixed(1)}{' '}
              <Text style={styles.unit}>{t.kg}</Text>
            </Text>
            <View style={styles.metricFooter}>
              <Text style={[styles.metricFooterText, { color: colors.success }]}>
                {progress}%
              </Text>
              <Text style={[styles.metricFooterText, { color: colors.mutedForeground }]}>
                {t.progress}
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.muted }]}>
              <View
                style={[
                  styles.fill,
                  { width: `${progress}%`, backgroundColor: colors.lavenderStrong },
                ]}
              />
            </View>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <View style={[styles.metricIcon, { backgroundColor: colors.mint }]}>
              <Feather name="droplet" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>
              {t.water}
            </Text>
            <Text style={[styles.metricValue, { color: colors.navy }]}>
              {log.waterGlasses}
              <Text style={styles.unit}>/8</Text>
            </Text>
            <Text style={[styles.metricFooterText, { color: colors.mutedForeground }]}>
              {t.glasses} · {t.goal}
            </Text>
            <View style={[styles.track, { backgroundColor: colors.muted }]}>
              <View
                style={[
                  styles.fill,
                  { width: `${waterProgress}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={[styles.darkCard, { backgroundColor: colors.navy }]}>
          <View style={styles.darkHeader}>
            <View>
              <Text style={[styles.darkEyebrow, { color: colors.mintStrong }]}>
                {t.water}
              </Text>
              <Text style={[styles.darkTitle, { color: colors.card }]}>
                {log.waterGlasses < 8
                  ? `${8 - log.waterGlasses} ${t.glasses} ${t.remaining}`
                  : t.allDone}
              </Text>
            </View>
            <Feather name="droplet" size={25} color={colors.mintStrong} />
          </View>

          <View style={styles.glassRow}>
            {Array.from({ length: 8 }, (_, index) => {
              const filled = index < log.waterGlasses;
              return (
                <Pressable
                  key={index}
                  accessibilityLabel={`${t.water} ${index + 1}`}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => undefined);
                    toggleWater(index, todayDay, state.mode);
                  }}
                  style={[
                    styles.glass,
                    {
                      backgroundColor: filled
                        ? colors.mintStrong
                        : 'rgba(255,255,255,0.12)',
                      borderColor: filled
                        ? colors.mintStrong
                        : 'rgba(255,255,255,0.22)',
                    },
                  ]}
                >
                  <Feather
                    name="droplet"
                    size={16}
                    color={filled ? colors.navy : colors.mint}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.sectionHeading, { direction }]}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>
            {t.meals}
          </Text>
          <Text style={[styles.sectionMeta, { color: colors.mutedForeground }]}>
            {completedMeals}/{plan.meals.length}
          </Text>
        </View>

        <View style={[styles.listCard, { backgroundColor: colors.card }]}>
          {plan.meals.map((meal, index) => {
            const checked = !!log.meals[meal.id];
            return (
              <Pressable
                key={meal.id}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => undefined);
                  toggleMeal(meal.id, todayDay, state.mode);
                }}
                style={[
                  styles.listRow,
                  index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                ]}
              >
                <CheckButton
                  checked={checked}
                  colors={colors}
                />
                <View style={styles.listBody}>
                  <Text style={[styles.listTitle, { color: colors.navy }]}>
                    {meal.title}
                  </Text>
                  <Text style={[styles.listDetail, { color: colors.mutedForeground }]}>
                    {meal.time} · {meal.detail}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.sectionHeading, { direction }]}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>
            {t.movement}
          </Text>
          <Text style={[styles.sectionMeta, { color: colors.mutedForeground }]}>
            {completedExercises}/{plan.exercises.length}
          </Text>
        </View>

        <View style={[styles.listCard, { backgroundColor: colors.card }]}>
          {plan.exercises.map((exercise, index) => {
            const checked = !!log.exercises[exercise.id];
            return (
              <Pressable
                key={exercise.id}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => undefined);
                  toggleExercise(exercise.id, todayDay, state.mode);
                }}
                style={[
                  styles.listRow,
                  index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                ]}
              >
                <CheckButton
                  checked={checked}
                  colors={colors}
                />
                <View style={styles.listBody}>
                  <Text style={[styles.listTitle, { color: colors.navy }]}>
                    {exercise.title}
                  </Text>
                  <Text style={[styles.listDetail, { color: colors.mutedForeground }]}>
                    {exercise.duration} · {exercise.difficulty}
                  </Text>
                  <Text style={[styles.listDetail, { color: colors.mutedForeground }]}>
                    {exercise.instructions}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.sectionHeading, { direction }]}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>
            {t.schedule}
          </Text>
          <Text style={[styles.sectionMeta, { color: colors.mutedForeground }]}>
            {completedSchedule}/{schedule.length}
          </Text>
        </View>

        <View style={[styles.listCard, { backgroundColor: colors.card }]}>
          {schedule.map((item, index) => {
            const checked = !!log.schedule[item.id];
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => undefined);
                  toggleSchedule(item.id, todayDay, state.mode);
                }}
                style={[
                  styles.scheduleRow,
                  index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                ]}
              >
                <Text style={[styles.scheduleTime, { color: colors.primary }]}>
                  {item.time}
                </Text>
                <View style={styles.scheduleBody}>
                  <Text
                    style={[
                      styles.listTitle,
                      { color: checked ? colors.mutedForeground : colors.navy },
                      checked && { textDecorationLine: 'line-through' },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
                <CheckButton
                  checked={checked}
                  colors={colors}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.adviceCard, { backgroundColor: colors.mint, direction }]}>
          <View style={[styles.adviceIcon, { backgroundColor: colors.card }]}>
            <Feather name="heart" size={17} color={colors.coral} />
          </View>
          <View style={styles.adviceBody}>
            <Text style={[styles.adviceTitle, { color: colors.navy }]}>
              {t.advice}
            </Text>
            <Text style={[styles.adviceText, { color: colors.secondaryForeground }]}>
              {advice}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerText: { flex: 1 },
  eyebrow: { fontSize: 12, marginBottom: 4 },
  greeting: { fontSize: 25, fontWeight: '800' },
  dayLabel: { fontSize: 13, fontWeight: '700', marginTop: 5 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  romanticCard: {
    minHeight: 118,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  heartCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: { color: '#FFFFFF', fontSize: 28 },
  romanticBody: { flex: 1, marginHorizontal: 14 },
  romanticName: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', marginBottom: 5 },
  romanticHint: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  romanticTap: { color: 'rgba(255,255,255,0.82)', fontSize: 12, marginTop: 7 },
  romanticMessage: { color: '#FFFFFF', fontSize: 16, lineHeight: 23, fontWeight: '700' },
  gift: { marginLeft: 4 },
  modeCard: {
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeCopy: { flex: 1, paddingRight: 10 },
  modeTitle: { fontSize: 16, fontWeight: '800' },
  modeSubtitle: { fontSize: 12, lineHeight: 17, marginTop: 3 },
  modePill: {
    minHeight: 38,
    borderRadius: 19,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modePillText: { fontSize: 11, fontWeight: '800' },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 19, fontWeight: '800' },
  sectionMeta: { fontSize: 12, fontWeight: '600' },
  metricRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 15,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricLabel: { fontSize: 12, fontWeight: '600' },
  metricValue: { fontSize: 25, fontWeight: '800', marginTop: 3 },
  unit: { fontSize: 12, fontWeight: '700' },
  metricFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 7,
  },
  metricFooterText: { fontSize: 11, fontWeight: '600' },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  darkCard: { borderRadius: 22, padding: 17, marginBottom: 22 },
  darkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkEyebrow: { fontSize: 11, fontWeight: '800', marginBottom: 4 },
  darkTitle: { fontSize: 15, fontWeight: '800' },
  glassRow: { flexDirection: 'row', gap: 7, marginTop: 16 },
  glass: {
    flex: 1,
    minHeight: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
  listRow: {
    minHeight: 74,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listBody: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: '750' as any },
  listDetail: { fontSize: 11, lineHeight: 16, marginTop: 3 },
  scheduleRow: {
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTime: { width: 52, fontSize: 12, fontWeight: '800' },
  scheduleBody: { flex: 1, paddingRight: 8 },
  adviceCard: {
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  adviceIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  adviceBody: { flex: 1 },
  adviceTitle: { fontSize: 14, fontWeight: '800' },
  adviceText: { fontSize: 12, lineHeight: 18, marginTop: 4 },
});
