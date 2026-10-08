// practice examples shown below the keyboard.
// keys for each item are generated automatically from the layout data.
export const EXAMPLE_GROUPS = [
  {
    id: 'words',
    title: 'শব্দ',
    subtitle: 'Simple words',
    items: [
      { text: 'আমি' }, { text: 'তুমি' }, { text: 'বাংলা' }, { text: 'ভালো' },
      { text: 'কেমন' }, { text: 'কোথায়' }, { text: 'বই' }, { text: 'পানি' },
      { text: 'মা' }, { text: 'বাবা' }, { text: 'দেশ' }, { text: 'সকাল' },
      { text: 'দুঃখ' }, { text: 'কর্ম' }, { text: 'ধর্ম' }, { text: 'বিদ্যালয়' },
    ],
  },
  {
    id: 'kar',
    title: 'কার',
    subtitle: 'Vowel signs (ি ে ৈ ো ৌ are typed BEFORE the letter)',
    items: [
      { text: 'কা' }, { text: 'কি' }, { text: 'কী' }, { text: 'কু' }, { text: 'কূ' },
      { text: 'কৃ' }, { text: 'কে' }, { text: 'কৈ' }, { text: 'কো' }, { text: 'কৌ' },
    ],
  },
  {
    id: 'vowels',
    title: 'স্বরবর্ণ',
    subtitle: 'Full vowels',
    items: [
      { text: 'অ' }, { text: 'আ' }, { text: 'ই' }, { text: 'ঈ' }, { text: 'উ' }, { text: 'ঊ' },
      { text: 'ঋ' }, { text: 'এ' }, { text: 'ঐ' }, { text: 'ও' }, { text: 'ঔ' },
    ],
  },
  {
    id: 'juktakkhor',
    title: 'যুক্তাক্ষর',
    subtitle: 'Conjuncts (G = হসন্ত ্ joins letters)',
    items: [
      { text: 'ক্ষ' }, { text: 'জ্ঞ' }, { text: 'ঙ্ক' }, { text: 'ঙ্গ' }, { text: 'ঞ্চ' }, { text: 'ঞ্জ' },
      { text: 'ত্ত' }, { text: 'ত্ব' }, { text: 'ত্র' }, { text: 'ক্ত' }, { text: 'ক্র' }, { text: 'ন্ত' },
      { text: 'ন্দ' }, { text: 'ন্ধ' }, { text: 'ম্প' }, { text: 'ম্ব' }, { text: 'স্ত' }, { text: 'স্থ' },
      { text: 'স্ব' }, { text: 'ষ্ট' }, { text: 'ষ্ঠ' }, { text: 'ণ্ড' }, { text: 'দ্ধ' }, { text: 'দ্র' },
      { text: 'দ্য' }, { text: 'ব্য' }, { text: 'প্র' }, { text: 'শ্র' }, { text: 'হ্ম' }, { text: 'ল্ল' },
      { text: 'স্ক্র' }, { text: 'র্ক', name: 'রেফ' }, { text: 'র্য' },
    ],
  },
  {
    id: 'juktakkhor-words',
    title: 'যুক্তাক্ষর শব্দ',
    subtitle: 'Words with conjuncts',
    items: [
      { text: 'বিজ্ঞান' }, { text: 'সৌন্দর্য' }, { text: 'প্রথম' }, { text: 'রাষ্ট্র' },
      { text: 'বন্ধু' }, { text: 'ছাত্র' }, { text: 'স্কুল' }, { text: 'শিক্ষা' },
    ],
  },
  {
    id: 'signs',
    title: 'চিহ্ন ও যতিচিহ্ন',
    subtitle: 'Signs & punctuation',
    items: [
      { text: '।', name: 'দাঁড়ি' },
      { text: ',', name: 'কমা' },
      { text: '?', name: 'প্রশ্নবোধক' },
      { text: '!', name: 'বিস্ময়' },
      { text: ';', name: 'সেমিকোলন' },
      { text: 'ক্', name: 'হসন্ত' },
      { text: 'ং', name: 'অনুস্বার' },
      { text: 'ঃ', name: 'বিসর্গ' },
      { text: 'ঁ', name: 'চন্দ্রবিন্দু' },
      { text: 'ৎ', name: 'খণ্ড-ত' },
      { text: 'প্র', name: 'র-ফলা' },
      { text: 'ব্য', name: 'য-ফলা' },
      { text: '৳', name: 'টাকা' },
      { text: '১২৩৪৫৬৭৮৯০', name: 'সংখ্যা' },
    ],
  },
  {
    id: 'sentences',
    title: 'বাক্য',
    subtitle: 'Sentences',
    items: [
      { text: 'আমি ভাত খাই।' },
      { text: 'তুমি কেমন আছ?' },
      { text: 'আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।' },
    ],
  },
];
