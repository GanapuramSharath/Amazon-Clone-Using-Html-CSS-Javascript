document.getElementById('imageSelection').addEventListener('click', function(event) {
    if (event.target.tagName === 'IMG') {
        // Remove the 'selected' class from any previously selected thumbnail
        const previouslySelected = document.querySelector('.thumbnail.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }

        // Add the 'selected' class to the clicked thumbnail
        event.target.classList.add('selected');

        // Update the main image and description
        const mainImage = document.getElementById('mainImage');
        const mainText = document.getElementById('mainText');
        
        mainImage.src = event.target.src;
        mainText.innerText = event.target.getAttribute('data-description');
    }
});

