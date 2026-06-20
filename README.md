# TeeBangbon Auto Facebook Group Poster

ระบบจัดการประกาศอสังหาริมทรัพย์และโพสต์ลงกลุ่ม Facebook อัตโนมัติด้วย Next.js และ Playwright

## 🚀 วิธีติดตั้ง (Installation)

1. Clone หรือเปิดโฟลเดอร์โปรเจกต์
2. ติดตั้ง Dependencies ทั้งหมด:
   ```bash
   npm install
   ```
3. ติดตั้ง Browser สำหรับ Playwright:
   ```bash
   npx playwright install chromium
   ```

## 🗄️ วิธีตั้งค่า Database

โปรเจกต์นี้ใช้ Prisma ร่วมกับ SQLite เพื่อความง่ายในการเริ่มต้น
1. สร้างไฟล์ `.env` หากยังไม่มี และกำหนดค่า (มีให้แล้ว):
   ```env
   DATABASE_URL="file:./dev.db"
   ```
2. อัปเดตฐานข้อมูล (หากมีการแก้ไข Schema):
   ```bash
   npx prisma db push
   ```
3. สร้างข้อมูลตัวอย่าง (Demo Data):
   ```bash
   npm run seed
   ```

## 🌐 วิธีรันเว็บ (Admin Dashboard)

1. รัน Development Server:
   ```bash
   npm run dev
   ```
2. เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`
3. เข้าสู่ระบบด้วย:
   - **Username:** `admin`
   - **Password:** `admin123`

## 🤖 วิธี Login Facebook Session สำหรับ Playwright

เพื่อให้ Playwright สามารถโพสต์แทนคุณได้ คุณจะต้อง Login Facebook ทิ้งไว้ใน Persistent Session ของ Playwright:
1. รันสคริปต์ Automation:
   ```bash
   npm run automation
   ```
2. เบราว์เซอร์ Chromium จะเปิดขึ้นมา
3. ให้คุณเข้าไปที่ `https://www.facebook.com` และทำการ **Login ให้เรียบร้อย** (หากยังไม่ได้ Login)
4. เมื่อ Login แล้ว สคริปต์จะจดจำ Session ไว้ในโฟลเดอร์ `automation/user_data/` สำหรับการรันครั้งต่อๆ ไป

## ▶️ วิธีเริ่ม Automation (Auto Posting)

ระบบออกแบบมาให้แยกส่วนกันระหว่างหน้าเว็บและสคริปต์โพสต์อัตโนมัติ:
1. **ในหน้าเว็บ:** ไปที่เมนู `Automation` แล้วกดปุ่ม **"Start Posting"** (เพื่อเปิดสถานะ isActive ในฐานข้อมูล)
2. **ใน Terminal (เบื้องหลัง):** รันคำสั่ง `npm run automation` ค้างไว้ (หากยังไม่ได้รัน)
3. สคริปต์จะคอยเช็คคิวและเริ่มโพสต์ทีละกลุ่ม ตาม Delay ที่ตั้งค่าไว้

## ⚠️ คำเตือนเรื่องความเสี่ยงบัญชี Facebook

- **การจำกัดบัญชี (Account Restriction):** การใช้สคริปต์อัตโนมัติโพสต์ข้อความหรือรูปภาพรัวๆ อาจทำให้ Facebook มองว่าเป็นสแปม (Spam) และเสี่ยงต่อการถูกจำกัดบัญชีชั่วคราวหรือถาวร
- **คำแนะนำ:** 
  - ควรตั้งค่า **Delay ขั้นต่ำอย่างน้อย 60 - 180 วินาที** ต่อหนึ่งโพสต์
  - ไม่ควรโพสต์เกิน 10-20 กลุ่ม ต่อหนึ่งช่วงเวลา
  - หมั่นเปลี่ยนข้อความ Caption หรือรูปภาพเพื่อลดความซ้ำซาก
  - หากพบการแจ้งเตือนจาก Facebook ให้กดปุ่ม **Pause Posting** ทันที
