var map, initOptions, exploreOptions, watchOptions;
var isWatching = true;

// On page load
$(function () {
  var $body        = $("body");
  var $exploreBtn  = $("#explore-btn");
  var $watchBtn    = $("#watch-btn");
  var $infoBtn     = $("#info-btn");
  var isInfoOn     = false;
  var $closeBtn    = $("#close-btn");
  var $infoContent = $("#adl-info");
  var $video       = $("#adl-video");
  var $embed       = $("iframe", $video);
  var aspect       = $embed.height() / $embed.width();
  var $waIntro     = $("#watch-intro");
  var $exIntro     = $("#explore-intro");
  var $pwdScreen   = $("#password-screen");
  var $pwdForm     = $("#password-form", $pwdScreen);
  var $pwdInput    = $("#password", $pwdForm);
  var $pwdSubmit   = $("button", $pwdForm);
  var $laws        = $("#adl-laws");
  var $lawsTemplate= $("#laws-template");
  var $lawsRendered= $("#laws-grid");
  var years = {
    all: [{label:"All years", year:"*"}, {label:"1956", year:1956}, {label:"1957", year:1957}, {label:"1958", year:1958}],
    malawi: [{label:"All years", year:"*"}, {label:"1957", year:1957}],
    western_nigeria: [{label:"All years", year:"*"}, {label:"1956", year:1956}, {label:"1958", year:1958}]
  };
  var selectedCountry = "all";
  var selectedYear = "All Years";
  var $lawsGrid, selectCountryAPI, selectYearAPI;

  var areLawsLoaded = false;
  var loadLaws = function () {
    if (areLawsLoaded) {
      return;
    }
    // render template
    $.getJSON("../laws/laws.json", function (json) {
      var rendered = Mustache.render($lawsTemplate.html(), json);
      $lawsRendered.html(rendered);

      // set up the grid
      $lawsGrid = $("#laws-grid").isotope({
        itemSelector: '.law-item',
        layoutMode: 'fitRows'
      });
      $lawsGrid.imagesLoaded().progress(function () {
        $lawsGrid.isotope('layout');
        areLawsLoaded = true;
      });
    });
  };
  var filterGrid = function (country, year) {
    var filter = '.' + selectedCountry + '.' + selectedYear;
    if (country === "all" && year === "All Years") {
      filter = '';
    } else if (country === "all") {
      filter = '.' + selectedYear;
    } else if (year === "All Years") {
      filter = '.' + selectedCountry;
    }
    $lawsGrid.isotope({filter: filter});
  };

  // Init Components
  var $selectYear = $("#year").selectize({
    valueField: 'label',
    labelField: 'label',
    searchField: ['label'],
    onChange: function (value) {
      if (!value.length) {
        return;
      }
      selectedYear = value;
      filterGrid(selectedCountry, selectedYear);
    }
  });
  var $selectCountry = $("#country").selectize({
    onChange: function (value) {
      if (!value.length) {
        return;
      }
      selectedCountry = value;
      filterGrid(selectedCountry, selectedYear);
      selectYearAPI.clearOptions();
      selectYearAPI.addOption(years[selectedCountry]);
      selectYearAPI.refreshOptions();
    }
  });
  selectCountryAPI = $selectCountry[0].selectize;
  selectYearAPI    = $selectYear[0].selectize;

  // EVENTS
  $pwdForm.submit(function (ev) {
    if ($pwdInput.val() === "ATUMPAN") {
      $pwdScreen.velocity("fadeOut", {duration:500});
    } else {
      alert("Incorrect password. Please try again.");
      $pwdInput.val('');
      $pwdInput.focus();
    }
    return false;
  });

  $exploreBtn.click(function (ev) {
    if (!isWatching) {
      return false;
    }
    $watchBtn.removeClass("active");
    $exploreBtn.addClass("active");
    if (isInfoOn) {
      $closeBtn.click();
    }
    $video.velocity("fadeOut", {duration:500});
    $waIntro.velocity("fadeOut", {duration:500});
    $exIntro.velocity("fadeIn", {delay:500, duration:500});
    $laws.velocity("fadeIn", {delay:500, duration:500, complete:function (ev) {
        if (!areLawsLoaded) {
          loadLaws();
        }
      }
    });
    isWatching = false;
  });

  $watchBtn.click(function (ev) {
    if (isWatching) {
      return false;
    }
    $exploreBtn.removeClass("active");
    $watchBtn.addClass("active");
    if (isInfoOn) {
      $closeBtn.click();
    }
    $laws.velocity("fadeOut", {duration:500});
    $exIntro.velocity("fadeOut", {duration:500});
    $video.velocity("fadeIn", {delay:500, duration:500});
    $waIntro.velocity("fadeIn", {delay:500, duration:500});
    isWatching = true;
  });

  $infoBtn.click(function (ev) {
    if (isInfoOn) {
      return false;
    }
    $infoBtn.velocity("fadeOut", {duration:500});
    $infoContent.velocity("fadeIn", {delay:500, duration:500});
    $closeBtn.velocity("fadeIn", {delay:500, duration:500});
    if (!isWatching) {
      console.log("something specific to explore page here?");
    }
    isInfoOn = true;
  });

  $closeBtn.click(function (ev) {
    if (!isInfoOn) {
      return false;
    }
    $infoContent.velocity("fadeOut", {duration:500});
    $closeBtn.velocity("fadeOut", {duration:500});
    $infoBtn.velocity("fadeIn", {delay:500, duration:500});
    if (!isWatching) {
      console.log("something specific to explore page here?");
    }
    isInfoOn = false;
  });

  // handle window / video resize
  $(window).resize(function (ev) {
    var width = $body.width() * 0.75;
    $embed.width(width);
    $embed.height(width * aspect);
  }).resize();
});
