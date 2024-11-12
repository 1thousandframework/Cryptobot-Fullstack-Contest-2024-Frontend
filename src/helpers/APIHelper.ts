import MiniApp from "@/helpers/MiniAppHelper";
import type {Action, Gift, PaymentUrlData, User} from "@/types";
import {curLang} from "@/locale";
import {INVOICE_LIFETIME} from "@/config";
import router from "@/router";
import {receivedActions} from "@/data";

interface APIResponse {
  ok: boolean
  data: unknown
  error_description?: string
}

export interface Params {
  [key: string]: unknown
}

const invoicesToPing = new Set<number>()

export default class APIHelper {
  static async startPingInvoiceStatus(invoiceId: number) {
    invoicesToPing.add(invoiceId)
    setTimeout(() => {
      invoicesToPing.delete(invoiceId)
    }, INVOICE_LIFETIME * 1000)
    this.checkInvoiceProcessed(invoiceId)
  }

  static async createInvoice(giftId: string): Promise<PaymentUrlData | Error> {
    const result = await this._call('createInvoice', {
      id: giftId,
      lang: curLang.value,
    })
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        const data = result.data as PaymentUrlData
        this.startPingInvoiceStatus(data.invoice_id)
        return data
      } else {
        return new Error(result.error_description)
      }
    }
  }

  static async checkInvoiceProcessed(invoiceId: number) {
    const result = await this._call('checkInvoiceProcessed', {
      invoice_id: invoiceId,
    })
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        // if invoice is not paid.
        if (result.data === false) {
          // If lifetime is not out...
          if (invoicesToPing.has(invoiceId)) {
            // ...try to ping invoice payment status one more time.
            this.checkInvoiceProcessed(invoiceId)
          }
        }
        // If invoice is paid.
        else {
          const data = result.data as Action
          receivedActions.set(data._id, data)
          router.push({
            name: 'congrats',
            state: {
              type: 'purchase',
              actionId: data._id
            }
          })
        }
      } else {
        return new Error(result.error_description)
      }
    }
  }

  static async getGifts(): Promise<Error | Gift[]> {
    const result = await this._call('getGifts')
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        return result.data as Gift[]
      } else {
        return new Error(result.error_description)
      }
    }
  }

  static async getGift(id: string): Promise<Error | Gift | null> {
    const result = await this._call('getGift', {id: id})
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        return result.data === null ? null : result.data as Gift
      } else {
        return new Error(result.error_description)
      }
    }
  }

  static async getUser(telegramId: number): Promise<Error | User | null> {
    const result = await this._call('getUser', {telegram_id: telegramId})
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        return result.data === null ? null : result.data as User
      } else {
        return new Error(result.error_description)
      }
    }
  }

  static async getGiftRecentActions(giftId: string, offset: number) {
    const result = await this._call('getGiftRecentActions', {gift_id: giftId, offset: offset})
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        return result.data as Action[]
      } else {
        return new Error(result.error_description)
      }
    }
  }

  static async receiveGift(actionId: string) {
    const result = await this._call('receiveGift', {
      action_id: actionId,
    })
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        return result.data as Action
      } else {
        return new Error(result.error_description)
      }
    }
  }

  static async getHistory(offset: number) {
    const result = await this._call('getHistory', {offset: offset})
    if (!(result instanceof Error)) {
      if (result.ok) {
        return result.data as Action[]
      } else {
        return new Error(result.error_description)
      }
    }
    return result
  }

  static async getUnsentGifts(offset: number) {
    const result = await this._call('getUnsentGifts', {offset: offset})
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        return result.data as Action[]
      } else {
        return new Error(result.error_description)
      }
    }
  }

  static async getReceivedGifts(telegramId: number, offset: number) {
    const result = await this._call('getReceivedGifts', {telegram_id: telegramId, offset: offset})
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        return result.data as Action[]
      } else {
        return new Error(result.error_description)
      }
    }
  }

  static async getUserPlace(telegramId: number) {
    const result = await this._call('getUserPlace', {telegram_id: telegramId})
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        return result.data as number
      } else {
        return new Error(result.error_description)
      }
    }
  }

  static async getLeaders(offset: number) {
    const result = await this._call('getLeaders', {offset: offset})
    if (result instanceof Error) {
      return result
    } else {
      if (result.ok) {
        return result.data as User[]
      } else {
        return new Error(result.error_description)
      }
    }
  }

  private static async _call(method: string, params?: Params): Promise<Error | APIResponse> {
    const reqInit: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    if (params === undefined) {
      params = {
        user_data: MiniApp.initData
      }
    } else {
      params.user_data = MiniApp.initData
    }
    reqInit.body = JSON.stringify(params)
    try {
      const response = await fetch('https://251403.fornex.cloud/api/' + method, reqInit)
      return await response.json()
    } catch (e) {
      if (e instanceof Error) {
        return e
      } else {
        return new Error('unknown error')
      }
    }
  }
}
