const dogs = [

{
name: "Bella",
breed: "Labrador Cross",
size: "Medium",
age: "Adult",
sex: "Female",
energy: "Medium",
children: "Yes",
dogs: "Yes",
cats: "No",
image: "https://images.unsplash.com/photo-1552053831-71594a27632d",
description: "Bella is a loving and friendly Labrador Cross looking for her forever home.",
idealHome: "A family home with time for walks, attention and companionship."
},

{
name: "Max",
breed: "Staffordshire Bull Terrier",
size: "Medium",
age: "Adult",
sex: "Male",
energy: "High",
children: "Yes",
dogs: "No",
cats: "No",
image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6",
description: "Max is an energetic and affectionate dog who loves being around people.",
idealHome: "An active home that can provide plenty of exercise and enrichment."
},

{
name: "Luna",
breed: "Cockapoo",
size: "Small",
age: "Puppy",
sex: "Female",
energy: "High",
children: "Yes",
dogs: "Yes",
cats: "Yes",
image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb",
description: "Luna is a playful young dog looking for a family ready for puppy adventures.",
idealHome: "A home willing to continue training and socialisation."
},

{
name: "Charlie",
breed: "Greyhound Cross",
size: "Large",
age: "Senior",
sex: "Male",
energy: "Low",
children: "Yes",
dogs: "Yes",
cats: "Yes",
image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
description: "Charlie is a gentle older dog who enjoys relaxed walks and home comforts.",
idealHome: "A quieter home where he can enjoy his retirement."
}

];



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



function loadBreeds(){

const breedSelect = document.getElementById("breed");

const breeds = [...new Set(dogs.map(dog => dog.breed))];


breeds.forEach(breed => {

let option = document.createElement("option");

option.value = breed;
option.textContent = breed;

breedSelect.appendChild(option);

});

}




function displayDogs(){


dogContainer.innerHTML = "";


let results = dogs.filter(dog => {


return filters.every(filter => {


let selected =
document.getElementById(filter).value;


return selected === "" || dog[filter] === selected;


});


});



dogCount.textContent =
`${results.length} dog${results.length !== 1 ? "s" : ""} available`;



results.forEach(dog => {


let card = document.createElement("div");

card.className = "dog-card";


card.innerHTML = `

<img src="${dog.image}" alt="${dog.name}">


<div class="dog-info">

<h2>${dog.name}</h2>

<p>${dog.breed}</p>


<span class="tag">${dog.size}</span>
<span class="tag">${dog.age}</span>
<span class="tag">${dog.sex}</span>

<br>

<span class="tag">
Energy: ${dog.energy}
</span>

<span class="tag">
Children: ${dog.children}
</span>

<span class="tag">
Dogs: ${dog.dogs}
</span>

<span class="tag">
Cats: ${dog.cats}
</span>


<div class="profile-button">
View ${dog.name}'s Profile
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



loadBreeds();

displayDogs();
