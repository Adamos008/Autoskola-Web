const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-links a');

if (mobileMenuBtn && mainNav) {
    // Otevření / zavření menu kliknutím na ikonu
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active'); // Otevře samotné menu
        mobileMenuBtn.classList.toggle('menu-open'); // Přepne ikonku (hamburger <-> křížek)
    });

    // Zavření menu po kliknutí na jakýkoliv odkaz (když uživatel někam přejde)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('menu-open');
        });
    });
}

const filterButtons = document.querySelectorAll('.filter-btn');
const pricingCards = document.querySelectorAll('.pricing-card');
const showMoreContainer = document.getElementById('show-more-container');
const showMoreBtn = document.getElementById('show-more-btn');
const showLessBtn = document.getElementById('show-less-btn'); // Nové tlačítko
const pricingGrid = document.querySelector('.pricing-grid');

    // Chytřejší výpočet počtu sloupců (jak jsme ho nastavili minule)
    function getMaxVisibleCards() {
        if (!pricingGrid) return 6;
        
        const gridColumnsStyle = window.getComputedStyle(pricingGrid).getPropertyValue('grid-template-columns');
        const columnsCount = gridColumnsStyle.split(' ').length;
        
        return columnsCount === 1 ? 3 : columnsCount * 2;
    }

    // Hlavní funkce pro aktualizaci zobrazených karet
    function updateCards(filterValue) {
        const MAX_VISIBLE_CARDS = getMaxVisibleCards();
        let visibleCount = 0;

        pricingCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            card.classList.remove('fade-in-up');

            if (filterValue === 'vse' || filterValue === cardCategory) {
                visibleCount++;
                
                if (visibleCount > MAX_VISIBLE_CARDS) {
                    card.classList.add('hidden-card');
                    card.style.display = 'none';
                } else {
                    card.classList.remove('hidden-card');
                    card.style.display = 'flex';
                }
            } else {
                card.classList.remove('hidden-card');
                card.style.display = 'none';
            }
        });

        // Tlačítkový management
        if (visibleCount > MAX_VISIBLE_CARDS) {
            showMoreContainer.style.display = 'block';
            showMoreBtn.style.display = 'inline-flex';
            showLessBtn.style.display = 'none';
        } else {
            showMoreContainer.style.display = 'none';
        }
    }

    if (filterButtons.length > 0 && pricingCards.length > 0) {
        
        // Inicializace
        updateCards('vse');

        // Kliknutí na filtry
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                updateCards(filterValue);
            });
        });

        // Kliknutí na "Zobrazit další kurzy"
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', () => {
                const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                let delay = 0;

                pricingCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (activeFilter === 'vse' || activeFilter === cardCategory) {
                        if (card.classList.contains('hidden-card')) {
                            card.classList.remove('hidden-card');
                            card.style.display = 'flex';
                            
                            setTimeout(() => {
                                card.classList.add('fade-in-up');
    
                                setTimeout(() => {
                                    card.classList.remove('fade-in-up');
                                }, 500);
    
                            }, delay);
                            delay += 50; 
                        }
                    }
                });
                
                // Skryjeme tlačítko "více" a ukážeme "méně"
                showMoreBtn.style.display = 'none';
                showLessBtn.style.display = 'inline-flex';
            });
        }

        // Kliknutí na "Zobrazit méně"
        if (showLessBtn) {
            showLessBtn.addEventListener('click', () => {
                const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                
                // Znovu zavoláme updateCards, což automaticky ořízne seznam zpět na 2 řady a přehodí tlačítka
                updateCards(activeFilter);
                
                // Jemné odrolování nahoru k nadpisu ceníku
                const ceníkSekce = document.getElementById('cenik');
                if (ceníkSekce) {
                    ceníkSekce.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

const modal = document.getElementById('course-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.getElementById('modal-close-btn');

const moreInfoButtons = document.querySelectorAll('.btn-more-info');

moreInfoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const card = btn.closest('.pricing-card');
        
        const hiddenData = card.querySelector('.course-hidden-data');
        
        if (hiddenData) {
            modalBody.innerHTML = hiddenData.innerHTML;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});