# LogiX

Проект в котором реализована удобная ролевая система и система управления транспортом и заказами.
Заказы может давать только клиент.
Обрабатывать и назначать их водителям может как система так и менеджер.
Только менеджер и администратор могу добавлять новый транспорт в базу.
Администратор имеет высшие права, но примерно равен менеджеру.

## Технологический стек

- Runtime: Bun
- Framework: Nest
- JSORM: Prisma
- Database: PostgreSQL (или любая другая через Prisma)
- Crypto: Argon2
- Auth: Passport JWT
- Swagger: @nestjs/swagger

## Быстрый старт

### 1. Клонирование и установка

```bash
git clone https://github.com/DarkMonarch-DN/LogiX.git
cd logix
bun install
```

### 2. Настройка окружения.

Создайте файл .env в корне проекта и заполните переменные:

```env
APPLICATION_PORT=3000

ALLOWED_ORIGIN="http://localhost:5173"

DATABASE_URL="postgresql://login:password@localhost:5432/mydb?shcema=public"

COOKIES_SECRET="cookies_secret"
JWT_SECRET="jwt-access-secret"
JWT_EXPIRES_IN="15m"
REFRESH_SECRET="jwt-refresh-secret"
REFRESH_EXPIRES_IN="7d"
```

### 3. База данных

```bash
bunx prisma generate
bunx prisma migrate dev --name "init"
```

### 4. Запуск приложения. Режим разработки

```bash
bun run start:dev
```

### 5. Продакшн режим

```bash
bun run start:prod
```

## 🔐 Реализованный функционал

- Регистрация пользователей (POST /auth/signup)
- Аутентификация / Вход (POST /auth/signin)
- Хеширование паролей (Argon2)
- Защита роутов через JWT Guard (@UseGuards(JwtAuthGuard))
- Защита роутов через декоратор Roles("client")
- Надежная изоляция данных между пользователями.
