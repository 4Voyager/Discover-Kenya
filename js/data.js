/* ==========================================================================
   data.js — single source of truth for every page.
   Add or edit an attraction here and Home, Explore and Detail all update.
   Fees and opening hours change often: treat them as a guide and check the
   official link on each attraction before you travel.
   ========================================================================== */

window.KT = window.KT || {};

/* ---------- image helpers ----------
   Every picture lives in the images/ folder (see images/IMAGE-LIST.md for names). */
KT.img = {
  scene: slug => `images/${slug}.jpg`,
  gallery: slug => [1, 2, 3, 4].map(n => `images/${slug}${n === 1 ? '' : '-' + n}.jpg`),
};

/* ---------- taxonomy ---------- */
KT.categories = [
  { id: 'wildlife', label: 'Wildlife', text: 'Big cats, elephants and the great migration.', scene: 'maasai-mara' },
  { id: 'beaches', label: 'Beaches', text: 'Warm Indian Ocean water, reef and white sand.', scene: 'diani-beach' },
  { id: 'mountains', label: 'Mountains', text: 'Glaciers on the equator and volcano rims.', scene: 'mount-kenya' },
  { id: 'culture', label: 'Culture', text: 'Swahili stone towns, forts and living traditions.', scene: 'lamu' },
  { id: 'adventure', label: 'Adventure', text: 'Gorge walks, long treks and remote shores.', scene: 'hells-gate' },
];

KT.regions = [
  { id: 'coast', label: 'Coast', text: 'Swahili towns, coral reef and palm-lined beaches from Lamu to Diani.' },
  { id: 'rift', label: 'Rift Valley', text: 'Volcanoes, lakes and the open plains of the Maasai Mara.' },
  { id: 'highlands', label: 'Nairobi & Highlands', text: 'A national park beside the capital, and Africa’s second-highest peak.' },
  { id: 'south', label: 'Southern Rangelands', text: 'Elephant country under Kilimanjaro, and the vast red plains of Tsavo.' },
  { id: 'north', label: 'Northern Kenya', text: 'Dry river reserves and the jade waters of Lake Turkana.' },
];

/* ---------- attractions ----------
   months: Jan → Dec. 2 = best, 1 = good, 0 = less ideal.
   facilities level: 'yes' | 'some' | 'no'                                   */
KT.attractions = [
  {
    slug: 'maasai-mara', name: 'Maasai Mara National Reserve', shortName: 'MARA', region: 'rift',
    categories: ['wildlife', 'culture'], lon: 35.15, lat: -1.50, popularity: 100, duration: '3–5 days',
    tagline: 'Open plains, big cats and the great wildebeest crossing.',
    summary: 'Kenya’s most famous reserve: golden grassland, lion prides and, from July, the river crossings of the Great Migration.',
    overview: [
      'The Mara is a broad sweep of savanna on the northern edge of the Serengeti ecosystem. Resident lions, cheetahs, elephants and giraffes are here all year, which is why it works as a first safari.',
      'From roughly July to October, over a million wildebeest and zebra arrive from Tanzania and cross the Mara River. The reserve sits beside Maasai community conservancies, so you can also visit a village and walk with a Maasai guide.'],
    highlights: ['Great Migration river crossings, about July–October', 'Strong chances of seeing lion, leopard and cheetah', 'Dawn balloon flights over the plains'],
    thingsToDo: [
      { title: 'Game drives', text: 'Go out at first light and again late afternoon, when the cats are most active.' },
      { title: 'Hot-air balloon', text: 'Float over the plains at sunrise and land for a bush breakfast.' },
      { title: 'Mara River crossings', text: 'Wait at the Mara River banks in season to watch herds cross.' },
      { title: 'Maasai village visit', text: 'Meet a community in the neighbouring conservancies and learn about pastoral life.' },
      { title: 'Walking safari', text: 'Walk with a guide in the conservancies for the small details you miss in a vehicle.' }],
    months: [2, 2, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1],
    bestNote: 'July to October for the migration. January and February are drier, with fewer vehicles.',
    hours: 'Gates generally open about 06:00 and close about 18:00; stay inside the reserve after dark only with a lodge.',
    fees: [{ label: 'Non-resident adult', value: 'About US$100–200 per day, higher in peak season' }, { label: 'Child (non-resident)', value: 'Reduced rate' }, { label: 'Kenyan citizen / resident', value: 'Much lower local rate' }, { label: 'Balloon flight', value: 'About US$450–500 per person' }],
    feesNote: 'The reserve is run by Narok County, so rates differ from the national parks. Confirm current prices before you book.',
    gettingThere: [
      { mode: 'By road', text: 'About 270 km from Nairobi, 5–6 hours by 4×4 via Narok. The last stretch is rough.' },
      { mode: 'By air', text: 'Daily scheduled flights from Nairobi Wilson Airport to Mara airstrips take about 45–60 minutes.' },
      { mode: 'Tour', text: 'Most visitors book a lodge or operator package that includes transfers and game drives.' }],
    facilities: [{ label: 'Lodges & camps', level: 'yes' }, { label: 'Restrooms', level: 'some' }, { label: 'Food & drink', level: 'some' }, { label: 'Licensed guides', level: 'yes' }, { label: 'Wheelchair access', level: 'some' }],
    accessNote: 'Safari vehicles with raised seats can be hard for limited mobility; ask operators about vehicles with lower steps.',
    tips: ['Book a lodge near the Mara River if the crossings are your main goal.', 'Bring neutral clothing, a hat and binoculars.', 'Stay in your vehicle and keep at least 25 m from animals.', 'Respect community land: ask before photographing people.'],
    official: [{ label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }, { label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }],
  },
  {
    slug: 'amboseli', name: 'Amboseli National Park', shortName: 'AMBOSELI', region: 'south',
    categories: ['wildlife'], lon: 37.26, lat: -2.65, popularity: 92, duration: '2–3 days',
    tagline: 'Big elephants, with Kilimanjaro behind them.',
    summary: 'Large elephant herds wade through swamps beneath the snowy dome of Mount Kilimanjaro.',
    overview: [
      'Amboseli is famous for one picture: elephants in the foreground, Africa’s highest mountain behind. The park is small and open, so animals are easy to find and to photograph.',
      'Swamps fed by Kilimanjaro’s melt draw elephants, buffalo, hippos and hundreds of bird species across an otherwise dusty basin. Elephant research here has run for decades.'],
    highlights: ['Kilimanjaro views, clearest at dawn and dusk', 'Some of Africa’s best-studied elephants', 'Short distances between sightings'],
    thingsToDo: [
      { title: 'Dawn game drive', text: 'The mountain is usually clear before about 09:00; clouds often hide it later.' },
      { title: 'Observation Hill', text: 'Climb for a view over the swamps and plains.' },
      { title: 'Birdwatching', text: 'Look for pelicans, crowned cranes and kingfishers around the wetlands.' },
      { title: 'Maasai cultural visit', text: 'Visit a community on the park’s edge.' }],
    months: [2, 2, 0, 0, 1, 2, 2, 2, 2, 2, 0, 1],
    bestNote: 'June to October and January to February, when skies are clear and animals gather at the swamps.',
    hours: 'Open daily, about 06:00–18:00.',
    fees: [{ label: 'Non-resident adult', value: 'About US$60–90 per day depending on season' }, { label: 'Child (non-resident)', value: 'Reduced rate' }, { label: 'Kenyan citizen / resident', value: 'Lower local rate' }],
    feesNote: 'Run by Kenya Wildlife Service. Pay by card or mobile money through the official system; confirm current rates.',
    gettingThere: [
      { mode: 'By road', text: 'About 240 km from Nairobi, 4–5 hours via Namanga or Emali.' },
      { mode: 'By air', text: 'Scheduled and charter flights to Amboseli airstrip from Nairobi Wilson Airport, about 50 minutes.' }],
    facilities: [{ label: 'Lodges & camps', level: 'yes' }, { label: 'Restrooms', level: 'some' }, { label: 'Food & drink', level: 'some' }, { label: 'Licensed guides', level: 'yes' }, { label: 'Wheelchair access', level: 'some' }],
    accessNote: 'Flat terrain and short drives make this one of the easier parks for visitors with limited mobility.',
    tips: ['Wake early: the mountain hides behind cloud by mid-morning.', 'The dry season brings a lot of dust, so cover camera gear.', 'Combine with Tsavo West for a longer southern circuit.'],
    official: [{ label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }, { label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }],
  },
  {
    slug: 'tsavo', name: 'Tsavo East & West National Parks', shortName: 'TSAVO', region: 'south',
    categories: ['wildlife', 'adventure'], lon: 38.30, lat: -3.0, popularity: 78, duration: '3–4 days',
    tagline: 'Red-dust elephants across one of Africa’s largest parks.',
    summary: 'Enormous, wild and uncrowded, with red elephants, lava flows and crystal springs.',
    overview: [
      'Together the two Tsavo parks cover more than 20,000 km², making this one of the largest protected areas in Africa. Elephants dust-bathe in the red earth, which colours their skin rust-red.',
      'Tsavo East is open plains and long views. Tsavo West is more varied: volcanic cones, the Shetani lava flow and Mzima Springs, where hippos and fish can be seen underwater from a viewing chamber.'],
    highlights: ['Red elephants and big herds', 'Mzima Springs and Shetani lava flow', 'Wide landscapes with few vehicles'],
    thingsToDo: [
      { title: 'Mudanda Rock', text: 'Watch elephants drink at the waterhole below this long rock outcrop in Tsavo East.' },
      { title: 'Mzima Springs', text: 'Walk along the pools in Tsavo West and look for hippos underwater.' },
      { title: 'Shetani lava flow', text: 'Walk across a black lava field and into a lava tube cave.' },
      { title: 'Lugard Falls', text: 'See the Galana River squeeze through rock channels.' }],
    months: [2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 0, 1],
    bestNote: 'The dry months, June to October and January to February, when animals gather at water.',
    hours: 'Open daily, about 06:00–18:00.',
    fees: [{ label: 'Non-resident adult', value: 'About US$50–80 per day' }, { label: 'Child (non-resident)', value: 'Reduced rate' }, { label: 'Kenyan citizen / resident', value: 'Lower local rate' }],
    feesNote: 'Each park has its own gates and fees. Confirm with KWS.',
    gettingThere: [
      { mode: 'By road', text: 'About 330 km from Nairobi to Tsavo West’s Mtito Andei gate (about 4–5 hours) on the Mombasa highway.' },
      { mode: 'By train', text: 'The Nairobi–Mombasa SGR stops at Mtito Andei and Voi, both close to park gates.' },
      { mode: 'By air', text: 'Airstrips serve the lodges inside both parks.' }],
    facilities: [{ label: 'Lodges & camps', level: 'yes' }, { label: 'Restrooms', level: 'some' }, { label: 'Food & drink', level: 'some' }, { label: 'Licensed guides', level: 'yes' }, { label: 'Wheelchair access', level: 'some' }],
    accessNote: 'Distances between sights are long; plan drive times carefully.',
    tips: ['Carry plenty of water and fuel; services inside the parks are limited.', 'Hire a guide for the lava flows.', 'Combine with Diani or Watamu for a bush-and-beach trip.'],
    official: [{ label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }, { label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }],
  },
  {
    slug: 'samburu', name: 'Samburu National Reserve', shortName: 'SAMBURU', region: 'north',
    categories: ['wildlife', 'culture'], lon: 37.53, lat: 0.60, popularity: 70, duration: '2–3 days',
    tagline: 'A dry-country river reserve with species you won’t see in the Mara.',
    summary: 'Hot, rocky and beautiful, home to the “Special Five” of the north and the Samburu people.',
    overview: [
      'Samburu follows the Ewaso Ng’iro River through semi-desert. Animals come to the water, which makes game viewing easy even in the dry season.',
      'The north has its own wildlife: reticulated giraffe, Grevy’s zebra, Somali ostrich, beisa oryx and the long-necked gerenuk are often called the Special Five.'],
    highlights: ['The Special Five of northern Kenya', 'Elephants and crocodiles along the Ewaso Ng’iro', 'Samburu cultural visits'],
    thingsToDo: [
      { title: 'River-edge game drives', text: 'Follow the riverbanks for elephants, leopards and crocodiles.' },
      { title: 'Spot the Special Five', text: 'Ask your guide to help you tick off all five northern species.' },
      { title: 'Samburu village', text: 'Visit a community and hear about pastoral traditions.' },
      { title: 'Night drives', text: 'Offered in some neighbouring conservancies, for aardwolf and genets.' }],
    months: [2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 0, 2],
    bestNote: 'January to March and June to October. Roads can turn muddy in April and May.',
    hours: 'Open daily, about 06:00–18:00.',
    fees: [{ label: 'Non-resident adult', value: 'About US$70–100 per day' }, { label: 'Child (non-resident)', value: 'Reduced rate' }, { label: 'Kenyan citizen / resident', value: 'Lower local rate' }],
    feesNote: 'The reserve is county-managed. Confirm current rates with your operator.',
    gettingThere: [
      { mode: 'By road', text: 'About 350 km from Nairobi, 6–7 hours via Nanyuki and Isiolo.' },
      { mode: 'By air', text: 'Daily flights from Nairobi Wilson Airport to Samburu airstrips, about 1 hour 15 minutes.' }],
    facilities: [{ label: 'Lodges & camps', level: 'yes' }, { label: 'Restrooms', level: 'some' }, { label: 'Food & drink', level: 'some' }, { label: 'Licensed guides', level: 'yes' }, { label: 'Wheelchair access', level: 'some' }],
    accessNote: 'Open vehicles and uneven tracks; discuss needs with your lodge.',
    tips: ['It’s hot. Bring a hat, sunscreen and a lot of water.', 'Pair it with Mount Kenya or Lewa on the way north.', 'Check the latest travel advice for northern routes before you set off.'],
    official: [{ label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }, { label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }],
  },
  {
    slug: 'nairobi-national-park', name: 'Nairobi National Park', shortName: 'NAIROBI', region: 'highlands',
    categories: ['wildlife'], lon: 36.85, lat: -1.37, popularity: 88, duration: 'Half day',
    tagline: 'Lions and giraffes with a city skyline behind them.',
    summary: 'The world’s only national park bordering a capital city: rhinos, lions and giraffes within sight of the towers.',
    overview: [
      'Established in 1946, Nairobi National Park sits about 7 km from the city centre. You can leave a meeting and be watching giraffes an hour later.',
      'The park is small but rich: black rhino, lion, leopard, buffalo and more than 400 bird species. The southern edge is unfenced so animals can still move to and from the wider ecosystem.'],
    highlights: ['A real safari 7 km from the city centre', 'One of the best places in Kenya to see black rhino', 'Easy half-day or sunrise visit'],
    thingsToDo: [
      { title: 'Morning game drive', text: 'Arrive at opening for the best light and cooler temperatures.' },
      { title: 'Ivory Burning Site Monument', text: 'See the site where Kenya burned tonnes of ivory in 2016.' },
      { title: 'Nearby orphanage and giraffe centre', text: 'Visit the Sheldrick elephant orphanage and the Giraffe Centre, both close by.' },
      { title: 'Picnic sites', text: 'Stop at designated sites with views across the plains.' }],
    months: [2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 1, 1],
    bestNote: 'Good all year; dry months from June to October make animals easier to find.',
    hours: 'Open daily, about 05:30–19:00.',
    fees: [{ label: 'Non-resident adult', value: 'About US$40–50 per day' }, { label: 'Child (non-resident)', value: 'Reduced rate' }, { label: 'Kenyan citizen / resident', value: 'Lower local rate' }],
    feesNote: 'Run by Kenya Wildlife Service. Confirm current rates.',
    gettingThere: [
      { mode: 'By road', text: 'About 20–40 minutes from central Nairobi via the Main Gate on Lang’ata Road; traffic varies.' },
      { mode: 'By air', text: 'Jomo Kenyatta International Airport is roughly 20 minutes from the Embakasai gate.' },
      { mode: 'Taxi / tour', text: 'App taxis and guided half-day tours both work well.' }],
    facilities: [{ label: 'Lodges & camps', level: 'some' }, { label: 'Restrooms', level: 'yes' }, { label: 'Food & drink', level: 'yes' }, { label: 'Licensed guides', level: 'yes' }, { label: 'Wheelchair access', level: 'some' }],
    accessNote: 'Well-surfaced main loops and vehicles make this a good option for all abilities.',
    tips: ['Go in the early morning, before the city traffic builds.', 'Combine with the Giraffe Centre and the elephant orphanage for a full day.', 'Keep windows and roof hatches closed near the lion areas.'],
    official: [{ label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }, { label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }],
  },
  {
    slug: 'lake-nakuru', name: 'Lake Nakuru National Park', shortName: 'NAKURU', region: 'rift',
    categories: ['wildlife'], lon: 36.08, lat: -0.37, popularity: 80, duration: '1–2 days',
    tagline: 'A soda lake, rhinos and pink flamingos at the shore.',
    summary: 'A compact park around an alkaline lake, with flamingos, rhinos and Rothschild’s giraffe.',
    overview: [
      'The park wraps around a shallow soda lake in the Rift Valley. When conditions suit algae growth, the shoreline turns pink with flamingos; their numbers rise and fall with the water levels.',
      'It’s also a rhino sanctuary, with both black and white rhino, and one of the better places to see Rothschild’s giraffe and leopards in the woodland.'],
    highlights: ['Flamingos along the shore when the lake is right', 'Black and white rhino', 'Baboon Cliff and Out of Africa viewpoints'],
    thingsToDo: [
      { title: 'Lakeshore drive', text: 'Follow the shoreline loop for birds and views of the flamingo flocks.' },
      { title: 'Baboon Cliff', text: 'Stand at the cliff top for a wide view across the lake.' },
      { title: 'Rhino spotting', text: 'Ask your guide for current rhino areas in the woodlands.' },
      { title: 'Makalia Falls', text: 'Take a short stop to see the waterfall at the park’s south end.' }],
    months: [2, 2, 1, 0, 0, 2, 2, 2, 2, 1, 0, 1],
    bestNote: 'Wildlife is good year-round. Dry months from June to October make roads easier.',
    hours: 'Open daily, about 06:00–18:00.',
    fees: [{ label: 'Non-resident adult', value: 'About US$60–90 per day' }, { label: 'Child (non-resident)', value: 'Reduced rate' }, { label: 'Kenyan citizen / resident', value: 'Lower local rate' }],
    feesNote: 'Run by Kenya Wildlife Service. Confirm current rates.',
    gettingThere: [
      { mode: 'By road', text: 'About 160 km from Nairobi, 3 hours via the Nakuru highway. The main gate is on the edge of Nakuru town.' },
      { mode: 'By train', text: 'Check the current rail timetable to Nakuru.' }],
    facilities: [{ label: 'Lodges & camps', level: 'yes' }, { label: 'Restrooms', level: 'yes' }, { label: 'Food & drink', level: 'some' }, { label: 'Licensed guides', level: 'yes' }, { label: 'Wheelchair access', level: 'some' }],
    accessNote: 'Mostly graded roads, and several viewpoints reachable by vehicle.',
    tips: ['Flamingo numbers vary; ask a ranger before you plan around them.', 'Combine with Hell’s Gate and Lake Naivasha on a Rift Valley loop.', 'Binoculars help with birds.'],
    official: [{ label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }, { label: 'UNESCO World Heritage', url: 'https://whc.unesco.org/en/list/1060' }],
  },
  {
    slug: 'mount-kenya', name: 'Mount Kenya', shortName: 'MT KENYA', region: 'highlands',
    categories: ['mountains', 'adventure'], lon: 37.31, lat: -0.15, popularity: 85, duration: '3–5 days',
    tagline: 'Glaciers on the equator, and Africa’s second-highest peak.',
    summary: 'An extinct volcano with jagged peaks, glacial tarns and giant alpine plants, rising to 5,199 m.',
    overview: [
      'Mount Kenya’s main summit, Batian, reaches 5,199 m. Its glaciers sit almost exactly on the equator. The mountain is a UNESCO World Heritage Site, and the forests on its lower slopes are home to elephants and buffalo.',
      'Most trekkers aim for Point Lenana (4,985 m), a non-technical trekking peak. Batian and Nelion are technical climbs for experienced mountaineers.'],
    highlights: ['Point Lenana at sunrise', 'Three main routes: Sirimon, Naro Moru and Chogoria', 'Giant groundsel, lobelias and glacial tarns'],
    thingsToDo: [
      { title: 'Trek to Point Lenana', text: 'Usually 3–5 days; start the final climb in the dark to reach the summit at sunrise.' },
      { title: 'Chogoria route', text: 'Walk past Lake Ellis and the Gorges Valley, one of the most scenic routes.' },
      { title: 'Forest walks', text: 'Take guided walks on the lower slopes for birds and monkeys.' },
      { title: 'Stay on the slopes', text: 'Choose a lodge near Nanyuki for views without the full climb.' }],
    months: [2, 2, 1, 0, 0, 1, 1, 2, 2, 1, 0, 1],
    bestNote: 'January–February and August–September are the drier windows.',
    hours: 'Park gates generally open about 06:00–18:00; summit attempts begin well before dawn.',
    fees: [{ label: 'Non-resident adult', value: 'About US$50–60 per day, plus climbing and hut fees' }, { label: 'Guide & porter', value: 'Required or strongly advised; booked through operators' }, { label: 'Kenyan citizen / resident', value: 'Lower local rate' }],
    feesNote: 'Fees depend on route and days. Confirm with KWS or your operator.',
    gettingThere: [
      { mode: 'By road', text: 'Sirimon gate is about 200 km north of Nairobi, 3–4 hours via Nyeri and Naro Moru or via Nanyuki.' },
      { mode: 'By air', text: 'Nanyuki airstrip has scheduled flights from Nairobi Wilson Airport, about 40 minutes.' }],
    facilities: [{ label: 'Lodges & camps', level: 'yes' }, { label: 'Mountain huts', level: 'yes' }, { label: 'Licensed guides', level: 'yes' }, { label: 'Restrooms', level: 'some' }, { label: 'Wheelchair access', level: 'no' }],
    accessNote: 'Trekking requires good fitness and acclimatisation; altitude sickness can affect anyone above about 3,000 m.',
    tips: ['Add a rest day to acclimatise before the summit push.', 'Pack for cold, wet weather even in the dry season.', 'Hire an accredited guide and porters; it’s required on most routes.'],
    official: [{ label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }, { label: 'UNESCO World Heritage', url: 'https://whc.unesco.org/en/list/800' }],
  },
  {
    slug: 'hells-gate', name: 'Hell’s Gate National Park', shortName: 'HELL’S GATE', region: 'rift',
    categories: ['adventure', 'wildlife'], lon: 36.31, lat: -0.90, popularity: 74, duration: 'Day trip',
    tagline: 'Cycle and walk among cliffs, geysers and zebras.',
    summary: 'One of the few Kenyan parks where you can cycle and hike among wildlife, beneath red cliffs and rock towers.',
    overview: [
      'Hell’s Gate is small but dramatic: red volcanic cliffs, the free-standing Fischer’s Tower, steam vents and a narrow gorge you can walk through. The landscape is often said to have inspired scenes in a certain animated lion film.',
      'There are no big predators, so visitors are allowed to cycle and walk. Zebras, giraffes, buffalo and baboons are common along the paths.'],
    highlights: ['Cycling among zebra and giraffe', 'Hell’s Gate Gorge walk', 'Fischer’s Tower and Central Tower'],
    thingsToDo: [
      { title: 'Cycle the main track', text: 'Hire a bike at the gate and ride the loop past cliffs and herds.' },
      { title: 'Walk the gorge', text: 'Go with a guide through narrow rock walls and hot springs.' },
      { title: 'Rock climbing', text: 'Try routes around Fischer’s Tower with a qualified guide.' },
      { title: 'Olkaria geothermal area', text: 'Look at the steam vents at the park’s southern end.' }],
    months: [2, 2, 1, 0, 0, 2, 2, 2, 2, 1, 0, 2],
    bestNote: 'Dry months, December to March and June to October. Avoid the gorge in heavy rain; flash floods can happen.',
    hours: 'Open daily, about 06:00–18:00.',
    fees: [{ label: 'Non-resident adult', value: 'About US$25–30 per day' }, { label: 'Bike hire', value: 'Small hourly or daily fee at the gate' }, { label: 'Gorge guide', value: 'Guide fee, agreed at the gate' }, { label: 'Kenyan citizen / resident', value: 'Lower local rate' }],
    feesNote: 'Confirm with KWS before you go.',
    gettingThere: [
      { mode: 'By road', text: 'About 90 km from Nairobi, around 2 hours via Naivasha. Elsa Gate and Olkaria Gate are the usual entrances.' },
      { mode: 'By train', text: 'The Nairobi–Naivasha SGR link shortens the trip; arrange onward transport.' }],
    facilities: [{ label: 'Restrooms', level: 'some' }, { label: 'Food & drink', level: 'some' }, { label: 'Licensed guides', level: 'yes' }, { label: 'Parking', level: 'yes' }, { label: 'Wheelchair access', level: 'no' }],
    accessNote: 'Steep and uneven in the gorge. The main track is flat enough for most cyclists.',
    tips: ['Start early and carry water; there’s little shade.', 'Hire a guide for the gorge, and never enter it if rain is forecast.', 'Add a stop at Lake Naivasha for a boat ride.'],
    official: [{ label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }, { label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }],
  },
  {
    slug: 'diani-beach', name: 'Diani Beach', shortName: 'DIANI', region: 'coast',
    categories: ['beaches', 'adventure'], lon: 39.58, lat: -4.30, popularity: 90, duration: '3–7 days',
    tagline: 'Seventeen kilometres of white sand and warm turquoise water.',
    summary: 'Powdery sand, palms and a reef a short boat ride away, south of Mombasa.',
    overview: [
      'Diani is a long, gently curving beach in Kwale County with coral-fringed shallows and a lively resort strip. Troops of colobus monkeys live in the coastal forest behind the sand.',
      'Boats leave for Kisite-Mpunguti Marine Park near Shimoni, where dolphins and snorkelling are the highlights. Kitesurfing is popular on the windier months.'],
    highlights: ['Wide, white sand beach', 'Dolphins and snorkelling at Kisite-Mpunguti', 'Colobus monkeys in the coastal forest'],
    thingsToDo: [
      { title: 'Dolphin and snorkel trip', text: 'Head out by boat from Shimoni to the marine park for snorkelling.' },
      { title: 'Kitesurfing', text: 'Take a lesson in the shallow lagoon in the windy seasons.' },
      { title: 'Colobus Trust', text: 'Look for the Angolan colobus monkeys in the forest and along the beach road.' },
      { title: 'Shimba Hills', text: 'Take a day trip to see sable antelope and the forest.' },
      { title: 'Sunset dhow', text: 'Go out on a traditional sailing boat for the last hour of light.' }],
    months: [2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 1, 2],
    bestNote: 'December to March, and July to October, are drier with calmer seas. April–May are the long rains.',
    hours: 'Beach is open public space; marine park trips usually run from early morning.',
    fees: [{ label: 'Public beach', value: 'Free' }, { label: 'Kisite-Mpunguti trip', value: 'Boat tour plus marine park fee; about US$80–120 per person' }, { label: 'Kenyan citizen / resident', value: 'Lower local rate' }],
    feesNote: 'Tour prices vary by operator. Confirm what the price includes.',
    gettingThere: [
      { mode: 'By air', text: 'Ukunda airstrip (UKA) has flights from Nairobi; Moi International in Mombasa is about 40 km away.' },
      { mode: 'By road', text: 'From Mombasa, take the Likoni ferry then drive 30 km south, about 1–1.5 hours.' },
      { mode: 'By train', text: 'Take the SGR to Mombasa, then a taxi or shuttle south.' }],
    facilities: [{ label: 'Hotels & villas', level: 'yes' }, { label: 'Restrooms', level: 'yes' }, { label: 'Food & drink', level: 'yes' }, { label: 'Water sports', level: 'yes' }, { label: 'Wheelchair access', level: 'some' }],
    accessNote: 'Many resorts have beach access ramps; the beach itself is soft sand.',
    tips: ['Tide times affect swimming; check them each day.', 'Use reef-safe sunscreen and never stand on coral.', 'Buy souvenirs from licensed beach traders.'],
    official: [{ label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }, { label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }],
  },
  {
    slug: 'watamu', name: 'Watamu Marine National Park', shortName: 'WATAMU', region: 'coast',
    categories: ['beaches', 'wildlife'], lon: 40.02, lat: -3.35, popularity: 72, duration: '2–5 days',
    tagline: 'Coral gardens, sea turtles and quiet coves.',
    summary: 'A protected reef and a turtle-friendly coast, with ancient Swahili ruins in the forest nearby.',
    overview: [
      'Watamu’s protected marine park holds coral gardens, tidal pools and sandy coves. Turtles nest on the beaches, and local groups rescue and release injured turtles.',
      'Inland, Gede Ruins preserve a 12th–17th century Swahili town in a forest, and Arabuko-Sokoke Forest shelters rare birds and the golden-rumped elephant shrew.'],
    highlights: ['Snorkelling and diving in the marine park', 'Turtle conservation projects', 'Gede Ruins and Arabuko-Sokoke Forest'],
    thingsToDo: [
      { title: 'Snorkel the reef', text: 'Take a glass-bottom or outrigger boat at low tide to the coral gardens.' },
      { title: 'Turtle conservation visit', text: 'Learn about local turtle rescue and release.' },
      { title: 'Gede Ruins', text: 'Walk among the stone houses and mosque of an abandoned Swahili town.' },
      { title: 'Mida Creek', text: 'Paddle or walk the mangrove boardwalk and watch the waders.' }],
    months: [2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 2],
    bestNote: 'October to March has the calmest, clearest water. May to July can be rough.',
    hours: 'Marine park trips typically depart in the morning, timed to the tide.',
    fees: [{ label: 'Marine park entry', value: 'About US$15–20 per adult (non-resident)' }, { label: 'Boat trip', value: 'Agreed with boat operators at the beach' }, { label: 'Gede Ruins', value: 'Small entry fee' }],
    feesNote: 'Confirm marine park fees with KWS and boat prices with registered operators.',
    gettingThere: [
      { mode: 'By air', text: 'Malindi airport is about 25 km away, with flights from Nairobi and Mombasa.' },
      { mode: 'By road', text: 'About 105 km north of Mombasa, 2 hours by road.' }],
    facilities: [{ label: 'Hotels & villas', level: 'yes' }, { label: 'Restrooms', level: 'some' }, { label: 'Food & drink', level: 'yes' }, { label: 'Dive centres', level: 'yes' }, { label: 'Wheelchair access', level: 'some' }],
    accessNote: 'Boat boarding is from the beach, so some visitors may need help.',
    tips: ['Keep your distance from nesting turtles and never use flash.', 'Book snorkelling around low tide.', 'Wear a rash vest to avoid sunburn.'],
    official: [{ label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }, { label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }],
  },
  {
    slug: 'lamu', name: 'Lamu Old Town', shortName: 'LAMU', region: 'coast',
    categories: ['culture', 'beaches'], lon: 40.90, lat: -2.27, popularity: 84, duration: '3–5 days',
    tagline: 'A car-free Swahili stone town, moved by donkey and dhow.',
    summary: 'Kenya’s oldest living Swahili settlement: carved doors, narrow lanes and dhows at the waterfront.',
    overview: [
      'Lamu is the oldest continuously inhabited Swahili settlement in Kenya and a UNESCO World Heritage Site. Coral-stone houses, carved wooden doors and rooftop terraces line lanes too narrow for cars.',
      'Donkeys carry loads, dhows carry people and the pace is deliberately slow. Shela, a short walk or boat ride away, has a broad dune-backed beach.'],
    highlights: ['UNESCO-listed stone town', 'Dhow sailing at sunset', 'Maulidi and other cultural festivals'],
    thingsToDo: [
      { title: 'Walk the old town', text: 'Wander the lanes and look for carved doors and rooftop mosques.' },
      { title: 'Lamu Fort and Museum', text: 'Visit the 19th-century fort and the museum on the waterfront.' },
      { title: 'Dhow sunset sail', text: 'Sail on a traditional boat past mangroves and Manda Island.' },
      { title: 'Shela beach', text: 'Walk or take a boat to the dunes and beach at Shela.' }],
    months: [2, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 2],
    bestNote: 'December to March is hot and dry. Festival dates, such as Maulidi, follow the Islamic calendar.',
    hours: 'Town is open at all times; museums typically open about 08:00–18:00.',
    fees: [{ label: 'Walking the town', value: 'Free' }, { label: 'Lamu Fort / Museum', value: 'Small entry fee' }, { label: 'Dhow trip', value: 'Agreed with the captain; varies' }],
    feesNote: 'Ask your hotel to arrange boats with registered captains.',
    gettingThere: [
      { mode: 'By air', text: 'Manda Island airstrip has daily flights from Nairobi, about 1 hour 30 minutes, then a short boat ride.' },
      { mode: 'By road & boat', text: 'Drive to Mokowe jetty and take the boat across; check the latest security advice for this route.' }],
    facilities: [{ label: 'Guesthouses & hotels', level: 'yes' }, { label: 'Restrooms', level: 'some' }, { label: 'Food & drink', level: 'yes' }, { label: 'Licensed guides', level: 'yes' }, { label: 'Wheelchair access', level: 'no' }],
    accessNote: 'Narrow lanes, steps and uneven stone make the town hard for wheelchairs; donkeys and porters help with luggage.',
    tips: ['Dress modestly in town and ask before photographing people.', 'Check current travel advice for Lamu County before booking.', 'Carry small cash; cards are less common.'],
    official: [{ label: 'UNESCO World Heritage', url: 'https://whc.unesco.org/en/list/1055' }, { label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }],
  },
  {
    slug: 'fort-jesus', name: 'Fort Jesus, Mombasa', shortName: 'FORT JESUS', region: 'coast',
    categories: ['culture'], lon: 39.68, lat: -4.06, popularity: 66, duration: 'Half day',
    tagline: 'A 16th-century Portuguese fort above the harbour.',
    summary: 'A UNESCO-listed coral-stone fort built by the Portuguese in the 1590s, with a museum inside.',
    overview: [
      'Built between 1593 and 1596, Fort Jesus controlled the sea lanes into Mombasa. It changed hands many times over the centuries, and its walls show Portuguese, Omani and British layers.',
      'The fort is now a museum of Swahili coast history, listed by UNESCO in 2011. In the evening there’s a sound-and-light show in the courtyard.'],
    highlights: ['UNESCO World Heritage fort', 'Museum of Swahili coastal history', 'Old Town Mombasa right outside the gate'],
    thingsToDo: [
      { title: 'Walk the ramparts', text: 'Go along the walls for views over Old Port and the Indian Ocean.' },
      { title: 'Museum galleries', text: 'See pottery, cannon and artefacts from shipwrecks and trade.' },
      { title: 'Old Town stroll', text: 'Walk the lanes nearby for carved doors, spice shops and cafés.' },
      { title: 'Evening show', text: 'Ask about the sound-and-light programme.' }],
    months: [2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 1, 2],
    bestNote: 'Open and enjoyable all year. Visit in the morning to avoid the heat.',
    hours: 'Typically daily, about 08:00–18:00.',
    fees: [{ label: 'Citizen', value: 'Low entry fee, a few hundred Kenyan shillings' }, { label: 'Non-resident adult', value: 'About KES 1,000–1,200' }, { label: 'Guide', value: 'Optional, paid on site' }],
    feesNote: 'Run by National Museums of Kenya. Confirm current prices.',
    gettingThere: [
      { mode: 'By road', text: 'In Old Town Mombasa, about 10 minutes from the Likoni ferry and 20–30 minutes from Moi International Airport.' },
      { mode: 'By train', text: 'Take the SGR to Mombasa Terminus, then a taxi into Old Town.' }],
    facilities: [{ label: 'Museum', level: 'yes' }, { label: 'Restrooms', level: 'yes' }, { label: 'Café nearby', level: 'yes' }, { label: 'Guides', level: 'yes' }, { label: 'Wheelchair access', level: 'some' }],
    accessNote: 'Ramparts involve steps and uneven stone; the courtyard and some galleries are level.',
    tips: ['Allow 2 hours, plus time for Old Town.', 'Wear a hat and comfortable shoes.', 'Combine with a dhow ride at sunset.'],
    official: [{ label: 'National Museums of Kenya', url: 'https://www.museums.or.ke/' }, { label: 'UNESCO World Heritage', url: 'https://whc.unesco.org/en/list/1295' }],
  },
  {
    slug: 'mount-longonot', name: 'Mount Longonot', shortName: 'LONGONOT', region: 'rift',
    categories: ['mountains', 'adventure'], lon: 36.45, lat: -0.92, popularity: 62, duration: 'Day trip',
    tagline: 'A volcano you can walk right around the rim of.',
    summary: 'A dormant stratovolcano with a steep climb and a rim trail above a forested crater.',
    overview: [
      'Mount Longonot rises to about 2,776 m above sea level and is a popular day hike from Nairobi. The trail climbs steeply to the rim, then circles the crater edge.',
      'Inside, a forested crater floor holds a few steam vents. From the rim you look across the Rift Valley to Lake Naivasha.'],
    highlights: ['Rim loop with views of the crater and the Rift Valley', 'An accessible day hike from Nairobi', 'Buffalo, zebra and giraffe on the lower slopes'],
    thingsToDo: [
      { title: 'Climb to the rim', text: 'Take the steep trail from the gate; allow about 1–2 hours up.' },
      { title: 'Circle the crater', text: 'Follow the rim loop, around 7 km, with views in every direction.' },
      { title: 'Sunrise start', text: 'Start early to avoid heat and catch clear views.' },
      { title: 'Lake Naivasha', text: 'Combine with a boat ride on the lake afterwards.' }],
    months: [2, 2, 1, 0, 0, 1, 2, 2, 2, 1, 0, 1],
    bestNote: 'Dry months, January–February and June–September. The trail is slippery after rain.',
    hours: 'Open daily, about 06:00–18:00; start by early morning.',
    fees: [{ label: 'Non-resident adult', value: 'About US$25–30 per day' }, { label: 'Ranger escort', value: 'Recommended; arranged at the gate' }, { label: 'Kenyan citizen / resident', value: 'Lower local rate' }],
    feesNote: 'Confirm with KWS before you go.',
    gettingThere: [
      { mode: 'By road', text: 'About 90 km from Nairobi, around 1.5–2 hours via the Nairobi–Naivasha road and the Longonot turn-off.' },
      { mode: 'By train', text: 'The SGR Longonot stop is close to the gate; arrange a ride for the last stretch.' }],
    facilities: [{ label: 'Restrooms', level: 'some' }, { label: 'Parking', level: 'yes' }, { label: 'Ranger guides', level: 'yes' }, { label: 'Food & drink', level: 'no' }, { label: 'Wheelchair access', level: 'no' }],
    accessNote: 'A steep, loose trail with exposure at the rim; it isn’t suitable for those with limited mobility.',
    tips: ['Bring at least 2 litres of water; there is none on the trail.', 'Wear sturdy shoes and sun protection.', 'Take a ranger on the rim loop.'],
    official: [{ label: 'Kenya Wildlife Service', url: 'https://www.kws.go.ke/' }, { label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }],
  },
  {
    slug: 'lake-turkana', name: 'Lake Turkana', shortName: 'TURKANA', region: 'north',
    categories: ['adventure', 'culture'], lon: 36.72, lat: 2.75, popularity: 58, duration: '5–8 days',
    tagline: 'The Jade Sea, at the edge of the map.',
    summary: 'The world’s largest permanent desert lake: volcanic islands, ancient fossils and living cultures.',
    overview: [
      'Lake Turkana is a vast alkaline lake in Kenya’s far north, often called the Jade Sea for its colour. Its shores are among the hottest and windiest places in the country.',
      'Sibiloi National Park, on the eastern shore, is a UNESCO site of major fossil discoveries, and communities including the Turkana and El Molo maintain traditions around the lake.'],
    highlights: ['Jade-green waters and volcanic Central Island', 'Sibiloi’s early-human fossil sites', 'Turkana and El Molo cultures'],
    thingsToDo: [
      { title: 'Loiyangalani', text: 'Use this oasis town as a base for exploring the south-east shore.' },
      { title: 'Central Island', text: 'Visit the volcanic island and its crater lakes by boat, weather permitting.' },
      { title: 'Sibiloi National Park', text: 'Explore Koobi Fora and the fossil sites with a ranger.' },
      { title: 'Cultural visits', text: 'Meet local communities, with a guide who can arrange it respectfully.' }],
    months: [2, 2, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2],
    bestNote: 'December to February is the least harsh. Winds are strong from June to September.',
    hours: 'No fixed hours; park gates generally operate by daylight.',
    fees: [{ label: 'Sibiloi National Park', value: 'Park entry; roughly US$20–30 (non-resident)' }, { label: 'Community fees', value: 'Charged for villages and campsites' }, { label: 'Boat hire', value: 'Negotiated locally' }],
    feesNote: 'Services are limited. Arrange fees and logistics through an experienced operator.',
    gettingThere: [
      { mode: 'By road', text: 'A remote, long drive from Nairobi via Maralal or Marsabit; a 4×4 and a local guide are essential.' },
      { mode: 'By air', text: 'Scheduled flights serve Lodwar; charters reach Loiyangalani and Sibiloi.' }],
    facilities: [{ label: 'Lodges & camps', level: 'some' }, { label: 'Restrooms', level: 'some' }, { label: 'Food & drink', level: 'some' }, { label: 'Licensed guides', level: 'some' }, { label: 'Wheelchair access', level: 'no' }],
    accessNote: 'Remote, hot and basic; best for self-sufficient travellers or well-supported tours.',
    tips: ['Bring a first-aid kit, water and spare fuel.', 'Check current travel advice for northern routes.', 'Take a local guide; it’s safer and more respectful.'],
    official: [{ label: 'UNESCO World Heritage', url: 'https://whc.unesco.org/en/list/801' }, { label: 'Kenya Tourism Board', url: 'https://www.magicalkenya.com/' }],
  },
];

/* ---------- home-page content ---------- */
KT.heroSlides = ['maasai-mara', 'mount-kenya', 'diani-beach', 'amboseli', 'lamu', 'lake-nakuru'];
KT.featured = ['maasai-mara', 'mount-kenya', 'diani-beach', 'lamu', 'amboseli'];

KT.experiences = [
  { title: 'Float over the Mara at sunrise', place: 'maasai-mara', length: '3 hours', season: 'All year; migration Jul–Oct', tag: 'Wildlife' },
  { title: 'Snorkel with turtles', place: 'watamu', length: 'Half day', season: 'Oct–Mar', tag: 'Beaches' },
  { title: 'Sail a dhow at sunset', place: 'lamu', length: '2–3 hours', season: 'Dec–Mar', tag: 'Culture' },
  { title: 'Summit Point Lenana', place: 'mount-kenya', length: '3–5 days', season: 'Jan–Feb, Aug–Sep', tag: 'Mountains' },
  { title: 'Cycle among zebras', place: 'hells-gate', length: 'Full day', season: 'Dec–Mar, Jun–Oct', tag: 'Adventure' },
  { title: 'Watch elephants under Kilimanjaro', place: 'amboseli', length: 'Full day', season: 'Jun–Oct, Jan–Feb', tag: 'Wildlife' },
];

KT.itineraries = [
  {
    id: 'classic', label: 'Classic safari', length: '6 days', blurb: 'The city, the Rift Valley lakes and the Mara plains in one loop.',
    days: [
      { title: 'Nairobi National Park', text: 'Land, then spend the afternoon with rhinos and giraffes beside the skyline.', place: 'nairobi-national-park' },
      { title: 'Lake Nakuru', text: 'Drive into the Rift Valley for flamingos and rhinos around the lake.', place: 'lake-nakuru' },
      { title: 'Into the Mara', text: 'Cross the escarpment to the Mara and settle in for an evening game drive.', place: 'maasai-mara' },
      { title: 'A full day in the Mara', text: 'Dawn balloon flight, midday rest, afternoon with the big cats.', place: 'maasai-mara' },
      { title: 'Across to Amboseli', text: 'Fly south to see elephants framed by Kilimanjaro.', place: 'amboseli' },
      { title: 'Dawn at Amboseli', text: 'One last early drive while the mountain is clear, then return to Nairobi.', place: 'amboseli' },
    ],
  },
  {
    id: 'coast', label: 'Coast & culture', length: '6 days', blurb: 'Fort walls, white sand and a car-free island town.',
    days: [
      { title: 'Fort Jesus, Mombasa', text: 'Walk the ramparts and the lanes of Old Town.', place: 'fort-jesus' },
      { title: 'Diani Beach', text: 'Cross the Likoni ferry south and spend the afternoon on the sand.', place: 'diani-beach' },
      { title: 'Dolphins and reef', text: 'Take a morning boat trip for dolphins and snorkelling.', place: 'diani-beach' },
      { title: 'Watamu', text: 'Travel north to turtle country and snorkel the marine park.', place: 'watamu' },
      { title: 'Fly to Lamu', text: 'A short flight to a town without cars. Wander the lanes at dusk.', place: 'lamu' },
      { title: 'Dhows and Shela', text: 'Sail at sunset and walk the Shela dunes.', place: 'lamu' },
    ],
  },
  {
    id: 'rift', label: 'Rift & peaks', length: '5 days', blurb: 'Volcano rim, gorge, lake and a glacial mountain.',
    days: [
      { title: 'Mount Longonot', text: 'Climb to the crater rim and walk the loop.', place: 'mount-longonot' },
      { title: 'Hell’s Gate', text: 'Cycle among zebras and walk the gorge.', place: 'hells-gate' },
      { title: 'Lake Nakuru', text: 'Cross to Nakuru for rhinos and the lake’s birdlife.', place: 'lake-nakuru' },
      { title: 'Towards Mount Kenya', text: 'Drive to the Sirimon side and settle in at altitude.', place: 'mount-kenya' },
      { title: 'On the mountain', text: 'Walk the lower slopes through forest and moorland.', place: 'mount-kenya' },
    ],
  },
];

/* Travel notes: short advice from the Discover Kenya team, shown in the Home page slider. */
KT.stories = [
  { quote: 'Book a sunrise game drive in the Mara and stay out through the morning. The big cats are most active at first light, and the plains are quiet before the other vehicles arrive.', name: 'Discover Kenya team', from: 'Maasai Mara' },
  { quote: 'Give Lamu three nights. There are no cars on the island, so the pace slows quickly, and a dhow sail at sunset is worth planning your day around.', name: 'Discover Kenya team', from: 'Lamu' },
  { quote: 'Climb Point Lenana slowly. Add a rest day to acclimatise, start before dawn for the sunrise, and pack more layers than you think you need.', name: 'Discover Kenya team', from: 'Mount Kenya' },
  { quote: 'Walk the gorge at Hell’s Gate with a local guide. Rangers know the paths and the weather, and the cliffs and Fischer’s Tower are the highlights.', name: 'Discover Kenya team', from: 'Hell’s Gate' },
  { quote: 'Visit Amboseli in the dry months and look for Kilimanjaro early in the morning. By midday the cloud usually hides it.', name: 'Discover Kenya team', from: 'Amboseli' },
  { quote: 'Snorkel in Watamu early, when the water is calm and clear. Go with a licensed boat operator and keep a respectful distance from the turtles.', name: 'Discover Kenya team', from: 'Watamu' },
];

/* ---------- lookups ---------- */
KT.bySlug = slug => KT.attractions.find(a => a.slug === slug);
KT.regionName = id => (KT.regions.find(r => r.id === id) || {}).label || id;
KT.categoryName = id => (KT.categories.find(c => c.id === id) || {}).label || id;
KT.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
KT.bestMonthsLabel = a => {
  const best = a.months.map((v, i) => (v === 2 ? KT.MONTHS[i] : null)).filter(Boolean);
  if (!best.length) return 'Year-round';
  // collapse consecutive months into ranges, e.g. "Jan–Feb, Jun–Oct"
  const idx = a.months.map((v, i) => (v === 2 ? i : -1)).filter(i => i >= 0);
  const runs = []; let start = idx[0], prev = idx[0];
  for (let k = 1; k <= idx.length; k++) {
    if (idx[k] !== prev + 1) { runs.push(start === prev ? KT.MONTHS[start] : `${KT.MONTHS[start]}–${KT.MONTHS[prev]}`); start = idx[k]; }
    prev = idx[k];
  }
  return runs.join(', ');
};
KT.distanceKm = (a, b) => {
  const R = 6371, rad = d => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
KT.shortLabel = a => a.name.replace(/\s*National (Park|Reserve)s?$/, '').replace(/ East & West/, '').replace(/, Mombasa$/, '').replace(/ Old Town$/, '').replace(/ Marine$/, '');
