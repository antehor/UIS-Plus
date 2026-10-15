# UIS+ Boss Fight — Optional Game Mode

Boss Fight is an optional game layer for STU UIS (formerly STU AIS), available in Slovak, Czech and
English. It does not change grades or submit anything to STU. It reads the same subject, assessment
and catalogue pages that are already available in the signed-in browser session.

![Boss Fight campaign details](../assets/boss-fight-arena.png)

## Game rules

- Every selected subject becomes one boss with **100 HP**.
- The current semester `SÚČET` is the damage dealt to that boss.
- **56 points** defeat the boss — the passing threshold of the STU grading scale.
- The official STU catalogue is used to detect the subject's ECTS credits and open its information
  sheet.

| Points | Grade | Result |
|---:|---|---|
| 92–100 | A — výborne / excellent | Boss defeated |
| 83–91 | B — veľmi dobre / very good | Boss defeated |
| 74–82 | C — dobre / good | Boss defeated |
| 65–73 | D — uspokojivo / satisfactory | Boss defeated |
| 56–64 | E — dostatočne / sufficient | Boss defeated |
| 0–55 | FX — nedostatočne / fail | Boss survived |

## Using Boss Fight

1. Open the sidebar and turn on **Boss Fight**.
2. Use the **+** button in the campaign header to open **Spravovať / Manage**.
3. Pick a semester and add subjects to the arena. Subjects from different semesters can be mixed
   in one campaign. **Obnoviť semester / Refresh semester** re-reads that semester's subject list.
4. Follow every boss, its score, grade and the victory bar directly in the sidebar. UIS+ updates
   `SÚČET` automatically after loading a page, returning to the tab or adding a boss.
5. Use the refresh button in the campaign header only when an immediate recheck is wanted.
6. Open **Detaily / Details** for the overview and the grading scale, or **Predmet / Subject** for
   the official STU subject sheet.

![Boss Fight in the sidebar](../assets/boss-fight-sidebar.png)

## Local data

The following values are stored in `chrome.storage.local`:

- the Boss Fight switch;
- selected boss keys;
- cached semester and subject links;
- the last detected `SÚČET` and ECTS value;
- the last synchronization time and a local error message, if any.

No additional permission, analytics service or remote server is used.
