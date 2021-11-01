import { DistrictEntity } from '@app/entities';

// 118 entities
const data: Partial<DistrictEntity>[] = [
  {
    slug: 'baranavitski-raion',
    name: 'Барановичский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'biarozauski-raion',
    name: 'Берёзовский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'brestski-raion',
    name: 'Брестский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'hantsavitski-raion',
    name: 'Ганцевичский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'drahichynski-raion',
    name: 'Дрогичинский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'zhabinkauski-raion',
    name: 'Жабинковский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'ivanauski-raion',
    name: 'Ивановский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'ivatsevichski-raion',
    name: 'Ивацевичский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'kamianetski-raion',
    name: 'Каменецкий',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'kobrynski-raion',
    name: 'Кобринский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'luninetski-raion',
    name: 'Лунинецкий',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'liahavitski-raion',
    name: 'Ляховичский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'malarytski-raion',
    name: 'Малоритский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'pinski-raion',
    name: 'Пинский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'pruzhanski-raion',
    name: 'Пружанский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'stolinski-raion',
    name: 'Столинский',
    regionSlug: 'brestskaia-voblasts',
  },
  {
    slug: 'beshankovitski-raion',
    name: 'Бешенковичский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'braslauski-raion',
    name: 'Браславский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'verhniadzvinski-raion',
    name: 'Верхнедвинский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'vitsebski-raion',
    name: 'Витебский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'hlybotski-raion',
    name: 'Глубокский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'haradotski-raion',
    name: 'Городокский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'dokshytski-raion',
    name: 'Докшицкий',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'dubrovenski-raion',
    name: 'Дубровенский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'lepelski-raion',
    name: 'Лепельский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'lioznenski-raion',
    name: 'Лиозненский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'miorski-raion',
    name: 'Миорский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'arshanski-raion',
    name: 'Оршанский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'polatski-raion',
    name: 'Полоцкий',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'pastauski-raion',
    name: 'Поставский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'rasonski-raion',
    name: 'Россонский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'sennenski-raion',
    name: 'Сенненский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'talachynski-raion',
    name: 'Толочинский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'ushatski-raion',
    name: 'Ушачский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'chashnitski-raion',
    name: 'Чашникский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'sharkaushchynski-raion',
    name: 'Шарковщинский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'shumilinski-raion',
    name: 'Шумилинский',
    regionSlug: 'vitsebskaia-voblasts',
  },
  {
    slug: 'brahinski-raion',
    name: 'Брагинский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'buda-kashaliouski-raion',
    name: 'Буда-Кошелёвский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'vetkauski-raion',
    name: 'Ветковский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'homelski-raion',
    name: 'Гомельский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'dobrushski-raion',
    name: 'Добрушский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'elski-raion',
    name: 'Ельский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'zhytkavitski-raion',
    name: 'Житковичский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'zhlobinski-raion',
    name: 'Жлобинский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'kalinkavitski-raion',
    name: 'Калинковичский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'karmianski-raion',
    name: 'Кормянский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'lelchytski-raion',
    name: 'Лельчицкий',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'loeuski-raion',
    name: 'Лоевский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'mazyrski-raion',
    name: 'Мозырский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'naraulianski-raion',
    name: 'Наровлянский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'aktsiabrski-raion',
    name: 'Октябрьский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'petrykauski-raion',
    name: 'Петриковский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'rechytski-raion',
    name: 'Речицкий',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'rahachouski-raion',
    name: 'Рогачёвский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'svetlahorski-raion',
    name: 'Светлогорский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'khoinitski-raion',
    name: 'Хойникский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'chacherski-raion',
    name: 'Чечерский',
    regionSlug: 'homelskaia-voblasts',
  },
  {
    slug: 'berastavitski-raion',
    name: 'Берестовицкий',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'vaukavyski-raion',
    name: 'Волковысский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'voranauski-raion',
    name: 'Вороновский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'hrodzenski-raion',
    name: 'Гродненский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'dziatlauski-raion',
    name: 'Дятловский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'zelvenski-raion',
    name: 'Зельвенский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'iueuski-raion',
    name: 'Ивьевский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'karelitski-raion',
    name: 'Кореличский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'lidski-raion',
    name: 'Лидский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'mastouski-raion',
    name: 'Мостовский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'navagrudski-raion',
    name: 'Новогрудский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'ashmianski-raion',
    name: 'Ошмянский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'astravetski-raion',
    name: 'Островецкий',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'svislatski-raion',
    name: 'Свислочский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'slonimski-raion',
    name: 'Слонимский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'smargonski-raion',
    name: 'Сморгонский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'shchuchynski-raion',
    name: 'Щучинский',
    regionSlug: 'hrodnenskaia-voblasts',
  },
  {
    slug: 'biarezinski-raion',
    name: 'Березинский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'barysauski-raion',
    name: 'Борисовский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'vileiski-raion',
    name: 'Вилейский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'valozhynski-raion',
    name: 'Воложинский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'dziarzhynski-raion',
    name: 'Дзержинский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'kletski-raion',
    name: 'Клецкий',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'kapylski-raion',
    name: 'Копыльский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'krupski-raion',
    name: 'Крупский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'lagoiski-raion',
    name: 'Логойский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'liubanski-raion',
    name: 'Любанский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'minski-raion',
    name: 'Минский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'maladzechanski-raion',
    name: 'Молодечненский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'miadzelski-raion',
    name: 'Мядельский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'niasvizhski-raion',
    name: 'Несвижский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'puhavitski-raion',
    name: 'Пуховичский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'slutski-raion',
    name: 'Слуцкий',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'smaliavitski-raion',
    name: 'Смолевичский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'salihorski-raion',
    name: 'Солигорский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'staradarozhski-raion',
    name: 'Стародорожский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'staubtsouski-raion',
    name: 'Столбцовский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'uzdzenski-raion',
    name: 'Узденский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'chervenski-raion',
    name: 'Червенский',
    regionSlug: 'minskaia-voblasts',
  },
  {
    slug: 'bialynitski-raion',
    name: 'Белыничский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'babruiski-raion',
    name: 'Бобруйский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'byhauski-raion',
    name: 'Быховский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'hluski-raion',
    name: 'Глусский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'horatski-raion',
    name: 'Горецкий',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'drybinski-raion',
    name: 'Дрибинский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'kirauski-raion',
    name: 'Кировский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'klimavitski-raion',
    name: 'Климовичский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'klichauski-raion',
    name: 'Кличевский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'kastsiukovitski-raion',
    name: 'Костюковичский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'krasnapolski-raion',
    name: 'Краснопольский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'krychauski-raion',
    name: 'Кричевский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'kruhlianski-raion',
    name: 'Круглянский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'mahiliouski-raion',
    name: 'Могилёвский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'mstsislauski-raion',
    name: 'Мстиславский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'asipovitski-raion',
    name: 'Осиповичский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'slauharadski-raion',
    name: 'Славгородский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'khotsimski-raion',
    name: 'Хотимский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'chavuski-raion',
    name: 'Чаусский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'cherykauski-raion',
    name: 'Чериковский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
  {
    slug: 'shklouski-raion',
    name: 'Шкловский',
    regionSlug: 'mahiliouskaia-voblasts',
  },
];

export default data;
