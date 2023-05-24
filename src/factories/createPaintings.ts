import { SceneEntity, SubScene, VisibilityStrategyEnum } from '../utilsSceneMng/subScene'
import { default as copy } from '../../static/copy.json'
import { Models } from '../types'
import { default as models } from '../../static/theme-models.json'
import { GLTFEntry } from '../entries/GLTFEntry'
import { createDescriptionUI } from './createDescriptionUI'

/**
 * Create a sub scene for each theme, derive copy and assets from the copy documents and return an array of all sub scene objects.
 */

let ID = 1
export function createPaintingsScenes(): SubScene[] {
  // List of themes to create SubScenes for
  const themes = ['PEACE', 'QUEER', 'ANIMALS', 'WOMEN', 'MEN']

  // Array of content data
  const contentArray = copy.content

  // Map each theme to a SubScene object
  return themes.map((theme) => {
    // Get the models for the current theme
    const themeModels: Models = (models as any)[theme]

    // Array to hold the SceneEntity objects for this SubScene
    const sceneEntityList = []

    // Create the panel for this SubScene ( text and images presenting the theme)
    const panel = new GLTFEntry(new GLTFShape(`models/${theme}/${theme}.glb`), 'panel')
    engine.addEntity(panel)
    const sceneEntityPanel = new SceneEntity('panel', panel)
    sceneEntityPanel.visibilityStrategy = VisibilityStrategyEnum.ENGINE_ADD_REMOVE
    sceneEntityList.push(sceneEntityPanel)

    // Create a SceneEntity object for each model in the theme (each painting)
    for (const model in themeModels) {
      const modelData = themeModels[model]
      const shape = new GLTFShape(modelData.model)
      let artEntry: any
      // Separate the PEACE theme paintings into groups to set relevant mouse events
      if (model === 'CL881196' || model === 'LG199600') {
        artEntry = new GLTFEntry(shape, 'ukraine')
      } else if (theme === 'PEACE') {
        artEntry = new GLTFEntry(shape, 'finland')
      } else {
        artEntry = new GLTFEntry(shape, model)
      }

      // Find the content data for the current model and create a UI element for it
      contentArray.forEach((content) => {
        if (content.model === model) {
          createDescriptionUI(
            artEntry,
            model,
            content.description,
            new Vector3(3, 2, 8),
            new Vector3(modelData.y, 5, -modelData.x)
          )
        }
      })

      // Add the SceneEntity object to the SubScene's list
      engine.addEntity(artEntry)
      const sceneEntity = new SceneEntity(model, artEntry)
      sceneEntity.visibilityStrategy = VisibilityStrategyEnum.ENGINE_ADD_REMOVE
      sceneEntityList.push(sceneEntity)
    }

    // Create a new SubScene object for this theme
    return new SubScene(ID++, theme, sceneEntityList)
  })
}
