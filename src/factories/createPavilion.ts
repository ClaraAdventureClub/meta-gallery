import { GLTFEntry } from '../entries/GLTFEntry'
import * as utils from '@dcl/ecs-scene-utils'
import { SceneEntity, SubScene, VisibilityStrategyEnum } from '../utilsSceneMng/subScene'
import { createPaintingsScenes } from './createPaintings'
import { SceneManager } from '../utilsSceneMng/sceneManager'

// Instantiate a new SceneManager
const SCENE_MGR = new SceneManager()

export function createPavilion() {
  //Add the different 3D models to the scene
  const pavilionShapeInt = new GLTFShape('models/pavilion/pavilion_int.glb')
  pavilionShapeInt.isPointerBlocker = false
  const pavilionInterior = new GLTFEntry(pavilionShapeInt, 'pavilion')
  engine.addEntity(pavilionInterior)

  const flags = new GLTFEntry(new GLTFShape('models/pavilion/flags.glb'), 'flags')
  engine.addEntity(flags)

  const chair = new Entity()
  chair.addComponent(new GLTFShape('models/npc/chair.glb'))
  chair.addComponent(
    new Transform({
      position: new Vector3(14, 1.25, 20),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  )
  engine.addEntity(chair)

  const switchButton = new GLTFEntry(new GLTFShape('models/pavilion/theme_switch.glb'), 'switchButton')
  engine.addEntity(switchButton)

  // Add an audio clip to the interior pavilion model
  const clip = new AudioClip('sounds/soundscape.mp3')
  const source = new AudioSource(clip)
  pavilionInterior.addComponent(source)

  const pavilionShapeExt = new GLTFShape('models/pavilion/pavilion_ext.gltf')
  const pavilionEntry = new GLTFEntry(pavilionShapeExt, 'pavilion')
  const pavilionEntity = new SceneEntity('pav_ext', pavilionEntry)
  engine.addEntity(pavilionEntry)
  pavilionEntity.visibilityStrategy = VisibilityStrategyEnum.ENGINE_ADD_REMOVE

  //Create a subscene with the exterior of the pavilion
  const extPavilionScene = new SubScene(0, 'pavExt', [pavilionEntity])

  // Add the subscene to the SceneManager
  SCENE_MGR.addScene(extPavilionScene)

  // Add all the painting scenes to the SceneManager
  const scenes = createPaintingsScenes()
  scenes.forEach((scene) => {
    SCENE_MGR.addScene(scene)
  })

  // Add a trigger component on the entire surface of the pavilion
  const triggerBox = new utils.TriggerBoxShape(new Vector3(57, 12, 16), new Vector3(4, 0, 0))
  pavilionInterior.addComponent(
    new utils.TriggerComponent(triggerBox, {
      onCameraEnter: () => {
        // When the camera enters the trigger box (pavilion)
        SCENE_MGR.changeToScene(scenes[0]) // Switch to the first painting scene
        source.playing = true // Play the audio clip
      },
      onCameraExit: () => {
        // When the camera exits the trigger box (pavilion)
        SCENE_MGR.changeToScene(extPavilionScene) // Switch back to exterior scene
      }
      //  , enableDebug: true //display the shape in dev scene
    })
  )

  let index = 0
  switchButton.addComponent(
    new OnPointerDown(
      (e) => {
        index = (index + 1) % scenes.length
        SCENE_MGR.changeToScene(scenes[index]) // on click update subscene
      },
      {
        button: ActionButton.POINTER,
        showFeedback: true,
        hoverText: 'Change theme'
      }
    )
  )

  SCENE_MGR.changeToScene(extPavilionScene)
}
