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

$(document).ready(async function () {
  // grab data from server
  const response = await fetch("https://risk-data.solace.fi/series");
  // remove loading animation
  $(".loading_protocols").remove();
  // parse data to JSON
  /** @typedef {import('../src/types').ProtocolListResponse} ProtocolListResponse */
  /** @type {ProtocolListResponse} */
  const data = await response.json();
  // grab the container, which is a unique class called .protocol_list
  const container = document.querySelector(".protocol_list");
  // grab the first child, clone it, modify its content to match the retrieved data per `i` protocol, and append it to the container
  for (let i = 0; i < data.data.protocolMap.length; i++) {
    const protocol = data.data.protocolMap[i];
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
  }
  // delete the first child
  container.removeChild(container.children[0]);

  // grab the search field with the class search_field and add an event listener to it
  // on type, search the list of protocols and show only those that match the search
  // if the search field is empty, show all protocols
  // if the search field is not empty, show only those protocols that match the search

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
});
