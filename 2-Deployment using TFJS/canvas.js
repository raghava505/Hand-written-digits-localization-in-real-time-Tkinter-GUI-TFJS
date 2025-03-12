window.addEventListener("load" , ()=> {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const rawimg = document.getElementById("image");
  let painting = false;
  var clearb,recogb;
  var model;
  const img_size = 24;
  const full_size = 80;


  async function run() {
    const MODEL_URL = "http://127.0.0.1:8887/model.json";
    // const MODEL_URL = "http://127.0.0.1:8887/model.json";

    model = await tf.loadLayersModel(MODEL_URL);
    console.log(model.summary());
  }
  run();
  console.log(model)
  // ctx.fillRect(0,0,10,10);
  // ctx.beginPath();
  // ctx.moveTo(100 , 100);
  // ctx.lineTo(200 , 200);
  // ctx.stroke();
  function startpos(e){
    painting = true;
    ctx.beginPath();
    draw(e);
  }
  function finishpos(){
    painting = false;
  }
  function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  function draw(e) {
    if(painting == false) return;
    ctx.lineWidth = 17;
    ctx.lineCap = "round";
    ctx.strokeStyle="white";
    var pos = getMousePos(canvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    rawimg.src = canvas.toDataURL("image.png");

  }
  canvas.addEventListener("mousedown" , startpos);
  canvas.addEventListener("mouseup" , finishpos);
  canvas.addEventListener("mousemove" , draw);
  function erase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }



  function recog() {
    var raw = tf.browser.fromPixels(rawimg, 1);
    var sizes = [80];
    var all_classes = [];
    var all_probs = [];
    var all_boxes = [];
    sizes.forEach((s, i) => {
      var resized = tf.image.resizeBilinear(raw,[s,s]);

      var tensor = resized.expandDims(0);
      tensor = tf.div(tensor,255);
      var crct= (full_size - s) / 2;
      tensor = tf.pad(tensor, [[0,0] , [ crct,crct] , [crct ,crct ], [0,0]] , 0);
      var result = model.predict(tensor);
      var probs = result[0];
      var boxes = result[1];
      probs =probs.dataSync();
      boxes =boxes.dataSync();
      var indexOfMaxValue = probs.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
      all_classes[i] = indexOfMaxValue;
      all_boxes[i] = boxes;
      all_probs[i] = probs[indexOfMaxValue];
    });

    var finalind = all_probs.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    var finalscale = sizes[finalind];
    var finalclass = all_classes[finalind];
    var finalprob = all_probs[finalind];
    var finalbox = all_boxes[finalind];

    console.log(finalclass,finalprob,finalbox)



    var scale = canvas.width / full_size;

    var box_height = finalbox[3]*scale;
    var box_width = finalbox[2]*scale;



    if (finalprob > 0.5){
      ctx.fillStyle = "green";
      ctx.font = "25px Arial";
      var x1=finalbox[0]*scale * finalscale/full_size;
      var x2= finalbox[1]*scale* finalscale/full_size;

      if (x2<25){
        x2=26;
      }
      finalprob = (finalprob*100).toFixed(2);
      var t = finalclass + "    " + finalprob + "%";
      ctx.fillText(t, x1,x2-5);

      ctx.strokeStyle="green";
      ctx.lineWidth = 5;
      ctx.strokeRect(x1,x2,box_height,box_width);
    }
    else{
      ctx.fillStyle = "white";
      ctx.font = "15px Arial";
      ctx.fillText("Couldn't recognize! Please enter the text small and clear", 20,25);
    }




  }
  clearb = document.getElementById("cb");
  clearb.addEventListener("click" , erase);
  recogb = document.getElementById("rb");
  recogb.addEventListener("click" , recog);
})
