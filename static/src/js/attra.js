const currentUrl = window.location.href;

const regex = /\/attraction\/(\d+)/;
const match = currentUrl.match(regex);

if (match) {
  const attractionId = match[1];
  getAttraction(attractionId);
} else {
  console.log("No ID found in URL");
}

async function getAttraction(attractionId) {
  try {
    console.log(attractionId);
    const response = await fetch(`/api/attraction/${attractionId}`);
    console.log(response);
    const responseData = await response.json();
    let data = responseData.data;
    if (data) {
      console.log(data);
    }
  } catch (error) {
    console.error("Error fetching attraction data:", error);
  }
}

async function createAttractio() {
  let carousel = document.querySelector(".carousel");
  let dots = document.querySelector(".dots");
  let attractionContent = document.querySelector(".attraction-content");

  let info = document.querySelector("info");
  let address = info.querySelector("address");
  let transport = info.querySelector("transport");

  let dot = document.createElement("dot");
  dot.className = "dot";

  let slide = document.createElement("div");
  slide.className = "slide";

  let slideImg = document.createElement("img");

  let attractionName = document.createElement("h3");
  attractionName.className = "attraction-name bold";

  let attractionDescription = document.createElement("p");
  attractionDescription.className = "attraction-description font-body regular";

  let description = document.createElement("div");
  description.className = "description font-content";

  let addressContent = document.createElement("div");
  addressContent.className = "address-content font-content";

  let transportContent = document.createElement("div");
  transportContent.className = "transport-content font-content";

  dots.appendChild(dot);
  carousel.appendChild(slide);
  slide.appendChild(slideImg);

  attractionContent.appendChild(attractionName);
  attractionContent.appendChild(attractionDescription);

  info.appendChild(description);
  address.appendChild(addressContent);
  transport.appendChild(transportContent);
}

getAttraction();
