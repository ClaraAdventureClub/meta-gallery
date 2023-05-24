import { Dialog, NPC } from '@dcl/npc-scene-utils'
import { createDialogData } from './createDialogData'

function setNPCBot() {
  const npcBot = new NPC(
    {
      position: new Vector3(14, 1.25, 20),
      rotation: Quaternion.Euler(0, 90, 0)
    },
    'models/npc/avatar.glb',
    () => {},
    {
      turningSpeed: 0,
      faceUser: true,
      continueOnWalkAway: false,
      reactDistance: 6,
      hoverText: 'Get informed',
      portrait: {
        path: 'images/ava.png',
        height: 256,
        width: 256,
        section: {
          sourceHeight: 512,
          sourceWidth: 512
        }
      },
      onWalkAway: () => {
        const transform = npcBot.getComponent(Transform)
        transform.rotation = Quaternion.Euler(0, 90, 0)
        npcBot.playAnimation('sit', true)
      }
    }
  )
  return npcBot
}

export function createNPCBot() {
  // Add bot model, set position and rotation
  const npcBot = setNPCBot()
  const dialogData: Dialog[] = createDialogData(npcBot)
  // Set initial bot position to sit
  npcBot.playAnimation('sit', true)

  // Play animation and open dialog ui when user is within the 'reactDistance' ( set to 6)
  npcBot.onActivate = () => {
    // animations
    npcBot.playAnimation('stand', true)
    // dialog UI
    npcBot.talk(dialogData)
  }
}
