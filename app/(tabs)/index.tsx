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
  const message = romanticMessages[language][
    day % romanticMessages[language].length
  ];

  const [opened, setOpened] = useState(false);

  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const openMessage = () => {
    if (opened) return;

    setOpened(true);

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    ).catch(() => undefined);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.35,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(heartScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

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
      style={({ pressed }) => [
        styles.romanticCard,
        {
          backgroundColor: colors.coral,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.romanticHeartCircle,
          { transform: [{ scale: heartScale }] },
        ]}
      >
        <Text style={styles.romanticHeart}>♥</Text>
      </Animated.View>

      <View style={styles.romanticContent}>
        <Text style={styles.romanticName}>Narimane</Text>

        {!opened ? (
          <>
            <Text style={styles.romanticHint}>
              {surpriseText}
            </Text>

            <Text style={styles.romanticTap}>
              {tapText}
            </Text>
          </>
        ) : (
          <Animated.View
            style={{
              opacity,
              transform: [{ scale }],
            }}
          >
            <Text
              style={[
                styles.romanticMessage,
                {
                  textAlign:
                    language === 'ar' ? 'right' : 'left',
                },
              ]}
            >
              {message}
            </Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.romanticGift}>
        <Feather
          name={opened ? 'heart' : 'gift'}
          size={22}
          color="#FFFFFF"
        />
      </View>
    </Pressable>
  );
}

function CheckButton({
  checked,
  onPress,
  colors,
}: {
  checked: boolean;
  onPress: () => void;
  colors: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[
        styles.checkButton,
        {
          backgroundColor: checked
            ? colors.primary
            : colors.background,
          borderColor: checked
            ? colors.primary
            : colors.border,
        },
      ]}
    >
      {checked && (
        <Feather
          name="check"
          size={14}
          color="#FFFFFF"
        />
      )}
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const {
    state,
    todayDay,
    getLog,
    toggleWater,
    toggleMeal,
    toggleExercise,
    toggleSchedule,
    setMode,
    advice,
  } = useDailyBalance();

  const t = useCopy(state.language);

  const todayPlan = getWeeklyPlan(
    state.language,
    todayDay
  );

  const todayLog = getLog(
    todayDay,
    state.mode
  );

  const schedule =
    state.mode === 'work'
      ? todayPlan.workSchedule
      : todayPlan.vacationSchedule;

  const completedMeals =
    todayPlan.meals.filter(
      (meal) => todayLog.meals[meal.id]
    ).length;

  const completedExercises =
    todayPlan.exercises.filter(
      (exercise) =>
        todayLog.exercises[exercise.id]
    ).length;

  const completedSchedule =
    schedule.filter(
      (item) =>
        todayLog.schedule[item.id]
    ).length;

  const completedTasks =
    completedMeals +
    completedExercises +
    completedSchedule;

  const totalTasks =
    todayPlan.meals.length +
    todayPlan.exercises.length +
    schedule.length;

  const progress = useMemo(() => {
    const current = Number(state.currentWeight);
    const target = Number(state.targetWeight);

    if (
      !Number.isFinite(current) ||
      !Number.isFinite(target)
    ) {
      return 0;
    }

    if (current <= target) {
      return 100;
    }

    const startWeight = 73.5;

    if (startWeight <= target) {
      return 0;
    }

    const value =
      ((startWeight - current) /
        (startWeight - target)) *
      100;

    return Math.round(
      Math.min(100, Math.max(0, value))
    );
  }, [
    state.currentWeight,
    state.targetWeight,
  ]);

  const waterProgress = Math.min(
    100,
    (todayLog.waterGlasses / 8) * 100
  );

  const displayName =
    state.profileName &&
    state.profileName !== 'Alex'
      ? state.profileName
      : 'Narimane';

  const dayName =
    getDayNames(state.language)[todayDay];

  const dateLabel = useMemo(() => {
    return new Intl.DateTimeFormat(
      state.language === 'ar'
        ? 'ar'
        : state.language,
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    ).format(new Date());
  }, [state.language]);

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 18,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 110,
        }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.date,
                {
                  color:
                    colors.mutedForeground,
                },
              ]}
            >
              {dateLabel}
            </Text>

            <Text
              style={[
                styles.greeting,
                { color: colors.navy },
              ]}
            >
              {t.greeting}, {displayName}
            </Text>

            <Text
              style={[
                styles.dayLabel,
                { color: colors.primary },
              ]}
            >
              {dayName} · {t.today}
            </Text>
          </View>

          <View
            style={[
              styles.headerHeart,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Feather
              name="heart"
              size={20}
              color={colors.coral}
            />
          </View>
        </View>

        {/* ROMANTIC NARIMANE MESSAGE */}
        <RomanticWelcome
          language={state.language}
          colors={colors}
        />

        {/* WORK / VACATION */}
        <View
          style={[
            styles.modeCard,
            {
              backgroundColor:
                colors.mint,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.modeTitle,
                { color: colors.navy },
              ]}
            >
              {state.mode === 'work'
                ? t.work
                : t.vacation}
            </Text>

            <Text
              style={[
                styles.modeSubtitle,
                {
                  color:
                    colors.secondaryForeground,
                },
              ]}
            >
              {state.mode === 'work'
                ? t.workSubtitle
                : t.vacationSubtitle}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setMode(
                state.mode === 'work'
                  ? 'vacation'
                  : 'work'
              );
            }}
            style={[
              styles.modeButton,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Feather
              name={
                state.mode === 'work'
                  ? 'briefcase'
                  : 'sun'
              }
              size={17}
              color={colors.navy}
            />

            <Text
              style={[
                styles.modeButtonText,
                { color: colors.navy },
              ]}
            >
              {state.mode === 'work'
                ? 'W'
                : 'V'}
            </Text>
          </Pressable>
        </View>

        {/* TODAY */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.navy },
            ]}
          >
            {t.today}
          </Text>

          <Text
            style={[
              styles.sectionMeta,
              {
                color:
                  colors.mutedForeground,
              },
            ]}
          >
            {completedTasks}/{totalTasks}{' '}
            {t.tasks}
          </Text>
        </View>

        {/* METRICS */}
        <View style={styles.metricsRow}>
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <View
              style={[
                styles.metricIcon,
                {
                  backgroundColor:
                    colors.lavender,
                },
              ]}
            >
              <Feather
                name="activity"
                size={18}
                color={
                  colors.lavenderStrong
                }
              />
            </View>

            <Text
              style={[
                styles.metricLabel,
                {
                  color:
                    colors.mutedForeground,
                },
              ]}
            >
              {t.weight}
            </Text>

            <Text
              style={[
                styles.metricValue,
                { color: colors.navy },
              ]}
            >
              {Number(
                state.currentWeight
              ).toFixed(1)}{' '}
              <Text style={styles.unit}>
                {t.kg}
              </Text>
            </Text>

            <Text
              style={[
                styles.metricSmall,
                { color: colors.success },
              ]}
            >
              {progress}% {t.progress}
            </Text>

            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor:
                    colors.muted,
                },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor:
                      colors.lavenderStrong,
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View
            style={[
              styles.metricCard,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <View
              style={[
                styles.metricIcon,
                {
                  backgroundColor:
                    colors.mint,
                },
              ]}
            >
              <Feather
                name="droplet"
                size={18}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.metricLabel,
                {
                  color:
                    colors.mutedForeground,
                },
              ]}
            >
              {t.water}
            </Text>

            <Text
              style={[
                styles.metricValue,
                { color: colors.navy },
              ]}
            >
              {todayLog.waterGlasses}
              <Text style={styles.unit}>
                /8
              </Text>
            </Text>

            <Text
              style={[
                styles.metricSmall,
                {
                  color:
                    colors.mutedForeground,
                },
              ]}
            >
              {t.glasses}
            </Text>

            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor:
                    colors.muted,
                },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor:
                      colors.primary,
                    width: `${waterProgress}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* WATER */}
        <View
          style={[
            styles.waterCard,
            {
              backgroundColor:
                colors.navy,
            },
          ]}
        >
          <View
            style={styles.waterHeader}
          >
            <View>
              <Text
                style={[
                  styles.waterEyebrow,
                  {
                    color:
                      colors.mintStrong,
                  },
                ]}
              >
                {t.water}
              </Text>

              <Text
                style={[
                  styles.waterTitle,
                  {
                    color:
                      colors.card,
                  },
                ]}
              >
                {todayLog.waterGlasses < 8
                  ? `${8 - todayLog.waterGlasses} ${t.glasses} ${t.remaining}`
                  : t.allDone}
              </Text>
            </View>

            <Feather
              name="droplet"
              size={25}
              color={colors.mintStrong}
            />
          </View>

          <View
            style={styles.glassRow}
          >
            {Array.from(
              { length: 8 },
              (_, index) => {
                const filled =
                  index <
                  todayLog.waterGlasses;

                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      Haptics.selectionAsync();
                      toggleWater(
                        index,
                        todayDay,
                        state.mode
                      );
                    }}
                    style={[
                      styles.glass,
                      {
                        backgroundColor:
                          filled
                            ? colors.mintStrong
                            : 'rgba(255,255,255,0.12)',
                        borderColor:
                          filled
                            ? colors.mintStrong
                            : 'rgba(255,255,255,0.25)',
                      },
                    ]}
                  >
                    <Feather
                      name="droplet"
                      size={14}
                      color={
                        filled
                          ? colors.navy
                          : colors.card
                      }
                    />
                  </Pressable>
                );
              }
            )}
          </View>

          <Text
            style={[
              styles.waterHint,
              { color: colors.mint },
            ]}
          >
            {todayLog.waterGlasses}/8{' '}
            {t.glasses}
          </Text>
        </View>

        {/* MEALS */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.navy },
            ]}
          >
            {t.meals}
          </Text>

          <Text
            style={[
              styles.sectionMeta,
              {
                color:
                  colors.mutedForeground,
              },
            ]}
          >
            {completedMeals}/
            {todayPlan.meals.length}
          </Text>
        </View>

        <View
          style={[
            styles.listCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          {todayPlan.meals.map(
            (meal, index) => {
              const checked =
                !!todayLog.meals[meal.id];

              return (
                <Pressable
                  key={meal.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleMeal(
 
