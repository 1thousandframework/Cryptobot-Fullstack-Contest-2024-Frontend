const animations = new Map<string, string>();

export async function getAnimationData(animationPath: string): Promise<string | Error> {
  if (animations.has(animationPath)) {
    return animations.get(animationPath)!;
  }
  try {
    const result = await fetch(animationPath)
    if (result.ok) {
      const animation = await result.json();
      animations.set(animationPath, animation)
      return animation
    } else {
      return ''
    }
  } catch(e) {
    return e as Error
  }
}
