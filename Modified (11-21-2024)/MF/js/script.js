// Modal functionality
const modal = document.getElementById('customizeModal');
const closeModal = document.querySelector('.close');
const menuItems = document.querySelectorAll('.menu-item');
const productName = document.getElementById('productName');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        modal.style.display = 'block';
        productName.textContent = `Customize ${item.getAttribute('data-name')}`;
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal on outside click
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Confirm customization
document.getElementById('confirmCustomization').addEventListener('click', () => {
    modal.style.display = 'none';
    alert('Item has been added to your cart with customization.');
});
