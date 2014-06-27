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
    redrawGraph();
  }
}

//redraw object height
function updateY(y_val)
{
  if (sanitize(y_val, "Y value")){
    prev_y = y_val;
    redrawGraph();
  }
}

function redrawGraph(){
  var c = document.getElementById(default_canvas);
  var ctx = c.getContext("2d");
  ctx.fillStyle = default_color;
  ctx.fillRect(0,0,prev_x,prev_y);
}

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
 * Mouse events
*/
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var drag; 

function prepareCanvas(){
  console.log("preparing canvas");
  var canvas = document.getElementById(default_canvas);
  canvas.addEventListener('mousedown', MouseDown, false);
  canvas.addEventListener('mousemove', MouseMove, false);
  canvas.addEventListener('mouseup', MouseUp, false);
  canvas.addEventListener('mouseleave', MouseLeave, false);
}

function MouseDown(e){
    console.log("mouse down")
    var mouse_x = e.pageX - this.offsetLeft;
    var mouse_y = e.pageY - this.offsetTop;

    drag = true;
    addDrag(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redrawAfterDrag();
}

function MouseMove(e){
    console.log("mouse move")
    if(drag){
      addDrag(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redrawAfterDrag();
    }
}

function MouseUp(e){
    drag = false;
}

function MouseLeave(e){
    drag = false;
}


function addDrag(x, y, dragging){
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

//pop element out of stack
function popStack(targetArray){
  if(targetArray.length != 0){
    var element = targetArray[0];
    targetArray.shift();
    return element;
  }
  else
    return 0;
}

function redrawAfterDrag(){
  var context = document.getElementById(default_canvas).getContext('2d');
  context.width = context.width;
  context.fillStyle = default_color;
  //context.translate(popStack(clickX), popStack(clickY));
  redrawGraph();
}

