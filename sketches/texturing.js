const WIDTH = 960;
const HEIGHT = 540;

let brightnessShader;
let img;
let type;
let selector;
let grey_scale;

preload = () => {
    brightnessShader = readShader('../../../sketches/shaders/brightness.frag', { varyings: Tree.texcoords2 });
    img = loadImage('../../../img/fire_breathing.jpg');
}

setup = () => {
    // Canvas definition
    let canvas = createCanvas(WIDTH, HEIGHT, WEBGL);
    canvas.parent("sketch-holder");
    noStroke();
    shader(brightnessShader);
    textureMode(NORMAL);
    selector = createSelect();
    selector.parent("sketch-holder");
    selector.position(100, 120);
    selector.option("Luma");
    selector.option("HSV");
    selector.option("HSL");
    selector.selected("RG");
    selector.changed(() => {
        let item = selector.value();
        if (item === "Luma") {
            type = 0;
        } else if (item === "HSV") {
            type = 1;
        } else if (item === "HSL") {
            type = 2;
        }
        brightnessShader.setUniform('type', type);
    });
    grey_scale = createCheckbox('Grey scale', false);
    grey_scale.parent("sketch-holder");
    grey_scale.position(100, 80);
    grey_scale.style('color', 'white');
    grey_scale.input(() => brightnessShader.setUniform('grey_scale', grey_scale.checked()));
    brightnessShader.setUniform('texture', img);
}

draw = () => {
    background(0);
    quad(-WIDTH / 2, -HEIGHT / 2, WIDTH / 2, -HEIGHT / 2, WIDTH / 2, HEIGHT / 2, -WIDTH / 2, HEIGHT / 2);
}