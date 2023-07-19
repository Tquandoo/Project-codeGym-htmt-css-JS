
// Project
document.addEventListener("DOMContentLoaded", function() {
  let instagramLink = document.querySelector(".fa-brands.fa-instagram a");
  let facebookLink = document.querySelector(".fa-brands.fa-facebook a");
  let handleLinkClick=function(envet){
      let link = this.href
      window.location.href = link; 
  };
  instagramLink.addEventListener("click", handleLinkClick)
  facebookLink.addEventListener("click", handleLinkClick);
});
class Drink {
  constructor(id, img, name, description, price) {
    this.id = id;
    this.img = img;
    this.name = name;
    this.description = description;
    this.price = price;
  }
}

class Cart {
  constructor(drinks) {
    this.listCards = [];
    this.cartQuantity = 0;
    this.total = document.querySelector('.card__total');
    this.quantity = document.querySelector('.quantity');
    this.listCard = document.querySelector('.card__listCard');
    this.drinks = drinks;
    this.currentPage = 1;
    this.itemsPerPage = 6;
    this.currentId = drinks.length + 1;
  }

  displayDrink() {
    this.loadItem();
    this.listPage();
  }

  calculateElementIndexInCurrentPage(id) {
    const beginGet = this.itemsPerPage * (this.currentPage - 1);
    const selectedProductIndex = this.drinks.findIndex((product) => product.id === id);
    return selectedProductIndex - beginGet;
  }

  loadItem() {
    let beginGet = this.itemsPerPage * (this.currentPage - 1);
    let endGet = Math.min(this.currentPage * this.itemsPerPage, this.drinks.length);
    let str = '';

    for (let i = beginGet; i < endGet; i++) {
      let p = this.drinks[i];
      str += `<div class="list__card">
          <div class="list__card-img">
              <img src="${p.img}">
          </div>
          <div class="list__card-content">
            <div class="list__card-content-title">${p.name}</div>
            <div class="list__card-content-des">${p.description}</div>
            <div class="list__card-content-price">${this.formatPrice(p.price)}</div>
            <input type="number" class="count" min="1" value="1">
            <button class="list__card-content-add" onclick="card.addToCart(${p.id})">Add to cart</button>
          </div>
      </div>`;
    }
    document.getElementById('list').innerHTML = str;
  }

  listPage() {
    let countPage = Math.ceil(this.drinks.length / this.itemsPerPage);
    let listPageContainer = document.querySelector('.listPage');
    listPageContainer.innerHTML = '';

    if (this.currentPage !== 1) {
      let prev = document.createElement('li');
      prev.innerText = '<';
      prev.setAttribute('onclick', `card.changePage(${this.currentPage - 1})`);
      listPageContainer.appendChild(prev);
    }

    for (let i = 1; i <= countPage; i++) {
      let newPage = document.createElement('li');
      newPage.innerText = i;
      if (i === this.currentPage) {
        newPage.classList.add('activePage');
      }
      newPage.addEventListener('click', () => {
        this.changePage(i);
      });
      listPageContainer.appendChild(newPage);
    }

    if (this.currentPage !== countPage) {
      let next = document.createElement('li');
      next.innerText = '>';
      next.setAttribute('onclick', `card.changePage(${this.currentPage + 1})`);
      listPageContainer.appendChild(next);
    }
  }

  changePage(page) {
    this.currentPage = page;
    this.loadItem();
    this.listPage();
  }

  addToCart(id) {
    console.log("Selected id:", id);

    // Tạo truy vấn dựa vào trang hiện tại
    const listItemIndex = this.calculateElementIndexInCurrentPage(id);

    // Kiểm tra xem phần tử .list__card có tồn tại trong DOM hay không
    const listItem = document.querySelector(`#list .list__card:nth-child(${listItemIndex + 1})`);
    if (!listItem) {
      console.error("Không tìm thấy phần tử .list__card có id đã chọn trong trang hiện tại.");
      return;
    }

    // Kiểm tra xem phần tử .count có tồn tại trong DOM hay không
    const selectedQuantityElement = listItem.querySelector('.count');
    if (!selectedQuantityElement) {
      console.error("Không tìm thấy phần tử .count trong phần tử .list__card đã chọn.");
      return;
    }

    const selectedQuantity = parseInt(selectedQuantityElement.value);

    if (isNaN(selectedQuantity) || selectedQuantity <= 0) {
      alert("Vui lòng nhập số lượng hợp lệ.");
      return;
    }

    // Tiếp tục xử lý như trước đó
    const selectedProductIndex = this.listCards.findIndex((product) => product.id === id);
    if (selectedProductIndex !== -1) {
      // Sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
      this.listCards[selectedProductIndex].quantity += selectedQuantity;
    } else {
      const selectedProduct = this.drinks.find((product) => product.id === id);
      this.listCards.push({
        id: selectedProduct.id,
        img: selectedProduct.img,
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        quantity: selectedQuantity,
      });
    }

    this.cartQuantity += selectedQuantity;
    this.quantity.textContent = this.cartQuantity;
    console.log("Updated cart quantity:", this.cartQuantity);

    this.reloadCard();
  }
  reloadCard() {
    this.listCard.innerHTML = "";
    let count = 0;
    let totalPrice = 0;
  
    this.listCards.forEach((value, index) => { 
      totalPrice += value.price * value.quantity;
      count += value.quantity;
  
      if (value != null) {
        const newDiv = document.createElement('li');
        newDiv.innerHTML = `
          <div class="card__image">
            <img src="${value.img}" />
          </div>
          <div>${value.name}</div>
          <div>${this.formatPrice(value.price * value.quantity)}</div>
          <div class="total__count">
            <button class="count__button" onclick="card.changeQuantity(${index}, ${value.quantity - 1})">-</button>
            <div class="count">${value.quantity}</div>
            <button class="count__button" onclick="card.changeQuantity(${index}, ${value.quantity + 1})">+</button>
          </div>`;
        this.listCard.appendChild(newDiv);
      }
    });
  
    this.total.textContent = this.formatPrice(totalPrice);
  }
  
  changeQuantity(index, quantity) { // Thay thế tham số id bằng index
    if (index < 0 || index >= this.listCards.length) {
      console.error("Index không hợp lệ.");
      return;
    }
  
    if (quantity === 0) {
      this.listCards.splice(index, 1);
    } else {
      this.listCards[index].quantity = quantity;
    }
  
    let cartQuantity = 0;
    this.listCards.forEach((product) => {
      cartQuantity += product.quantity;
    });
  
    this.cartQuantity = cartQuantity;
    this.quantity.textContent = cartQuantity.toString();
    this.reloadCard();
  }

  formatPrice(price) {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    });
    return formatter.format(price);
  }
}
// tạo chức năng

  let drinks = [
    new Drink(1, "assets/img1.png", "Product name 1", "Lorem ipsum dolor sit amet", 120000),
    new Drink(2, "assets/img2.png", "Product name 2", "Lorem ipsum dolor sit amet", 130000),
    new Drink(3, "assets/img3.png", "Product name 3", "Lorem ipsum dolor sit amet", 90000),
    new Drink(4, "assets/img4.png", "Product name 4", "Lorem ipsum dolor sit amet", 100000),
    new Drink(5, "assets/img3.png", "Product name 5", "Lorem ipsum dolor sit amet", 150000),
    new Drink(6, "assets/img3.png", "Product name 6", "Lorem ipsum dolor sit amet", 175000),
    new Drink(7, "assets/img2.png", "Product name 7", "Lorem ipsum dolor sit amet", 140000),
    new Drink(8, "assets/img3.png", "Product name 8", "Lorem ipsum dolor sit amet", 120000),
    new Drink(9, "assets/img2.png", "Product name 9", "Lorem ipsum dolor sit amet", 160000),
    new Drink(10, "assets/img4.png", "Product name 10", "Lorem ipsum dolor sit amet", 13500),
    new Drink(11, "assets/img1.png", "Product name 11", "Lorem ipsum dolor sit amet", 150000),
    new Drink(12, "assets/img3.png", "Product name 12", "Lorem ipsum dolor sit amet", 147000),
    new Drink(13, "assets/img2.png", "Product name 13", "Lorem ipsum dolor sit amet", 139000),
    new Drink(14, "assets/img4.png", "Product name 14", "Lorem ipsum dolor sit amet", 120000),
    new Drink(15, "assets/img2.png", "Product name 15", "Lorem ipsum dolor sit amet", 149000),
    new Drink(16, "assets/img3.png", "Product name 16", "Lorem ipsum dolor sit amet", 147000),
    new Drink(17, "assets/img1.png", "Product name 17", "Lorem ipsum dolor sit amet", 155000),
    new Drink(18, "assets/img4.png", "Product name 18", "Lorem ipsum dolor sit amet", 175000)
  ];

  const card = new Cart(drinks);
  card.displayDrink();
  initializeCart();

    // mở đóng cart
    let openShopping = document.querySelector('.shopping');
    let closeShopping = document.querySelector('.card__closeShopping');
    let cardContainer= document.querySelector('.card');
    openShopping.addEventListener('click', () => {
      openShopping.classList.add('active');
      document.getElementById("card_1").style.display="block";
    });
    closeShopping.addEventListener('click', (event) => {
      event.stopPropagation();
      openShopping.classList.remove('active');
      card_1.style.display = 'none';
    });
    function closeCart() {
      openShopping.classList.remove('active');
      card_1.style.display = 'none';
    }
    closeShopping.addEventListener('click', closeCart);

    // thanh toán
    function payment() {
      if(card.total.textContent == "0"){
      alert("Please update your shopping cart: ");
      }else{
      alert("Successful invoice payment: "+ card.total.textContent);
      }
      card.listCards = [];   
      card.quantity.textContent = "0";
      card.cartQuantity = 0;
      card.reloadCard();
    }
    function logout() {
      window.location.replace("login.html");
      }
      // add item to menu

  let btnOpen = document.querySelector('.buttonAdd');
  let modal = document.querySelector('.modal');
  let iconClose = document.querySelector('.modal__header i');
  let btnSaveChanges = document.querySelector('.modal__footer button.btn-primary');
  let btnClose = document.querySelector('.modal__footer button.btn-secondary');
  function showModal() {
      modal.style.display = "block";
  }
  function hideModal() {
      modal.style.display = "none";
  }
  btnOpen.addEventListener('click', () => {
      showModal(); // Hiển thị modal khi click vào nút Open
  });
  iconClose.addEventListener('click', () => {
      hideModal(); // Ẩn modal khi click vào icon trong modal header
  });
  btnSaveChanges.addEventListener('click', () => {
      hideModal(); 
  });

  btnClose.addEventListener('click', () => {
      hideModal(); 
  });
 
  function showNotification() {
      const notification = document.querySelector('.toast');
      notification.style.display = 'flex';

      setTimeout(() => {
          notification.style.display = 'none';
      }, 2000); 
  }
  const saveChangesBtn = document.querySelector('.modal__footer .btn-primary');
  saveChangesBtn.addEventListener('click', () => {
      showNotification(); 
  });
  function addItemToMenu() {
    let link = document.getElementById('link-drink').value;
    let name = document.getElementById('name-drink').value;
    let des = document.getElementById('describe-drink').value;
    let price = parseInt(document.getElementById('price-drink').value);

    if (!link || !name || !des || isNaN(price) || price <= 0) {
      alert("Vui lòng điền đầy đủ thông tin và giá tiền hợp lệ.");
      return;
    }
    const newProduct = new Drink(card.drinks.length + 1, link, name, des, price); // Cập nhật id cho sản phẩm mới
    card.drinks.push(newProduct);
    card.changePage(Math.ceil(card.drinks.length / card.itemsPerPage));
    card.reloadCard();
    localStorage.setItem('drinks', JSON.stringify(card.drinks));
  }
  function initializeCart() {
    // Kiểm tra xem có dữ liệu trong localStorage hay không
    const savedDrinks = localStorage.getItem('drinks');
    if (savedDrinks) {
      card.drinks = JSON.parse(savedDrinks);
      card.currentId = card.drinks.length + 1;
    }
  }




 // reloadCard() {
  //   this.listCard.innerHTML = "";
  //   let count = 0;
  //   let totalPrice = 0;

  //   this.listCards.forEach((value) => {
  //     totalPrice += value.price * value.quantity;
  //     count += value.quantity;

  //     if (value != null) {
  //       const newDiv = document.createElement('li');
  //       newDiv.innerHTML = `
  //         <div class="card__image">
  //           <img src="${value.img}" />
  //         </div>
  //         <div>${value.name}</div>
  //         <div>${this.formatPrice(value.price * value.quantity)}</div>
  //         <div class="total__count">
  //           <button class="count__button" onclick="card.changeQuantity(${value.id}, ${value.quantity - 1})">-</button>
  //           <div class="count">${value.quantity}</div>
  //           <button class="count__button" onclick="card.changeQuantity(${value.id}, ${value.quantity + 1})">+</button>
  //         </div>`;
  //       this.listCard.appendChild(newDiv);
  //     }
  //   });

  //   this.total.textContent = this.formatPrice(totalPrice);
  // }

  // changeQuantity(id, quantity) {
  //   if (id < 0 || id >= this.listCards.length) {
  //     console.error("Id không hợp lệ.");
  //     return;
  //   }

  //   if (quantity === 0) {
  //     this.listCards.splice(id, 1);
  //   } else {
  //     this.listCards[id].quantity = quantity;
  //   }

  //   let cartQuantity = 0;
  //   this.listCards.forEach((product) => {
  //     cartQuantity += product.quantity;
  //   });

  //   this.cartQuantity = cartQuantity;
  //   this.quantity.textContent = cartQuantity.toString();
  //   this.reloadCard();
  // }
    
    // chuyển hướng pagination
/* phân trang
    page 1: 0-5;
    page 2: 6-11;
    page 3: 12-17;
*/

  // let thisPage = 1;
  // let limit =6;
  // let list = document.querySelectorAll('#list .list__card');
  // function loadItem() {
  //   let beginGet = limit * (thisPage - 1);
  //   let endGet = Math.min(thisPage * limit, card.drinks.length); 
  //   list.forEach((card, key) => {
  //     if (key >= beginGet && key < endGet) { 
  //       card.style.display = "block";
  //     } else {
  //       card.style.display = "none";
  //     }
  //   });
  //   listPage();
  // }
  // loadItem();
  

  // function listPage() {
  //   let countPage = Math.ceil(list.length / limit);
  //   let listPageContainer = document.querySelector(".listPage");
  //   listPageContainer.innerHTML = "";
  //   if(thisPage!=1){
  //     let prev = document.createElement('li');
  //     prev.innerText = "<";
  //     prev.setAttribute("onclick", "changePage(" + (thisPage - 1) + ")");
  //     listPageContainer.appendChild(prev);
  //     }
  //   for (let i = 1; i <= countPage; i++) {
  //     let newPage = document.createElement('li');
  //     newPage.innerText = i;
  //     if (i === thisPage) {
  //       newPage.classList.add('activePage');
  //     }
  //     newPage.addEventListener("click", function() {
  //         changePage(i);
  //     });
  //     listPageContainer.appendChild(newPage);
  //   }
  //   if (thisPage !== countPage) {
  //     let next = document.createElement("li");
  //     next.innerText = ">";
  //     next.setAttribute("onclick", "changePage(" + (thisPage + 1) + ")");
  //     listPageContainer.appendChild(next);
  //   }
  // }

  // function changePage(i) {
  //   thisPage = i;
  //   loadItem();
  // }
 











 





