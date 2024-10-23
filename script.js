!function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://weatherwidget.io/js/widget.min.js';
        fjs.parentNode.insertBefore(js, fjs);
    }
}(document, 'script', 'weatherwidget-io-js');


fetch('https://services.swpc.noaa.gov/text/3-day-forecast.txt')
    .then(response => {
        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        // Return the response text
        return response.text();
    })
    .then(data => {
        // Set the text inside the element with id="aurora-forecast"
        document.getElementById('aurora-forecast').textContent = data;
    })
    .catch(error => {
        // Display error message in case of failure
        document.getElementById('aurora-forecast').textContent = 'Error fetching the forecast: ' + error.message;
    });



// Helper function to calculate the squared distance between two colors
function colorDistance(c1, c2) {
    return (c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2;
}

// Function to find the closest color from the palette
function findClosestPaletteColor(r, g, b, palette) {
    let closestColor = palette[0];
    let minDistance = colorDistance({ r, g, b }, closestColor);

    // Loop through the palette and find the color with the smallest distance
    for (let i = 1; i < palette.length; i++) {
        const distance = colorDistance({ r, g, b }, palette[i]);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = palette[i];
        }
    }

    return closestColor;
}

// Wait until the window is fully loaded
window.onload = function () {

    const palette = [
        { r: 29, g: 32, b: 33 },
        { r: 40, g: 40, b: 40 },
        { r: 50, g: 48, b: 47 },
        { r: 60, g: 56, b: 54 },
        { r: 80, g: 73, b: 69 },
        { r: 102, g: 92, b: 84 },
        { r: 124, g: 111, b: 100 },
        { r: 146, g: 131, b: 116 },
        { r: 251, g: 241, b: 199 },
        { r: 235, g: 219, b: 178 },
        { r: 213, g: 196, b: 161 },
        { r: 189, g: 174, b: 147 },
        { r: 168, g: 153, b: 132 },
        { r: 204, g: 36, b: 29 },
        { r: 251, g: 73, b: 52 },
        { r: 152, g: 151, b: 26 },
        { r: 184, g: 187, b: 38 },
        { r: 215, g: 153, b: 33 },
        { r: 250, g: 189, b: 47 },
        { r: 69, g: 133, b: 136 },
        { r: 131, g: 165, b: 152 },
        { r: 177, g: 98, b: 134 },
        { r: 211, g: 134, b: 155 },
        { r: 104, g: 157, b: 106 },
        { r: 142, g: 192, b: 124 },
        { r: 214, g: 93, b: 14 },
        { r: 254, g: 128, b: 25 }
    ];


    const image = document.getElementById('aurora-img');
    // const canvas = document.getElementById('aurora-canvas');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 800;
    ctx.drawImage(image, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);



    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            let index = (x + (y * imageData.width)) * 4;
            let r = imageData.data[index];
            let g = imageData.data[index + 1];
            let b = imageData.data[index + 2];

            let closestColor = findClosestPaletteColor(r, g, b, palette);

            imageData.data[index] = closestColor.r;   // Red
            imageData.data[index + 1] = closestColor.g; // Green
            imageData.data[index + 2] = closestColor.b; // Blue

        }
    }

    image.parentNode.replaceChild(canvas, image);
    ctx.putImageData(imageData, 0, 0);

};
