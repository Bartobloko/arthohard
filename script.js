const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.navigation');

const handleClick = () => {
    hamburger.classList.toggle('hamburger--active');
    menu.classList.toggle('navigation--active');
}

hamburger.addEventListener('click', handleClick);

// OBSĹUGA LOGO
const logo = document.querySelector('.logo');
logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// OBSĹUGA MENU SEKCJI
const navLinks = document.querySelectorAll('.navigation__item a');
const sections = document.querySelectorAll('section');

function setActiveSection() {
    const scrollY = window.scrollY + 100;

    sections.forEach(sec => {
        const offset = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const navLink = document.querySelector(`.navigation__list .navigation__item a[href="#${id}"]`);

        if (navLink && scrollY >= offset && scrollY < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        } else if (navLink) {
            navLink.classList.remove('active');
        }
    });
}

window.onscroll = () => {
    setActiveSection();
};

navLinks.forEach(link => {
    if (!link.href.includes('http')) { // Sprawdza, czy link nie jest zewnÄtrzny (jak "Kup teraz")
        link.addEventListener('click', (event) => {
            event.preventDefault();
            link.classList.add('active');
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const yOffset = -70;

            window.scrollTo({
                top: targetSection.offsetTop + yOffset,
                behavior: 'smooth'
            });
        });
    }
});

// ZamkniÄcie menu po klikniÄciu w link
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        menu.classList.remove('navigation--active');
        hamburger.classList.remove('hamburger--active');
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("products-container");
    const selectPageSize = document.getElementById("page-size-select");
    let pageNumber = 1;
    let pageSize = 20;
    let isLoading = false;

    async function fetchProducts() {
        if (isLoading) return;
        isLoading = true;

        try {
            const response = await fetch(`https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            const data = await response.json();

            if (data && Array.isArray(data.data)) {
                renderProducts(data.data);
            } else {
                console.error("Nieprawidłowy format danych:", data);
            }
            pageNumber++;
        } catch (error) {
            console.error("Błąd pobierania produktów", error);
        } finally {
            isLoading = false;
        }
    }

    function renderProducts(products) {
        products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("product");
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.text}" style="width:100px; height:auto;">
                <h3>${product.text}</h3>
            `;
            productElement.addEventListener("click", () => showPopup(product));
            productsContainer.appendChild(productElement);
        });
    }

    function showPopup(product) {
        closePopup(); // Zamknij istniejący popup przed otwarciem nowego

        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.innerHTML = `
            <div class="popup-content">
                <h2>${product.text}</h2>
                <img src="${product.image}" alt="${product.text}" style="max-width: 300px; height:auto;">
                <button class="close-btn">Zamknij</button>
            </div>
        `;
        document.body.appendChild(popup);

        popup.querySelector(".close-btn").addEventListener("click", closePopup);
    }

    function closePopup() {
        const existingPopup = document.querySelector(".popup");
        if (existingPopup) {
            existingPopup.remove();
        }
    }

    function handleScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            fetchProducts();
        }
    }

    selectPageSize.addEventListener("change", function () {
        pageSize = parseInt(this.value, 10);
        pageNumber = 1;
        productsContainer.innerHTML = "";
        fetchProducts();
    });

    window.addEventListener("scroll", handleScroll);



});
