import type {Action, ActionType, Gift, User} from "@/types";
import APIHelper from "@/helpers/APIHelper";

export const receivedActions: Map<string, Action> = new Map();

export const storeGifts: Map<string, Gift> = new Map()

export async function getGift(id: string): Promise<Gift | Error | null> {
  if (storeGifts.has(id)) {
    return storeGifts.get(id) as Gift;
  } else {
    const gift = await APIHelper.getGift(id)
    if (!(gift instanceof Error) && gift !== null) {
      storeGifts.set(id, gift as Gift)
    }
    return gift
  }
}

export const users: Map<number, User> = new Map()
export async function getUser(telegramId: number): Promise<User | Error | null> {
  if (users.has(telegramId)) {
    return users.get(telegramId)!
  } else {
    const user = await APIHelper.getUser(telegramId)
    if (!(user instanceof Error) && user !== null) {
      users.set(telegramId, user as User)
    }
    return user
  }
}

export const ACTION_TYPE_PURCHASE: ActionType = 1
export const ACTION_TYPE_SEND: ActionType = 2
export const ACTION_TYPE_RECEIVE: ActionType = 3
