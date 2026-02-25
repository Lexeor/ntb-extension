declare module 'trianglify' {
  interface TrianglifyOptions {
    width: number
    height: number
    cellSize?: number
    xColors?: string | string[]
    yColors?: string | string[] | 'match'
    seed?: string | number | null
    variance?: number
    strokeWidth?: number
    colorSpace?: string
  }

  interface Pattern {
    toSVG(): SVGElement
    toCanvas(canvas?: HTMLCanvasElement): HTMLCanvasElement
    opts: TrianglifyOptions
  }

  function trianglify(options: TrianglifyOptions): Pattern
  export default trianglify
}
