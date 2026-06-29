---
id: html.links-images
title: Links & Images
track: html
stage: practice
---

# Practice: Links & Images

Make your webpage interactive and visual by adding links and embedding images.

## Hyperlinks (`<a>`)

The `<a>` (anchor) tag creates a link to another webpage. It requires the `href` attribute to specify the URL:
```html
<a href="https://github.com">Visit GitHub</a>
```

To make the link open in a new tab:
```html
<a href="https://github.com" target="_blank" rel="noopener noreferrer">Visit GitHub</a>
```

## Embedding Images (`<img>`)

The `<img>` tag displays an image. It is a self-closing tag (no `</img>` needed) and requires:
* `src`: The path to the image file or external URL.
* `alt`: The descriptive alternate text for accessibility.

```html
<img src="https://picsum.photos/seed/html-media/300/200" alt="Sample HTML Media" />
```

## Practice Exercise

1. Create an anchor tag linking to `https://google.com`.
2. Embed an image using `https://picsum.photos/seed/web/200/200` as the source.
3. Make sure to provide a valid `alt` description for the image.
