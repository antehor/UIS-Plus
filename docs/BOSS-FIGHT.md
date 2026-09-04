# UIS+ Boss Fight — Optional Game Mode

Boss Fight is an optional English-language game layer for STU UIS (formerly STU AIS). It does not
change grades or submit anything to STU. It reads the same subject, assessment and catalogue pages that are already
available in the signed-in browser session.

## Game rules

- Every selected subject becomes one boss with **100 HP**.
- The current semester `SÚČET` is the damage dealt to that boss.
- **56 DMG** defeats the boss and completes the mission.
- The official STU catalogue is used to detect the subject's ECTS credits and open its information sheet.

| Score | Rank | Result |
|---:|---|---|
| 92–100 | A — Legendary | Boss defeated |
| 83–91 | B — Epic | Boss defeated |
| 74–82 | C — Elite | Boss defeated |
| 65–73 | D — Veteran | Boss defeated |
| 56–64 | E — Survivor | Boss defeated |
| 0–55 | FX — Defeated | Mission failed / battle in progress |

## Using Boss Fight

1. Reload the unpacked UIS+ extension after installing version 2.3.0.
2. Open the sidebar and enable **Boss Fight — Fun Mode**.
3. Use the **+** control in the sidebar to open **Manage**.
4. Select a semester and add any subjects to the campaign. Selections from different semesters can
   be mixed in one campaign.
5. Follow every selected boss, score, rank and victory bar directly in the sidebar. UIS+ updates
   SÚČET automatically after loading the page, returning to the tab or adding a boss.
6. Use the small refresh control in the campaign header only when an immediate manual recheck is wanted.
7. Open **Details** for the expanded overview and rank table, or **Info** for the official STU subject sheet.

## Local data

The following values are stored in `chrome.storage.local`:

- the Fun Mode switch;
- selected boss keys;
- cached semester and subject links;
- last detected SÚČET and ECTS value;
- the last synchronization time and a local error message, if any.

No additional permission, analytics service or remote server is used.
