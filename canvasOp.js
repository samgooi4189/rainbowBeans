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
