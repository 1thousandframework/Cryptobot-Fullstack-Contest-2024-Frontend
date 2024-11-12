import SpriteHelper from "@/helpers/SpriteHelper";
import {isString} from "@/utils";
import MiniApp from "@/helpers/MiniAppHelper";

export type Icon = {
  name: string;
  pos: [number, number],
  size: [number, number],
  newSize?: [number, number],
  color?: string,
  nightColor?: string
};

export default class IconsHelper {
  public static icons: Icon[] = [
    {
      name: 'gift',
      pos: [0, 0],
      size: [48, 48]
    },
    {
      name: 'gift_small',
      pos: [0, 0],
      size: [48, 48],
      newSize: [16, 16]
    },
    {
      name: 'status_sent',
      pos: [48, 0],
      size: [16, 16],
    },
    {
      name: 'status_purchased',
      pos: [48, 16],
      size: [16, 16],
    },
    {
      name: 'status_received',
      pos: [48, 32],
      size: [16, 16],
    },
    {
      name: 'premium',
      pos: [64, 0],
      size: [24, 24],
    },
    {
      name: 'timer',
      pos: [64, 24],
      size: [24, 24],
    },
    {
      name: 'eth',
      pos: [0, 48],
      size: [40, 40],
    },
    {
      name: 'ton',
      pos: [40, 48],
      size: [40, 40],
    },
    {
      name: 'usdt',
      pos: [80, 48],
      size: [40, 40],
    },
    {
      name: 'gift_delicious-cake',
      pos: [0, 88],
      size: [30, 30],
    },
    {
      name: 'gift_green-star',
      pos: [30, 88],
      size: [30, 30],
    },
    {
      name: 'gift_blue-star',
      pos: [60, 88],
      size: [30, 30],
    },
    {
      name: 'gift_red-star',
      pos: [90, 88],
      size: [30, 30],
    },
    {
      name: 'gift_red-star',
      pos: [0, 118],
      size: [24, 24],
    },
    {
      name: 'gold',
      pos: [0, 118],
      size: [24, 24],
    },
    {
      name: 'silver',
      pos: [24, 118],
      size: [24, 24],
    },
    {
      name: 'bronze',
      pos: [48, 118],
      size: [24, 24],
    },
    {
      name: 'cross',
      pos: [88, 0],
      size: [16, 16],
    },
    {
      name: 'day',
      pos: [88, 16],
      size: [16, 16],
      color: '#000000',
      nightColor: '#ffffff'
    },
    {
      name: 'night',
      pos: [88, 32],
      size: [16, 16],
      color: '#000000',
      nightColor: '#ffffff'
    },
  ]

  static generate(icon: Icon, isNight?: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      const spriteScale = SpriteHelper.scale()
      const canvas = document.createElement('canvas')
      canvas.width = (icon.newSize?.[0] || icon.size[0]) * devicePixelRatio
      canvas.height = (icon.newSize?.[1] || icon.size[1]) * devicePixelRatio
      const ctx = canvas.getContext('2d')
      if (ctx !== null) {
        if (icon.color) {
          ctx.fillStyle = (isNight ? icon.nightColor! : icon.color!)
          ctx.fillRect(0, 0, canvas.width , canvas.height)
          ctx.globalCompositeOperation = 'destination-in';
        }
        SpriteHelper.getSprite().then(imgElement => {
          ctx.drawImage(imgElement,
            icon.pos[0] * spriteScale, icon.pos[1] * spriteScale,
            icon.size[0] * spriteScale, icon.size[1] * spriteScale,
            0, 0,
            canvas.width, canvas.height
          )
          canvas.toBlob((blob) => {
            if (blob instanceof Blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              reject()
            }
          });
        })
      }
    })
  }
}
