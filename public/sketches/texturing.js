const WIDTH = 960;
const HEIGHT = 540;

let model_transfer;
let iluminacionShader;
let img;
let tipo;
let filtro;
let gris;
let content;
let contentInput;
let style;
let styleInput;
let stylizedCanvas;
let button;

preload = () => {
    iluminacionShader = readShader('../sketches/shaders/iluminacion.frag', { varyings: Tree.texcoords2 });
    content = document.getElementById('content');
    contentInput = document.getElementById('contentInput');
    styleInput = document.getElementById('styleInput');
    style = document.getElementById('style');
    stylizedCanvas = document.getElementById('stylized');
    model_transfer = new mi.ArbitraryStyleTransferNetwork();
    model_transfer.initialize();
    img = loadImage('../img/bird.jpg')
    button = document.getElementById("applyStyle");
}

setup = () => {
    // Canvas definition
    container = document.getElementById("sketch-holder")
    filtro = createSelect();
    filtro.parent("sketch-holder");
    filtro.option("Luma");
    filtro.option("HSV");
    filtro.option("HSL");
    filtro.selected("RG");
    filtro.changed(() => {
        let item = filtro.value();
        if (item === "Luma") {
            tipo = 0;
        } else if (item === "HSV") {
            tipo = 1;
        } else if (item === "HSL") {
            tipo = 2;
        }
        iluminacionShader.setUniform('tipo', tipo);
    });
    button.onclick = stylize;
    contentInput.onchange = handleContentInput;
    styleInput.onchange = handleStyleInput;
    gris = createCheckbox('Escala de Grises', false);
    gris.parent("sketch-holder");
    gris.style('color', 'black');
    gris.input(() => iluminacionShader.setUniform('gris', gris.checked()));
    let canvas = createCanvas(WIDTH, HEIGHT, WEBGL);
    canvas.parent("sketch-holder");
    noStroke();
    shader(iluminacionShader);
    textureMode(NORMAL);
    iluminacionShader.setUniform('texture', img);
}

stylize = () => {
    //model_transfer.initialize();
    model_transfer.stylize(content, style).then((imageData) => {
        stylizedCanvas.getContext('2d').putImageData(imageData, 0, 0);
        img = loadImage(stylizedCanvas.toDataURL());
        iluminacionShader.setUniform('texture', img);
    });
}

draw = () => {
    background(0);
    quad(-WIDTH / 2, -HEIGHT / 2, WIDTH / 2, -HEIGHT / 2, WIDTH / 2, HEIGHT / 2, -WIDTH / 2, HEIGHT / 2);
}

handleContentInput = () => {
    content.src = URL.createObjectURL(contentInput.files[0]);
}

handleStyleInput = () => {
    style.src = URL.createObjectURL(styleInput.files[0]);
}