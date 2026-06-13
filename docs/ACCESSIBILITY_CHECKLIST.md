# Accessibility checklist

Pragmatic checklist for production. Not a full WCAG audit; covers the highest-
impact, recurring issues for this app.

## Global
- [ ] Every icon-only button has an `aria-label` (nav, verse actions, picker
      close, audio, share, theme toggles).
- [ ] Inputs and textareas have an associated `<label>` or `aria-label`
      (Search, Notes, Prayer form, Study editor, Memory).
- [ ] Visible focus ring on interactive elements (don't remove outlines without
      a replacement).
- [ ] Color is never the only signal (active tab, highlight, completed day also
      use icon/text/weight).
- [ ] Headings are ordered (one `h1` per page, then `h2`/`h3`).

## Modals / sheets / overlays
- [ ] `role="dialog"` + `aria-modal="true"` + an accessible label
      (Bible Picker, Command Palette, Verse Actions sheet, Meditation overlay).
- [ ] **Escape closes** the overlay; a clear close button exists.
- [ ] Focus is sent into the overlay on open and not lost behind it.

## Per-surface spot checks
- [ ] **Bible Picker**: testament tabs reachable by keyboard; book search input
      labelled; chapter grid buttons are real `<button>`s.
- [ ] **Verse Actions**: each action is a labelled button; sheet dismissible.
- [ ] **Command Palette**: input labelled; arrow/enter/escape work.
- [ ] **Settings / Search / Memory / Study editor / Prayer / Review**: form
      controls labelled; primary actions reachable by Tab.
- [ ] **ErrorBoundary fallback**: buttons (Reload / Home / Copy diagnostic) are
      focusable and labelled.

## Quick manual test
1. Unplug the mouse. Tab through `/`, Reader, Bible Picker, Search, Settings.
2. Confirm focus is always visible and ordered logically.
3. Open each overlay, press Escape, confirm it closes and focus returns sensibly.
4. Zoom to 200%; confirm no critical content is clipped or unusable.

## Known gaps
- No automated a11y test in CI (e.g. axe) yet — manual checks above are the gate.
- Screen-reader pass (VoiceOver/NVDA) is recommended before a wide public launch.
