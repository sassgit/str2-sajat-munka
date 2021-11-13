const gameDiv = document.querySelector("#game");
    let cardCount = 100;
    const cards = [];
    const cardImg = [];
    const createDiv = (...classnames) => {
      const div = document.createElement('div');
      if (classnames.length)
      div.classList.add(...classnames);
      return div;
    }
    


    const createCards = (count) => {
    for (let i = 0;i<count;i++) {
      const card = createDiv('card');
      const cardInner = createDiv('card-inner');
      const cardFront = createDiv('card-front');
      const imageWrapper = createDiv('image-wrapper');
      const img = document.createElement('img');
      const cardBack = createDiv('card-back');
      img.src = 'assets/cardimages/image001.png';
      imageWrapper.appendChild(img);
      cardFront.appendChild(imageWrapper);
      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);
      gameDiv.appendChild(card);
      cards.push(card);
      cardImg.push(img);
    }
  }

  const init = () => {
    createCards(cardCount);
  }

  init();