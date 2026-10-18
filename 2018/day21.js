let r = [0, 0, 0, 0, 0, 0];
r[2] = 65536;
r[3] = 14070682;

let set = new Set();
let order = [];
let loopStart = null;

while (true) {
  r[1] = r[2] & 255;
  r[3] += r[1];
  r[3] &= 16777215;
  r[3] *= 65899;
  r[3] &= 16777215;

  if (r[2] < 256) {
    if (r[3] === loopStart) {
      console.log(order.at(-1));
    }
    if (set.has(r[3]) && !loopStart) {
      loopStart = r[3];
      console.log("LOOP START!!!", r[3]);
    }
    set.add(r[3]);
    order.push(r[3]);
    if (r[3] === r[0]) {
      break;
    } else {
      r[2] = r[3] | 65536;
      r[3] = 14070682;
    }
  } else {
    r[1] = 0;
    while (true) {
      r[4] = r[1] + 1;
      r[4] *= 256;
      if (r[4] > r[2]) {
        r[2] = r[1];
        break;
      } else {
        r[1] += 1;
      }
    }
  }
}
