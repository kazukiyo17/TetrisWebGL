const CUBE_COUNT = 4;

// 七种颜色
const COLORS = [
  vec4(0.0, 0.0, 0.0, 1.0), // 黑
  vec4(1.0, 0.0, 0.0, 1.0), // 红
  vec4(1.0, 1.0, 0.0, 1.0), // 黄
  vec4(0.0, 1.0, 0.0, 1.0), // 绿
  vec4(0.0, 0.0, 1.0, 1.0), // 蓝
  vec4(1.0, 0.0, 1.0, 1.0), // 紫
  vec4(0.0, 1.0, 1.0, 1.0), // 青
];

const CUBES = [
  [
    vec4(0.0, 0.0, 0.0, 1),
    vec4(2.0, 0.0, 0.0, 1),
    vec4(2.0, 0.0, 2.0, 1),
    vec4(0.0, 0.0, 2.0, 1),
    vec4(0.0, 1.0, 0.0, 1),
    vec4(2.0, 1.0, 0.0, 1),
    vec4(2.0, 1.0, 2.0, 1),
    vec4(0.0, 1.0, 2.0, 1),
  ],
];

// 面
const FACES = [
  [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [5, 6, 2, 1],
    [6, 7, 3, 2],
    [7, 4, 0, 3],
    [4, 5, 1, 0],
  ],
];

var CUBE_LIST = [];

// cube 属性
var current = -1; // 当前cube
var pointsArray = [];
var nomalsArray = [];
var colorsArray = [];
var nBuffer = [],
  vBuffer = [],
  cBuffer = [];
var vPosition = [],
  vNormal = [],
  vColor = [];
// 平移变换、旋转变换
var T = [];
var R = [];

// 小块的变换
// var TShapes = [
//   [
//     [0, 0],
//     [1, 0],
//     [0, 1],
//     [1, 1],
//   ],
// ];

// function newShape() {
//   id = 0;
//   current++;
//   CUBE_LIST.push(0);
//   T.push([0, 15, 0]);
//   R.push([0, 0, 0]);
// }

// // 画小方块
// function render1(idx, id, subCubeId) {
//   console.log("idx:", idx, "id:", id, "subCubeId:", subCubeId);
//   var t = translate(TShapes[id][subCubeId][0], 0, TShapes[id][subCubeId][1]);
//   t = mult(translate(T[idx][0], T[idx][1], T[idx][2]), t);
//   var r = mult(rotateY90(R[idx][1]), rotateZ90(R[idx][2]));
//   modelViewMatrix = mult(mult(translate(0.0, 0.0, 0.0), t), r);
//   // console.log("modelViewMatrix:", modelViewMatrix);
//   gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
//   normalMatrix = modelViewMatrix;
//   gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix));

//   pointsCube(idx);
//   bufferCube(idx);
// }

function newCube() {
  current++;
  console.log("current++:", current);
  T.push([0, 15, 0]);
  R.push([0, 0, 0]);
  CUBE_LIST.push(0);
}

function renderCubes() {
  if (current === -1) {
    newCube();
  }
  for (var i = 0; i <= current; i++) {
    renderCube(i);
  }
}

// function renderShapes() {
//   if (current === -1) {
//     newShape();
//   }
//   for (var idx = 0; idx <= current; idx++) {
//     renderShape(idx);
//   }
// }

// function renderShape(idx) {
//   // id 确定是那种形状
//   var id = CUBE_LIST[idx];
//   // 该形状是否可以下落
//   if (idx === current) {
//     if (canFall()) {
//       T[idx][1] -= 1;
//     } else {
//       // updatePointHeights(CUBE_LIST[idx]);
//       newShape();
//     }
//   }
//   // 画小方块
//   for (var i = 0; i < TShapes[id].length; i++) {
//     renderCube(idx, id, i);
//   }
// }

/**
 * 画小方块
 * @param {x} idx
 * @param {*} id
 */
function renderCube(idx) {
  if (idx === current) {
    if (canFall()) {
      T[idx][1] -= 1;
    } else {
      // updatePointHeights(CUBE_LIST[idx]);
      newCube();
    }
  }
  var t = translate(T[idx][0], T[idx][1], T[idx][2]);
  var r = mult(rotateY90(R[idx][1]), rotateZ90(R[idx][2]));
  modelViewMatrix = mult(mult(translate(0.0, 0.0, 0.0), t), r);
  // console.log("modelViewMatrix:", modelViewMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  normalMatrix = modelViewMatrix;
  gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix));

  pointsCube(idx);
  bufferCube(idx);
}

function pointsCube(idx) {
  var vertices = CUBES[0];
  var colorVec = COLORS[0];
  var pointsArr = [];
  var nomalsArr = [];
  var colorsArr = [];
  for (var i = 0; i < FACES[0].length; i++) {
    quad(FACES[0][i], pointsArr, nomalsArr, vertices);
  }

  for (var i = 0; i < pointsArr.length; i++) {
    colorsArr.push(colorVec);
  }
  pointsArray[idx] = pointsArr;
  nomalsArray[idx] = nomalsArr;
  colorsArray[idx] = colorsArr;
}

function bufferCube(idx) {
  nBuffer[idx] = gl.createBuffer();
  vNormal[idx] = gl.getAttribLocation(program, "vNormal");
  vBuffer[idx] = gl.createBuffer();
  vPosition[idx] = gl.getAttribLocation(program, "vPosition");
  cBuffer[idx] = gl.createBuffer();
  vColor[idx] = gl.getAttribLocation(program, "vColor");

  drawBufferTriangle(
    nBuffer[idx],
    nomalsArray[idx],
    vNormal[idx],
    vBuffer[idx],
    pointsArray[idx],
    vPosition[idx],
    cBuffer[idx],
    colorsArray[idx],
    vColor[idx]
  );
}

// 检查方块是否该停止下落
function canFall() {
  // var canFall = true;
  var id = CUBE_LIST[current];
  var faces = FACES[id];
  for (var i = 0; i < faces.length; i++) {
    var face = faces[i]; // 一个面
    var points = [];
    for (var j = 0; j < face.length; j++) {
      var point = vec4(
        CUBES[id][face[j]][0],
        CUBES[id][face[j]][1],
        CUBES[id][face[j]][2],
        1
      );
      var t = translate(T[current][0], T[current][1], T[current][2]);
      var r = mult(rotateY90(R[current][1]), rotateZ90(R[current][2]));
      var matrix = mult(mult(translate(0, 0, 0), t), r);
      point = multMat4Vec4(matrix, point);
      points.push(point);
    }
    // 如果不是平行于xz平面的面，跳过
    if (points[0][1] !== points[1][1] || points[1][1] !== points[2][1]) {
      continue;
    }
    // 获取面中所有的点
    var underCount = 0;
    var innerPoints = traversePoints(
      points[0][0],
      points[0][2],
      points[1][0],
      points[1][2],
      points[2][0],
      points[2][2]
    );
    var height = points[0][1];
    console.log("innerPoints:", innerPoints);
    console.log("height:", height);
    // 如果有三个小于等于POINT_HEIGHTS的，说明停止下落
    for (var j = 0; j < innerPoints.length; j++) {
      var point = innerPoints[j];
      if (height <= POINT_HEIGHTS[point[0]][point[1]]) {
        underCount++;
        if (underCount >= 3) {
          updatePointHeights();
          return false;
        }
      }
    }
  }
  return true;
}

// 更新POINT_HEIGHTS
function updatePointHeights() {
  var id = CUBE_LIST[current];
  var faces = FACES[id];
  for (var i = 0; i < faces.length; i++) {
    var face = faces[i]; // 一个面
    var points = [];
    for (var j = 0; j < face.length; j++) {
      var point = vec4(
        CUBES[id][face[j]][0],
        CUBES[id][face[j]][1],
        CUBES[id][face[j]][2],
        1
      );
      var t = translate(T[current][0], T[current][1], T[current][2]);
      var r = mult(rotateY90(R[current][1]), rotateZ90(R[current][2]));
      var matrix = mult(mult(translate(0, 0, 0), t), r);
      point = multMat4Vec4(matrix, point);
      points.push(point);
    }
    // 如果不是平行于xz平面的面，跳过
    if (points[0][1] !== points[1][1] || points[1][1] !== points[2][1]) {
      continue;
    }
    // 获取面中所有的点
    var underCount = 0;
    var innerPoints = traversePoints(
      points[0][0],
      points[0][2],
      points[1][0],
      points[1][2],
      points[2][0],
      points[2][2]
    );
    var height = points[0][1];
    // 更新POINT_HEIGHTS
    for (var j = 0; j < innerPoints.length; j++) {
      var point = innerPoints[j];
      POINT_HEIGHTS[point[0]][point[1]] = Math.max(
        POINT_HEIGHTS[point[0]][point[1]],
        height
      );
    }
  }
  console.log("POINT_HEIGHTS:", POINT_HEIGHTS);
}

// 获取四个点确定的四边形的所有点
function traversePoints(x1, y1, x2, y2, x3, y3) {
  var points = [];
  // 获取矩形区域的最小和最大 x、y 坐标
  const minX = Math.min(x1, x2, x3);
  const maxX = Math.max(x1, x2, x3);
  const minY = Math.min(y1, y2, y3);
  const maxY = Math.max(y1, y2, y3);

  // 遍历矩形区域内的每个点
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      points.push([x, y]);
    }
  }
  return points;
}

// function traversePoints(x1, y1, x2, y2, x3, y3) {
//   var points = [];
//   // 获取矩形区域的最小和最大 x、y 坐标
//   const minX = Math.min(x1, x2, x3);
//   const maxX = Math.max(x1, x2, x3);
//   const minY = Math.min(y1, y2, y3);
//   const maxY = Math.max(y1, y2, y3);

//   // 遍历矩形区域内的每个点
//   for (let x = minX; x <= maxX; x++) {
//     for (let y = minY; y <= maxY; y++) {
//       // 判断点是否在三角形内部
//       if (isPointInsideTriangle(x, y, x1, y1, x2, y2, x3, y3)) {
//         points.push([x, y]);
//       }
//     }
//   }
//   return points;
// }

function isPointInsideTriangle(x, y, x1, y1, x2, y2, x3, y3) {
  // 使用行列式的方法判断点是否在三角形内部
  const area = 0.5 * (-y2 * x3 + y1 * (-x2 + x3) + x1 * (y2 - y3) + x2 * y3);
  const s =
    (1 / (2 * area)) * (y1 * x3 - x1 * y3 + (y3 - y1) * x + (x1 - x3) * y);
  const t =
    (1 / (2 * area)) * (x1 * y2 - y1 * x2 + (y1 - y2) * x + (x2 - x1) * y);

  return s >= 0 && t >= 0 && s + t <= 1;
}

function canRotateY90() {
  // 检查是否可以旋转
  // x, z >=0 && x, z <= CONTAINER_WIDTH
  var points = pointsArray[current];
  for (var i = 0; i < points.length; i++) {
    // 计算旋转后的坐标
    var point = points[i];
    var t = translate(T[current][0], T[current][1], T[current][2]);
    var r = mult(rotateY90(R[current][1]), rotateZ90(R[current][2]));
    r = mult(rotateY90(1), r);
    var matrix = mult(mult(translate(0, 0, 0), t), r);
    point = multMat4Vec4(matrix, point);
    if (point[0] < 0 || point[0] > CONTAINER_WIDTH) {
      return false;
    }
    if (point[2] < 0 || point[2] > CONTAINER_WIDTH) {
      return false;
    }
  }
  return true;
}

function canRotateZ90() {
  // 检查是否可以旋转
  // x, z >=0 && x, z <= CONTAINER_WIDTH
  var points = pointsArray[current];
  for (var i = 0; i < points.length; i++) {
    // 计算旋转后的坐标
    var point = points[i];
    var t = translate(T[current][0], T[current][1], T[current][2]);
    var r = mult(rotateY90(R[current][1]), rotateZ90(R[current][2]));
    r = mult(rotateZ90(1), r);
    var matrix = mult(mult(translate(0, 0, 0), t), r);
    point = multMat4Vec4(matrix, point);
    if (point[0] < 0 || point[0] > CONTAINER_WIDTH) {
      return false;
    }
    if (point[2] < 0 || point[2] > CONTAINER_WIDTH) {
      return false;
    }
  }
  return true;
}

function canMoveX(step) {
  var points = pointsArray[current];
  for (var i = 0; i < points.length; i++) {
    // 计算旋转后的坐标
    var point = points[i];
    var t = translate(T[current][0], T[current][1], T[current][2]);
    t = mult(translate(step, 0, 0), t);
    var r = mult(rotateY90(R[current][1]), rotateZ90(R[current][2]));
    var matrix = mult(mult(translate(0, 0, 0), t), r);
    point = multMat4Vec4(matrix, point);
    if (point[0] < 0 || point[0] > CONTAINER_WIDTH) {
      return false;
    }
    if (point[2] < 0 || point[2] > CONTAINER_WIDTH) {
      return false;
    }
  }
  return true;
}

function canMoveZ(step) {
  var points = pointsArray[current];
  for (var i = 0; i < points.length; i++) {
    // 计算旋转后的坐标
    var point = points[i];
    var t = translate(T[current][0], T[current][1], T[current][2]);
    t = mult(translate(0, 0, step), t);
    var r = mult(rotateY90(R[current][1]), rotateZ90(R[current][2]));
    var matrix = mult(mult(translate(0, 0, 0), t), r);
    point = multMat4Vec4(matrix, point);
    if (point[0] < 0 || point[0] > CONTAINER_WIDTH) {
      return false;
    }
    if (point[2] < 0 || point[2] > CONTAINER_WIDTH) {
      return false;
    }
  }
  return true;
}

// 键盘事件
window.onkeydown = function (event) {
  var key = String.fromCharCode(event.keyCode);
  switch (key) {
    case "A":
      // 判断是否可以左移, 当前
      if (canMoveX(-1)) {
        T[current][0] -= 1;
      }
      break;
    case "D":
      // 判断是否可以右移
      if (canMoveX(1)) {
        T[current][0] += 1;
      }
      // T[current][0] += 1;
      break;
    case "W":
      if (canMoveZ(-1)) {
        T[current][2] -= 1;
      }
      // T[current][2] -= 1;
      break;
    case "S":
      if (canMoveZ(1)) {
        T[current][2] += 1;
      }
      // T[current][2] += 1;
      break;
    case "E":
      if (canRotateY90()) {
        R[current][1] = (R[current][1] + 1) % 4;
      }
      // R[current][1] = (R[current][1] + 1) % 2;
      break;
    case "R":
      if (canMoveZ()) {
        R[current][2] = (R[current][2] + 1) % 4;
      }
      // console.log("R[current][2]:", R[current][2]);
      // R[current][2] = (R[current][2] + 1) % 2;
      break;
  }
};
