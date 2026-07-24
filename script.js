const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";

let dogs = [];

const filters = [
  "breed",
  "size",
  "age",
  "sex",
  "energy",
  "children",
  "dogs",
  "cats"
];

const dogContainer = document.getElementById("dogContainer");
const dogCount = document.getElementById("dogCount");


async function loadDogs() {

  const response = await fetch(sheetURL);
  const csv = await response.text();

  const rows = csv.split("\n");

  const headers = rows[0]
    .split(",")
    .map(header => header.trim());


  dogs = rows.slice(1)
    .filter(row => row.trim() !== "")
    .map(row => {

      const values = row.split(",");

      let dog = {};

      headers.forEach((header, index) => {
        dog[header] = values[index]?.trim() || "";
      });

      return dog;

    });


  populateBreeds();
  displayDogs();

}



function populateBreeds(){

  const breedSelect = document.getElementById("breed");

  const breeds = [
    ...new Set(
      dogs.map(dog => dog.Breed)
      .filter(Boolean)
    )
  ];


  breeds.forEach(breed => {

    const option = document.createElement("option");

    option.value = breed;
    option.textContent = breed;

    breedSelect.appendChild(option);

  });

}



function displayDogs(){

  dogContainer.innerHTML = "";


  const results = dogs.filter(dog => {


    if(dog.Status && dog.Status.toLowerCase() !== "available"){
      return false;
    }


    return filters.every(filter => {


      const selected =
        document.getElementById(filter).value;


      if(selected === ""){
        return true;
      }


      const sheetValue =
        dog[filter.charAt(0).toUpperCase() + filter.slice(1)];


      return sheetValue === selected;


    });


  });



  dogCount.textContent =
  ${results.length} dog${results.length !== 1 ? "s" : ""} available;



  results.forEach(dog => {


    const card = document.createElement("div");

    card.className = "dog-card";


    card.innerHTML = `

    <img src="${dog.Photo}" alt="${dog.Name}">


    <div class="dog-info">

    <h2>${dog.Name}</h2>

    <p>${dog.Breed}</p>

    <span class="tag">${dog.Size}</span>
    <span class="tag">${dog.Age}</span>
    <span class="tag">${dog.Sex}</span>

    <br>

    <span class="tag">
    Energy: ${dog.Energy}
    </span>

    <span class="tag">
    Children: ${dog.Children}
    </span>

    <span class="tag">
    Dogs: ${dog.Dogs}
    </span>

    <span class="tag">
    Cats: ${dog.Cats}
    </span>


    <div class="profile-button">
    View ${dog.Name}'s Profile
    </div>


    </div>

    `;


    dogContainer.appendChild(card);


  });


}




function clearFilters(){

filters.forEach(filter => {

document.getElementById(filter).value = "";

});


displayDogs();

}



filters.forEach(filter => {

document
.getElementById(filter)
.addEventListener("change", displayDogs);

});


document
.getElementById("clearFilters")
.addEventListener("click", clearFilters);



loadDogs();
