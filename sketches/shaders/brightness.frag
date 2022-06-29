precision mediump float;

// uniforms are defined and sent by the sketch
uniform int type;
uniform bool grey_scale;
uniform sampler2D texture;

// interpolated texcoord (same name and type as in vertex shader)
varying vec2 texcoords2;

float Epsilon = 1e-10;
 
vec3 RGBtoHCV(vec3 RGB) {
  // Based on work by Sam Hocevar and Emil Persson
  vec4 P = (RGB.g < RGB.b) ? vec4(RGB.bg, -1.0, 2.0/3.0) : vec4(RGB.gb, 0.0, -1.0/3.0);
  vec4 Q = (RGB.r < P.x) ? vec4(P.xyw, RGB.r) : vec4(RGB.r, P.yzx);
  float C = Q.x - min(Q.w, Q.y);
  float H = abs((1.0 * (Q.w - Q.y)) / (6.0 * C + Epsilon) + 1.0 * Q.z);
  return vec3(H, C, Q.x);
}

// returns luma of given texel
float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

float hsv(vec3 texel) {
  vec3 HCV = RGBtoHCV(texel.rgb);
  float S = HCV.y / (HCV.z + Epsilon);
  return HCV.x, S, HCV.z;
}

float hsl(vec3 texel) {
  vec3 HCV = RGBtoHCV(texel.rgb);
  float L = HCV.z - HCV.y * 0.5;
  float S = HCV.y / (1.0 - 1.0 * abs(L * 2.0 - 1.0) + Epsilon);
  return HCV.x, S, L;
}

float HUEtoRGB(float H) {
  float R = abs(H * 6.0 - 3.0) - 1.0;
  float G = 2.0 - abs(H * 6.0 - 2.0);
  float B = 2.0 - abs(H * 6.0 - 4.0);
  return R, G, B;
}

vec3 HCYwts = vec3(0.299, 0.587, 0.114);
float hcy(vec3 texel) {
  // Corrected by David Schaeffer
  vec3 HCV = RGBtoHCV(texel.rgb);
  float Y = texel.r * HCYwts.x + texel.g * HCYwts.y + texel.b * HCYwts.z;
  float temp_x, temp_y, temp_z = HUEtoRGB(HCV.x);
  float Z = temp_x * HCYwts.x + temp_y * HCYwts.y + temp_z * HCYwts.z;
  if (Y < Z) {
    HCV.y *= Z / (Epsilon + Y);
  } else {
    HCV.y *= (1.0 - Z) / (Epsilon + 1.0 - Y);
  }
  return HCV.x, HCV.y, Y;
}

void main() {
  // texture2D(texture, texcoords2) samples texture at texcoords2 
  // and returns the normalized texel color
  vec4 texel = texture2D(texture, texcoords2);
  if (type == 0) {
    gl_FragColor = grey_scale ? vec4((vec3(luma(texel.rgb))), 1.0) : texel;
  } else if (type == 1) {
    gl_FragColor = grey_scale ? vec4((vec3(hsv(texel.rgb))), 1.0) : texel;
  } else if (type == 2) {
    gl_FragColor = grey_scale ? vec4((vec3(hsl(texel.rgb))), 1.0) : texel;
  }
}