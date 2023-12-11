const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

function showOverlay(imageSrc, message, buttonLink, buttonText) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const overlayContent = document.createElement('div');
    overlayContent.classList.add('overlay-content');

    const overlayWrapper = document.createElement('div');
    overlayWrapper.classList.add('overlay-wrapper');

    const image = document.createElement('img');
    image.src = imageSrc;
    image.alt = message;
    image.width = "200";
    image.height = "300";

    const text = document.createElement('p');
    text.innerText = message;
    text.style.color = "#008000"
    if(buttonLink && buttonText) {
        text.style.color = "#8B0000"
    }
    

    overlayWrapper.appendChild(image);
    overlayWrapper.appendChild(text);

    if (buttonLink && buttonText) {
        const button = document.createElement('a');
        button.href = buttonLink;
        button.innerText = buttonText;
        button.classList.add('button');
        button.style.width = '60%';
        overlayWrapper.appendChild(button);
    }

    overlayContent.appendChild(overlayWrapper);
    overlay.appendChild(overlayContent);

    document.body.appendChild(overlay);
     // Add an event listener to close the overlay when clicking outside it
     document.addEventListener('click', function closeOverlay(e) {
        if (!overlay.contains(e.target)) {
            document.body.removeChild(overlay);
            document.removeEventListener('click', closeOverlay);
        }
    });
}

function selectImage() {
    const imageInput = document.getElementById('imageInput');

    // Trigger a click event on the hidden file input
    imageInput.click();

    // Add an event listener to handle the selected image
    imageInput.addEventListener('change', function () {
        const selectedImage = imageInput.files[0];
        if (selectedImage) {
            // Create a FormData object to send the image
            const formData = new FormData();
            formData.append('image', selectedImage);

            // Replace the URL with your API endpoint
            const apiUrl = '/uploadImage';

            // Send a POST request to the API
            fetch(apiUrl, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Handle the API response data
                console.log('API response:', data);

                // Display the response using overlay pages instead of alerts
                if (data.result) {
                    var resultstr = data.result + "";
                    console.log(typeof resultstr);
                    console.log(resultstr);
                    // Redirect to different overlay pages based on the API response
                    if (resultstr === "Pneumonia Detected") {
                        showOverlay('/static/images/pneumonia_detected_image.jpg', 'Pneumonia detected! Please book a consultation with a doctor.', 'https://www.practo.com/bangalore/pulmonologist', 'Book Consultation');
                    } else {
                        showOverlay('/static/images/happy_image.jpg', 'No pneumonia detected. Stay healthy!');
                    }
                } else if (data.error) {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
}

function selectImageCarotid() {
    const imageInput = document.getElementById('imageInput');

    // Trigger a click event on the hidden file input
    imageInput.click();

    // Add an event listener to handle the selected image
    imageInput.addEventListener('change', function () {
        const selectedImage = imageInput.files[0];
        if (selectedImage) {
            // Create a FormData object to send the image
            const formData = new FormData();
            formData.append('image', selectedImage);

            // Replace the URL with your API endpoint
            const apiUrl = '/uploadImage';

            // Send a POST request to the API
            fetch(apiUrl, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Handle the API response data
                console.log('API response:', data);

                // Display the response using overlay pages instead of alerts
                if (data.result) {
                    var resultstr = data.result + "";
                    console.log(typeof resultstr);
                    console.log(resultstr);
                    // Redirect to different overlay pages based on the API response
                    if (resultstr === "Pneumonia Detected") {
                        showOverlay('/static/images/carotid.jpg', 'Carotid artery thining detected! Please book a consultation with a doctor.', 'https://www.practo.com/bangalore/cardiologist', 'Book Consultation');
                    } else {
                        showOverlay('/static/images/happy_image.jpg', 'Carotid Artery is healthy!');
                    }
                } else if (data.error) {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
}