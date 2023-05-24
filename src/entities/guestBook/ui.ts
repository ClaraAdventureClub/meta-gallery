import { signGuestBook, checkWallet } from './serverHandler'
import { imageTexture } from '../store'

export const screenSpaceUI = new UICanvas()

const scaleMultiplier = 0.5


export async function openSigningUI() {
  screenSpaceUI.isPointerBlocker = true
  closeButton.visible = true
  if (await checkWallet()) {
    walletPlayerUI.visible = true
    SignButton.visible = true
    guestPlayerUI.visible = false
    SignButton.onClick = new OnClick(() => {
      signGuestBook().catch((error) => log(error))
      walletPlayerUI.visible = false
      SignButton.visible = false
      SignedUI.visible = true
      closeButton.visible = false
      exitButton.visible = true
      log('signed guestbook')
    })
  } else {
    guestPlayerUI.visible = true
  }
}

export async function openSnapShotUI() {
  screenSpaceUI.isPointerBlocker = true
  closeButton.visible = true
  SnapShotRedirectUi.visible = true
  SnapShotButton.visible = true
}

export function closeUI() {
  walletPlayerUI.visible = false
  SignButton.visible = false
  guestPlayerUI.visible = false
  screenSpaceUI.isPointerBlocker = false
  closeButton.visible = false
  exitButton.visible = false
  SignedUI.visible = false
  SnapShotRedirectUi.visible = false
  SnapShotButton.visible = false
}


export const SnapShotRedirectUi = new UIImage(screenSpaceUI, imageTexture)
SnapShotRedirectUi.name = 'SnapShotRedirectUi'
SnapShotRedirectUi.width = 1024 * scaleMultiplier
SnapShotRedirectUi.height = 884 * scaleMultiplier
SnapShotRedirectUi.hAlign = 'center'
SnapShotRedirectUi.vAlign = 'center'
SnapShotRedirectUi.sourceLeft = 2048
SnapShotRedirectUi.sourceTop = 0
SnapShotRedirectUi.sourceWidth = 1024
SnapShotRedirectUi.sourceHeight = 884
SnapShotRedirectUi.visible = false


export const guestPlayerUI = new UIImage(screenSpaceUI, imageTexture)
guestPlayerUI.name = 'guestPlayerUI'
guestPlayerUI.width = 1024 * scaleMultiplier
guestPlayerUI.height = 884 * scaleMultiplier
guestPlayerUI.hAlign = 'center'
guestPlayerUI.vAlign = 'center'
guestPlayerUI.sourceLeft = 0
guestPlayerUI.sourceTop = 884
guestPlayerUI.sourceWidth = 1024
guestPlayerUI.sourceHeight = 884
guestPlayerUI.visible = false

export const walletPlayerUI = new UIImage(screenSpaceUI, imageTexture)
walletPlayerUI.name = 'walletPlayerUI'
walletPlayerUI.width = 1024 * scaleMultiplier
walletPlayerUI.height = 884 * scaleMultiplier
walletPlayerUI.hAlign = 'center'
walletPlayerUI.vAlign = 'center'
walletPlayerUI.sourceLeft = 0
walletPlayerUI.sourceTop = 0
walletPlayerUI.sourceWidth = 1024
walletPlayerUI.sourceHeight = 884
walletPlayerUI.visible = false

export const SignedUI = new UIImage(screenSpaceUI, imageTexture)
SignedUI.name = 'SignedUI'
SignedUI.width = 1024 * scaleMultiplier
SignedUI.height = 884 * scaleMultiplier
SignedUI.hAlign = 'center'
SignedUI.vAlign = 'center'
SignedUI.sourceLeft = 1024
SignedUI.sourceTop = 0
SignedUI.sourceWidth = 1024
SignedUI.sourceHeight = 884
SignedUI.visible = false

export const exitButton = new UIImage(screenSpaceUI, imageTexture)
exitButton.name = 'exitButton'
exitButton.width = 564 * scaleMultiplier
exitButton.height = 116 * scaleMultiplier
exitButton.hAlign = 'center'
exitButton.vAlign = 'center'
exitButton.positionY = -320 * scaleMultiplier
exitButton.positionX = 0
exitButton.sourceLeft = 1024
exitButton.sourceTop = 994
exitButton.sourceWidth = 564
exitButton.sourceHeight = 116
exitButton.visible = false

export const SignButton = new UIImage(screenSpaceUI, imageTexture)
SignButton.name = 'SignButton'
SignButton.width = 564 * scaleMultiplier
SignButton.height = 108 * scaleMultiplier
SignButton.hAlign = 'center'
SignButton.vAlign = 'center'
SignButton.positionY = -320 * scaleMultiplier
SignButton.positionX = 0
SignButton.sourceLeft = 1024
SignButton.sourceTop = 884
SignButton.sourceWidth = 564
SignButton.sourceHeight = 111
SignButton.visible = false

export const SnapShotButton = new UIImage(screenSpaceUI, imageTexture)
SnapShotButton.name = 'SnapShotButton'
SnapShotButton.width = 564 * scaleMultiplier
SnapShotButton.height = 116 * scaleMultiplier
SnapShotButton.hAlign = 'center'
SnapShotButton.vAlign = 'center'
SnapShotButton.positionY = -320 * scaleMultiplier
SnapShotButton.positionX = 0
SnapShotButton.sourceLeft = 1024
SnapShotButton.sourceTop = 1106
SnapShotButton.sourceWidth = 564
SnapShotButton.sourceHeight = 116
SnapShotButton.visible = false

export const closeButton = new UIImage(screenSpaceUI, imageTexture)
closeButton.name = 'closeButton'
closeButton.width = 96 * scaleMultiplier
closeButton.height = 96 * scaleMultiplier
closeButton.positionY = 370 * scaleMultiplier
closeButton.positionX = 450 * scaleMultiplier
closeButton.sourceLeft = 1585
closeButton.sourceTop = 886
closeButton.sourceWidth = 96
closeButton.sourceHeight = 96
closeButton.visible = false

closeButton.onClick = new OnClick(() => {
  closeUI()
})
exitButton.onClick = new OnClick(() => {
  closeUI()
})

SnapShotButton.onClick = new OnClick(() => {
  openExternalURL('https://snapshot.org/#/finnishmetagallery.eth')
})

