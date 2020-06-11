export const menuButtonModel = {
  checkPermission(menuUrl, buttonCode) {
    if (!menuUrl || !buttonCode) {
      return false
    }
    return this[menuUrl] ? this[menuUrl].some(it => it.buttonCode === buttonCode) : false
  }
}

export const style = {
  dialogButtonSize: 'mini',
  tableButtonSize: 'mini'
}
