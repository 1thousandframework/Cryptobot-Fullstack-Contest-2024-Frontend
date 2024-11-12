export default class SpriteHelper {
  private static _loaded: boolean = false;
  private static _img: HTMLImageElement;
  private static _loadingPromise: Promise<HTMLImageElement>;

  public static scale(): number {
    return Math.min(Math.ceil(devicePixelRatio), 4)
  }

  static init() {
    const spriteZoom = this.scale()
    const img = new Image();
    this._loadingPromise = new Promise((resolve, reject) => {
      img.onload = () => {
        this._img = img;
        this._loaded = true
        resolve(this._img)
      }
      img.onerror = () => {
        this._loaded = true
        reject()
      }
    })
    img.src = '/sprites/icons_' + spriteZoom + 'x.png?' + import.meta.env.BUILD_TS
  }

  static getSprite(): Promise<HTMLImageElement> {
    if (this._loaded) {
      return Promise.resolve(this._img);
    } else {
      return this._loadingPromise
    }
  }
}
