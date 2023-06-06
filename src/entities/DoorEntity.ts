import {PAVILLION_POSITION, PAVILLION_ROTATION} from '../store'
import * as utils from '@dcl/ecs-scene-utils'

export default class DoorEntity extends Entity {
    public isOpen: boolean

  /**
   *
   * @param model
   * @param triggerPosition
   */
    constructor(model: GLTFShape, triggerPosition: Vector3) {
        super()
        engine.addEntity(this)

        // Add the model and set the position and rotation
        this.addComponent(model)
        this.addComponent(
            new Transform({
                position: PAVILLION_POSITION,
                rotation: PAVILLION_ROTATION
            })
        )

        // Add an Animator component and the two AnimationStates (from the GLTF NLA tracks animation)
        this.addComponent(new Animator())
        this.getComponent(Animator).addClip(new AnimationState('open', {looping: false}))
        this.getComponent(Animator).addClip(new AnimationState('close', {looping: false}))

        // Initialize isOpen to false and trigger the animation
        this.isOpen = false
        this.triggerAnimation(triggerPosition)
    }

  /**
   * Creates a trigger area around the door, open / close door on enter/ exit
   * @param triggerPosition
   */
    triggerAnimation = (triggerPosition: Vector3) => {
        const triggerBox = new utils.TriggerBoxShape(new Vector3(10, 10, 15), triggerPosition)
        const triggerComp = new utils.TriggerComponent(triggerBox, {
            onCameraEnter: () => {
                this.openDoor()
            },
            onCameraExit: () => {
                this.closeDoor()
            },
            // , enableDebug: true //display the shape in dev scene
        })

        this.addComponent(triggerComp)
    }


    openDoor = () => {
        if (!this.isOpen) {
            this.isOpen = true
            this.getComponent(Animator).getClip('close').stop()
            this.getComponent(Animator).getClip('open').play()
        }
    }

    closeDoor = () => {
        if (this.isOpen) {
            this.isOpen = false
            this.getComponent(Animator).getClip('open').stop()
            this.getComponent(Animator).getClip('close').play()
        }
    }
}
