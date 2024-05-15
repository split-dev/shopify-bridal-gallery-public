const form = document.getElementById("ContactForm");
const userId = document.getElementById("regButton").getAttribute("data-user");

const date_picker_element = document.querySelector(".date-picker");
const selected_date_element = document.querySelector(
  ".date-picker .selected-date"
);
const dates_element = document.querySelector(".dates");
const mth_element = document.querySelector(".dates .month .mth");
const next_mth_element = document.querySelector(".dates .month .next-mth");
const prev_mth_element = document.querySelector(".dates .month .prev-mth");
const days_element = document.querySelector(".dates .days");
const days_time = document.getElementById("list");
const time = document.querySelector(".time");
const dateLocation = document.querySelector(".dates-location");

const popupElem = document.querySelector(".popup");
const popupBtn = document.querySelector(".popup-inner button");
const popupClose = document.querySelector(".popup-close svg");
const popupHeaderElem = document.querySelector(".popup h3");
const popupTextElem = document.querySelector(".popup p");
const overlayElem = document.querySelector(".overlay");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

let date = new Date();
let day = date.getDate();
let dayName = date.getDay();
let month = date.getMonth();
let year = date.getFullYear();

let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

let formUrlOne;

const updateReqBody = {
  data: {
    time_slot_value: "",
    time_slot_date: "",
  },
};

if (mth_element != null) {
  mth_element.textContent = months[month] + " " + year;
}

if (selected_date_element != null) {
  selected_date_element.textContent = formatDate(date);
  selected_date_element.dataset.value = selectedDate;
}

populateDates();

// EVENT LISTENERS
if (date_picker_element != null) {
  date_picker_element.addEventListener("click", toggleDatePicker);
}
if (next_mth_element != null) {
  next_mth_element.addEventListener("click", goToNextMonth);
}
if (prev_mth_element != null) {
  prev_mth_element.addEventListener("click", goToPrevMonth);
}

// FUNCTIONS
function toggleDatePicker(e) {
  dates_element.classList.toggle("active");
}

function goToNextMonth(e) {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  mth_element.textContent = months[month] + " " + year;
  populateDates();
}

function goToPrevMonth(e) {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  mth_element.textContent = months[month] + " " + year;
  populateDates();
}

function populateDates() {
  if (days_element == null) {
    return;
  }

  days_element.innerHTML = "";

  let amount_days = 31;

  if (month == 1) {
    amount_days = 28;
  }
  if (month === 3 || month === 5 || month === 8 || month === 11) {
    amount_days = 30;
  }

  const forment = document.getElementById("ContactForm");
  const dataForm = forment.getAttribute("data-form");
  const dayList = document.querySelector(".days-list ul");
  dayList.innerHTML = "";

  dataForm ? (formUrlOne = dataForm) : (formUrlOne = "FIRST_BRIDAL_STYLING");

  for (let i = 0; i < amount_days; i++) {
    let datAss = new Date(selectedYear, selectedMonth, i);

    if (i < 7) {
      const dayItem = document.createElement("li");
      dayItem.textContent = days[datAss.getDay()].slice(0, 3);
      dayItem.classList.add("text-15px");

      dayList.append(dayItem);
    }

    const day_element = document.createElement("div");
    day_element.classList.add("day");
    day_element.textContent = i + 1;

    if (
      selectedDay == i + 1 &&
      selectedYear == year &&
      selectedMonth == month
    ) {
      day_element.classList.add("selected");
      dateLocation.classList.add("active");
      list.innerHTML = "";
    }

    day_element.addEventListener("click", function () {
      selectedDate = new Date(year + "-" + (month + 1) + "-" + (i + 1));
      selectedDay = i + 1;
      selectedMonth = month;
      selectedYear = year;
      selectedNewMonth = selectedMonth + 1;

      if (selectedNewMonth < 10) {
        selectedNewMonth = `0${selectedNewMonth}`;
      }
      if (i + 1 < 10) {
        i = `0${i + 1}`;
      } else {
        i = i + 1;
      }

      selectedDateNew = year + "-" + selectedNewMonth + "-" + i;

      if (form.getAttribute("is-appointment")) {
        data.time_slot_date = selectedDateNew;
      }

      updateReqBody.data.time_slot_date = selectedDateNew;

      selected_date_element.textContent = formatDate(selectedDate);
      selected_date_element.dataset.value = selectedDate;

      function appointmentsRequest(numberForm) {
        let requestOptions = {
          method: "GET",
        };
        fetch(
          `https://be.thebridalgallery.com/api/v1/appointments/time-slots/${numberForm}/${selectedDateNew}`,
          requestOptions
        )
          .then(response => response.json())
          .then(result => {
            let resultData = result.data;
            resultData.forEach(elem => {
              let list = document.getElementById("list");
              let listItem = document.createElement("li");
              listItem.innerHTML = elem;
              listItem.classList.add("list-item");
              list.appendChild(listItem);
            });
            if (resultData.length == 0) {
              list.innerHTML = "<h3>Is empty</h3>";
            }
            list.querySelectorAll(".list-item").forEach(item => {
              const time = document.querySelector(".time");
              item.addEventListener("click", () => {
                if (form.getAttribute("is-appointment")) {
                  data.time_slot_value = item.textContent;
                }
                updateReqBody.data.time_slot_value = item.textContent;

                if (date_picker_element.classList.contains("valid-reject")) {
                  date_picker_element.classList.remove("valid-reject");
                  date_picker_element.classList.add("valid-success");
                }

                let dateTime = item.textContent;

                time.innerHTML = dateTime;
                let currentItem = item;

                list.querySelectorAll(".list-item").forEach(elem => {
                  elem.classList.remove("active");
                });

                currentItem.classList.add("active");
              });
            });
          })
          .catch(error => console.log("appointmentsRequest error", error));
      }

      if (formUrlOne !== undefined) {
        appointmentsRequest(formUrlOne);
      }

      populateDates();
    });

    days_element.appendChild(day_element);
  }
}

// HELPER FUNCTIONS
function checkEventPathForClass(path, selector) {
  for (let i = 0; i < path.length; i++) {
    if (path[i].classList && path[i].classList.contains(selector)) {
      return true;
    }
  }

  return false;
}

function formatDate(d) {
  let day = d.getDate();
  if (day < 10) {
    day = "0" + day;
  }

  let month = d.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }

  let year = d.getFullYear();

  return day + " / " + month + " / " + year;
}

/* Account page events handlers and data for them */

const updateBtnEl = document.getElementById("update-event");
const cancelBtnEl = document.getElementById("cancel-event");
const bookingIdElems = document.querySelectorAll(".booking--id");
const editButtonsElems = document.querySelectorAll(
  "[data-form-trigger][data-editEventButton]"
);

let productId = 0;

[...editButtonsElems].forEach((btn, btnIdx) => {
  [...bookingIdElems].forEach((elem, elemIdx) => {
    if (elemIdx === btnIdx) {
      btn.addEventListener("click", () => {
        productId = elem.textContent;
        formUrlOne = btn.getAttribute("data-form-trigger");
      });
    }
  });
});

async function updateEvent() {
  const responce = await fetch(
    `https://be.thebridalgallery.com/api/v1/appointments/${userId}/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateReqBody),
    }
  )
    .then(res => res.json())
    .then(res => {
      if (!res.data) {
        days_time.innerHTML =
          "<h4>Something went wrong! Please, try again</h4>";
        console.log("UpdateEvent bad request", res);
      } else {
        console.log("dt", days_time);
        days_time.innerHTML =
          "<h4>Event has been updated! Please, refresh page</h4>";
        return res;
      }
    })
    .catch(error => console.log("updateEvent error message", error.message));

  console.log("Update responce >>", responce);
}

async function cancelEvent() {
  console.log("uid >>", userId);
  console.log("Pid >>", productId);
  const responce = await fetch(
    `https://be.thebridalgallery.com/api/v1/appointments/${userId}/canceled/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then(res => res.json())
    .then(res => {
      if (!res.data) {
        days_time.innerHTML =
          "<h4>Something went wrong! Please, try again</h4>";
        console.log("CancelEvent bad request", res);
      } else {
        days_time.innerHTML =
          "<h4>Event has been canceled! Please, refresh page</h4>";

        return res;
      }
    })
    .catch(error => console.log("cancelEvent error message", error.message));
  console.log("Cancel responce >>", responce);
}

updateBtnEl && updateBtnEl.addEventListener("click", updateEvent);
cancelBtnEl && cancelBtnEl.addEventListener("click", cancelEvent);

/* Account page sunchronisation of product and collections */
const productInputElem = document.getElementById("bridal_");
const collectionInputElem = document.getElementById("vendor_");

const productBtnElem = document.querySelector("[data-type='bridal']");
const collectionBtnElem = document.querySelector("[data-type='vendor']");
const collectionsBtnElem = document.querySelector("[data-type='collections']");
const loaderElem = document.querySelector(".loading-overlay");

async function getCollectionPrice() {
  console.log("getCollectionPrice go");
  loaderElem.classList.remove("hidden");

  const responce = await fetch(
    "https://be.thebridalgallery.com/api/v1/collections/import/range "
  )
    .then(res => res.json())
    .then(res => {
      console.log("getCollectionPrice res >>", res);

      if (res.error) {
        const { code, message } = res.error;
        setPopup(code, message);
      } else {
        setPopup("Success!", "All done!");
        return res;
      }
    })
    .catch(error => {
      console.log("getCollectionPrice error >>", error.message);
      setPopup(error.message, "");
    })
    .finally(() => {
      loaderElem.classList.add("hidden");
    });
}

async function postCollectionsSize() {
  console.log("postCollectionsSize go");
  loaderElem.classList.remove("hidden");
  const responce = await fetch(
    "https://be.thebridalgallery.com/api/v1/collections/sizesFormation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then(res => res.json())
    .then(res => {
      console.log("postCollectionsSize responce >>", res);

      if (res.error) {
        const { code, message } = res.error;
        setPopup(code, message);
      } else {
        setPopup("Success!", "All done!");
        return res;
      }
    })
    .catch(error => {
      console.log("postCollectionsSize error >>", error.message);
      setPopup(error.message, "");
    })
    .finally(() => {
      loaderElem.classList.add("hidden");
    });
}

let syncCollectionId = 0;
let syncProductId = 0;
const productFetchOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

setTimeout(() => {
  const bridalOptionElems = document.querySelectorAll("[data-value]");

  [...bridalOptionElems].forEach(elem => {
    elem.addEventListener("click", event => {
      const { textContent } = event.target;

      if (textContent === "Create") {
        productFetchOptions.method = "POST";
      }
      if (textContent === "Update") {
        productFetchOptions.method = "PUT";
      }
      if (textContent === "Delete") {
        productFetchOptions.method = "DELETE";
      }
      if (textContent.includes("price")) {
        getCollectionPrice();
      }
      if (textContent.includes("size")) {
        postCollectionsSize();
      }
    });
  });
}, 1000);

const collectionFetchOption = {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ id: syncCollectionId }),
};

async function collectionUpdate() {
  console.log("syncCollectionId", syncCollectionId);
  const responce = await fetch(
    "https://be.thebridalgallery.com/api/v1/collections",
    collectionFetchOption
  )
    .then(res => res.json())
    .then(res => {
      console.log("res >>>", res);
      if (res.error) {
        const { code, message } = res.error;
        setPopup(code, message);
      } else {
        setPopup("Success!", "All done!");
        return res;
      }
    })
    .catch(error => {
      setPopup(error.message, "");
      console.log("collectionFetch error >>", error.message);
    });

  console.log("collectionUpdate responce >>", responce);
}

async function productFetch() {
  const responce = await fetch(
    `https://be.thebridalgallery.com/api/v1/products/${syncProductId}`,
    productFetchOptions
  )
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        const { code, message } = res.error;
        setPopup(code, message);
      } else {
        setPopup("Success!", "All done!");
        return res;
      }
    })
    .catch(error => {
      setPopup(error.message, "");

      console.log("productFetch error >>", error.message);
    });

  console.log("productFetch responce >>", responce);
}

if (collectionInputElem) {
  collectionInputElem.addEventListener("input", event => {
    event.preventDefault();
    syncCollectionId = event.target.value;
  });
}
if (productInputElem) {
  productInputElem.addEventListener("input", event => {
    event.preventDefault();
    syncProductId = event.target.value;
  });
}

if (collectionBtnElem) {
  collectionBtnElem.addEventListener("click", event => {
    event.preventDefault();
    collectionUpdate();
  });
}

if (productBtnElem) {
  productBtnElem.addEventListener("click", event => {
    event.preventDefault();
    productFetch();
  });
}

/* Popup control */

popupBtn.addEventListener("click", () => {
  hidePopup();
});
popupClose.addEventListener("click", () => {
  hidePopup();
});

function setPopup(title, message) {
  popupElem.classList.add("active");
  overlayElem.classList.add("active");

  popupHeaderElem.textContent = title;
  popupTextElem.textContent = message;
}

function hidePopup() {
  popupElem.classList.remove("active");
  overlayElem.classList.remove("active");
}
