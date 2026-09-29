# OpsCell Desktop — خلية العمليات

## مكان index.html

ضع ملف الواجهة الحالي هنا بالضبط:

src\index.html

أي أن بنية المشروع تكون:

OpsCell-desktop
│
├── main.js
├── preload.js
├── package.json
├── build.bat
├── README.md
└── src
    └── index.html

## تشغيل للتجربة

1. ثبّت Node.js LTS على Windows.
2. افتح CMD داخل مجلد OpsCell-desktop.
3. نفّذ:
   npm install
4. ثم:
   npm start

## إنشاء Setup.exe

يمكنك الضغط مرتين على build.bat، أو تنفيذ:

npm run build

بعد نجاح البناء ستجد المثبت داخل:

dist\

وسيكون اسمه عادة:

خلية العمليات Setup 1.0.0.exe

## مكان البيانات

Electron يحفظ البيانات في مجلد userData الخاص بالتطبيق، وفي Windows يكون عادة:

C:\Users\اسم المستخدم\AppData\Roaming\opscell-desktop

ويحتوي على:

data.json
data.json.bak
backups\

ملاحظة: اسم مجلد البيانات يعتمد على app name الذي يحدده Electron. إذا أردت اسم مجلد ثابتًا مثل OpsCell بدل opscell-desktop، يمكن ضبطه في main.js قبل الإصدار النهائي.

## ملاحظة مهمة

ملف index.html الحالي يحتوي على آليات حفظ متصفح أيضًا (localStorage وIndexedDB)، لكنه سيستفيد من window.disk داخل Electron للحفظ على القرص.
