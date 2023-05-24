import { PAVILLION_POSITION, PAVILLION_ROTATION } from '../store'

/**
 * GLTFEntity class that extends the Entity class from the engine.
 *
 * @param model - The GLTFShape of the entity.
 */
export default class GLTFEntity extends Entity {
  constructor(model: GLTFShape, name: string) {
    super()
    this.addComponent(model)
    this.addComponent(
      new Transform({
        position: PAVILLION_POSITION,
        rotation: PAVILLION_ROTATION,
        scale: new Vector3(1, 1, 1)
      })
    )
    if (name === 'ukraine') {
      this.addComponent(
        new OnPointerDown(
          (e) => {
            openExternalURL('https://www.patron-of-art.com/news/namu-nft-collection')
          },
          {
            button: ActionButton.POINTER,
            showFeedback: true,
            hoverText: 'Ukrainian NFT project'
          }
        )
      )
    } else if (name === 'finland') {
      this.addComponent(
        new OnPointerDown(
          (e) => {
            openExternalURL('https://finnishmetagallery.fi/en/voting')
          },
          {
            button: ActionButton.POINTER,
            showFeedback: true,
            hoverText: 'Vote'
          }
        )
      )
    }
  }
}
