// JavaScript to toggle the sidebar
const eatIcon = document.querySelector('.eat-icon');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.querySelector('.sidebar-close');
const orderList = document.querySelector('.list-items');
const totalAmount = document.querySelector('.order-total');
const checkoutButton = document.querySelector('.checkout-btn');
const addButton = document.querySelector('.add-btn');
let total = 0;
let orders = {}; // Store orders with quantities

// Show sidebar when the eat icon or add button is clicked
[eatIcon, addButton].forEach(button => {
    button.addEventListener('click', () => {
        sidebar.classList.add('show'); // Show the sidebar
    });
});

// Hide sidebar when the close button is clicked
sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('show'); // Hide the sidebar
});

// Add order functionality using the plus icon
document.querySelectorAll('.add-btn').forEach(icon => {
    icon.addEventListener('click', () => {
        const itemName = icon.getAttribute('data-name');
        const itemPrice = parseFloat(icon.getAttribute('data-price'));

        if (isNaN(itemPrice)) return; // Prevent adding if price is not valid

        // Check if the item already exists in the order
        if (orders[itemName]) {
            orders[itemName].quantity += 1; // Increase quantity
        } else {
            // Create a new order item
            orders[itemName] = { price: itemPrice, quantity: 1 };
        }

        // Update the order list and total amount
        updateOrderList();
    });
});

// Update the order list in the DOM
function updateOrderList() {
    orderList.innerHTML = ''; // Clear the current order list
    let hasOrders = false;

    for (const itemName in orders) {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');

        const itemText = document.createElement('span');
        itemText.classList.add('item-name');
        itemText.innerHTML = `${itemName}<br> - ₱ ${orders[itemName].price.toFixed(2)}`;
        itemText.style.fontSize = '16px'; 
        itemText.style.fontWeight = 'bold';

        const quantityControl = document.createElement('div');
        quantityControl.classList.add('quantity-control');

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.classList.add('quantity-btn', 'minus-btn');
        minusBtn.addEventListener('click', () => updateQuantity(itemName, -1));

        const quantityDisplay = document.createElement('span');
        quantityDisplay.textContent = orders[itemName].quantity; // Displays the quantity
        quantityDisplay.classList.add('quantity-display');

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.classList.add('quantity-btn', 'plus-btn');
        plusBtn.addEventListener('click', () => updateQuantity(itemName, 1));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => removeOrderItem(itemName));

        quantityControl.appendChild(minusBtn);
        quantityControl.appendChild(quantityDisplay);
        quantityControl.appendChild(plusBtn);

        orderItem.appendChild(itemText);
        orderItem.appendChild(quantityControl);
        orderItem.appendChild(deleteBtn);

        orderList.appendChild(orderItem);
        hasOrders = true;
    }

    // Update total amount
    total = Object.values(orders).reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalAmount.textContent = `Php ${total.toFixed(2)}`;

    // Show the sidebar if there are orders
    sidebar.classList.toggle('show', hasOrders);
}

// Update the quantity of an item, and remove if quantity hits 0
function updateQuantity(itemName, change) {
    if (orders[itemName]) {
        orders[itemName].quantity += change;

        if (orders[itemName].quantity <= 0) {
            removeOrderItem(itemName);
        } else {
            updateOrderList();
        }
    }
}

// Remove an order item from the list and update total
function removeOrderItem(itemName) {
    delete orders[itemName]; // Remove from the orders object
    updateOrderList(); // Update the displayed order list
}

// Checkout functionality
checkoutButton.addEventListener('click', () => {
    if (total > 0) {
        // Get the selected dine option and payment option
        const dineOption = document.querySelector('select[name="dine-option"]').value;
        const paymentOption = document.querySelector('select[name="pay-option"]').value;

        // Retrieve the last orderId from localStorage, or start from 0 if not available
        let lastOrderId = parseInt(localStorage.getItem('lastOrderId')) || 0;

        // Increment the orderId
        lastOrderId++;

        // Store the updated orderId back into localStorage for the next order
        localStorage.setItem('lastOrderId', lastOrderId.toString());

        const orderSummary = {
            orderId: lastOrderId,  // Order ID
            dineOption: dineOption,
            paymentOption: paymentOption,
            total: total,
            orders: orders  // The user's orders
        };

        // Store the orderSummary in localStorage for the checkout page
        localStorage.setItem('orderSummary', JSON.stringify(orderSummary));

        // Store order summary into salesData for the Sales Management page
        let salesData = JSON.parse(localStorage.getItem('salesData')) || [];
        const salesOrder = {
            orderId: lastOrderId,
            summary: Object.keys(orders).join(", "),  // Summary of ordered items
            diningPreference: dineOption,
            paymentMethod: paymentOption,
            total: `Php ${total.toFixed(2)}`
        };
        salesData.push(salesOrder);
        localStorage.setItem('salesData', JSON.stringify(salesData)); // Store the updated sales data

        // Redirect to the order summary page
        window.location.href = 'ordersummary.html';  // Change this path if necessary
    } else {
        alert('Your order is empty. Please add items to your order before checking out.');
    }
});

// Search Functionality
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('.section-header');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase().trim();
            let categoryFound = false;
            let itemFound = false;

            // Show all sections and cards if search term is empty
            if (!searchTerm) {
                sections.forEach(section => {
                    section.classList.remove('hidden'); // Show all sections
                });
                cards.forEach(card => {
                    card.style.display = ''; // Show all cards
                });
                return; // Exit early
            }

            // Hide all sections initially
            sections.forEach(section => {
                section.classList.add('hidden');
            });

            // Check if the search term matches any category (section title)
            sections.forEach(section => {
                const categoryTitleElement = section.querySelector('.section-heading');
                const categoryTitle = categoryTitleElement ? categoryTitleElement.textContent.toLowerCase() : '';

                if (categoryTitle.includes(searchTerm)) {
                    section.classList.remove('hidden'); // Show the matching category
                    categoryFound = true;
                }
            });

            // If no category matches, check for individual items
            if (!categoryFound) {
                cards.forEach(card => {
                    const cardTitleElement = card.querySelector('.card-title');
                    const cardTitle = cardTitleElement ? cardTitleElement.textContent.toLowerCase() : '';

                    const descriptionElement = card.querySelector('p');
                    const description = descriptionElement ? descriptionElement.textContent.toLowerCase() : '';

                    // Match title or description with the search term
                    if (cardTitle.includes(searchTerm) || description.includes(searchTerm)) {
                        card.style.display = ''; // Show the matching card
                        itemFound = true;

                        // Ensure the parent section is visible
                        const section = card.closest('.section-header');
                        if (section) {
                            section.classList.remove('hidden');
                        }
                    } else {
                        card.style.display = 'none'; // Hide non-matching cards
                    }
                });

                // If no items found, log a message (optional UI feedback)
                if (!itemFound) {
                    console.log("No items found."); // Replace with UI message if needed
                }
            }
        });
    }
});

// Menu Item Click Functionality
document.addEventListener('DOMContentLoaded', function () {
    const menuLinks = document.querySelectorAll('.menu-item a');

    if (menuLinks) {
        menuLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent default jump behavior
                const targetId = this.getAttribute('href'); // Get the target ID
                const targetElement = document.querySelector(targetId); // Find the element

                if (targetElement) {
                    // Hide all other sections
                    const allSections = document.querySelectorAll('.section-header');
                    allSections.forEach(section => {
                        section.classList.add('hidden'); // Hide all sections
                    });

                    // Show the clicked section
                    targetElement.classList.remove('hidden');

                    // Smooth scrolling
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                } else {
                    console.error(`Section not found for target ID: ${targetId}`);
                }
            });
        });
    }
});

const menuItems = [
    {
        category: "Appetizers",
        items: [
            {
                name: "Kinilaw na Tanigue",
                description: "Fresh tanigue fish marinated in vinegar, coconut milk, and spices",
                price: 350,
                image: "../css/Appetizers/Kinilaw.jpg"
            },
            {
                name: "Pugon Baked Oysters",
                description: "Oysters baked in a wood-fired oven with garlic-butter sauce",
                price: 400,
                image: "../css/Appetizers/Pugon.jpg"
            },
            {
                name: "Chicharong Bulaklak",
                description: "Crispy pork ruffles served with spiced vinegar",
                price: 320,
                image: "../css/Appetizers/Bulaklak.jpg"
            },
            {
                name: "Sinuglaw",
                description: "Grilled pork belly mixed with fresh fish ceviche",
                price: 380,
                image: "../css/Appetizers/Sinuglaw.jpg"
            },
            {
                name: "Pritong Lumpiang Ubod",
                description: "Deep-fried spring rolls filled with heart of palm and shrimp",
                price: 300,
                image: "../css/Appetizers/Lumpiang Ubod.jpg"
            }
        ]
    },
    {
        category: "Main Dishes",
        items: [
            {
                name: "Grilled Liempo",
                description: "Grilled pork belly marinated in native herbs and served with sinamak vinegar",
                price: 380,
                image: "../css/Main Dishes/baboy.jpg"
            },
            {
                name: "Ilocos Bagnet",
                description: "A boiled, air-dried, then deep-fried slabs of pork belly to perfection.",
                price: 480,
                image: "../css/Main Dishes/bagnet.jpg"
            },
            {
                name: "Beef Kaldereta",
                description: "A rich, very filling meaty dish served on a bed of cooked rice",
                price: 320,
                image: "../css/Main Dishes/kaldereta.jpg"
            },
            {
                name: "Crispy Pata",
                description: "Crispy deep-fried pork knuckle served with soy-vinegar dipping sauce",
                price: 650,
                image: "../css/Main Dishes/pata.jpg"
            },
            {
                name: "Pochero",
                description: "Beef shank stew slow-cooked with fresh coconut water and native vegetables",
                price: 550,
                image: "../css/Main Dishes/pchero.jpg"
            }
        ]
    },
    {
        category: "Rice and Noodles",
        items: [
            {
                name: "Bringhe",
                description: "Traditional Filipino rice dish with glutinous rice, coconut milk, saffron, and chicken",
                price: 280,
                image: "../css/Rice and Noodles/Bringhe.jpg"
            },
            {
                name: "Aligue Fried Rice",
                description: "Fried rice infused with rich crab fat (aligue) and garlic, delivering a luxurious flavor in every bite.",
                price: 380,
                image: "../css/Rice and Noodles/Aligue Fried Rice.jpg"
            },
            {
                name: "Garlic Fried Rice",
                description: "Fragrant jasmine rice stir-fried with aromatic garlic and green onions, enhanced with a hint of soy sauce.",
                price: 220,
                image: "../css/Rice and Noodles/garlic fried rice.jpg"
            },
            {
                name: "Pancit Malabon",
                description: "Thick rice noodles topped with seafood, eggs, and flavorful shrimp sauce",
                price: 340,
                image: "../css/Rice and Noodles /pancit malabon.jpg"
            }
        ]
    },
    {
        category: "Seafood Specialties",
        items: [
            {
                name: "Crab in Coconut Milk",
                description: "Crab cooked in a rich coconut milk sauce",
                price: 280,
                image: "../css/Seafood Specialties/ginataang alimasag.jpg"
            },
            {
                name: "Shrimp in Tamarind Sauce",
                description: "Succulent shrimp cooked in a tangy tamarind sauce, offering a perfect balance of sweet and sour flavors.",
                price: 380,
                image: "../css/Seafood Specialties/hipon sa sampalok.jpg"
            },
            {
                name: "Grilled Squid",
                description: "Grilled squid marinated in a savory blend of spices, served tender and smoky, perfect as an appetizer or main dish.",
                price: 220,
                image: "../css/Seafood Specialties/inihaw na pusit.jpg"
            },
            {
                name: "Grilled Prawns",
                description: "Grilled prawns marinated and cooked to perfection, delivering a smoky flavor and succulent texture.",
                price: 340,
                image: "../css/Seafood Specialties/inihaw na sugpo.jpg"
            }
        ]
    },
    {
        category: "Vegetarian Dishes",
        items: [
            {
                name: "Fern Salad",
                description: "A refreshing salad made with tender fiddlehead ferns, tossed with tomatoes, onions, and a tangy dressing for a vibrant and healthy dish.",
                price: 280,
                image: "../css/Vegetarian Dishes/ensaladong pako.jpg"
            },
            {
                name: "Laing",
                description: "Taro leaves cooked in creamy coconut milk with spices and chili, creating a rich and flavorful dish with a hint of heat.",
                price: 380,
                image: "../css/Vegetarian Dishes/laing.jpg"
            },
            {
                name: "Ilocano Vegetable Stew",
                description: "A hearty mix of vegetables, including bitter melon, eggplant, and squash, sautéed with shrimp paste for a savory and nutritious dish.",
                price: 220,
                image: "../css/Vegetarian Dishes/pinakbet ilocano.jpg"
            },
            {
                name: "Eggplant Omelette",
                description: "Grilled eggplant mixed with beaten eggs and pan-fried until golden, offering a delicious and satisfying meal or side dish.",
                price: 340,
                image: "../css/Vegetarian Dishes/tortang talong.jpg"
            }
        ]
    },
    {
        category: "Desserts",
        items: [
            {
                name: "Bibingka",
                description: "A traditional Filipino rice cake made from rice flour and coconut milk, baked to perfection and topped with salted eggs and grated coconut.",
                price: 380,
                image: "../css/Desserts/Bibingka.jpg"
            },
            {
                name: "Leche Flan",
                description: "A rich and creamy custard topped with a smooth caramel sauce, offering a delightful balance of sweetness and texture.",
                price: 480,
                image: "../css/Desserts/Leche Flan.jpg"
            },
            {
                name: "Pastillas Cheesecake",
                description: "A unique twist on cheesecake, blending creamy cheese with the sweet flavors of pastillas, topped with a dusting of powdered sugar for a delightful treat.",
                price: 320,
                image: "../css/Desserts/pastillas chiskik.jpg"
            },
            {
                name: "Suman with Chocolate",
                description: "Sticky rice cake wrapped in banana leaves, served with a rich chocolate sauce for dipping, combining sweet and creamy flavors.",
                price: 650,
                image: "../css/Desserts/suman at tsokolit.jpg"
            },
            {
                name: "Ube Halaya Cheesecake",
                description: "A vibrant cheesecake infused with creamy ube (purple yam), creating a deliciously unique dessert with a hint of sweetness and a beautiful color.",
                price: 550,
                image: "../css/Desserts/Ube Halaya Cheesecake.jpg"
            }
        ]
    },
    {
        category: "Beverages",
        items: [
            {
                name: "Cookies and Cream Milkshake",
                description: "A creamy blend of vanilla ice cream, crushed cookies, and milk, topped with whipped cream for a delightful and indulgent treat.",
                price: 280,
                image: "../css/Beverages/Cookies and Cream Milkshake.jpg"
            },
            {
                name: "Dalandan Cooler",
                description: "A refreshing drink made from sweet dal andan (Philippine orange) juice, mixed with soda and served over ice, perfect for hot days.",
                price: 380,
                image: "../css/Beverages/Dalandan Cooler.jpg"
            },
            {
                name: "Kapeng Barako",
                description: "Strong and aromatic coffee made from Barako beans, known for its bold flavor and rich aroma, served hot or iced for a revitalizing experience.",
                price: 220,
                image: "../css/Beverages/Kapeng Barako.jpg"
            },
            {
                name: "Salabat Iced Tea",
                description: "A refreshing iced tea infused with ginger (salabat), offering a zesty and soothing flavor that’s perfect for any time of the day.",
                price: 340,
                image: "../css/Beverages/Salabat Iced Tea.jpg"
            }
        ]
    }
]; 

function populateMenu() {
    const sections = document.querySelectorAll('.section-header');

    menuItems.forEach(menuCategory => {
        const section = document.createElement('section');
        section.id = menuCategory.category.toLowerCase().replace(/\s+/g, '-') + '-section';
        section.classList.add('section-header');

        const heading = document.createElement('h3');
        heading.classList.add('appetizer');
        heading.textContent = menuCategory.category;

        const cardList = document.createElement('div');
        cardList.classList.add('card-list');

        menuCategory.items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;

            const title = document.createElement('h4');
            title.classList.add('card-title');
            title.textContent = item.name;

            const description = document.createElement('p');
            description.textContent = item.description;

            const cardPrice = document.createElement('div');
            cardPrice.classList.add('card-price');

            const priceDiv = document.createElement('div');
            priceDiv.classList.add('price');
            priceDiv.textContent = `Php ${item.price.toFixed(2)}`;

            const addBtn = document.createElement('i');
            addBtn.classList.add('fa-solid', 'fa-plus', 'add-btn');
            addBtn.setAttribute('data-name', item.name);
            addBtn.setAttribute('data-price', item.price);

            cardPrice.appendChild(priceDiv);
            cardPrice.appendChild(addBtn);
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(cardPrice);
            cardList.appendChild(card);
        });

        section.appendChild(heading);
        section.appendChild(cardList);
        document.querySelector('main').appendChild(section);
    });
}

// Call the function to populate the menu
populateMenu();