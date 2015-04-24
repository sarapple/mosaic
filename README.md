#Equilateral Triangles

**Equilateral Triangles** is a mini-library that takes an image, and creates an svg of equilateral triangles out of a map of the colors.
Inspired by @qrohlf Trianglify and template used.

#Quickstart

```html
    <div class="triangle-wrapper"></div>
    <script src="./directory-to/d3js.min.js></script>
    <script src="./directory-to/make-triangles.js></script>
    <script>
        t = new Triangles({
                viewBox: "0 0 700 400",
                side: 30
            });
        pattern = t.generate(700, 400);
    </script>
```

#Parameters

2 required paramaters: x-axis and y-axis.
These two values, in conjunction with the "side" value (default: 50), is used to calculate number of
triangle columns and rows.

#Options

| Option  | What it does | Default |
| :-------------: | :------------- | :------------- |
| viewBox  | Changes SVG viewbox | "50 50 600 100" |
| side  | Changes the number of pixels of one side of the triangle  | 50 |
| transition  | If transition is set, then it will be activated on mouseover and mouseleave | null |