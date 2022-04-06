const path = require("path");
const glob = require("glob");
const { stat } = require("fs").promises;
const { mkdir } = require("fs").promises;
const sharp = require("sharp");

async function validate(filepath) {
  let result = true;

  try {
    await sharp(filepath).metadata();
  } catch (_) {
    result = false;
  }

  return result;
}

glob(`source/**`, async (err, filepaths) => {
  if (err) return;

  for (const filepath of filepaths) {
    if (!(await stat(filepath)).isFile()) continue;
    if (!(await validate(filepath))) continue;

    const newFilepath = filepath.replace(/^source/, "target");

    const newDirpath = path.dirname(newFilepath);

    await mkdir(newDirpath, { recursive: true });

    await sharp(filepath).toFile(newFilepath);
  }
});
