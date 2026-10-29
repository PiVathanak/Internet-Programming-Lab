# Component Trees: Earth-Titan Fitness

Stack: Vue 3 + TypeScript, Vue Router, Pinia.
Data flows **props down, events up**. A piece of state is owned by the lowest component that every component needing it shares. Only the owner changes it; children ask for a change by emitting an event.

## Screens

| #   | Screen            | Route       | View component |
| --- | ----------------- | ----------- | -------------- |
| 1   | Home              | `/`         | `HomePage`     |
| 2   | About             | `/about`    | `AboutPage`    |
| 3   | Branch Operations | `/branches` | `BranchesPage` |
| 4   | Login             | `/login`    | `LoginPage`    |

## Shared components

| Component     | Props                                                                              | Events | State it owns |
| ------------- | ---------------------------------------------------------------------------------- | ------ | ------------- |
| `AppHeader`   | `active?: string` (nav item to highlight)                                          | none   | none          |
| `AppFooter`   | `contacts: string[]`, `legalLinks: string[]`, `logoUrl?: string`                   | none   | none          |
| `StatCard`    | `label: string`, `value: string`, `unit?: string`, `icon?: string`, `sub?: string` | none   | none          |
| `ProgressBar` | `percent: string` (for example `'68%'`), `colorClass: string`                      | none   | none          |

---

## Screen 1: Home (`/`)

### Component tree

```
HomePage
├── AppHeader
├── HeroSection
│   └── StatCard ×4
├── PillarCard ×4
├── BranchPreviewSection
│   ├── FilterToggle
│   └── BranchPreviewCard ×3
│       └── ProgressBar
├── CongestionPanel
│   └── ProgressBar ×3
├── BenefitCard ×4
├── MembershipBanner
└── AppFooter
```

### Components

| Component              | Props                                            | Events              | State it owns                                                          |
| ---------------------- | ------------------------------------------------ | ------------------- | ---------------------------------------------------------------------- |
| `HomePage`             | none                                             | none                | `filter`, `branches`, `pillars`, `benefits`, `heroMetrics`, `loadRows` |
| `HeroSection`          | `backgroundUrl: string`, `metrics: HeroMetric[]` | none                | none                                                                   |
| `PillarCard`           | `pillar: Pillar`                                 | none                | none                                                                   |
| `BranchPreviewSection` | `branches: Branch[]`, `filter: 'all' \| 'open'`  | `update:filter`     | none                                                                   |
| `FilterToggle`         | `modelValue: 'all' \| 'open'`                    | `update:modelValue` | none                                                                   |
| `BranchPreviewCard`    | `branch: Branch`                                 | none                | none                                                                   |
| `CongestionPanel`      | `rows: LoadRow[]`                                | none                | none                                                                   |
| `BenefitCard`          | `benefit: Benefit`                               | none                | none                                                                   |
| `MembershipBanner`     | none                                             | `check-status`      | none                                                                   |

### State ownership

| State             | Type              | Owner      | Flows down to                                | Changed by                                                                                         |
| ----------------- | ----------------- | ---------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `filter`          | `'all' \| 'open'` | `HomePage` | `BranchPreviewSection` → `FilterToggle`      | `FilterToggle` emits `update:modelValue`, which `BranchPreviewSection` re-emits as `update:filter` |
| `visibleBranches` | computed          | `HomePage` | `BranchPreviewSection` → `BranchPreviewCard` | derived from `branches` and `filter` (never set directly)                                          |

---

## Screen 2: About (`/about`)

### Component tree

```
AboutPage
├── AppHeader
├── AboutHero
│   └── StatCard ×4
├── PillarCard ×3
│   └── ProgressBar
├── FacilityGallery
│   └── GalleryTile ×3
├── TelemetryPanel
│   ├── StatCard ×4
│   └── CapacityGauge
├── DirectorCard ×3
├── StandardCard ×3
├── CallToAction
└── AppFooter
```

### Components

| Component         | Props                                                           | Events                                | State it owns                                                                             |
| ----------------- | --------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `AboutPage`       | none                                                            | none                                  | `heroStats`, `pillars`, `gallery`, `telemetryStats`, `directors`, `standards` (constants) |
| `AboutHero`       | `backgroundUrl: string`, `stats: HeroMetric[]`                  | none                                  | none                                                                                      |
| `PillarCard`      | `pillar: Pillar` (with metric label, value and fill)            | none                                  | none                                                                                      |
| `FacilityGallery` | `items: GalleryItem[]`                                          | none                                  | none                                                                                      |
| `GalleryTile`     | `src: string`, `alt: string`, `caption: string`, `icon: string` | none                                  | none                                                                                      |
| `TelemetryPanel`  | `stats: TelemetryStat[]`, `loadPercent: number`                 | none                                  | none                                                                                      |
| `CapacityGauge`   | `percent: number`, `label: string`                              | none                                  | none                                                                                      |
| `DirectorCard`    | `director: Director`, `highlight: boolean`                      | none                                  | none                                                                                      |
| `StandardCard`    | `standard: FacilityStandard`                                    | none                                  | none                                                                                      |
| `CallToAction`    | none                                                            | `explore-branches`, `view-membership` | none                                                                                      |

### State ownership

| State                                 | Owner                          | Notes                                                                      |
| ------------------------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| all page content                      | `AboutPage`                    | The page is static: it holds the data and passes each item down as a prop. |
| `explore-branches`, `view-membership` | `AboutPage` handles the events | Both navigate with the router; no state changes.                           |

---

## Screen 3: Branch Operations (`/branches`)

### Component tree

```
BranchesPage
├── AppHeader
├── PageHeading
├── BranchSearchBar
│   └── FilterPill ×2
├── InfoBanner
├── BranchCard ×n
│   ├── StatusBadge
│   ├── ScheduleBlock
│   ├── AmenityTag ×n
│   └── ProgressBar
├── EmptyState
├── TacticalMap
├── EmergencyDispatch
└── AppFooter
```

### Components

| Component           | Props                                                                 | Events                              | State it owns                 |
| ------------------- | --------------------------------------------------------------------- | ----------------------------------- | ----------------------------- |
| `BranchesPage`      | none                                                                  | none                                | `query`, `filter`, `branches` |
| `PageHeading`       | `activeNodes: string`, `syncLabel: string`                            | none                                | none                          |
| `BranchSearchBar`   | `query: string`, `filter: 'all' \| 'open'`, `filters: FilterOption[]` | `update:query`, `update:filter`     | none                          |
| `FilterPill`        | `label: string`, `active: boolean`                                    | `select`                            | none                          |
| `InfoBanner`        | `title: string`, `text: string`                                       | none                                | none                          |
| `BranchCard`        | `branch: Branch`                                                      | `directions` (payload: branch name) | none                          |
| `StatusBadge`       | `open: boolean`, `label: string`                                      | none                                | none                          |
| `ScheduleBlock`     | `regular: string[]`, `holiday: HolidayInfo`                           | none                                | none                          |
| `AmenityTag`        | `icon: string`, `label: string`                                       | none                                | none                          |
| `EmptyState`        | `message: string`                                                     | none                                | none                          |
| `TacticalMap`       | `backgroundUrl: string`, `nodeCount: number`                          | `expand`                            | none                          |
| `EmergencyDispatch` | `contact: DispatchContact`                                            | `call-manager`                      | none                          |

### State ownership

| State             | Type              | Owner          | Flows down to                    | Changed by                                                           |
| ----------------- | ----------------- | -------------- | -------------------------------- | -------------------------------------------------------------------- |
| `query`           | `string`          | `BranchesPage` | `BranchSearchBar`                | `BranchSearchBar` emits `update:query` (`v-model:query`)             |
| `filter`          | `'all' \| 'open'` | `BranchesPage` | `BranchSearchBar` → `FilterPill` | `FilterPill` emits `select`; `BranchSearchBar` emits `update:filter` |
| `visibleBranches` | computed          | `BranchesPage` | `BranchCard` (one per item)      | derived from `branches`, `query` and `filter`                        |
| `branches`        | `Branch[]`        | `BranchesPage` | via `visibleBranches`            | constant for now, later loaded from an API                           |

When `visibleBranches` is empty, `BranchesPage` renders `EmptyState` instead of the card list.

---

## Screen 4: Login (`/login`)

### Component tree

```
LoginPage
├── AppHeader
└── LoginCard
    ├── RoleTabs
    ├── LoginForm
    │   ├── TextField            (email)
    │   ├── PasswordField        (password)
    │   ├── PasswordField        (gym ID / OTP)
    │   ├── RememberCheckbox
    │   └── SubmitButton
    ├── StatusAlert
    └── LoginFooterLinks
```

### Components

| Component          | Props                                                                             | Events                              | State it owns                                              |
| ------------------ | --------------------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| `LoginPage`        | none                                                                              | none                                | `currentRole`, `form`, `isSubmitting`, `granted`, `status` |
| `LoginCard`        | none (layout wrapper with a slot)                                                 | none                                | none                                                       |
| `RoleTabs`         | `modelValue: Role`, `roles: RoleOption[]`                                         | `update:modelValue`                 | none                                                       |
| `LoginForm`        | `role: Role`, `form: LoginCredentials`, `submitting: boolean`, `granted: boolean` | `update:form`, `submit`, `forgot`   | none                                                       |
| `TextField`        | `modelValue: string`, `label: string`, `placeholder: string`, `icon: string`      | `update:modelValue`                 | none                                                       |
| `PasswordField`    | `modelValue: string`, `label: string`, `placeholder: string`, `hint?: string`     | `update:modelValue`                 | `showValue` (show/hide toggle)                             |
| `RememberCheckbox` | `modelValue: boolean`                                                             | `update:modelValue`                 | none                                                       |
| `SubmitButton`     | `label: string`, `loading: boolean`                                               | none (submits the surrounding form) | none                                                       |
| `StatusAlert`      | `visible: boolean`, `text: string`, `icon: string`                                | none                                | none                                                       |
| `LoginFooterLinks` | none                                                                              | `join-facility`, `desk-support`     | none                                                       |

### State ownership

| State                                             | Type                             | Owner           | Flows down to                      | Changed by                                                                    |
| ------------------------------------------------- | -------------------------------- | --------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| `currentRole`                                     | `'member' \| 'staff' \| 'admin'` | `LoginPage`     | `RoleTabs`, `LoginForm`            | `RoleTabs` emits `update:modelValue`                                          |
| `form` (`email`, `password`, `gymId`, `remember`) | `LoginCredentials`               | `LoginPage`     | `LoginForm` → each field component | field components emit `update:modelValue`; `LoginForm` re-emits `update:form` |
| `isSubmitting`, `granted`                         | `boolean`                        | `LoginPage`     | `LoginForm` → `SubmitButton`       | set by `LoginPage` when `LoginForm` emits `submit`                            |
| `status`                                          | `{ visible, text, icon }`        | `LoginPage`     | `StatusAlert`                      | set by `LoginPage` while the login runs                                       |
| `showValue`                                       | `boolean`                        | `PasswordField` | its own input                      | the eye button inside the field; **local**, nobody else needs it              |

On `submit`, `LoginPage` validates the credentials and updates `isSubmitting`, `granted` and `status`. Later it will call an auth store (Pinia) instead of the 1.4 second timer.
