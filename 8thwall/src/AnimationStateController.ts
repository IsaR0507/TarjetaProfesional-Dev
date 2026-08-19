import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'AnimationStateController',

  stateMachine: ({world, eid}) => {

    ecs.defineState('idle')
      .initial()
      .onEnter(() => {
        ecs.GltfModel.mutate(world, eid, (cursor) => {
          cursor.animationClip = 'IdleAvatar'
          cursor.loop = true
          cursor.repetitions = -1
          return false
        })
      })
      .onEvent(ecs.input.SCREEN_TOUCH_START, 'dance', {
        target: eid,
      })

    ecs.defineState('dance')
      .onEnter(() => {
        ecs.GltfModel.mutate(world, eid, (cursor) => {
          cursor.animationClip = 'CapoeiraDance'
          cursor.loop = false
          cursor.repetitions = 0
          return false
        })
      })
      .onEvent(ecs.events.GLTF_ANIMATION_FINISHED, 'idle', {
        target: eid,
      })
  },
})