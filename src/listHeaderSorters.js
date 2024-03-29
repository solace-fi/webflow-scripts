// @ts-check

/*

Product specs:

The list is a table that has a header with 3 columns:
Protocol, Risk, Category

Protocol and Category are sorted alphabetically. Risk is sorted numerically.

Header container is div.sorting_header
Sorting items are .protocol_sort, .risk_sort, .category_sort

arrows are .sort_up and .sort_down,
the active arrow has no extra, the inactive arrow has a class of .inactive

structure map:
div.sorting_header
  div
    div.protocol_sort
      div.sort_up
      div.sort_down
  div
    div.risk_sort
      div.sort_up
      div.sort_down
  div
    div.category_sort
      div.sort_up
      div.sort_down
div.loading_protocols
div#protocol_list.protocol_list

*/

/**@typedef {import('./types').Protocol & {element: JQuery<HTMLElement>}} MappedProtocol */

/** @type {import('./types').CurrentSort} */
const currentSort = [
  {
    direction: "asc",
    sorteable: "protocol",
  },
];

function makeActive(/** @type JQuery<HTMLElement> */ $element) {
  while ($element.hasClass("inactive")) {
    $element.removeClass("inactive");
  }
}

function makeInactive(/** @type {JQuery<HTMLElement>} */ $element) {
  makeActive($element);
  $element.addClass("inactive");
}
/*export type Sorteable = "protocol" | "category" | "risk";
export type SortDirection = "asc" | "desc";
export type Sort = {
  sorteable: Sorteable;
  direction: SortDirection;
};
export type CurrentSort = [Sort, Sort] | [Sort]; */
function isInCurrentSort(
  /** @type {import('./types').CurrentSort} */ sort,
  /** @type {import('./types').Sorteable} */ sorteable,
  /** @type {import('./types').SortDirection} */ direction
) {
  return sort.some(
    (s) => s.sorteable === sorteable && s.direction === direction
  );
}

function removeFromCurrentSort(
  /** @type {import('./types').Sorteable} */ sorteable,
  /** @type {import('./types').SortDirection} */ direction
) {
  // modify sort to remove the element
  currentSort.forEach((s, i) => {
    if (s.sorteable === sorteable && s.direction === direction) {
      currentSort.splice(i, 1);
    }
  });
}

function addToCurrentSort(
  /** @type {import('./types').Sorteable} */ sorteable,
  /** @type {import('./types').SortDirection} */ direction
) {
  // check if the opposite direction is already in the current sort for the same sorteable; if so, remove it
  const oppositeDirection = direction === "asc" ? "desc" : "asc";
  const sortHasOppositeDirection = currentSort.some(
    (s) => s.sorteable === sorteable && s.direction === oppositeDirection
  );
  currentSort.forEach((s, i) => {
    if (s.sorteable === sorteable && s.direction === oppositeDirection) {
      currentSort.splice(i, 1);
    }
  });

  // currentSort max length is 2; if > 2, remove the first element then add the new one, otherwise just add the new one
  if (currentSort.length >= 1) {
    // if does not have opposite direction, remove first, otherwise remove last
    sortHasOppositeDirection ? currentSort.pop() : currentSort.shift();
    currentSort.push({ sorteable, direction });
  } else {
    currentSort.push({ sorteable, direction });
  }
}

const arrows = {
  protocolUp: $(".protocol_sort .sort_up"),
  protocolDown: $(".protocol_sort .sort_down"),
  riskUp: $(".risk_sort .sort_up"),
  riskDown: $(".risk_sort .sort_down"),
  categoryUp: $(".category_sort .sort_up"),
  categoryDown: $(".category_sort .sort_down"),
};

// cleanses all arrows from the inactive class
function makeAllActive() {
  Object.values(arrows).forEach(makeActive);
}

function makeAllInactive() {
  Object.values(arrows).forEach(makeInactive);
}

// making an arrow active is just removing the inactive class, making it inactive is adding the inactive class
function makeActive(/** @type {JQuery<HTMLElement>} */ $element) {
  while ($element.hasClass("inactive")) {
    $element.removeClass("inactive");
  }
}
function makeInactive(/** @type {JQuery<HTMLElement>} */ $element) {
  $element.addClass("inactive");
}

const clientDirections = ["up", "down"];
const serverDirections = ["asc", "desc"];

/** @returns {"up" | "down"} */
const serverToClientDirection = (
  /** @type {import('./types').SortDirection} */ direction
) => {
  // @ts-ignore
  return clientDirections[serverDirections.indexOf(direction)];
};
const clientToServerDirection = (/** @type {"up" | "down"} */ direction) => {
  return serverDirections[clientDirections.indexOf(direction)];
};

const nestedArrows = {
  protocol: {
    up: arrows.protocolUp,
    down: arrows.protocolDown,
  },
  risk: { up: arrows.riskUp, down: arrows.riskDown },
  category: { up: arrows.categoryUp, down: arrows.categoryDown },
};

// let's set up the arrows to be active or inactive depending on the current sort
function updateArrows() {
  // console.log("line 136 updateArrows");
  makeAllActive();
  // console.log("line 138 updateArrows");
  makeAllInactive();
  // console log current state
  console.log(JSON.stringify(currentSort, null, 2));
  currentSort.forEach((s, i) => {
    // console.log("updateArrows - line 141, item: ", s, i);
    const { sorteable, direction } = s;
    const clientDirection = serverToClientDirection(direction);
    const $arrow = nestedArrows[sorteable][clientDirection];
    makeActive($arrow);
  });
}

function findSorteableFromArrow(/** @type {JQuery<HTMLElement>} */ $arrow) {
  // type of sort is stored in .parent().parent().hasClass("protocol_sort") or .risk_sort or .category_sort
  const $sorteable = $arrow.parent().parent();
  /** @type {import('./types').Sorteable[]} */
  const clientSorts = ["protocol", "risk", "category"];
  const sorteable = clientSorts.find((s) => $sorteable.hasClass(`${s}_sort`));
  return sorteable;
}

/** @description we find the direction of the arrow by reading the class */
function findDirectionFromArrow(/** @type {JQuery<HTMLElement>} */ $arrow) {
  // direction of sort is stored in .sort_up or .sort_down
  if ($arrow.hasClass("sort_up")) {
    return "asc";
  } else if ($arrow.hasClass("sort_down")) {
    return "desc";
  }
}

/** @description if the arrow is active, we remove it from the current sort, otherwise we add it to the current sort */
function toggleArrow(/** @type {JQuery<HTMLElement>} */ $arrow) {
  const sorteable = findSorteableFromArrow($arrow);
  const direction = findDirectionFromArrow($arrow);
  isInCurrentSort(currentSort, sorteable, direction)
    ? removeFromCurrentSort(sorteable, direction)
    : addToCurrentSort(sorteable, direction);
  updateArrows();
}

/** @description when the user clicks a header name, we toggle the direction if it has one, and otherwise we set it to asc */
function toggleSorteable(/** @type {JQuery<HTMLElement>} */ $sorteable) {
  /** @type {import('./types').Sorteable} */
  // @ts-ignore
  const sorteable = ($sorteable.text() || "").toLowerCase();
  // if no length, log not sortable
  if (!sorteable.length) return console.log("not sortable");
  // if sorteable is not in current sort, add it; test with both directions
  /** @type {import('./types').SortDirection[]} */
  const directions = ["asc", "desc"];
  let hasDirection = "";
  directions.forEach((direction) => {
    if (isInCurrentSort(currentSort, sorteable, direction)) {
      hasDirection = direction;
    }
  });
  if (!hasDirection.length) {
    addToCurrentSort(sorteable, "asc");
  } else {
    removeFromCurrentSort(
      sorteable,
      directions.find((d) => d === hasDirection)
    );
    addToCurrentSort(
      sorteable,
      directions.find((d) => d !== hasDirection)
    );
  }
  updateArrows();
}

/************************************************************** END LIST HEADER SORTER */

/************************************************************** START PROTOCOL LIST */

// @ts-check

// retrieve info from server (type: ProtocolListResponse)
// grab the container, which is a unique class called .protocol_list
// grab the first child, clone it, modify its content to match the retrieved data per `i` protocol, and append it to the container
// delete the first child

// elements to modify inside the protocol:
// img.protocol_logo, .protocol_name, .protocol_risk, .protocol_category

// Loader is .lottie-animation; upon finishing loading, it is hidden.

/**
 * @param {string} string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @param {string} str
 */
function processProtocolName(str) {
  // remove hyphen & capitalize first letter of each word
  return str
    .split("-")
    .map((word) => {
      switch (word.toLowerCase()) {
        case "amm":
        case "apy":
          return word.toUpperCase();
        case "defi":
          return "DeFi";
        case "defisaver":
          return "DeFi Saver";
        case "deversifi":
          return "DeversiFi";
        case "derivadex":
          return "DerivaDEX";
        case "dao":
          return "DAO";
        case "liquiddriver":
          return "LiquidDriver";
        case "tokensets":
          return "TokenSets";
        case "wepiggy":
          return "WePiggy";
        case "waultswap":
          return "WaultSwap";
        case "stormswap":
          return "StormSwap";
        case "spiritswap":
          return "SpiritSwap";
        case "spookyswap":
          return "SpookySwap";
        case "snowswap":
          return "SnowSwap";
        case "shapeshift":
          return "ShapeShift";
        case "yieldyak":
          return "Yield Yak";
        default:
          return capitalizeFirstLetter(word);
      }
    })
    .join(" ");
}
/* 
export type ProtocolListResponse = {
  metadata: {
    seriesName: string;
    version: string;
    dateCreated: string;
    provenance: string;
  };
  function: {
    name: string;
    description: string;
    provenance: string;
  };
  data: {
    protocolMap: {
      appId: string;
      category: string;
      tier: number;
    }[];
  };
};
*/

/** @description If 0, then Infinity, otherwise return the number */
function infinitizeZero(/** @type {number} */ number) {
  return number === 0 ? Infinity : number;
}

/* sort functions, ascending and descending, by appId, category, tier */
// prettier-ignore
const sortFunctions = {
  protocol: {
    asc: (/** @type {import('./types').Protocol} */ a, /** @type {import('./types').Protocol} */ b)        => a.appId.localeCompare(b.appId),
    desc: (/** @type {import('./types').Protocol} */ a, /** @type {import('./types').Protocol} */ b)       => b.appId.localeCompare(a.appId),
  },
  category: {
    asc: (/** @type {import('./types').Protocol} */ a, /** @type {import('./types').Protocol} */ b)  => a.category.localeCompare(b.category),
    desc: (/** @type {import('./types').Protocol} */ a, /** @type {import('./types').Protocol} */ b) => b.category.localeCompare(a.category),
  },
  risk: {
    asc: (/** @type {import('./types').Protocol} */ a, /** @type {import('./types').Protocol} */ b)          => infinitizeZero(a.tier) - infinitizeZero(b.tier),
    desc: (/** @type {import('./types').Protocol} */ a, /** @type {import('./types').Protocol} */ b)         => infinitizeZero(b.tier) - infinitizeZero(a.tier),
  },
};
/** @typedef {(import('./types').Protocol)} Protocol */
/** @typedef {((a: Protocol, b: Protocol) => number)} SortFunction */
/** @typedef {("asc" | "desc")} SortDirection */

/* sort the list according to the current sort */
function sortProtocolList(
  /** @type {Protocol[]} */ protocols,
  /** @type {string} */ sorteable,
  /** @type {SortDirection} */ direction
) {
  console.log({
    protocols,
    sorteable,
    direction,
  });
  /** @type {Protocol[]} */
  const sortedList = protocols.sort(
    /** @type {SortFunction} */ (sortFunctions[sorteable][direction])
  );
  return sortedList;
}

/* sort the list according to the current sort */
function sortMappedProtocolList(
  /** @type {MappedProtocol[]} */ protocols,
  /** @type {string} */ sorteable,
  /** @type {SortDirection} */ direction
) {
  console.log({
    protocols,
    sorteable,
    direction,
  });
  /** @type {MappedProtocol[]} */
  const sortedList = protocols.sort(
    /** @type {SortFunction} */ (sortFunctions[sorteable][direction])
  );
  return sortedList;
}
// there are one or two sort types in currentSort, so we need to sort the list twice if there are two sort types

/** @returns {Protocol[]} */
function getSortedList(/** @type {MappedProtocol[] | Protocol[]} */ protocols) {
  const isOne = currentSort.length === 1;
  if (isOne) {
    return sortProtocolList(
      protocols,
      currentSort[0].sorteable,
      currentSort[0].direction
    );
  } else {
    return sortProtocolList(
      sortProtocolList(
        protocols,
        currentSort[1].sorteable,
        currentSort[1].direction
      ),
      currentSort[0].sorteable,
      currentSort[0].direction
    );
  }
}

/** @returns {MappedProtocol[]} */
function getMappedSortedList(/** @type {MappedProtocol[]} */ protocols) {
  const isOne = currentSort.length === 1;
  if (isOne) {
    return sortMappedProtocolList(
      protocols,
      currentSort[0].sorteable,
      currentSort[0].direction
    );
  } else {
    return sortMappedProtocolList(
      sortMappedProtocolList(
        protocols,
        currentSort[0].sorteable,
        currentSort[0].direction
      ),
      currentSort[1].sorteable,
      currentSort[1].direction
    );
  }
}

function setClientProtocolsList(/** @type {Protocol[]} */ protocols) {
  // grab the container, which is a unique class called .protocol_list
  const container = document.querySelector(".protocol_list");
  // grab the first child, clone it, modify its content to match the retrieved data per `i` protocol, and append it to the container
  protocols.forEach((protocol) => {
    // for (let i = 0; i < protocols.length; i++) {
    /** @type {HTMLElement} */
    // @ts-ignore
    const protocolElement = container.children[0].cloneNode(true);
    // @ts-ignore
    protocolElement.querySelector(".protocol_logo").src =
      "https://assets.solace.fi/zapperLogos/" + protocol.appId;
    protocolElement.querySelector(".protocol_name").innerHTML =
      processProtocolName(protocol.appId);
    // for risk, grab protocol.tier and convert it to a string; they are numbers from 1 to 3, so use ["F", "A", "B", "C"] to convert them to strings
    const risk = ["F", "A", "B", "C"][protocol.tier];
    protocolElement.querySelector(".protocol_risk").innerHTML = risk;
    protocolElement.querySelector(".protocol_category").innerHTML =
      protocol.category;
    container.appendChild(protocolElement);
  });
  // delete the first child
  container.removeChild(container.children[0]);
}

/** @returns {MappedProtocol[]} */
function mapProtocolsToHtmlElements(
  /** @type {JQuery<HTMLElement>} */ container,
  /** @type {Protocol[]} */ protocols
) {
  const children = container.children();
  const mappedProtocols = protocols.map((/** @type {Protocol} */ protocol) => {
    // use jquery to find children with text matching the processProtocolName(protocol.appId)
    const child = $(children).find(
      `:contains(${processProtocolName(protocol.appId)})`
    );
    const grandpa = child.parent().parent();
    console.log(document.documentElement.innerHTML);
    // .parent();
    // otherwise, return the grandpa
    return { ...protocol, element: grandpa.length ? grandpa : undefined };
  });
  return mappedProtocols;
}

/** @description - Grab a re-sorted list of protocols and update the DOM by appending each protocol.element to the .protocol_list container */
function reSortDOM(/** @type {MappedProtocol[]} */ protocols) {
  // grab the container, which is a unique class called .protocol_list
  const container = $(".protocol_list");
  // grab the first child, clone it, modify its content to match the retrieved data per `i` protocol, and append it to the container
  // IN-PROGRESS - PROTOCOL IS WRONG, ONLY IMAGE AND NAME COLUMN
  protocols.forEach((protocol, i) => {
    if (i === 0) {
      console.log("first protocol", protocol);
    }
    const el = $(protocol.element);
    container.append(el);
  });
}

$(document).ready(async function () {
  // hide first child of container
  $(".protocol_item").hide();
  // grab data from server
  const response = await fetch("https://risk-data.solace.fi/series");
  // remove loading animation
  $(".loading_protocols").remove();
  // parse data to JSON
  /** @typedef {import('./types').ProtocolListResponse} ProtocolListResponse */
  /** @type {ProtocolListResponse} */
  const data = await response.json();
  const protocols = data.data.protocolMap;
  const sortedList = getSortedList(protocols);

  // grab the search field with the class search_field and add an event listener to it
  // on type, search the list of protocols and show only those that match the search
  // if the search field is empty, show all protocols
  // if the search field is not empty, show only those protocols that match the search

  setClientProtocolsList(sortedList);
  // show first child of container
  $(".protocol_item").show();
  const mappedProtocolList = mapProtocolsToHtmlElements(
    $(".protocol_list"),
    sortedList
  );
  $(".search_field").on("keyup", function () {
    // @ts-ignore
    const search = $(this).val().toLowerCase();
    // @ts-ignore
    $(".protocol_list > div").each(function () {
      // @ts-ignore
      const protocol = $(this).text().toLowerCase();
      if (protocol.indexOf(search) > -1) {
        // @ts-ignore
        $(this).show();
      } else {
        // @ts-ignore
        $(this).hide();
      }
    });
  });

  // listen to arrow presses and update the current sort
  updateArrows();
  $(".sorting_header .sort_up").on("click", function () {
    toggleArrow($(this));
    const sortedList = getMappedSortedList(mappedProtocolList);
    reSortDOM(sortedList);
  });
  $(".sorting_header .sort_down").on("click", function () {
    toggleArrow($(this));
    reSortDOM(getMappedSortedList(mappedProtocolList));
  });
  /** @type {[import('./types').Sorteable, import('./types').Sorteable, import('./types').Sorteable]} */
  const sorteables = ["risk", "category", "protocol"];
  sorteables.forEach((sorteable) => {
    $(`.${sorteable}_sort > div:eq(0)`).on("click", function () {
      toggleSorteable($(this));
      reSortDOM(getMappedSortedList(mappedProtocolList));
    });
  });

  // $(".search_field").on("keyup", function () {
  //   /** @type {Protocol[]} */
  //   // @ts-ignore
  //   const search = $(this).val().toLowerCase();
  //   // @ts-ignore
  //   $(".protocol_list > div").each(function () {
  //     // @ts-ignore
  //     const protocol = $(this).text().toLowerCase();
  //     if (protocol.indexOf(search) > -1) {
  //       // add to new replacement list
  //       // replacementList.push(protocols[$(this).index()]);
  //       // update the list
  //       // updateClientProtocolsList(replacementList);
  //     }
  //   });
  // });
});
