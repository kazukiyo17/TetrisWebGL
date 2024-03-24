// 矩阵乘
function multMat4Vec4(mat4, vector) {
  var newVec = [];
  for (var i = 0; i < 4; i++) {
    newVec.push(
      mat4[i][0] * vector[0] +
        mat4[i][1] * vector[1] +
        mat4[i][2] * vector[2] +
        mat4[i][3] * vector[3]
    );
  }
  return newVec;
}
