export interface CanvasLayer {
  id: string
  type: 'text' | 'image'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  // Text-specific properties
  text?: string
  fontSize?: number
  fontFamily?: string
  fill?: string
  align?: 'left' | 'center' | 'right'
  // Image-specific properties
  imageUrl?: string
  objectFit?: 'contain' | 'cover' | 'fill'
}

