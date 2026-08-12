# VOCAB ORBIT — คลังศัพท์กลางอวกาศ

เว็บแอปจดคำศัพท์ภาษาอังกฤษธีมอวกาศ บันทึกคำศัพท์ถาวรผ่าน Supabase,
ค้นความหมาย+แปลไทยอัตโนมัติ, ออกเสียง, และภารกิจตอบคำถามประจำวันแบบ spaced-repetition
(คำที่ตอบผิดจะถามซ้ำบ่อยขึ้น)

ไม่มีขั้นตอน build ใดๆ — เป็น static site (HTML/CSS/JS ล้วน) deploy ขึ้น Cloudflare Pages ได้ทันที

## ⚠️ เรื่องความเป็นส่วนตัว (สำคัญ อ่านก่อนใช้)

แอปนี้ไม่มีระบบล็อกอินแบบรหัสผ่าน — ผู้ใช้แค่พิมพ์ **ชื่อ** แล้วชื่อนั้นจะกลายเป็น "บัญชี"
ทันที ใครก็ตามที่พิมพ์ชื่อเดียวกัน (บนอุปกรณ์ไหนก็ได้) จะเห็นและแก้ไขคำศัพท์ชุดเดียวกันได้
ฐานข้อมูลฝั่ง Supabase ก็เปิดกว้าง (RLS อนุญาตทุก request ที่ถือ anon key) โดยพึ่งพา
"ความไม่รู้ชื่อของกันและกัน" เป็นตัวกันเท่านั้น ไม่ใช่การเข้ารหัสหรือรหัสผ่านจริง

เหมาะกับ: ใช้กันเองในครอบครัว เพื่อนสนิท หรือห้องเรียนเล็กๆ ที่ไว้ใจกัน
ไม่เหมาะกับ: ข้อมูลที่ต้องการความเป็นส่วนตัวจริงจัง หรือระบบที่มีคนแปลกหน้าเข้าถึงได้

ถ้าต้องการความปลอดภัยสูงขึ้นภายหลัง สามารถกลับไปใช้ Supabase Auth (อีเมล/รหัสผ่าน) ได้
โดยแก้ตาราง `words`/`daily_quizzes` ให้อ้างอิง `auth.users` แทน `profile_name` และปรับ
RLS policy ให้เช็ค `auth.uid()` เหมือนเดิม

## 1) ตั้งค่า Supabase

1. สร้างโปรเจกต์ใหม่ที่ https://supabase.com
2. ไปที่ **SQL Editor** แล้วรันไฟล์ `supabase/schema.sql` ทั้งหมด (สร้างตาราง `words`,
   `daily_quizzes` ที่แยกข้อมูลตามคอลัมน์ `profile_name` — ไม่ต้องตั้งค่า Auth ใดๆ เพิ่ม)
3. ไปที่ **Settings → API** คัดลอกค่า:
   - `Project URL`
   - `anon public` key
4. เปิดไฟล์ `js/config.js` แล้ววางค่าแทนที่:
   ```js
   const SUPABASE_URL = "https://xxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOi...";
   ```

## 2) ขึ้น GitHub

```bash
cd vocab-orbit-web
git init
git add .
git commit -m "vocab orbit web app"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

> อย่าลืม: `js/config.js` มีเฉพาะ Supabase URL กับ anon public key ซึ่งออกแบบมาให้เปิดเผยฝั่ง
> client ได้อยู่แล้ว (ความปลอดภัยของข้อมูลมาจาก Row Level Security ในฐานข้อมูล ไม่ใช่การซ่อนคีย์นี้)

## 3) Deploy บน Cloudflare Pages

1. ไปที่ Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**
2. เลือก repo ที่เพิ่ง push ขึ้นไป
3. ตั้งค่า build:
   - **Framework preset:** None
   - **Build command:** (เว้นว่างไว้)
   - **Build output directory:** `/`
4. กด Deploy — จะได้ลิงก์ประมาณ `https://<project>.pages.dev`

เปิดลิงก์นั้น พิมพ์ชื่อของคุณ แล้วเริ่มจดคำศัพท์ได้เลย ข้อมูลจะอยู่ถาวรใน Supabase —
พิมพ์ชื่อเดิมจากเครื่องไหนก็เห็นคำศัพท์ชุดเดียวกัน (ดูคำเตือนเรื่องความเป็นส่วนตัวด้านบน)

## โครงสร้างไฟล์

```
vocab-orbit-web/
├── index.html          หน้าเว็บหลัก (auth screen + app)
├── css/style.css        สไตล์ธีมอวกาศ
├── js/
│   ├── config.js         ใส่ Supabase URL + anon key ตรงนี้
│   ├── supabaseClient.js สร้าง client
│   └── app.js            ลอจิกทั้งหมดของแอป
└── supabase/schema.sql   SQL สร้างตาราง + RLS policy
```

## ฟีเจอร์

- พิมพ์คำ → มีคำใกล้เคียงลอยขึ้นมา 5 คำให้เลือก
- กด Enter → ค้นความหมายอังกฤษ (dictionaryapi.dev) + แปลไทย (MyMemory) อัตโนมัติ,
  ออกเสียงด้วย Web Speech API, บันทึกลง Supabase ทันทีถ้ายังไม่มี
- ภารกิจประจำวัน 5 ข้อ สุ่มจากคำที่บันทึกไว้ — คำที่ตอบถูกบ่อยจะโผล่มาน้อยลง (1 ข้อ/วัน)
  คำที่ตอบผิดจะโผล่มาบ่อยขึ้น (สูงสุด 4 ข้อ/วัน)
- คลังดาว: ดู/ค้นหา/ลบคำศัพท์ทั้งหมด พร้อมสถิติถูก/ผิด
