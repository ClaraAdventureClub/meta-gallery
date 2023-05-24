import DoorEntry from '../entries/DoorEntry'

export function createDoors(): void {
  // Add the door with trigger box position (relative to pavilion)
  new DoorEntry(new GLTFShape('models/doors/doors_left.glb'), new Vector3(15, 0, -12))
  new DoorEntry(new GLTFShape('models/doors/doors_right.glb'), new Vector3(15, 0, 12))
  new DoorEntry(new GLTFShape('models/doors/doors_back.glb'), new Vector3(-26, 0, 0))
  new DoorEntry(new GLTFShape('models/doors/doors_front.glb'), new Vector3(34, 0, 0))
}
