import { useEffect } from "react";
import i18n from "../i18n";
import COUNTRY_TO_LANG from "../geo/countryToLang";

// Tùy chỉnh
const GEO_CACHE_KEY = "geo_lang_cache";    // lưu { lang, at }
const GEO_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 ngày

async function fetchCountryCode(signal) {
    // Bạn có thể thay bằng ipinfo.io, ipregistry, v.v.
    const res = await fetch("https://ipapi.co/json/", { signal });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.country_code || null; // vd: "US"
}

export default function useCountryLanguageGate() {
    useEffect(() => {
        // 1) Nếu user đã chọn thủ công trước đó -> không can thiệp
        const userChosen = localStorage.getItem("i18nextLng");
        if (userChosen) return;

        // 2) Nhìn cache geo trước (nếu còn hạn)
        const raw = localStorage.getItem(GEO_CACHE_KEY);
        if (raw) {
            try {
                const { lang, at } = JSON.parse(raw);
                if (lang && at && Date.now() - at < GEO_TTL_MS) {
                    if (i18n.language !== lang) i18n.changeLanguage(lang);
                    return;
                }
            } catch { }
        }

        // 3) Gọi API IP
        const controller = new AbortController();
        fetchCountryCode(controller.signal)
            .then((cc) => {
                // Mặc định: en-US
                let target = "en-US";
                if (cc && COUNTRY_TO_LANG[cc]) {
                    target = COUNTRY_TO_LANG[cc];
                }
                // Nếu i18n đang khác -> đổi
                if (target && i18n.language !== target) {
                    i18n.changeLanguage(target);
                }
                // Lưu cache geo (không đè i18nextLng của user)
                localStorage.setItem(
                    GEO_CACHE_KEY,
                    JSON.stringify({ lang: target, at: Date.now() })
                );
            })
            .catch(() => {/* im lặng nếu lỗi */ });

        return () => controller.abort();
    }, []);
}
