import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import spriteGenerator from "./plugins/SpriteGenerator";
import {createHtmlPlugin} from "vite-plugin-html";

// https://vite.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.BUILD_TS': Math.round(new Date().getTime() / 1000)
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    // createHtmlPlugin({
    //   minify: false,
    //   inject: {
    //     tags: [
    //       {
    //         tag: 'script',
    //         attrs: {src: 'https://telegram.org/js/telegram-web-app.js'},
    //       },
    //     ],
    //   },
    // }),
    spriteGenerator(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // build: {
  //   lib: {
  //     entry: 'src/main.ts',
  //     name: 'MyVueApp',
  //     fileName: (format) => `my-vue-app.${format}.js`,
  //   },
  //   rollupOptions: {
  //     output: {
  //       format: 'iife', // Формат для всех браузеров (немодульный)
  //       compact: true, // Сжатие кода для уменьшения размера
  //     },
  //   },
  //   // Дополнительно, можно отключить чанкинг
  //   chunkSizeWarningLimit: 600, // Установите максимальный формат для предупреждений о размерах чанков
  // }
})
