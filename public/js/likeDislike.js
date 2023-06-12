
function GetTopLikedArticle(id) {
  const tagElement = document.querySelector(`#${id}`);
  const n = tagElement.getAttribute("data-top-number");
  if (n>0) {
    fetch(`/topLiked/${n}`, {
      method: 'GET',
    })
    .then(res => {
      res.json().then((a) => {
        let html=`<h4>Top ${n} Liked Destination`;
        a.forEach(article => {
          html+=`<div class="container article-world ${article.klass}" id="${article._id}">
              <a href="/destination/${article._id}">
                <h2 class="article-title">${article.title}</h2>
                <img class="image" src="${article.imageUrl}" alt="${article.imageText}">
              </a>
              <div>
              <span id="like-count-${article._id}">${article.likes}</span> likes,
              <span id="dislike-count-${article._id}">${article.dislikes}</span> dislikes
              </div>
            </div>`;
        });
        tagElement.innerHTML=html;
      });
    })
    .catch(err => {
      tagElement.innerHTML=`Can't get top ${n} liked destination`;
      console.error('func:GetTopLikedArticle: Error geting top liked articles:', err);
    });
  } else {
    tagElement.innerHTML=`You must provide number of top liked destination!`
  }
}

function like (articleId) {
    // Send AJAX POST request to the like action route
    fetch(`/like/${articleId}`, {
        method: 'POST',
    })
        .then(response => {
            if (response.ok) {
                // Update the like count in the DOM
                const likeCountSpan = document.querySelector(`.center #like-count-${articleId}`);
                likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
                GetTopLikedArticle("top-rated");
            } else {
                console.error('Error updating like count:', response.status);
            }
        })
        .catch(error => {
            console.error('Error updating like count:', error);
        });
}

function dislike(articleId) {
  // Send AJAX POST request to the dislike action route
  fetch(`/dislike/${articleId}`, {
    method: 'POST',
  })
    .then(response => {
      if (response.ok) {
        // Update the dislike count in the DOM
        const dislikeCountSpan = document.querySelector(`.center #dislike-count-${articleId}`);
        dislikeCountSpan.textContent = parseInt(dislikeCountSpan.textContent) + 1;
        GetTopLikedArticle("top-rated");
      } else {
        console.error('Error updating dislike count:', response.status);
      }
    })
    .catch(error => {
      console.error('Error updating dislike count:', error);
    });
}

const SaveArticleElement = document.querySelector("#form-save-article");
if (SaveArticleElement) {
  SaveArticleElement.addEventListener('submit', (e) => {
      e.preventDefault();
    });
}

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