// @ts-check

// <script type="module">
// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.6.esm.min.js";
// </script>

// import { BigNumber } from "ethers";

type Data = {
  // sample response: {"globalStakedSolace": "21064836.184409562","averageStakingAPR":"145.25","uwp":2311762.337997631,"coverLimit":311237.5778462195,"activePolicies":876,"totalPolicies":883}
  globalStakedSolace: string;
  averageStakingAPR: string;
  uwp: string;
  coverLimit: string;
  activePolicies: string;
  totalPolicies: string;
};

// declare BigNumber so typescript thinks it exists. it's just a BigNumber polyfill
const BigNumber = {
  value: 0,
  from: function (value: string | number | BigNumber) {
    this.value = Number(value);
    return this;
  },
  eq: function (value: string | number | BigNumber) {
    return this.value === Number(value);
  },
  gt: function (value: string | number | BigNumber) {
    return this.value > Number(value);
  },
  lt: function (value: string | number | BigNumber) {
    return this.value < Number(value);
  },
} as {
  value: number;
  from: (value: string | number | BigNumber) => BigNumber;
  eq: (value: string | number | BigNumber) => boolean;
  gt: (value: string | number | BigNumber) => boolean;
  lt: (value: string | number | BigNumber) => boolean;
};
// const BigNumber = {
//   from: (value: string) => value,
//   eq: (value: string, other: string) => value === other,
// }

type BigNumber = typeof BigNumber;

export const truncateValue = (
  value: number | string,
  decimals = 6,
  abbrev = true
): string => {
  if (typeof value == "number" && value == 0) return "0";
  if (typeof value == "string") {
    const pureNumberStr = value.replace(".", "").split("e")[0];
    if (BigNumber.from(pureNumberStr).eq("0")) return "0";
  }
  let str = value.toString();

  // if string is in scientific notation, for example (1.2345e3, or 1.2345e-5)
  str = convertSciNotaToPrecise(str);
  const decimalIndex = str.indexOf(".");

  // if is nonzero whole number
  if (decimalIndex == -1) {
    if (abbrev) return numberAbbreviate(str);
    return str;
  }

  // if is nonzero number with decimals
  const cutoffIndex = decimalIndex + decimals;
  const truncatedStr = str.substring(0, cutoffIndex + 1);
  if (parseFloat(truncatedStr) == 0)
    return `< ${truncatedStr.slice(0, -1) + "1"}`;
  if (abbrev) return numberAbbreviate(truncatedStr);
  return truncatedStr;
};

export const convertSciNotaToPrecise = (str: string): string => {
  // if string is in scientific notation, for example (1.2345e3, or 1.2345e-5), (2)
  if (str.includes("e")) {
    // get number left of 'e'
    const n = str.split("e")[0];

    // get number right of 'e'
    const exponent = str.split("e")[1];

    // remove decimal in advance
    const temp = n.replace(".", "");
    let zeros = "";
    if (exponent.includes("-")) {
      // if exponent has negative sign, it must be negative
      const range = rangeFrom0(parseInt(exponent.slice(1)) - 1);
      range.forEach(() => (zeros += "0"));
      str = "0.".concat(zeros).concat(temp); // add abs(exponent) - 1 zeros to the left of temp
    } else {
      // if exponent does not have negative sign, it must be positive

      let lengthOfDecimalPlaces = 0;

      if (n.includes(".")) {
        // if number contains decimals, this is important
        lengthOfDecimalPlaces = n.split(".")[1].length;
      }

      if (lengthOfDecimalPlaces > parseInt(exponent)) {
        // if length of decimal places in string surpasses exponent, must insert decimal point inside
        const decimalIndex = n.indexOf(".");
        const newDecimalIndex = decimalIndex + parseInt(exponent);
        str = temp
          .substring(0, newDecimalIndex)
          .concat(".")
          .concat(temp.substring(newDecimalIndex, temp.length));
      } else {
        // if length of decimal places in string does not surpass exponent, simply append zeros
        const range = rangeFrom0(parseInt(exponent) - lengthOfDecimalPlaces);
        range.forEach(() => (zeros += "0"));
        str = temp.concat(zeros);
      }
    }
  }
  return str;
};

export const rangeFrom0 = (stop: number): number[] => {
  const arr = [];
  for (let i = 0; i < stop; ++i) {
    arr.push(i);
  }
  return arr;
};

export const numberify = (number: any): number => {
  if (typeof number == "number") return number;
  if (typeof number == "string") return parseFloat(number);
  return number.toNumber(); // hopefully bignumber
};

export const decimals = (d: number): string => {
  let s = "1";
  for (let i = 0; i < d; ++i) {
    s = `${s}0`;
  }
  return s;
};

export const bnCmp = (x: BigNumber, y: BigNumber): number => {
  return x.eq(y) ? 0 : x.lt(y) ? 1 : -1;
};

export const numberAbbreviate = (
  value: number | string,
  decimals = 2
): string => {
  if (typeof value == "number" && value == 0) return "0";
  if (
    typeof value == "string" &&
    BigNumber.from(value.replace(".", "")).eq("0")
  )
    return "0";
  const str = value.toString();
  const decimalIndex = str.indexOf(".");
  let wholeNumber = str;
  if (decimalIndex != -1) {
    wholeNumber = str.substring(0, decimalIndex);
  }
  if (wholeNumber.length <= 3) return str;

  const abbreviations: any = {
    [2]: "K",
    [3]: "M",
    [4]: "B",
    [5]: "T",
  };
  const abbrev = abbreviations[Math.ceil(wholeNumber.length / 3)];
  const cutoff = wholeNumber.length % 3 == 0 ? 3 : wholeNumber.length % 3;
  const a = wholeNumber.substring(0, cutoff);
  const b = wholeNumber.substring(cutoff, cutoff + decimals);
  if (!abbrev) {
    return `${a}.${b}e${wholeNumber.length - cutoff}`;
  }
  return `${a}.${b}${abbrev}`;
};

$(document).ready(function () {
  const fetchStats = async () => {
    const response = await fetch(
      "https://stats-cache.solace.fi/frontend-stats.json"
    );
    const data = (await response.json()) as Data;
    return data;
  };

  // content ids to replace are uwp, policies and apr
  const replaceContent = (contentId: string, content: string) => {
    const element = document.getElementById(contentId);
    if (element) {
      // query element to find another elemnt by the class stat_data, then replace that with the content
      const statData = element.querySelector(".stat_data");
      if (statData) {
        statData.innerHTML = content;
      }
    }
  };

  const updateStats = async () => {
    const data = await fetchStats();
    replaceContent("uwp", "$" + numberAbbreviate(data.uwp));
    replaceContent("ap", data.activePolicies);
    replaceContent("apr", data.averageStakingAPR + "%");
  };

  updateStats();
});
