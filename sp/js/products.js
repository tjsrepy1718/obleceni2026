const PRODUCTS = [
  {
    id: "triko-jako",
    name: "Triko tmavě zelené",
    brand: "JAKO",
    basePrice: 350,
    image: "assets/products/triko-jako.jpg",
    description:
      "Cena včetně potisku TJ Sokol Řepy na zádech, loga klubu na srdci a iniciálů.",
    sizes: [
      "116",
      "128",
      "140",
      "152",
      "164",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "3XL",
      "4XL"
    ],
    sizeRequired: true,
    extraName: false,
    extraNumber: false
  },

  {
    id: "trenky-jako",
    name: "Trenky černé",
    brand: "JAKO",
    basePrice: 320,
    image: "assets/products/trenky-jako.jpg",
    description:
      "Cena včetně potisku loga klubu a iniciálů.",
    sizes: [
      "116",
      "128",
      "140",
      "152",
      "164",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "3XL",
      "4XL"
    ],
    sizeRequired: true,
    extraName: false,
    extraNumber: false
  },

  {
    id: "sustka-jako",
    name: "Šustka",
    brand: "JAKO",
    basePrice: 800,
    image: "assets/products/sustka-jako.jpg",
    description:
      "Cena včetně potisku TJ Sokol Řepy na zádech, loga klubu na srdci a iniciálů.",
    sizes: [
      "116",
      "128",
      "140",
      "152",
      "164",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "3XL",
      "4XL"
    ],
    sizeRequired: true,
    extraName: false,
    extraNumber: false
  },

  {
    id: "batoh-jako",
    name: "Batoh",
    brand: "JAKO",
    basePrice: 580,
    image: "assets/products/batoh-jako.jpg",
    description:
      "Cena včetně potisku loga klubu a iniciálů.",
    sizes: [],
    sizeRequired: false,
    extraName: false,
    extraNumber: false
  },

  {
    id: "mikina-joma",
    name: "Mikina",
    brand: "JOMA",
    basePrice: 702,
    image: "assets/products/mikina-joma.jpg",
    description:
      "Cena včetně potisku TJ Sokol Řepy na zádech, loga klubu na srdci a iniciálů.",
    sizes: [
      "6XS/106",
      "5XS/116",
      "4XS/128",
      "3XS/140",
      "2XS/152",
      "XS/164",
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    sizeRequired: true,
    extraName: false,
    extraNumber: false
  },

  {
    id: "dres-trenky-joma",
    name: "Dres světlezelený + trenky",
    brand: "JOMA",
    basePrice: 561,
    image: "assets/products/dres-trenky-joma.jpg",
    description:
      "Cena včetně potisku 2× loga klubu a 2× iniciálů.",
    sizes: [
      "6XS/106",
      "5XS/116",
      "4XS/128",
      "3XS/140",
      "2XS/152",
      "XS/164",
      "S",
      "M",
      "L",
      "XL",
      "2XL"
    ],
    sizeRequired: true,
    extraName: false,
    extraNumber: false
  }
];

const APP_CONFIG = {
  apiUrl:
    "https://script.google.com/macros/s/AKfycbxe2zX0N-ZjXHuLIM42nIcM20dCAyeVpmy2PWWZmsxHuLiMqOz7ogmr8uXIDu1dbEF3/exec",

  jakoSizeGuide:
    "https://www.jako-sport.cz/info/tabulka-velikosti",

  jomaSizeGuide: "#"
};