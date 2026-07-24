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


async function loadDogs(){

try {

const response = await fetch(sheetURL);

const csv = await response.text();


const rows = csv
.split(/\r?\n/)
.map(row => row.split(/,(?=(?:(?:[^"]"){2})[^"]*$)/));


const headers = rows[0].map(h =>
h.replaceAll('"','').trim()
);


dogs = rows.slice(1)
.filter(row => row.length > 1)
.map(row => {

let dog = {};

headers.forEach((header,index)=>{

dog[header] =
(row[index] || "")
.replaceAll('"','')
.trim();

});

return dog;

});


populateBreeds();
displayDogs();


}
catch(error){

dogContainer.innerHTML =
"<p>Unable to load dogs. Please try again later.</p>";

console.error(error);

}

}



function populateBreeds(){

const select =
document.getElementById("breed");


select.innerHTML =
"<option value=''>All Breeds</option>";


[...new Set(dogs.map(d=>d.Breed))]
.filter(Boolean)
.forEach(breed=>{

let option=document.createElement("option");

option.value=breed;
option.textContent=breed;

select.appendChild(option);

});

}



function displayDogs(){

dogContainer.innerHTML="";


const results = dogs.filter(dog=>{


if(dog.Status &&
dog.Status.toLowerCase() !== "available")
return false;


return filters.every(filter=>{


let selected =
document.getElementById(filter).value;


if(!selected)
return true;


return dog[
filter.charAt(0).toUpperCase()+filter.slice(1)
] === selected;


});


});


dogCount.textContent =
${results.length} dog${results.length!==1?"s":""} available;



results.forEach(dog=>{


let card=document.createElement("div");

card.className="dog-card";


card.innerHTML=`

<img src="${dog.Photo || 'https://via.placeholder.com/400x300?text=Dog+Photo'}">

<div class="dog-info">

<h2>${dog.Name}</h2>

<p>${dog.Breed}</p>

<span class="tag">${dog.Size}</span>
<span class="tag">${dog.Age}</span>
<span class="tag">${dog.Sex}</span>

<br>

<span class="tag">Energy: ${dog.Energy}</span>
<span class="tag">Children: ${dog.Children}</span>
<span class="tag">Dogs: ${dog.Dogs}</span>
<span class="tag">Cats: ${dog.Cats}</span>

<p>${dog.Description || ""}</p>

</div>

`;

dogContainer.appendChild(card);


});


}


filters.forEach(filter=>{

document
.getElementById(filter)
.addEventListener("change",displayDogs);

});


loadDogs();
