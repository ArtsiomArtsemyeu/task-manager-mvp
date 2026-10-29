# ✅ Менеджер задач

Web-приложение для управления списками задач.

![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?logo=nextdotjs&logoColor=white)   ![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)   ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)   ![Vitest](https://img.shields.io/badge/Vitest-5.0-6E9F18?logo=vitest&logoColor=white)   ![Storybook](https://img.shields.io/badge/Storybook-10.6-FF4785?logo=storybook&logoColor=white)   ![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A5%2020-339933?logo=nodedotjs&logoColor=white)

![Quick start](https://img.shields.io/badge/%F0%9F%9A%80%20Быстрый%20старт-0ea5e9?style=for-the-badge)   ![API](https://img.shields.io/badge/%F0%9F%94%8C%20API-6366f1?style=for-the-badge)   ![Features](https://img.shields.io/badge/%E2%9C%85%20Функции-22c55e?style=for-the-badge)

---

## 📑 Содержание

- [1. Техническая документация](#1-техническая-документация)
  - [1.1. Технологии](#11-технологии-используемые-в-проекте)
  - [1.2. Локальная разработка](#12-инструкция-для-локальной-разработки)
  - [1.3. API](#13-api-appapi)
  - [1.4. Поток данных](#14-описание-организации-данных-в-приложении)
- [2. Описание функций](#2-описание-функций-приложения)
  - [2.1. Карта экранов](#21-карта-экранов)
- [3. Live-demo](#3-live-demo)

---

## 1. Техническая документация

### 1.1. Технологии, используемые в проекте

| Технология | Назначение |
| :--------- | :--------- |
| <img src="https://cdn.simpleicons.org/nextdotjs/000000" width="18" height="18" alt="" /> **Next.js** | Фреймворк (App Router): страницы, API routes, Server Actions, SSR/CSR.<br>[Документация ↗](https://nextjs.org/docs) |
| <img src="https://cdn.simpleicons.org/react/61DAFB" width="18" height="18" alt="" /> **React** | UI-библиотека для клиентских и серверных компонентов.<br>[Документация ↗](https://react.dev) |
| <img src="https://cdn.simpleicons.org/typescript/3178C6" width="18" height="18" alt="" /> **TypeScript** | Статическая типизация исходного кода.<br>[Документация ↗](https://www.typescriptlang.org/docs) |
| 🧩 **Feature-Sliced Design (FSD)** | Слои `app` / `widgets` / `features` / `entities` / `shared` с публичными API слайсов.<br>[Документация ↗](https://feature-sliced.design) |
| <img src="https://cdn.simpleicons.org/eslint/4B32C3" width="18" height="18" alt="" /> **ESLint** | Линтер: Next.js, TypeScript и FSD (`eslint-plugin-fsd-lint`).<br>[Документация ↗](https://eslint.org/docs/latest) |
| <img src="https://cdn.simpleicons.org/vitest/6E9F18" width="18" height="18" alt="" /> **Vitest** | Unit-тесты (в т.ч. browser через Playwright).<br>[Документация ↗](https://vitest.dev) |
| <img src="https://cdn.simpleicons.org/storybook/FF4785" width="18" height="18" alt="" /> **Storybook** | Изолированная разработка и просмотр UI.<br>[Документация ↗](https://storybook.js.org/docs) |
| 🎨 **next-themes** | Переключение темы (default / light / dark).<br>[Репозиторий ↗](https://github.com/pacocoursey/next-themes) |
| 📝 **react-hook-form** | Управление формами (вход, создание и редактирование).<br>[Документация ↗](https://react-hook-form.com) |
| 🔑 **jsonwebtoken** | Выдача и проверка JWT при аутентификации.<br>[Репозиторий ↗](https://github.com/auth0/node-jsonwebtoken) |
| <img src="https://cdn.simpleicons.org/css/1572B6" width="18" height="18" alt="" /> **CSS Modules** | Локальные стили компонентов.<br>[Репозиторий ↗](https://github.com/css-modules/css-modules) |

**📦 Текущие версии технологий**

| Технология | Версия |
| :--------- | :----: |
| Next.js | `16.4.2` |
| React / React DOM | `19.3.0` |
| TypeScript | `5.9.3` |
| ESLint | `9.39.5` |
| eslint-plugin-fsd-lint | `1.2.1` |
| Vitest | `5.0.5` |
| Storybook | `10.6.3` |
| next-themes | `0.4.6` |
| react-hook-form | `7.90.0` |
| jsonwebtoken | `9.0.3` |
| Node.js | `≥ 20` |

> Версии соответствуют установленным в проекте на момент обновления README. Актуальные значения — в `package.json` / `package-lock.json`.

---



### 1.2. Инструкция для локальной разработки

#### 🚀 Быстрый старт

**bash / zsh**

```bash
npm install
npm run playwright:install                         # один раз (для тестов)
npm run dev                                        # → http://localhost:3000
```
**PowerShell**

```powershell
npm install
npm run playwright:install                         # один раз (для тестов)
npm run dev                                        # → http://localhost:3000
```
#### Локальный запуск проекта

**Пошаговая установка**

**1. 🐙 Git** — установка и настройка. [Скачать ↗](https://git-scm.com/downloads)

```bash
git --version
```

**2. 🟢 Node.js** — версия **≥ 20** (LTS). [Скачать ↗](https://nodejs.org)

```bash
node --version
```

**3. 📦 npm** — идёт вместе с Node.js. [Документация ↗](https://docs.npmjs.com)

```bash
npm --version
```

**4. 📥 Зависимости**

```bash
npm install
```

**5. 🎭 Playwright Chromium** — **обязательно один раз** для `npm run test` / `npm run test:run` (Storybook browser-тесты). Повторите после обновления `playwright`:

```bash
npm run playwright:install
```

> Без этого шага прогон тестов упадёт. Для `npm run dev` и `npm run storybook` шаг не нужен.

**6. 🔐 Переменные окружения**

| Переменная | Описание |
| :--------- | :------- |
| `APP_BASE_URL` | Базовый URL (по умолчанию `http://localhost:3000`) |
| `DEFAULT_USER_ID` | Идентификатор пользователя по умолчанию |
| `DEFAULT_USER_EMAIL` | Электронный адрес пользователя по умолчанию |
| `DEFAULT_USER_PASSWORD` | Пароль пользователя по умолчанию |

**7. ▶️ Dev-сервер**

```bash
npm run dev
```

Приложение: [http://localhost:3000](http://localhost:3000)

```bash
npm run build   # production-сборка приложения
npm run start   # запуск собранного приложения
```

#### Запуск плагинов для проверки кода

| Команда | Назначение |
| :------ | :--------- |
| `npm run typecheck` | ✅ Проверка TypeScript |
| `npm run lint` | 🧭 ESLint + правила FSD |
| `npm run test` | 🧪 Unit-тесты (watch) |
| `npm run test:run` | 🧪 Unit-тесты |
| `npm run test:storybook` |  📚 Storybook-тесты |
| `npm run storybook` | 📚 Storybook на [localhost:6006](http://localhost:6006) |
| `npm run build-storybook` | 📚 Статическая сборка Storybook |

**Детали по проверкам**

##### Проверка TypeScript

```bash
npm run typecheck
```

##### Проверка FSD-архитектуры

Правила Feature-Sliced Design в ESLint (`eslint-plugin-fsd-lint`):

```bash
npm run lint
```

Проверяются, в частности:

- запрещённые импорты между слоями;
- cross-slice зависимости;
- публичный API слайсов;
- относительные импорты;
- порядок импортов.

##### Запуск unit-тестов

> **⚠ Предусловие:** перед первым `npm run test` / `npm run test:run` выполните `npm run playwright:install` (см. «Локальный запуск проекта», шаг 5). Иначе Storybook browser-тесты в Vitest завершатся ошибкой. Повторно — только после обновления `playwright`.

```bash
npm run test       # watch
npm run test:run   # один прогон
```

##### Запуск Storybook

```bash
npm run storybook
```

Storybook: [http://localhost:6006](http://localhost:6006)

```bash
npm run build-storybook
```

---

### 1.3. API (`app/api`)

Данные хранятся в JSON-файлы:

| Файл | Путь |
| :--- | :--- |
| 📋 Списки задач | `src/shared/lib/file-storage/data/task-lists.json` |
| ✅ Задачи | `src/shared/lib/file-storage/data/tasks.json` |

**Статусы задачи (**`state`**):** `new` · `in progress` · `done` · `overdue`

**📡 Таблица эндпоинтов**

| Метод | Путь | Параметры | Описание | Куда пишет |
| :---: | :--- | :-------- | :------- | :--------- |
| `POST` | `/api/auth/login` | **Body:** `email`, `password` | Проверяет `DEFAULT_USER_`* из `.env`. Ответ: `{ userSessionPayload: { userId, email } }`. JWT в cookie ставит Server Action, не этот роут. | - |
| `GET` | `/api/data/task-lists` | — | Все списки (DTO + вложенные задачи). | `task-lists.json`, `tasks.json` |
| `POST` | `/api/data/task-lists` | **Body:** `name` (обяз.); `taskIds` | Создаёт список (`id` uuid, `userId` из `DEFAULT_USER_ID`). | `task-lists.json` |
| `GET` | `/api/data/task-lists/[id]` | **Path:** `id` | Один список с задачами. `404`, если нет. | `task-lists.json`, `tasks.json` |
| `PUT` | `/api/data/task-lists/[id]` | **Path:** `id`; **Body:** `name` | Переименование. `404`, если нет. | `task-lists.json` |
| `DELETE` | `/api/data/task-lists/[id]` | **Path:** `id` | Удаляет список (задачи в `tasks.json` не трогает). `404`, если нет. | `task-lists.json` |
| `GET` | `/api/data/tasks` | — | Все задачи. | `tasks.json` |
| `POST` | `/api/data/tasks` | **Body:** `name`, `description`, `state`, `priority`, `dueDate`, `taskListId` | Создаёт задачу и добавляет `id` в `taskIds` списка. | `task-lists.json`, `tasks.json` |
| `GET` | `/api/data/tasks/[id]` | **Path:** `id` | Задача + `taskListId`, `taskListName`. `404`, если нет. | `task-lists.json`, `tasks.json` |
| `PUT` | `/api/data/tasks/[id]` | **Path:** `id`; **Body (опц.):** `name`, `description`, `state`, `priority`, `dueDate` | Обновление. Незаданные поля сохраняются. `404`, если нет. | `tasks.json` |
| `DELETE` | `/api/data/tasks/[id]` | **Path:** `id` | Удаляет задачу и убирает `id` из `taskIds` всех списков. `404`, если нет. | `task-lists.json`, `tasks.json` |

---

### 1.4. Описание организации данных в приложении

#### Описание организации модели данных в приложении

Список задач ссылается на задачи через `taskIds`.

![Модель данных: список задач и задача](./docs/images/data-model.png)

#### Описание потока данных в приложении

![Поток данных от браузера до JSON-файлов и обратно](./docs/images/data-flow.png)

---

## 2. Описание функций приложения

### 2.1. Карта экранов

```mermaid
flowchart LR
  A["🔐 / Вход в систему"] --> B["📋 /lists Списки задач"]
  B --> C["📑 /lists/id Список задач"]
  C --> D["📝 /tasks/id Детали задачи"]
  D --> C
  C --> B
```

| Экран | Маршрут | Что делает |
| :---- | :------ | :--------- |
| 🔐 Вход в систему | `/` | Аутентификация, авторизация |
| 📋 Списки задач | `/lists` | Отображает списки задач |
| 📑 Список задач | `/lists/[id]` | Отображат задачи списка задач |
| 📝 Задача | `/tasks/[id]` | Отображает задачу |

### 🔐 Вход в систему

- Главная (`/`) — форма входа.
- Электронный адрес + пароль → JWT в cookie → редирект на `/lists`.
- Stub-учетная запись из `.env`: `DEFAULT_USER_EMAIL`, `DEFAULT_USER_PASSWORD`.
- <img src="./public/images/icons/eye.svg" width="16" height="16" alt="" /> Отображение / скрытие пароля в поле ввода.
- Клавиша **Alt+C** — подстановка stub-данных.

### 📋 Списки задач

- Карточки всех списков.
- Поиск по названию.
- Создание списка (модальное окно); **Alt+C** — stub-название.
- <img src="./public/images/icons/edit.svg" width="16" height="16" alt="" /> Переименование и <img src="./public/images/icons/trash.svg" width="16" height="16" alt="" /> удаление через меню карточки (<img src="./public/images/icons/more-vertical.svg" width="16" height="16" alt="" />).
- Клик по карточке → `/lists/[id]`.

### 📑 Список задач

- Заголовок, количество задач, прогресс.
- Таблица: название, статус, приоритет, дедлайн, действия.
- Фильтр по статусу.
- Автосортировка: незавершённые выше; просроченные первыми → ближайший дедлайн → приоритет (без клика по колонкам).
- Подсветка скорого дедлайна (≤ 48 ч) и просроченных задач.
- Смена статуса в таблице с откатом при ошибке.
- Добавление / Изменение / Удаление через модальные окна; **Alt+C** в форме добавления.
- Переход на `/tasks/[id]`.
- <img src="./public/images/icons/arrow-left.svg" width="16" height="16" alt="" /> Назад к `/lists`.

### 📝 Задача

- <img src="./public/images/icons/arrow-left.svg" width="16" height="16" alt="" /> Назад к списку (`К списку «…»`).
- Заголовок, описание (или «Описание не указано»).
- Приоритет, дедлайн с подсветкой дедлайн в ближайшие 48 часов / просроченные.
- Смена статуса с откатом при ошибке.
- <img src="./public/images/icons/edit.svg" width="16" height="16" alt="" /> Редактирование и <img src="./public/images/icons/trash.svg" width="16" height="16" alt="" /> удаление; после удаления — возврат к списку.

### 🎨 Тема оформления

- Переключатель в шапке <img src="./public/images/icons/color-bucket.svg" width="16" height="16" alt="" />.
- Режимы: **системная**, **светлая**, **тёмная**.
- Выбор сохраняется и применяется ко всему UI.

### ⚠️ Ошибки и загрузка

- Скелетоны на загрузку данных для страниц: `/lists`, `/lists/[id]`, `/tasks/[id]`.
- <img src="./public/images/icons/not-found.svg" width="16" height="16" alt="" /> 404 — `ErrorView` для неизвестного маршрута / для ситуации, когда запрашиваемый ресурс не найден.
- <img src="./public/images/icons/server-error.svg" width="16" height="16" alt="" /> 500 — экран ошибки с повтором действия.

---

## 3. Live-demo

![Live-demo](./docs/images/live-demo.gif)
