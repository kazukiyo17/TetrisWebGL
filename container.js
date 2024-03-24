// 容器
const CONTAINER_WIDTH = 8.0;
const CONTAINER_LENGTH = 8.0;
const CONTAINER_HEIGHT = 15.0;
var pointsArray_container = []; // 顶点坐标
var nomalsArray_container = []; // 存储与对应点相关联的法向量
var colorsArray_container = [];
var nBuffer_container, vBuffer_container, cBuffer_container;
var vPosition_container, vNormal_container, vColor_container;

var vertices_container = [
  vec4(0.0, 0.0, 0.0, 1.0),
  vec4(0.0, 0.0, CONTAINER_LENGTH, 1.0),
  vec4(CONTAINER_WIDTH, 0.0, CONTAINER_LENGTH, 1.0),
  vec4(CONTAINER_WIDTH, 0.0, 0.0, 1.0),
  vec4(0.0, CONTAINER_HEIGHT, 0.0, 1.0),
  vec4(0.0, CONTAINER_HEIGHT, CONTAINER_LENGTH, 1.0),
  vec4(CONTAINER_WIDTH, CONTAINER_HEIGHT, CONTAINER_LENGTH, 1.0),
  vec4(CONTAINER_WIDTH, CONTAINER_HEIGHT, 0.0, 1.0),
];

// 标记单元格的最高高度
var POINT_HEIGHTS = [];
for (var i = 0; i < CONTAINER_WIDTH + 1; i++) {
  POINT_HEIGHTS.push([]);
  for (var j = 0; j < CONTAINER_LENGTH + 1; j++) {
    POINT_HEIGHTS[i].push(0);
  }
}

/**
 * 容器render
 *
 */
function renderContainer() {
  modelViewMatrix = translate(0, 0, 0);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  normalMatrix = modelViewMatrix;
  gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix));
  // bufferContainer();

  // 标点
  pointsContainer();
  // 创建顶点缓冲区
  nBuffer_container = gl.createBuffer();
  vNormal_container = gl.getAttribLocation(program, "vNormal");
  vBuffer_container = gl.createBuffer();
  vPosition_container = gl.getAttribLocation(program, "vPosition");
  cBuffer_container = gl.createBuffer();
  vColor_container = gl.getAttribLocation(program, "vColor");
  // 绘制
  drawBufferLines(
    nBuffer_container,
    nomalsArray_container,
    vNormal_container,
    vBuffer_container,
    pointsArray_container,
    vPosition_container,
    cBuffer_container,
    colorsArray_container,
    vColor_container
  );
}

// 标点
function pointsContainer() {
  quad_line(
    0,
    1,
    2,
    3,
    pointsArray_container,
    nomalsArray_container,
    vertices_container
  );
  quad_line(
    4,
    5,
    6,
    7,
    pointsArray_container,
    nomalsArray_container,
    vertices_container
  );
  quad_line(
    5,
    6,
    2,
    1,
    pointsArray_container,
    nomalsArray_container,
    vertices_container
  );
  quad_line(
    6,
    7,
    3,
    2,
    pointsArray_container,
    nomalsArray_container,
    vertices_container
  );
  quad_line(
    7,
    4,
    0,
    3,
    pointsArray_container,
    nomalsArray_container,
    vertices_container
  );
  quad_line(
    4,
    5,
    1,
    0,
    pointsArray_container,
    nomalsArray_container,
    vertices_container
  );
  for (var i = 0; i < pointsArray_container.length; i++) {
    colorsArray_container.push(vec4(0.0, 1.0, 0.0, 1.0));
  }
}
