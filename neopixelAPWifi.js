/*	Espruino Wifi - Neopixel control via AP
	M.Law - 05/02/2019 */
	
var wifi = require("Wifi");
var WIFI_NAME = "Espruino";
var WIFI_OPTIONS = {
  "password": "espruino123",
  "authMode": "wpa_wpa2",
  "channel": 5 };
var toggle = true;
var arr = new Uint8ClampedArray(75);
var pos = 0;

function onInit()
{
  setTimeout( onStart, 5000 );
}

function onStart() 
{
  console.log ("Starting server...");
  wifi.startAP(WIFI_NAME, WIFI_OPTIONS,
    function(err)
    {
      if (err) {
        console.log("Connection error: " + err);
        return;
      }
    onConnected();
    });
  console.log ("Started server...");
}

function onConnected() 
{
  console.log("Connected!");
  wifi.getAPIP( function (err, ip) {
    console.log("Connect to http://" + ip.ip + ":8000");
  });
  Serv();
}

function Serv() 
{
  var page = '<html><body>Hello WebSocket<script>var  ws; (function(){';
  page += 'ws = new WebSocket("ws://" + location.host + "/my_websocket", "protocolOne");';
  page += 'ws.onmessage = function (event) { console.log("MSG:"+event.data); };';
  page += 'setTimeout(function() { ws.send("Hello to Espruino!");}, 1000);';
  page += '},1000);</script></body></html>';
  function onPageRequest(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(page);
  }
  var server = require('ws').createServer(onPageRequest);
  server.listen(8000);
  server.on("websocket", function(ws) {
  ws.on('message', handleMsg );
  ws.send("Hello from Espruino!");
  });
}

function handleMsg(msg) {
  print(msg);
  if (msg  == "red();")
  {
    animateOn(!toggle);
    red(50, 0, 0);
  }
  else if (msg == "green();")
  {
    animateOn(!toggle);
    green(0,50,0);
  }
  else if (msg == "blue();")
  {
    animateOn(!toggle);
    blue(0,0,50);
  }
  else if (msg == "offLED();")
  {
    animateOn(!toggle);
    offLED(0,0,0);
  }
  else if (msg == "animateOn();")
  {
    animateOn(toggle);
  }
  }

function red(r, g, b) 
{
    require("neopixel").write(B15, [g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b]);
}

function green(r, g, b) 
{
    require("neopixel").write(B15, [g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b]);
}

function blue(r, g, b) 
{
    require("neopixel").write(B15, [g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b]);
}

function getPattern() 
{
  pos++;
  for (var i=0;i<arr.length;i+=3) 
  {
    arr[i  ] = (1 + Math.sin((i+pos)*0.1324)) * 127;
    arr[i+1] = (1 + Math.sin((i+pos)*0.1654)) * 127;
    arr[i+2] = (1 + Math.sin((i+pos)*0.1)) * 127;
  }
}

function onTimer() 
{
  getPattern();
  require("neopixel").write(B15, arr);
}

function animateOn(on) 
{
  if (on)
    setInterval(onTimer, 100);
  else
    require("neopixel").write(B15, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
}

function offLED(r, g, b) 
{
  require("neopixel").write(B15, [g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b,g,r,b]);
}

