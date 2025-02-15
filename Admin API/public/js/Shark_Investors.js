function filterCards() {
    const searchValue = document.getElementById('searchBar').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      const name = card.getAttribute('data-name').toLowerCase();
      if (name.includes(searchValue)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
  