export type Job = {
  id: string
  companyId: string
  company: string
  initials: string
  title: string
  industry: string
  location: string
  type: string
  salary: string
  description: string
  skills: string[]
  education: string
  experience: string
  image: string
  color: string
}

export type Company = {
  id: string
  name: string
  initials: string
  industry: string
  location: string
  description: string
  skills: string[]
  image: string
  color: string
  jobs: string[]
}

const images = {
  production: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=85',
  office: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',
  healthcare: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85',
  nature: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1400&q=85',
  engineering: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=85',
  food: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85',
  laptop: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85',
  culture: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=85',
  town: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=85',
  profile: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85',
}

export const jobs: Job[] = [
  { id: 'j1', companyId: 'c1', company: 'Kongsberg Gruppen', initials: 'KG', title: 'Junior produksjonsingeniør', industry: 'Teknologi', location: 'Notodden sentrum', type: 'Heltid', salary: '540 000–620 000 kr', description: 'Bli med og utvikle presise løsninger som gjør en forskjell. Du får tett oppfølging og rom til å vokse i et sterkt fagmiljø.', skills: ['Teknisk forståelse', 'Nysgjerrig', 'Samarbeid'], education: 'Bachelor', experience: 'Nyutdannet', image: images.production, color: '#183959' },
  { id: 'j2', companyId: 'c2', company: 'Notodden kommune', initials: 'NK', title: 'Kommunikasjonsrådgiver', industry: 'Offentlig', location: 'Notodden rådhus', type: 'Heltid', salary: '510 000–590 000 kr', description: 'Gjør kommunens tjenester og historier synlige. En variert rolle med stor kontaktflate og mulighet til å forme gode innbyggertjenester.', skills: ['Skriving', 'Digital kommunikasjon', 'Initiativ'], education: 'Bachelor', experience: '1–3 år', image: images.office, color: '#317d77' },
  { id: 'j3', companyId: 'c3', company: 'Sykehuset Telemark', initials: 'ST', title: 'Helsefagarbeider', industry: 'Helse', location: 'Notodden', type: 'Turnus', salary: '460 000–520 000 kr', description: 'Skap trygghet og gode pasientopplevelser sammen med et varmt og kompetent team. Vi legger til rette for faglig utvikling.', skills: ['Omsorg', 'Faglig trygghet', 'Teamarbeid'], education: 'Fagbrev', experience: 'Alle nivåer', image: images.healthcare, color: '#cf765c' },
  { id: 'j4', companyId: 'c4', company: 'Hydro Energi', initials: 'HE', title: 'Miljørådgiver', industry: 'Energi', location: 'Heddal', type: 'Heltid', salary: '590 000–720 000 kr', description: 'Bidra til mer bærekraftig vannkraft. Du jobber tett med fagfolk på tvers og får ansvar fra første dag.', skills: ['Miljøfag', 'Analyse', 'Formidling'], education: 'Master', experience: '1–3 år', image: images.nature, color: '#357664' },
  { id: 'j5', companyId: 'c5', company: 'Telemark Teknologipark', initials: 'TT', title: 'Frontendutvikler', industry: 'Teknologi', location: 'Notodden', type: 'Heltid', salary: '560 000–690 000 kr', description: 'Gjør komplekse tjenester enkle å bruke. Her får du utforske moderne webteknologi i et lite, tverrfaglig produktteam.', skills: ['React', 'TypeScript', 'Designsans'], education: 'Bachelor', experience: 'Nyutdannet', image: images.laptop, color: '#a46b45' },
  { id: 'j6', companyId: 'c6', company: 'Brattrein Hotell', initials: 'BH', title: 'Vertskap og arrangementskoordinator', industry: 'Reiseliv', location: 'Brattreins gate', type: 'Heltid', salary: '420 000–490 000 kr', description: 'Skap gode opplevelser for gjester og lokale. En sosial rolle med variasjon, ansvar og utsikt over byen.', skills: ['Service', 'Planlegging', 'Kommunikasjon'], education: 'Videregående', experience: 'Alle nivåer', image: images.food, color: '#ab664b' },
  { id: 'j7', companyId: 'c7', company: 'Tinfos', initials: 'TI', title: 'Elektroingeniør', industry: 'Energi', location: 'Tinfos kulturmiljø', type: 'Heltid', salary: '570 000–680 000 kr', description: 'Arbeid med fornybar energi i historiske omgivelser. Du blir del av et engasjert lag med korte beslutningsveier.', skills: ['Elektro', 'Prosjektering', 'Sikkerhet'], education: 'Bachelor', experience: '1–3 år', image: images.engineering, color: '#bd8d43' },
  { id: 'j8', companyId: 'c2', company: 'Notodden kommune', initials: 'NK', title: 'Barnehagelærer', industry: 'Utdanning', location: 'Heddal', type: 'Heltid', salary: '490 000–560 000 kr', description: 'Gi barn en trygg og nysgjerrig start på livet. Vi tror på lek, nærhet til naturen og faglig frihet.', skills: ['Relasjonsbygger', 'Pedagogikk', 'Kreativ'], education: 'Bachelor', experience: 'Alle nivåer', image: images.nature, color: '#317d77' },
  { id: 'j9', companyId: 'c8', company: 'Bok & Blueshuset', initials: 'BB', title: 'Produsent for kulturarrangement', industry: 'Kultur', location: 'Notodden sentrum', type: 'Heltid', salary: '470 000–560 000 kr', description: 'Få kultur til å skje. Planlegg arrangementer som samler folk, og bli del av et levende kulturliv.', skills: ['Produksjon', 'Kulturinteresse', 'Samarbeid'], education: 'Bachelor', experience: '1–3 år', image: images.culture, color: '#715a85' },
  { id: 'j10', companyId: 'c3', company: 'Sykehuset Telemark', initials: 'ST', title: 'Sykepleier', industry: 'Helse', location: 'Notodden', type: 'Turnus', salary: '510 000–600 000 kr', description: 'Bruk kompetansen din der den betyr mest. Et inkluderende arbeidsmiljø med gode muligheter for videreutdanning.', skills: ['Pasientomsorg', 'Klinisk vurdering', 'Teamarbeid'], education: 'Bachelor', experience: 'Alle nivåer', image: images.healthcare, color: '#cf765c' },
  { id: 'j11', companyId: 'c1', company: 'Kongsberg Gruppen', initials: 'KG', title: 'Prosjektkoordinator', industry: 'Teknologi', location: 'Notodden sentrum', type: 'Heltid', salary: '520 000–610 000 kr', description: 'Hold mennesker og planer på rett kurs i spennende industriprosjekter. Vi gir deg ansvar og støtter utviklingen din.', skills: ['Struktur', 'Kommunikasjon', 'Excel'], education: 'Bachelor', experience: 'Nyutdannet', image: images.production, color: '#183959' },
  { id: 'j12', companyId: 'c6', company: 'Brattrein Hotell', initials: 'BH', title: 'Kokk', industry: 'Reiseliv', location: 'Brattreins gate', type: 'Heltid', salary: '430 000–510 000 kr', description: 'Lag mat med lokale råvarer og gode folk. Vi har plass til både nye ideer og stolte tradisjoner.', skills: ['Matglede', 'Kvalitetsbevisst', 'Lagspiller'], education: 'Fagbrev', experience: 'Alle nivåer', image: images.food, color: '#ab664b' },
]

export const companies: Company[] = [
  { id: 'c1', name: 'Kongsberg Gruppen', initials: 'KG', industry: 'Teknologi og industri', location: 'Notodden sentrum', description: 'Et internasjonalt teknologimiljø med røtter i norsk industri. På Notodden utvikler vi løsninger som beskytter mennesker og skaper en tryggere framtid.', skills: ['Ingeniørfag', 'Produksjon', 'Prosjektledelse'], image: images.production, color: '#183959', jobs: ['Junior produksjonsingeniør', 'Prosjektkoordinator'] },
  { id: 'c2', name: 'Notodden kommune', initials: 'NK', industry: 'Offentlig og utdanning', location: 'Notodden rådhus', description: 'Sammen skaper vi gode lokalsamfunn. Hos oss finner du meningsfulle oppgaver, flinke kolleger og et arbeidsliv tett på menneskene.', skills: ['Kommunikasjon', 'Pedagogikk', 'Samfunnsengasjement'], image: images.office, color: '#317d77', jobs: ['Kommunikasjonsrådgiver', 'Barnehagelærer'] },
  { id: 'c3', name: 'Sykehuset Telemark', initials: 'ST', industry: 'Helse', location: 'Notodden', description: 'Et lokalsykehus med stor betydning. Vi kombinerer høy faglig kvalitet med nærhet til pasienter, kolleger og lokalmiljø.', skills: ['Sykepleie', 'Omsorg', 'Helsefag'], image: images.healthcare, color: '#cf765c', jobs: ['Helsefagarbeider', 'Sykepleier'] },
  { id: 'c4', name: 'Hydro Energi', initials: 'HE', industry: 'Energi og miljø', location: 'Heddal', description: 'Fornybar energi, lokal forankring og store ambisjoner. Vi utvikler vannkraften med respekt for naturen og menneskene rundt oss.', skills: ['Miljø', 'Energi', 'Analyse'], image: images.nature, color: '#357664', jobs: ['Miljørådgiver'] },
  { id: 'c5', name: 'Telemark Teknologipark', initials: 'TT', industry: 'Teknologi', location: 'Notodden', description: 'Et lite og ambisiøst miljø der teknologi, design og gode samarbeid gir digitale tjenester en menneskelig side.', skills: ['Utvikling', 'Design', 'Produkt'], image: images.laptop, color: '#a46b45', jobs: ['Frontendutvikler'] },
  { id: 'c6', name: 'Brattrein Hotell', initials: 'BH', industry: 'Reiseliv og servering', location: 'Brattreins gate', description: 'Historisk hotell med utsikt, varme møter og gode smaker. Vi ønsker oss folk som elsker å gjøre dagen litt bedre for andre.', skills: ['Vertskap', 'Mat', 'Arrangement'], image: images.food, color: '#ab664b', jobs: ['Vertskap og arrangementskoordinator', 'Kokk'] },
  { id: 'c7', name: 'Tinfos', initials: 'TI', industry: 'Energi og kulturarv', location: 'Tinfos kulturmiljø', description: 'Et helt unikt møte mellom industrihistorie og framtidens energiløsninger. Vi tar vare på viktige verdier og bygger nye.', skills: ['Elektro', 'Energi', 'Kulturarv'], image: images.engineering, color: '#bd8d43', jobs: ['Elektroingeniør'] },
  { id: 'c8', name: 'Bok & Blueshuset', initials: 'BB', industry: 'Kultur og opplevelser', location: 'Notodden sentrum', description: 'Et levende møtested for musikk, scenekunst og mennesker. Her blir ideer til opplevelser hele året.', skills: ['Kultur', 'Produksjon', 'Formidling'], image: images.culture, color: '#715a85', jobs: ['Produsent for kulturarrangement'] },
]

export const profileImage = images.profile

export const events = [
  { day: 4, title: 'Karriere- og jobbmesse', category: 'Karriere', place: 'Notodden videregående', time: '10:00' },
  { day: 8, title: 'Nettverkstreff for nye i byen', category: 'Nettverk', place: 'Bok & Blueshuset', time: '18:00' },
  { day: 12, title: 'Bedriftsbesøk: Tinfos', category: 'Karriere', place: 'Tinfos kulturmiljø', time: '14:30' },
  { day: 17, title: 'Blueskveld i sentrum', category: 'Kultur', place: 'Bok & Blueshuset', time: '20:00' },
  { day: 21, title: 'Tur langs Heddalsvatnet', category: 'Fritid', place: 'Notodden brygge', time: '11:00' },
  { day: 26, title: 'Studentkveld: bli kjent', category: 'Student', place: 'Campus Notodden', time: '17:00' },
]

export const lifeSections = [
  { title: 'Bolig og bosetting', description: 'Mer plass, kortere vei og nabolag det er lett å bli kjent i.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85', label: 'Et godt sted å lande' },
  { title: 'Natur og friluftsliv', description: 'Ta kaffekoppen ved vannet eller bruk ettermiddagen i marka.', image: images.nature, label: 'Rett utenfor døra' },
  { title: 'Kultur og opplevelser', description: 'Blues, verdensarv og små scener med store historier.', image: images.culture, label: 'Kultur med særpreg' },
  { title: 'Utdanning', description: 'Lær noe nytt og bygg kompetansen din i et nært fagmiljø.', image: images.office, label: 'Plass til å vokse' },
  { title: 'Lokale bedrifter', description: 'Bli kjent med arbeidsplasser som bygger framtida her.', image: images.production, label: 'Muligheter lokalt' },
  { title: 'Fritid og sosiale aktiviteter', description: 'Finn folk, aktiviteter og nye favorittsteder i byen.', image: images.town, label: 'En by å være med i' },
]