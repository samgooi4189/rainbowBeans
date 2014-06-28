var default_color = "#FF0000";
var default_canvas = "myCanvas";
var prev_x = 2;
var prev_y = 2;

//redraw object width
function updateX(x_val)
{
  if (sanitize(x_val, "X value"))
  {
    prev_x = x_val;
    //redrawGraph();
    charts.pop();
    addRect(0,0,prev_x, prev_y);
  }
}

//redraw object height
function updateY(y_val)
{
  if (sanitize(y_val, "Y value")){
    prev_y = y_val;
    //redrawGraph();
    charts.pop();
    addRect(0, 0, prev_x, prev_y);
  }
}

//function redrawGraph(){
//  var c = document.getElementById(default_canvas);
//  var ctx = c.getContext("2d");
//  ctx.fillStyle = default_color;
//  ctx.fillRect(0,0,prev_x,prev_y);
//}

//check for input
function sanitize(num, var_name){
  if(num > Number.MAX_VALUE || num < Number.MIN_VALUE || isNaN(num)){
    alert(var_name + " invalid!");
    return false;
  }
  else
    return true;
}

/**
 * Function for graph dragging
*/
var charts = [];

//object for charts
function Chart(){
  this.x = 0;
  this.y = 0;
  this.width = 1;
  this.height = 1;
  this.fill = '#444444'
}

function addRect(x,y,w,h, fill){
  var rect = new Chart();
  rect.x = x;
  rect.y = y;
  rect.width = w;
  rect.height = h;
  rect.fill = fill;
  charts.push(rect);
  invalidate();
}

var canvas;
var context;
var WIDTH;
var HEIGHT;
var INTERVAL = 20; //frequency to check for redraw

var isDrag = false;
var mouse_x, mouse_y;

//when canvasIsValid is true, invalidate() will redraw
var canvasIsValid = false;

//TODO: make into array to select multiple objects
var selection;
var selection_color = "#CC0000";
var selection_width = 2;

//use of shadow canvas to draw individual chart for selection testing
var shadow_canvas;
var shadow_context;

//since we can drag from anywhere in a node, we save the offset of the mouse
var offset_x, offset_y;

//padding and bordering for mouse offsets
var m_padding_left, m_padding_top, m_border_left, m_border_top;

//init canvas with default settings and start the drawing loop
function init(){
  canvas = document.getElementById(default_canvas);
  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  context = canvas.getContext('2d');
  shadow_canvas = document.createElement("CANVAS");
  shadow_canvas.height = HEIGHT;
  shadow_canvas.width = WIDTH;
  shadow_context = shadow_canvas.getContext("2d");

  //prevent double clicking that select text on canvas
  canvas.onselectstart = function(){ return false; }

  //fix mouse coordinate system when padding and border exist
  if (document.defaultView && document.defaultView.getComputedStyle){
    m_padding_left = parseInt(document.defaultView.getComputedStyle(canvas, null) ['paddingLeft'], 10) || 0;
    m_padding_top = parseInt(document.defaultView.getComputedStyle(canvas, null) ['paddingTop'], 10) || 0;
    m_border_left = parseInt(document.defaultView.getComputedStyle(canvas, null) ['borderLeftWidth'], 10) || 0;
    m_border_top = parseInt(document.defaultView.getComputedStyle(canvas, null) ['borderTopWidth'], 10) || 0;
  }

  //set draw() interval
  setInterval(draw, INTERVAL);

  //set mouse events to canvas
  canvas.onmousedown = MouseDown;
  canvas.onmouseup = MouseUp;
  canvas.ondbclick = MouseDoubleClick;

  //Add test cube
  addRect(0, 0, 100, 100, '#1100dd');
}

function draw(){
  if(!canvasIsValid){
    //assume context had been initialized
    clear(context);
    
    //draw all the charts
    var count = charts.length;
    for (var i=0; i<count; i++){
      drawshape(context, charts[i], charts[i].fill);
    }

    //draw selection (border line)
    if(selection!=null){
      context.strokeStyle = selection_color;
      context.lineWidth = selection_width;
      context.strokeRect(selection.x, selection.y, selection.width, selection.height); 
    }

    canvasIsValid = true;
  }
}

function clear(c){
  c.clearRect(0,0,WIDTH, HEIGHT);
}

function drawshape(c, shape, fill){
  c.fillStyle = fill;
  //skip drawing if we move off screen
  if (shape.x > WIDTH || shape.y > HEIGHT) return;
  if (shape.x + shape.width < 0 || shape.y + shape.height < 0) return;

  c.fillRect(shape.x, shape.y, shape.width, shape.height);
}

function invalidate(){
  canvasIsValid = false;
}

// Sets mx,my to the mouse position relative to the canvas
function getMouse(e) {
      var element = canvas, offsetX = 0, offsetY = 0;

      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }

      // Add padding and border style widths to offset
      offsetX += m_padding_left;
      offsetY += m_padding_top;

      offsetX += m_border_left;
      offsetY += m_border_top;

      mouse_x = e.pageX - offsetX;
      mouse_y = e.pageY - offsetY;
}

/**
 * Mouse events
*/

//function prepareCanvas(){
//  console.log("preparing canvas");
//  var canvas = document.getElementById(default_canvas);
//  canvas.addEventListener('mousedown', MouseDown, false);
//  canvas.addEventListener('mouseup', MouseUp, false);
//  canvas.addEventListener('mouseleave', MouseLeave, false);
//}

function MouseDown(e){
  console.log("mouse down")
  getMouse(e);
  clear(shadow_context);
  
  //go through all the charts
  var count = charts.length;
  for(var i = count-1; i>=0; i--){
      //draw chart onto shadow context
      drawshape(shadow_context, charts[i], '#444444');

      //get image data at mouse x,y 
      var image_data = shadow_context.getImageData(mouse_x, mouse_y, 1, 1);
      var index = (mouse_x + mouse_y * image_data.width) * 4;

      //if the mouse is pointing on the chart, select and break
      if(image_data.data[3] > 0){
        selection = charts[i];
        offset_x = mouse_x - selection.x;
        offset_y = mouse_y - selection.y;
        selection.x = mouse_x - offset_x;
        selection.y = mouse_y - offset_y;
        isDrag = true;
        canvas.onmousemove = MouseMove;
        invalidate();
        clear(shadow_canvas);
        return;
      }
  }
  
  selection = null;
  clear(shadow_context);
  invalidate();
}

function MouseMove(e){
  console.log("mouse move")
  if(isDrag){
    getMouse(e);
    selection.x = mouse_x - offset_x;
    selection.y = mouse_y - offset_y;
    invalidate();
  }
}

function MouseUp(e){
  console.log("mouse up")
  isDrag = false;
  //remove event handler
  canvas.onmousemove = null;
}

function MouseLeave(e){
  console.log("mouse leave")
  isDrag = false;
  canvas.onmousemove = null;
}

//add new shapes for testing
function MouseDoubleClick(e){
  getMouse(e);
  var width = 10;
  var height = 10;
  addRect(mouse_x - (width /2), mouse_y - (height/2), width, height, '#77DD44');
}


 
