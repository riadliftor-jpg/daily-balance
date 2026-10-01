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
import { getDayNames, useCopy } from '@/lib/i18n';
import { getWeeklyPlan } from '@/lib/weeklyPlan';

const romanticMessages = {
  ar: [
    'ناريمان ❤️ وجودك يجعل كل يوم أجمل.',
    'رسالة سرية لكِ: أنتِ أجمل جزء في يومي.',
    'لغز اليوم: من هي التي تجعل قلبي يبتسم دون أن تتكلم؟ ناريمان طبعًا ❤️',
    'اقتربي قليلًا... لدي رسالة لا أريد أن يسمعها أحد غيرك 😉❤️',
    'بعض الناس يدخلون حياتنا صدفة، وأنتِ دخلتِ قلبي وبقيتِ فيه.',
  ],
  fr: [
    'Narimane ❤️ ta présence rend chaque journée plus belle.',
    'Message secret pour toi : tu es la plus belle partie de ma journée.',
    'Petite énigme : qui fait sourire mon cœur sans dire un mot ? Narimane ❤️',
    'Approche un peu... j’ai un petit message que personne d’autre ne doit entendre 😉❤️',
    'Certaines personnes entrent dans notre vie par hasard. Toi, tu es entrée dans mon cœur.',
  ],
  en: [
    'Narimane ❤️ your presence makes every day more beautiful.',
    'A secret message for you: you are the best part of my day.',
    'Today’s riddle: who makes my heart smile without saying a word? Narimane ❤️',
    'Come a little closer... I have a message only you should hear 😉❤️',
    'Some people enter our lives by chance. You entered my heart and stayed there.',
  ],
} as const;

const romanticColors = [
  '#EE9275',
  '#8E77B7',
  '#D95C5C',
  '#0D817A',
  '#F7C98B',
];

function getRomanticMessage(language: 'ar' | 'fr' | 'en') {
  const messages = romanticMessages[language];
  const index = new Date().getDate() % messages.length;
  return messages[index];
}

function RomanticWelcome({
  language,
}: {
  language: 'ar' | 'fr' | 'en';
}) {
  const [revealed, setRevealed] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const message = useMemo(
    () => getRomanticMessage(language),
    [language]
  );

  const color =
    romanticColors[new Date().getDate() % romanticColors.length];

  const reveal = async () => {
    await Haptics.selectionAsync();

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.15,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.94,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(opacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setRevealed(true);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.romanticContainer}>
      <Animated.View
        style={[
          styles.romanticCard,
          {
            borderColor: color,
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        {!revealed ? (
          <Pressable
            onPress={reveal}
            style={styles.romanticReveal}
          >
            <View
              style={[
                styles.heartCircle,
                { backgroundColor: color },
              ]}
            >
              <Feather
                name="heart"
                size={28}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.romanticTitle}>
              Narimane ❤️
            </Text>

            <Text style={styles.romanticHint}>
              {language === 'ar'
                ? 'اضغطي هنا لاكتشاف مفاجأة اليوم'
                : language === 'fr'
                  ? 'Appuie ici pour découvrir la surprise du jour'
                  : 'Tap here to discover today’s surprise'}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.romanticMessage}>
            <Text style={styles.romanticTitle}>
              Narimane ❤️
            </Text>

            <Text
              style={[
                styles.romanticText,
                language === 'ar' && styles.rtlText,
              ]}
            >
              {message}
            </Text>

            <Text style={styles.romanticSmall}>
              {language === 'ar'
                ? 'رسالة اليوم ✨'
                : language === 'fr'
                  ? 'Message du jour ✨'
                  : 'Today’s message ✨'}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

function CheckButton({
  checked,
  onPress,
}: {
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.checkButton,
        checked && styles.checkButtonDone,
      ]}
    >
      <Feather
        name={checked ? 'check' : 'circle'}
        size={18}
        color={checked ? '#FFFFFF' : '#6D7E7B'}
      />
    </Pressable>
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
    setMode,
    advice,
  } = useDailyBalance();

  const t = useCopy(state.language);

  const todayDay = new Date().getDay();

  const plan = useMemo(
    () => getWeeklyPlan(state.language, todayDay),
    [state.language, todayDay]
  );

  const log = getLog(todayDay, state.mode);

  const dayNames = getDayNames(state.language);

  const displayName =
    state.profileName &&
    state.profileName.trim() &&
    state.profileName !== 'Alex'
      ? state.profileName
      : 'Narimane';

  const activeSchedule =
    state.mode === 'work'
      ? plan.workSchedule
      : plan.vacationSchedule;

  const completedMeals = plan.meals.filter(
    (meal) => !!log.meals[meal.id]
  ).length;

  const completedExercises = plan.exercises.filter(
    (exercise) => !!log.exercises[exercise.id]
  ).length;

  const completedSchedule = activeSchedule.filter(
    (item) => !!log.schedule[item.id]
  ).length;

  const totalTasks =
    plan.meals.length +
    plan.exercises.length +
    activeSchedule.length;

  const completedTasks =
    completedMeals +
    completedExercises +
    completedSchedule;

  const progress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const waterGoal = 8;
  const waterCount = Math.min(
    Math.max(log.waterGlasses, 0),
    waterGoal
  );

  const currentWeight = state.currentWeight;
  const targetWeight = state.targetWeight;

  const changeMode = async (
    mode: 'work' | 'vacation'
  ) => {
    await Haptics.selectionAsync();
    setMode(mode);
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: 110 + insets.bottom,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text
              style={[
                styles.greeting,
                { color: colors.mutedForeground },
                state.language === 'ar' && styles.rtlText,
              ]}
            >
              {t.greeting}
            </Text>

            <Text
              style={[
                styles.name,
                { color: colors.text },
                state.language === 'ar' && styles.rtlText,
              ]}
            >
              {displayName} 👋
            </Text>

            <Text
              style={[
                styles.date,
                { color: colors.mutedForeground },
                state.language === 'ar' && styles.rtlText,
              ]}
            >
              {dayNames[todayDay]}
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              { backgroundColor: colors.mint },
            ]}
          >
            <Feather
              name="sun"
              size={24}
              color={colors.primary}
            />
          </View>
        </View>

        <RomanticWelcome language={state.language} />

        <View
          style={[
            styles.modeCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
              state.language === 'ar' && styles.rtlText,
            ]}
          >
            {state.language === 'ar'
              ? 'وضع اليوم'
              : state.language === 'fr'
                ? 'Mode du jour'
                : 'Today’s mode'}
          </Text>

          <View style={styles.modeButtons}>
            <Pressable
              onPress={() => changeMode('work')}
              style={[
                styles.modeButton,
                {
                  backgroundColor:
                    state.mode === 'work'
                      ? colors.primary
                      : colors.secondary,
                },
              ]}
            >
              <Feather
                name="briefcase"
                size={18}
                color={
                  state.mode === 'work'
                    ? colors.primaryForeground
                    : colors.secondaryForeground
                }
              />

              <Text
                style={[
                  styles.modeButtonText,
                  {
                    color:
                      state.mode === 'work'
                        ? colors.primaryForeground
                        : colors.secondaryForeground,
                  },
                ]}
              >
                {t.work}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => changeMode('vacation')}
              style={[
                styles.modeButton,
                {
                  backgroundColor:
                    state.mode === 'vacation'
                      ? colors.primary
                      : colors.secondary,
                },
              ]}
            >
              <Feather
                name="sun"
                size={18}
                color={
                  state.mode === 'vacation'
                    ? colors.primaryForeground
                    : colors.secondaryForeground
                }
              />

              <Text
                style={[
                  styles.modeButtonText,
                  {
                    color:
                      state.mode === 'vacation'
                        ? colors.primaryForeground
                        : colors.secondaryForeground,
                  },
                ]}
              >
                {t.vacation}
              </Text>
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.progressCard,
            { backgroundColor: colors.primary },
          ]}
        >
          <View style={styles.progressHeader}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.progressTitle,
                  state.language === 'ar' && styles.rtlText,
                ]}
              >
                {t.today}
              </Text>

              <Text
                style={[
                  styles.progressSubtitle,
                  state.language === 'ar' && styles.rtlText,
                ]}
              >
                {completedTasks} / {totalTasks} {t.tasks}
              </Text>
            </View>

            <View style={styles.progressCircle}>
              <Text style={styles.progressNumber}>
                {progress}%
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text
            style={[
              styles.progressRemaining,
              state.language === 'ar' && styles.rtlText,
            ]}
          >
            {progress === 100
              ? t.allDone
              : `${totalTasks - completedTasks} ${t.remaining}`}
          </Text>
        </View>

        <View style={styles.metricsRow}>
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.metricIcon,
                { backgroundColor: colors.lavender },
              ]}
            >
              <Feather
                name="activity"
                size={20}
                color={colors.lavenderStrong}
              />
            </View>

            <Text
              style={[
                styles.metricLabel,
                { color: colors.mutedForeground },
                state.language === 'ar' && styles.rtlText,
              ]}
            >
              {t.weight}
            </Text>

            <Text
              style={[
                styles.metricValue,
                { color: colors.text },
              ]}
            >
              {currentWeight} {t.kg}
            </Text>

            <Text
              style={[
                styles.metricTarget,
                { color: colors.mutedForeground },
              ]}
            >
              {t.target}: {targetWeight} {t.kg}
            </Text>
          </View>

          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.metricIcon,
                { backgroundColor: colors.mint },
              ]}
            >
              <Feather
                name="droplet"
                size={20}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.metricLabel,
                { color: colors.mutedForeground },
                state.language === 'ar' && styles.rtlText,
              ]}
            >
              {t.water}
            </Text>

            <Text
              style={[
                styles.metricValue,
                { color: colors.text },
              ]}
            >
              {waterCount}/{waterGoal}
            </Text>

            <Text
              style={[
                styles.metricTarget,
                { color: colors.mutedForeground },
              ]}
            >
              {t.glasses}
            </Text>
          </View>
        </View>
                <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{t.water}</Text>
            <Text style={styles.sectionSubtitle}>
              {waterCount} / {waterGoal} {t.glasses}
            </Text>
          </View>

          <View style={styles.waterBadge}>
            <Feather
              name="droplet"
              size={18}
              color={colors.primary}
            />
          </View>
        </View>

        <View style={styles.waterCard}>
          <View style={styles.waterTopRow}>
            <Text style={styles.waterTitle}>
              {waterCount} {t.glasses}
            </Text>

            <Text style={styles.waterPercent}>
              {Math.round((waterCount / waterGoal) * 100)}%
            </Text>
          </View>

          <View style={styles.waterProgressTrack}>
            <Animated.View
              style={[
                styles.waterProgressFill,
                {
                  width: `${Math.min(
                    (waterCount / waterGoal) * 100,
                    100
                  )}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>

          <View style={styles.glassesRow}>
            {Array.from({ length: waterGoal }).map((_, index) => {
              const filled = index < waterCount;

              return (
                <Pressable
                  key={`water-${index}`}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleWater(index, todayDay, state.mode);
                  }}
                  style={[
                    styles.glassButton,
                    {
                      backgroundColor: filled
                        ? colors.primary
                        : colors.muted,
                      borderColor: filled
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="droplet"
                    size={18}
                    color={
                      filled
                        ? colors.primaryForeground
                        : colors.mutedForeground
                    }
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{t.meals}</Text>
            <Text style={styles.sectionSubtitle}>
              {completedMeals} / {plan.meals.length}
            </Text>
          </View>

          <View
            style={[
              styles.sectionIcon,
              { backgroundColor: colors.lavender },
            ]}
          >
            <Feather
              name="coffee"
              size={18}
              color={colors.lavenderStrong}
            />
          </View>
        </View>

        <View style={styles.listCard}>
          {plan.meals.map((meal, index) => {
            const done = !!log.meals[meal.id];

            return (
              <View
                key={meal.id}
                style={[
                  styles.listItem,
                  index !== plan.meals.length - 1 &&
                    styles.listItemBorder,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View style={styles.timeColumn}>
                  <Text
                    style={[
                      styles.timeText,
                      { color: colors.primary },
                    ]}
                  >
                    {meal.time}
                  </Text>
                </View>

                <View style={styles.itemContent}>
                  <Text
                    style={[
                      styles.itemTitle,
                      done && styles.doneText,
                    ]}
                  >
                    {meal.title}
                  </Text>

                  <Text style={styles.itemDetail}>
                    {meal.detail}
                  </Text>
                </View>

                <CheckButton
                  checked={done}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleMeal(
                      meal.id,
                      todayDay,
                      state.mode
                    );
                  }}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{t.movement}</Text>
            <Text style={styles.sectionSubtitle}>
              {completedExercises} / {plan.exercises.length}
            </Text>
          </View>

          <View
            style={[
              styles.sectionIcon,
              { backgroundColor: colors.mint },
            ]}
          >
            <Feather
              name="activity"
              size={18}
              color={colors.success}
            />
          </View>
        </View>

        <View style={styles.listCard}>
          {plan.exercises.map((exercise, index) => {
            const done = !!log.exercises[exercise.id];

            return (
              <View
                key={exercise.id}
                style={[
                  styles.exerciseItem,
                  index !== plan.exercises.length - 1 &&
                    styles.listItemBorder,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.exerciseIcon,
                    {
                      backgroundColor: colors.secondary,
                    },
                  ]}
                >
                  <Feather
                    name="activity"
                    size={19}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.itemContent}>
                  <Text
                    style={[
                      styles.itemTitle,
                      done && styles.doneText,
                    ]}
                  >
                    {exercise.title}
                  </Text>

                  <Text style={styles.itemDetail}>
                    {exercise.duration} • {exercise.difficulty}
                  </Text>

                  <Text style={styles.exerciseInstructions}>
                    {exercise.instructions}
                  </Text>
                </View>

                <CheckButton
                  checked={done}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleExercise(
                      exercise.id,
                      todayDay,
                      state.mode
                    );
                  }}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{t.schedule}</Text>
            <Text style={styles.sectionSubtitle}>
              {completedSchedule} / {activeSchedule.length}
            </Text>
          </View>

          <View
            style={[
              styles.sectionIcon,
              { backgroundColor: colors.lavender },
            ]}
          >
            <Feather
              name="clock"
              size={18}
              color={colors.lavenderStrong}
            />
          </View>
        </View>

        <View style={styles.listCard}>
          {activeSchedule.map((item, index) => {
            const done = !!log.schedule[item.id];

            return (
              <View
                key={item.id}
                style={[
                  styles.scheduleItem,
                  index !== activeSchedule.length - 1 &&
                    styles.listItemBorder,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View style={styles.scheduleTime}>
                  <Text
                    style={[
                      styles.timeText,
                      { color: colors.primary },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>

                <View style={styles.scheduleIcon}>
                  <Feather
                    name={
                      item.kind === 'water'
                        ? 'droplet'
                        : item.kind === 'meal'
                          ? 'coffee'
                          : item.kind === 'movement'
                            ? 'activity'
                            : item.kind === 'work'
                              ? 'briefcase'
                              : item.kind === 'rest'
                                ? 'moon'
                                : 'clock'
                    }
                    size={17}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.itemContent}>
                  <Text
                    style={[
                      styles.itemTitle,
                      done && styles.doneText,
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>

                <CheckButton
                  checked={done}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleSchedule(
                      item.id,
                      todayDay,
                      state.mode
                    );
                  }}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.adviceCard}>
          <View style={styles.adviceIcon}>
            <Feather
              name="heart"
              size={20}
              color={colors.coral}
            />
          </View>

          <View style={styles.adviceContent}>
            <Text style={styles.adviceTitle}>
              {t.advice}
            </Text>

            <Text style={styles.adviceText}>
              {advice}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },

  name: {
    fontSize: 27,
    fontWeight: '800',
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  romanticCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    overflow: 'hidden',
  },

  romanticTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  romanticHeart: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  romanticLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
  },

  romanticTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  romanticMessage: {
    fontSize: 17,
    lineHeight: 27,
    fontWeight: '600',
  },

  modeCard: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 18,
    marginBottom: 18,
  },

  modeButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  modeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 7,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressCard: {
    borderRadius: 20,
    padding: 17,
    marginBottom: 18,
  },

  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  progressValue: {
    fontSize: 18,
    fontWeight: '800',
  },

  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
  },

  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    minHeight: 104,
  },

  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  metricValue: {
    fontSize: 18,
    fontWeight: '800',
  },

  metricTarget: {
    fontSize: 11,
    marginTop: 3,
  },

  waterBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D8EEE7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  waterCard: {
    borderRadius: 20,
    padding: 17,
    marginBottom: 18,
  },

  waterTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  waterTitle: {
    fontSize: 17,
    fontWeight: '800',
  },

  waterPercent: {
    fontSize: 13,
    fontWeight: '700',
  },

  waterProgressTrack: {
    height: 9,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#EEF3F0',
    marginBottom: 14,
  },

  waterProgressFill: {
    height: '100%',
    borderRadius: 5,
  },

  glassesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  glassButton: {
    width: 39,
    height: 39,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    minHeight: 76,
  },

  listItemBorder: {
    borderBottomWidth: 1,
  },

  timeColumn: {
    width: 56,
  },

  timeText: {
    fontSize: 12,
    fontWeight: '800',
  },

  itemContent: {
    flex: 1,
    paddingHorizontal: 8,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },

  itemDetail: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  doneText: {
    textDecorationLine: 'line-through',
    opacity: 0.55,
  },

  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    minHeight: 88,
  },

  exerciseIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  exerciseInstructions: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    minHeight: 70,
  },

  scheduleTime: {
    width: 55,
  },

  scheduleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },

  adviceCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 17,
    marginTop: 2,
  },

  adviceIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  adviceContent: {
    flex: 1,
    paddingLeft: 12,
  },

  adviceTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },

  adviceText: {
    fontSize: 13,
    lineHeight: 20,
  },

  bottomSpacer: {
    height: 20,
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },

  name: {
    fontSize: 27,
    fontWeight: '800',
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  romanticCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    overflow: 'hidden',
  },

  romanticTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  romanticHeart: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  romanticLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
  },

  romanticTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  romanticMessage: {
    fontSize: 17,
    lineHeight: 27,
    fontWeight: '600',
  },

  modeCard: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 18,
    marginBottom: 18,
  },

  modeButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  modeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 7,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressCard: {
    borderRadius: 20,
    padding: 17,
    marginBottom: 18,
  },

  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  progressValue: {
    fontSize: 18,
    fontWeight: '800',
  },

  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
  },

  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    minHeight: 104,
  },

  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  metricValue: {
    fontSize: 18,
    fontWeight: '800',
  },

  metricTarget: {
    fontSize: 11,
    marginTop: 3,
  },

  waterBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  waterCard: {
    borderRadius: 20,
    padding: 17,
    marginBottom: 18,
  },

  waterTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  waterTitle: {
    fontSize: 17,
    fontWeight: '800',
  },

  waterPercent: {
    fontSize: 13,
    fontWeight: '700',
  },

  waterProgressTrack: {
    height: 9,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 14,
  },

  waterProgressFill: {
    height: '100%',
    borderRadius: 5,
  },

  glassesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  glassButton: {
    width: 39,
    height: 39,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    minHeight: 76,
  },

  listItemBorder: {
    borderBottomWidth: 1,
  },

  timeColumn: {
    width: 56,
  },

  timeText: {
    fontSize: 12,
    fontWeight: '800',
  },

  itemContent: {
    flex: 1,
    paddingHorizontal: 8,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },

  itemDetail: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  doneText: {
    textDecorationLine: 'line-through',
    opacity: 0.55,
  },

  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    minHeight: 88,
  },

  exerciseIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  exerciseInstructions: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    minHeight: 70,
  },

  scheduleTime: {
    width: 55,
  },

  scheduleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },

  adviceCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 17,
    marginTop: 2,
  },

  adviceIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },

  adviceContent: {
    flex: 1,
    paddingLeft: 12,
  },

  adviceTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },

  adviceText: {
    fontSize: 13,
    lineHeight: 20,
  },

  bottomSpacer: {
    height: 20,
  },
});
