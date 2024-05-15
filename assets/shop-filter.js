/* Refs elems */
const downdropEl = document.getElementById("downdrop");

const priceRangeElems = document.querySelectorAll(
  "price-range input[type='number']"
);
const sizesFilterElems = document.querySelectorAll(
  "li[data-type='size'] input[type='checkbox']"
);
const colorsFilterElems = document.querySelectorAll(
  "[data-type='color'] input[type='checkbox']"
);
const silhouetteFilterElems = document.querySelectorAll(
  "[data-type='silhouette'] input[type='checkbox']"
);
const fabricsFilterElems = document.querySelectorAll(
  "[data-type='fabrics'] input[type='checkbox']"
);
const categoryFilterElems = document.querySelectorAll(
  "[data-type='category'] input[type='checkbox']"
);
const necklinesFilterElems = document.querySelectorAll(
  "[data-type='necklines'] input[type='checkbox']"
);
const embellishmentFilterElems = document.querySelectorAll(
  "[data-type='embellishment'] input[type='checkbox']"
);
const featuresFilterElems = document.querySelectorAll(
  "[data-type='features'] input[type='checkbox']"
);
const sortEl = document.querySelector("select[name='sort_by']");
const collectionTitleEl = document.querySelector("h1[data-title]");
const productsContainerEl = document.querySelector("#product-grid");
const markupEl = document.querySelector("div[data-type='markup']");
const paginateContainer = document.querySelector(
  ".pagination__list.list-unstyled"
);
const filterFormEl = document.querySelector(".facets__form");
const loaderEl = document.querySelector("#loading-overlay__spinner");
const markupSample = markupEl.cloneNode(true);
const collectionName = collectionTitleEl.dataset.title;

const optionFeatured = filterFormEl.querySelector("option[value='manual']");
const optionBestSelling = filterFormEl.querySelector(
  "option[value='best-selling']"
);

const slider = document.getElementById("couple-slider");
const maxPrice = Number(slider.getAttribute("data-max").replaceAll(",", ""));

filterFormEl.style.display = "none";
optionFeatured.style.display = "none";
optionBestSelling.style.display = "none";

/* Parameters variable */

let minPriceQuery = 0;
let maxPriceQuery = maxPrice;

let perPage = 18;
let currentPage = 1;
let fetchedData = null;

const requestBody = {
  sizes: [],
  colors: [],
  silhouette: [],
  fabrics: [],
  category: [],
  necklines: [],
  embellishment: [],
  features: [],
  prices: {
    min: 0,
    max: maxPrice,
  },
  collection_name: collectionName,
};

/* Functions */

async function fetchFilteredData(requestBody) {
  loaderEl.style.display = "block";
  downdropEl.style.display = "block";
  console.log("requestBody >>", requestBody);

  const responce = await fetch(
    "https://be.thebridalgallery.com/api/v1/products/filter",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  )
    .then(res => res.json())
    .then(res => {
      return res;
    })
    .catch(error => {
      console.log("fetchFilteredData error>>", error.message);
    })
    .finally(() => {
      loaderEl.style.display = "none";
      filterFormEl.style.display = "block";
      downdropEl.style.display = "none";
    });

  console.log("responce >>", responce);

  fetchedData = responce;
  renderData(fetchedData);
  renderPaginate();
}

function renderData(dataArr) {
  productsContainerEl.innerHTML = "";

  const data = productsToShow(dataArr.products);

  if (data.length === 0) {
    productsContainerEl.innerHTML =
      "<strong>Oops... Not found any variants</strong>";
    return;
  }

  data.map((item, idx) => {
    const { id, title, variants, images } = item;
    const productCart = markupSample.cloneNode(true);
    const noImgSrc =
      "https://cdn.shopify.com/s/files/1/0782/9753/0641/files/empty.jpg?v=1693381628";

    let imgSrc;
    let imgHoverSrc;

    if (images[0] && images[1]) {
      imgSrc = images[0].src;
      imgHoverSrc = images[1].src;
    } else {
      imgSrc = noImgSrc;
      imgHoverSrc = noImgSrc;
    }

    markupMaker(productCart, id, title, variants[0], imgSrc, imgHoverSrc, idx);
  });

  _swat.initializeActionButtons(".products-list");
  renderPaginate();
}

function renderPaginate() {
  paginateContainer.innerHTML = "";

  const pages = Math.ceil(fetchedData.count / perPage);

  for (let pageNum = 0; pageNum <= pages + 1; pageNum++) {
    const paginateBtn = document.createElement("button");
    const paginateLi = document.createElement("li");
    paginateLi.append(paginateBtn);

    let btnTextContent;

    if (pageNum === 0) {
      if (pages > 1 && currentPage > 1) {
        btnTextContent = "<";
      }
    } else if (pageNum > pages) {
      if (pages > 1 && currentPage < pages) {
        btnTextContent = ">";
      }
    } else {
      btnTextContent = pageNum;
    }

    paginateBtn.textContent = btnTextContent;
    paginateBtn.classList.add("pagination__item");
    paginateBtn.textContent === String(currentPage) &&
      paginateBtn.classList.add("pagination__item--current");

    paginateBtn.addEventListener("click", event => {
      if (pageNum === 0) {
        currentPage--;
      } else if (pageNum > pages) {
        currentPage++;
      } else {
        const btnsList = document.querySelectorAll(".pagination__item");

        currentPage = pageNum;

        [...btnsList].map(el => {
          el.textContent === String(currentPage)
            ? el.classList.add("pagination__item--current")
            : el.classList.remove("pagination__item--current");
        });
      }

      renderData(fetchedData);
      window.scrollTo({
        top: 350,
        behavior: "smooth",
      });
    });

    paginateContainer.append(paginateLi);
  }
}

function markupMaker(
  markup,
  id,
  title,
  variant,
  primeImageSrc,
  hoverImageSrc,
  idx
) {
  markup.classList.remove("collection-grid__item1");
  const imgEls = markup.querySelectorAll(".motion-reduce");
  const imgEl = imgEls[0];
  let imgHoverEl;
  imgEls[1] ? (imgHoverEl = imgEls[1]) : (imgHoverEl = imgEl.cloneNode(true));
  const productLinkEl = markup.querySelector(".card-product__info a");
  const priceEl = markup.querySelector(".price-item.price-item--regular");
  const altPriceEl = markup.querySelector(
    ".card-product__price.title-small-upper span"
  );
  const addToWishlistButtonEl = markup.querySelector(".swym-button");

  markup.classList.add(`collection-grid__item${idx + 1}`);
  addToWishlistButtonEl.classList.remove("product_8713737437457");
  addToWishlistButtonEl.classList.add(`product_${id}`);
  addToWishlistButtonEl.setAttribute("data-product-id", `${id}`);
  addToWishlistButtonEl.setAttribute("data-variant-id", `${variant.id}`);
  addToWishlistButtonEl.setAttribute(
    "data-product-url",
    `https://${window.location.hostname}/products/${title}`
  );

  imgEl.srcset = "";
  imgHoverEl.srcset = "";

  imgEl.src = primeImageSrc;
  imgHoverEl.src = hoverImageSrc;

  productLinkEl.href = `/products/${title}`;
  productLinkEl.textContent = title;

  priceEl
    ? (priceEl.textContent = variant.price)
    : (altPriceEl.textContent = variant.price);

  productsContainerEl.append(markup);
}

function productsToShow(productsArr) {
  return productsArr.filter(
    (item, idx) =>
      idx >= perPage * (currentPage - 1) && idx < perPage * currentPage
  );
}

function changeRequestDataArray(filterCheckboxArray, requestParam) {
  [...filterCheckboxArray].forEach(input => {
    input.addEventListener("change", event => {
      event.preventDefault();
      const { value, checked } = event.target;

      let dataArr = [...requestBody[requestParam]];

      checked
        ? (dataArr = [...dataArr, value])
        : (dataArr = dataArr.filter(el => el !== value));

      requestBody[requestParam] = dataArr;

      fetchFilteredData(requestBody);
    });
  });
}

function changeRequestDataPrice(inputsArr) {
  [...inputsArr].forEach(input => {
    input.addEventListener("blur", event => {
      event.preventDefault();

      let value = Number(event.target.value);

      let prices = requestBody.prices;

      if (input.id === "Filter-Price-GTE") {
        if (prices.max && value > prices.max) {
          prices.min = prices.max;
          event.target.value = String(prices.max);
        } else {
          prices.min = value;
          slider.noUiSlider.set([value, null]);
        }
      }
      if (input.id === "Filter-Price-LTE") {
        if (prices.min && prices.min > value) {
          prices.max = prices.min;
          event.target.value = String(prices.min);
        } else {
          prices.max = value;
          slider.noUiSlider.set([null, value]);
        }
      }

      fetchFilteredData(requestBody);
    });
  });
}

/* Functions call */

changeRequestDataArray([...sizesFilterElems], "sizes");
changeRequestDataArray([...colorsFilterElems], "colors");
changeRequestDataArray([...silhouetteFilterElems], "silhouette");
changeRequestDataArray([...fabricsFilterElems], "fabrics");
changeRequestDataArray([...categoryFilterElems], "category");
changeRequestDataArray([...necklinesFilterElems], "necklines");
changeRequestDataArray([...embellishmentFilterElems], "embellishment");
changeRequestDataArray([...featuresFilterElems], "features");
changeRequestDataPrice(priceRangeElems);
sortEl.addEventListener("change", event => {
  event.preventDefault();

  if (!fetchedData) {
    console.log("NO DATA");
    return;
  }

  const value = event.target.value;

  if (value === "title-ascending") {
    fetchedData.products = fetchedData.products.sort(
      (a, b) =>
        Number(a.title.replaceAll("-", "")) -
        Number(b.title.replaceAll("-", ""))
    );
  }
  if (value === "title-descending") {
    fetchedData.products = fetchedData.products.sort(
      (a, b) =>
        Number(b.title.replaceAll("-", "")) -
        Number(a.title.replaceAll("-", ""))
    );
  }
  if (value === "price-ascending") {
    fetchedData.products = fetchedData.products.sort(
      (a, b) => Number(a.variants[0].price) - Number(b.variants[0].price)
    );
  }
  if (value === "price-descending") {
    fetchedData.products = fetchedData.products.sort(
      (a, b) => Number(b.variants[0].price) - Number(a.variants[0].price)
    );
  }
  if (value === "created-ascending") {
    fetchedData.products = fetchedData.products.sort((a, b) => {
      return (
        Number(
          a.created_at
            .replaceAll("-", "")
            .replaceAll(":", "")
            .replaceAll("T", "")
        ) -
        Number(
          b.created_at
            .replaceAll("-", "")
            .replaceAll(":", "")
            .replaceAll("T", "")
        )
      );
    });
  }
  if (value === "created-descending") {
    fetchedData.products = fetchedData.products.sort((a, b) => {
      return (
        Number(
          b.created_at
            .replaceAll("-", "")
            .replaceAll(":", "")
            .replaceAll("T", "")
        ) -
        Number(
          a.created_at
            .replaceAll("-", "")
            .replaceAll(":", "")
            .replaceAll("T", "")
        )
      );
    });
  }

  renderData(fetchedData);
});

/* Two point price input */

noUiSlider.create(slider, {
  start: [0, maxPrice],
  step: 10,
  connect: true,
  range: {
    min: minPriceQuery,
    max: maxPriceQuery,
  },
});

slider.noUiSlider.on("update", event => {
  minPriceQuery = event[0];
  maxPriceQuery = event[1];

  [...priceRangeElems].forEach(input => {
    if (input.id === "Filter-Price-GTE") {
      input.value = Number(event[0]).toFixed(0);
    }
    if (input.id === "Filter-Price-LTE") {
      input.value = Number(event[1]).toFixed(0);
    }
  });
});

slider.noUiSlider.on("end", event => {
  requestBody.prices.min = Number(event[0]).toFixed(0);
  requestBody.prices.max = Number(event[1]).toFixed(0);

  fetchFilteredData(requestBody);
});
