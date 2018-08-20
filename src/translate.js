export function translate(object, language) {
  for (let key of Object.getOwnPropertyNames(object)) {
    if (!language[key]) {
      continue
    }
    if (typeof object[key] === "object") {
      object[language[key]] = translate(object[key], language)
    }
    if (typeof object[key] === "function") {
      object[language[key]] = function () {
        let result = object[key](...arguments)
        if (result) {
          return translate(result, language)
        }
      }
    }
  }
  return object
}