import { EntityActionListener, SceneEntity, SubScene } from './subScene'

export type SceneInitData = {
  onInit: EntityActionListener
  onShow?: EntityActionListener
  onHide?: EntityActionListener
  entities: SceneEntity[]
  name: string
}

/**
 * Module for managing sub-scenes
 */
export class SceneManager {
  scenes: SubScene[] = []

  //set scene gen id at some higher number reserving low numbers fo manaul assigns
  sceneIdGen = 1000

  generateSceneId(): number {
    return this.sceneIdGen++ //this.scenes.length+1
  }
  getSceneById(id: number): SubScene | null {
    for (const p in this.scenes) {
      if (this.scenes[p].id === id) {
        return this.scenes[p]
      }
    }
    return null
  }

  addScene(scene: SubScene | SceneInitData): SubScene {
    let retScene: SubScene
    if (scene instanceof SubScene) {
      retScene = scene
      this.scenes.push(scene)
    } else {
      retScene = new SubScene(this.generateSceneId(), scene.name, scene.entities)
      if (scene.onInit !== undefined) retScene.addOnInitListener(scene.onInit)
      if (scene.onHide !== undefined) retScene.addOnHideListener(scene.onHide)
      if (scene.onShow !== undefined) retScene.addOnShowListener(scene.onShow)
      this.scenes.push(retScene)
    }
    return retScene
  }
  changeToScene(scene: SubScene) {
    for (const p in this.scenes) {
      if (this.scenes[p] === scene) {
      } else {
        this.scenes[p].hide()
        this.scenes[p].disable()
      }
    }
    scene.enable()
    scene.show()
  }
  initScenes() {
    for (const p in this.scenes) {
      this.scenes[p].init()
    }
  }
  hideScenes() {
    for (const p in this.scenes) {
      this.scenes[p].hide()
    }
  }
}
