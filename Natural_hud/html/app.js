function rgba(hex, opacity) {
  hex = hex.replace("#", "");
  redColor = parseInt(hex.substring(0, 2), 16);
  greenColor = parseInt(hex.substring(2, 4), 16);
  blueColor = parseInt(hex.substring(4, 6), 16);
  result =
    "rgba(" +
    redColor +
    "," +
    greenColor +
    "," +
    blueColor +
    "," +
    opacity / 100 +
    ")";
  return result;
}

var loadJS = function (url, implementationCode, location) {
  var scriptTag = document.createElement("script");
  scriptTag.src = url;
  scriptTag.onload = implementationCode;
  scriptTag.onreadystatechange = implementationCode;
  location.appendChild(scriptTag);
};

function ajaxio(method, url, type = null, data = null) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(method, url, true);
    if (method == "POST") {
      if (type == "json" && data != null) {
        req.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify(data);
      } else {
        req.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
      }
    }
    req.onload = () =>
      req.status === 200
        ? resolve(req.response)
        : reject(Error(req.statusText));
    req.onerror = (e) => reject(Error(`Network Error: ${e}`));
    if (method == "POST") {
      req.send(data);
    } else {
      req.send();
    }
  });
}

Object.prototype.addMultiListener = function (eventNames, listener) {
  var events = eventNames.split(" ");
  if (NodeList.prototype.isPrototypeOf(this) == true) {
    for (var x = 0, xLen = this.length; x < xLen; x++) {
      for (var i = 0, iLen = events.length; i < iLen; i++) {
        this[x].addEventListener(events[i], listener, false);
      }
    }
  } else if (HTMLElement.prototype.isPrototypeOf(this) == true) {
    for (var i = 0, iLen = events.length; i < iLen; i++) {
      this.addEventListener(events[i], listener, false);
    }
  }
};

window.onload = function () {
  var flashing = false;
  var eventCallback = {
    ui: function (data) {
      var config = data.config;

      if (config.showHealth == true) {
        document.querySelector("#health").style.display = "block";
      }
      if (config.showArmor == true) {
        document.querySelector("#armor").style.display = "block";
      }
      if (config.showStamina == true) {
        document.querySelector("#stamina").style.display = "block";
      }
      if (config.showHunger == true) {
        document.querySelector("#hunger").style.display = "block";
      }
      if (config.showThirst == true) {
        document.querySelector("#thirst").style.display = "block";
      }
      if (config.showStress == true) {
        document.querySelector("#stress").style.display = "block";
      }
      if (config.showZovid19 == true) {
        document.querySelector("#zovid19").style.display = "block";
      }
      if (config.showVoice == true) {
        document.querySelector("#voice").style.display = "block";
      }
    },

    element: function (data) {
      if (data.task == "enable") {
        document.querySelector("#" + data.value).style.display = "block";
      } else if (data.task == "disable") {
        document.querySelector("#" + data.value).style.display = "none";
      }
    },

    setText: function (data) {
      var key = document.querySelector("#" + data.id + " span");
      var html = data.value;
      saferInnerHTML(key, html);
    },

    setFont: function (data) {
      document.querySelector("#font").href = data.url;
      document.body.style.fontFamily = data.name;
    },

    isTalking: function (data) {
      var voiceId = document.querySelector("#voice");
      if (data.value) {
        voiceId.classList.add("speak");
      } else {
        voiceId.classList.remove("speak");
      }
    },

    setVoiceDistance: function (data) {
      var voiceIdWithClasses = document.querySelector("#voice i").classList;
      if (data.value === "whisper") {
        voiceIdWithClasses.remove(
          "fa-volume-off",
          "fa-volume-up",
          "fa-volume-down"
        );
        voiceIdWithClasses.add("fa-volume-off");
      } else if (data.value === "shout") {
        voiceIdWithClasses.remove(
          "fa-volume-off",
          "fa-volume-up",
          "fa-volume-down"
        );
        voiceIdWithClasses.add("fa-volume-up");
      } else {
        voiceIdWithClasses.remove(
          "fa-volume-off",
          "fa-volume-up",
          "fa-volume-down"
        );
        voiceIdWithClasses.add("fa-volume-down");
      }
    },

    createStatus: function (data) {
      var motherStatus = document.querySelector("div#status ul");
      var statusID = data.status;
      var statusPrimaryColor = rgba(data.color, 100);
      var statusSecondaryColor = rgba(data.color, 75);
      var statusIcon =
        data.icon +
        '<span style="background: linear-gradient(0deg, ' +
        statusSecondaryColor +
        " 0%, " +
        statusPrimaryColor +
        ' 100%);"></span>';
      if (document.getElementById(statusID)) {
      } else {
        var newStatus = document.createElement("li");
        newStatus.classList.add("icon", "customstatus");
        newStatus.id = statusID;
        motherStatus.insertBefore(newStatus, motherStatus.firstChild);
        saferInnerHTML(document.getElementById(statusID), statusIcon);
      }
    },

    setStatus: function (data) {
      if (data.isdead == true) {
        if (
          document.querySelector("#health").classList.contains("dead") == false
        ) {
          document.querySelector("#health").classList.add("dead");
          for (i = 0; i < data.status.length; i++) {
            document.querySelector(
              "#" + data.status[i].name + " span"
            ).style.height = "0";
          }
        }
      } else {
        for (i = 0; i < data.status.length; i++) {
          if (
            data.status[i].name == "hunger" ||
            data.status[i].name == "thirst" ||
            data.status[i].name == "stress" ||
            data.status[i].name == "zovid19"
          ) {
            var statusValue = Math.floor(100 - data.status[i].value);
          } else {
            var statusValue = Math.floor(data.status[i].value);
          }

          if (document.querySelector("#" + data.status[i].name + " span")) {
            document.querySelector(
              "#" + data.status[i].name + " span"
            ).style.height = statusValue + "%";
          }
          if (statusValue <= 35) {
            if (document.querySelector("#" + data.status[i].name)) {
              if (
                document
                  .querySelector("#" + data.status[i].name)
                  .classList.contains("dying") == false
              ) {
                document
                  .querySelector("#" + data.status[i].name)
                  .classList.add("dying");
              }
            }
          } else {
            if (document.querySelector("#" + data.status[i].name)) {
              document
                .querySelector("#" + data.status[i].name)
                .classList.remove("dying");
            }
          }
        }
        if (document.querySelector("#health").classList.contains("dead")) {
          document.querySelector("#health").classList.remove("dead");
        }
      }
    },

    setCops: function(data) {
      if(data.policeCount >= 2){
        document.querySelector('#policeSpan').classList.remove("police-off");
      }else{
        document.querySelector('#policeSpan').classList.add("police-off");
      }
    },

    updateVehicle: function (data) {
      var vehicleInfo = document.querySelector(".info.vehicle");
      var vehicleSeatbelt = document.querySelector("#seatbelt");
      var vehicleLights = document.querySelector("#lights");
      var vehicleFuel = document.querySelector("#fuel");
      var vehicleCruiser = document.querySelector("#vehicle-speed strong");
     /* var vehicleRPM = document.querySelector("#vehicle-rpm strong"); */
      var vehiclesCars = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        17,
        18,
        19,
        20,
      ];

      if (data.status == true) {
        if (vehicleInfo.classList.contains("inactive")) {
          vehicleSeatbelt.style.display = "none";
          vehicleLights.style.display = "none";
          vehicleFuel.style.display = "none";

          if (vehiclesCars.indexOf(data.type) > -1) {
            document.querySelector("#vehicle-others").style.display = "none";
            document.querySelector("#vehicle-gear").style.display = "block";

            vehicleSeatbelt.style.display = "block";
            vehicleLights.style.display = "block";
            vehicleFuel.style.display = "block";

            document.querySelector("#vehicle-gear").style.display = "block";
          } else {
            document.querySelector("#vehicle-others").style.display = "block";
            document.querySelector("#vehicle-gear").style.display = "none";
            document
              .querySelector("#vehicle-others i")
              .classList.remove("fa-biking", "fa-helicopter", "fa-ship");

            if (data.type == 13) {
              document
                .querySelector("#vehicle-others i")
                .classList.add("fa-biking");
            } else if (data.type == 14) {
              document
                .querySelector("#vehicle-others i")
                .classList.add("fa-ship");
            } else if (data.type == 15) {
              document
                .querySelector("#vehicle-others i")
                .classList.add("fa-helicopter");
            } else if (data.type == 16) {
              document
                .querySelector("#vehicle-others i")
                .classList.add("fa-plane");
            } else if (data.type == 21) {
              document
                .querySelector("#vehicle-others i")
                .classList.add("fa-train");
            }
          }

          vehicleInfo.classList.remove("inactive");
          vehicleInfo.classList.add("active", "fadeIn");
        }

        if (vehicleInfo.classList.contains("updated") == false) {
          var vehicleSpeedUnit =
            data.config.speedUnit.slice(0, 2) +
            "/" +
            data.config.speedUnit.slice(-1);
          var vehicleAverageSpeed = Math.ceil(data.config.maxSpeed / 6);

          vehicleInfo.classList.add("updated");
          saferInnerHTML(vehicleCruiser, vehicleSpeedUnit);
        }
        var previousGear = document.querySelector("#vehicle-gear span")
          .innerHTML;
        var currentGear = data.gear;
        if (previousGear != currentGear) {
          document.querySelector("#vehicle-gear").classList.add("pulse");
        }
        saferInnerHTML(document.querySelector("#vehicle-gear span"), data.gear);

        var rpmCircle = document.querySelector(
          "#progress-rpm svg circle.speed"
        );
        var rpmPercentage = Math.floor(
          Math.floor(data.rpm * 100) / data.config.maxRPM
        );

        rpmCircle.classList.remove("zero");
        rpmCircle.classList.remove("twentyfive");
        rpmCircle.classList.remove("fifty");
        rpmCircle.classList.remove("seventyfive");

        if (rpmPercentage >= 0 && rpmPercentage <= 25) {
          rpmCircle.classList.add("zero");
        } else if (rpmPercentage > 25 && rpmPercentage <= 50) {
          rpmCircle.classList.add("twentyfive");
        } else if (rpmPercentage > 50 && rpmPercentage <= 75) {
          rpmCircle.classList.add("fifty");
        } else if (rpmPercentage > 75) {
          rpmCircle.classList.add("seventyfive");
        }

        document.querySelector(
          "#progress-speed svg circle.speed"
        ).style.strokeDashoffset = data.nail;
        saferInnerHTML(
          document.querySelector("#vehicle-speed span"),
          data.speed
        );

        var speedometerCircle = document.querySelector(
          "#progress-speed svg circle.speed"
        );
        var speedPercentage = Math.floor(
          Math.floor(data.speed * 100) / data.config.maxSpeed
        );

        speedometerCircle.classList.remove("zero");
        speedometerCircle.classList.remove("twentyfive");
        speedometerCircle.classList.remove("fifty");
        speedometerCircle.classList.remove("seventyfive");

        if (speedPercentage >= 0 && speedPercentage <= 25) {
          speedometerCircle.classList.add("zero");
        } else if (speedPercentage > 25 && speedPercentage <= 50) {
          speedometerCircle.classList.add("twentyfive");
        } else if (speedPercentage > 50 && speedPercentage <= 75) {
          speedometerCircle.classList.add("fifty");
        } else if (speedPercentage > 75) {
          speedometerCircle.classList.add("seventyfive");
        }

        document.querySelector(
          "#progress-rpm svg circle.speed"
        ).style.strokeDashoffset = data.nailRPM;
        /* saferInnerHTML(document.querySelector("#vehicle-rpm span"), data.rpm); */

        if (
          data.seatbelt.status == true &&
          vehicleSeatbelt.classList.contains("on") == false
        ) {
          vehicleSeatbelt.classList.remove("off");
          vehicleSeatbelt.classList.add("on");

          eventCallback.sound("sounds/seatbelt-buckle.ogg", { volume: "0.50" });
        } else if (
          data.seatbelt.status == false &&
          vehicleSeatbelt.classList.contains("off") == false
        ) {
          vehicleSeatbelt.classList.remove("on");
          vehicleSeatbelt.classList.add("off");

          eventCallback.sound("sounds/seatbelt-unbuckle.ogg", {
            volume: "0.50",
          });
        }

        if (vehicleCruiser.classList.contains(data.cruiser) == false) {
          vehicleCruiser.classList.remove("on", "off");
          vehicleCruiser.classList.add(data.cruiser);
        }

        /* if (vehicleRPM.classList.contains(data.cruiser) == false) {
          vehicleRPM.classList.remove("on", "off");
          vehicleRPM.classList.add(data.cruiser);
        }*/

        if (data.siren == true) {
          document.querySelector("#vehicle-gear").classList.add("pulsing");
        } else {
          document.querySelector("#vehicle-gear").classList.remove("pulsing");
        }

        if (vehicleLights.classList.contains(data.lights) == false) {
          vehicleLights.classList.remove("normal", "high", "off");
          vehicleLights.classList.add(data.lights);

          if (data.lights == "high") {
            vehicleLights.querySelector("i img").src = "img/lights_up.svg";
          } else {
            vehicleLights.querySelector("i img").src = "img/lights.svg";
          }
        }

        vehicleFuel.querySelector("span").style.height = data.fuel + "%";

        if (data.fuel <= 35) {
          if (vehicleFuel.classList.contains("dying") == false) {
            vehicleFuel.classList.add("dying");
          }
        } else {
          vehicleFuel.classList.remove("dying");
        }
      } else {
        if (vehicleInfo.classList.contains("active")) {
          vehicleSeatbelt.classList.remove("on");
          vehicleCruiser.classList.remove("on");
         /* vehicleRPM.classList.remove("on"); */

          vehicleInfo.classList.remove("active");
          vehicleInfo.classList.add("inactive", "fadeOut");

          eventCallback.sound();
        }
      }
    },

    toggleUi: function (data) {
      var uiID = document.querySelector("#ui");
      if (data.value == true) {
        uiID.style.display = "block";
      } else {
        uiID.style.display = "none";
      }
    },

    sound: function (file = null, args = null) {
      var sound = document.querySelector("#sounds");
      var soundFile = file;
      var args = args;

      for (i = 0; i < sound.attributes.length; i++) {
        if (sound.attributes[i].name != "id") {
          sound.removeAttribute(sound.attributes[i].name);
        }
      }

      if (soundFile == null) {
        sound.setAttribute("src", "");
      } else {
        if (args == null) {
        } else {
          for (var key in args) {
            if (key != "addMultiListener") {
              if (key == "volume") {
                sound.volume = args[key];
              } else {
                sound.setAttribute(key, args[key]);
              }
            }
          }
        }

        sound.setAttribute("src", soundFile);
        sound.play();
      }
    },
  };

  document
    .querySelectorAll(".icon i")
    .addMultiListener(
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
      function () {
        this.parentElement.classList.remove("pulse");
        this.parentElement.classList.remove("shooting");
      }
    );

  document
    .querySelectorAll(".info.vehicle")
    .addMultiListener(
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
      function () {
        this.classList.remove("fadeOut", "fadeIn");
      }
    );

  window.addEventListener("message", function (event) {
    eventCallback[event.data.action](event.data);
  });
};
