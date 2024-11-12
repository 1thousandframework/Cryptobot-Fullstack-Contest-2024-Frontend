import MiniApp from "@/helpers/MiniAppHelper";
import {ref} from "vue";

let colorScheme = localStorage.getItem('theme')
if (!colorScheme) {
  colorScheme = MiniApp.colorScheme || 'light'
  localStorage.setItem('theme', colorScheme)
}

export const curTheme = ref(colorScheme)
