# spaceface
spaceface.org





#### revork
revork <pre> elements, these are animated by the observer, but I need to rework all from the project tags. currently these are <article>-s


#### to implement if needed
in html: <a aria-current='page'
in css: nav a[aria-current='page'] {}
https://www.youtube.com/watch?v=lWu5zf_S9R4&t=183s

size: clamp() instead of media queries
overflow-x clip / instead of hidden
contain paint / dont render objects outside of viewport
margin-block

for articles
css counter
https://www.youtube.com/watch?v=o1HzOJfgugE&t=597s

self hosting fonts
https://www.youtube.com/watch?v=zK-yy6C2Nck

footer
svg
icons
<svg aria-hidden="true" focusable="false" ...>
    <!-- child elements of the inline SVG would go here -->
</svg>

If an SVG is used in a context where it adds meaning to the content then it is not being used as an icon, and requires a different markup pattern:
<svg role="img" focusable="false">
    <title>Accessible Name</title>
     <!-- child elements of the inline SVG would go here -->
</svg>
Note that path and any other direct child elements of the SVG should receive the aria-hidden="true" attribute if they contain no information that should be made accessible.


#### using
vscode kawaii color theme




http://127.0.0.1:5500/docs/index.html

