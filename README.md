# جواب

#### سامانه کمک به دانشجویان برای پیدا کردن جواب تمرینات

## قابلیت ها

- ایجاد درس (توسط ادمین )
- ایجاد تمرین (توسط ادمین و کاربری که ادمین برای آن درس انتخاب کرده است)
- پاسخ دادن به تمرین
- امتیاز دادن به پاسخ های تمرین
- کامنت گذاشتن برای پاسخ های تمرین

> دروس، تمرینات، پاسخ ها، کامنت ها، همگی قابلیت تغییر و حذف را دارند.

## تکنولوژی ها و ابزار

#### backend:

- [express](https://expressjs.com/)
- [mongodb](https://www.mongodb.com/)
- [mongoose](https://mongoosejs.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [nodemailer](https://nodemailer.com/)
- [yup](https://github.com/jquense/yup)
- [multer](https://github.com/expressjs/multer)

#### frontend:

- [Next.js](https://nextjs.org/) (typeScript)
- [Redux-toolkit](https://redux-toolkit.js.org/)
- [Next-Redux-Wrapper](https://github.com/kirill-konshin/next-redux-wrapper)
- [Redux-persist](https://redux-toolkit.js.org/)
- [tailwindcss](https://tailwindcss.com/)
- [axios](https://github.com/axios/axios)
- [formik](https://github.com/jaredpalmer/formik) and [yup](https://github.com/jquense/yup)
- [react-cookie](https://github.com/reactivestack/cookies)
- [react-icons](https://react-icons.netlify.com/)
- [react-toastify](https://github.com/fkhadra/react-toastify)
- [react-loading](https://github.com/fakiolinho/react-loading)
- [nprogress](https://github.com/rstacruz/nprogress)

## Installation

برای اجرا به [Nodejs](https://nodejs.org/) و [mongoDB](https://www.mongodb.com/) نیاز دارید.

```sh
git clone https://github.com/mohammad-fazeli/javab.git
```

```sh
cd javab
```

```sh
# in javab folder
cd backend
```

```sh
echo "
PORT=8080
MONGO_URI=mongodb://localhost:27017/javab
JWT_SECRET=YOUR_SECRET_KEY
EMAIL_SECRET=YOUR_EMAIL_SECRET_KEY
FORGET_PASSWORD_SECRET=YOUR_FORGET_PASSWORD_SECRET_KEY
EMAIL_ADDRESS=YOUR_GMAIL_ADDRESS
EMAIL_PASSWORD=APP_PASSWORD_FOR_YOUR_GMAIL_ADDRESS
URL=http://localhost:3000
" >> .env
```

```sh
npm install
```

```sh
npm run dev
```

برای اجرای فرانت اند یک ترمینال جدید باز کنید و دستورات زیر را اجرا کنید:

```sh
# in javab folder
cd frontend
```

```sh
npm i
```

```sh
echo "
NEXT_PUBLIC_API_URL=http://localhost:8080
IMAGE_HOSTNAME=localhost
" >> .env
```

اجرا در حالت development:

```sh
npm run dev
```

اجرا در حالت production:

```sh
npm run build
```

```sh
npm run start
```

در مرورگر خود به http://localhost:3000 بروید.

> برای ساخت کاربر ادمین بعد از ثبت نام به صورت دستی فیلد ادمین را در دیتا بیس true قرار دهید و از حساب کاربری خود در برنامه خارج و دوباره وارد شوید.
