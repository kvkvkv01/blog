# Sidenotes.js Implementation

This is an implementation of [sidenotes.js](https://github.com/gwern/sidenotes.js) for your blog. Sidenotes.js is a JavaScript library that dynamically repositions footnotes into the left/right margins of a page when the browser window is wide enough.

## Features

- Automatically converts standard Markdown footnotes to sidenotes
- Displays footnotes in the margin when the viewport is wide enough
- Falls back to standard footnotes on narrow viewports
- Supports margin notes with the `marginnote` class
- Highlights sidenotes and their corresponding references on hover
- Collapses long sidenotes with a scrollbar
- Angled return-to-anchor arrows that point to the original reference

## Usage

### Footnotes

To create a footnote, use the standard Markdown footnote syntax:

```markdown
Here's a paragraph with a footnote[^1].

[^1]: This is the footnote content.
```

The footnote will automatically be displayed as a sidenote when the viewport is wide enough.

### Margin Notes

To add a margin note, use the `marginnote` class:

```html
<span class="marginnote">This is a margin note that provides additional context.</span>
```

Margin notes will be displayed in the margin when the viewport is wide enough, and as italicized inline text on narrow viewports.

## Implementation Details

The implementation consists of several JavaScript files:

- `sidenotes.js`: The core library that handles the sidenotes functionality
- `init-sidenotes.js`: Initializes the sidenotes library and sets up the necessary HTML structure
- `footnote-converter.js`: Converts standard Markdown footnotes to the format expected by sidenotes.js
- `margin-notes.js`: Adds support for margin notes

## Customization

You can customize the behavior of sidenotes by modifying the following files:

- `assets/css/sidenotes.css`: Contains the styles for sidenotes
- `assets/js/init-sidenotes.js`: Contains the initialization code for sidenotes

## Credits

Sidenotes.js was developed by [Said Achmiz](https://github.com/gwern) in 2019 for use on [Gwern.net](https://gwern.net/). It is inspired by the [Tufte-CSS sidenotes](https://edwardtufte.github.io/tufte-css/#sidenotes), but with additional features for handling long and frequent sidenotes. 