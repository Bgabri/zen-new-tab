
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
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('aurora-forecast').textContent = data;
    })
    .catch(error => {
        document.getElementById('aurora-forecast').textContent = 'Error fetching the forecast: ' + error.message;
    });


function colorDistance(c1, c2) {
    return (c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2;
}

function findClosestPaletteColor(r, g, b, palette) {
    let closestColor = palette[0];
    let minDistance = colorDistance({ r, g, b }, closestColor);

    for (let i = 1; i < palette.length; i++) {
        const distance = colorDistance({ r, g, b }, palette[i]);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = palette[i];
        }
    }

    return closestColor;
}

function distributeError(imageData, x, y, errR, errG, errB) {
    function applyError(x, y, factor) {
        if (x >= 0 && x < imageData.width && y >= 0 && y < imageData.height) {
            let index = (y * imageData.width + x) * 4;
            imageData.data[index] = imageData.data[index] + errR * factor;
            imageData.data[index + 1] = imageData.data[index + 1] + errG * factor;
            imageData.data[index + 2] = imageData.data[index + 2] + errB * factor;
        }
    }
    // Floyd-Steinberg error distribution (right and below)
    applyError(x + 1, y, 7 / 16);
    applyError(x - 1, y + 1, 3 / 16);
    applyError(x, y + 1, 5 / 16);
    applyError(x + 1, y + 1, 1 / 16);
}

function quantize(imageData, palette) {
    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            let index = (y * imageData.width + x) * 4;
            let r = imageData.data[index];
            let g = imageData.data[index + 1];
            let b = imageData.data[index + 2];

            let c = findClosestPaletteColor(r, g, b, palette);

            imageData.data[index] = c.r;
            imageData.data[index + 1] = c.g;
            imageData.data[index + 2] = c.b;

            // distributeError(imageData, x, y, r-c.r, g-c.g, b-c.b)

        }

    }

    return imageData;
}
let auroraImg;
let auroraCanvas;

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
    auroraImg = document.getElementById('aurora-img');
    auroraCanvas = document.createElement('canvas');
    const ctx = auroraCanvas.getContext('2d');
    auroraCanvas.onmouseenter = showOriginalAuroraForecast;
    auroraImg.onmouseout = showPosterizedAuroraForecast;
    // auroraCanvas.onmouseout = auroraImgOver;

    auroraCanvas.width = 800;
    auroraCanvas.height = 800;
    ctx.drawImage(auroraImg, 0, 0);
    let imageData = ctx.getImageData(0, 0, auroraCanvas.width, auroraCanvas.height);

    quantize(imageData, palette);

    auroraImg.parentNode.replaceChild(auroraCanvas, auroraImg);
    ctx.putImageData(imageData, 0, 0);

};


function showOriginalAuroraForecast(element) {
    // print('hi');
    console.log('hi');
    const p = document.getElementById('aurora-display');
    p.replaceChildren(auroraImg)
    // auroraCanvas.parentNode.replaceChild(auroraImg, auroraCanvas);

}

function showPosterizedAuroraForecast(element) {
    console.log('bye');
    const p = document.getElementById('aurora-display');
    p.replaceChildren(auroraCanvas)
}