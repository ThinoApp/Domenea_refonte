/** Shared topology lets one mesh morph continuously between architectural symbols. */
export function createArchitecturalForms(THREE) {
  const paths = {};
  const path = name => (paths[name] = new THREE.Path());
  let p = path('arch');
  p.moveTo(-.86, -1.15); p.lineTo(-.86, .26);
  p.bezierCurveTo(-.86, 1.48, .86, 1.48, .86, .26); p.lineTo(.86, -1.15);

  p = path('collection');
  p.moveTo(-1.45, -.65);
  for (let i = 0; i < 3; i++) {
    const x = -1.45 + i * .965;
    p.bezierCurveTo(x + .06, 1.08, x + .905, 1.08, x + .965, -.65);
  }

  p = path('pin');
  p.moveTo(-.025, -1.26);
  p.bezierCurveTo(-.4, -.68, -.94, -.04, -.94, .43);
  p.bezierCurveTo(-.94, 1.51, .94, 1.51, .94, .43);
  p.bezierCurveTo(.94, -.04, .4, -.68, .025, -1.26);
  p.quadraticCurveTo(0, -1.30, -.025, -1.26);

  p = path('portal');
  p.moveTo(-.90, -1.10); p.lineTo(-.90, 1.10);
  p.quadraticCurveTo(-.90, 1.17, -.83, 1.17); p.lineTo(.83, 1.17);
  p.quadraticCurveTo(.90, 1.17, .90, 1.10); p.lineTo(.90, -1.10);
  p.quadraticCurveTo(.90, -1.17, .83, -1.17); p.lineTo(-.82, -1.17);
  p.quadraticCurveTo(-.90, -1.17, -.90, -1.10);

  p = path('house');
  p.moveTo(-1, -1.02); p.lineTo(-1, .32);
  p.quadraticCurveTo(-1, .40, -.93, .46); p.lineTo(-.08, 1.15);
  p.quadraticCurveTo(0, 1.22, .08, 1.15); p.lineTo(.93, .46);
  p.quadraticCurveTo(1, .40, 1, .32); p.lineTo(1, -1.02);
  p.quadraticCurveTo(1, -1.10, .92, -1.10); p.lineTo(-.91, -1.10);
  p.quadraticCurveTo(-1, -1.10, -1, -1.02);

  p = path('ring');
  p.absarc(0, 0, 1.10, Math.PI * 1.25, Math.PI * 1.25 - Math.PI * 2, true);

  p = path('leaf');
  p.moveTo(-.83, -1.10);
  p.bezierCurveTo(-1.22, .32, -.12, 1.04, .96, 1.16);
  p.bezierCurveTo(1.19, -.22, .10, -1.02, -.76, -1.10);
  p.quadraticCurveTo(-.82, -1.12, -.83, -1.10);

  p = path('wave');
  p.moveTo(-1.5, -.35);
  p.bezierCurveTo(-1.1, -.95, -.50, -.95, -.10, -.15);
  p.bezierCurveTo(.35, .82, .85, 1.12, 1.38, .47);
  p.bezierCurveTo(1.72, .04, 1.12, -.38, .80, -.07);

  p = path('key');
  p.moveTo(-.65, -.38);
  p.bezierCurveTo(-1.58, -.39, -1.58, 1.18, -.65, 1.18);
  p.bezierCurveTo(.28, 1.18, .28, -.38, -.65, -.38);
  p.lineTo(-.65, -1.12); p.lineTo(.84, -1.12); p.lineTo(.84, -.68);
  p.lineTo(1.25, -.68);

  const names = Object.keys(paths);
  const steps = 192;
  // Octagonal cross-section: broad mineral faces with small bevels, not a round tube.
  const profile = [[-.125,-.19],[.125,-.19],[.17,-.145],[.17,.145],[.125,.19],[-.125,.19],[-.17,.145],[-.17,-.145]];
  const sides = profile.length;
  const indices = [];
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < sides; j++) {
      const a = i * sides + j, b = i * sides + (j + 1) % sides;
      const c = a + sides, d = b + sides;
      indices.push(a, b, c, b, d, c);
    }
  }
  const firstRim = (steps + 1) * sides, lastRim = firstRim + sides;
  const firstCap = lastRim + sides, lastCap = firstCap + 1;
  for (let j = 0; j < sides; j++) {
    indices.push(firstCap, firstRim + (j + 1) % sides, firstRim + j);
    indices.push(lastCap, lastRim + j, lastRim + (j + 1) % sides);
  }

  function build(centerline) {
    const samples = centerline.getSpacedPoints(steps);
    const closed = samples[0].distanceTo(samples[steps]) < .001;
    const positions = [], uvs = [];
    samples.forEach((point, i) => {
      const before = samples[i === 0 && closed ? steps - 1 : Math.max(0, i - 1)];
      const after = samples[i === steps && closed ? 1 : Math.min(steps, i + 1)];
      const length = Math.hypot(after.x - before.x, after.y - before.y) || 1;
      const nx = -(after.y - before.y) / length, ny = (after.x - before.x) / length;
      profile.forEach(([offset, depth], j) => {
        positions.push(point.x + nx * offset, point.y + ny * offset, depth);
        uvs.push(i / steps * 4, j / sides);
      });
    });
    // Separate cap normals from the long faces; shared normals create dark seams.
    positions.push(...positions.slice(0, sides * 3), ...positions.slice(steps * sides * 3, (steps + 1) * sides * 3));
    uvs.push(...uvs.slice(0, sides * 2), ...uvs.slice(steps * sides * 2, (steps + 1) * sides * 2));
    positions.push(samples[0].x, samples[0].y, 0, samples[steps].x, samples[steps].y, 0);
    uvs.push(0, .5, 4, .5);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    if (closed) {
      const normals = geometry.attributes.normal;
      for (let j = 0; j < sides; j++) {
        const end = steps * sides + j;
        const normal = new THREE.Vector3().fromBufferAttribute(normals, j)
          .add(new THREE.Vector3().fromBufferAttribute(normals, end)).normalize();
        normals.setXYZ(j, normal.x, normal.y, normal.z);
        normals.setXYZ(end, normal.x, normal.y, normal.z);
      }
    }
    return geometry;
  }

  const targets = names.map(name => build(paths[name]));
  const geometry = targets[0].clone();
  geometry.morphAttributes.position = targets.map((target, i) => {
    const attribute = target.attributes.position.clone(); attribute.name = names[i]; return attribute;
  });
  geometry.morphAttributes.normal = targets.map(target => target.attributes.normal.clone());
  targets.forEach(target => target.dispose());
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return { geometry, names };
}
