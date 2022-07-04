const WIDTH = 960;
const HEIGHT = 540;

let uvShader;
let type = 0;
let shapeType = 0;
let selector;
let shape;

preload = () => {
    //console.log(texcoords2);
    uvShader = readShader('../sketches/shaders/uv.frag', { matrices: Tree.pMatrix | Tree.mvMatrix, varyings: Tree.texcoords2 });
    
}

setup = () => {
    // Canvas definition
    let canvas = createCanvas(WIDTH, HEIGHT, WEBGL);
    canvas.parent("uv-sketch-holder");
    noStroke();
    // see: https://p5js.org/reference/#/p5/shader
    shader(uvShader);
    // https://p5js.org/reference/#/p5/textureMode
    // best and simplest is to just always used NORMAL
    textureMode(NORMAL);
    selector = createSelect();
    selector.parent("uv-sketch-holder");
    selector.position(100, 80);
    selector.option("RG");
    selector.option("GB");
    selector.option("RB");
    selector.selected("RG");
    selector.changed(() => {
        let item = selector.value();
        if (item === "RG") {
            type = 0;
        } else if (item === "GB") {
            type = 1;
        } else if (item === "RB") {
            type = 2;
        }
        uvShader.setUniform('type', type);
    });
    shape = createSelect();
    shape.parent("uv-sketch-holder");
    shape.position(100, 120);
    shape.option("Square");
    shape.option("Circle");
    shape.option("Triangle");
    shape.selected("Square");
    shape.changed(() => {
        let item = shape.value();
        if (item === "Square") {
            shapeType = 0;
        } else if (item === "Circle") {
            shapeType = 1;
        } else if (item === "Triangle") {
            shapeType = 2;
        }
    })
}

draw = () => {
    background(0);
    // clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
    // https://p5js.org/reference/#/p5/quad
    // It's worth noting (not mentioned in the api docs) that the quad
    // command also adds the texture coordinates to each of its vertices.
    if (shapeType == 0) {
        quad(-WIDTH / 2, -HEIGHT / 2, WIDTH / 2, -HEIGHT / 2, WIDTH / 2, HEIGHT / 2, -WIDTH / 2, HEIGHT / 2);
    } else if (shapeType == 1) {
        circle(0, 0, HEIGHT);
        circle(0.5, 0.5, HEIGHT);
    } else if (shapeType == 2) {
        // let v1 = Vector.random2D();
        // let v2 = Vector.random2D();
        // let v3 = Vector.random2D();
        triangle(-WIDTH/4, HEIGHT/2, 0, -HEIGHT/2, WIDTH/4, HEIGHT/2);
        // beginShape(TRIANGLES);
        // vertex(v1.x, v1.y);
        // vertex(v2.x, v2.y);
        // vertex(v3.x, v3.y);
        // endShape();
    }
}