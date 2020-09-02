const latInput = document.getElementById("lat-input");
const lonInput = document.getElementById("lon-input");
const zoomInput = document.getElementById("zoom-input");

const imgElem = document.getElementById("result-img");
const coordsDisplay = document.getElementById("display-coords");

var currentZoom = 1;
var currentXTile = 1;
var currentYTile = 1;

imgElem.onmousemove = (e) => {
  mouseMoveEvent(e);
};

imgElem.oncontextmenu = (e) => {
  return false;
};

imgElem.onmouseup = (e) => {
  clickEvent(e);
};

function lon2tile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function lat2tile(lat, zoom) {
  return Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
}

function tile2long(x, z) {
  return (x / Math.pow(2, z)) * 360 - 180;
}
function tile2lat(y, z) {
  var n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

function Xpx2long(x) {
  return (
    tile2long(currentXTile, currentZoom) +
    (360 / 255 / Math.pow(2, currentZoom)) * x
  );
}

function Ypx2lat(y) {
  return (
    tile2lat(currentYTile, currentZoom) -
    (170.102258 / 255 / Math.pow(2, currentZoom)) * y
  );
}

function getRequestLinkFromTile() {
  return `https://a.tile.openstreetmap.org/${currentZoom}/${currentXTile}/${currentYTile}.png`;
}

function getTileButtonCallback() {
  currentZoom = parseInt(zoomInput.value);
  currentXTile = lon2tile(parseFloat(lonInput.value), currentZoom);
  currentYTile = lat2tile(parseFloat(latInput.value), currentZoom);
  updateImg();
}

function updateImg() {
  var srcImg = getRequestLinkFromTile();
  imgElem.src = srcImg;
}

function mouseMoveEvent(e) {
  // e = Mouse click event.
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left; //x position within the element.
  var y = e.clientY - rect.top; //y position within the element.

  coordsDisplay.innerText = "" + Xpx2long(x) + "," + Ypx2lat(y);
}

function clickEvent(e) {
  // e = Mouse click event.
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left; //x position within the element.
  var y = e.clientY - rect.top; //y position within the element.

  var mouseLon = Xpx2long(x);
  var mouseLat = Ypx2lat(y);

  // Left Click
  if (e.button === 0 && currentZoom < 16) {
    currentZoom += 1;
  }

  if (e.button === 2 && currentZoom > 0) {
    currentZoom -= 1;
  }

  currentXTile = lon2tile(mouseLon, currentZoom);
  currentYTile = lat2tile(mouseLat, currentZoom);

  updateImg();
}
