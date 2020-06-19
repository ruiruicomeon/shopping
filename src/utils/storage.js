/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

export function isNotBlank(val) {
  if (val != null && typeof val !== 'undefined' && val !== '') {
    return true
  }
  return false
}

export const getFullUrl = (value) => {
  if (isNotBlank(value) && value.indexOf('http') < 0 && value.indexOf('https') < 0) {
    return `/api/Mall${value}`
  }
  return value
}

export function setPrice(value) {
  let price = 0;
  if (isNotBlank(value) && value > 0) {
    price = Math.round((parseFloat(value) * 100).toFixed(2));
  }
  if (isNotBlank(value) && parseInt(value) < 0) {
    price = Math.round((parseFloat(value) * 100).toFixed(2));
  }
  return price;
}

export function getPrice(value) {
  if (isNotBlank(value) && value > 0) {
    return (value / 100).toFixed(2);
  }
  if (isNotBlank(value) && parseInt(value) < 0) {
    return (parseInt(value) / 100).toFixed(2);
  }
  return value;
}

// export function getFullUrl (value) {
//   if (isNotBlank(value) && value.indexOf('http') < 0 && value.indexOf('https') < 0) {
//     return `apos/XFM-MALL${value}`
//   }
//   return value
// }

export function deepClone(obj) {
  let result = null
  if (typeof obj === 'object' && obj !== null) {
    result = obj instanceof Array ? [] : {}
    for (let v in obj) {
      result[v] = deepClone(obj[v])
    }
  } else {
    result = obj
  }
  return result
}

export function jsonToFormData(inJSON, inTestJSON, inFormData, parentKey) {
  const formData = inFormData || new FormData()
  const testJSON = inTestJSON || {}
  for (const key in inJSON) {
    if (inJSON.hasOwnProperty(key)) {
      let constructedKey = key
      if (parentKey) {
        constructedKey = `${parentKey}.${key}`
      }
      const value = inJSON[key]
      if (value && value.constructor === {}.constructor) {
        jsonToFormData(value, testJSON, formData, constructedKey)
      } else {
        formData.append(constructedKey, inJSON[key])
        testJSON[constructedKey] = inJSON[key]
      }
    }
  }
  return formData
}

export function filterObj(obj) {
  for (const attr in obj) {
    if (
      obj[attr] === '' ||
      obj[attr] === undefined ||
      (Array.prototype.isPrototypeOf(obj[attr]) && obj[attr].length == 0)
    ) { delete obj[attr] }
  }
  return obj
}

// export function getPrice(value) {
//   if (isNotBlank(value) && value > 0) {
//     return (value / 100).toFixed(2)
//   }
//   return value
// }
