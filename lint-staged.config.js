// lint-staged.config.js
module.exports = {
  "**/*.(ts|tsx)": () => ["pnpm tsc --noEmit"],

  "**/*.(ts|tsx|js)": (filenames) => [
    `pnpm eslint --fix ${filenames.join(" ")}`,
    `pnpm prettier --write ${filenames.join(" ")}`,
    `vitest related --run  ${filenames.join(" ")}`,
  ],

  "**/*.(md|json)": (filenames) =>
    `pnpm prettier --write ${filenames.join(" ")}`,
};
