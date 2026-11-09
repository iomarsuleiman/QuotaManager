# Everything changed in the fork compared with the original

Comparison date: 2026-11-09.

Original repository: https://github.com/UserJoo9/QuotaManager

Fork: https://github.com/iomarsuleiman/QuotaManager

The baseline is original `main` at `ed31b088247cbb13a0b202b215ac84cb66de0622`
(version 0.5.4). It was fetched again for this comparison. All commits from
that baseline are incorporated in the fork. The list below describes the
current result, including the final sidebar correction, rather than intermediate
layouts that were subsequently replaced.

The complete added/modified/deleted file inventory is
[fork-vs-original-files.tsv](fork-vs-original-files.tsv). It includes source,
tests, documentation, removed legacy files, screenshots and generated assets.

## Dashboard replacement

1. Replaced the original dashboard's vanilla JavaScript page/component/store implementation with React and TypeScript.
2. Added a Vite/Tailwind build, exact npm lockfile, TypeScript configuration and development API/WebSocket proxy.
3. Added shared UI components for fields, numeric controls, choices, switches, sliders, cards, buttons, badges, meters, charts, menus, tooltips, popovers, dialogs, sheets and notifications.
4. Moved page state, session handling, API requests, live data, preferences, formatting, queries and mutations into dedicated frontend modules.
5. Removed the superseded dashboard JavaScript and CSS instead of keeping two dashboard implementations.
6. Kept the shared English/Arabic dictionaries and a canonical design-token stylesheet.
7. Committed the production dashboard and its compressed assets so installed gateways still need no Node.js runtime.

## Visual design and language

8. Replaced animated backgrounds, blobs and glows with neutral light/dark themes and semantic status colors.
9. Added an OKLCH token system for surfaces, text, borders, focus, spacing, radii, motion, shadows and charts.
10. Standardized typography, icon styling, cards, control sizes, focus states and numeric formatting.
11. Added comfortable/compact density and reduced-motion preferences.
12. Reworked dashboard language in English and Egyptian Arabic, including clearer VPN server terminology.
13. Added RTL-aware layout, isolated technical identifiers and appropriate number alignment.
14. Replaced native dashboard selects with themed choice menus supporting keyboard navigation, typeahead, disabled options and focus restoration.
15. Replaced native MAC-address datalists with themed suggestions.
16. Added theme-colored scrollbars without native arrow buttons, with Firefox styling as well.
17. Added reusable illustrations for empty lists and error states.

## Sidebar and navigation, final layout

18. Added grouped navigation, active-page indicators and meaningful attention/person counts; suppressed empty zero-person badges.
19. Added a collapsible icon rail, accessible names, correctly placed RTL/LTR tooltips and saved collapsed state.
20. Added a mobile navigation drawer with an explicit close button.
21. Added an explicit Reorder/Done mode, in-row drag handles, keyboard/touch support, announcements, saved ordering and reset.
22. Preserved stable route IDs and merged newly added destinations into saved orders.
23. Kept row heights stable and revealed the active destination inside the navigation scroll area.
24. Pinned the monthly quota summary outside scrolling navigation so it stays visible. Collapsed mode retains a compact percentage and meter.
25. Put System and Help in the ordinary navigation as full-width page links, matching other destinations.
26. Made Help a real `#/help` page with a searchable glossary; removed the old footer Help action/modal.
27. Kept account/connection status and sign-out in the footer.
28. Used unique group-label IDs for desktop and mobile navigation instances.

## Page-by-page changes

29. Overview: line status, remaining quota and renewal/pace information, live traffic and usage charts, top consumers and actionable attention items in a redesigned layout.
30. People: searchable/filterable/sortable list, counts, clear filters, selection and confirmed bulk blocking/restoring.
31. Person/device editing: desktop side sheets and phone bottom sheets, grouped controls, validation, per-user/device quota, speed, DNS and VPN settings, daily plans and device details.
32. Quota: redesigned bundle/renewal editing, top-ups, new-period confirmation, add-on pack creation/deletion, expiry previews, recurring packs and daily master control.
33. Quota: ported the upstream free-mode toggle and active explanation into React; the backend behavior itself comes from the original repository.
34. Daily plans: kept drafts/previews through live refreshes, added appropriate numeric controls and made the reset-day requirement visible beside the disabled spread option.
35. Insights: redesigned device/window selection and live/history views, with clearer charts, units, summaries and empty states.
36. Internet: redesigned line/remote-access/WAN controls, visible validation, advanced disclosure and confirmations before consequential operations.
37. Network: redesigned speed limits, VPN sharing/shaping, guest settings, device admission, MAC lists and address management.
38. VPN: redesigned status, server/subscription lists and editors, clearer server terminology, validation and connect/disconnect confirmations.
39. Security: redesigned firewall, bans, forwarding, DNS/ad-blocking controls, search/filter/reset flows and confirmations.
40. Share: redesigned file/text sharing and live-transfer views, device cards, selection/download actions, QR access and empty states.
41. Share: retained incoming live-transfer handling on every page after sign-in rather than only while viewing Share.
42. System: redesigned appearance, account, updates, release notes and logs, with consistent controls and feedback.
43. Help: searchable definitions for WAN, LAN, quota, periods, DHCP, DNS, MAC, IP, subnets, VPN, shaping, guests, unknown devices and daily limits.

## Form behavior, alignment and mobile editing

44. Added number fields with visible units, bounds, steppers, presets and inline errors. Typed drafts remain strings until valid.
45. Accepted Arabic-Indic digits and decimal commas; rejected malformed, out-of-range and non-integer values where applicable.
46. Replaced ambiguous renewal-day values with explicit day/month-end/manual choices.
47. Preserved unsaved edits while live data updates, and warned before discarding edits.
48. Added confirmations that describe the change, affected users/devices and recovery before destructive or disruptive actions.
49. Kept gateway mutations pending until completion and refreshed server state before success feedback.
50. Added mobile sheet/keyboard handling, focus management, visible controls above the keyboard and phone-sized input text.
51. Fixed the shared hidden-label layout: labels remain accessible without adding blank space above controls.
52. Aligned Share text submission, firewall bans and passkey actions with their inputs, above helper/error text.
53. Applied hidden-label fixes to People sorting, MAC controls, sliders and daily-plan controls.
54. Put number values and units in separate flex items, preventing long Arabic units from covering values.
55. Kept daily-plan rows aligned when validation appears and allowed narrow grid columns to shrink.

## Passkeys and server changes unique to the fork

56. Added passkey registration, sign-in, listing, renaming and removal to the account UI/API.
57. Added WebAuthn request validation schemas and the pinned `webauthn` dependency.
58. Added platform-authenticator registration and required device verification, with challenge lifetime and credential-count limits.
59. Stored public credential data and signature counters in existing database settings, retaining credentials across updates without a separate schema migration.
60. Added explanations when the browser, address, transport security or device cannot support passkeys.
61. Integrated successful passkey authentication with the existing session cookie and login rate-limiting/failure tracking. A verified passkey sign-in does not require the separate TOTP prompt.
62. Added a hashed-asset route that serves precompressed files with immutable caching and appropriate content types.

## Reliability and performance work

63. Lazy-loaded pages, language dictionaries, drag-and-drop and live-transfer code.
64. Added route prefetching where connection conditions allow it and shared cached/query state.
65. Generated hashed JS/CSS and gzip twins during the frontend build; kept the dashboard entry point uncached.
66. Added a recoverable page error boundary, unknown-page screen, unreachable-gateway screen with retry and post-update reload screen for stale chunks.
67. Added stale-connection feedback and last-update information rather than presenting old values as live.
68. Kept the shell/navigation available when an individual page fails.
69. Added a server not-found page and updated stale-asset/security tests for the new build layout.
70. Enforced LF output for HTML/generated JS/CSS to keep Windows and Linux builds consistent.

Earlier redesign benchmarks and screenshots are preserved under
`docs/redesign-0.6/`. They describe measurements made during that redesign;
they are not fresh performance measurements of this final build.

## Testing, tooling and documentation

71. Added a frontend CI job for exact dependency installation, TypeScript, unit tests, production build and committed-build consistency.
72. Added frontend tests for numeric parsing, preferences/order migration, formatting, menus, field alignment, sidebar behavior and pinned quota placement.
73. Added Python tests for passkeys and the design-token/contrast contract; updated dashboard, API, static-security and server-wiring tests for React.
74. Added an API regression test for free-mode authentication, persistence and dashboard agreement.
75. Made Debian updater fixtures explicit, made tarball path assertions portable and limited POSIX shell tests to appropriate hosts.
76. Added `scripts/run_local.py`, using the real API/SQLite on loopback with isolated `data/local-test` storage and without gateway networking services.
77. Added token export tooling, token documentation/JSON, redesign coverage notes and before/after/device screenshots.
78. Updated English/Arabic READMEs, end-user changelog, architecture/developer guidance and repository guidance.
79. Added the chronological synchronization/change report and this net comparison with its complete file inventory.
80. Ran live login/dashboard/free-mode/static-page checks and a file upload/download byte comparison; removed the temporary upload afterward.
81. Traced repeated local sign-outs to the original server's single shared admin-session token. Moved automated browser validation to a separate port/database using the local runner's new `--data-dir` option, and verified test logins leave the user's session token unchanged. Production login policy remains the original single-admin-session policy.

## Original changes imported, not fork inventions

The fork also incorporated the original repository's three commits `73be78c`,
`f397755` and `ed31b08`. They brought version 0.5.4, Debian/RPM/Arch/tarball
packaging, distro detection, the OpenWrt apk/opkg installer, free-mode accounting
and enforcement, public share/milestone translations, public-upload cancellation
and interrupted-file cleanup, update-note fixes and associated tests.

Those implementations already exist in the baseline. They therefore are not
counted above as new backend capabilities invented in the fork. The custom
React controls and integration work around them are fork changes.

The gateway's main quota/enforcement/network implementation otherwise matches
the fetched original baseline. No release tag was rewritten and no official
release was published. Existing original-repository installation/update
defaults were retained. Backend version remains 0.5.4; frontend package version
0.6.0 labels the redesign.

## Verification record and limits

- Earlier synchronization: 955 Linux backend tests passed; Windows passed 943 with 12 platform-specific skips.
- Previous alignment follow-up: 24 frontend tests, 50 Python UI/token tests and 60 Chromium layouts passed.
- Final sidebar update: 26 frontend tests, TypeScript/build and 50 Python UI/token tests passed.
- Final layout audit: all 66 layouts passed across 11 pages and six desktop/mobile, English/Arabic and light/dark configurations. Fixed-quota placement, mobile navigation, control alignment, numeric-unit separation and page-width overflow checks passed.
- Production output is rebuilt and checked against the committed assets before push.

Local testing does not establish physical gateway forwarding, real-device
traffic enforcement, VPN connectivity, biometric hardware behavior or package
installation on every supported distribution. The local test dashboard stays
at http://127.0.0.1:8080, with `admin` as its initial password.


## Why the local dashboard was signing out during testing

The original server stores one admin session token. Every successful password
or passkey login replaces it, invalidating earlier browser sessions. This was
reproduced with two independent clients against a separate test instance.
The repeated browser-audit logins had therefore been invalidating the session
in the user's local browser.

Automated validation now uses port 8081 and data/layout-test; the user's
instance remains on port 8080 and data/local-test. The runner accepts
`--data-dir` to keep databases, credentials and shared files separate. Test
logins were verified not to change the user's stored session token. No
production authentication policy change was made. On any normal installation,
a second browser/device login can still invalidate the first session, matching
the original repository's behavior.
