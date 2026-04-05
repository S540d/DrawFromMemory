# Google Play — Data Safety Section

This document provides the answers for the **Data Safety** form in Google Play Console.
Fill in each section exactly as described below.

---

## 1. Data collection and security

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **No** (for standard releases without Sentry DSN) |
| Is all of the user data collected by your app encrypted in transit? | **Yes** |
| Do you provide a way for users to request that their data is deleted? | **Yes** — via uninstalling the app |

> **If Sentry is enabled in a release:** Change the first answer to **Yes** and complete section 2 below.

---

## 2. Data types (only relevant when Sentry DSN is set)

If a release is built with `EXPO_PUBLIC_SENTRY_DSN` set, the following data is collected:

### App activity — Crash logs

| Field | Value |
|---|---|
| Data type | Crash logs |
| Collected | Yes |
| Shared with third parties | Yes — Sentry, Inc. (crash reporting provider) |
| Required or optional | Optional (feature can be disabled by building without DSN) |
| Processed ephemerally | No — retained by Sentry per their retention policy |
| Purpose | App functionality (crash diagnosis) |

No other data types are collected or shared.

---

## 3. Families — Target audience

| Question | Answer |
|---|---|
| Target age group | **Children** (under 13) and mixed audiences |
| App contains ads | **No** |
| App contains in-app purchases | **No** |
| App requests sensitive permissions | **No** |

### Parental gate

The app implements a **parental gate** (`components/ParentalGate.tsx`) before opening any external link:

- Ko-fi support page (`https://ko-fi.com/s540d`)
- GitHub repository (`https://github.com/S540d/DrawFromMemory`)

The gate presents a multiplication challenge. This meets Google Play Families Policy requirements for external links in children's apps.

---

## 4. Play Families Policy checklist

- [x] No behavioural advertising
- [x] No interest-based advertising
- [x] No data collection beyond crash logs (optional, gated by env var)
- [x] Parental gate in front of all external links
- [x] Privacy policy accurately describes data practices including Sentry
- [x] App does not request location, contacts, camera, or phone permissions
- [ ] **TODO:** Evaluate [Teacher Approved Program](https://play.google.com/about/families/teacher-approved/) participation (optional, requires separate application)

---

## 5. Privacy policy URL for Play Console

Use this URL in the Play Console privacy policy field:

```
https://s540d.github.io/DrawFromMemory/privacy-policy
```

Or directly link to the GitHub raw file:

```
https://raw.githubusercontent.com/S540d/DrawFromMemory/main/docs/PRIVACY_POLICY_EN.md
```

---

*Last updated: April 5, 2026*
