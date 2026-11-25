# Daydreams Night

A Y2K-inspired dark theme for Claude Code in the desktop app: a fine lilac grid, a few four-pointed stars, pink bubbles for your messages, calm cards for Claude's replies, and a framed pixel loader in lime, aqua, lilac and pink.

## Install

**Desktop app:** click **+** next to the prompt box, then **Plugins**, **Add marketplace**, enter `desireedaydreams/daydreams-night`, then **Add plugin**.

**Terminal, inside a Claude Code session** (answer `y`, then choose a scope):

```
/plugin install daydreams-night --marketplace desireedaydreams/daydreams-night
```

**Shell:**

```
claude plugin install daydreams-night --marketplace desireedaydreams/daydreams-night
```

The theme applies by itself when a session starts. There are no commands and no settings. If nothing changes after installing, restart the app.

## What you get

1. **Every session in night mode.** Start a session: the app switches to the dark palette with the grid and stars behind the conversation, even if your system is set to light.
2. **Easier to tell who is speaking.** Send any message, for example "Explain this file": your words sit in a pink bubble, Claude's reply in a dark card, and tool calls in their own rounded row.
3. **See what Claude is doing.** While Claude works, the loader says `THINKING`, `SENDING`, `WRITING` or `WORKING`. With reduced motion turned on, the cells hold still.

## What it runs

- One hooks module, `hooks/register.tsx`. It sets the theme when a session starts and draws two things: the backdrop and the loader.
- It sends nothing, fetches nothing, and does not read or store your messages or files. It changes no tool calls and no permissions.
- `hooks/make-colors.js` is an unchanged copy of the color helper from Claude Code's mod template. It works out the palette and checks contrast.

## Good to know

- Made for the desktop app and tested on macOS only. Needs a Claude Code version that supports mods and themes. On versions without message styling, the colors and backdrop still apply.
- Permission prompts, questions, code blocks, the prompt box and the sidebar keep the app's own shapes.
- Only one theme can be active. If another theme mod is installed, turn one of them off.
- High-contrast settings take precedence and draw plain message rows.

## Remove

In a terminal:

```
claude plugin uninstall daydreams-night@daydreams-night
```

Then restart the app.

## Support

Found a problem? [Open an issue](https://github.com/desireedaydreams/daydreams-night/issues) with your Claude Code version and a screenshot.

## Colors

| Name | Value |
| --- | --- |
| Midnight | `#1B1530` |
| Night | `#120E24` |
| Lavender Ice | `#F4F1FF` |
| Bubblegum | `#FF7AC8` |
| Aqua | `#6FE7FF` |
| Lime | `#C6FF3D` |
| Lilac | `#B9A6FF` |

## License

[MIT](LICENSE), except `hooks/make-colors.js` and `hooks/make-colors.d.ts`. Both come unchanged from Claude Code's mod template (Anthropic) and are not covered by this license.

This is an independent project and not an official Anthropic product.

## Deutsch

Ein von Y2K inspiriertes Nacht-Theme für Claude Code in der Desktop-App. Installieren: **+** neben dem Eingabefeld, **Plugins**, **Add marketplace**, `desireedaydreams/daydreams-night`, dann **Add plugin**. Der Mod liest und sendet keine Daten.
