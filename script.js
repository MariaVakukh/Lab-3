document.addEventListener('DOMContentLoaded', function () {
    /*     localStorage.clear(); */
        const list = document.querySelector(".list");
        const itemTemplate = document.getElementById("item-template").content.firstElementChild;
    
        const leftItems = document.querySelector(".left-items");
        const boughtItems = document.querySelector(".bought-items");
        const blItemTemplate = document.getElementById("product-template").content.firstElementChild;
    
        function saveItems(items) {
            localStorage.setItem('shoppingList', JSON.stringify(items));
        }
    
        function loadItems() {
            return JSON.parse(localStorage.getItem('shoppingList')) || [];
        }
    
        function addItem(title, initialAmount = 1, isBought = false) {
            const hr = document.createElement("hr");
    
            const node = itemTemplate.cloneNode(true);
            let amount = initialAmount;
    
            const itemName = node.querySelector(".name");
            itemName.textContent = title;
    
            const itemAmount = node.querySelector(".amount-left");
            itemAmount.textContent = amount;
    
            const leftItem = blItemTemplate.cloneNode(true);
            leftItem.querySelector(".product-name").textContent = title;
    
            const leftAmount = leftItem.querySelector(".amount");
            leftAmount.textContent = amount;
    
            const boughtItem = blItemTemplate.cloneNode(true);
            boughtItem.querySelector(".product-name").textContent = title;
            boughtItem.querySelector(".product-name").style.textDecoration = 'line-through';
    
            const boughtAmount = boughtItem.querySelector(".amount");
            boughtAmount.textContent = amount;
            boughtAmount.style.textDecoration = 'line-through';
            boughtItem.style.display = 'none';
    
            const plusButton = node.querySelector(".plus");
            const minusButton = node.querySelector(".minus"); 
    
            const statusButton = node.querySelector(".status");
            const delButton = node.querySelector(".delete");
    
            if (amount === 1) {
                minusButton.classList.replace("minus", "minus-off");
                minusButton.disabled = true;
            }    
    
            minusButton.addEventListener('click', function () {
                if (amount > 1) {
                    amount--;
                    itemAmount.textContent = leftAmount.textContent = boughtAmount.textContent = amount;
                    updateLocalStorage();
                }
            });
    
            plusButton.addEventListener('click', function () {
                amount++;
                itemAmount.textContent = leftAmount.textContent = boughtAmount.textContent = amount;
                minusButton.classList.replace("minus-off", "minus");
                minusButton.disabled = false;
                updateLocalStorage();
            });
    
            statusButton.addEventListener('click', function () {
                node.classList.toggle("is-bought");
                if (node.classList.contains("is-bought")) {
                    node.querySelector(".status").textContent = "Не куплено";
                    statusButton.setAttribute('data-tooltip', "Not bought");
                    leftItem.style.display = 'none';
                    boughtItem.style.display = 'block';
                } else {
                    node.querySelector(".status").textContent = "Куплено";
                    statusButton.setAttribute('data-tooltip', "Bought");
                    leftItem.style.display = 'block';
                    boughtItem.style.display = 'none';
                }
                updateLocalStorage();
            });
    
            delButton.addEventListener('click', function () {
                hr.remove();
                node.remove();
                leftItem.remove();
                boughtItem.remove();
                updateLocalStorage();
            });
    
            itemName.addEventListener('dblclick', function () {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = itemName.textContent;
                input.classList.add('text-field');
    
                input.addEventListener('blur', function () {
                    updateItemName(input.value);
                });
    
                input.addEventListener('keyup', function (e) {
                    if (e.key === 'Enter') {
                        updateItemName(input.value);
                    }
                });
    
                itemName.textContent = '';
                itemName.appendChild(input);
                input.focus();
            });
    
            function updateItemName(newName) {
                if (newName.trim()) {
                    itemName.textContent = newName;
                    leftItem.querySelector(".product-name").textContent = newName;
                    boughtItem.querySelector(".product-name").textContent = newName;
                    updateLocalStorage();
                } else {
                    itemName.textContent = title;
                }
            }
    
            list.append(hr);
            list.append(node);
            leftItems.appendChild(leftItem);
            boughtItems.appendChild(boughtItem);
    
            if (isBought) {
                node.classList.add("is-bought");
                node.querySelector(".status").textContent = "Не куплено";
                statusButton.setAttribute('data-tooltip', "Not bought");
                leftItem.style.display = 'none';
                boughtItem.style.display = 'block';
            }
        }
    
        function updateLocalStorage() {
            const items = [];
            document.querySelectorAll(".list .item").forEach(node => {
                const title = node.querySelector(".name").textContent;
                const amount = parseInt(node.querySelector(".amount-left").textContent);
                const isBought = node.classList.contains("is-bought");
                items.push({ title, amount, isBought });
            });
            saveItems(items);
        }
    
    
        const savedItems = loadItems();
        savedItems.forEach(item => addItem(item.title, item.amount, item.isBought));
    
        const newInput = document.querySelector(".add-iname");
        document.querySelector(".add").addEventListener('click', function () {
            const newName = newInput.value;
            if (newName) {
                addItem(newName);
                updateLocalStorage();
                newInput.value = "";
                newInput.focus();
            }
        });
    
        newInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                const newName = newInput.value.trim();
                if (newName) {
                    addItem(newName);
                    updateLocalStorage();
                    newInput.value = "";
                    newInput.focus();
                }
            }
        });
    });
    