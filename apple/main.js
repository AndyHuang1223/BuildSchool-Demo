const categoryList = document.getElementById('category_list')
let shopData = {}
let selectModel, selectColor, selectStorage

function renderingCategory(categoryData) {

    // categoryList.innerHTML += `
    // <li class="nav-item">
    //     <button class="nav-link" aria-current="page" data-url="${category.dataUrl}">${category.title}</button>
    // </li>`

    categoryData.forEach(category => {
        const li = document.createElement('li')
        li.classList.add('nav-item')

        const button = document.createElement('button')
        button.classList.add('nav-link')
        button.textContent = category.title
        button.onclick = async function () {
            document.querySelector('.shop-content').classList.remove('d-none')
            try {
                await fetchMerchandise(category.dataUrl)
                renderingShop(shopData)
                document.querySelector('.qna-area').classList.remove('d-none')
                document.querySelector('footer').classList.remove('d-none')
            } catch (error) {
                document.querySelector('.shop-content').classList.add('d-none')
            }

        }
        li.append(button)
        categoryList.append(li)
    })
}

function renderingShop(shop) {
    // console.log(shop);

    const priceList = shop.specifications.map(spec => spec.price)
    const minPrice = Math.min(...priceList)
    createTitleArea(shop.title, minPrice)
    const defaultImg = Object.values(shop.images)[0]
    createCarousel(defaultImg)

    let widgetHTML = ''
    shop.widgets.forEach(widget => {
        widgetHTML += createWidget(widget)
    })
    document.querySelector('.spec-widget').innerHTML = widgetHTML
}

function createTitleArea(title, price) {
    const titleArea = document.querySelector('.title-area')
    titleArea.innerHTML = `
        <h1>
            ${title}
        </h1>
        <div class="total-price">
            NT$ ${price.toLocaleString()} 起
        </div>`
}

function getCarouselInnerHTML(images) {
    //     let html = `<div class="carousel-item active">
    //     <img src="./images/iphone-14-pro/iphone-14-pro-finish-select-202209-6-1inch-deeppurple.jpeg"
    //         class="d-block w-100" alt="...">
    // </div>
    // <div class="carousel-item">
    //     <img src="./images/iphone-14-pro/iphone-14-pro-finish-select-202209-6-1inch-deeppurple_AV1.jpeg"
    //         class="d-block w-100" alt="...">
    // </div>
    // <div class="carousel-item">
    //     <img src="./images/iphone-14-pro/iphone-14-pro-finish-select-202209-6-1inch-deeppurple_AV2.jpeg"
    //         class="d-block w-100" alt="...">
    // </div>`
    let html = ''
    images.forEach((img, idx) => {
        html += `<div class="carousel-item ${idx === 0 ? 'active' : ''}">
                        <img src="${img}" class="d-block w-100" alt="...">
                    </div>`
    })
    return html
}

function getCarouselIndicatorsInnerHTML(images) {
    //     let html = `<button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0"
    //     class="active" aria-current="true" aria-label="Slide 1"></button>
    // <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="1"
    //     aria-label="Slide 2"></button>
    // <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="2"
    //     aria-label="Slide 3"></button>`
    let html = ''
    images.forEach((img, idx) => {
        html += `<button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="${idx}"
        class="${idx === 0 ? 'active' : ''}" aria-current="true" aria-label="Slide ${idx + 1}"></button>`
    })
    return html
}

function createCarousel(images) {
    const mainImgArea = document.querySelector('.main-img-area')
    const carouselIndicatorsHTML = getCarouselIndicatorsInnerHTML(images)
    const carouselInnerHTML = getCarouselInnerHTML(images)

    mainImgArea.innerHTML = `
                <div id="carouselExampleAutoplaying" class="carousel slide  sticky-top" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        ${carouselIndicatorsHTML}
                    </div>
                    <div class="carousel-inner">
                        ${carouselInnerHTML}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>`
}

async function fetchMerchandise(url) {
    const response = await fetch(url)
    const data = await response.json()
    shopData = data
}


function createWidget(widget) {
    const items = getWidgetItem(widget.type)
    let itemHTML = ''

    items.forEach(item => {
        if (widget.type === 'color') {
            let color = shopData.colors.find(c => c.colorCode === item)
            itemHTML += `<div class="col">
                        <div class="border border-secondary-subtle border-1 rounded-3 p-4 text-center" role="button" data-color="${color.colorCode}" onclick="clickHandler(this,'${widget.type}')">
                            <img class="w-25" src="${color.colorImg}" alt="${color.colorName}">
                        </div>
                    </div>`
        } else if (widget.type === 'model') {
            const specs = shopData.specifications.filter(spec => spec.model === item)
            const minPrice = Math.min(...specs.map(s => s.price))
            itemHTML += `<div class="col">
                <div class="border border-secondary-subtle border-1 rounded-3 p-4 d-flex justify-content-between" role="button" onclick="clickHandler(this,'${widget.type}')" data-model="${item}">
                    <div>${item}</div>
                    <div>NT$ ${(minPrice).toLocaleString()} 起</div>
                </div>
            </div>`
        } else if (widget.type === 'storage') {
            itemHTML += `<div class="col">
                <div class="border border-secondary-subtle border-1 rounded-3 p-4 d-flex justify-content-between" role="button" onclick="clickHandler(this,'${widget.type}')" data-storage="${item}">
                    <div>${item}</div>
                    <div class="price"></div>
                </div>
            </div>`
        } else {
            itemHTML += `<div class="col">
                <div class="border border-secondary-subtle border-1 rounded-3 p-4 d-flex justify-content-between" role="button" onclick="clickHandler(this,'${widget.type}')">
                    <div>${item}</div>
                </div>
            </div>`
        }
    })

    let html = `
    <section class="widget-item mb-4 mx-lg-3">
        <h2 class="fs-4">${widget.title} <span class="text-black-50">${widget.subTitle}</span></h2>
        ${widget.type === 'color' ? `<p><span class="picked-color fw-medium">顏色</span> </p>` : ''}
        <div class="row row-cols-${widget.col} gy-3">
            ${itemHTML}
        </div>
    </section>`



    return html
}

function getWidgetItem(type) {
    return new Set(shopData.specifications.map(spec => spec[type]))
}

function clickHandler(element, type) {
    const specWidget = document.querySelector('.spec-widget')
    specSelectActiveHandler(element)
    if (type === 'color') {
        const color = shopData.colors.find(c => c.colorCode === element.dataset.color)
        selectColor = color.colorCode

        //新增字
        specWidget.querySelector('.picked-color').textContent = `顏色 - ${color.colorName}`

        //換圖
        const imgs = shopData.images[color.colorCode]
        createCarousel(imgs)

    } else if (type === 'model') {
        selectModel = element.dataset.model
        //處理儲存裝置區價錢
        const specs = shopData.specifications.filter(s => s.model === selectModel)
        specWidget.querySelectorAll('[data-storage]').forEach(el => {
            const spec = specs.find(s => s.storage === el.dataset.storage)
            el.querySelector('.price').textContent = `NT$ ${spec.price.toLocaleString()}`
        })

    } else if (type === 'storage') {
        selectStorage = element.dataset.storage
    }
    getSummaryInfo()
}

function getSummaryInfo() {
    if (selectModel && selectColor && selectStorage) {
        const spec = shopData.specifications.find(s => s.model === selectModel && s.color === selectColor && s.storage === selectStorage)

        const summaryArea = document.querySelector('.summary-area')
        summaryArea.classList.remove('d-none')
        const summaryImg = summaryArea.querySelector('.summary-area-img img')
        const img = shopData.images[spec.color][1]
        summaryImg.src = img

        const color = shopData.colors.find(c => c.colorCode === spec.color)
        const productItem = summaryArea.querySelector('.product-item')
        productItem.querySelector('.title').textContent = `${spec.model} ${spec.storage} ${color.colorName}`
        productItem.querySelector('.price').textContent = `NT$ ${spec.price.toLocaleString()}`
    }


}

function specSelectActiveHandler(element) {
    element.parentElement.parentElement.querySelectorAll('[role="button"]').forEach(el => {
        el.classList.remove('border-primary')
    })
    element.classList.remove('border-secondary-subtle')
    element.classList.add('border-primary')
}
window.onload = function () {
    fetch('./data/shop-category.json')
        .then(response => response.json())
        .then(data => {
            renderingCategory(data)
        })
        .catch((e) => {

        })

}