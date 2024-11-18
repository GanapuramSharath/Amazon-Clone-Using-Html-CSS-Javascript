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
    