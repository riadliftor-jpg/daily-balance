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

type Language = 'en' | 'fr' | 'ar';

const romanticMessages: Record<Language, string[]> = {
  en: [
    'Narimane ❤️ you make my days brighter just by being there.',
    'Today’s little riddle: you cannot see it, but your heart can feel it. What is it? ❤️',
    'Narimane, if love had an address, I would choose yours. 🌹',
    'Secret message: you are my favorite surprise. 💌',
    'Come a little closer… I have a tiny secret for your heart. 😉❤️',
    'Some people make you smile for no reason. You are one of them. ❤️',
    'If I could send a hug through the screen, it would already be with you. 🤍',
  ],
  fr: [
    'Narimane ❤️ ta présence rend mes journées plus belles.',
    'Petite énigme : on ne peut pas le voir, mais le cœur le ressent. Qu’est-ce que c’est ? ❤️',
    'Narimane, si l’amour avait une adresse, je choisirais la tienne. 🌹',
    'Message secret : tu es ma plus jolie surprise. 💌',
    'Approche-toi… j’ai un petit secret pour ton cœur. 😉❤️',
    'Certaines personnes font sourire sans raison. Tu en fais partie. ❤️',
    'Si je pouvais envoyer un câlin à travers l’écran, il serait déjà avec toi. 🤍',
  ],
  ar: [
    'Narimane ❤️ وجودك يجعل أيامي أجمل.',
    'لغز اليوم: شيء لا يُرى، لكن القلب يشعر به. ما هو؟ ❤️',
    'Narimane، لو كان للحب عنوان لاخترت عنوانك أنتِ. 🌹',
    'رسالة سرية: أنتِ أجمل مفاجأة في أيامي. 💌',
    'اقتربي قليلًا… لدي سر صغير لقلبك. 😉❤️',
    'هناك أشخاص يجعلوننا نبتسم بلا سبب. أنتِ واحدة منهم. ❤️',
    'لو كان بإمكاني إرسال حضن عبر الشاشة، لوصل إليك الآن. 🤍',
  ],
};

function RomanticWelcome({
  language,
}: {
  language: Language;
}) {
  const messages = romanticMessages[language];
  const day = new Date().getDate();
  const message = messages[day % messages.length];

  const [opened, setOpened] = useState(false);

  const scale = useRef(
    new Animated.Value(0.72)
  ).current;

  const opacity = useRef(
    new Animated.Value(0)
  ).current;

  const heartScale = useRef(
    new Animated.Value(1)
  ).current;

  const openMessage = () => {
    if (opened) {
      return;
    }

    setOpened(true);

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    ).catch(() => undefined);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.3,
          duration: 160,
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

  const surprise =
    language === 'ar'
      ? 'لديكِ مفاجأة صغيرة ❤️'
      : language === 'fr'
        ? 'Tu as une petite surprise ❤️'
        : 'You have a little surprise ❤️';

  const tap =
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
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.romanticHeart,
          {
            transform: [
              {
                scale: heartScale,
              },
            ],
          },
        ]}
      >
        <Text style={styles.heartText}>♥</Text>
      </Animated.View>

      <View style={styles.romanticBody}>
        <Text style={styles.romanticName}>
          Narimane
        </Text>

        {!opened ? (
          <>
            <Text style={styles.romanticHint}>
              {surprise}
            </Text>

            <Text style={styles.romanticTap}>
              {tap}
            </Text>
          </>
        ) : (
          <Animated.View
            style={{
              opacity,
              transform: [
                {
                  scale,
                },
              ],
            }}
          >
            <Text
              style={[
                styles.romanticMessage,
                {
                  textAlign:
                    language === 'ar'
                      ? 'right'
                      : 'left',
                },
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
      />
    </Pressable>
  );
}

function CheckButton({
  checked,
  colors,
  onPress,
}: {
  checked: boolean;
  colors: any;
  onPress: () => void;
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
      {checked ? (
        <Feather
          name="check"
          size={14}
          color="#FFFFFF"
        />
      ) : null}
    </Pressable>
  );
}

function ProgressBar({
  value,
  color,
  backgroundColor,
}: {
  value: number;
  color: string;
  backgroundColor: string;
}) {
  const safeValue = Math.max(
    0,
    Math.min(100, value)
  );

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor,
        },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: `${safeValue}%`,
          },
        ]}
      />
    </View>
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

  const plan = getWeeklyPlan(
    state.language,
    todayDay
  );

  const log = getLog(
    todayDay,
    state.mode
  );

  const schedule =
    state.mode === 'work'
      ? plan.workSchedule
      : plan.vacationSchedule;

  const mealsDone =
    plan.meals.filter(
      (meal) => Boolean(log.meals[meal.id])
    ).length;

  const exercisesDone =
    plan.exercises.filter(
      (exercise) =>
        Boolean(log.exercises[exercise.id])
    ).length;

  const scheduleDone =
    schedule.filter(
      (item) =>
        Boolean(log.schedule[item.id])
    ).length;

  const tasksDone =
    mealsDone +
    exercisesDone +
    scheduleDone;

  const tasksTotal =
    plan.meals.length +
    plan.exercises.length +
    schedule.length;

  const progress = useMemo(() => {
    const current = Number(
      state.currentWeight
    );

    const target = Number(
      state.targetWeight
    );

    if (
      !Number.isFinite(current) ||
      !Number.isFinite(target)
    ) {
      return 0;
    }

    if (current <= target) {
      return 100;
    }

    const first =
      state.weightHistory.length > 0
        ? Number(
            state.weightHistory[0].value
          )
        : current;

    if (
      !Number.isFinite(first) ||
      first <= target
    ) {
      return 0;
    }

    const result =
      ((first - current) /
        (first - target)) *
      100;

    return Math.round(
      Math.max(
        0,
        Math.min(100, result)
      )
    );
  }, [
    state.currentWeight,
    state.targetWeight,
    state.weightHistory,
  ]);

  const waterProgress = Math.min(
    100,
    (log.waterGlasses / 8) * 100
  );

  const displayName =
    state.profileName &&
    state.profileName !== 'Alex'
      ? state.profileName
      : 'Narimane';

  const dayNames = getDayNames(
    state.language
  );

  const dayName =
    dayNames[todayDay] ?? '';

  const dateLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(
        state.language,
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      ).format(new Date());
    } catch {
      return '';
    }
  }, [state.language]);

  const isArabic =
    state.language === 'ar';

  const directionStyle = isArabic
    ? styles.rtl
    : undefined;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop:
            insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom:
            insets.bottom + 110,
        }}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            directionStyle,
          ]}
        >
          <View
            style={[
              styles.headerText,
              isArabic &&
                styles.headerTextRtl,
            ]}
          >
            <Text
              style={[
                styles.date,
                {
                  color:
                    colors.mutedForeground,
                },
                directionStyle,
              ]}
            >
              {dateLabel}
            </Text>

            <Text
              style={[
                styles.greeting,
                {
                  color: colors.navy,
                },
                directionStyle,
              ]}
            >
              {t.greeting},{' '}
              {displayName}
            </Text>

            <Text
              style={[
                styles.day,
                {
                  color: colors.primary,
                },
                directionStyle,
              ]}
            >
              {dayName} · {t.today}
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
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

        {/* ROMANTIC SURPRISE */}
        <RomanticWelcome
          language={state.language}
        />

        {/* MODE */}
        <View
          style={[
            styles.modeCard,
            {
              backgroundColor:
                colors.mint,
            },
            directionStyle,
          ]}
        >
          <View
            style={[
              styles.modeText,
              isArabic &&
                styles.modeTextRtl,
            ]}
          >
            <Text
              style={[
                styles.modeTitle,
                {
                  color: colors.navy,
                },
                directionStyle,
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
                directionStyle,
              ]}
            >
              {state.mode === 'work'
                ? t.workSubtitle
                : t.vacationSubtitle}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(
                () => undefined
              );

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
              size={18}
              color={colors.navy}
            />
          </Pressable>
        </View>

        {/* TODAY HEADER */}
        <View
          style={[
            styles.sectionHeader,
            directionStyle,
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.navy,
              },
              directionStyle,
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
            {tasksDone}/{tasksTotal}{' '}
            {t.tasks}
          </Text>
        </View>

        {/* METRICS */}
        <View style={styles.metrics}>
          {/* WEIGHT */}
          <View
            style={[
              styles.metric,
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
                directionStyle,
              ]}
            >
              {t.weight}
            </Text>

            <Text
              style={[
                styles.metricValue,
                {
                  color: colors.navy,
                },
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
                {
                  color: colors.success,
                },
              ]}
            >
              {progress}% {t.progress}
            </Text>

            <ProgressBar
              value={progress}
              color={
                colors.lavenderStrong
              }
              backgroundColor={
                colors.muted
              }
            />
          </View>

          {/* WATER */}
          <View
            style={[
              styles.metric,
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
                directionStyle,
              ]}
            >
              {t.water}
            </Text>

            <Text
              style={[
                styles.metricValue,
                {
                  color: colors.navy,
                },
              ]}
            >
              {log.waterGlasses}
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

            <ProgressBar
              value={waterProgress}
              color={colors.primary}
              backgroundColor={
                colors.muted
              }
            />
          </View>
        </View>

        {/* WATER TRACKER */}
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
            style={[
              styles.waterTop,
              directionStyle,
            ]}
          >
            <View
              style={
                isArabic
                  ? styles.waterTextRtl
                  : undefined
              }
            >
              <Text
                style={[
                  styles.waterLabel,
                  {
                    color:
                      colors.mintStrong,
                  },
                  directionStyle,
                ]}
              >
                {t.water}
              </Text>

              <Text
                style={[
                  styles.waterTitle,
                  {
                    color: colors.card,
                  },
                  directionStyle,
                ]}
              >
                {log.waterGlasses >= 8
                  ? t.allDone
                  : `${8 - log.waterGlasses} ${t.glasses} ${t.remaining}`}
              </Text>
            </View>

            <Feather
              name="droplet"
              size={25}
              color={colors.mintStrong}
            />
          </View>

          <View style={styles.glasses}>
            {Array.from(
              { length: 8 },
              (_, index) => {
                const filled =
                  index <
                  log.waterGlasses;

                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      Haptics.selectionAsync().catch(
                        () => undefined
                      );

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
                            : 'rgba(255,255,255,0.10)',
                        borderColor:
                          filled
                            ? colors.mintStrong
                            : 'rgba(255,255,255,0.25)',
                      },
                    ]}
                  >
                    <Feather
                      name="droplet"
                      size={13}
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
        </View>

        {/* Meals */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {t.meals}
          </Text>

          <View style={styles.listCard}>
            {plan.meals.map((meal) => {
              const completed = !!log.meals?.[meal.id];

              return (
                <View
                  key={meal.id}
                  style={[
                    styles.listRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Feather
                      name="coffee"
                      size={18}
                      color={colors.primaryForeground}
                    />
                  </View>

                  <View style={styles.listContent}>
                    <Text
                      style={[
                        styles.listTitle,
                        { color: colors.foreground },
                      ]}
                    >
                      {meal.title}
                    </Text>

                    <Text
                      style={[
                        styles.listSubtitle,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {meal.time}
                    </Text>

                    {meal.detail ? (
                      <Text
                        style={[
                          styles.listDetail,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {meal.detail}
                      </Text>
                    ) : null}
                  </View>

                  <CheckButton
                    checked={completed}
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => undefined);
                      toggleMeal(
                        meal.id,
                        todayDay,
                        state.mode
                      );
                    }}
                    colors={colors}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* Movement */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {t.movement}
          </Text>

          <View style={styles.listCard}>
            {plan.exercises.map((exercise) => {
              const completed = !!log.exercises?.[exercise.id];

              return (
                <View
                  key={exercise.id}
                  style={[
                    styles.listRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: colors.secondary },
                    ]}
                  >
                    <Feather
                      name="activity"
                      size={18}
                      color={colors.secondaryForeground}
                    />
                  </View>

                  <View style={styles.listContent}>
                    <Text
                      style={[
                        styles.listTitle,
                        { color: colors.foreground },
                      ]}
                    >
                      {exercise.title}
                    </Text>

                    <Text
                      style={[
                        styles.listSubtitle,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {exercise.duration}
                      {exercise.difficulty
                        ? ` • ${exercise.difficulty}`
                        : ''}
                    </Text>

                    {exercise.instructions ? (
                      <Text
                        style={[
                          styles.listDetail,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {exercise.instructions}
                      </Text>
                    ) : null}
                  </View>

                  <CheckButton
                    checked={completed}
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => undefined);
                      toggleExercise(
                        exercise.id,
                        todayDay,
                        state.mode
                      );
                    }}
                    colors={colors}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {t.schedule}
          </Text>

          <View style={styles.listCard}>
            {plan.schedule.map((item) => {
              const completed = !!log.schedule?.[item.id];

              return (
                <View
                  key={item.id}
                  style={[
                    styles.listRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: colors.lavenderStrong },
                    ]}
                  >
                    <Feather
                      name={
                        item.kind === 'work'
                          ? 'briefcase'
                          : item.kind === 'meal'
                            ? 'coffee'
                            : 'clock'
                      }
                      size={18}
                      color={colors.navy}
                    />
                  </View>

                  <View style={styles.listContent}>
                    <Text
                      style={[
                        styles.listTitle,
                        { color: colors.foreground },
                      ]}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.listSubtitle,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {item.time}
                    </Text>

                    {item.detail ? (
                      <Text
                        style={[
                          styles.listDetail,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {item.detail}
                      </Text>
                    ) : null}
                  </View>

                  <CheckButton
                    checked={completed}
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => undefined);
                      toggleSchedule(
                        item.id,
                        todayDay,
                        state.mode
                      );
                    }}
                    colors={colors}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* Advice */}
        <View style={styles.section}>
          <View
            style={[
              styles.adviceCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.adviceHeader}>
              <View
                style={[
                  styles.adviceIcon,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Feather
                  name="heart"
                  size={18}
                  color={colors.primaryForeground}
                />
              </View>

              <Text
                style={[
                  styles.adviceTitle,
                  { color: colors.foreground },
                ]}
              >
                {t.advice}
              </Text>
            </View>

            <Text
              style={[
                styles.adviceText,
                { color: colors.mutedForeground },
              ]}
            >
              {plan.advice}
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
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  greeting: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },

  name: {
    fontSize: 25,
    fontWeight: '800',
  },

  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  romanticCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    overflow: 'hidden',
  },

  romanticTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  romanticIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  romanticLabel: {
    fontSize: 13,
    fontWeight: '700',
  },

  romanticMessage: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '700',
  },

  romanticHint: {
    fontSize: 12,
    marginTop: 9,
  },

  modeCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },

  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  modeIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  modeTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  modeSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  modeButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  modeButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  modeButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },

  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },

  metricCard: {
    flex: 1,
    minHeight: 108,
    borderRadius: 20,
    padding: 15,
  },

  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  metricLabel: {
    fontSize: 12,
    marginBottom: 3,
  },

  metricValue: {
    fontSize: 21,
    fontWeight: '800',
  },

  metricSmall: {
    fontSize: 11,
    marginTop: 3,
  },

  waterCard: {
    borderRadius: 22,
    padding: 16,
  },

  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  waterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  waterIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  waterTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  waterCount: {
    fontSize: 13,
    fontWeight: '700',
  },

  glasses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  glass: {
    width: 34,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },

  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  listIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  listContent: {
    flex: 1,
    paddingRight: 8,
  },

  listTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  listSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  listDetail: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  checkButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  adviceCard: {
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
  },

  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  adviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  adviceTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  adviceText: {
    fontSize: 13,
    lineHeight: 21,
  },

  bottomSpacer: {
    height: 24,
  },
});
