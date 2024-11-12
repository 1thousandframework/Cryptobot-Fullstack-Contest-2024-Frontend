import './styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SpriteHelper from "@/helpers/SpriteHelper";
import MiniApp, {setBackButtonDefaultHandler} from "@/helpers/MiniAppHelper";
import {loadLang} from "@/locale";
import IconsHelper from "@/helpers/IconsHelper";

if (MiniApp === null) {
  throw 'No mini app found.'
}

const languageLoading = loadLang(localStorage.getItem('lang') || MiniApp.initDataUnsafe.user?.language_code)

function updateColorScheme() {
  if (MiniApp.colorScheme === 'dark') {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
}
MiniApp.onEvent('themeChanged', updateColorScheme)
updateColorScheme()

setBackButtonDefaultHandler()
MiniApp.expand()
MiniApp.disableVerticalSwipes()

const root = document.documentElement;
root.style.setProperty('--separator-scale', (1 / devicePixelRatio).toString());
root.style.setProperty('--pattern-url', 'url(/img/pattern_' + SpriteHelper.scale() + 'x.png)');

SpriteHelper.init()

for (const icon of IconsHelper.icons) {
  IconsHelper.generate(icon).then(url => {
    root.style.setProperty('--icon_' + icon.name, 'url(' + url + ')');
    if (icon.nightColor) {
      IconsHelper.generate(icon, true).then(url => {
        root.style.setProperty('--iconNight_' + icon.name, 'url(' + url + ')');
      })
    }
  })
}

const app = createApp(App)

app.use(router)

languageLoading.then(() => {
  app.mount('#app')
})
