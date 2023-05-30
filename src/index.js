let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyCollection = document.querySelector("#toy-collection");

  // FETCH - FROM CURRENT DB
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((data) => {
      const toys = data;

      // DISPLAY TOYS - FROM CURRENT DB
      toys.forEach((toy) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const name = document.createElement("h2");
        name.textContent = toy.name;

        const image = document.createElement("img");
        image.src = toy.image;
        image.classList.add("toy-avatar");

        const likes = document.createElement("p");
        likes.textContent = `${toy.likes} Likes`;

        const button = document.createElement("button");
        button.classList.add("like-btn");
        button.dataset.id = toy.id;
        button.textContent = "Like ❤️";

        card.appendChild(name);
        card.appendChild(image);
        card.appendChild(likes);
        card.appendChild(button);

        toyCollection.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  const toyForm = document.querySelector(".add-toy-form");

  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.querySelector("#toy-name").value;
    const imageInput = document.querySelector("#toy-image").value;

    const newToy = {
      name: nameInput,
      image: imageInput,
      likes: 0,
    };

    // CREATE A NEW TOY
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((data) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const name = document.createElement("h2");
        name.textContent = data.name;

        const image = document.createElement("img");
        image.src = data.image;
        image.classList.add("toy-avatar");

        const likes = document.createElement("p");
        likes.textContent = `${data.likes} Likes`;

        const button = document.createElement("button");
        button.classList.add("like-btn");
        button.dataset.id = data.id;
        button.textContent = "Like ❤️";

        card.appendChild(name);
        card.appendChild(image);
        card.appendChild(likes);
        card.appendChild(button);

        toyCollection.appendChild(card);

        toyForm.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  //  LIKES
  toyCollection.addEventListener("click", (event) => {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.dataset.id;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          likes: parseInt(event.target.previousElementSibling.textContent) + 1,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          event.target.previousElementSibling.textContent = `${data.likes} Likes`;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
});
