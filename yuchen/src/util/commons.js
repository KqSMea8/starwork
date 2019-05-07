export function timeFormat(second) {
  let minutes = Math.floor(second / 60);
  let seconds = parseInt(second) % 60 + "";
  let mask = "00";
  return minutes + ":" + mask.substring(0, mask.length - seconds.length) + seconds
}

export function timeFormatHz(second) {
  let minutes = Math.floor(second / 60);
  let seconds = parseInt(second) % 60 + "";
  let mask = "00";
  return minutes + "分" + mask.substring(0, mask.length - seconds.length) + seconds + "秒";
}

export function cropStringByLength(str, len) {
  let newLen = 0;
  let newStr = "";
  for ( let int = 0; int <str.length; int++) {
    let a  = str.charAt(int);
    newLen++;
    if(escape(a).length>4){
      newLen++;
    }
    if(newLen>len){
      break;
    }
    newStr = newStr+a;
  }
  if(newLen>len){
    newStr = newStr+"...";
  }
  return newStr;

}

export function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}
