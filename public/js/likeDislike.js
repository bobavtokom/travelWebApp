
const GetTopLikedArticle = n => {
  fetch(`/topLiked/${n}`, {
    method: 'GET',
  })
  .then(res => {
      return res.json();
  })
  .catch(err => {
    console.error('Error geting top liked article:', err);
  });
}

const like = (articleId) => {
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

const dislike =(articleId) => {
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

document.querySelector("#form-save-article").addEventListener('submit', (e) => {
  e.preventDefault();
});

function SaveArticle(element) {
  document.querySelector("#form-save-article").submit();
}

function NewArticle(element) {
  const rootElement= element.parentElement.parentElement.parentElement;
  rootElement.querySelector("#_id").value=0;
  rootElement.querySelector("#title").value="";
  rootElement.querySelector("#imageUrl").value="";
  rootElement.querySelector("#description").value="";
  rootElement.querySelector("#likes").value="0";
  rootElement.querySelector("#dislikes").value="0";
  rootElement.parentElement.parentElement.querySelector("#save-article-image").src="";
  rootElement.parentElement.parentElement.querySelector("#save-article-image").alt="";
}

function DeleteArticle(element) {
  const articleId = element.getAttribute("data-article-id");
  if (confirm(`Are you sure you want to delete this article?\n\nid: ${articleId}`)) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/delete-article/"+articleId, true);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          const tekst = `Successfully deleted article with ID: ${this.responseText}`;
          alert(tekst);
          window.location='/display';
        }
      }
    }
    xhttp.send();
  }
}

function LoadImageInArticle(element) {
  const imageElement = element.parentElement.parentElement.parentElement.parentElement.querySelector("#save-article-image");
  imageElement.src = element.value;
}

function ResetLikes(element) {
  if (element.value==="Reset") {
    element.parentElement.querySelector("#likes").value="0";
    element.value="Undo";
  } else {
    element.parentElement.querySelector("#likes").value=element.getAttribute("data-likes");
    element.value="Reset";
  }
}

function ResetDislikes(element) {
  if (element.value==="Reset") {
    element.parentElement.querySelector("#dislikes").value="0";
    element.value="Undo";
  } else {
    element.parentElement.querySelector("#dislikes").value=element.getAttribute("data-dislikes");
    element.value="Reset";
  }
}