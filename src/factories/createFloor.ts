import FloorEntity from '../entities/FloorEntity'

export function createFloor() {
  const floorM = new FloorEntity(new GLTFShape('models/Floor/floor.glb'))
  engine.addEntity(floorM)
}
