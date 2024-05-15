const userId = document.getElementById("regButton").getAttribute("data-user");

const popupBtn = document.querySelector(".popup-inner button");
const popupClose = document.querySelector(".popup-close svg");
const title = document.querySelector(".appointment-first__header h3");
const checkoutButton = document.getElementById("appointment_button");

let ccNumberInput = document.getElementById("ContactForm-card"),
  ccNumberPattern = /^\d{0,16}$/g,
  ccNumberSeparator = " ",
  ccNumberInputOldValue,
  ccNumberInputOldCursor,
  ccExpiryInput = document.getElementById("ContactForm-expiration"),
  ccExpiryPattern = /^\d{0,4}$/g,
  ccExpirySeparator = "/",
  ccExpiryInputOldValue,
  ccExpiryInputOldCursor,
  ccCVCInput = document.getElementById("ContactForm-cvd"),
  ccCVCPattern = /^\d{0,3}$/g,
  mask = (value, limit, separator) => {
    var output = [];
    for (let i = 0; i < value.length; i++) {
      if (i !== 0 && i % limit === 0) {
        output.push(separator);
      }

      output.push(value[i]);
    }

    return output.join("");
  },
  unmask = value => value.replace(/[^\d]/g, ""),
  checkSeparator = (position, interval) =>
    Math.floor(position / (interval + 1)),
  ccNumberInputKeyDownHandler = e => {
    let el = e.target;
    ccNumberInputOldValue = el.value;
    ccNumberInputOldCursor = el.selectionEnd;
  },
  ccNumberInputInputHandler = e => {
    let el = e.target,
      newValue = unmask(el.value),
      newCursorPosition;

    if (newValue.match(ccNumberPattern)) {
      newValue = mask(newValue, 4, ccNumberSeparator);

      newCursorPosition =
        ccNumberInputOldCursor -
        checkSeparator(ccNumberInputOldCursor, 4) +
        checkSeparator(
          ccNumberInputOldCursor +
            (newValue.length - ccNumberInputOldValue.length),
          4
        ) +
        (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

      el.value = newValue !== "" ? newValue : "";
    } else {
      el.value = ccNumberInputOldValue;
      newCursorPosition = ccNumberInputOldCursor;
    }

    el.setSelectionRange(newCursorPosition, newCursorPosition);

    highlightCC(el.value);
  },
  highlightCC = ccValue => {
    let ccCardType = "",
      ccCardTypePatterns = {
        amex: /^3/,
        visa: /^4/,
        mastercard: /^5/,
        disc: /^6/,

        genric: /(^1|^2|^7|^8|^9|^0)/,
      };

    for (const cardType in ccCardTypePatterns) {
      if (ccCardTypePatterns[cardType].test(ccValue)) {
        ccCardType = cardType;
        break;
      }
    }

    let activeCC = document.querySelector(".cc-types__img--active"),
      newActiveCC = document.querySelector(`.cc-types__img--${ccCardType}`);

    if (activeCC) activeCC.classList.remove("cc-types__img--active");
    if (newActiveCC) newActiveCC.classList.add("cc-types__img--active");
  },
  ccExpiryInputKeyDownHandler = e => {
    let el = e.target;
    ccExpiryInputOldValue = el.value;
    ccExpiryInputOldCursor = el.selectionEnd;
  },
  ccExpiryInputInputHandler = e => {
    let el = e.target,
      newValue = el.value;

    newValue = unmask(newValue);
    if (newValue.match(ccExpiryPattern)) {
      newValue = mask(newValue, 2, ccExpirySeparator);
      el.value = newValue;
    } else {
      el.value = ccExpiryInputOldValue;
    }
  };

if (ccNumberInput != null) {
  ccNumberInput.addEventListener("keydown", ccNumberInputKeyDownHandler);
  ccNumberInput.addEventListener("input", ccNumberInputInputHandler);
}
if (ccExpiryInput != null) {
  ccExpiryInput.addEventListener("keydown", ccExpiryInputKeyDownHandler);
  ccExpiryInput.addEventListener("input", ccExpiryInputInputHandler);
}

/* ============================= */

const date_picker_element = document.querySelector(".date-picker");
const selected_date_element = document.querySelector(
  ".date-picker .selected-date"
);
const dates_element = document.querySelector(".dates");
const mth_element = document.querySelector(".dates .month .mth");
const next_mth_element = document.querySelector(".dates .month .next-mth");
const prev_mth_element = document.querySelector(".dates .month .prev-mth");
const days_element = document.querySelector(".dates .days");
const days_time = document.querySelectorAll(".dates__second-list");
const time = document.querySelector(".time");
const dateLocation = document.querySelector(".dates-location");

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

if (mth_element != null) {
  mth_element.textContent = months[month] + " " + year;
}

if (selected_date_element != null) {
  selected_date_element.textContent = formatDate(date);
  selected_date_element.dataset.value = selectedDate;
}

populateDates();
dates_element.classList.add("active");

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
function toggleDatePicker() {
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

  const formElement = document.getElementById("ContactForm");
  const dataForm = formElement.getAttribute("data-form");
  const dayList = document.querySelector(".days-list ul");
  dayList.innerHTML = "";

  let formUrlOne;

  dataForm ? (formUrlOne = dataForm) : (formUrlOne = "");

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
      let inheritMonth = month < 9 ? `0${month + 1}` : `${month + 1}`;
      let inheritDay = i < 9 ? `0${i + 1}` : `${i + 1}`;

      selectedDate = new Date(`${year}-${inheritMonth}-${inheritDay}`);
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

      data.time_slot_date = selectedDateNew;

      // updateReqBody.data.time_slot_date = selectedDateNew;

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
                data.time_slot_value = item.textContent;

                // updateReqBody.data.time_slot_value = item.textContent;

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
                dates_element.classList.toggle("active");
              });
            });
          })
          .catch(error => console.log("appointmentsRequest error", error));
      }

      if (formUrlOne !== undefined) {
        appointmentsRequest(formUrlOne);
        console.log("formUrlOne", formUrlOne);
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

  // return day + " / " + month + " / " + year;
  return `${day.toString()} / ${month.toString()} / ${year.toString()}`;
}

/* Form elements */

const form = document.getElementById("ContactForm");
const firstName = document.getElementById("ContactForm-name");
const lastName = document.getElementById("ContactForm-last_name");
const email = document.getElementById("ContactForm-email");
const phone = document.getElementById("ContactForm-phone");
const zipCode = document.getElementById("ContactForm-zip");
const howHeard = document.getElementById("ContactForm-heard");
const weddingDate = document.getElementById("ContactForm-weeding");
const dressSize = document.getElementById("ContactForm-size");
const dressBudget = document.getElementById("ContactForm-budget");
const weddingStyle = document.getElementById("ContactForm-style");
const guests = document.getElementById("ContactForm-guest");
const formCard = document.getElementById("ContactForm-card");
const formExpiration = document.getElementById("ContactForm-expiration");
const formCvd = document.getElementById("ContactForm-cvd");
const formFullName = document.getElementById("ContactForm-full_name");
const formCode = document.getElementById("ContactForm-code");
const formComment = document.getElementById("ContactForm-anything");
const formShoes = document.getElementById("ContactForm-shoes");
const openerBtnElem = document.getElementById("wedding-date__opener");

/* postData */

const appointmentAmount = document.querySelector(
  ".appointment-first__header p"
);

const appointmentRequestBody = {
  data: {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: email ? email.value : "",
    zip_code: "",
    how_hide: "",
    dress_size: "",
    dress_budget: "",
    wedding_style: "",
    guests_number: 0,
    type: form.getAttribute("data-form"),
    time_slot_value: "",
    time_slot_date: "",
    wedding_date: 0,
    card_number: "",
    expiration_data: "",
    cvd: "",
    name_card: "",
    postal_code: "",
    smsOptIn: true,
    comment: `Comment for ${form.getAttribute("data-form")}`,
    amount: `CAD ${
      form.getAttribute("is-appointment") ? appointmentAmount.textContent : 0
    }`,
    anything: "",
    have_you_shoes: formShoes ? "Yes" : "",
    appointment_date: 0,
  },
};

const { data } = appointmentRequestBody;

if (userId) {
  data.customer_id = Number(userId);
}

const popupElem = document.querySelector(".popup");
const popupHeaderElem = document.querySelector(".popup h3");
const popupTextElems = document.querySelectorAll(".popup p");
const overlayElem = document.querySelector(".overlay");

/* Validations */

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const textError = formControl.querySelector(".error-block");
  const textSuccess = formControl.querySelector(".success-block");
  const small = formControl.querySelector("small");

  small.innerText = message;
  textError.classList.add("active");
  textSuccess.classList.remove("active");

  formControl.classList.add("error");
  formControl.classList.remove("success");
}

function setSuccessFor(input, message) {
  const formControl = input.parentElement;
  const textSuccess = formControl.querySelector(".success-block");
  const textError = formControl.querySelector(".error-block");
  const small = formControl.querySelector(".success");

  small.innerText = message;
  textSuccess.classList.add("active");
  textError.classList.remove("active");

  formControl.classList.add("success");
  formControl.classList.remove("error");
}

function checkInputs() {
  if (date_picker_element) {
    if (data.time_slot_date !== "") {
      date_picker_element.classList.add("valid-success");
    } else {
      date_picker_element.classList.remove("valid-success");
      date_picker_element.classList.add("valid-reject");
    }
  }

  if (openerBtnElem) {
    if (data.wedding_date !== 0) {
      openerBtnElem.classList.add("valid-success");
    } else {
      openerBtnElem.classList.remove("valid-success");
      openerBtnElem.classList.add("valid-reject");
    }
  }

  if (firstName) {
    data.first_name !== ""
      ? setSuccessFor(firstName, "The field is valid")
      : setErrorFor(firstName, "Required field");
  }

  if (lastName) {
    data.last_name !== ""
      ? setSuccessFor(lastName, "The field is valid")
      : setErrorFor(lastName, "Required field");
  }

  if (phone) {
    data.phone_number !== ""
      ? setSuccessFor(phone, "The field is valid")
      : setErrorFor(phone, "Required field");
  }

  if (email) {
    data.email !== ""
      ? setSuccessFor(email, "The field is valid")
      : setErrorFor(email, "Required field");
  }

  if (zipCode) {
    data.zip_code !== ""
      ? setSuccessFor(zipCode, "The field is valid")
      : setErrorFor(zipCode, "Required field");
  }

  if (howHeard) {
    data.how_hide !== ""
      ? setSuccessFor(howHeard, "The field is valid")
      : setErrorFor(howHeard, "Required field");
  }

  if (dressSize) {
    data.dress_size !== ""
      ? setSuccessFor(dressSize, "The field is valid")
      : setErrorFor(dressSize, "Required field");
  }

  if (dressBudget) {
    data.dress_budget !== ""
      ? setSuccessFor(dressBudget, "The field is valid")
      : setErrorFor(dressBudget, "Required field");
  }

  if (weddingStyle) {
    data.wedding_style !== ""
      ? setSuccessFor(weddingStyle, "The field is valid")
      : setErrorFor(weddingStyle, "Required field");
  }

  if (guests) {
    data.guests_number !== ("" || 0)
      ? setSuccessFor(guests, "The field is valid")
      : setErrorFor(guests, "Required field");
  }

  if (formCard) {
    data.card_number !== ""
      ? setSuccessFor(formCard, "The field is valid")
      : setErrorFor(formCard, "Required field");
  }

  if (formExpiration) {
    data.expiration_data !== ""
      ? setSuccessFor(formExpiration, "The field is valid")
      : setErrorFor(formExpiration, "Required field");
  }

  if (formCvd) {
    data.cvd !== ""
      ? setSuccessFor(formCvd, "The field is valid")
      : setErrorFor(formCvd, "Required field");
  }

  if (formFullName) {
    data.name_card !== ""
      ? setSuccessFor(formFullName, "The field is valid")
      : setErrorFor(formFullName, "Required field");
  }

  if (formCode) {
    data.postal_code !== ""
      ? setSuccessFor(formCode, "The field is valid")
      : setErrorFor(formCode, "Required field");
  }

  if (formShoes) {
    data.have_you_shoes !== ""
      ? setSuccessFor(formShoes, "The field is valid")
      : setErrorFor(formShoes, "Required field");
  }
}

/* Fetch and render select options */

async function getOptionsData() {
  const responce = await fetch(
    "https://be.thebridalgallery.com/api/v1/appointments/information"
  )
    .then(res => res.json())
    .then(res => res.data);

  console.log("getOptions responce >", responce);
  renderOptions(responce);
}

function renderOptions(dataObj) {
  for (const key in dataObj) {
    if (dressBudget && key === "budgetRanges") {
      dataObj[key].map(({ description }) => {
        createOptionElem(dressBudget, description);
      });
    }
    if (howHeard && key === "howHeards") {
      dataObj[key].map(({ description }) => {
        createOptionElem(howHeard, description);
      });
    }
  }
}

function createOptionElem(parentNode, description) {
  const optionEl = document.createElement("option");
  optionEl.textContent = description;
  optionEl.value = description;
  optionEl.classList.add("field__selected");
  parentNode.append(optionEl);
}

getOptionsData();

/* Request body param handlers */

function setReqBodyParam(event, param) {
  event.preventDefault();
  data[param] = event.target.value.trim();

  if (event.target.parentElement.classList.contains("error")) {
    data[param] !== ""
      ? setSuccessFor(event.target, "The field is valid")
      : setErrorFor(event.target, "Required field");
  }
}

firstName &&
  firstName.addEventListener("input", event => {
    setReqBodyParam(event, "first_name");
  });

lastName &&
  lastName.addEventListener("input", event => {
    setReqBodyParam(event, "last_name");
  });

phone &&
  phone.addEventListener("input", event => {
    if (Number(event.target.value)) {
      setReqBodyParam(event, "phone_number");
    } else {
      setErrorFor(event.target, "Nonvalid value");
    }
  });

email &&
  email.addEventListener("input", event => {
    setReqBodyParam(event, "email");
  });

zipCode &&
  zipCode.addEventListener("input", event => {
    const { target } = event;
    setReqBodyParam(event, "zip_code");

    const regExPostal = /^(?=(?:.*[A-Za-z]){3})(?=(?:.*\d){3})[A-Za-z\d]{6}$/;
    const regExZip = /^\d{5}$/;

    regExPostal.test(target.value) || regExZip.test(target.value)
      ? setSuccessFor(target, "The field is valid")
      : setErrorFor(target, "Nonvalid value");
  });

howHeard &&
  howHeard.addEventListener("change", event => {
    setReqBodyParam(event, "how_hide");
  });

dressSize &&
  dressSize.addEventListener("change", event => {
    setReqBodyParam(event, "dress_size");
  });

dressBudget &&
  dressBudget.addEventListener("change", event => {
    if (
      event.target.value === "$500.00 - $1,000.00" ||
      event.target.value === "$1,000.00 - $1,500.00"
    ) {
      popupElem.classList.add("active");
      overlayElem.classList.add("active");

      popupHeaderElem.textContent = "You have selected our sale price range";
      popupTextElems[1].textContent =
        "Please increase your budget or shop our sale section of ready to wear sample dresses. Appointments for try-ons can be booked Monday – Friday. Please select Sample Appointment when booking.";

      setErrorFor(dressBudget, "Price range must be more than $2000");
    } else {
      setReqBodyParam(event, "dress_budget");
    }
  });

weddingStyle &&
  weddingStyle.addEventListener("change", event => {
    setReqBodyParam(event, "wedding_style");
  });

if (guests) {
  guests.addEventListener("input", event => {
    event.preventDefault();

    if (event.target.parentElement.classList.contains("error")) {
      data.guests_number > 5
        ? setErrorFor(event.target, "The number of guests must be less than 6")
        : setSuccessFor(event.target, "The field is valid");
    }

    if (event.target.value > 5) {
      popupElem.classList.add("active");
      overlayElem.classList.add("active");

      popupHeaderElem.textContent = "Too many guests";
      popupTextElems[1].textContent =
        "You have selected more guests than are allowed with appointment. Please upgrade your appointment";

      setErrorFor(event.target, "The number of guests must be less than 6");
    } else {
      data.guests_number = Number(event.target.value);
      setSuccessFor(event.target, "The field is valid");
    }
  });
}

formCard &&
  formCard.addEventListener("input", event => {
    if (event.target.value.length < 19) {
      setErrorFor(event.target, "Nonvalid value");
    } else {
      setReqBodyParam(event, "card_number");
    }
  });

formExpiration &&
  formExpiration.addEventListener("input", event => {
    if (event.target.value.length < 5) {
      setErrorFor(event.target, "Nonvalid value");
    } else {
      setReqBodyParam(event, "expiration_data");
    }
  });

formCvd &&
  formCvd.addEventListener("input", event => {
    if (event.target.value.length < 3) {
      setErrorFor(event.target, "Nonvalid value");
    } else {
      setReqBodyParam(event, "cvd");
    }
  });

formFullName &&
  formFullName.addEventListener("input", event => {
    setReqBodyParam(event, "name_card");
  });

formCode &&
  formCode.addEventListener("input", event => {
    setReqBodyParam(event, "postal_code");

    const regExPostal = /^(?=(?:.*[A-Za-z]){3})(?=(?:.*\d){3})[A-Za-z\d]{6}$/;

    regExPostal.test(event.target.value)
      ? setSuccessFor(event.target, "The field is valid")
      : setErrorFor(event.target, "Nonvalid value");
  });

formComment &&
  formComment.addEventListener("input", event => {
    setReqBodyParam(event, "anything");
  });

formShoes &&
  formShoes.addEventListener("change", event => {
    setReqBodyParam(event, "have_you_shoes");
  });

const calendarCustom = document.querySelector(".calendar-wrapper");

function customCalendarDayHandler() {
  const customCalendarDate = document.querySelectorAll(".normal");

  [...customCalendarDate].forEach(elem => {
    elem.addEventListener("click", event => {
      const secondsDate = Number(event.target.dataset.date);

      const inheritYear = event.target.dataset.year;
      const inheritMonth = event.target.dataset.month;
      const inheritDay = event.target.dataset.day;

      data.wedding_date = Number(secondsDate);
      if (openerBtnElem.classList.contains("valid-reject")) {
        openerBtnElem.classList.remove("valid-reject");
        openerBtnElem.classList.add("valid-success");
      }

      elem.classList.add("today");

      openerBtnElem.textContent = `${inheritDay} / ${inheritMonth} / ${inheritYear}`;

      [...customCalendarDate].map(dateEl => {
        if (dateEl !== elem) {
          dateEl.classList.remove("today");
        }
      });

      calendarCustom.style.display = "none";
    });
  });
}

openerBtnElem &&
  openerBtnElem.addEventListener("click", event => {
    event.preventDefault();

    if (calendarCustom.style.display === "none") {
      calendarCustom.style.display = "block";
    } else {
      calendarCustom.style.display = "none";
    }

    customCalendarDayHandler();
  });

/* Shame additional calendar */
var Cal = function (divId) {
  //Сохраняем идентификатор div
  this.divId = divId;

  // Дни недели с понедельника
  this.DaysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Месяцы начиная с января
  this.Months = [
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

  //Устанавливаем текущий месяц, год
  var d = new Date();

  this.currMonth = d.getMonth("9");
  this.currYear = d.getFullYear("23");
  this.currDay = d.getDate("9");
};

// Переход к следующему месяцу
Cal.prototype.nextMonth = function () {
  if (this.currMonth == 11) {
    this.currMonth = 0;
    this.currYear = this.currYear + 1;
  } else {
    this.currMonth = this.currMonth + 1;
  }
  this.showcurr();
  customCalendarDayHandler();
};

// Переход к предыдущему месяцу
Cal.prototype.previousMonth = function () {
  if (this.currMonth == 0) {
    this.currMonth = 11;
    this.currYear = this.currYear - 1;
  } else {
    this.currMonth = this.currMonth - 1;
  }
  this.showcurr();
  customCalendarDayHandler();
};

// Показать текущий месяц
Cal.prototype.showcurr = function () {
  this.showMonth(this.currYear, this.currMonth);
};

// Показать месяц (год, месяц)
Cal.prototype.showMonth = function (y, m) {
  var d = new Date(),
    // Первый день недели в выбранном месяце
    firstDayOfMonth = new Date(y, m, 7).getDay(),
    // Последний день выбранного месяца
    lastDateOfMonth = new Date(y, m + 1, 0).getDate(),
    // Последний день предыдущего месяца
    lastDayOfLastMonth =
      m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();

  var html = "<table>";

  // Запись выбранного месяца и года
  html += "<thead><tr>";
  html += '<td colspan="7">' + this.Months[m] + " " + y + "</td>";
  html += "</tr></thead>";

  // заголовок дней недели
  html += '<tr class="days">';
  for (var i = 0; i < this.DaysOfWeek.length; i++) {
    html += "<td>" + this.DaysOfWeek[i] + "</td>";
  }
  html += "</tr>";

  // Записываем дни
  var i = 1;
  do {
    var dow = new Date(y, m, i).getDay();

    // Начать новую строку в понедельник
    if (dow == 1) {
      html += "<tr>";
    }

    // Если первый день недели не понедельник показать последние дни предидущего месяца
    else if (i == 1) {
      html += "<tr>";
      var k = lastDayOfLastMonth - firstDayOfMonth + 1;
      for (var j = 0; j < firstDayOfMonth; j++) {
        html += '<td class="not-current">' + k + "</td>";
        k++;
      }
    }

    let fullDate = new Date(
      this.currYear + "-" + (this.currMonth + 1) + "-" + i
    );
    // Записываем текущий день в цикл
    var chk = new Date();
    var chkY = chk.getFullYear();
    var chkM = chk.getMonth();
    if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
      html += `<td class="normal today" data-date=${new Date(
        this.currYear + "-" + (this.currMonth + 1) + "-" + i
      ).getTime()} data-year=${this.currYear} data-month=${
        this.currMonth + 1
      } data-day=${i}>${i}</td>`;
    } else {
      html += `<td class="normal" data-date=${new Date(
        this.currYear + "-" + (this.currMonth + 1) + "-" + i
      ).getTime()} data-year=${this.currYear} data-month=${
        this.currMonth + 1
      } data-day=${i}>${i}</td>`;
    }
    // закрыть строку в воскресенье
    if (dow == 0) {
      html += "</tr>";
    }
    // Если последний день месяца не воскресенье, показать первые дни следующего месяца
    else if (i == lastDateOfMonth) {
      var k = 1;
      for (dow; dow < 7; dow++) {
        html += '<td class="not-current">' + k + "</td>";
        k++;
      }
    }

    i++;
  } while (i <= lastDateOfMonth);

  // Конец таблицы
  html += "</table>";

  // Записываем HTML в div
  if (document.getElementById(this.divId)) {
    document.getElementById(this.divId).innerHTML = html;
  }
};

// При загрузке окна
window.onload = function () {
  // Начать календарь
  var c = new Cal("divCal");
  c.showcurr();

  // Привязываем кнопки «Следующий» и «Предыдущий»
  if (getId("btnNext")) {
    getId("btnNext").onclick = function () {
      c.nextMonth();
    };
  }
  if (getId("btnPrev")) {
    getId("btnPrev").onclick = function () {
      c.previousMonth();
    };
  }
};

// Получить элемент по id
function getId(id) {
  return document.getElementById(id);
}
/* End of shame additional calendar */

/* Post appointment */
const submitBtn = document.getElementById("appointment_button");

async function postAppointment() {
  const responce = await fetch(
    `https://be.thebridalgallery.com/api/v1/appointments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentRequestBody),
    }
  )
    .then(res => res.json())
    .then(res => {
      popupTextElems.forEach(elem => elem.remove());

      if (res.error) {
        const { message, code } = res.error;
        popupHeaderElem.textContent = `Oops! ${
          typeof message === "string" ? message : code
        }`;
      } else {
        popupHeaderElem.textContent =
          "Success! You can check it in personal account";
      }

      popupElem.classList.add("active");
      overlayElem.classList.add("active");
      popupHeaderElem.style.marginBottom = "50px";

      return res;
    })
    .catch(error => {
      popupHeaderElem.textContent = `Oops! ${error.message}`;
      popupElem.classList.add("active");
      overlayElem.classList.add("active");
    });
  console.log("postAppointment responce >>>", responce);
}

submitBtn &&
  submitBtn.addEventListener("click", event => {
    event.preventDefault();

    checkInputs();
    postAppointment();
  });

/* Popup control */

title.addEventListener("click", () => {
  popupElem.classList.add("active");
  overlayElem.classList.add("active");
});
popupBtn.addEventListener("click", () => {
  popupElem.classList.remove("active");
  overlayElem.classList.remove("active");
});
popupClose.addEventListener("click", () => {
  popupElem.classList.remove("active");
  overlayElem.classList.remove("active");
});

/* Check input */

document.getElementById("checkTerms").addEventListener("click", e => {
  if (e.target.checked) {
    checkoutButton.removeAttribute("disabled");
  } else {
    checkoutButton.setAttribute("disabled", "");
  }
});
