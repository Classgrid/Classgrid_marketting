import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const targetRoot = path.join(rootDir, "apps", "marketing");
const watchMode = process.argv.includes("--watch");

const directoryMappings = [
  ["app", "app"],
  ["components", "components"],
  ["content", "content"],
  ["lib", "lib"],
  ["sanity", "sanity"],
  ["hooks", "hooks"],
];

const fileMappings = [
  ["app/globals.css", "app/globals.css"],
  ["components.json", "components.json"],
  ["tsconfig.json", "tsconfig.json"],
  ["next.config.ts", "next.config.ts"],
  ["docs/CLASSGRID_PAGES_REFERENCE.md", "docs/CLASSGRID_PAGES_REFERENCE.md"],
  ["docs/CLASSGRID_PAGES_DEEP_DIVE.md", "docs/CLASSGRID_PAGES_DEEP_DIVE.md"],
  ["docs/CLASSGRID_DESIGN_SYSTEM.md", "docs/CLASSGRID_DESIGN_SYSTEM.md"],
];

function ensureWithinTarget(targetPath) {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedRoot = path.resolve(targetRoot);

  if (!resolvedTarget.startsWith(resolvedRoot)) {
    throw new Error(`Refusing to write outside apps/marketing: ${resolvedTarget}`);
  }
}

function resetAndCopyDirectory(fromRelative, toRelative) {
  const sourcePath = path.join(rootDir, fromRelative);
  const targetPath = path.join(targetRoot, toRelative);

  ensureWithinTarget(targetPath);
  fs.rmSync(targetPath, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.cpSync(sourcePath, targetPath, { recursive: true });
  console.log(`[sync] directory ${fromRelative} -> apps/marketing/${toRelative}`);
}

function copyFile(fromRelative, toRelative) {
  const sourcePath = path.join(rootDir, fromRelative);
  const targetPath = path.join(targetRoot, toRelative);

  ensureWithinTarget(targetPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`[sync] file ${fromRelative} -> apps/marketing/${toRelative}`);
}

function removeTargetPath(relativeTargetPath) {
  const fullPath = path.join(targetRoot, relativeTargetPath);
  ensureWithinTarget(fullPath);
  fs.rmSync(fullPath, { recursive: true, force: true });
  console.log(`[sync] removed apps/marketing/${relativeTargetPath}`);
}

if (!fs.existsSync(targetRoot)) {
  throw new Error("apps/marketing directory not found.");
}

function runSync() {
  for (const [fromRelative, toRelative] of directoryMappings) {
    resetAndCopyDirectory(fromRelative, toRelative);
  }

  for (const [fromRelative, toRelative] of fileMappings) {
    copyFile(fromRelative, toRelative);
  }

  // Marketing deployment tree does not host Sanity Studio route.
  removeTargetPath(path.join("app", "studio"));
  removeTargetPath(".eslintrc.json");

  console.log("[sync] complete");
}

function startWatch() {
  let timer = null;

  const scheduleSync = () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      runSync();
      timer = null;
    }, 150);
  };

  const watchTargets = [
    ...directoryMappings.map(([fromRelative]) => path.join(rootDir, fromRelative)),
    ...fileMappings.map(([fromRelative]) => path.join(rootDir, fromRelative)),
  ];

  const watchers = watchTargets
    .filter((target) => fs.existsSync(target))
    .map((target) => fs.watch(target, { recursive: true }, scheduleSync));

  process.on("SIGINT", () => {
    watchers.forEach((watcher) => watcher.close());
    process.exit(0);
  });

  console.log("[sync] watch mode active");
}

runSync();

if (watchMode) {
  startWatch();
}
