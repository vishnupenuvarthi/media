const translations = {
  en: {
    header: {
      tagline: "Nellore Newsroom Of Record",
      newsroomAccess: 'Newsroom Access',
      joinNewsroom: 'Join the newsroom',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      logout: 'Logout',
      ePaper: 'e-paper',
      hindi: 'hindi',
      newsletter: 'Newsletter',
      primaryNav: {
        latest: 'Latest',
        india: 'India',
        world: 'World',
        business: 'Business',
        markets: 'Markets',
        tech: 'Tech',
        sports: 'Sports',
        entertainment: 'Entertainment',
        lifestyle: 'Lifestyle',
        opinion: 'Opinion',
        calendar: 'Calendar',
        nlrCalendar: 'NLR LIVE NEWS CALENDER',
        youtube: 'YOUTUBE',
        breaking: 'Breaking News'
      },
      secondaryNav: {
        cities: 'Cities',
        budget: 'Budget 2025',
        youtube: 'YOUTUBE',
        searchPlaceholder: 'Search news...',
        breakingNews: 'Breaking News',
        liveUpdates: 'Live Updates',
        latestStories: 'Latest Stories',
        weather: 'Weather',
        temperatureLabel: 'Nellore'
      },
      ticker: {
        label: 'Breaking News'
      },
      hero: {
        editorsPick: "Editors' Picks",
        videoTitle: 'Video News',
        videoDescription: 'Watch the latest report from the ground.'
      },
      sections: {
        sectionTitle: 'Editorial Planner',
        moreIn: 'More in {{section}} →'
      },
      trending: {
        label: 'Trending',
        title: 'Now Reading',
        description: 'Curated using real-time readership and editorial judgement.'
      },
      latest: {
        label: 'Live Desk',
        heading: 'Live Updates',
        viewTimeline: 'View full timeline →',
        noEvents: 'No entries for this day yet.',
        loading: 'Loading events…',
        selectedDate: 'Selected Date',
        events: 'Events',
        addEvent: 'Add event',
        updateEvent: 'Update event',
        deleteEvent: 'Delete',
        newEntry: 'New entry',
        addEventTitle: 'Add Event'
      },
      breaking: {
        label: 'BREAKING NEWS',
        heading: 'Breaking News',
        noNews: 'No Breaking News',
        noNewsDesc: 'There are no breaking news stories at the moment.',
        backToHome: 'Back to Home'
      },
      video: {
        title: 'Video Desk',
        seeAll: 'See all →'
      },
      photo: {
        title: 'Day In Pictures',
        viewAll: 'View gallery →'
      },
      footer: {
        aboutTitle: 'NLR LIVE NEWS',
        aboutDescription:
          'Real-time, trustworthy reporting powered by a modern newsroom stack and experienced journalists across India.',
        networkTitle: 'Network',
        newsroomTitle: 'News Sections',
        quickLinksTitle: 'Quick Links',
        newsletterTitle: 'Daily Briefing',
        newsletterDescription: 'Morning intelligence on politics, markets, and the world.',
        trustline: 'Trusted since 1961',
        columns: {
          network: ['About Us', 'Editorial Code', 'Careers', 'Advertise', 'Syndication', 'Contact'],
          newsroom: ['Nation', 'Politics', 'Markets', 'Tech & Startups', 'Sports', 'Culture'],
          quickLinks: ['e-Paper', 'Podcasts', 'Newsletters', 'Archives', 'RSS Feeds', 'Apps']
        },
        subscribe: 'Subscribe',
        emailPlaceholder: 'Email'
      },
      auth: {
        register: {
          title: 'Create Your Account',
          subtitle: 'Join NLR LIVE NEWS and stay informed',
          fullName: 'Full Name',
          email: 'Email Address',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          accountType: 'Account Type',
          interests: "Select the categories you're interested in",
          submit: 'Create Account',
          creating: 'Creating Account...',
          success: 'Account created successfully! Redirecting...',
          existing: 'Already have an account?',
          signIn: 'Sign in here',
          roles: {
            user: { label: 'User', description: 'Regular reader and subscriber' },
            developer: { label: 'Developer', description: 'Technical team member' },
            employer: { label: 'Employer', description: 'Business partner or advertiser' },
            owner: { label: 'Owner', description: 'Platform administrator' }
          },
          categories: {
            national: 'National News',
            business: 'Business & Finance',
            sports: 'Sports',
            entertainment: 'Entertainment',
            technology: 'Technology',
            politics: 'Politics',
            world: 'World News',
            lifestyle: 'Lifestyle',
            health: 'Health & Wellness',
            education: 'Education'
          }
        },
        login: {
          title: 'Welcome Back',
          subtitle: 'Sign in to your NLR LIVE NEWS account',
          email: 'Email Address',
          password: 'Password',
          remember: 'Remember me',
          forgot: 'Forgot password?',
          submit: 'Sign In',
          noAccount: "Don't have an account?",
          create: 'Create one now'
        },
        errors: {
          nameRequired: 'Name must be at least 2 characters',
          emailInvalid: 'Please enter a valid email address',
          passwordRequired: 'Password must be at least 6 characters long',
          passwordMismatch: 'Passwords do not match'
        }
      },
      calendar: {
        heroTitle: 'NLR LIVE NEWS Calendar · 2026',
        heroSubtitle: 'Track national events, newsroom priorities, and assignments across 2026.',
        editorialPlanner: 'Editorial Planner',
        liveDescription: 'Track national events, newsroom priorities, and your custom assignments across the 2026 publishing cycle.',
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        signIn: 'Sign in to schedule newsroom priorities and update the shared calendar.',
        noEvents: 'No entries for this day yet.',
        loading: 'Loading events…',
        add: 'Add event',
        update: 'Update event',
        delete: 'Delete',
        newEntry: 'New entry',
        selectedDate: 'Selected Date',
        events: 'Events',
        eventHeadline: 'Event headline',
        detailsPlaceholder: 'Details, guests, coverage notes',
        locationPlaceholder: 'Location / Bureau',
        categories: {
          national: 'National',
          business: 'Business',
          sports: 'Sports',
          culture: 'Culture',
          breaking: 'Breaking',
          custom: 'Custom'
        }
      },
      notFound: {
        title: 'Story not found',
        description: 'The article or page you are looking for might have been moved.'
      },
      pages: {
        category: {
          loading: 'Loading category...',
          label: 'Category',
          tags: 'Tags'
        },
        article: {
          loading: 'Loading article...',
          back: 'Back to homepage',
          updated: 'Updated',
          tags: 'Tags',
          related: 'Related stories'
        },
        live: {
          title: 'Live Coverage',
          description: 'Minute-by-minute updates from the NLR LIVE NEWS live desk.',
          loading: 'Loading live blog...'
        },
        dashboard: {
          welcome: 'Newsroom Control Center',
          description: 'Assign coverage, view status, and review submissions in one place.',
          reviewQueue: 'Review queue',
          viewAll: 'View all',
          columns: {
            title: 'Title',
            reporter: 'Reporter',
            status: 'Status',
            updated: 'Updated'
          }
        }
      },
      categoriesMap: {
        politics: 'Politics',
        business: 'Business',
        sports: 'Sports',
        entertainment: 'Entertainment',
        technology: 'Technology',
        tech: 'Tech',
        world: 'World',
        lifestyle: 'Lifestyle',
        health: 'Health',
        education: 'Education',
        national: 'National',
        markets: 'Markets'
      }
    }
  },
  te: {
    header: {
      tagline: 'దేశానికి విశ్వసనీయ వార్తల వేదిక',
      newsroomAccess: 'న్యూస్‌రూమ్ యాక్సెస్',
      joinNewsroom: 'న్యూస్‌రూమ్‌లో చేరండి',
      login: 'లాగిన్',
      register: 'నమోదు',
      dashboard: 'డ్యాష్‌బోర్డ్',
      logout: 'లాగౌట్',
      ePaper: 'ఇ-పేపర్',
      hindi: 'హిందీ',
      newsletter: 'న్యూస్‌లెటర్',
      primaryNav: {
        latest: 'తాజా వార్తలు',
        india: 'భారతదేశం',
        world: 'ప్రపంచం',
        business: 'వ్యాపారం',
        markets: 'మార్కెట్లు',
        tech: 'సాంకేతికం',
        sports: 'క్రీడలు',
        entertainment: 'వినోదం',
        lifestyle: 'లైఫ్ స్టైల్',
        opinion: 'సంపాదకీయాలు',
        calendar: 'కాలెండర్',
        nlrCalendar: 'NLR LIVE NEWS కాలెండర్',
        youtube: 'యూట్యూబ్'
      },
      secondaryNav: {
        cities: 'నగరాలు',
        budget: 'బడ్జెట్ 2025',
        elections: 'ఎన్నికలు',
        calendar2026: '2026 కాలెండర్',
        podcasts: 'పాడ్‌కాస్ట్‌లు',
        explainers: 'వివరణలు',
        photos: 'ఫోటోలు',
        videos: 'వీడియోలు'
      },
      temperatureLabel: 'ముంబై'
    },
    ticker: {
      label: 'బ్రేకింగ్ న్యూస్'
    },
    hero: {
      editorsPick: 'సంపాదకుల ఎంపికలు',
      videoTitle: 'వీడియో వార్తలు',
      videoDescription: 'గ్రౌండ్ రిపోర్ట్‌ను తక్షణమే వీక్షించండి.'
    },
    sections: {
      sectionTitle: 'ఎడిటోరియల్ ప్లానర్',
      moreIn: '{{section}} విభాగంలోని మరిన్ని వార్తలు →'
    },
    trending: {
      label: 'ట్రెండింగ్',
      title: 'ఇప్పుడు చదువుతున్నది',
      description: 'వివిధ పాఠకుల ప్రాధాన్యతలు మరియు సంపాదకుల ఎంపికల ఆధారంగా.'
    },
    breaking: {
      label: 'బ్రేకింగ్ న్యూస్',
      heading: 'బ్రేకింగ్ న్యూస్',
      noNews: 'బ్రేకింగ్ న్యూస్ లేదు',
      noNewsDesc: 'ప్రస్తుతానికి బ్రేకింగ్ న్యూస్ కథనాలు లేవు.',
      backToHome: 'హోమ్‌కు తిరిగి వెళ్ళు'
    },
    latest: {
      label: 'లైవ్ డెస్క్',
      heading: 'లైవ్ అప్‌డేట్స్',
      viewTimeline: 'పూర్తి టైమ్‌లైన్ చూడండి →',
      noEvents: 'ఈ రోజుకు ఎలాంటి ఎంట్రీలు లేవు.',
      loading: 'ఈవెంట్లు లోడ్ అవుతున్నాయి…',
      selectedDate: 'ఎంచుకున్న తేదీ',
      events: 'ఈవెంట్లు',
      addEvent: 'ఈవెంట్ జోడించండి',
      updateEvent: 'ఈవెంట్ నవీకరించండి',
      deleteEvent: 'తొలగించండి',
      newEntry: 'కొత్త ఎంట్రీ',
      addEventTitle: 'ఈవెంట్ జోడించండి'
    },
    video: {
      title: 'వీడియో డెస్క్',
      seeAll: 'అన్నీ చూడండి →'
    },
    photo: {
      title: 'చిత్రాల ద్వారా రోజు',
      viewAll: 'గ్యాలరీ చూడండి →'
    },
    footer: {
      aboutTitle: 'భారత్ బులెటిన్',
      aboutDescription: 'దేశవ్యాప్తంగా ఉన్న మా అనుభవజ్ఞులైన జర్నలిస్టులు మీకు విశ్వసనీయ వార్తలను అందిస్తున్నారు.',
      networkTitle: 'నెట్‌వర్క్',
      newsroomTitle: 'వార్త విభాగాలు',
      quickLinksTitle: 'ఉపయోగకరమైన లింకులు',
      newsletterTitle: 'డైలీ బ్రీఫింగ్',
      newsletterDescription: 'రాజకీయాలు, మార్కెట్లు మరియు ప్రపంచంపై ఉదయం నవీకరణ.',
      trustline: '1961 నుంచి విశ్వసనీయత',
      columns: {
        network: ['మా గురించి', 'సంపాదకీయ నియమావళి', 'ఉద్యోగాలు', 'ప్రకటనలు', 'సిండికేషన్', 'సంప్రదించండి'],
        newsroom: ['దేశీయ', 'రాజకీయాలు', 'మార్కెట్లు', 'టెక్ & స్టార్టప్స్', 'క్రీడలు', 'సంస్కృతి'],
        quickLinks: ['ఇ-పేపర్', 'పాడ్‌కాస్ట్‌లు', 'న్యూస్‌లెటర్లు', 'ఆర్కైవ్స్', 'RSS ఫీడ్స్', 'యాప్స్']
      },
      subscribe: 'చందా తీసుకోండి',
      emailPlaceholder: 'ఈమెయిల్'
    },
    auth: {
      register: {
        title: 'మీ ఖాతాను సృష్టించండి',
        subtitle: 'భారత్ బులెటిన్‌తో ప్రతి వార్త తెలుసుకోండి',
        fullName: 'పూర్తి పేరు',
        email: 'ఈమెయిల్ చిరునామా',
        password: 'పాస్‌వర్డ్',
        confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
        accountType: 'ఖాతా రకం',
        interests: 'మీకు ఆసక్తి కలిగిన విభాగాలను ఎంచుకోండి',
        submit: 'ఖాతా సృష్టించండి',
        creating: 'ఖాతా సృష్టిస్తోంది...',
        success: 'ఖాతా విజయవంతంగా సృష్టించబడింది! మిమ్మల్ని పంపిస్తున్నాం...',
        existing: 'ఇప్పటికే ఖాతా ఉందా?',
        signIn: 'ఇక్కడ లాగిన్ అవండి',
        roles: {
          user: { label: 'యూజర్', description: 'నియమిత పాఠకుడు' },
          developer: { label: 'డెవలపర్', description: 'టెక్నికల్ టీమ్ సభ్యుడు' },
          employer: { label: 'ఎంప్లోయర్', description: 'వ్యాపార భాగస్వామి లేదా ప్రకటనదారు' },
          owner: { label: 'ఓనర్', description: 'ప్లాట్‌ఫామ్ నిర్వాహకుడు' }
        },
        categories: {
          national: 'జాతీయ వార్తలు',
          business: 'వ్యాపారం & ఫైనాన్స్',
          sports: 'క్రీడలు',
          entertainment: 'వినోదం',
          technology: 'సాంకేతికం',
          politics: 'రాజకీయాలు',
          world: 'ప్రపంచ వార్తలు',
          lifestyle: 'లైఫ్ స్టైల్',
          health: 'ఆరోగ్యం & వెల్‌నెస్',
          education: 'విద్య'
        }
      },
      login: {
        title: 'తిరిగి స్వాగతం',
        subtitle: 'మీ భారత్ బులెటిన్ ఖాతాలో లాగిన్ అవ్వండి',
        email: 'ఈమెయిల్ చిరునామా',
        password: 'పాస్‌వర్డ్',
        remember: 'నన్ను గుర్తుంచుకో',
        forgot: 'పాస్‌వర్డ్ మర్చిపోయారా?',
        submit: 'లాగిన్',
        noAccount: 'ఖాతా లేదా?',
        create: 'ఇప్పుడే సృష్టించండి'
      },
      errors: {
        nameRequired: 'పేరు కనీసం 2 అక్షరాలు ఉండాలి',
        emailInvalid: 'దయచేసి సరైన ఈమెయిల్ నమోదు చేయండి',
        passwordRequired: 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి',
        passwordMismatch: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు'
      }
    },
    calendar: {
      heroTitle: 'భారత్ బులెటిన్ కాలెండర్ · 2026',
      heroSubtitle: '2026లో దేశవ్యాప్తంగా జరిగే సంఘటనలు, బాధ్యతలు, ప్రణాళికలను ట్రాక్ చేయండి.',
      editorialPlanner: 'ఎడిటోరియల్ ప్లానర్',
      liveDescription: 'దేశీయ ఈవెంట్లు, న్యూస్‌రూమ్ ప్రాధాన్యతలు మరియు మీ అసైన్మెంట్లను 2026 ఒడిలో ట్రాక్ చేయండి.',
      months: [
        'జనవరి',
        'ఫిబ్రవరి',
        'మార్చి',
        'ఏప్రిల్',
        'మే',
        'జూన్',
        'జూలై',
        'ఆగస్టు',
        'సెప్టెంబర్',
        'అక్టోబర్',
        'నవంబర్',
        'డిసెంబర్'
      ],
      days: ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'],
      signIn: 'కాలెండర్‌ను సవరించడానికి దయచేసి లాగిన్ అవ్వండి.',
      noEvents: 'ఈ తేదీకి ఎలాంటి ఎంట్రీలు లేవు.',
      loading: 'ఈవెంట్లు లోడ్ అవుతున్నాయి…',
      add: 'ఈవెంట్ జోడించండి',
      update: 'ఈవెంట్ నవీకరించండి',
      delete: 'తొలగించండి',
      newEntry: 'కొత్త ఎంట్రీ',
      selectedDate: 'ఎంచుకున్న తేదీ',
      events: 'ఈవెంట్లు',
      eventHeadline: 'ఈవెంట్ హెడ్డింగ్',
      detailsPlaceholder: 'వివరాలు, అతిథులు, కవరేజ్ నోట్స్',
      locationPlaceholder: 'ప్రదేశం / బ్యూరో',
      categories: {
        national: 'జాతీయ',
        business: 'వ్యాపారం',
        sports: 'క్రీడలు',
        culture: 'సంస్కృతి',
        breaking: 'బ్రేకింగ్',
        custom: 'కస్టమ్'
      }
    },
    notFound: {
      title: 'కథ దొరకలేదు',
      description: 'మీరు వెతుకుతున్న పేజీ లేదా కథను మేము కనుగొనలేదు.'
    },
    pages: {
      category: {
        loading: 'వర్గం లోడ్ అవుతోంది...',
        label: 'విభాగం',
        tags: 'ట్యాగులు'
      },
      article: {
        loading: 'వ్యాసం లోడ్ అవుతోంది...',
        back: 'హోమ్‌పేజీకి వెళ్ళండి',
        updated: 'నవీకరించబడింది',
        tags: 'ట్యాగులు',
        related: 'సంబంధిత కథలు'
      },
      live: {
        title: 'లైవ్ కవరేజ్',
        description: 'భారత్ బులెటిన్ లైవ్ డెస్క్ నుండి నిమిషానికి నిమిషం అప్‌డేట్‌లు.',
        loading: 'లైవ్ బ్లాగ్ లోడ్ అవుతోంది...'
      },
      dashboard: {
        welcome: 'న్యూస్‌రూమ్ కంట్రోల్ సెంటర్',
        description: 'కవరేజ్ కేటాయించండి, స్థితి చూడండి, సమర్పణలను సమీక్షించండి.',
        reviewQueue: 'రివ్యూ క్యూ',
        viewAll: 'అన్నీ చూడండి',
        columns: {
          title: 'శీర్షిక',
          reporter: 'రిపోర్టర్',
          status: 'స్థితి',
          updated: 'తాజాగా'
        }
      }
    },
    categoriesMap: {
      politics: 'రాజకీయాలు',
      business: 'వ్యాపారం',
      sports: 'క్రీడలు',
      entertainment: 'వినోదం',
      technology: 'సాంకేతికం',
      tech: 'సాంకేతికం',
      world: 'ప్రపంచం',
      lifestyle: 'లైఫ్ స్టైల్',
      health: 'ఆరోగ్యం',
      education: 'విద్య',
      national: 'జాతీయ',
      markets: 'మార్కెట్లు'
    }
  }
};

const fallbackLanguage = 'en';

const deepGet = (obj, path) => {
  return path.split('.').reduce((acc, part) => {
    if (acc && acc[part] !== undefined) {
      return acc[part];
    }
    return undefined;
  }, obj);
};

export const translate = (language, key, replacements = {}) => {
  const lang = translations[language] ? language : fallbackLanguage;
  let value = deepGet(translations[lang], key);
  if (value === undefined) {
    value = deepGet(translations[fallbackLanguage], key);
  }
  if (typeof value === 'string') {
    return value.replace(/\{\{(.*?)\}\}/g, (_, match) => {
      const replacementKey = match.trim();
      return replacements[replacementKey] ?? '';
    });
  }
  return value ?? '';
};

export const translateArray = (language, key) => {
  const value = translate(language, key);
  return Array.isArray(value) ? value : [];
};

export const translateCategory = (language, value = '') => {
  const key = value.toLowerCase();
  const lang = translations[language] ? language : fallbackLanguage;
  const map = translations[lang]?.categoriesMap ?? translations[fallbackLanguage]?.categoriesMap;
  return map?.[key] ?? value;
};
