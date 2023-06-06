import { FLOOR_POSITION } from '../store'

/**
 * FloorEntity class that extends the Entity class from the engine.
 *
 * @param model - The GLTFShape of the entity.
 */
export default class FloorEntity extends Entity {
  constructor(model: GLTFShape) {
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
