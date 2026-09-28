import type { Language } from '@/context/DailyBalanceContext';

export type MealSlot = 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner';
export type ScheduleKind = 'routine' | 'water' | 'meal' | 'work' | 'movement' | 'rest';
export type MealPlanItem = { id: string; slot: MealSlot; time: string; title: string; detail: string };
export type ExercisePlanItem = { id: string; title: string; duration: string; difficulty: string; instructions: string; rest: string };
export type SchedulePlanItem = { id: string; time: string; kind: ScheduleKind; title: string };
export type WeeklyPlan = { day: number; meals: MealPlanItem[]; exercises: ExercisePlanItem[]; workSchedule: SchedulePlanItem[]; vacationSchedule: SchedulePlanItem[] };

const mealData = {
  en: [
    [['Two eggs + whole-grain toast', '2 eggs, 1 slice toast + tomatoes'], ['Apple + nuts', '1 apple + a small handful'], ['Grilled chicken bowl', '1 palm chicken + ½ cup rice + salad'], ['Plain yogurt', '1 small pot, no added sugar'], ['Vegetable soup + tuna', '1 bowl soup + ½ can tuna']],
    [['Oats + banana', '½ cup oats + 1 banana + cinnamon'], ['Pear + almonds', '1 pear + 10 almonds'], ['Lentil salad', '1 cup lentils + vegetables + olive oil'], ['Carrot sticks + hummus', '1 cup carrots + 2 tbsp hummus'], ['Baked fish + potatoes', '1 palm fish + 1 small potato + greens']],
    [['Yogurt + berries', '1 cup yogurt + ½ cup berries + oats'], ['Orange + walnuts', '1 orange + 5 walnut halves'], ['Chickpea pita', '1 whole pita + ¾ cup chickpeas + salad'], ['Cottage cheese', '½ cup + cucumber slices'], ['Turkey vegetable stir-fry', '1 palm turkey + 2 cups vegetables']],
    [['Avocado toast + egg', '½ avocado + 1 egg + whole-grain toast'], ['Banana + peanut butter', '1 banana + 1 tsp peanut butter'], ['Bean rice bowl', '¾ cup beans + ½ cup rice + salsa'], ['Yogurt + fruit', '1 small yogurt + seasonal fruit'], ['Omelet + salad', '2 eggs with vegetables + side salad']],
    [['Overnight oats', '½ cup oats + milk + fruit'], ['Apple + almonds', '1 apple + 10 almonds'], ['Chicken couscous', '1 palm chicken + ½ cup couscous + vegetables'], ['Plain yogurt', '1 small pot, no added sugar'], ['Tomato soup + light cheese', '1 bowl soup + 2 slices light cheese']],
    [['Scrambled eggs + greens', '2 eggs + greens + 1 slice toast'], ['Fruit + seeds', '1 piece of fruit + 1 tbsp seeds'], ['Tuna potato salad', '½ can tuna + 1 small potato + salad'], ['Hummus + cucumber', '2 tbsp hummus + cucumber'], ['Vegetable pasta', '1 cup whole-grain pasta + vegetables']],
    [['Greek yogurt + fruit', '1 cup yogurt + fruit + 1 tbsp oats'], ['Pear + nuts', '1 pear + a small handful'], ['Roast vegetable wrap', '1 whole wrap + vegetables + light cheese'], ['Kefir or yogurt', '1 small glass'], ['Chicken and vegetable soup', '1 bowl soup + 1 slice toast']],
  ],
  fr: [
    [['Deux œufs + tartine complète', '2 œufs, 1 tartine + tomates'], ['Pomme + noix', '1 pomme + une petite poignée'], ['Bol de poulet grillé', '1 paume de poulet + ½ tasse de riz + salade'], ['Yaourt nature', '1 petit pot, sans sucre ajouté'], ['Soupe de légumes + thon', '1 bol + ½ boîte de thon']],
    [['Avoine + banane', '½ tasse d’avoine + 1 banane + cannelle'], ['Poire + amandes', '1 poire + 10 amandes'], ['Salade de lentilles', '1 tasse de lentilles + légumes + huile d’olive'], ['Bâtonnets de carotte + houmous', '1 tasse de carottes + 2 c. à soupe'], ['Poisson au four + pommes de terre', '1 paume de poisson + 1 petite pomme de terre']],
    [['Yaourt + fruits rouges', '1 tasse de yaourt + fruits + avoine'], ['Orange + noix', '1 orange + 5 cerneaux de noix'], ['Pita aux pois chiches', '1 pita complète + pois chiches + salade'], ['Fromage frais', '½ tasse + rondelles de concombre'], ['Poêlée de dinde', '1 paume de dinde + 2 tasses de légumes']],
    [['Tartine avocat + œuf', '½ avocat + 1 œuf + pain complet'], ['Banane + purée de cacahuète', '1 banane + 1 c. à café'], ['Bol haricots et riz', '¾ tasse de haricots + riz + salsa'], ['Yaourt + fruit', '1 petit yaourt + fruit de saison'], ['Omelette + salade', '2 œufs aux légumes + salade']],
    [['Overnight oats', '½ tasse d’avoine + lait + fruit'], ['Pomme + amandes', '1 pomme + 10 amandes'], ['Couscous au poulet', '1 paume de poulet + couscous + légumes'], ['Yaourt nature', '1 petit pot, sans sucre ajouté'], ['Soupe tomate + fromage léger', '1 bol + 2 tranches de fromage']],
    [['Œufs brouillés + verdure', '2 œufs + verdure + tartine'], ['Fruit + graines', '1 fruit + 1 c. à soupe de graines'], ['Salade thon et pomme de terre', '½ boîte de thon + petite pomme de terre'], ['Houmous + concombre', '2 c. à soupe + concombre'], ['Pâtes aux légumes', '1 tasse de pâtes complètes + légumes']],
    [['Yaourt grec + fruit', '1 tasse + fruit + 1 c. à soupe d’avoine'], ['Poire + noix', '1 poire + une petite poignée'], ['Wrap de légumes rôtis', '1 wrap complet + légumes + fromage léger'], ['Kéfir ou yaourt', '1 petit verre'], ['Soupe poulet et légumes', '1 bol + 1 tartine']],
  ],
  ar: [
    [['بيضتان + خبز كامل الحبوب', 'بيضتان + شريحة خبز + طماطم'], ['تفاحة + مكسرات', 'تفاحة + حفنة صغيرة'], ['وعاء دجاج مشوي', 'قطعة دجاج بحجم الكف + نصف كوب أرز + سلطة'], ['زبادي طبيعي', 'علبة صغيرة دون سكر مضاف'], ['شوربة خضار + تونة', 'وعاء شوربة + نصف علبة تونة']],
    [['شوفان + موز', 'نصف كوب شوفان + موزة + قرفة'], ['كمثرى + لوز', 'كمثرى + 10 حبات لوز'], ['سلطة عدس', 'كوب عدس + خضار + زيت زيتون'], ['جزر + حمص', 'كوب جزر + ملعقتان حمص'], ['سمك بالفرن + بطاطا', 'قطعة سمك بحجم الكف + حبة بطاطا صغيرة + خضار']],
    [['زبادي + توت', 'كوب زبادي + نصف كوب توت + شوفان'], ['برتقالة + جوز', 'برتقالة + 5 أنصاف جوز'], ['خبز بيتا بالحمص', 'خبز كامل + ثلاثة أرباع كوب حمص + سلطة'], ['جبن قريش', 'نصف كوب + شرائح خيار'], ['ديك رومي مع خضار', 'قطعة بحجم الكف + كوبان خضار']],
    [['خبز بالأفوكادو والبيض', 'نصف أفوكادو + بيضة + خبز كامل'], ['موز + زبدة الفول السوداني', 'موزة + ملعقة صغيرة'], ['وعاء فاصولياء وأرز', 'ثلاثة أرباع كوب فاصولياء + أرز + صلصة'], ['زبادي + فاكهة', 'زبادي صغير + فاكهة موسمية'], ['عجة + سلطة', 'بيضتان مع خضار + سلطة']],
    [['شوفان منقوع', 'نصف كوب شوفان + حليب + فاكهة'], ['تفاحة + لوز', 'تفاحة + 10 حبات لوز'], ['كسكس بالدجاج', 'قطعة دجاج + نصف كوب كسكس + خضار'], ['زبادي طبيعي', 'علبة صغيرة دون سكر مضاف'], ['شوربة طماطم + جبن خفيف', 'وعاء شوربة + شريحتان جبن خفيف']],
    [['بيض مخفوق + خضار ورقية', 'بيضتان + خضار + شريحة خبز'], ['فاكهة + بذور', 'ثمرة فاكهة + ملعقة بذور'], ['سلطة تونة وبطاطا', 'نصف علبة تونة + حبة بطاطا صغيرة + سلطة'], ['حمص + خيار', 'ملعقتان حمص + خيار'], ['معكرونة بالخضار', 'كوب معكرونة كاملة + خضار']],
    [['زبادي يوناني + فاكهة', 'كوب زبادي + فاكهة + ملعقة شوفان'], ['كمثرى + مكسرات', 'كمثرى + حفنة صغيرة'], ['لفافة خضار مشوية', 'لفافة كاملة + خضار + جبن خفيف'], ['كفير أو زبادي', 'كوب صغير'], ['شوربة دجاج وخضار', 'وعاء شوربة + شريحة خبز']],
  ],
} as const;

const exerciseData = {
  en: [
    [['Mobility reset', '08 min', 'Easy', 'Circle shoulders, ankles and hips slowly.', '20 sec between moves'], ['Wall push-ups', '2 × 8 reps', 'Easy', 'Stand tall, hands on wall, bend and press away.', '45 sec between sets']],
    [['March in place', '10 min', 'Easy', 'Lift feet gently and swing relaxed arms.', '1 min easy breathing'], ['Chair squats', '2 × 8 reps', 'Low impact', 'Tap a chair with your hips, then stand tall.', '60 sec between sets']],
    [['Side leg lifts', '2 × 10 each side', 'Easy', 'Hold a chair and lift one leg out without leaning.', '45 sec between sides'], ['Gentle stretch', '08 min', 'Recovery', 'Stretch calves, back and shoulders without bouncing.', 'Slow breathing throughout']],
    [['Arm flow', '10 min', 'Easy', 'Reach forward, overhead and open wide in a steady rhythm.', '30 sec easy walk'], ['Low-impact knees', '2 × 30 sec', 'Low impact', 'Lift one knee at a time while keeping one foot grounded.', '60 sec between rounds']],
    [['Indoor walking', '12 min', 'Easy', 'Walk at a comfortable pace with soft steps.', '1 min water break'], ['Wall push-ups', '2 × 10 reps', 'Easy', 'Keep your body in one line as you press from the wall.', '45 sec between sets']],
    [['Chair strength circuit', '12 min', 'Low impact', 'Alternate sit-to-stands, heel raises and wall presses.', '60 sec after each round'], ['Full-body stretch', '08 min', 'Recovery', 'Move slowly through comfortable stretches.', 'Rest whenever needed']],
    [['Recovery walk', '15 min', 'Recovery', 'Walk gently around your home or outside.', 'Pause for water halfway'], ['Breathing stretch', '06 min', 'Very easy', 'Breathe in for four counts and out for six while stretching.', 'No extra rest needed']],
  ],
  fr: [
    [['Réveil mobilité', '08 min', 'Facile', 'Faire tourner doucement épaules, chevilles et hanches.', '20 sec entre les mouvements'], ['Pompes au mur', '2 × 8 répétitions', 'Facile', 'Mains au mur, fléchir puis repousser doucement.', '45 sec entre les séries']],
    [['Marche sur place', '10 min', 'Facile', 'Lever doucement les pieds et balancer les bras.', '1 min de respiration'], ['Squats vers une chaise', '2 × 8 répétitions', 'Doux', 'Toucher la chaise avec les hanches puis se redresser.', '60 sec entre les séries']],
    [['Élévations latérales', '2 × 10 par côté', 'Facile', 'Tenir une chaise et lever la jambe sans se pencher.', '45 sec entre les côtés'], ['Étirements doux', '08 min', 'Récupération', 'Étirements des mollets, du dos et des épaules.', 'Respiration lente']],
    [['Mouvement des bras', '10 min', 'Facile', 'Tendre les bras devant, au-dessus puis sur les côtés.', '30 sec de marche douce'], ['Genoux doux', '2 × 30 sec', 'Doux', 'Lever un genou puis l’autre en gardant un pied au sol.', '60 sec entre les tours']],
    [['Marche à la maison', '12 min', 'Facile', 'Marcher à un rythme confortable, sans impact.', '1 min pour boire'], ['Pompes au mur', '2 × 10 répétitions', 'Facile', 'Garder le corps aligné en repoussant le mur.', '45 sec entre les séries']],
    [['Circuit chaise', '12 min', 'Doux', 'Alterner lever de chaise, montées sur pointes et poussées au mur.', '60 sec après chaque tour'], ['Étirement complet', '08 min', 'Récupération', 'Passer lentement par des étirements confortables.', 'Repos selon le besoin']],
    [['Marche récupération', '15 min', 'Récupération', 'Marcher tranquillement chez soi ou dehors.', 'Pause eau à mi-parcours'], ['Étirement respiré', '06 min', 'Très facile', 'Inspirer quatre temps, expirer six temps en s’étirant.', 'Pas de repos supplémentaire']],
  ],
  ar: [
    [['تنشيط الحركة', '08 دقائق', 'سهل', 'حرك الكتفين والكاحلين والوركين ببطء.', '20 ثانية بين الحركات'], ['ضغط الحائط', 'مجموعتان × 8', 'سهل', 'قف أمام الحائط واثنِ الذراعين ثم ادفع بلطف.', '45 ثانية بين المجموعات']],
    [['المشي في المكان', '10 دقائق', 'سهل', 'ارفع القدمين بلطف وحرك الذراعين براحة.', 'دقيقة تنفس هادئ'], ['القرفصاء إلى كرسي', 'مجموعتان × 8', 'منخفض التأثير', 'المس الكرسي بالوركين ثم قف باستقامة.', '60 ثانية بين المجموعات']],
    [['رفع الساق الجانبي', 'مجموعتان × 10 لكل جانب', 'سهل', 'تمسك بكرسي وارفع الساق دون ميلان.', '45 ثانية بين الجانبين'], ['تمدد لطيف', '08 دقائق', 'تعافٍ', 'مدد الساقين والظهر والكتفين دون ارتداد.', 'تنفس ببطء']],
    [['تمارين الذراعين', '10 دقائق', 'سهل', 'مد الذراعين للأمام وفوق الرأس وللجانبين بإيقاع ثابت.', '30 ثانية مشي خفيف'], ['رفع الركبة منخفض التأثير', 'مجموعتان × 30 ثانية', 'منخفض التأثير', 'ارفع ركبة واحدة في كل مرة مع إبقاء قدم على الأرض.', '60 ثانية بين الجولات']],
    [['المشي داخل المنزل', '12 دقيقة', 'سهل', 'امشِ بوتيرة مريحة وبخطوات هادئة.', 'دقيقة لشرب الماء'], ['ضغط الحائط', 'مجموعتان × 10', 'سهل', 'حافظ على استقامة الجسم أثناء الدفع من الحائط.', '45 ثانية بين المجموعات']],
    [['دائرة تمارين الكرسي', '12 دقيقة', 'منخفض التأثير', 'بدل بين الوقوف من الكرسي ورفع الكعب والضغط على الحائط.', '60 ثانية بعد كل جولة'], ['تمدد كامل للجسم', '08 دقائق', 'تعافٍ', 'تحرك ببطء خلال تمارين تمدد مريحة.', 'استرح عند الحاجة']],
    [['مشي للتعافي', '15 دقيقة', 'تعافٍ', 'امشِ بلطف داخل المنزل أو خارجه.', 'توقف للماء في المنتصف'], ['تمدد مع التنفس', '06 دقائق', 'سهل جداً', 'تنفس أربع عدات للداخل وست عدات للخارج مع التمدد.', 'لا تحتاج إلى راحة إضافية']],
  ],
} as const;

const scheduleWords = {
  en: {
    wake: 'Wake up', water1: 'Drink a glass of water', breakfast: 'Breakfast', morning: 'Morning routine', work: ['Focus work block', 'Meetings and focused work', 'Planning and focused work', 'Creative work block', 'Focus work block', 'Weekly review block', 'Personal projects'], snack: 'Morning snack', lunch: 'Lunch away from desk', water2: 'Water reminder', movement: ['Short mobility break', 'Low-impact movement break', 'Stand, breathe and stretch', 'Walk around for 5 minutes', 'Gentle mobility break', 'Stretch and reset', 'Easy recovery movement'], end: 'End-of-work routine', exercise: 'Low-impact home exercise', dinner: 'Dinner', evening: 'Light evening activity', sleep: 'Sleep preparation',
    vacWake: 'Slow wake-up', vacMorning: 'Sunlight and morning routine', vacWork: ['Read or explore something new', 'Leisure walk and free time', 'Creative hobby time', 'Slow morning project', 'Time outdoors', 'Family or friend time', 'Personal reset'], vacSnack: 'Morning snack', vacLunch: 'Relaxed lunch', vacWater: 'Water check-in', vacMovement: ['Beach or neighborhood walk', 'Gentle mobility', 'Stretch and breathe', 'Easy home movement', 'Sightseeing walk', 'Recovery movement', 'Restorative walk'], vacExercise: 'Optional gentle exercise', vacDinner: 'Dinner', vacEvening: 'Unhurried evening', vacSleep: 'Wind-down for sleep',
  },
  fr: {
    wake: 'Réveil', water1: 'Boire un verre d’eau', breakfast: 'Petit-déjeuner', morning: 'Routine du matin', work: ['Bloc de concentration', 'Réunions et travail concentré', 'Planification et concentration', 'Bloc créatif', 'Bloc de concentration', 'Bilan de la semaine', 'Projets personnels'], snack: 'En-cas du matin', lunch: 'Déjeuner loin du bureau', water2: 'Rappel eau', movement: ['Pause mobilité', 'Pause mouvement doux', 'Se lever, respirer, s’étirer', 'Marcher 5 minutes', 'Mobilité douce', 'S’étirer et repartir', 'Mouvement récupération'], end: 'Fin de journée de travail', exercise: 'Exercice doux à la maison', dinner: 'Dîner', evening: 'Activité légère du soir', sleep: 'Préparation au sommeil',
    vacWake: 'Réveil tranquille', vacMorning: 'Soleil et routine du matin', vacWork: ['Lire ou découvrir', 'Marche et temps libre', 'Temps pour un loisir créatif', 'Projet du matin sans urgence', 'Temps dehors', 'Temps avec proches', 'Se recentrer'], vacSnack: 'En-cas du matin', vacLunch: 'Déjeuner détendu', vacWater: 'Point eau', vacMovement: ['Marche près de chez soi', 'Mobilité douce', 'S’étirer et respirer', 'Mouvement doux à la maison', 'Marche découverte', 'Mouvement récupération', 'Marche régénérante'], vacExercise: 'Exercice doux facultatif', vacDinner: 'Dîner', vacEvening: 'Soirée sans urgence', vacSleep: 'Retour au calme',
  },
  ar: {
    wake: 'الاستيقاظ', water1: 'كوب ماء', breakfast: 'الفطور', morning: 'روتين الصباح', work: ['جلسة عمل بتركيز', 'اجتماعات وعمل مركز', 'تخطيط وعمل مركز', 'جلسة عمل إبداعي', 'جلسة تركيز', 'مراجعة الأسبوع', 'مشاريع شخصية'], snack: 'وجبة خفيفة صباحية', lunch: 'الغداء بعيداً عن المكتب', water2: 'تذكير بالماء', movement: ['استراحة حركة قصيرة', 'استراحة حركة منخفضة التأثير', 'قف وتنفس ومدد جسمك', 'مشي لمدة 5 دقائق', 'حركة لطيفة', 'تمدد وإعادة ضبط', 'حركة تعافٍ سهلة'], end: 'نهاية روتين العمل', exercise: 'تمرين منزلي منخفض التأثير', dinner: 'العشاء', evening: 'نشاط مسائي خفيف', sleep: 'الاستعداد للنوم',
    vacWake: 'استيقاظ هادئ', vacMorning: 'شمس وروتين صباحي', vacWork: ['قراءة أو اكتشاف شيء جديد', 'مشي ووقت حر', 'وقت لهواية إبداعية', 'مشروع صباحي هادئ', 'وقت في الخارج', 'وقت مع العائلة أو الأصدقاء', 'استعادة التوازن'], vacSnack: 'وجبة خفيفة صباحية', vacLunch: 'غداء مريح', vacWater: 'تذكير بالماء', vacMovement: ['مشي في الحي', 'حركة لطيفة', 'تمدد وتنفس', 'حركة خفيفة في المنزل', 'مشي للاستكشاف', 'حركة للتعافي', 'مشي لاستعادة النشاط'], vacExercise: 'تمرين لطيف اختياري', vacDinner: 'العشاء', vacEvening: 'مساء هادئ', vacSleep: 'الاسترخاء قبل النوم',
  },
} as const;

function makeSchedule(language: Language, day: number, vacation: boolean): SchedulePlanItem[] {
  const words = scheduleWords[language];
  if (vacation) return [
    { id: `d${day}-vac-wake`, time: '07:30', kind: 'routine', title: words.vacWake },
    { id: `d${day}-vac-water`, time: '07:40', kind: 'water', title: words.water1 },
    { id: `d${day}-vac-morning`, time: '08:30', kind: 'routine', title: words.vacMorning },
    { id: `d${day}-vac-breakfast`, time: '09:00', kind: 'meal', title: words.breakfast },
    { id: `d${day}-vac-snack`, time: '11:30', kind: 'meal', title: words.vacSnack },
    { id: `d${day}-vac-lunch`, time: '14:00', kind: 'meal', title: words.vacLunch },
    { id: `d${day}-vac-water2`, time: '15:30', kind: 'water', title: words.vacWater },
    { id: `d${day}-vac-movement`, time: '17:00', kind: 'movement', title: words.vacMovement[day] },
    { id: `d${day}-vac-exercise`, time: '18:00', kind: 'movement', title: words.vacExercise },
    { id: `d${day}-vac-dinner`, time: '20:00', kind: 'meal', title: words.vacDinner },
    { id: `d${day}-vac-evening`, time: '21:00', kind: 'rest', title: words.vacEvening },
    { id: `d${day}-vac-sleep`, time: '22:30', kind: 'rest', title: words.vacSleep },
  ];
  return [
    { id: `d${day}-work-wake`, time: '06:00', kind: 'routine', title: words.wake },
    { id: `d${day}-work-water1`, time: '06:10', kind: 'water', title: words.water1 },
    { id: `d${day}-work-breakfast`, time: '06:30', kind: 'meal', title: words.breakfast },
    { id: `d${day}-work-morning`, time: '07:00', kind: 'routine', title: words.morning },
    { id: `d${day}-work-start`, time: '08:00', kind: 'work', title: words.work[day] },
    { id: `d${day}-work-water2`, time: '09:00', kind: 'water', title: words.water2 },
    { id: `d${day}-work-snack`, time: '10:30', kind: 'meal', title: words.snack },
    { id: `d${day}-work-movement1`, time: '11:15', kind: 'movement', title: words.movement[day] },
    { id: `d${day}-work-lunch`, time: '12:30', kind: 'meal', title: words.lunch },
    { id: `d${day}-work-water3`, time: '14:00', kind: 'water', title: words.water2 },
    { id: `d${day}-work-end`, time: '16:00', kind: 'routine', title: words.end },
    { id: `d${day}-work-exercise`, time: '18:00', kind: 'movement', title: words.exercise },
    { id: `d${day}-work-dinner`, time: '19:30', kind: 'meal', title: words.dinner },
    { id: `d${day}-work-evening`, time: '20:30', kind: 'rest', title: words.evening },
    { id: `d${day}-work-sleep`, time: '21:30', kind: 'rest', title: words.sleep },
  ];
}

export function getWeeklyPlan(language: Language, day: number): WeeklyPlan {
  const meals = mealData[language][day].map(([title, detail], index) => ({ id: `d${day}-meal-${index}`, slot: (['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner'] as MealSlot[])[index], time: (['06:30', '10:30', '12:30', '16:00', '19:30'])[index], title, detail }));
  const exercises = exerciseData[language][day].map(([title, duration, difficulty, instructions, rest], index) => ({ id: `d${day}-exercise-${index}`, title, duration, difficulty, instructions, rest }));
  return { day, meals, exercises, workSchedule: makeSchedule(language, day, false), vacationSchedule: makeSchedule(language, day, true) };
}