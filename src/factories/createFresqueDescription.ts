import { imageTexture, PAVILLION_POSITION} from '../store'
import * as utils from '@dcl/ecs-scene-utils'
import { default as fresqueDescription } from '../../static/fresque.json'

/**
 * Creates the description of a fresco.
 * It adds a 3D entity representing the fresco with UI elements for navigation and text display.
 * Triggers are set up to display the UI when the user's camera is in the right position.
 */

export function createFresqueDescription(): void {
  const fresque = new Entity()
  fresque.addComponent(new BoxShape())
  fresque.addComponent(new Transform({ position: PAVILLION_POSITION }))

  let textId = 0

  // UI element for displaying the next page of the fresco description
  const nextCanvas = new UICanvas()
  const nextText = new UIImage(nextCanvas, imageTexture)
  // Set properties for the UI element
  nextText.width = 30
  nextText.height = 30
  nextText.isPointerBlocker = true
  nextText.vAlign = 'bottom'
  nextText.hAlign = 'left'
  nextText.positionX = 60
  nextText.positionY = 335
  nextText.visible = false
  nextText.sourceLeft = 1602
  nextText.sourceTop = 1016
  nextText.sourceWidth = 70
  nextText.sourceHeight = 70

  // Change the displayed text to the next page of the description
  nextText.onClick = new OnClick(() => {
    if (textId < fresqueDescription.content.length - 1) {
      textId = textId + 1
    }
    text.value = fresqueDescription.content[textId]
  })

  // UI element for displaying the previous page of the fresco description
  const prevCanvas = new UICanvas()
  const prevText = new UIImage(prevCanvas, imageTexture)
  prevText.width = 30
  prevText.height = 30
  prevText.isPointerBlocker = true
  prevText.vAlign = 'bottom'
  prevText.hAlign = 'left'
  prevText.positionX = 20
  prevText.positionY = 335
  prevText.visible = false
  prevText.sourceLeft = 1680
  prevText.sourceTop = 1016
  prevText.sourceWidth = 70
  prevText.sourceHeight = 70

  prevText.onClick = new OnClick(() => {
    if (textId > 0) {
      textId = textId - 1
    }
    text.value = fresqueDescription.content[textId]
  })

  const textCanvas = new UICanvas()
  const text = new UIText(textCanvas)
  text.vAlign = 'bottom'
  text.hAlign = 'left'
  text.width = 400
  text.adaptWidth = false
  text.paddingLeft = 20
  text.paddingBottom = 120
  text.fontSize = 12
  text.value = fresqueDescription.content[textId]
  text.visible = false

  let showFresqueUI = false

  // Event listener for camera position changes
  events.addListener(UpdateEvent, null, ({ cameraUp, cameraDown }) => {
    if (cameraUp && showFresqueUI) {
      // Show the UI elements
      text.visible = true
      prevText.visible = true
      nextText.visible = true
    }
    if (cameraDown || !showFresqueUI) {
      // Hide the UI elements
      text.visible = false
      prevText.visible = false
      nextText.visible = false
    }
  })
  // Trigger for displaying the UI when the camera enters the trigger area (top of chapel)
  const triggerDBox = new utils.TriggerBoxShape(new Vector3(15, 2, 10), new Vector3(15, 3, 0))
  fresque.addComponent(
    new utils.TriggerComponent(triggerDBox, {
      onCameraEnter: () => {
        showFresqueUI = true
      },
      onCameraExit: () => {
        showFresqueUI = false
      }
      //enableDebug: true
    })
  )
  engine.addEntity(fresque)
}

const events = new EventManager()

//  Event fired when there is an update in camera position.
@EventConstructor()
class UpdateEvent {
  isCameraUp: boolean
  isCameraDown: boolean

  constructor(public cameraUp: boolean, public cameraDown: boolean) {
    this.isCameraUp = cameraUp
    this.isCameraDown = cameraDown
  }
}

// System for monitoring camera rotation and firing camera position update events.
export class CameraRotation implements ISystem {
  update() {
    let cameraUp
    let cameraDown
    if (Camera.instance.rotation.eulerAngles.x > 260 && Camera.instance.rotation.eulerAngles.x < 350) {
      cameraUp = true
      cameraDown = false
      events.fireEvent(new UpdateEvent(cameraUp, cameraDown))
    } else {
      cameraUp = false
      cameraDown = true
      events.fireEvent(new UpdateEvent(cameraUp, cameraDown))
    }
  }
}

engine.addSystem(new CameraRotation())
