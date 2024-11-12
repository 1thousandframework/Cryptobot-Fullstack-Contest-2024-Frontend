import type {User} from "@/types";

// f formats string with parameters in it.
export function f(template: string, ...args: (number | string)[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== 'undefined' ? String(args[index]) : match;
  });
}

const colors = ['red', 'orange', 'violet', 'green', 'cyan', 'blue', 'pink']
export function getCSSClassByTelegramId(telegramId: number): string {
  return '_' + colors[Math.abs(telegramId) % 7];
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function formatQuantity(quantity: number) {
  if (quantity >= 1000000) {
    return parseFloat((quantity / 1000000).toFixed(1)) + 'M'
  } else if (quantity >= 1000) {
    return parseFloat((quantity / 1000).toFixed(1)) + 'K'
  } else {
    return quantity
  }
}

export function fullName(user: User): string {
  let userFullName = user.first_name
  if (user.last_name) {
    userFullName += ' ' + user.last_name
  }
  return userFullName
}

export function isSameDate(ts1: number, ts2: number): boolean {
  // console.log(new Date(ts1*1000), new Date(ts2*1000))
  const date1 = new Date(ts1 * 1000)
  const date2 = new Date(ts2 * 1000)
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

export const receiveGiftParam = /^receive_([a-f0-9]{24})$/
