// convert rgb color code to corresponding hex value
function rgb2hex(rgb) {
  if(rgb.match(/^\#[0-9a-f]{6}/i))
    return rgb;
  if(rgb == "none" || rgb == "") 
    return '#FFFFFF';
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

// add color pick inputs to page, based on inkscape-generated
// selection sets in svg image
function addColorPickers(imageId, targetId){
  var img = document.getElementById(imageId);
  var pickerContainer = document.getElementById(targetId);
  var areas = img.getElementsByTagName("inkscape:tag");
  for(let a of areas) {
    let label = a.getAttribute("inkscape:label");
    let id = a.id;
    let pickerId = "picker-" + id;
    let colPickDiv = document.createElement('div');
    let colPick = document.createElement('input');
    colPick.type = "color";
    colPick.id = pickerId;
    colPick.title = label;
    colPick.className += "imgColorPicker";
    let colPickLabel = document.createElement('label');
    colPickLabel.for = pickerId;
    colPickLabel.innerText = label;
    // get value 
    partId = a.getElementsByTagName("inkscape:tagref").item(0).getAttribute("xlink:href").replace('#', '');
    let initColor = '#FFFFFF';
    if(img.getElementById(partId).style.fill != "none"){
      initColor = rgb2hex(img.getElementById(partId).style.fill);
    }
    else {
      initColor = rgb2hex(img.getElementById(partId).style.stroke);
    }

    colPick.onchange = function(){setColor(imageId, id, pickerId);};
    colPick.value = initColor;
    colPickDiv.appendChild(colPickLabel);
    colPickDiv.appendChild(colPick);
    pickerContainer.appendChild(colPickDiv);
  }
};

// set color of selection
function setColor(imageId, id, pickerId){
  var val = document.getElementById(pickerId).value;
  var img = document.getElementById(imageId);
  let area = document.getElementById(id);
  for(let part of area.getElementsByTagName("inkscape:tagref")){
    let subid = part.getAttribute("xlink:href").replace('#', '');
    if(img.getElementById(subid).style.fill == "none"){
      img.getElementById(subid).style.stroke = val;
    }
    else {
      img.getElementById(subid).style.fill = val;
    }

  }
};

// get current color scheme as a hash with id:s of className as keys and colors
// as values
function getColorScheme(className){
  var colorScheme = {};
  for(let p of document.getElementsByClassName(className)) {
    colorScheme[p.id] = p.value;
  }
  return colorScheme;
}

// set colors from colorScheme object
function setColorScheme(colorScheme){
  for(let [id, color] of Object.entries(colorScheme)) {
    let picker = document.getElementById(id);
    picker.value = color;
    picker.onchange();
  }
}

// get diff between two colorSchemes c1 and c2
// in the form of a colorScheme hash
function colorDiff(c1, c2){
  var diff = {}
  for(let [id, color] of Object.entries(c1)){
    if(c2[id] != color) {
      diff[id] = color
    }
  }
  return diff
}

// get color-keyed scheme, a hash with
// entries: "color" -> [indices of id:s with that color]
function colorKeyedScheme(c, refColorScheme){
  // obtain array of unique colors
  var colors = [... new Set(Object.values(c))]
  // array of area keys from reference scheme
  var ids = [... new Set(Object.keys(refColorScheme))]
  var res = {}
  for(let i in ids){
    if(c[ids[i]])
      res[c[ids[i]]] ? res[c[ids[i]]].push(i) : res[c[ids[i]]] = [i];
  }
  return res
}

// convert color-keyed scheme to string 
function colorKeyedSchemeStr(c, refColorScheme){
  var res = "";
  for(let [key,val] of Object.entries(c)){
    res += key + ":" + val.toString();
  }
  return res;
}

// convert string to colorScheme
function keyedSchemeStr2Scheme(str, refColorScheme){
  s = {};
  var colorIndex = [... new Set(Object.keys(refColorScheme))]
  for(let cstr of str.split('#')){
    let col, ind
    if(cstr.split(":").length != 2) continue;
    [col, ind] = cstr.split(":")
    if(!col || !ind) continue;
    for(let i of ind.split(",")){
      if(!colorIndex[i]) continue;
      s[colorIndex[i]] = '#'+col
    }
  }
  return s
}
