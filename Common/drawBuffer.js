function drawBufferLines(
  nBuff, // 法向量
  norArr, // 法向量数组
  vNor, // 法线属性
  vBuff, // 顶点坐标
  pointArr, // 顶点坐标数组
  vPos, // 顶点坐标
  cBuff, // 颜色
  colorArr, // 颜色数组
  vColor // 颜色
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuff);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(norArr), gl.STATIC_DRAW);

  gl.vertexAttribPointer(vNor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNor);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuff);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointArr), gl.STATIC_DRAW);

  gl.vertexAttribPointer(vPos, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPos);

  gl.bindBuffer(gl.ARRAY_BUFFER, cBuff);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorArr), gl.STATIC_DRAW);

  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  gl.drawArrays(gl.LINES, 0, pointArr.length);
}

function drawBufferTriangle(
  nBuff, // 法向量
  norArr, // 法向量数组
  vNor, // 法线属性
  vBuff, // 顶点坐标
  pointArr, // 顶点坐标数组
  vPos, // 顶点坐标
  cBuff, // 颜色
  colorArr, // 颜色数组
  vColor // 颜色
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuff);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(norArr), gl.STATIC_DRAW);

  gl.vertexAttribPointer(vNor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNor);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuff);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointArr), gl.STATIC_DRAW);

  gl.vertexAttribPointer(vPos, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPos);

  gl.bindBuffer(gl.ARRAY_BUFFER, cBuff);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorArr), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(vColor);
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, pointArr.length);
}
