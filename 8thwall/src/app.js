const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/BackTarget.json')
    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)