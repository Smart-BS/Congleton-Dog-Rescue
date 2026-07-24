const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTl1rPGVMDaFoZ03k-HGBK6Aiyb-IZ4jU51oMwz3k-K8uvgLv4dFdQT_OyNrvDqs2OIXLivdv8lymlb/pub?gid=0&single=true&output=csv";
let dogs = [];
const dogContainer = document.getElementById("dogContainer");const dogCount = document.getElementById("dogCount");
const filters = ["breed","size","age","sex","energy","children","dogs","cats"];

async function loadDogs(){
const response = await fetch(sheetURL);
const csv = await response.text();
const rows = csv.split(/\r?\n/);
const headers = rows[0].split(",").map(h => h.trim());

dogs = rows.slice(1).filter(row => row.trim() !== "").map(row => {
let values = row.split(",");
let dog = {};
headers.forEach((header,index)=>{dog[header] = values[index]?.trim() || "";});
return dog;
});

console.log(dogs);
populateBreeds();
displayDogs();
}


function populateBreeds(){
const breedSelect = document.getElementById("breed");
const breeds = [...new Set(dogs.map(dog=>dog.Breed).filter(Boolean))];

breeds.forEach(breed=>{
let option=document.createElement("option");
option.value=breed;
option.textContent=breed;
breedSelect.appendChild(option);
});
}


function displayDogs(){
dogContainer.innerHTML="";

let results = dogs.filter(dog=>{

if(dog.Status &&dog.Status.toLowerCase() !== "available"){return false;}

return filters.every(filter=>{

let selected =document.getElementById(filter).value;

if(selected===""){return true;}

let field =filter.charAt(0).toUpperCase()+filter.slice(1);

return dog[field] === selected;

});

});


dogCount.textContent =`${results.length} dog${results.length !== 1 ? "s" : ""} available`;


results.forEach(dog=>{

let card=document.createElement("div");
card.className="dog-card";

card.innerHTML=`
<img src="${dog.Photo}" alt="${dog.Name}">
<div class="dog-info">
<h2>${dog.Name}</h2>
<p>${dog.Breed}</p>
<span class="tag">${dog.Size}</span><span class="tag">${dog.Age}</span><span class="tag">${dog.Sex}</span>
<p>Energy: ${dog.Energy}<br>Children: ${dog.Children}<br>Dogs: ${dog.Dogs}<br>Cats: ${dog.Cats}</p>
</div>
`;

dogContainer.appendChild(card);

});

}


filters.forEach(filter=>{
document.getElementById(filter).addEventListener("change",displayDogs);
});

loadDogs();
