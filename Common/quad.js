//四边形
function quad(arr, pointArr, norArr, ver) {
  var a = arr[0];
  var b = arr[1];
  var c = arr[2];
  var d = arr[3];
  var t1 = subtract(ver[b], ver[a]);
  var t2 = subtract(ver[c], ver[b]);
  var normal = cross(t1, t2);
  var normal = vec3(normal);
  pointArr.push(ver[a]);
  norArr.push(normal);
  pointArr.push(ver[b]);
  norArr.push(normal);
  pointArr.push(ver[c]);
  norArr.push(normal);
  pointArr.push(ver[a]);
  norArr.push(normal);
  pointArr.push(ver[c]);
  norArr.push(normal);
  pointArr.push(ver[d]);
  norArr.push(normal);
}

// 线框四边形
function quad_line(a, b, c, d, pointArr, norArr, ver) {
  var t1 = subtract(ver[b], ver[a]);
  var t2 = subtract(ver[c], ver[b]);
  var normal = cross(t1, t2);
  var normal = vec3(normal);
  pointArr.push(ver[a]);
  pointArr.push(ver[b]);
  pointArr.push(ver[b]);
  pointArr.push(ver[c]);
  pointArr.push(ver[c]);
  pointArr.push(ver[d]);
  pointArr.push(ver[d]);
  pointArr.push(ver[a]);
  for (var i = 0; i < pointArr.length; i++) {
    norArr.push(normal);
  }
}
