# 🧵 Filaman – IoT Filament Management System

Filaman is a full-stack IoT solution designed for FabLabs and 3D printing enthusiasts to track 3D printing filament usage in real-time. By combining a **Next.js web application** with **ESP32-based hardware**, it automates the tedious process of weighing and logging spools.

## 🚀 The Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Runtime:** [Bun](https://bun.sh/) (Fastest JavaScript all-in-one toolkit)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Auth:** Custom secure Cookie / Session-based Auth (bcrypt)
- **Styling:** Tailwind CSS v4

## ✨ Features

- **Automated Tracking:** Place a spool on the custom-built scale, scan the NFC tag, and the weight is automatically updated via REST API.
- **Real-time Inventory:** Keep track of remaining filament across multiple materials and colors.
- **Hardware Integration:** Custom ESP32 firmware that communicates with the Next.js backend.
- **Admin Management:** Built-in dashboard to manage users and roles efficiently.
- **Mobile-First Design:** Optimized for quick checks and updates on the workshop floor.

## 🛠️ Hardware Integration

The system uses an ESP32 connected to:
1. An **NFC Reader** to identify unique filament spools via their UID.
2. A **Load Cell (HX711)** to calculate the remaining weight with precision.
3. A REST API bridge to push data directly into the PostgreSQL database.

## 📦 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed
- PostgreSQL instance (e.g., Supabase or local)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LUPLUV/filaman.git
   cd filaman
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Environment Variables:**
   Create a `.env.local` file and add your credentials:
   ```env
   DATABASE_URL=your_postgres_url
   SESSION_PASSWORD=a_secure_random_string_with_at_least_32_characters
   ```

4. **Database Migration:**
   ```bash
   bunx drizzle-kit push
   ```

5. **Run the development server:**
   ```bash
   bun dev
   ```

## 📝 License
MIT