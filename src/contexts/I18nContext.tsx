import React, { createContext, useContext, useState, useEffect } from 'react';

// Language definitions
const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  xh: { name: 'isiXhosa', flag: '🇿🇦' },
  zu: { name: 'isiZulu', flag: '🇿🇦' },
  af: { name: 'Afrikaans', flag: '🇿🇦' },
  st: { name: 'Sesotho', flag: '🇿🇦' },
  tn: { name: 'Setswana', flag: '🇿🇦' },
  ss: { name: 'siSwati', flag: '🇿🇦' },
  ve: { name: 'Tshivenda', flag: '🇿🇦' },
  ts: { name: 'Xitsonga', flag: '🇿🇦' },
  nr: { name: 'isiNdebele', flag: '🇿🇦' },
  nso: { name: 'Sepedi', flag: '🇿🇦' }
};

// Translation context
interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, fallback?: string) => string;
  languages: typeof languages;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation data (simplified structure)
const translations: Record<string, Record<string, any>> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      close: 'Close',
      open: 'Open',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      logout: 'Logout',
      welcome: 'Welcome'
    },
    navigation: {
      home: 'Home',
      about: 'About Us',
      journey: 'Our Journey',
      training: 'Training Academy',
      kidsZone: 'Kids Zone',
      ecosystem: 'Ecosystem',
      library: 'MNI Library (Secure)',
      contact: 'Contact',
      intranet: 'MNI Intranet'
    },
    intranet: {
      title: 'MNI Intranet',
      subtitle: 'Family holding governance for Salatiso ecosystem assets',
      dashboard: 'Dashboard',
      projects: 'Projects',
      family: 'Family',
      business_plan: 'Business Plan',
      career: 'Career Paths',
      ecosystem: 'Ecosystem Apps',
      learning: 'Learning',
      timeline: 'Timeline',
      lifecv: 'LifeCV',
      simple_dashboard: 'Simple Dashboard',
      login_with_google: 'Continue with Google',
      enter_password: 'Enter your password',
      sign_in: 'Sign In',
      access_denied: 'Access denied. Please contact an administrator.',
      loading: 'Loading...'
    },
    ecosystem: {
      title: 'Salatiso Ecosystem',
      subtitle: 'Integrated ventures aligned to the Family Value system and Ubuntu governance model.',
      mission: 'All ventures share a central mission: protect and grow family prosperity while transforming the communities we serve. Each product is built with shared components to accelerate time-to-impact.',
      productLead: 'Product Lead',
      impactSnapshot: 'Impact Snapshot',
      operatingPillars: 'Operating Pillars',
      nextFocus: 'Next 12-Month Focus',
      collaborationRequests: 'Collaboration Requests',
      collaborationDescription: 'Teams can submit collaboration ideas, integration requirements, or resource requests using the Family Planning Board. Each request is reviewed weekly by the Ecosystem Steering Committee.'
    },
    homepage: {
      hero_title: 'Building a Family Legacy Through',
      hero_subtitle: 'Technology & Ubuntu',
      hero_description: 'Mlandeli Notemba Investments is the family holding company behind the Salatiso ecosystem — consolidating every intellectual property, training asset, and business venture including Sazi Life Academy, Homestead OS, LifeKey, and pending patents.',
      hero_subtext: 'What began as Salatiso.com\'s books and articles now lives as a family intranet, learning academy, and partner-ready platform that brings the individual story back home under MNI stewardship.',
      explore_ecosystem: 'Explore Our Ecosystem',
      our_journey: 'Our Journey',
      kids_zone: 'Kids Zone',
      ubuntu_values: 'Ubuntu Values',
      ubuntu_description: 'Our foundation is built on Ubuntu philosophy - the belief that our humanity is interconnected and that we achieve our full potential through community and mutual support.',
      family_first: 'Family First Approach',
      family_description: 'Every decision, product, and partnership prioritizes family prosperity and multi-generational legacy building.',
      innovation_driven: 'Innovation Driven',
      innovation_description: 'We leverage cutting-edge technology to solve real problems for families and communities across South Africa.',
      impact_focused: 'Impact Focused',
      impact_description: 'Our ventures are designed to create measurable positive change in education, economic empowerment, and community development.'
    }
  },
  xh: {
    common: {
      loading: 'Iyalayisha...',
      error: 'Impazamo',
      success: 'Impumelelo',
      save: 'Gcina',
      cancel: 'Rhoxisa',
      delete: 'Cima',
      edit: 'Hlela',
      add: 'Yongeza',
      search: 'Khangela',
      filter: 'Hlula',
      close: 'Vala',
      open: 'Vula',
      back: 'Buyela',
      next: 'Okulandelayo',
      previous: 'Okwangaphambili',
      home: 'Ikhaya',
      about: 'Ngathi',
      contact: 'Qhagamshelana',
      login: 'Ngena',
      logout: 'Phuma',
      welcome: 'Wamkelekile'
    },
    navigation: {
      home: 'Ikhaya',
      about: 'Ngathi',
      journey: 'Uhambo Lwethu',
      training: 'IAkademi yoQeqesho',
      kidsZone: 'Indawo Yabantwana',
      ecosystem: 'I-Ecosystem',
      library: 'Ithala leencwadi le-MNI (Likhethekileyo)',
      contact: 'Qhagamshelana',
      intranet: 'I-MNI Intranet'
    },
    intranet: {
      title: 'I-MNI Intranet',
      subtitle: 'Ulawulo losapho oluphethe iiasethi zeSalatiso',
      dashboard: 'Idashboard',
      projects: 'Iiprojekthi',
      family: 'Usapho',
      business_plan: 'Isicwangciso Seshishini',
      career: 'Iindlela Zomsebenzi',
      ecosystem: 'Ii-Ecosystem Apps',
      learning: 'Ukufunda',
      timeline: 'Ixesha',
      lifecv: 'I-LifeCV',
      simple_dashboard: 'Idashboard Elula',
      login_with_google: 'Qhubeka nge-Google',
      enter_password: 'Ngenisa ipasiwedi yakho',
      sign_in: 'Ngena',
      access_denied: 'Akuvumelekanga ukungena. Nceda uqhagamshelane nomphathi.',
      loading: 'Iyalayisha...'
    },
    ecosystem: {
      title: 'I-Salatiso Ecosystem',
      subtitle: 'Amashishini adityanisiweyo anxamene nenkqubo yamaXabiso oSapho kunye nenqubo ye-Ubuntu.',
      mission: 'Onke amashishini abelana ngenjongo ephambili: ukukhusela nokukhulisa impumelelo yosapho ngelixa siguqula uluntu esilusebenzayo. Yonke imveliso yakhelwe ngamacandelo abelanayo ukukhawulezisa ixesha lempembelelo.',
      productLead: 'Umntu okhokelayo kwiMveliso',
      impactSnapshot: 'Umfanekiso weMpembelelo',
      operatingPillars: 'Iintsika Zokusebenza',
      nextFocus: 'Ugxininiso Lweenyanga ezi-12 Ezilandelayo',
      collaborationRequests: 'Izicelo Zentsebenziswano',
      collaborationDescription: 'Amaqela angathumela izimvo zentsebenziswano, iimfuno zomanyano, okanye izicelo zezixhobo sebenzisa iBhodi yoCwangciso loSapho. Isicelo ngasinye siphononongwa veki le ngamaLungu eBhodi yoLawulo lwe-Ecosystem.'
    }
  },
  zu: {
    common: {
      loading: 'Iyalayisha...',
      error: 'Iphutha',
      success: 'Impumelelo',
      save: 'Londoloza',
      cancel: 'Khansela',
      delete: 'Susa',
      edit: 'Hlela',
      add: 'Engeza',
      search: 'Sesha',
      filter: 'Hlushela',
      close: 'Vala',
      open: 'Vula',
      back: 'Emuva',
      next: 'Okulandelayo',
      previous: 'Okwangaphambili',
      home: 'Ikhaya',
      about: 'Ngathi',
      contact: 'Thintana',
      login: 'Ngena',
      logout: 'Phuma',
      welcome: 'Siyakwamukela'
    },
    navigation: {
      home: 'Ikhaya',
      about: 'Ngathi',
      journey: 'Uhambo Lwethu',
      training: 'I-Akademi yoQeqesho',
      kidsZone: 'Indawo Yezingane',
      ecosystem: 'I-Ecosystem',
      library: 'Umtapo Wezincwadi we-MNI (Okuvikelekile)',
      contact: 'Thintana',
      intranet: 'I-MNI Intranet'
    },
    intranet: {
      title: 'I-MNI Intranet',
      subtitle: 'Ukuphathwa komndeni ophethe izimpahla zeSalatiso',
      dashboard: 'Idashboard',
      projects: 'Amaphrojekthi',
      family: 'Umndeni',
      business_plan: 'Uhlelo Lwebhizinisi',
      career: 'Izindlela Zemisebenzi',
      ecosystem: 'Izinhlelo Zokusebenza Ze-Ecosystem',
      learning: 'Ukufunda',
      timeline: 'Isikhathi',
      lifecv: 'I-LifeCV',
      simple_dashboard: 'Idashboard Elula',
      login_with_google: 'Qhubeka nge-Google',
      enter_password: 'Faka iphasiwedi yakho',
      sign_in: 'Ngena',
      access_denied: 'Akuvunyelwe ukungena. Sicela uxhumane nomphathi.',
      loading: 'Iyalayisha...'
    },
    ecosystem: {
      title: 'I-Salatiso Ecosystem',
      subtitle: 'Amabhizinisi ahlanganisiwe ahambisana nohlelo Lwamanani omndeni kanye nenqubo ye-Ubuntu.',
      mission: 'Wonke amabhizinisi abelana ngenjongo eyodwa: ukuvikela nokukhulisa impumelelo yomndeni kuyilapho siguqula imiphakathi esisebenza kuyo. Umkhiqizo ngamunye wakhiwe ngezingxenye ezabelwana ukusheshisa isikhathi sempembelelo.',
      productLead: 'Umholi Womkhiqizo',
      impactSnapshot: 'Isithombe Sempembelelo',
      operatingPillars: 'Izinsika Zokusebenza',
      nextFocus: 'Ukugxila Kwezinyanga ezi-12 Ezilandelayo',
      collaborationRequests: 'Izicelo Zokuhlanganyela',
      collaborationDescription: 'Amathimba angathinta imibono yokuhlanganyela, izidingo zokuhlanganisa, noma izicelo zezinsiza besebenzisa iBhodi Lohlelo Lomndeni. Isicelo ngasinye sibuyekezwa masonto wonke yiKomiti Yohlelo lwe-Ecosystem.'
    }
  },
  af: {
    common: {
      loading: 'Laai...',
      error: 'Fout',
      success: 'Sukses',
      save: 'Stoor',
      cancel: 'Kanselleer',
      delete: 'Verwyder',
      edit: 'Redigeer',
      add: 'Voeg by',
      search: 'Soek',
      filter: 'Filter',
      close: 'Sluit',
      open: 'Maak oop',
      back: 'Terug',
      next: 'Volgende',
      previous: 'Vorige',
      home: 'Tuis',
      about: 'Oor ons',
      contact: 'Kontak',
      login: 'Aanmeld',
      logout: 'Afmeld',
      welcome: 'Welkom'
    },
    navigation: {
      home: 'Tuis',
      about: 'Oor Ons',
      journey: 'Ons Reis',
      training: 'Opleidingsakademie',
      kidsZone: 'Kindersone',
      ecosystem: 'Ekosisteem',
      library: 'MNI Biblioteek (Beveilig)',
      contact: 'Kontak',
      intranet: 'MNI Intranet'
    },
    intranet: {
      title: 'MNI Intranet',
      subtitle: 'Familiehoumaatskappy-bestuur van Salatiso-bates',
      dashboard: 'Paneelbord',
      projects: 'Projekte',
      family: 'Familie',
      business_plan: 'Besigheidsplan',
      career: 'Loopbaanpaaie',
      ecosystem: 'Ekosisteem Apps',
      learning: 'Leer',
      timeline: 'Tydlyn',
      lifecv: 'LifeCV',
      simple_dashboard: 'Eenvoudige Paneelbord',
      login_with_google: 'Gaan voort met Google',
      enter_password: 'Voer jou wagwoord in',
      sign_in: 'Meld aan',
      access_denied: 'Toegang geweier. Kontak asseblief \'n administrateur.',
      loading: 'Laai...'
    },
    ecosystem: {
      title: 'Salatiso Ekosisteem',
      subtitle: 'Geïntegreerde ondernemings wat aangepas is by die Familie Waardestelsel en Ubuntu bestuurmodel.',
      mission: 'Alle ondernemings deel \'n sentrale missie: beskerm en groei familie welvaart terwyl ons die gemeenskappe wat ons bedien transformeer. Elke produk is gebou met gedeelde komponente om tyd-tot-impak te versnel.',
      productLead: 'Produk Leier',
      impactSnapshot: 'Impak Oorsig',
      operatingPillars: 'Bedryfs Pilare',
      nextFocus: 'Volgende 12-Maand Fokus',
      collaborationRequests: 'Samewerkingsversoeke',
      collaborationDescription: 'Spanne kan samewerkingsidees, integrasievereistes, of hulpbronversoeke indien deur die Familie Beplanningsbord te gebruik. Elke versoek word weekliks hersien deur die Ekosisteem Stuurkomitee.'
    }
  },
  st: {
    common: {
      loading: 'E laela...',
      error: 'Phoso',
      success: 'Katleho',
      save: 'Boloka',
      cancel: 'Hlakola',
      delete: 'Hlakola',
      edit: 'Fetola',
      add: 'Kenyelletsa',
      search: 'Batla',
      filter: 'Kgetha',
      close: 'Koala',
      open: 'Bula',
      back: 'Kgutlela',
      next: 'Latelang',
      previous: 'Pele',
      home: 'Hae',
      about: 'Ka rona',
      contact: 'Ikopanye',
      login: 'Kena',
      logout: 'Tswa',
      welcome: 'O amohelehile'
    },
    navigation: {
      home: 'Hae',
      about: 'Ka Rona',
      journey: 'Leeto la Rona',
      training: 'Akademi ya Koetliso',
      kidsZone: 'Sebaka sa Bana',
      ecosystem: 'Ecosystem',
      library: 'Laeborari ya MNI (E sireletsweng)',
      contact: 'Ikopanye',
      intranet: 'MNI Intranet'
    },
    intranet: {
      title: 'MNI Intranet',
      subtitle: 'Puso ya lelapa e okametseng matlotlo a Salatiso',
      dashboard: 'Dashboard',
      projects: 'Merero',
      family: 'Lelapa',
      business_plan: 'Leano la Kgwebo',
      career: 'Ditsela tsa Mosebetsi',
      ecosystem: 'Di-App tsa Ecosystem',
      learning: 'Ho Ithuta',
      timeline: 'Nako',
      lifecv: 'LifeCV',
      simple_dashboard: 'Dashboard e Bonolo',
      login_with_google: 'Tsoela pele ka Google',
      enter_password: 'Kenya password ya hao',
      sign_in: 'Kena',
      access_denied: 'Phihlello e hanotswe. Ka kopo ikopanye le motsamaisi.',
      loading: 'E laela...'
    },
    ecosystem: {
      title: 'Salatiso Ecosystem',
      subtitle: 'Dikgwebo tse kopaneng tse lumellanang le tsamaiso ya Boleng ba Lelapa le mokgwa wa puso wa Ubuntu.',
      mission: 'Dikgwebo tsohle di arolelana morero o le mong: ho sireletsa le ho godisa katleho ya lelapa ha re fetola metse eo re e sebeletsang. Sehlahiswa se seng le se seng se ahilwe ka likarolo tse arolelanoang ho potlakisa nako ya tshusumetso.',
      productLead: 'Moetapele wa Sehlahiswa',
      impactSnapshot: 'Setshwantsho sa Tshusumetso',
      operatingPillars: 'Makgokelo a Ts\'ebetso',
      nextFocus: 'Tsepamiso ya Dikgwedi tse 12 tse Tlang',
      collaborationRequests: 'Dikopo tsa Ts\'ebelisano',
      collaborationDescription: 'Dihlopha di ka romela maikutlo a ts\'ebelisano, ditlhoko tsa kopano, kapa dikopo tsa mehlodi ho sebelisa Board ya Moralo wa Lelapa. Kopo e nngwe le e nngwe e hlahlojwa beke le beke ke Komiti ya Tataiso ya Ecosystem.'
    }
  },
  tn: {
    common: {
      loading: 'Go laela...',
      error: 'Phoso',
      success: 'Katlego',
      save: 'Boloka',
      cancel: 'Khansela',
      delete: 'Phimola',
      edit: 'Baakanya',
      add: 'Oketsa',
      search: 'Batla',
      filter: 'Tlhopha',
      close: 'Tswala',
      open: 'Bula',
      back: 'Boela',
      next: 'Go latelang',
      previous: 'Pele',
      home: 'Gae',
      about: 'Ka rona',
      contact: 'Ikgolagane',
      login: 'Tsena',
      logout: 'Tswa',
      welcome: 'O amogeletswe'
    },
    navigation: {
      home: 'Gae',
      about: 'Ka Rona',
      journey: 'Loeto lwa Rona',
      training: 'Akademi ya Koetliso',
      kidsZone: 'Lefelo la Bana',
      ecosystem: 'Ecosystem',
      library: 'Laeborari ya MNI (E sireleditswe)',
      contact: 'Ikgolagane',
      intranet: 'MNI Intranet'
    },
    intranet: {
      title: 'MNI Intranet',
      subtitle: 'Puso ya lelapa e okametseng dithoto tsa Salatiso',
      dashboard: 'Dashboard',
      projects: 'Diphrojeke',
      family: 'Lelapa',
      business_plan: 'Leano la Kgwebo',
      career: 'Ditsela tsa Tiro',
      ecosystem: 'Di-App tsa Ecosystem',
      learning: 'Go Ithuta',
      timeline: 'Nako',
      lifecv: 'LifeCV',
      simple_dashboard: 'Dashboard e e Bonolo',
      login_with_google: 'Tswelela ka Google',
      enter_password: 'Tsenya password ya gago',
      sign_in: 'Tsena',
      access_denied: 'Phitlhelelo e gannetswe. Ka kopo ikgolagane le motsamaisi.',
      loading: 'Go laela...'
    },
    ecosystem: {
      title: 'Salatiso Ecosystem',
      subtitle: 'Dikgwebo tse di kopantsweng tse di tsamaisanang le tsamaiso ya Boleng jwa Lelapa le mokgwa wa puso wa Ubuntu.',
      mission: 'Dikgwebo tsotlhe di abelana maikaelelo a le mongwe: go sireletsa le go godisa katlego ya lelapa fa re fetola ditšhaba tse re di direlang. Setlhagiswa se seng le se seng se agilwe ka dikarolo tse di abelanang go potlakisa nako ya tshusumetso.',
      productLead: 'Moetapele wa Setlhagiswa',
      impactSnapshot: 'Setshwantsho sa Tshusumetso',
      operatingPillars: 'Mekgokgotheto ya Tiro',
      nextFocus: 'Nepiso ya Dikgwedi tse 12 tse di Tlang',
      collaborationRequests: 'Dikopo tsa Tirisanommogo',
      collaborationDescription: 'Ditlhopha di ka romela dikakanyo tsa tirisanommogo, ditlhokego tsa kopano, goba dikopo tsa dithoto ka go dirisa Board ya Thulaganyo ya Lelapa. Kopo nngwe le nngwe e tlhatlhobiwa beke le beke ke Komiti ya Kaelo ya Ecosystem.'
    }
  },
  ss: {
    common: {
      loading: 'Kulayisha...',
      error: 'Liphoso',
      success: 'Inhlanhla',
      save: 'Gcina',
      cancel: 'Khansela',
      delete: 'Susa',
      edit: 'Hlela',
      add: 'Engeta',
      search: 'Sesha',
      filter: 'Khetha',
      close: 'Vala',
      open: 'Vula',
      back: 'Buyela',
      next: 'Lokulandzelako',
      previous: 'Kwangaphambili',
      home: 'Ekhaya',
      about: 'Ngakithi',
      contact: 'Thintana',
      login: 'Ngena',
      logout: 'Phuma',
      welcome: 'Uyemukelekile'
    },
    navigation: {
      home: 'Ekhaya',
      about: 'Ngakithi',
      journey: 'Luhambo Lwakithi',
      training: 'I-Akademi YeKuqeqesha',
      kidsZone: 'Indzawo YeBantfwana',
      ecosystem: 'I-Ecosystem',
      library: 'Umtapo weMNI (LoVikelekile)',
      contact: 'Thintana',
      intranet: 'I-MNI Intranet'
    },
    intranet: {
      title: 'I-MNI Intranet',
      subtitle: 'Kubusa kwemndeni lokuphatha impahla yeSalatiso',
      dashboard: 'I-Dashboard',
      projects: 'Emaphrojekthi',
      family: 'Umndeni',
      business_plan: 'Luhlelo Lwebhizinisi',
      career: 'Tindlela Temisebenzi',
      ecosystem: 'Tini-App te-Ecosystem',
      learning: 'Kufundza',
      timeline: 'Sikhatsi',
      lifecv: 'I-LifeCV',
      simple_dashboard: 'I-Dashboard Lelula',
      login_with_google: 'Chubeka nge-Google',
      enter_password: 'Faka liphasiwedi lakho',
      sign_in: 'Ngena',
      access_denied: 'Kungene akuvunyelwe. Sicela uthintane nemphathi.',
      loading: 'Kulayisha...'
    }
  },
  ve: {
    common: {
      loading: 'Ri khou laida...',
      error: 'Vhukambi',
      success: 'U wina',
      save: 'Dzhenisa',
      cancel: 'Khansela',
      delete: 'Bvisa',
      edit: 'Lulamisa',
      add: 'Engedza',
      search: 'Toda',
      filter: 'Nanga',
      close: 'Vhala',
      open: 'Bvula',
      back: 'Buyela',
      next: 'Zwo tevhelaho',
      previous: 'Zwa fhamboni',
      home: 'Hayani',
      about: 'Nga hashu',
      contact: 'Kwamana',
      login: 'Pinda',
      logout: 'Buda',
      welcome: 'Ri a ni tanganedza'
    },
    navigation: {
      home: 'Hayani',
      about: 'Nga Hashu',
      journey: 'Lwendo Lwashu',
      training: 'Akademi ya Vhudzidzini',
      kidsZone: 'Vhulongo ha Vhana',
      ecosystem: 'Ecosystem',
      library: 'Laibulare ya MNI (Yo Vhulungwaho)',
      contact: 'Kwamana',
      intranet: 'MNI Intranet'
    },
    intranet: {
      title: 'MNI Intranet',
      subtitle: 'Vhulanguli ha muṱa ho no fhaṱa pfuma dza Salatiso',
      dashboard: 'Dashboard',
      projects: 'Phrojeke',
      family: 'Lushaka',
      business_plan: 'Pulani ya Bindu',
      career: 'Ndila dza Mushumo',
      ecosystem: 'Dziapp dza Ecosystem',
      learning: 'U Guda',
      timeline: 'Tshifhinga',
      lifecv: 'LifeCV',
      simple_dashboard: 'Dashboard yo Takalaho',
      login_with_google: 'Itani mbaho nga Google',
      enter_password: 'Dzhenisani phasiwo yanu',
      sign_in: 'Pindani',
      access_denied: 'A si ni tendeli u pinda. Ri humbela uri ni kwamane na mulanguli.',
      loading: 'Ri khou laida...'
    }
  },
  ts: {
    common: {
      loading: 'Ri layla...',
      error: 'Xihoxo',
      success: 'Ku humelela',
      save: 'Hlayisa',
      cancel: 'Khansela',
      delete: 'Susa',
      edit: 'Lulamisa',
      add: 'Engetela',
      search: 'Lava',
      filter: 'Hlawula',
      close: 'Pfala',
      open: 'Pfula',
      back: 'Buyela',
      next: 'Lexi landzelaka',
      previous: 'Lero nga mungheni',
      home: 'Ekhaya',
      about: 'Hi hina',
      contact: 'Hlanganisa',
      login: 'Nghena',
      logout: 'Huma',
      welcome: 'U amukeriwe'
    },
    navigation: {
      home: 'Ekhaya',
      about: 'Hi Hina',
      journey: 'Riendzo ra Hina',
      training: 'Akademi ya Vundzidzisi',
      kidsZone: 'Ndhawu ya Vana',
      ecosystem: 'Ecosystem',
      library: 'Layiburari ya MNI (Yo Sirhelelekile)',
      contact: 'Hlanganisa',
      intranet: 'MNI Intranet'
    },
    intranet: {
      title: 'MNI Intranet',
      subtitle: 'Vulawuri bya ndyangu lebyi hlayisaka switirhisiwa swa Salatiso',
      dashboard: 'Dashboard',
      projects: 'Tiprojeke',
      family: 'Ndyangu',
      business_plan: 'Pulani ya Bindzu',
      career: 'Tindlela ta Ntirho',
      ecosystem: 'Ti-App ta Ecosystem',
      learning: 'Ku Dyondza',
      timeline: 'Nkarhi',
      lifecv: 'LifeCV',
      simple_dashboard: 'Dashboard yo Olova',
      login_with_google: 'Famba-famba hi Google',
      enter_password: 'Nghenisa phasiwordi ya wena',
      sign_in: 'Nghena',
      access_denied: 'Ku nghena a ku pfumeleriwanga. Hi kombela u hlanganisa na mulawuri.',
      loading: 'Ri layla...'
    }
  },
  nr: {
    common: {
      loading: 'Kuyalayisha...',
      error: 'Iphuthu',
      success: 'Impumelelo',
      save: 'Gcina',
      cancel: 'Rhoxisa',
      delete: 'Susa',
      edit: 'Lungiselela',
      add: 'Engezelela',
      search: 'Funa',
      filter: 'Khetha',
      close: 'Vala',
      open: 'Vula',
      back: 'Buyela',
      next: 'Okulandelako',
      previous: 'Okungaphambili',
      home: 'Ekhaya',
      about: 'Ngathi',
      contact: 'Thintana',
      login: 'Ngena',
      logout: 'Phuma',
      welcome: 'Wamukelekile'
    },
    navigation: {
      home: 'Ekhaya',
      about: 'Ngathi',
      journey: 'Uhambo Wethu',
      training: 'I-Akademi yoQeqesho',
      kidsZone: 'Indawo Yezingane',
      ecosystem: 'I-Ecosystem',
      library: 'Ilayibhrari ye-MNI (Evikelekile)',
      contact: 'Thintana',
      intranet: 'I-MNI Intranet'
    },
    intranet: {
      title: 'I-MNI Intranet',
      subtitle: 'Ukuphathwa komndeni okuphethe impahla yeSalatiso',
      dashboard: 'I-Dashboard',
      projects: 'Amaphrojekthi',
      family: 'Umndeni',
      business_plan: 'Isicwangciso Sebhizinisi',
      career: 'Izindlela Zemisebenzi',
      ecosystem: 'Ama-App e-Ecosystem',
      learning: 'Ukufunda',
      timeline: 'Isikhathi',
      lifecv: 'I-LifeCV',
      simple_dashboard: 'I-Dashboard Elula',
      login_with_google: 'Qhubeka nge-Google',
      enter_password: 'Faka iphasiwedi yakho',
      sign_in: 'Ngena',
      access_denied: 'Ukungena akuvumelekile. Sicela uthintane nomphathi.',
      loading: 'Kuyalayisha...'
    }
  },
  nso: {
    common: {
      loading: 'E a laela...',
      error: 'Phošo',
      success: 'Katlego',
      save: 'Boloka',
      cancel: 'Khanselela',
      delete: 'Phošolla',
      edit: 'Lokiša',
      add: 'Oketša',
      search: 'Nyaka',
      filter: 'Kgetha',
      close: 'Tswalela',
      open: 'Bulela',
      back: 'Boela',
      next: 'Se se latelago',
      previous: 'Se se fetilego',
      home: 'Gae',
      about: 'Ka rena',
      contact: 'Ikgokaganye',
      login: 'Tsena',
      logout: 'Tšwa',
      welcome: 'O amogetšwe'
    },
    navigation: {
      home: 'Gae',
      about: 'Ka Rena',
      journey: 'Leeto la Rena',
      training: 'Akademi ya Thupelo',
      kidsZone: 'Lefelo la Bana',
      ecosystem: 'Ecosystem',
      library: 'Laeborari ya MNI (E sireleditšwego)',
      contact: 'Ikgokaganye',
      intranet: 'MNI Intranet'
    },
    intranet: {
      title: 'MNI Intranet',
      subtitle: 'Taolo ya lapa yeo e bolokago dithoto tša Salatiso',
      dashboard: 'Dashboard',
      projects: 'Diprotšeke',
      family: 'Lapa',
      business_plan: 'Leano la Kgwebo',
      career: 'Ditsela tša Mošomo',
      ecosystem: 'Di-App tša Ecosystem',
      learning: 'Go Ithuta',
      timeline: 'Nako',
      lifecv: 'LifeCV',
      simple_dashboard: 'Dashboard ye e Bonolo',
      login_with_google: 'Tšwela pele ka Google',
      enter_password: 'Tsenya password ya gago',
      sign_in: 'Tsena',
      access_denied: 'Phihlelelo e gantšitšwe. Ka kgopelo ikgokaganye le motsamaisi.',
      loading: 'E a laela...'
    }
  }
};

// Provider component
interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocaleState(savedLocale);
  }, []);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale] || translations.en;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    if (value === undefined) {
      // Fallback to English if key not found
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
    }

    return value || fallback || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, languages }}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook for using i18n
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

export default I18nProvider;