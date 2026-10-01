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
};

const romanticColors = [
  '#EE9275',
  '#8E77B7',
  '#D95C5C',
  '#0D817A',
  '#F7C98B',
];

function getRomanticMessage(language: 'ar' | 'fr' | 'en') {
  const messages = romanticMessages[language];
  const day = new Date().getDate();
  return messages[day % messages.length];
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

  const handleReveal = async () => {
    await Haptics.selectionAsync();

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.18,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.92,
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
            transform: [{ scale }],
            opacity,
            borderColor: color,
          },
        ]}
      >
        {!revealed ? (
          <Pressable
            onPress={handleReveal}
            style={styles.romanticReveal}
          >
            <View
              style={[
                styles.heartCircle,
                { backgroundColor: color },
              ]}
            >
              <Feather name="heart" size={28} color="#FFFFFF" />
            </View>

            <Text style={styles.romanticTitle}>
              Narimane ❤️
            </Text>

            <Text style={styles.romanticHint}>
              {language === 'ar'
                ? 'اضغطي هنا لتكتشفي مفاجأة اليوم'
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

  const { t } = useCopy(state.language);

  const todayDay = new Date().getDay();

  const plan = useMemo(
    () => getWeeklyPlan(todayDay, state.mode),
    [todayDay, state.mode]
  );

  const log = getLog(todayDay, state.mode);

  const dayNames = getDayNames(state.language);

  const displayName =
    state.profileName && state.profileName !== 'Alex'
      ? state.profileName
      : 'Narimane';

  const completedMeals = log.meals.filter(Boolean).length;
  const completedExercises = log.exercises.filter(Boolean).length;
  const completedSchedule = log.schedule.filter(Boolean).length;
  const completedWater = log.waterGlasses.filter(Boolean).length;

  const totalTasks =
    plan.meals.length +
    plan.exercises.length +
    plan.workSchedule.length;

  const completedTasks =
    completedMeals +
    completedExercises +
    completedSchedule;

  const progress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const waterGoal = 8;

  const currentWeight =
    state.currentWeight ?? state.weightHistory?.[0]?.value ?? 0;

  const targetWeight = state.targetWeight ?? 0;

  const handleModeChange = async (
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
              onPress={() => handleModeChange('work')}
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
              onPress={() => handleModeChange('vacation')}
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
              {currentWeight || '--'} {t.kg}
            </Text>

            {targetWeight > 0 && (
              <Text
                style={[
                  styles.metricTarget,
                  { color: colors.mutedForeground },
                ]}
              >
                {t.target}: {targetWeight} {t.kg}
              </Text>
            )}
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
              {completedWater}/{waterGoal}
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
                <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text },
                  state.language === 'ar' && styles.rtlText,
                ]}
              >
                {t.water}
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.mutedForeground },
                  state.language === 'ar' && styles.rtlText,
                ]}
              >
                {completedWater} / {waterGoal} {t.glasses}
              </Text>
            </View>

            <Feather
              name="droplet"
              size={24}
              color={colors.primary}
            />
          </View>

          <View style={styles.waterGrid}>
            {Array.from({ length: waterGoal }).map((_, index) => {
              const checked = !!log.waterGlasses[index];

              return (
                <Pressable
                  key={`water-${index}`}
                  onPress={async () => {
                    await Haptics.selectionAsync();
                    toggleWater(
                      index,
                      todayDay,
                      state.mode
                    );
                  }}
                  style={[
                    styles.waterItem,
                    {
                      backgroundColor: checked
                        ? colors.primary
                        : colors.muted,
                    },
                  ]}
                >
                  <Feather
                    name="droplet"
                    size={20}
                    color={
                      checked
                        ? colors.primaryForeground
                        : colors.mutedForeground
                    }
                  />

                  <Text
                    style={[
                      styles.waterNumber,
                      {
                        color: checked
                          ? colors.primaryForeground
                          : colors.mutedForeground,
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionHeaderOutside}>
          <Text
            style={[
              styles.largeSectionTitle,
              { color: colors.text },
              state.language === 'ar' && styles.rtlText,
            ]}
          >
            {t.meals}
          </Text>

          <Text
            style={[
              styles.sectionCount,
              { color: colors.mutedForeground },
            ]}
          >
            {completedMeals}/{plan.meals.length}
          </Text>
        </View>

        <View
          style={[
            styles.listCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {plan.meals.map((meal, index) => {
            const checked = !!log.meals[index];

            return (
              <View
                key={meal.id}
                style={[
                  styles.listItem,
                  index < plan.meals.length - 1 &&
                    styles.listItemBorder,
                  {
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.timeBadge,
                    { backgroundColor: colors.mint },
                  ]}
                >
                  <Text
                    style={[
                      styles.timeText,
                      { color: colors.primary },
                    ]}
                  >
                    {meal.time}
                  </Text>
                </View>

                <View style={styles.listContent}>
                  <Text
                    style={[
                      styles.listTitle,
                      { color: colors.text },
                      checked && styles.completedText,
                      state.language === 'ar' &&
                        styles.rtlText,
                    ]}
                  >
                    {meal.title}
                  </Text>

                  <Text
                    style={[
                      styles.listDetail,
                      { color: colors.mutedForeground },
                      checked && styles.completedText,
                      state.language === 'ar' &&
                        styles.rtlText,
                    ]}
                  >
                    {meal.detail}
                  </Text>
                </View>

                <CheckButton
                  checked={checked}
                  onPress={async () => {
                    await Haptics.selectionAsync();

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

        <View style={styles.sectionHeaderOutside}>
          <Text
            style={[
              styles.largeSectionTitle,
              { color: colors.text },
              state.language === 'ar' && styles.rtlText,
            ]}
          >
            {t.movement}
          </Text>

          <Text
            style={[
              styles.sectionCount,
              { color: colors.mutedForeground },
            ]}
          >
            {completedExercises}/{plan.exercises.length}
          </Text>
        </View>

        <View
          style={[
            styles.listCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {plan.exercises.map((exercise, index) => {
            const checked = !!log.exercises[index];

            return (
              <View
                key={exercise.id}
                style={[
                  styles.listItem,
                  index < plan.exercises.length - 1 &&
                    styles.listItemBorder,
                  {
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.exerciseIcon,
                    {
                      backgroundColor: colors.lavender,
                    },
                  ]}
                >
                  <Feather
                    name="activity"
                    size={20}
                    color={colors.lavenderStrong}
                  />
                </View>

                <View style={styles.listContent}>
                  <Text
                    style={[
                      styles.listTitle,
                      { color: colors.text },
                      checked && styles.completedText,
                      state.language === 'ar' &&
                        styles.rtlText,
                    ]}
                  >
                    {exercise.title}
                  </Text>

                  <Text
                    style={[
                      styles.listDetail,
                      { color: colors.mutedForeground },
                      checked && styles.completedText,
                      state.language === 'ar' &&
                        styles.rtlText,
                    ]}
                  >
                    {exercise.duration} · {exercise.difficulty}
                  </Text>
                </View>

                <CheckButton
                  checked={checked}
                  onPress={async () => {
                    await Haptics.selectionAsync();

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

        <View style={styles.sectionHeaderOutside}>
          <Text
            style={[
              styles.largeSectionTitle,
              { color: colors.text },
              state.language === 'ar' && styles.rtlText,
            ]}
          >
            {t.schedule}
          </Text>

          <Text
            style={[
              styles.sectionCount,
              { color: colors.mutedForeground },
            ]}
          >
            {completedSchedule}/
            {state.mode === 'work'
              ? plan.workSchedule.length
              : plan.vacationSchedule.length}
          </Text>
        </View>

        <View
          style={[
            styles.listCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {(state.mode === 'work'
            ? plan.workSchedule
            : plan.vacationSchedule
          ).map((item, index, items) => {
            const checked = !!log.schedule[index];

            return (
              <View
                key={item.id}
                style={[
                  styles.listItem,
                  index < items.length - 1 &&
                    styles.listItemBorder,
                  {
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.timeBadge,
                    { backgroundColor: colors.lavender },
                  ]}
                >
                  <Text
                    style={[
                      styles.timeText,
                      { color: colors.lavenderStrong },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>

                <View style={styles.listContent}>
                  <Text
                    style={[
                      styles.listTitle,
                      { color: colors.text },
                      checked && styles.completedText,
                      state.language === 'ar' &&
                        styles.rtlText,
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>

                <CheckButton
                  checked={checked}
                  onPress={async () => {
                    await Haptics.selectionAsync();

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

        <View
          style={[
            styles.adviceCard,
            {
              backgroundColor: colors.lavender,
              borderColor: colors.lavenderStrong,
            },
          ]}
        >
          <View
            style={[
              styles.adviceIcon,
              { backgroundColor: colors.lavenderStrong },
            ]}
          >
            <Feather
              name="heart"
              size={20}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.adviceContent}>
            <Text
              style={[
                styles.adviceTitle,
                { color: colors.text },
                state.language === 'ar' && styles.rtlText,
              ]}
            >
              {t.advice}
            </Text>

            <Text
              style={[
                styles.adviceText,
                { color: colors.secondaryForeground },
                state.language === 'ar' && styles.rtlText,
              ]}
            >
              {advice}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 3,
  },

  name: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },

  date: {
    fontSize: 13,
    fontWeight: '500',
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  romanticContainer: {
    marginBottom: 18,
  },

  romanticCard: {
    borderWidth: 1.5,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    minHeight: 180,
    overflow: 'hidden',
  },

  romanticReveal: {
    flex: 1,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  heartCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  romanticTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#17343B',
    textAlign: 'center',
    marginBottom: 8,
  },

  romanticHint: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6D7E7B',
    textAlign: 'center',
  },

  romanticMessage: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 22,
  },

  romanticText: {
    fontSize: 17,
    lineHeight: 27,
    color: '#17343B',
    textAlign: 'center',
    fontWeight: '600',
  },

  romanticSmall: {
    fontSize: 12,
    color: '#8E77B7',
    marginTop: 14,
    fontWeight: '600',
  },

  modeCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    marginBottom: 16,
  },

  modeButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  modeButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },

  modeButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },

  progressCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 5,
  },

  progressSubtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    fontWeight: '500',
  },

  progressCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    marginTop: 18,
  },

  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },

  progressRemaining: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 9,
  },

  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    padding: 15,
  },

  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },

  metricValue: {
    fontSize: 22,
    fontWeight: '800',
  },

  metricTarget: {
    fontSize: 11,
    marginTop: 4,
  },

  sectionCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  waterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  waterItem: {
    width: '22.5%',
    minHeight: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  waterNumber: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },

  sectionHeaderOutside: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },

  largeSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },

  sectionCount: {
    fontSize: 12,
    fontWeight: '700',
  },

  listCard: {
    borderWidth: 1,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 20,
  },

  listItem: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 11,
  },

  listItemBorder: {
    borderBottomWidth: 1,
  },

  timeBadge: {
    minWidth: 58,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
  },

  timeText: {
    fontSize: 11,
    fontWeight: '800',
  },

  exerciseIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContent: {
    flex: 1,
  },

  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },

  listDetail: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 2,
  },

  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.55,
  },

  checkButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#EEF3F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkButtonDone: {
    backgroundColor: '#2C9A77',
  },

  adviceCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 15,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },

  adviceIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  adviceContent: {
    flex: 1,
  },

  adviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
  },

  adviceText: {
    fontSize: 13,
    lineHeight: 21,
  },

  rtlText: {
    textAlign: 'right',
  },
});
