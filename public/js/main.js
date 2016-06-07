var countries = {
  options: [
    {
      value: "all",
      label: "All Countries"
    },
    {
      value: "gambia",
      label: "The Gambia"
    },
    {
      value: "ghana",
      label: "Ghana"
    },
    {
      value: "malawi",
      label: "Malawi"
    },
    {
      value: "northern_nigeria",
      label: "Northern Nigeria"
    },
    {
      value: "seychelles",
      label: "Seychelles"
    },
    {
      value: "uganda",
      label: "Uganda"
    },
    {
      value: "western_nigeria",
      label: "Western Nigeria"
    }
  ]
};
var years = {
"all": [
  {
    "label": "All Years"
  },
  {
    "label": "1920"
  },
  {
    "label": "1926"
  },
  {
    "label": "1928"
  },
  {
    "label": "1933"
  },
  {
    "label": "1942"
  },
  {
    "label": "1951"
  },
  {
    "label": "1952"
  },
  {
    "label": "1955"
  },
  {
    "label": "1956"
  },
  {
    "label": "1957"
  },
  {
    "label": "1958"
  },
  {
    "label": "1959"
  },
  {
    "label": "1960"
  },
  {
    "label": "1961"
  },
  {
    "label": "1962"
  },
  {
    "label": "1963"
  },
  {
    "label": "1964"
  },
  {
    "label": "1965"
  },
  {
    "label": "1967"
  },
  {
    "label": "1968"
  },
  {
    "label": "1970"
  },
  {
    "label": "1971"
  },
  {
    "label": "1975"
  },
  {
    "label": "1997"
  },
  {
    "label": "2005"
  }
],
"gambia": [
  {
    "label": "All Years"
  },
  {
    "label": "1926"
  },
  {
    "label": "1942"
  },
  {
    "label": "1955"
  }
],
"ghana": [
  {
    "label": "All Years"
  },
  {
    "label": "1920"
  },
  {
    "label": "1928"
  },
  {
    "label": "1951"
  },
  {
    "label": "1997"
  },
  {
    "label": "2005"
  }
],
"malawi": [
  {
    "label": "All Years"
  },
  {
    "label": "1933"
  },
  {
    "label": "1957"
  }
],
"northern_nigeria": [
  {
    "label": "All Years"
  },
  {
    "label": "1958"
  },
  {
    "label": "1965"
  }
],
"seychelles": [
  {
    "label": "1952"
  }
],
"uganda": [
  {
    "label": "1951"
  }
],
"western_nigeria": [
  {
    "label": "All Years"
  },
  {
    "label": "1956"
  },
  {
    "label": "1958"
  },
  {
    "label": "1959"
  },
  {
    "label": "1960"
  },
  {
    "label": "1961"
  },
  {
    "label": "1962"
  },
  {
    "label": "1963"
  },
  {
    "label": "1964"
  },
  {
    "label": "1965"
  },
  {
    "label": "1967"
  },
  {
    "label": "1968"
  },
  {
    "label": "1970"
  },
  {
    "label": "1971"
  },
  {
    "label": "1975"
  }
]
};

// On page load
$(function () {
  var $lawsCount      = $("#laws-count");
  var $lawsTemplate   = $("#laws-template");
  var $lawsRendered   = $("#laws-grid");
  var selectedCountry = "all";
  var selectedYear    = "All Years";
  var $lawsGrid, selectCountryAPI, selectYearAPI;

  // filter the isotope grid with the given country, year
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

  // every time there's a grid redraw, update the UI
  var updateGridUI = function () {
    var count = $(".law-item:visible").length;
    var text = " laws";
    if (count === 1) text = " law";
    $lawsCount.html(count + text);
  };

  // initialize filtering components
  var $selectYear = $("#year").selectize({
    options: years.all,
    items: ['All Years'],
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
    options: countries.options,
    items: ['all'],
    valueField: 'value',
    labelField: 'label',
    searchField: ['label'],
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

  // fetch and render laws
  $.getJSON("../laws/laws.json", function (json) {
    var rendered = Mustache.render($lawsTemplate.html(), json);
    $lawsRendered.html(rendered);

    // set up the grid
    $lawsGrid = $("#laws-grid").isotope({
      itemSelector: '.law-item',
      layoutMode: 'fitRows'
    });
    $lawsGrid.on('layoutComplete', updateGridUI);
    $lawsGrid.on('arrangeComplete', updateGridUI);
    $lawsGrid.imagesLoaded().progress(function () {
      $lawsGrid.isotope('layout');
    });
  });
});
