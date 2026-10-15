# UIS+ Privacy Policy

**Effective date:** 15 October 2026

UIS+ (formerly AIS+) is a local browser extension for the STU University Information System at
`is.stuba.sk`.

## Data collection

UIS+ does not collect, transmit, sell or share personal, academic or browsing data. There is no
analytics service, advertising SDK, remote API or extension-operated server. The only site UIS+
communicates with is `is.stuba.sk`.

UIS+ never reads, stores or transmits your password. On the sign-in page it only restyles STU's own
form, which is submitted by STU's page exactly as without the extension.

## Local storage

The extension uses the browser `storage` permission only for these values:

- whether UIS+ is enabled;
- light, dark or system theme;
- compact mode;
- collapsed sidebar state;
- English, Slovak or Czech panel language;
- whether experimental Boss Fight mode is enabled;
- the UIS menu discovered on your personal administration page;
- your timetable events, cached after you open the timetable, to list upcoming lessons;
- open submission places (subject, title, deadline, link) to list assignments due;
- selected subject bosses, cached semester links, SÚČET values and detected ECTS credits.

These preferences stay in the browser profile and can be removed by uninstalling the extension or
clearing its storage.

## Pages UIS+ reads on its own

To show assignments due, UIS+ reads the student-portal list of submission places
(`/auth/student/odevzdavarny.pl`) at most every ten minutes while you use the home page. When Boss
Fight is enabled, it reads your subject list and assessment pages. These are read-only requests to
`is.stuba.sk` inside your signed-in session — the same pages you can open yourself. UIS+ never
submits a form or changes anything in UIS, and nothing it reads is sent anywhere.

## Website access

Access is limited to `https://is.stuba.sk/*`. UIS+ reads the page structure to restyle it and to find
the real navigation links available to the signed-in user. It does not read or modify other websites.

## Contact

Questions can be opened as a [GitHub issue](https://github.com/antehor/UIS-Plus/issues) or sent to the
maintainer through [LinkedIn](https://www.linkedin.com/in/yehor-halytskyi-392b92427/).
