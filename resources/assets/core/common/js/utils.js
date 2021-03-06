import $ from 'jquery'
import isNil from 'lodash/isNil'
import pull from 'lodash/pull'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import curry from 'lodash/curry'
import mapValues from 'lodash/mapValues'

/**
 * object에 EventEmmiter 추가
 * @memberof Utils
 * @param {object}
 * @return {avoid}
 **/
export function eventify (target) {
  target._events = {}

  target.$on = (eventName, listener) => {
    if (isNil(target._events[eventName])) {
      target._events[eventName] = []
    }
    target._events[eventName].push(listener)
  }

  target.$emit = (eventName, ...args) => {
    if (isNil(target._events[eventName])) {
      return
    }
    target._events[eventName].forEach((listener) => {
      listener.apply(target, [eventName, ...args])
    })
  }

  target.$off = (eventName, listener) => {
    if (isNil(target._events[eventName])) {
      return
    }
    pull(target._events[eventName], listener)
  }

  target.$once = (eventName, listener) => {
    target.$on(eventName, function handler (...args) {
      target.$off(eventName, handler)
      listener.apply(target, args)
    })
  }
}

/**
 * image mime type의 결과를 리턴한다.
 * @memberof Utils
 * @param {string} mime
 * @return {boolean}
 **/
export function isImage (mime) {
  return $.inArray(mime, ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']) !== -1
}

/**
 * video mime type의 결과를 리턴한다.
 * @memberof Utils
 * @param {string} mime
 * @return {boolean}
 **/
export function isVideo (mime) {
  return $.inArray(mime, ['video/mp4', 'video/webm', 'video/ogg']) !== -1
}

/**
 * audio mime type의 결과를 리턴한다.
 * @memberof Utils
 * @param {string} mime
 * @return {boolean}
 **/
export function isAudio (mime) {
  return $.inArray(mime, ['audio/mpeg', 'audio/ogg', 'audio/wav']) !== -1
}

/**
 * 파일 사이즈 포멧을 변경하여 리턴한다.
 * @memberof Utils
 * @param {number} bytes
 * @return {string}
 * @FIXME
 **/
export function formatSizeUnits (bytes) {
  if (bytes >= 1073741824) {
    bytes = (bytes / 1073741824).toFixed(2) + 'GB'
  } else if (bytes >= 1048576) {
    bytes = (bytes / 1048576).toFixed(2) + 'MB'
  } else if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(2) + 'KB'
  } else if (bytes > 1) {
    bytes = bytes + 'bytes'
  } else if (bytes == 1) {
    bytes = bytes + 'byte'
  } else {
    bytes = '0MB'
  }

  return bytes
}

/**
 * GB, MB, KB, bytes, byte로 정의된 파일 크기를 byte단위로 리턴한다.
 * @memberof Utils
 * @param {string} str
 * @return {number}
 * @FIXME
 **/
export function sizeFormatToBytes (str) {
  var bytes = 0

  if (str.indexOf('GB') != -1) {
    bytes = parseFloat(str) * 1024 * 1024 * 1024
  } else if (str.indexOf('MB') != -1) {
    bytes = parseFloat(str) * 1024 * 1024
  } else if (str.indexOf('KB') != -1) {
    bytes = parseFloat(str) * 1024
  } else if (str.indexOf('bytes') != -1) {
    bytes = parseFloat(str)
  } else if (str.indexOf('byte') != -1) {
    bytes = parseFloat(str)
  }

  return bytes
}

/**
 * URL문자열인지의 결과를 리턴한다.
 * @memberof Utils
 * @param {string} url
 * @return {boolean}
 **/
export function isURL (url) {
  return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url)
}

/**
 * full url을 리턴한다.
 * @memberof Utils
 * @param {string} url
 * @return {string}
 **/
export function asset (url) {
  var loc = window.location
  var retURL = ''

  if (!isURL(url)) {
    if (window.xeBaseURL) {
      if (window.xeBaseURL.substr(-1) === '/') {
        retURL += window.xeBaseURL.substr(0, (window.xeBaseURL.length - 1))
      } else {
        retURL += window.xeBaseURL
      }
    } else {
      retURL += loc.protocol + '//' + loc.host
    }

    if (url.substr(0, 1) === '/') {
      retURL += url
    } else {
      retURL += '/' + url
    }
  } else {
    retURL = url
  }

  return retURL.split(/[?#]/)[0]
}

/**
 * uri를 리턴한다.
 * @memberof Utils
 * @param {string} url
 * @return {string}
 * @DEPRECATED
 **/
export function getUri (url) {
  var path = url.split(window.location.protocol + '//')[1]
  var returnUri

  if (path.indexOf('/') === -1) {
    returnUri = '/'
  } else {
    returnUri = path.substr(path.indexOf('/'))
  }

  return returnUri
}

/**
 * 날짜문자열을 timestamp값으로 리턴한다.
 * @memberof Utils
 * @param {string} text
 * @param {number} now
 * @return {number}
 * @DEPRECATED
 * @FIXME moment
 **/
export function strtotime (text, now) {
  //  discuss at: http://locutus.io/php/strtotime/
  // original by: Caio Ariede (http://caioariede.com)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Caio Ariede (http://caioariede.com)
  // improved by: A. Matías Quezada (http://amatiasq.com)
  // improved by: preuter
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Mirko Faber
  //    input by: David
  // bugfixed by: Wagner B. Soares
  // bugfixed by: Artur Tchernychev
  // bugfixed by: Stephan Bösch-Plepelits (http://github.com/plepe)
  //      note 1: Examples all have a fixed timestamp to prevent
  //      note 1: tests to fail because of variable time(zones)
  //   example 1: strtotime('+1 day', 1129633200)
  //   returns 1: 1129719600
  //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200)
  //   returns 2: 1130425202
  //   example 3: strtotime('last month', 1129633200)
  //   returns 3: 1127041200
  //   example 4: strtotime('2009-05-04 08:30:00 GMT')
  //   returns 4: 1241425800
  //   example 5: strtotime('2009-05-04 08:30:00+00')
  //   returns 5: 1241425800
  //   example 6: strtotime('2009-05-04 08:30:00+02:00')
  //   returns 6: 1241418600
  //   example 7: strtotime('2009-05-04T08:30:00Z')
  //   returns 7: 1241425800
  var parsed
  var match
  var today
  var year
  var date
  var days
  var ranges
  var len
  var times
  var regex
  var i
  var fail = false

  if (!text) {
    return fail
  }

  // Unecessary spaces
  text = text.replace(/^\s+|\s+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\t\r\n]/g, '')
    .toLowerCase()

  // in contrast to php, js Date.parse function interprets:
  // dates given as yyyy-mm-dd as in timezone: UTC,
  // dates with "." or "-" as MDY instead of DMY
  // dates with two-digit years differently
  // etc...etc...
  // ...therefore we manually parse lots of common date formats
  var pattern = new RegExp([
    '^(\\d{1,4})',
    '([\\-\\.\\/:])',
    '(\\d{1,2})',
    '([\\-\\.\\/:])',
    '(\\d{1,4})',
    '(?:\\s(\\d{1,2}):(\\d{2})?:?(\\d{2})?)?',
    '(?:\\s([A-Z]+)?)?$'
  ].join(''))
  match = text.match(pattern)
  if (match && match[2] === match[4]) {
    if (match[1] > 1901) {
      switch (match[2]) {
        case '-':

          // YYYY-M-D
          if (match[3] > 12 || match[5] > 31) {
            return fail
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '.':

          // YYYY.M.D is not parsed by strtotime()
          return fail
        case '/':

          // YYYY/M/D
          if (match[3] > 12 || match[5] > 31) {
            return fail
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
      }
    } else if (match[5] > 1901) {
      switch (match[2]) {
        case '-':

          // D-M-YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '.':

          // D.M.YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '/':

          // M/D/YYYY
          if (match[1] > 12 || match[3] > 31) {
            return fail
          }

          return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
      }
    } else {
      switch (match[2]) {
        case '-':

          // YY-M-D
          if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
            return fail
          }

          year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1]
          return new Date(year, parseInt(match[3], 10) - 1, match[5],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '.':

          // D.M.YY or H.MM.SS
          if (match[5] >= 70) {
            // D.M.YY
            if (match[3] > 12 || match[1] > 31) {
              return fail
            }

            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
          }

          if (match[5] < 60 && !match[6]) {
            // H.MM.SS
            if (match[1] > 23 || match[3] > 59) {
              return fail
            }

            today = new Date()
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
              match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000
          }

          // invalid format, cannot be parsed
          return fail
        case '/':

          // M/D/YY
          if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
            return fail
          }

          year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5]
          return new Date(year, parseInt(match[1], 10) - 1, match[3],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case ':':

          // HH:MM:SS
          if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
            return fail
          }

          today = new Date()
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
            match[1] || 0, match[3] || 0, match[5] || 0) / 1000
      }
    }
  }

  // other formats and "now" should be parsed by Date.parse()
  if (text === 'now') {
    return now === null || isNaN(now)
      ? new Date().getTime() / 1000 | 0
      : now | 0
  }

  if (!isNaN(parsed = Date.parse(text))) {
    return parsed / 1000 | 0
  }

  // Browsers !== Chrome have problems parsing ISO 8601 date strings, as they do
  // not accept lower case characters, space, or shortened time zones.
  // Therefore, fix these problems and try again.
  // Examples:
  //   2015-04-15 20:33:59+02
  //   2015-04-15 20:33:59z
  //   2015-04-15t20:33:59+02:00
  pattern = new RegExp([
    '^([0-9]{4}-[0-9]{2}-[0-9]{2})',
    '[ t]',
    '([0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]+)?)',
    '([\\+-][0-9]{2}(:[0-9]{2})?|z)'
  ].join(''))
  match = text.match(pattern)

  if (match) {
    // @TODO: time zone information
    if (match[4] === 'z') {
      match[4] = 'Z'
    } else if (match[4].match(/^([+-][0-9]{2})$/)) {
      match[4] = match[4] + ':00'
    }

    if (!isNaN(parsed = Date.parse(match[1] + 'T' + match[2] + match[4]))) {
      return parsed / 1000 | 0
    }
  }

  date = now ? new Date(now * 1000) : new Date()
  days = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6
  }
  ranges = {
    yea: 'FullYear',
    mon: 'Month',
    day: 'Date',
    hou: 'Hours',
    min: 'Minutes',
    sec: 'Seconds'
  }

  function lastNext (type, range, modifier) {
    var diff
    var day = days[range]
    if (typeof day !== 'undefined') {
      diff = day - date.getDay()
      if (diff === 0) {
        diff = 7 * modifier
      } else if (diff > 0 && type === 'last') {
        diff -= 7
      } else if (diff < 0 && type === 'next') {
        diff += 7
      }

      date.setDate(date.getDate() + diff)
    }
  }

  function process (val) {
    // @todo: Reconcile this with regex using \s, taking into account
    // browser issues with split and regexes
    var splt = val.split(' ')
    var type = splt[0]
    var range = splt[1].substring(0, 3)
    var typeIsNumber = /\d+/.test(type)
    var ago = splt[2] === 'ago'
    var num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1)
    if (typeIsNumber) {
      num *= parseInt(type, 10)
    }

    if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
      return date['set' + ranges[range]](date['get' + ranges[range]]() + num)
    }

    if (range === 'wee') {
      return date.setDate(date.getDate() + (num * 7))
    }

    if (type === 'next' || type === 'last') {
      lastNext(type, range, num)
    } else if (!typeIsNumber) {
      return false
    }

    return true
  }

  times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
    '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
    '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)'
  regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?'
  match = text.match(new RegExp(regex, 'gi'))
  if (!match) {
    return fail
  }

  for (i = 0, len = match.length; i < len; i++) {
    if (!process(match[i])) {
      return fail
    }
  }

  return (date.getTime() / 1000)
}

/**
 * 3자릿수마다 콤마(,)를 추가하여 리턴합니다.
 * @memberof Utils
 * @param {string} str
 * @return {string}
 * @DEPRECATED
 **/
export function addCommas (str) {
  var parts = (str + '').split('.')
  var main = parts[0]
  var len = main.length
  var output = ''
  var first = main.charAt(0)
  var i

  if (str.split(',').length > 1) {
    return str
  }

  if (first === '-') {
    main = main.slice(1)
    len = main.length
  } else {
    first = ''
  }

  i = len - 1
  while (i >= 0) {
    output = main.charAt(i) + output
    if ((len - i) % 3 === 0 && i > 0) {
      output = ',' + output
    }

    --i
  }

  // put sign back
  output = first + output

  // put decimal part back
  if (parts.length > 1) {
    output += '.' + parts[1]
  }

  return output
}

const windowObjectReference = {}
const defaultWindowFeatures = {
  // position and dimension
  width: 450,
  height: 500,
  // Toolbar and chrome features
  menubar: false,
  toolbar: false,
  location: false,
  status: false,
  // Window functionality features
  noopener: false,
  resizable: true,
  scrollbars: true,
  // Features requiring privileges
  titlebar: false
}

/**
 * { function_description }
 *
 * @param      {string}  url       The url
 * @param      {string}  name      The name
 * @param      {object}  features  The features
 */
export function openWindow (url, name = null, options = {}) {
  let features = []
  options = Object.assign({}, defaultWindowFeatures, options)

  if(windowObjectReference[name] == null || windowObjectReference[name].closed) {
    mapValues(options, (value, key) => {
      value = (value === false) ? 'no' : (value === true) ? 'yes' : value
      features.push(key + '=' + value)
    })
    features = features.join(',')

    return windowObjectReference[name] = window.open(url, name, features)
  } else {
    return windowObjectReference[name].foucs()
  }
}

export default {
  eventify,
  isImage,
  isVideo,
  isAudio,
  formatSizeUnits,
  sizeFormatToBytes,
  isURL,
  asset,
  getUri,
  strtotime,
  addCommas,
  openWindow,
  debounce,
  throttle,
  curry
}
