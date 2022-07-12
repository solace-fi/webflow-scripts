var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
});
// @ts-check
define("tsTesting/listHeaderSorters", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
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
    /** @type {import('../types').CurrentSort} */
    var currentSort = [
        {
            direction: "asc",
            sorteable: "protocol"
        },
    ];
    function makeInactive($element) {
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
    /** @type {import('../types').CurrentSort} */ sort, 
    /** @type {import('../types').Sorteable} */ sorteable, 
    /** @type {import('../types').SortDirection} */ direction) {
        return sort.some(function (s) { return s.sorteable === sorteable && s.direction === direction; });
    }
    function removeFromCurrentSort(
    /** @type {import('../types').Sorteable} */ sorteable, 
    /** @type {import('../types').SortDirection} */ direction) {
        // modify sort to remove the element
        currentSort.forEach(function (s, i) {
            if (s.sorteable === sorteable && s.direction === direction) {
                currentSort.splice(i, 1);
            }
        });
    }
    function addToCurrentSort(
    /** @type {import('../types').Sorteable} */ sorteable, 
    /** @type {import('../types').SortDirection} */ direction) {
        // check if the opposite direction is already in the current sort for the same sorteable; if so, remove it
        var oppositeDirection = direction === "asc" ? "desc" : "asc";
        var sortHasOppositeDirection = currentSort.some(function (s) { return s.sorteable === sorteable && s.direction === oppositeDirection; });
        currentSort.forEach(function (s, i) {
            if (s.sorteable === sorteable && s.direction === oppositeDirection) {
                currentSort.splice(i, 1);
            }
        });
        // currentSort max length is 2; if > 2, remove the first element then add the new one, otherwise just add the new one
        if (currentSort.length >= 2) {
            // if does not have opposite direction, remove first, otherwise remove last
            sortHasOppositeDirection ? currentSort.pop() : currentSort.shift();
            currentSort.push({ sorteable: sorteable, direction: direction });
        }
        else {
            currentSort.push({ sorteable: sorteable, direction: direction });
        }
    }
    var arrows = {
        protocolUp: $(".protocol_sort .sort_up"),
        protocolDown: $(".protocol_sort .sort_down"),
        riskUp: $(".risk_sort .sort_up"),
        riskDown: $(".risk_sort .sort_down"),
        categoryUp: $(".category_sort .sort_up"),
        categoryDown: $(".category_sort .sort_down")
    };
    // cleanses all arrows from the inactive class
    function makeAllActive() {
        Object.values(arrows).forEach(makeActive);
    }
    function makeAllInactive() {
        Object.values(arrows).forEach(makeInactive);
    }
    // making an arrow active is just removing the inactive class, making it inactive is adding the inactive class
    function makeActive($element) {
        while ($element.hasClass("inactive")) {
            $element.removeClass("inactive");
        }
    }
    var clientDirections = ["up", "down"];
    var serverDirections = ["asc", "desc"];
    var serverToClientDirection = function (direction) {
        return clientDirections[serverDirections.indexOf(direction)];
    };
    var clientToServerDirection = function (
    /** @type {"up" | "down"} */ direction) {
        return serverDirections[clientDirections.indexOf(direction)];
    };
    var nestedArrows = {
        protocol: {
            up: arrows.protocolUp,
            down: arrows.protocolDown
        },
        risk: { up: arrows.riskUp, down: arrows.riskDown },
        category: { up: arrows.categoryUp, down: arrows.categoryDown }
    };
    // let's set up the arrows to be active or inactive depending on the current sort
    function updateArrows() {
        // console.log("line 136 updateArrows");
        makeAllActive();
        // console.log("line 138 updateArrows");
        makeAllInactive();
        // console log current state
        console.log(JSON.stringify(currentSort, null, 2));
        currentSort.forEach(function (s, i) {
            // console.log("updateArrows - line 141, item: ", s, i);
            var sorteable = s.sorteable, direction = s.direction;
            var clientDirection = serverToClientDirection(direction);
            var $arrow = nestedArrows[sorteable][clientDirection];
            makeActive($arrow);
        });
    }
    function findSorteableFromArrow($arrow) {
        // type of sort is stored in .parent().parent().hasClass("protocol_sort") or .risk_sort or .category_sort
        var $sorteable = $arrow.parent().parent();
        /** @type {import('../types').Sorteable[]} */
        var clientSorts = [
            "protocol",
            "risk",
            "category",
        ];
        var sorteable = clientSorts.find(function (s) { return $sorteable.hasClass("".concat(s, "_sort")); });
        return sorteable;
    }
    /** @description we find the direction of the arrow by reading the class */
    function findDirectionFromArrow($arrow) {
        // direction of sort is stored in .sort_up or .sort_down
        if ($arrow.hasClass("sort_up")) {
            return "asc";
        }
        else if ($arrow.hasClass("sort_down")) {
            return "desc";
        }
    }
    /** @description if the arrow is active, we remove it from the current sort, otherwise we add it to the current sort */
    function toggleSort($arrow) {
        var sorteable = findSorteableFromArrow($arrow);
        var direction = findDirectionFromArrow($arrow);
        sorteable &&
            direction &&
            (isInCurrentSort(currentSort, sorteable, direction)
                ? removeFromCurrentSort(sorteable, direction)
                : addToCurrentSort(sorteable, direction));
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
            .map(function (word) {
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
    /* sort functions, ascending and descending, by appId, category, tier */
    // prettier-ignore
    var sortFunctions = {
        protocol: {
            asc: function (/** @type {import('../types').Protocol} */ a, /** @type {import('../types').Protocol} */ b) { return a.appId.localeCompare(b.appId); },
            desc: function (/** @type {import('../types').Protocol} */ a, /** @type {import('../types').Protocol} */ b) { return b.appId.localeCompare(a.appId); }
        },
        category: {
            asc: function (/** @type {import('../types').Protocol} */ a, /** @type {import('../types').Protocol} */ b) { return a.category.localeCompare(b.category); },
            desc: function (/** @type {import('../types').Protocol} */ a, /** @type {import('../types').Protocol} */ b) { return b.category.localeCompare(a.category); }
        },
        risk: {
            asc: function (/** @type {import('../types').Protocol} */ a, /** @type {import('../types').Protocol} */ b) { return a.tier - b.tier; },
            desc: function (/** @type {import('../types').Protocol} */ a, /** @type {import('../types').Protocol} */ b) { return b.tier - a.tier; }
        }
    };
    /** @typedef {(import('../types').Protocol)} Protocol */
    /** @typedef {((a: Protocol, b: Protocol) => number)} SortFunction */
    /** @typedef {("asc" | "desc")} SortDirection */
    /* sort the list according to the current sort */
    function sortProtocolList(
    /** @type {Protocol[]} */ protocols, 
    /** @type {string} */ sorteable, 
    /** @type {SortDirection} */ direction) {
        console.log({
            protocols: protocols,
            sorteable: sorteable,
            direction: direction
        });
        /** @type {Protocol[]} */
        var sortedList = protocols.sort(sortFunctions[sorteable][direction]);
        return sortedList;
    }
    /* sort the list according to the current sort */
    function sortMappedProtocolList(
    /** @type {MappedProtocol[]} */ protocols, 
    /** @type {string} */ sorteable, 
    /** @type {SortDirection} */ direction) {
        console.log({
            protocols: protocols,
            sorteable: sorteable,
            direction: direction
        });
        /** @type {MappedProtocol[]} */
        var sortedList = protocols.sort(sortFunctions[sorteable][direction]);
        return sortedList;
    }
    // there are one or two sort types in currentSort, so we need to sort the list twice if there are two sort types
    /** @returns {Protocol[]} */
    function getSortedList(
    /** @type {MappedProtocol[] | Protocol[]} */ protocols) {
        var isOne = currentSort.length === 1;
        if (isOne) {
            return sortProtocolList(protocols, currentSort[0].sorteable, currentSort[0].direction);
        }
        else {
            return sortProtocolList(sortProtocolList(protocols, currentSort[0].sorteable, currentSort[0].direction), currentSort[1].sorteable, currentSort[1].direction);
        }
    }
    /** @returns {MappedProtocol[]} */
    function getMappedSortedList(
    /** @type {MappedProtocol[]} */ protocols) {
        var isOne = currentSort.length === 1;
        if (isOne) {
            return sortMappedProtocolList(protocols, currentSort[0].sorteable, currentSort[0].direction);
        }
        else {
            return sortMappedProtocolList(sortMappedProtocolList(protocols, currentSort[0].sorteable, currentSort[0].direction), currentSort[1].sorteable, currentSort[1].direction);
        }
    }
    function setClientProtocolsList(
    /** @type {MappedProtocol[]} */ protocols) {
        // grab the container, which is a unique class called .protocol_list
        var container = document.querySelector(".protocol_list");
        // grab the first child, clone it, modify its content to match the retrieved data per `i` protocol, and append it to the container
        protocols.forEach(function (protocol) {
            // for (let i = 0; i < protocols.length; i++) {
            /** @type {HTMLElement} */
            // @ts-ignore
            var protocolElement = container.children[0].cloneNode(true);
            var protocolLogo = protocolElement.querySelector(".protocol_logo");
            var protocolName = protocolElement.querySelector(".protocol_name");
            var protocolRisk = protocolElement.querySelector(".protocol_risk");
            var protocolCategory = protocolElement.querySelector(".protocol_category");
            if (protocolLogo && protocolName && protocolRisk && protocolCategory) {
                // @ts-ignore
                protocolLogo.src =
                    "https://assets.solace.fi/zapperLogos/" + protocol.appId;
                protocolName.innerHTML = processProtocolName(protocol.appId);
                var risk = ["F", "A", "B", "C"][protocol.tier];
                protocolRisk.innerHTML = risk;
                protocolCategory.innerHTML = protocol.category;
            }
            container === null || container === void 0 ? void 0 : container.appendChild(protocolElement);
        });
        // delete the first child
        container === null || container === void 0 ? void 0 : container.removeChild(container.children[0]);
    }
    /** @returns {MappedProtocol[]} */
    function mapProtocolsToHtmlElements(container, 
    /** @type {Protocol[]} */ protocols) {
        var children = container.children();
        var mappedProtocols = protocols.map(function (/** @type {Protocol} */ protocol) {
            // use jquery to find children with text matching the processProtocolName(protocol.appId)
            var child = $(children).find(":contains(".concat(processProtocolName(protocol.appId), ")"));
            var grandpa = child.parent().parent();
            if (!grandpa.length)
                throw new Error("Could not find grandparent for protocol " + protocol.appId);
            console.log(document.documentElement.innerHTML);
            // otherwise, return the grandpa
            return __assign(__assign({}, protocol), { element: grandpa });
        });
        return mappedProtocols;
    }
    /** @description - Grab a re-sorted list of protocols and update the DOM by appending each protocol.element to the .protocol_list container */
    function reSortDOM(
    /** @type {MappedProtocol[]} */ protocols) {
        // grab the container, which is a unique class called .protocol_list
        var container = $(".protocol_list");
        // grab the first child, clone it, modify its content to match the retrieved data per `i` protocol, and append it to the container
        // IN-PROGRESS - PROTOCOL IS WRONG, ONLY IMAGE AND NAME COLUMN
        protocols.forEach(function (protocol, i) {
            if (i === 0) {
                console.log("first protocol", protocol);
            }
            var el = $(protocol.element);
            container.append(el);
        });
    }
    $(document).ready(function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, protocols, sortedList, mappedProtocolList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://risk-data.solace.fi/series")];
                    case 1:
                        response = _a.sent();
                        // remove loading animation
                        $(".loading_protocols").remove();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        protocols = data.data.protocolMap;
                        sortedList = getSortedList(protocols);
                        mappedProtocolList = mapProtocolsToHtmlElements($(".protocol_list"), sortedList);
                        setClientProtocolsList(mappedProtocolList);
                        $(".search_field").on("keyup", function () {
                            // @ts-ignore
                            var search = $(this).val().toLowerCase();
                            // @ts-ignore
                            $(".protocol_list > div").each(function () {
                                // @ts-ignore
                                var protocol = $(this).text().toLowerCase();
                                if (protocol.indexOf(search) > -1) {
                                    // @ts-ignore
                                    $(this).show();
                                }
                                else {
                                    // @ts-ignore
                                    $(this).hide();
                                }
                            });
                        });
                        // listen to arrow presses and update the current sort
                        updateArrows();
                        $(".sorting_header .sort_up").on("click", function () {
                            toggleSort($(this));
                            var sortedList = getMappedSortedList(mappedProtocolList);
                            reSortDOM(sortedList);
                        });
                        $(".sorting_header .sort_down").on("click", function () {
                            toggleSort($(this));
                            reSortDOM(getMappedSortedList(mappedProtocolList));
                        });
                        return [2 /*return*/];
                }
            });
        });
    });
});
