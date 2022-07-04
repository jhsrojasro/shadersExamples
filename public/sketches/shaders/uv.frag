precision mediump float;

// the texture coordinates varying was defined in 
// the vertex shader by treegl readShader()
// open your console and & see!
uniform int type;
varying vec2 texcoords2;

void main() {
  // glsl swizzling is both handy and elegant
  // see: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Swizzling
  if (type == 0) {
    // red and green screen filter
    gl_FragColor = vec4(texcoords2.xy, 0.0, 1.0);
  } else if (type == 1) {
    // green and blue screen filter
    gl_FragColor = vec4(0.0, texcoords2.xy, 1.0);
  } else if (type == 2) {
    // red and blue screen filter
    gl_FragColor = vec4(texcoords2.x, 0.0, texcoords2.y, 1.0);
  }
}