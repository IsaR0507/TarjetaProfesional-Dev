import * as ecs from '@8thwall/ecs'

const PauseVideo = ecs.registerComponent({
  name: 'Pause Video',

  schema: {
    videoEntity: ecs.eid,
    pauseIcon: ecs.eid,
    playIcon: ecs.eid,
  },

  stateMachine: ({world, eid, schemaAttribute}) => {

    // Función reutilizable para pintar los iconos según el estado del video
    const actualizarIconos = (pausado: boolean) => {
      const {pauseIcon, playIcon} = schemaAttribute.get(eid)

      if (pauseIcon) {
        if (pausado) {
          ecs.Hidden.set(world, pauseIcon)   // ocultar icono de pausa
        } else {
          ecs.Hidden.remove(world, pauseIcon) // mostrar icono de pausa
        }
      }

      if (playIcon) {
        if (pausado) {
          ecs.Hidden.remove(world, playIcon)  // mostrar icono de play
        } else {
          ecs.Hidden.set(world, playIcon)     // ocultar icono de play
        }
      }
    }

    ecs.defineState('default')
      .initial()

      // Al entrar al estado (carga de la escena), sincroniza los iconos
      // con el estado real del video
      .onEnter(() => {
        const {videoEntity} = schemaAttribute.get(eid)
        if (!videoEntity) return

        const currentVideo = ecs.VideoControls.get(world, videoEntity)
        if (!currentVideo) return

        actualizarIconos(currentVideo.paused)
      })

      .listen(eid, ecs.input.UI_CLICK, () => {

        const {videoEntity} = schemaAttribute.get(eid)

        if (!videoEntity) {
          console.warn('Pause Video: No se ha asignado el video.')
          return
        }

        const currentVideo = ecs.VideoControls.get(world, videoEntity)

        if (!currentVideo) {
          console.warn('Pause Video: La entidad no tiene VideoControls.')
          return
        }

        const newPausedState = !currentVideo.paused

        ecs.VideoControls.mutate(world, videoEntity, (video) => {
          video.paused = newPausedState
          return false
        })

        actualizarIconos(newPausedState)
      })
  },
})

export {PauseVideo}