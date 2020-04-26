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

// get current color scheme
function getColorScheme(){
  var colorScheme = {};
  for(let p of document.getElementsByClassName("imgColorPicker")) {
    colorScheme[p.id] = p.value;
  }
  return colorScheme;
}

// set colorScheme from object
function setColorScheme(colorScheme){
  for(let [id, color] of Object.entries(colorScheme)) {
    let picker = document.getElementById(id);
    picker.value = color;
    picker.onchange();
  }
}
