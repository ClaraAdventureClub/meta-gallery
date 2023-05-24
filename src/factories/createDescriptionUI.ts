import * as utils from '@dcl/ecs-scene-utils'
import { imageTexture } from '../store'

/**
 *
 * @param entity
 * @param {string} name
 * @param {string} uiText
 * @param {Vector3} boxDimension
 * @param {Vector3} boxPosition
 */
export function createDescriptionUI(
  entity: { addComponent: (arg0: utils.TriggerComponent) => void },
  name: string,
  uiText: string,
  boxDimension: Vector3,
  boxPosition: Vector3
): void {
  const canvas = new UICanvas()
  const text = new UIText(canvas)
  text.vAlign = 'bottom'
  text.hAlign = 'left'
  text.width = 400
  text.textWrapping = true
  text.adaptWidth = false
  text.paddingLeft = 20
  text.paddingBottom = 120
  text.fontSize = 15

  //area that trigger the animation
  const triggerDBox = new utils.TriggerBoxShape(boxDimension, boxPosition)
  let ukraineDescription: UIImage
  if (name === 'CL881196' || name === 'LG199600') {
    ukraineDescription = new UIImage(canvas, imageTexture)
    ukraineDescription.name = 'ukraineDescription'
    ukraineDescription.width = 1024 * 0.5
    ukraineDescription.height = 452 * 0.5
    ukraineDescription.hAlign = 'right'
    ukraineDescription.vAlign = 'bottom'
    ukraineDescription.sourceLeft = 1026
    ukraineDescription.sourceTop = 1106
    ukraineDescription.sourceWidth = 1024
    ukraineDescription.sourceHeight = 452
    ukraineDescription.paddingRight = 20
    ukraineDescription.visible = false
  }
  entity.addComponent(
    new utils.TriggerComponent(
      triggerDBox, //shape
      {
        onCameraEnter: () => {
          text.value = uiText
          if (ukraineDescription) ukraineDescription.visible = true
        },
        onCameraExit: () => {
          text.value = ' '
          if (ukraineDescription) ukraineDescription.visible = false
        }
        //enableDebug: true //display the shape in dev scene
      }
    )
  )
}
