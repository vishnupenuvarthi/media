
const translations = {
    en: {
        auth: {
            login: {
                email: 'Email Address'
            }
        }
    },
    te: {
        auth: {
            login: {
                email: 'ఈమెయిల్ చిరునామా'
            }
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

const translate = (language, key) => {
    const lang = translations[language] ? language : fallbackLanguage;
    console.log(`Lang: ${lang}, Key: ${key}`);

    let value = deepGet(translations[lang], key);
    console.log(`Value from deepGet: ${value}`);

    if (value === undefined) {
        value = deepGet(translations[fallbackLanguage], key);
        console.log(`Value from fallback: ${value}`);
    }
    return value ?? '';
};

// Test
console.log('Testing EN:', translate('en', 'auth.login.email'));
console.log('Testing TE:', translate('te', 'auth.login.email'));
console.log('Testing Invalid:', translate('fr', 'auth.login.email'));
