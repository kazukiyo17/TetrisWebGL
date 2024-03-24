var program;
var gl;
var canvas;

var interval;

var dragging = false;
var flag = false;
//视角  ---透视投影视景体参数
var fovy = 45.0; // Field-of-view in Y direction angle (in degrees)
var aspect; // Viewport aspect ratio
var near = 0.5; // Distance of near clipping plane
var far = 100.0; // Distance of far clipping plane
var radius = 28.0; // 半径
var theta = -0.5; // 角度
var phi = -0.5; // 角度
var eye; // 视点
const at = vec3(4.0, 7.0, 4.0);
const up = vec3(0.0, 14.0, 0.0);
// const at = vec3(4.0, 7.0, 4.0);
// const up = vec3(0.0, 14.0, 0.0);
// var radius = 28.0; // 半径
// var theta = -0.5; // 角度
// var phi = -0.5; // 角度
// var flag = false; // 是否旋转

//视图矩阵---x和观察者有关
var viewMatrixLoc; // 视图矩阵的存储地址
// var viewMatrix; // 当前视图矩阵
//投影矩阵
var projectionMatrixLoc; // 投影矩阵的存储地址
// var projectionMatrix; // 当前投影矩阵
//模型视图矩阵---和世界坐标系有关
var modelViewMatrix;
var modelViewMatrixLoc;
//这里设置了新的法向量矩阵
var normalMatrix;
var normalMatrixLoc;

//光源属性
var Tx_light = 0;
var Ty_light = 20;
var Tz_light = 16;

var lightPosition = vec4(Tx_light, Ty_light, Tz_light, 1.0);
var lightAmbient = vec4(0.5, 0.5, 0.5, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

//光源材质   材质属性  ----w因子表达透明度
var materialAmbient = vec4(1.0, 1.0, 1.0, 1.0); //环境光照下物体反射的颜色（物体本身颜色）
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0); //漫反射下物体颜色（物体本身颜色）
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0); //镜面光照颜色
var materialShininess = 2.0; //镜面高光散射半径

var ambientProduct, diffuseProduct, specularProduct;

function init() {
  clearInterval(interval);
  canvas = document.getElementById("glcanvas");
  // gl = WebGLUtils.setupWebGL(canvas);
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  // render();

  interval = setInterval(render, 1000);

  canvas.onmousedown = function (ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    // Start dragging if a moue is in <canvas>
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x;
      lastY = y;
      dragging = true;
    }
  };
  //鼠标离开时
  canvas.onmouseleave = function (ev) {
    dragging = false;
  };
  //鼠标释放
  canvas.onmouseup = function (ev) {
    dragging = false;
  };
  canvas.onmousemove = function (ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    if (dragging) {
      var factor = 100 / canvas.height; // The rotation ratio
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);
      if (flag) {
        if (dx > 0) rotationDirection = false;
        else rotationDirection = true;
      } else {
        theta -= (dx * Math.PI) / 180;
        phi += (dy * Math.PI) / 180;
      }
    }
    (lastX = x), (lastY = y);
  };
}

function render() {
  // canvas = document.getElementById("glcanvas");
  // // gl = WebGLUtils.setupWebGL(canvas);
  // gl = WebGLUtils.setupWebGL(canvas);
  // if (!gl) {
  //   alert(
  //     "Unable to initialize WebGL. Your browser or machine may not support it."
  //   );
  //   return;
  // }

  gl.enable(gl.DEPTH_TEST);
  // gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  aspect = canvas.width / canvas.height;

  // 初始化着色器
  // program = initShaders(gl, "vertex-shader", "fragment-shader");
  // gl.useProgram(program);

  // 设置材质
  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

  // 初始化视图
  initView();

  // 初始化缓冲区
  renderContainer();

  renderCubes();
  // setInterval(render, 1000);

  // requestAnimFrame(render);
}

// 视图初始化
function initView() {
  viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
  normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

  // bufferContainer();

  // 设置视点、视线和上方向
  // const at = vec3(4.0, 7.0, 4.0);
  // const up = vec3(0.0, 14.0, 0.0);
  // var radius = 28.0; // 半径
  // var theta = -0.5; // 角度
  // var phi = -0.5; // 角度
  eye = vec3(
    radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta)
  );
  var viewMatrix = lookAt(eye, at, up);
  // 将视图矩阵传递给viewMatrix变量
  gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));

  // 投影
  // var fovy = 45.0;
  // var near = 0.5;
  // var far = 50.0;
  // var aspect = canvas.width / canvas.height;
  var projectionMatrix = perspective(fovy, aspect, near, far);
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

  // 光源
  lightPosition = vec4(Tx_light, Ty_light, Tz_light, 1.0);
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );
}

// // 尝试画一个立方体
// function renderContainer() {
//   modelViewMatrix = translate(0, 0, 0);
//   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
//   normalMatrix = modelViewMatrix;
//   gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix));
//   bufferContainer();
// }
