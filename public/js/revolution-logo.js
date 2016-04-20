$(function () {
  var stage = new createjs.Stage("revolution-logo");
  var bear = new createjs.Shape();
  var bx = 150;
  var by = 150;
  var colors = ["rgba(255,0,18,0.7)", "rgba(176,0,169,0.7)", "rgba(0,57,176,0.7)",
                "rgba(255,217,0,0.7)", "rgba(91,227,0,0.7)", "rgba(0,132,176,0.7)",
                "rgba(86,0,176,0.7)", "rgba(255,125,0,0.7)", "rgba(0,227,214,0.7)"]

  // draw bear
  var img = document.createElement("img");
  img.onload = function (e) {
    bear = new createjs.Bitmap(img);
    bear.x = 57.5;
    bear.y = 90;
    bear.alpha = 0.7;
    stage.addChild(bear);
  }
  img.crossOrigin = 'anonymous';
  img.src = "https://sweltering-inferno-2934.firebaseapp.com/img/revs/bear.png";

  var orb, ox, oy, oc, angle, offset;
  var or = 11;
  var od = 60;
  var on = 9;
  var oa = 2 * Math.PI / on;
  var cn = 36;
  var ca = 2 * Math.PI / cn;
  var orbs = [];
  var orbdata;
  var i = 0;
  var j = 0;

  // draw orbs
  for (i = 0; i < on; i++) {
    orb = new createjs.Shape();
    angle = i * oa;
    ox = bx + od * Math.cos(angle);
    oy = by + od * Math.sin(angle);
    orb.graphics.beginFill(colors[i]).drawCircle(ox, oy, or);
    stage.addChild(orb);

    // set curve path for this orb
    oc = [];
    for (j = 0; j < cn; j++) {
        offset = j * ca + angle;
        oc.push(od * Math.cos(offset));
        oc.push(od * Math.sin(offset));
    }

    // loop the curve back around
    oc.push(oc[0]);
    oc.push(oc[1]);

    // stash the data
    orbdata = {
        orb: orb,
        curve: oc
    };
    orbs.push(orbdata);
  }

  // set the orbs in motion
  createjs.MotionGuidePlugin.install();
  for (i = 0; i < on; i++) {
    createjs.Tween.get(orbs[i].orb, {loop:true})
      .to({guide: { path: orbs[i].curve } }, 7000, createjs.Ease.getBackInOut(2))
  }

  // tick tock
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
});
