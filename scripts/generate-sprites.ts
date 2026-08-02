import SVGSpriter from "svg-sprite";
import path from "path";
import fs from "fs";
import { globSync } from "glob";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spriter = new SVGSpriter({
  mode: {
    symbol: {
      dest: ".",
      sprite: "sprite.svg",
    },
  },
  shape: {
    id: {
      generator: (_name: string, file: any) => {
        const dirName = path.basename(path.dirname(file.path));
        const fileName = path.basename(file.path, ".svg");
        // Ex: "br-flamengo" ou "pt-flamengo"
        return `${dirName}-${fileName}`.toLowerCase();
      },
    },
  },
});

const files = globSync("public/**/*.svg", {
  ignore: [
    "public/sprite.svg",
    "public/competitions",
    "public/FootballField.svg",
  ],
});

files.forEach((file) => {
  spriter.add(path.resolve(file), null, fs.readFileSync(file, "utf-8"));
});

spriter.compile((error: unknown, result: any) => {
  if (error) throw error;
  fs.writeFileSync("public/sprite.svg", result.symbol.sprite.contents);
});
