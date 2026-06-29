---
id: html.document-structure
title: Document Structure
track: html
stage: root
---

# HTML Document Structure

Every HTML page requires a standard skeleton to be understood properly by web browsers.

## The Minimal HTML Skeleton

Here is the standard structure of a modern HTML document:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first structured web page.</p>
</body>
</html>
```

## Breakdown of Elements

1. **`<!DOCTYPE html>`**: Tells the browser that this is an HTML5 document.
2. **`<html>`**: The root container element that wraps all content on the page.
3. **`<head>`**: Contains metadata about the page (character encoding, title, stylesheets) that is not visible directly in the body.
4. **`<body>`**: Contains all the visible contents of the webpage (headings, paragraphs, images).
5. **`<title>`**: Sets the title displayed on the browser tab.
