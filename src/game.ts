import { createDoors } from './factories/createDoors'
import { PAVILLION_POSITION, PAVILLION_ROTATION } from './store'
import { createFresqueDescription } from './factories/createFresqueDescription'
import { createNPCBot } from './factories/createNPCBot'
import { createFloor } from './factories/createFloor'
import { createPavilion } from './factories/createPavilion'

import GuestBook from './entities/guestBook/GuestBook'

function main() {
  //Add pavilion 3D model to the main scene and create a subscene for each art theme + a switch button.
  createPavilion()

  //Create doors that open on approach
  createDoors()

  //Include an NPC with a few boxes of dialog
  createNPCBot()

  //Display UI element when player is under the dome looking up
  createFresqueDescription()

  //Add grass to the scene
  createFloor()

  //add guestbook to retrieve visitors wallet IDs
  new GuestBook(
    {
      position: PAVILLION_POSITION,
      rotation: PAVILLION_ROTATION
    },
    'getWallet'
  )
}

main()
