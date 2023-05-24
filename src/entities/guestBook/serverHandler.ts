import { getUserData, UserData } from '@decentraland/Identity'

// get player data
export let userData: UserData

export async function setUserData() {
  const data = await getUserData()
  if (data) userData = data
}

// external servers being used by the project - Please change these to your own if working on something else!
export const fireBaseServer = 'https://us-central1-peacemetagallery.cloudfunctions.net/app/'

/**
 * Check if user has wallet
 */
export async function checkWallet(): Promise<boolean> {
  if (!userData) {
    await setUserData()
  }
  try {
    return await userData?.hasConnectedWeb3
  } catch (e) {
    log('error checking wallet ', e)
    return false
  }
}

/**
 * Get guestbook signatures
 * @deprecated
 */
export async function getGuestBook() {
  try {
    const url = fireBaseServer + 'get-signatures'
    const response = await fetch(url)
    const json = await response.json()
    log(json)
    return json
  } catch (e) {
    log('error fetching scores from server ', e)
  }
}

/**
 * change data in scoreboard
 */
export async function signGuestBook() {
  if (!userData) {
    await setUserData()
  }
  try {
    const url = fireBaseServer + 'add-signature'
    const body = JSON.stringify({
      id: (await userData).publicKey,
      name: (await userData).displayName
    })
    log(body)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    })
    return response.json()
  } catch (e) {
    log('error posting to server ', e)
  }
}























