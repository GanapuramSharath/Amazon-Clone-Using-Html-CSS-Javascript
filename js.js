const imgs=document.querySelectorAll('.header-slider ul img');
const prevs=document.querySelector('.prev');
const nexts=document.querySelector('.next');


let n=0;

function changeSlide(){
    for(let i=0;i<imgs.length;i++){
        imgs[i].style.display='none';
    }
    imgs[n].style.display='block'; 
}
changeSlide();

prevs.addEventListener('click', (e)=>{
if(n>0){
    n--;
}
else{
    n=imgs.length-1;
}
changeSlide();
})
nexts.addEventListener('click', (e)=>{
    if(n<imgs.length-1){
        n++;
    }
    else{
        n=0;
    }
    changeSlide();
    })

let imageIndex = 1;

function changeImageAndText() {
        const imageElement = document.getElementById('image');
        const textElement = document.getElementById('text');
    
        imageIndex++;
    
        if (imageIndex > 3) {
            imageIndex = 1;
        }
    
        // Change the image source and the corresponding text
        switch (imageIndex) {
            case 1:
                imageElement.src = 'image1.jpg';
                textElement.innerText = 'Roku Ultra LT Streaming Media Player 4K/HD/HDR w/ 4K HDMI Cabl';
                break;
            case 2:
                imageElement.src = 'image2.jpg';
                textElement.innerText = 'This is image 2 description.';
                break;
            case 3:
                imageElement.src = 'image3.jpg';
                textElement.innerText = 'This is image 3 description.';
                break;
        }
    }

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
// Search functionality
document.getElementById('search-btn').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value.trim();
    
    if (!query) {
        showSearchModal("Please enter a search query");
        return;
    }

    try {
        showLoadingIndicator();
        
        const response = await fetch('http://localhost:8000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, limit: 10 })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displaySearchResults(data.results);
        
    } catch (error) {
        showSearchModal(`Error: ${error.message}`);
    } finally {
        hideLoadingIndicator();
    }
});

// Display search results in a modal
function displaySearchResults(results) {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="search-modal-content">
            <span class="close-search-modal">&times;</span>
            <h2>Search Results</h2>
            <div class="search-results-container">
                ${results.length ? 
                    results.map(product => `
                        <div class="search-result-item">
                            <img src="${product.image || './images/placeholder.jpg'}" alt="${product.name}">
                            <div class="search-result-details">
                                <h3>${product.name}</h3>
                                ${product.category ? `<p class="category">${product.category}</p>` : ''}
                                <p class="description">${product.description}</p>
                                <p class="price">$${product.price?.toFixed(2) || 'N/A'}</p>
                                <button class="view-product">View Product</button>
                            </div>
                        </div>
                    `).join('') :
                    '<p>No results found. Try different keywords.</p>'
                }
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-search-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function showLoadingIndicator() {
    const loading = document.createElement('div');
    loading.className = 'loading-indicator';
    loading.innerHTML = '<div class="spinner"></div><p>Searching...</p>';
    loading.id = 'search-loading';
    document.body.appendChild(loading);
}

function hideLoadingIndicator() {
    const loading = document.getElementById('search-loading');
    if (loading) {
        document.body.removeChild(loading);
    }
}

function showSearchModal(message) {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="search-modal-content">
            <span class="close-search-modal">&times;</span>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-search-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});