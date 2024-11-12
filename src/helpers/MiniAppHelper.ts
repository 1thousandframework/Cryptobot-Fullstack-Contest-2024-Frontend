import router from "@/router";

export interface BottomButtonParams {
  text?: string
  color?: string
  is_active?: boolean
  is_visible?: boolean
}

interface BackButton {
  onClick: (callback: () => void) => void
  offClick: (callback: () => void) => void
  show: () => void
  hide: () => void
}

interface BottomButton {
  showProgress: (leaveActive?: boolean) => void
  hideProgress: () => void
  enable: () => void
  disable: () => void
  show: () => void
  hide: () => void
  setText: (text: string) => void
  setParams: (params: BottomButtonParams) => void
  onClick: (handler: () => void) => void
  offClick: (handler: () => void) => void
}

interface WebAppUser {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

interface WebAppInitData {
  query_id: string
  user?: WebAppUser
  auth_date: number
  hash: string
  start_param?: string
}

interface WebApp {
  initData: string
  initDataUnsafe: WebAppInitData
  colorScheme: string
  isExpanded: boolean
  BackButton: BackButton
  MainButton: BottomButton
  SecondaryButton: BottomButton
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  setBottomBarColor: (color: string) => void
  enableVerticalSwipes: () => void
  disableVerticalSwipes: () => void
  onEvent: (eventType: string, eventHandler: () => void) => void
  openTelegramLink: (url: string) => void
  expand: () => void
  close: () => void
  switchInlineQuery: (query: string, chatTypes?: string[]) => void
}

export function WebAppUser(): WebAppUser {
  return MiniApp.initDataUnsafe.user!
}

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp,
    };
  }
}

const MiniApp = window.Telegram.WebApp

let _onMainButtonClickHandler: (() => void) | null = null
export function setOnMainButtonClick(handler: () => void) {
  if (_onMainButtonClickHandler !== null) {
    MiniApp.MainButton.offClick(_onMainButtonClickHandler)
  }
  _onMainButtonClickHandler = handler
  MiniApp.MainButton.onClick(handler)
}

let _backButtonHandler: (() => void) | null = null
export function setBackBtnHandler(handler: () => void) {
  if (_backButtonHandler !== null) {
    MiniApp.BackButton.offClick(_backButtonHandler)
  }
  _backButtonHandler = handler
  MiniApp.BackButton.onClick(handler)
}

export function setBackButtonDefaultHandler() {
  setBackBtnHandler(() => {
    router.back()
  })
}

export default MiniApp
