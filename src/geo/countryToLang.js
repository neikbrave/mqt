// Chỉ map CÁC NƯỚC BẠN MUỐN. Quốc gia khác -> en-US.
const COUNTRY_TO_LANG = {
    US: "en-US",
    FR: "fr-FR",
    NP: "ne-NP",
    CN: "zh-CN",
    IT: "it-IT",
    // Ả Rập: chọn đại diện. Thường dùng ar-SA; có thể thay ar-AE/ar-EG tùy thị trường
    SA: "ar-SA",
    JP: "ja-JP",
    IL: "he-IL",
    ES: "es-ES",
    TW: "zh-TW",
    HK: "zh-HK",
    DE: "de-DE",
    BE: "nl-BE",  // hoặc fr-BE tùy mục tiêu
    CH: "de-CH",  // hoặc fr-CH / it-CH tùy vùng
    DK: "da-DK",
    BG: "bg-BG",
    HU: "hu-HU",
    CZ: "cs-CZ",
    GR: "el-GR",
    FI: "fi-FI",
    NL: "nl-NL",
    TR: "tr-TR",
    VN: "vi",
};

export default COUNTRY_TO_LANG;
