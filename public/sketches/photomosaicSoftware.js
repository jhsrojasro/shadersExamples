let image_src;
let photos;
let smaller;
let w, h;
let color;
let sclDiv = 50;
let brightnessValues = [];
let brightImages = [];
let video_on;
let reds = [];
let blues = [];
let greens = [];

function preload() {
  image_src = loadImage("../img/messi.jpg");
  video_src = createVideo(["../img/messi-skill.mp4"]);
  video_src.hide(); // by default video shows up in separate dom
  photos = [];
  for (let i = 1; i <= 40; i++) {
    if (i.toString().length == 1) {
      photos.push(loadImage(`../img/paintings2/00000${i}.jpg`));
    } else {
      photos.push(loadImage(`../img/paintings2/0000${i}.jpg`));
    }
  }
}

function setup() {
  createCanvas(650, 420);
  frameRate();
  textSize(30);
  textAlign(CENTER);

  resolution = createSlider(10, 300, sclDiv, 5);
  resolution.position(10, 100);
  resolution.style("width", "80px");
  resolution.input(() => {
    initialize(image_src, resolution.value());
    draw();
  });

  video_on = createCheckbox("video", false);
  video_on.style("color", "magenta");
  video_on.changed(() => {
    if (video_on.checked()) {
      video_src.loop();
      initialize(video_src, resolution.value());
      draw();
    } else {
      video_src.pause();
      initialize(image_src, resolution.value());
    }
  });
  video_on.position(10, 80);

  initialize(image_src, resolution.value());
}

function initialize(src, res) {
  scl = floor(width / res);

  for (let i = 0; i < 256; i++) {
    brightImages.push(i);
  }

  for (let i = 0; i < photos.length; i++) {
    let image = photos[i];

    image.loadPixels();

    let avgr = 0;
    let avgg = 0;
    let avgb = 0;
    for (let j = 0; j < image.height; j++) {
      for (let k = 0; k < image.width; k++) {
        let index = k + j * image.width;
        let r = image.pixels[index * 4];
        let g = image.pixels[index * 4 + 1];
        let b = image.pixels[index * 4 + 2];
        avgr += r;
        avgg += g;
        avgb += b;
      }
    }

    avgr /= image.height * image.width;
    avgg /= image.height * image.width;
    avgb /= image.height * image.width;
    reds[i] = avgr;
    greens[i] = avgg;
    blues[i] = avgb;
  }

  w = floor(src.width / scl);
  h = floor(src.height / scl);
}

function getIndex(r, g, b) {
  let selected = 0.0;
  let complete = false;
  for (let j = 10; j <= 100; j += 10) {
    for (let i = 0; i < photos.length && complete == false; i++) {
      if (
        reds[i] > r - j &&
        reds[i] < r + j &&
        greens[i] > g - j &&
        greens[i] < g + j &&
        blues[i] > b - j &&
        blues[i] < b + j
      ) {
        selected = i;
        complete = true;
        break;
      }
    }
    if (complete) {
      break;
    }
  }

  return selected;
}

function draw() {
  background(255);
  if (!video_on.checked()) {
    background(0);
    smaller = createImage(w, h);
    smaller.copy(
      image_src,
      0,
      0,
      image_src.width,
      image_src.height,
      0,
      0,
      w,
      h
    );
    smaller.loadPixels();
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        let index = x + y * w;
        let r = smaller.pixels[index * 4];
        let g = smaller.pixels[index * 4 + 1];
        let b = smaller.pixels[index * 4 + 2];
        let imageIndex = getIndex(r, g, b);
        image(photos[imageIndex], x * scl, y * scl, scl, scl);
      }
    }
  } else {
    background(255);
    smaller = createImage(w, h);
    smaller.copy(
      video_src,
      0,
      0,
      video_src.width,
      video_src.height,
      0,
      0,
      w,
      h
    );
    smaller.loadPixels();
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let index = x + y * w;
        let r = smaller.pixels[index * 4];
        let g = smaller.pixels[index * 4 + 1];
        let b = smaller.pixels[index * 4 + 2];
        let imageIndex = getIndex(r, g, b);
        image(photos[imageIndex], x * scl, y * scl, scl, scl);
      }
    }
  }
  rect(30, 20, 40, 40);
  text(floor(frameRate()), 50, 50);
}
