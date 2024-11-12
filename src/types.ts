import LottiePlayer from "@/components/LottiePlayer.vue";
import type TheHeader from "@/components/TheHeader.vue";
import type NavigationBar from "@/components/NavigationBar.vue";
import type TheToast from "@/components/TheToast.vue";
import type BottomSheet from "@/components/BottomSheet.vue";

export interface Gift {
  _id?: string
  name: string
  price: number
  asset: string
  supply: number
  purchased_count: number
  created_at?: number
  color: string
  animation: string
  play_algo: string
  availability?: number
}

export function price(gift: Gift): string {
  return  gift.price + ' ' + gift.asset
}

export interface User {
  telegram_id: number,
  first_name: string,
  last_name?: string
  is_premium: boolean,
  avatar_url?: string,
  received_count: number,
}

export interface Action {
  _id: string
  gift_id: string
  actor_telegram_id: number,
  action_type: number
  gift?: Gift
  user?: User
  target_action?: Action
  target_user?: User
  created_at?: number
}

export interface PaymentUrlData {
  invoice_id: number
  mini_app_url: string
  bot_url: string
}

export interface CongratsPushData {
  type: string,
  action: Action
}

export type LottiePlayerType = InstanceType<typeof LottiePlayer>
export type TheHeaderType = InstanceType<typeof TheHeader>
export type NavigationBarType = InstanceType<typeof NavigationBar>
export type BottomSheetType = InstanceType<typeof BottomSheet>
export type TheToastType = InstanceType<typeof TheToast>

export type Size = 'big' | 'medium' | 'small' | 'tiny'

export type ActionType = number
