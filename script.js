document.getElementById('img-fileinput').addEventListener('change', loadIMGFile, false);
document.getElementById('fileinput').addEventListener('change', loadJSONFile, false);

function loadJSONFile() {

    var input, file, fr, lines;

    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('fileinput');

    if (!input) { alert("Um, couldn't find the fileinput element."); }
    else if (!input.files) { alert("This browser doesn't seem to support the `files` property of file inputs."); }
    else if (!input.files[0]) { alert("Please select a file before clicking 'Load'"); }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }

    function receivedText(e) {

        lines = e.target.result;
        console.log(lines);
        var up = new Triangles({
            //transition: "rotate(10 -100,-100)",
            viewBox: "0 0 1000 400",
            side: 50
        });

        //pattern = up.generate(1000, 400);

        up.generateFromJSArray(1000,400, lines);

    }

}

function loadIMGFile() {

    var fileInput, fileDisplayArea, file;

    fileInput = document.getElementById('img-fileinput');
    fileDisplayArea = document.getElementById('fileDisplayArea');
    file = fileInput.files[0];

    var reader = new FileReader();

    reader.onload = function(e) {
        var img, t, pattern, jsonData;
        fileDisplayArea.innerHTML = "";

        // Create a new image.
        img = document.createElement('img');
        img.src = reader.result;
        img.id = "uploaded";

        fileDisplayArea.appendChild(img);

        t = new Triangles({
            //transition: "rotate(10 -100,-100)",
            viewBox: "0 0 1000 400",
            side: 50
        });

        pattern = t.generate(1000, 400);
        jsonData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pattern));

        var a = document.createElement("a");
        a.href = 'data:' + jsonData;
        a.download = "data.json";
        a.textContent = "Download JSON!";
        document.getElementById("download").appendChild(a);

    };
    reader.readAsDataURL(file);

};

exportSVG = function() {

    var svg, serializer, source,url;

    //get svg element.
    svg = document.getElementsByTagName("svg")[0];
    //get svg source.
    serializer = new XMLSerializer();
    source = serializer.serializeToString(svg);

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    //set url value to a element's href attribute.
    document.getElementById("link").href = url;
    //you can download svg file by right click menu.

};

var up = new Triangles({
            //transition: "rotate(10 -100,-100)",
            viewBox: "0 0 1000 400",
            side: 50
        });

up.generateFromJSArray(1000,400, lines);