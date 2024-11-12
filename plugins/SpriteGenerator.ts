// import {ViteDevServer} from "vite";
import sharp from "sharp";
import path from "node:path";
import {NormalizedOutputOptions} from "rollup";
import {HmrContext, ViteDevServer} from "vite";
import * as fs from "node:fs";
function rootDir(subpath: string = '') {
  return path.resolve(__dirname, '../') + subpath
}

function generateSprites(options: string | undefined) {
  const outputDir = options || path.resolve(process.cwd(), 'dist');
  try {
    fs.accessSync(outputDir);
  } catch {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  console.log('Generating sprites...')

  async function generateSprite(outFolder: string, img: sharp.Sharp, name: string, size?: number) {
    const metadata = await img.metadata()
    if (!metadata || !metadata.width) return
    for (let i = 1; i <= 4; i++) {
      let width = metadata.width / 4
      if (size) {
        width = size
      }
      // console.log(width, i)
      await img.resize(width * i)
        .toFile(outputDir + outFolder + '/' + name + i + 'x.png');
    }
    console.log('Generated', name)
    return;
    // img.metadata().then(async (metadata) => {
    //   if (!metadata || !metadata.width) return
    //   for (let i = 1; i <= 4; i++) {
    //     let width = metadata.width / 4
    //     if (size) {
    //       width = size
    //     }
    //     await pattern.resize(width * i)
    //       .toFile(outputDir + name + i + 'x.png');
    //   }
    //   console.log('Generated', name)
    // });
  }

  (async function() {
    // const giftGreenStar = sharp(rootDir('/src/assets/img/gift-green-star.png'))
    // generateSprite('img', giftGreenStar, '/gift-green-star_', 30)
    //
    // const giftRedStar = sharp(rootDir('/src/assets/img/gift-red-star.png'))
    // generateSprite('img', giftRedStar, '/gift-red-star_', 30)
    //
    // const giftDeliciousCake = sharp(rootDir('/src/assets/img/gift-delicious-cake.png'))
    // generateSprite('img', giftDeliciousCake, '/gift-delicious-cake_', 30)

    const icons = sharp(rootDir('/src/assets/sprites/icons.png'))
    generateSprite('sprites', icons, '/icons_')

    const pattern = sharp(rootDir('/src/assets/img/pattern.png'))
    generateSprite('img', pattern, '/pattern_')

    // const balloons = sharp(rootDir('/src/assets/img/balloons.png'))
    // generateSprite('img', balloons, '/balloons_', 100)
  })()
}

export default function spriteGenerator() {
  return {
    name: 'sprite-generator',
    configureServer(server: ViteDevServer) {
      let wasFirstChange = false;
      server.watcher.on('change', () => {
        if (wasFirstChange) return;
        // console.log(server.config.build)
        generateSprites(server.config.publicDir + '/');
        // console.log('Generating sprites....')
        wasFirstChange = true;
      });
    },
    // handleHotUpdate: async ({file, server: {config, ws}, read}) => {
    handleHotUpdate: async (ctx: HmrContext) => {
      // console.log('Handle HotUpdate');
      // console.log(path.dirname(ctx.file), ctx.server.config.publicDir)
      if (path.dirname(ctx.file).startsWith(ctx.server.config.publicDir)) {
        // console.log(ctx.file)
        // const destPath = path.join(config.build.outDir, path.relative(config.publicDir, file));
        // config.logger.info(`Writing contents of ${file} to disk`, {timestamp: true});
        // await fs.access(path.dirname(destPath)).catch(() => fs.mkdir(path.dirname(destPath), {recursive: true}));
        // await fs.writeFile(destPath, await read());
      }
    },
    generateBundle(options: NormalizedOutputOptions | undefined) {
      // console.log('DIR', options?.dir)
      console.log()
      generateSprites(options?.dir + '/')
    },
  };
}
