// import * as utilsSceneMng from '@dcl/ecs-scene-utilsSceneMng'

export enum VisibilityStrategyEnum {
  ENGINE_ADD_REMOVE,
  SHAPE_SHOW_HIDE
}

const VAULT = new Transform({
  position: new Vector3(8, 24, 8), //where no one can walk
  scale: new Vector3(0, 0, 0) // not visible
})

export type EntityWrapperArgs = {
  onChangeEntityVisibility?(entity: BaseEntityWrapper, type: VisibleChangeType): void

  visibilityStrategy?: VisibilityStrategyEnum

  onInit?(entity: BaseEntityWrapper): void
}

export type SceneEntityArgs = EntityWrapperArgs & {
  onInit?(entity: SceneEntity, scene: SubScene): void
}

export type EntityActionListener = (entityWrap: BaseEntityWrapper) => void

/**
 * Base class for all entities that are part of a scene
 * @param name name of the entity
 * @param args optional arguments
 */
export class BaseEntityWrapper {
  name: string
  visible: boolean = true

  //even though this object holds no entities directly, it is good to know the intent
  //for visiblity should it override the listeners onHide / onShow for how to react
  visibilityStrategy: VisibilityStrategyEnum = VisibilityStrategyEnum.SHAPE_SHOW_HIDE
  visibleTransformInfo?: Transform //if vault hide/showing

  initAlready: boolean = false

  onInitListener: EntityActionListener[] = [] //(scene:SubScene)=>void = []
  onShowListener: EntityActionListener[] = []
  onHideListener: EntityActionListener[] = []

  enabled: boolean = true

  constructor(name: string, args?: EntityWrapperArgs) {
    this.name = name

    if (args && args.visibilityStrategy) this.visibilityStrategy = args.visibilityStrategy
    if (args && args.onInit) this.addOnInitListener(args.onInit)
  }

  disable() {
    this.enabled = false
  }
  enable() {
    this.enabled = true
  }
  init() {
    if (!this.enabled) {
      return
    }
    if (this.initAlready) return false

    this.initAlready = true

    //log("ent.checking onInit!!!",this.name)

    if (this.onInit !== undefined) {
      this.onInit(this)
    }

    return true
  }

  //onInit(entity:EntityWrapper) {}

  onChangeEntityVisibility(entity: BaseEntityWrapper, type: VisibleChangeType) {
    switch (type) {
      case 'hide':
        this.onHide(this)
        break
      case 'show':
        this.onShow(this)
        break
    }
  }

  isVisible() {
    return this.visible
  }

  onHide(baseEntWrapper: BaseEntityWrapper) {
    this.processListener(baseEntWrapper, this.onHideListener)
  }
  onShow(baseEntWrapper: BaseEntityWrapper) {
    this.processListener(baseEntWrapper, this.onShowListener)
  }
  onInit(baseEntWrapper: BaseEntityWrapper) {
    this.processListener(baseEntWrapper, this.onInitListener)
  }
  processListener(sceneEnt: BaseEntityWrapper, listeners: ((sceneEnt: BaseEntityWrapper) => void)[]) {
    if (!listeners) return
    for (const p in listeners) {
      listeners[p](sceneEnt)
    }
  }

  show(force?: boolean) {
    if (!this.initAlready) this.init()
    if (!this.enabled) {
      return
    }

    if ((force === undefined || !force) && this.visible) {
      return
    }

    this.visible = true
    this.onChangeEntityVisibility(this, 'show')
  }

  hide(force?: boolean) {
    if ((force === undefined || !force) && !this.visible) {
      return
    }
    if (!this.enabled) {
      return
    }

    this.visible = false
    this.onChangeEntityVisibility(this, 'hide')
  }

  addOnInitListener(listener: EntityActionListener) {
    this.onInitListener.push(listener)
  }

  addOnShowListener(listener: EntityActionListener) {
    this.onShowListener.push(listener)
  }

  addOnHideListener(listener: EntityActionListener) {
    this.onHideListener.push(listener)
  }
}

/**
 * A scene entity is an entity that is part of a scene
 * @param name name of the entity
 * @param entity the entity to be added to the scene
 * @param args optional arguments
 */
export class SceneEntity extends BaseEntityWrapper {
  rootEntity: Entity
  entities: Entity[]

  constructor(name: string, entity?: Entity | Entity[], args?: EntityWrapperArgs) {
    super(name, args)

    if (Array.isArray(entity)) {
      //const ent:Entity = entity as Entity
      this.rootEntity = entity[0]
      this.entities = entity
    } else if (entity !== undefined) {
      this.rootEntity = entity
      this.entities = []
      this.entities.push(entity)
    } else {
      this.rootEntity = new Entity()
      this.entities = []
    }

    //if(args && args.visibilityStrategy) this.visibilityStrategy = args.visibilityStrategy
    //if(args && args.onInit) this.onInit = args.onInit
  }

  addEntity(entity: Entity) {
    this.entities.push(entity)
  }
  onShow() {
    const entity = this.rootEntity

    //if(this.name == 'closestTrack.debugUI') debugger

    this.showEntity(entity, false)

    if (this.entities) {
      for (const p in this.entities) {
        this.showEntity(this.entities[p], true)
      }
    }

    super.onShow(this)
  }

  onHide() {
    const entity = this.rootEntity

    this.hideEntity(entity, false)

    if (this.entities) {
      for (const p in this.entities) {
        this.hideEntity(this.entities[p], true)
      }
    }

    super.onHide(this)
  }

  private showEntity(entity: Entity, child: boolean) {
    if (!entity) return

    if (this.visibilityStrategy === VisibilityStrategyEnum.SHAPE_SHOW_HIDE) {
      if (entity.hasComponent('engine.shape')) {
        log('XXXX showing', this.name)
        entity.getComponent('engine.shape').visible = true
        entity.getComponent('engine.shape').withCollisions = true
      }
      const transform = this.visibleTransformInfo
      if (!child && transform !== undefined) {
        entity.addComponentOrReplace(transform)
      }
    } else {
      if (entity && !entity.alive) {
        engine.addEntity(entity)
      }
    }
  }
  private hideEntity(entity: Entity, child: boolean) {
    if (!entity) return

    const hideShow = this.visibilityStrategy === VisibilityStrategyEnum.SHAPE_SHOW_HIDE
    //log("EntityWrapper","hideEntity called for ",entity.name,"hideShow",hideShow)

    if (hideShow) {
      if (entity.hasComponent('engine.shape')) {
        entity.getComponent('engine.shape').visible = false
        entity.getComponent('engine.shape').withCollisions = false
      }
      if (!child && entity.hasComponent(Transform)) {
        const tf = entity.getComponent(Transform)
        if (tf !== VAULT) {
          //FIXME this is a work around, if need to preserve position over time (moveUtils etc) this wont work
          this.visibleTransformInfo = entity.getComponent(Transform)
          entity.addComponentOrReplace(VAULT)
        }
      }
    } else {
      if (entity && entity.alive) {
        engine.removeEntity(entity)
      }
    }
  }
}

export type VisibleChangeType = 'show' | 'hide'

/**
 * A subscene is a scene that is part of a scene
 * @param name name of the entity
 * @param entity the entity to be added to the scene
 * @param args optional arguments
 */
export class SubScene extends BaseEntityWrapper {
  public rootEntity?: Entity //if hierarchical
  public initAlready: boolean = false
  public entities: SceneEntity[] // CONSIDER turn to record for instant lookup by name?
  public id: number

  constructor(id: number, name: string, entities: SceneEntity[]) {
    super(name, undefined)
    this.id = id
    this.entities = entities
  }

  addEntity(sceneEnt: SceneEntity | Entity, args?: SceneEntityArgs): SceneEntity {
    let retSceneEnt
    if (sceneEnt instanceof SceneEntity) {
      retSceneEnt = sceneEnt
      this.entities.push(sceneEnt)
    } else {
      retSceneEnt = new SceneEntity(sceneEnt.name !== undefined ? sceneEnt.name : 'undefined-scene-', sceneEnt, args)
      this.entities.push(retSceneEnt)
    }
    return retSceneEnt
  }

  onInit(sceneEnt: SubScene) {
    super.onInit(sceneEnt)

    this.entities.forEach((entity) => {
      entity.init()
    })
  }

  onHide(scene: SubScene) {
    super.onHide(scene)

    this.entities.forEach((entity) => {
      const handled = false
      //if(this.overrideHide !== undefined){

      //}
      if (!handled) {
        entity.hide()
      }
    })
  }
  onShow(scene: SubScene) {
    super.onShow(scene)

    this.entities.forEach((entity) => {
      entity.show()
    })
  }
}

/**
 * A subscene group is a group of subscenes
 */
export class SubSceneGroup extends SubScene {
  public scenes: SubScene[] = []

  disable() {
    super.disable()
    this.scenes.forEach((scene) => {
      scene.disable()
    })
  }

  enable() {
    super.enable()
    this.scenes.forEach((scene) => {
      scene.enable()
    })
  }

  init() {
    const val = super.init()
    this.scenes.forEach((scene) => {
      scene.init()
    })
    return val
  }

  onHide(scene: SubScene) {
    super.onHide(scene)

    this.scenes.forEach((scene) => {
      scene.hide()
    })
  }
  onShow(scene: SubScene) {
    super.onShow(scene)

    this.scenes.forEach((scenes) => {
      scenes.show()
    })
  }
}
