
window.like = (articleId) => {
    // Send AJAX POST request to the like action route
    fetch(`/like/${articleId}`, {
        method: 'POST',
    })
        .then(response => {
            if (response.ok) {
                // Update the like count in the DOM
                const likeCountSpan = document.getElementById(`like-count-${articleId}`);
                likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
            } else {
                console.error('Error updating like count:', response.status);
            }
        })
        .catch(error => {
            console.error('Error updating like count:', error);
        });
}

window.dislike =(articleId) => {
  // Send AJAX POST request to the dislike action route
  fetch(`/dislike/${articleId}`, {
    method: 'POST',
  })
    .then(response => {
      if (response.ok) {
        // Update the dislike count in the DOM
        const dislikeCountSpan = document.getElementById(`dislike-count-${articleId}`);
        dislikeCountSpan.textContent = parseInt(dislikeCountSpan.textContent) + 1;
      } else {
        console.error('Error updating dislike count:', response.status);
      }
    })
    .catch(error => {
      console.error('Error updating dislike count:', error);
    });
}