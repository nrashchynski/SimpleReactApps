# ToDo — Agent Onboarding Guide

Expo/React Native mobile app. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Project summary

A small cross-platform ToDo app (iOS / Android / web). Users create, complete, delete, and
browse tasks by day. Tasks are stored locally on the device with AsyncStorage; there is no backend.
The UI language is Russian.

- **Runtime:** Expo SDK 57 (`expo ~57.0.29`), React Native 0.86.3, React 19.2.3, TypeScript ~6.0.3 (strict).
- **Navigation:** React Navigation — a root Drawer wrapping a Bottom Tab navigator.
- **State:** two React Contexts — `TaskProvider`/`useTasks` (task list + persistence) and `ThemeProvider`/`useTheme` (light/dark theme + persistence).
- **Storage:** `@react-native-async-storage/async-storage` — keys `@todo_app_tasks` and `@todo_app_theme`.
- **Calendar:** `react-native-calendars` for the day view.
- **Animations / gestures:** `react-native-reanimated`, `react-native-gesture-handler` (swipe-to-complete/delete).
- **Entry point:** `index.ts` → `registerRootComponent(App)` → `App.tsx`.

### Architecture at a glance

```
index.ts                     # registerRootComponent(App)
App.tsx                      # Providers: SafeAreaProvider > GestureHandlerRootView > ThemeProvider > TaskProvider > AddTaskProvider > AppNavigator
app.json                     # Expo config (name, icons, plugins: datetimepicker, expo-font)
theme/colors.ts              # ThemeColors type + lightColors / darkColors palettes
navigation/AppNavigator.tsx  # NavigationContainer + nav theme; renders <DrawerNavigation/>
navigation/DrawerNavigation.tsx # Drawer route "Tabs" (theme switch); renders <TabsNavigation/>
navigation/TabsNavigation.tsx   # Bottom Tabs (ToDo | Calendar); hosts shared <AddTaskButton/> + <AddTaskModal/> (persist across tabs)
context/TaskContext.tsx      # Task state, CRUD (add/update/toggle/delete), load-on-mount, persistence, sortedTasks
context/ThemeContext.tsx     # Theme state (isDarkMode/isReady/colors), toggle, load + persist via ThemeStorage
context/AddTaskContext.tsx   # Shared selected calendar day + task-form modal state (create/edit)
services/storage.ts          # TaskStorage + ThemeStorage (AsyncStorage)
data/initialTasks.ts         # Seed tasks used on first launch
types/task.ts                # Task type { id, task, completed, createdAt }
utils/dateUtils.ts           # parseTaskDate + getTodayString
screens/ToDoScreen.tsx       # Main list only (Header + ToDo)
screens/CalendarScreen.tsx   # Calendar day picker + filtered task list
components/Header.tsx        # "ToDo List" title
components/ToDo.tsx          # FlatList with Swipeable rows, checkbox, date color; tap task -> edit modal
components/AddTaskButton.tsx # Shared floating "+" button (rendered once, above the tab bar)
components/AddTaskModal.tsx  # Shared task form: create AND edit; prefills text/date, calls onSubmit
```

### Data flow

`TaskContext` loads tasks once from `TaskStorage` on mount (`isLoading` gate in `ToDoScreen`).
Every mutation (`addTask` / `toggleTask` / `deleteTask`) updates React state and writes the full
array back to AsyncStorage via `updateAndSaveTasks`. Dates are stored as display strings
(`"Сегодня"` or `"DD.MM"`), and `parseTaskDate` converts them to timestamps for sorting.
`createdAt` is the due/display date (used by the calendar filter), **not** a real creation timestamp.

`ThemeContext` loads the saved dark-mode flag on mount (`isReady` gates the app in `App.tsx`).
The drawer switch calls `setDarkMode`, which persists to `ThemeStorage` and swaps the palette.

### Shared add-task flow

The "+" button and the add-task modal live at the **tab-container level** (`TabsNavigation` in
`navigation/TabsNavigation.tsx`), not inside a screen. This keeps them mounted when switching tabs
(no remount/flash) and makes task creation available on both the todo and calendar tabs.

`AddTaskContext` owns the app-wide `selectedDate` (a `YYYY-MM-DD` string, default today).
`CalendarScreen` reads/writes it for the selected day; the shared `AddTaskModal` receives it as
`initialDate` and prefills its date picker on open (via an effect keyed on `visible`). So tapping "+"
while a calendar day is selected proposes that exact day. Tasks are formatted as `"Сегодня"` /
`"DD.MM"` on save, matching the calendar filter.

The same modal handles **editing**: tapping a task in `ToDo` calls `openEditModal(task)`, which sets
`editingTask` and prefills the text/date (`taskDateToDateString` converts the stored `"Сегодня"` /
`"DD.MM"` back to `YYYY-MM-DD`). On submit, `TabNavigator` dispatches to `updateTask` when
`editingTask` is set, otherwise to `addTask`. The title switches between "Новая задача" and
"Редактировать задачу". `ToDo` reads `openEditModal` straight from `useAddTask()`.

### Theming

- All colors come from `useTheme().colors` (`ThemeColors` in `theme/colors.ts`). Never hardcode
  colors in components — add a key to both `lightColors` and `darkColors` instead.
- Styles are built per-theme with `const styles = useMemo(() => createStyles(colors), [colors])`,
  where `createStyles(colors)` wraps `StyleSheet.create`. Follow this pattern in new components.
- The accent color is `orange` in both themes (brand); on-accent text uses `colors.accentContrast`.
- `react-native-calendars` is themed via its `theme` prop and remounts on toggle via `key`.
- `@react-navigation` gets a custom `theme` on `NavigationContainer` plus `sceneStyle` on the
  drawer/tabs so screen backgrounds follow the palette.

## Commands

No lockfile other than `package-lock.json` (npm), so use `npx`. This project does **not** use bun.

```bash
npx expo start              # start the dev server (press i / a / w)
npx expo start --ios        # start and open iOS simulator
npx expo start --android    # start and open Android emulator
npx expo start --web        # start the web build
npx tsc --noEmit            # typecheck (must pass)
npx expo lint               # lint (not yet configured — first run scaffolds ESLint)
npx expo-doctor             # diagnose dependency / config issues
npx expo install <pkg>      # ALWAYS use instead of npm/yarn/pnpm add — resolves SDK-compatible versions
npx expo install --fix      # fix incompatible package versions
```

There is **no test framework configured** (no Jest / RTL / test script). If you add tests, wire up
`jest-expo` and add a `test` script to `package.json`.

Run typecheck (and lint, once configured) before declaring any task done.

## Code guidelines

- **TypeScript everywhere.** `strict` is on. `Task` lives in `types/task.ts` — reuse it, don't redeclare inline shapes.
- **Path layout:** routes/screens in `screens/`, reusable UI in `components/`, global state in `context/`,
  persistence in `services/`, pure helpers in `utils/`, static seed data in `data/`, types in `types/`.
  Keep components presentational; put task logic in `TaskContext`.
- **State:** go through `useTasks()`. Never read/write AsyncStorage from a screen or component — add a
  method to `TaskContext` and persist it via `updateAndSaveTasks`.
- **Memoize derived lists** with `useMemo` (see `sortedTasks`), and create new arrays/objects on update
  so React re-renders correctly.
- **Styling:** `StyleSheet.create` per file, placed at the bottom. The accent color is `orange` on white;
  match existing spacing/border-radius. Styles are mobile-first; verify both iOS and Android behaviors
  (e.g. `DateTimePicker` `display` differs per platform).
- **Dates:** keep the existing string format (`"Сегодня"` / `"DD.MM"`) in sync across
  `AddTaskModal`, `CalendarScreen`, `dateUtils`, and `ToDo.getDateColor`. Changing the format requires
  updating all four.
- **User-facing strings are Russian** — keep new copy consistent.
- **Comments** are sparse and Russian; add them only where logic is non-obvious.

## Navigation note (important)

The codebase currently uses **React Navigation** (`@react-navigation/drawer` + `bottom-tabs`), *not*
Expo Router. There is no `expo-router` dependency and no `src/app/` directory. If a future task migrates
to Expo Router, do it deliberately as its own change — don't mix the two.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed.
Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json` (currently **57**).
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v57.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections
   to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship
over-the-air updates (`eas update`) — no local Xcode or Android Studio required. This is an npm project,
so run EAS as `npx eas-cli@latest <command>`; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation).
  Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
  (Both are git-ignored; `app.json` lists the `@react-native-community/datetimepicker` and `expo-font` plugins.)
- Expo Go only includes its bundled native modules. After adding a library with native code, the app
  needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before
  adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
- After adding any native dependency, run `npx expo install <pkg>` and restart with a cleared cache
  (`npx expo start -c`) if Metro behaves oddly.
