import { FLOOR_POSITION } from '../store'

export class FloorEntry extends Entity {
  constructor(model: GLTFShape, name: string) {
    super()
    this.addComponent(model)
    this.addComponent(
      new Transform({
        position: FLOOR_POSITION,
        scale: new Vector3(0.335, 1, 0.273)
      })
    )
  }
}
