import { FloorEntry } from '../entries/FloorM'

export function createFloor() {
  const floorM = new FloorEntry(new GLTFShape('models/Floor/floor.glb'), 'Floor')
  engine.addEntity(floorM)
}
