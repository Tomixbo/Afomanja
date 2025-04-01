document.addEventListener("DOMContentLoaded", function () {
    const scroll = new LocomotiveScroll({
        el: document.querySelector("[data-scroll-container]"),
        smooth: true
    });

    // Sélectionne toutes les sections ayant data-scroll-section
    const sections = document.querySelectorAll("[data-scroll-section]");
    
    sections.forEach((section, index) => {
        // Ajoute une animation ou un effet à chaque section
        section.addEventListener("mouseenter", function() {
            console.log(`Entrée dans la section ${index + 1}`);
        });
    });

    let currentSection = 0;
    
    // window.addEventListener("wheel", (event) => {
    //     if (event.deltaY > 0 && currentSection < sections.length - 1) {
    //         currentSection++;
    //     } else if (event.deltaY < 0 && currentSection > 0) {
    //         currentSection--;
    //     }

    //     scroll.scrollTo(sections[currentSection], {
    //         duration: 800, // Durée du défilement
    //         easing: [0.25, 0.1, 0.25, 1], // Animation fluide
    //         offset: 0
    //     });
    // });
});
