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
import { useColors } from '@/hooks/useColors';
import { getDateKey, useDailyBalance } from '@/context/DailyBalanceContext';
import { useCopy, getDayNames } from '@/lib/i18n';
import { getWeeklyPlan } from '@/lib/weeklyPlan';

const romanticMessages = {
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
    'Il y a une personne qui fait sourire sans raison… tu sais qui c’est. ❤️',
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
  language: 'ar' | 'fr' | 'en';
  colors: any;
}) {
  const today = new Date().getDate();
  const messageIndex = today % romanticMessages[language].length;
  const message = romanticMessages[language][messageIndex];

  // The interaction changes from day to day.
  const animationType = today % 3;

  const scale = useRef(new Animated.Value(0.35)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const [opened, setOpened] = useState(false);

  const openMessage = () => {
    if (opened) return;

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    ).catch(() => undefined);

    setOpened(true);

    if (animationType === 0) {
      // Bubble grows and opens.
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
    } else if (animationType === 1) {
      // Message slides down like a little surprise.
      scale.setValue(0.7);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 7,
          tension: 55,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Playful rotation / reveal.
      rotate.setValue(-1);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: -1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.spring(rotate, {
            toValue: 0,
            friction: 4,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  };

  const rotateInterpolation = rotate.interpolate({
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
      accessibilityLabel={`Narimane romantic message`}
      style={({ pressed }) => [
        styles.romanticCard,
        {
          backgroundColor: colors.coral,
          transform: [{ scale: pressed ? 0.985 : 1 }],
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

      <View style={styles.romanticTextWrap}>
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
              transform: [
                { scale },
                { rotate: rotateInterpolation },
              ],
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
    advice,
  } = useDailyBalance();

  const t = useCopy(state.language);

  const [showAllMeals, setShowAllMeals] = useState(false);

  const todayPlan = getWeeklyPlan(state.language, todayDay);
  const todayLog = getLog(todayDay, state.mode);

  const schedule =
    state.mode === 'work'
      ? todayPlan.workSchedule
      : todayPlan.vacationSchedule;

  const completedMeals = todayPlan.meals.filter(
    (meal) => todayLog.meals[meal.id]
  ).length;

  const completedExercises = todayPlan.exercises.filter(
    (exercise) => todayLog.exercises[exercise.id]
  ).length;

  const completedSchedule = schedule.filter(
    (item) => todayLog.schedule[item.id]
  ).length;

  const completedTasks =
    completedMeals +
    completedExercises +
    completedSchedule;

  const totalTasks =
    todayPlan.meals.length +
    todayPlan.exercises.length +
    schedule.length;

  const progress = Math.round(
    state.currentWeight <= state.targetWeight
      ? 100
      : Math.max(
          5,
          ((73.5 - state.currentWeight) /
            (73.5 - state.targetWeight)) *
            100
        )
  );

  const dayName =
    getDayNames(state.language)[todayDay];

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(
        state.language === 'ar'
          ? 'ar'
          : state.language,
        {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }
      ).format(new Date()),
    [state.language]
  );

  const mealLabels: Record<string, string> = {
    breakfast: t.breakfast,
    morningSnack: t.morningSnack,
    lunch: t.lunch,
    afternoonSnack: t.afternoonSnack,
    dinner: t.dinner,
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          direction:
            state.language === 'ar' ? 'rtl' : 'ltr',
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 98,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.eyebrow,
                { color: colors.mutedForeground },
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
              {t.greeting}, {state.profileName}
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

          <View style={styles.headerActions}>
            <Pressable
              accessibilityLabel={t.reminders}
              testID="home-reminders"
              onPress={() => undefined}
              style={({ pressed }) => [
                styles.iconButton,
                { backgroundColor: colors.card },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Feather
                name="bell"
                size={19}
                color={colors.navy}
              />
            </Pressable>

            <Pressable
              accessibilityLabel={t.profile}
              testID="home-profile"
              onPress={() => undefined}
              style={({ pressed }) => [
                styles.iconButton,
                { backgroundColor: colors.card },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Feather
                name="user"
                size={19}
                color={colors.navy}
              />
            </Pressable>
          </View>
        </View>

        {/* Romantic Narimane surprise */}
        <RomanticWelcome
          language={state.language}
          colors={colors}
        />

        <View
          style={[
            styles.modeSwitch,
            { backgroundColor: colors.mint },
          ]}
        >
          <View style={styles.modeCopy}>
            <Text
              style={[
                styles.modeLabel,
                { color: colors.navy },
              ]}
            >
              {state.mode === 'work'
                ? t.work
                : t.vacation}
            </Text>

            <Text
              style={[
                styles.modeSubcopy,
                { color: colors.secondaryForeground },
              ]}
            >
              {state.mode === 'work'
                ? t.workSubtitle
                : t.vacationSubtitle}
            </Text>
          </View>

          <View style={styles.modePill}>
            <Feather
              name={
                state.mode === 'work'
                  ? 'briefcase'
                  : 'sun'
              }
              size={15}
              color={colors.navy}
            />

            <Text
              style={[
                styles.modePillText,
                { color: colors.navy },
              ]}
            >
              {state.mode === 'work' ? 'W' : 'V'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
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
              { color: colors.mutedForeground },
            ]}
          >
            {completedTasks}/{totalTasks} {t.tasks}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <View
            style={[
              styles.metricCard,
              { backgroundColor: colors.card },
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
                size={18}
                color={colors.lavenderStrong}
              />
            </View>

            <Text
              style={[
                styles.metricLabel,
                { color: colors.mutedForeground },
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
              {state.currentWeight.toFixed(1)}{' '}
              <Text style={styles.metricUnit}>
                {t.kg}
              </Text>
            </Text>

            <View style={styles.metricFooter}>
              <Text
                style={[
                  styles.metricFooterText,
                  { color: colors.success },
                ]}
              >
                {progress}%
              </Text>

              <Text
                style={[
                  styles.metricFooterText,
                  { color: colors.mutedForeground },
                ]}
              >
                {t.progress}
              </Text>
            </View>

            <View
              style={[
                styles.progressTrack,
                { backgroundColor: colors.muted },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor:
                      colors.lavenderStrong,
                    width: `${Math.min(
                      100,
                      progress
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View
            style={[
              styles.metricCard,
              { backgroundColor: colors.card },
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
                size={18}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.metricLabel,
                { color: colors.mutedForeground },
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
              <Text style={styles.metricUnit}>
                /8
              </Text>
            </Text>

            <Text
              style={[
                styles.metricFooterText,
                { color: colors.mutedForeground },
              ]}
            >
              {t.glasses} · {t.goal}
            </Text>

            <View
              style={[
                styles.progressTrack,
                { backgroundColor: colors.muted },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${
                      (todayLog.waterGlasses / 8) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View
          style={[
            styles.waterCard,
            { backgroundColor: colors.navy },
          ]}
        >
          <View style={styles.waterHeader}>
            <View>
              <Text
                style={[
                  styles.darkCardEyebrow,
                  { color: colors.mintStrong },
                ]}
              >
                {t.water}
              </Text>

              <Text
                style={[
                  styles.darkCardTitle,
                  { color: colors.card },
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

          <View style={styles.glassRow}>
            {Array.from(
              { length: 8 },
              (_, index) => {
                const filled =
                  index < todayLog.waterGlasses;

                return (
                  <Pressable
                    key={index}
                    accessibilityLabel={`${t.water} ${
                      index + 1
                    }`}
                    testID={`water-glass-${
                      index + 1
                    }`}
                    onPress={() => {
                      Haptics.selectionAsync();
                      toggleWater(
                        index,
                        todayDay,
                        state.mode
                      );
                    }}
                    style={({ pressed }) => [
                      styles.glass,
                      {
                        backgroundColor: filled
                          ? colors.mintStrong
                          : 'rgba(255,255,255,0.14)',
                        borderColor: filled
                          ? colors.mintStrong
                          : 'rgba(255,255,255,0.26)',
                      },
                      pressed && {
                        transform: [
                          { scale: 0.9 },
                        ],
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
            {todayLog.waterGlasses}/8 {t.glasses}
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.navy },
                    ]}
            >
              {dayName} · {t.today}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              accessibilityLabel={t.reminders}
              testID="home-reminders"
              onPress={() => undefined}
              style={({ pressed }) => [
                styles.iconButton,
                { backgroundColor: colors.card },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Feather
                name="bell"
                size={19}
                color={colors.navy}
              />
            </Pressable>

            <Pressable
              accessibilityLabel={t.profile}
              testID="home-profile"
              onPress={() => undefined}
              style={({ pressed }) => [
                styles.iconButton,
                { backgroundColor: colors.card },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Feather
                name="user"
                size={19}
                color={colors.navy}
              />
            </Pressable>
          </View>
        </View>

        {/* Romantic Narimane surprise */}
        <RomanticWelcome
          language={state.language}
          colors={colors}
        />

        <View
          style={[
            styles.modeSwitch,
            { backgroundColor: colors.mint },
          ]}
        >
          <View style={styles.modeCopy}>
            <Text
              style={[
                styles.modeLabel,
                { color: colors.navy },
              ]}
            >
              {state.mode === 'work'
                ? t.work
                : t.vacation}
            </Text>

            <Text
              style={[
                styles.modeSubcopy,
                { color: colors.secondaryForeground },
              ]}
            >
              {state.mode === 'work'
                ? t.workSubtitle
                : t.vacationSubtitle}
            </Text>
          </View>

          <View style={styles.modePill}>
            <Feather
              name={
                state.mode === 'work'
                  ? 'briefcase'
                  : 'sun'
              }
              size={15}
              color={colors.navy}
            />

            <Text
              style={[
                styles.modePillText,
                { color: colors.navy },
              ]}
            >
              {state.mode === 'work' ? 'W' : 'V'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
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
              { color: colors.mutedForeground },
            ]}
          >
            {completedTasks}/{totalTasks} {t.tasks}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <View
            style={[
              styles.metricCard,
              { backgroundColor: colors.card },
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
                size={18}
                color={colors.lavenderStrong}
              />
            </View>

            <Text
              style={[
                styles.metricLabel,
                { color: colors.mutedForeground },
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
              {state.currentWeight.toFixed(1)}{' '}
              <Text style={styles.metricUnit}>
                {t.kg}
              </Text>
            </Text>

            <View style={styles.metricFooter}>
              <Text
                style={[
                  styles.metricFooterText,
                  { color: colors.success },
                ]}
              >
                {progress}%
              </Text>

              <Text
                style={[
                  styles.metricFooterText,
                  { color: colors.mutedForeground },
                ]}
              >
                {t.progress}
              </Text>
            </View>

            <View
              style={[
                styles.progressTrack,
                { backgroundColor: colors.muted },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor:
                      colors.lavenderStrong,
                    width: `${Math.min(
                      100,
                      progress
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View
            style={[
              styles.metricCard,
              { backgroundColor: colors.card },
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
                size={18}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.metricLabel,
                { color: colors.mutedForeground },
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
              <Text style={styles.metricUnit}>
                /8
              </Text>
            </Text>

            <Text
              style={[
                styles.metricFooterText,
                { color: colors.mutedForeground },
              ]}
            >
              {t.glasses} · {t.goal}
            </Text>

            <View
              style={[
                styles.progressTrack,
                { backgroundColor: colors.muted },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${
                      (todayLog.waterGlasses / 8) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View
          style={[
            styles.waterCard,
            { backgroundColor: colors.navy },
          ]}
        >
          <View style={styles.waterHeader}>
            <View>
              <Text
                style={[
                  styles.darkCardEyebrow,
                  { color: colors.mintStrong },
                ]}
              >
                {t.water}
              </Text>

              <Text
                style={[
                  styles.darkCardTitle,
                  { color: colors.card },
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

          <View style={styles.glassRow}>
            {Array.from(
              { length: 8 },
              (_, index) => {
                const filled =
                  index < todayLog.waterGlasses;

                return (
                  <Pressable
                    key={index}
                    accessibilityLabel={`${t.water} ${
                      index + 1
                    }`}
                    testID={`water-glass-${
                      index + 1
                    }`}
                    onPress={() => {
                      Haptics.selectionAsync();
                      toggleWater(
                        index,
                        todayDay,
                        state.mode
                      );
                    }}
                    style={({ pressed }) => [
                      styles.glass,
                      {
                        backgroundColor: filled
                          ? colors.mintStrong
                          : 'rgba(255,255,255,0.14)',
                        borderColor: filled
                          ? colors.mintStrong
                          : 'rgba(255,255,255,0.26)',
                      },
                      pressed && {
                        transform: [
                          { scale: 0.9 },
                        ],
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
            {todayLog.waterGlasses}/8 {t.glasses}
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.navy },
           />}</View></Pressable>)}

        <View style={styles.sectionHeading}><Text style={[styles.sectionTitle, { color: colors.navy }]}>{t.todaySchedule}</Text><Text style={[styles.sectionMeta, { color: colors.mutedForeground }]}>{completedSchedule}/{schedule.length} {t.completed}</Text></View>
        <View style={[styles.scheduleCard, { backgroundColor: colors.card }]}>{schedule.map((item, index) => <Pressable key={item.id} testID={`home-schedule-${item.id}`} onPress={() => { Haptics.selectionAsync(); toggleSchedule(item.id, todayDay, state.mode); }} style={({ pressed }) => [styles.scheduleRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }, pressed && { opacity: 0.7 }]}><View style={[styles.scheduleDot, { backgroundColor: todayLog.schedule[item.id] ? colors.primary : item.kind === 'meal' ? colors.coral : item.kind === 'movement' ? colors.lavenderStrong : colors.amber }]} /><Text style={[styles.scheduleTime, { color: colors.navy }]}>{item.time}</Text><Text style={[styles.scheduleTitle, { color: colors.navy }, todayLog.schedule[item.id] && styles.completedText]}>{item.title}</Text><View style={[styles.check, { backgroundColor: todayLog.schedule[item.id] ? colors.primary : colors.background, borderColor: todayLog.schedule[item.id] ? colors.primary : colors.border }]}>{todayLog.schedule[item.id] && <Feather name="check" size={13} color={colors.card} />}</View></Pressable>)}</View>

        <View style={[styles.adviceCard, { backgroundColor: colors.lavender }]}><View style={[styles.adviceIcon, { backgroundColor: colors.card }]}><Feather name="compass" size={18} color={colors.lavenderStrong} /></View><View style={styles.adviceCopy}><Text style={[styles.adviceEyebrow, { color: colors.lavenderStrong }]}>{t.advice}</Text><Text style={[styles.adviceText, { color: colors.navy }]}>{advice}</Text></View></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { paddingHorizontal: 20, paddingTop: 18 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 19 }, eyebrow: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 5 }, greeting: { fontSize: 27, fontWeight: '700', letterSpacing: -0.7 }, dayLabel: { fontSize: 12, fontWeight: '700', marginTop: 6 }, headerActions: { flexDirection: 'row', gap: 9 }, iconButton: { width: 41, height: 41, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#17343B', shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 }, modeSwitch: { minHeight: 76, borderRadius: 22, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 }, modeCopy: { flex: 1 }, modeLabel: { fontSize: 15, fontWeight: '700', marginBottom: 4 }, modeSubcopy: { fontSize: 12, lineHeight: 17 }, modePill: { width: 45, height: 45, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.64)', alignItems: 'center', justifyContent: 'center', gap: 2 }, modePillText: { fontSize: 10, fontWeight: '800' }, sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 11, marginTop: 2 }, sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 }, sectionMeta: { fontSize: 11 }, metricRow: { flexDirection: 'row', gap: 12, marginBottom: 14 }, metricCard: { flex: 1, borderRadius: 21, padding: 15, minHeight: 148, shadowColor: '#17343B', shadowOpacity: 0.04, shadowRadius: 10, elevation: 1 }, metricIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }, metricLabel: { fontSize: 12, fontWeight: '500', marginBottom: 4 }, metricValue: { fontSize: 27, fontWeight: '700', letterSpacing: -0.7, marginBottom: 8 }, metricUnit: { fontSize: 13, fontWeight: '600' }, metricFooter: { flexDirection: 'row', gap: 4, alignItems: 'center', marginBottom: 8 }, metricFooterText: { fontSize: 10, fontWeight: '600' }, progressTrack: { height: 6, borderRadius: 4, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 4 }, waterCard: { borderRadius: 23, padding: 18, marginBottom: 24 }, waterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }, darkCardEyebrow: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.1, fontWeight: '700', marginBottom: 5 }, darkCardTitle: { fontSize: 17, lineHeight: 23, fontWeight: '700', maxWidth: 245 }, glassRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13 }, glass: { width: 28, height: 37, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }, waterHint: { fontSize: 11, fontWeight: '600' }, link: { fontSize: 12, fontWeight: '700' }, mealList: { borderRadius: 21, paddingHorizontal: 15, marginBottom: 19 }, mealRow: { minHeight: 74, flexDirection: 'row', alignItems: 'center', gap: 11 }, check: { width: 25, height: 25, borderRadius: 9, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' }, mealCopy: { flex: 1 }, mealLabel: { fontSize: 13, fontWeight: '700', marginBottom: 3 }, completedText: { textDecorationLine: 'line-through', opacity: 0.55 }, mealDetail: { fontSize: 10, lineHeight: 15 }, mealTime: { fontSize: 11, fontWeight: '600' }, mealCount: { fontSize: 10, paddingBottom: 13, paddingTop: 2, textAlign: 'right' }, exerciseCard: { minHeight: 74, borderRadius: 19, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }, exerciseIcon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, exerciseCopy: { flex: 1 }, exerciseTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 }, exerciseMeta: { fontSize: 11 }, exerciseAction: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, scheduleCard: { borderRadius: 21, paddingHorizontal: 15, marginBottom: 19 }, scheduleRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 9 }, scheduleDot: { width: 8, height: 8, borderRadius: 4 }, scheduleTime: { width: 43, fontSize: 11, fontWeight: '700' }, scheduleTitle: { flex: 1, fontSize: 12, fontWeight: '600' }, adviceCard: { borderRadius: 21, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }, adviceIcon: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, adviceCopy: { flex: 1 }, adviceEyebrow: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }, adviceText: { fontSize: 13, lineHeight: 19, fontWeight: '500' },
});
