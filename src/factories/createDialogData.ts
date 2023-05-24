import { NPC } from '@dcl/npc-scene-utils'

/***
 * Creates dialog array for our bot
 * @param npcBot
 * @constructor
 */
export function createDialogData(npcBot: NPC) {
  return [
    {
      text: 'Hi there! Welcome to the Finnish Metagallery!',
      triggeredByNext: () => {
        npcBot.playAnimation('greet', true)
      }
    },
    {
      text: 'Do you want to know more about what’s in this space?',
      isQuestion: true,
      buttons: [
        { label: 'Yes! sure', goToDialog: 3 },
        { label: 'No thanks', goToDialog: 2 }
      ]
    },
    {
      text: "Okay, I'll be around if you get curious!",
      isEndOfDialog: true,
      triggeredByNext: () => {
        npcBot.playAnimation('greet', true)
      }
    },
    {
      text: 'Great! We have art divided into 5 themes. You can change the themes from the interactive panel under the dome in the middle.',
    },
    {
      text: ' The theme you see now is peace: 10 artworks from the Finnish National Gallery and 2 from the National Art Museum of Ukraine.'
    },
    {
      text: 'Want to help Ukrainian museums shelter their artworks?',
      isQuestion: true,
      buttons: [
        { label: 'Sure!', goToDialog: 6 },
        { label: 'No thanks!', goToDialog: 14 }
      ]
    },
    {
      text: 'The Ukrainian art is at the other end of this gallery. You can help the Ukrainian museum save artworks during and after the war.'
    },
    {
      text: 'Click on the art and follow the link to Patron-of-art.com Thank you for helping save Ukrainian culture.'
    },
    {
      text: 'We also have a competition! Would you like to know more about it?',
      isQuestion: true,
      buttons: [
        { label: 'Sure', goToDialog: 9 },
        { label: 'No thanks!', goToDialog: 2 }
      ]
    },
    {
      text: 'The question is: which piece of art feels most like "peace" to you? Click on any painting to get redirected to the website to cast your vote.'
    },
    {
      text: ' We will raffle 2 tickets to the VIP opening of the Ateneum Art Museum in Helsinki on 13 April 2023. Travel and board not included.'
    },
    {
      text: 'One more thing! We have a wearable! Want it?',
      isQuestion: true,
      buttons: [
        { label: 'Yes sure!', goToDialog: 12 },
        { label: 'No thanks!', goToDialog: 2 }
      ]
    },
    {
      text: 'Please connect with MetaMask, Fortmatic, WalletConnect or Coinbase Wallet and sign the guest book under the dome. It is opposite from where you change the themes. '
    },
    {
      text: 'The token will be sent to your wallet shortly. Peace!'
    },
    {
      text: 'Ok. Enjoy the art!',
      isEndOfDialog: true,
      triggeredByNext: () => {
        npcBot.playAnimation('greet', true)
      }
    }
  ]
}
