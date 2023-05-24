import { openSigningUI, openSnapShotUI } from './ui'
import { SIGNING_BOOK_UNABLE } from '../../store'

/**
 * Represents a guest book entity in the scene.
 * It allows users to interact with the guest book by opening a UI for signing in.
 */


export default class GuestBook extends Entity {
  eventName: string
  constructor(transform: TranformConstructorArgs, eventName: string) {
    super()
    engine.addEntity(this)

    this.addComponent(new GLTFShape('models/pavilion/guest_book.glb'))
    this.addComponent(new Transform(transform))

    this.eventName = eventName

    this.addComponent(
      new OnPointerDown(
        () => {
          if (SIGNING_BOOK_UNABLE) {
            // Open the UI that invite user to sign in
            openSigningUI().catch((error) => log(error))
            log('OPENED GUESTBOOK')
          } else {
            // Open the UI that let people know the guest book is closed
            openSnapShotUI().catch((error) => log(error))
          }
        },
        { hoverText: 'Open' }
      )
    )
  }
}
