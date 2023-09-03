import postcodes from "./public/postcodes.json" assert { type: "json" };

const loadBtn = document.getElementById("load");
const status = document.querySelector(".status");

async function getPostcode(postcode) {
  try {
    const response = await fetch(
      `http://api.getthedata.com/postcode/${postcode}`
    );
    const info = await response.json();
    // console.log(info);
    return info;
  } catch (e) {
    console.error(e);
  }
}

let dictionary = {};

// Loop through all postcodes in the selected JSON and then append them to the dictionary

async function getPostcodes() {
  for (const [postcode, value] of Object.entries(postcodes)) {
    const data = await getPostcode(postcode);

    dictionary[postcode] = {
      postcode: postcode,
      area: data.data?.postcode_area,
      district: data.data?.postcode_district,
      country: data.data?.country,
      freq: value["Frequency"],
      lat: data.data?.latitude,
      lng: data.data?.longitude,
    };

    status.innerText = `Loading... I'm currently processing ${
      dictionary[postcode].postcode
    }. I have done ${Object.keys(dictionary).length}`;

    console.log(dictionary[postcode]);
  }
}

// Stringify the dictionary and download

function downloadJSON(data, filename = "data.json") {
  const jsonDictionary = JSON.stringify(data, null, 2);

  const blob = new Blob([jsonDictionary], { type: "application/json" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  // Clean up DOM
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Initialise

async function init() {
  await getPostcodes();
  downloadJSON(dictionary);
  status.innerHTML = "Complete.";
}

loadBtn.addEventListener("click", init);
