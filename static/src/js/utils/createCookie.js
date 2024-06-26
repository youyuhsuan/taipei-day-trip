document.addEventListener("click", function (event) {
  if (event.target.closest(".card-link")) {
    const attractionId =
      event.target.closest(".card-link").dataset.attractionId;

    setCookie("selectedAttractionId", attractionId, 7);
  }
});

function setCookie(cname, cvalue, exdays) {
  let newDate = new Date();
  newDate.setDate(newDate.getDate() + exdays);
  const expires = `expires=${newDate.toUTCString()}`;
  document.cookie = `${cname}=${cvalue}; ${expires}; path=/`;
}
