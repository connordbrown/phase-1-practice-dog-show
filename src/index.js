document.addEventListener('DOMContentLoaded', () => {
    fetchData();
})


function fetchData() {
    fetch("http://localhost:3000/dogs")
        .then(response => response.json())
        .then(data => {
            processData(data);
            editDog();
        })
}

// populate page with dog data
function processData(dogData) {
    const table = document.querySelector('.blue');
    dogData.forEach(dog => {
        const {name, breed, sex, id} = dog;
        const dogName = document.createElement('td');
            dogName.textContent = name;
        const dogBreed = document.createElement('td');
            dogBreed.textContent = breed;
        const dogSex = document.createElement('td');
            dogSex.textContent = sex;
        const edit = document.createElement('td');
            edit.id = 'edit-dog';
            const editBtn = document.createElement('button');
            editBtn.id = 'edit-button';
            editBtn.textContent = 'Edit';
            edit.appendChild(editBtn);

        const row = document.createElement('tr');
            row.id = id;
            row.appendChild(dogName);
            row.appendChild(dogBreed);
            row.appendChild(dogSex);
            row.appendChild(edit);
        table.appendChild(row);
    })
}

// allow dog data to be edited
function editDog() {
    // grab form for use in edit button event
    const form = document.querySelector('#dog-form');
    // grab edit buttons, add event listener for each one
    const dogEditBtns = document.querySelectorAll('#edit-button');
    dogEditBtns.forEach(editBtn => {
        // set form fields equal to values in selected row
        editBtn.addEventListener('click', (e) => {
            const tr = e.target.closest('tr');
            // name
            form[0].value = tr.children[0].textContent;
            // breed
            form[1].value = tr.children[1].textContent;
            // sex
            form[2].value = tr.children[2].textContent;
            // attach dog id to submit button
            form[3].id = tr.id
        })
    })
    // create event listener ONCE for form submission
    form.addEventListener('submit', event => {
        event.preventDefault();
        // submit form using correct id for patch
        submitForm(form[3].id); 
        // clear out table, except first row
        const table = document.querySelector('.blue');
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
        // repopulate table
        // preceding operations occur BEFORE calling fetchData()
        return fetchData();
    })
}

// send patch request with altered form fields
function submitForm(doggieId) {
    const form = document.querySelector('#dog-form');
    const updateObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "name": form[0].value,
            "breed": form[1].value,
            "sex": form[2].value
        })
    }

    fetch(`http://localhost:3000/dogs/${doggieId}`, updateObj)
        .catch(error => alert(error.message))     
}
