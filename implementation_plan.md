# Project Structure

mental-health-platform/
├── index.html              (الرئيسية - Home)
├── confidence.html         (الثقة بالنفس)
├── mental-health.html      (الصحة النفسية)
├── general-issues.html     (قضايا عامة)
├── share.html              (شاركينا)
├── login.html              (تسجيل الدخول)
├── dashboard.html          (لوحة التحكم)
├── css/
│   ├── main.css            (global styles, variables, navbar, footer)
│   ├── home.css
│   ├── confidence.css
│   ├── mental-health.css
│   ├── general-issues.css
│   ├── share.css
│   ├── login.css
│   └── dashboard.css
└── js/
    ├── main.js             (global: navbar scroll, shared utilities)
    ├── home.js
    ├── mental-health.js    (tabs filter)
    ├── share.js            (char counter, form validation, toast)
    └── dashboard.js        (sidebar toggle, stats)
