let input = document.querySelector('input');
let searchBtn = document.querySelector('.inputBar button');

// get all ele
let names = document.querySelectorAll('.name');
let publicRepo = document.querySelector('.publicRepo span');
let followers = document.querySelector('.followers span');
let following = document.querySelector('.following span');
let accCreated = document.querySelector('.accCreated span');
let lastUpdated = document.querySelector('.lastUpdated span');
let viewFollowers = document.querySelector('.viewFollowers button');

let userImg = document.querySelector('.bottom img');


searchBtn.addEventListener('click', getData)
document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter'){
        getData()
    }
    input.focus()
})
async function getData() {
    let inputValue = input.value.trim().toLowerCase()
    if(inputValue.length > 0){
        let url = `https://api.github.com/users/${inputValue}`

        try{
            let res = await fetch(url);
            if(!res.ok){
                Swal.fire(`"${inputValue.toLocaleLowerCase()}" not found`);
                throw new Error(`HTTP err! ${res.status}`)
            }
            let data = await res.json();
            document.querySelector('.bottom').style.display = 'flex'

            names.forEach(name => {
                name.textContent = data.login;
            });
            userImg.src = data.avatar_url;
            followers.textContent = data.followers
            following.textContent = data.following
            publicRepo.textContent = data.public_repos
            accCreated.textContent = new Date(data.created_at.slice(0,10)).toLocaleDateString()
            lastUpdated.textContent = new Date(data.updated_at.slice(0,10)).toLocaleDateString()

            let displayFollowers = document.querySelector('.displayFollowers');

            viewFollowers.addEventListener('click', async () => {

                let url2 = `${data.followers_url}`;
                let res2 = await fetch(url2);
                let data2 = await res2.json();

                let rows = document.querySelector('.rows');
                rows.innerHTML = ''
                for(let i = 0; i < data.followers_url.length; i++){
                    try{
                        let createEle = document.createElement('div')
                createEle.className = 'row';
                let divHTML = `<div class="right"><img src="${data2[i].avatar_url}" alt=""><div class="rowName">${data2[i].login}</div></div><div class="left"><button>View Profile</button></div>`;
                createEle.innerHTML = divHTML;
                rows.appendChild(createEle);
                displayFollowers.style.display = 'block';
                console.log(data2);
                    }catch(err){
                        console.log(err);
                        console.clear()
                    }
                    displayFollowers.querySelectorAll('button').forEach(btn => {
                        btn.addEventListener('click', () => {
                            let name = btn.parentElement.previousElementSibling.querySelector('.rowName')
                                    console.clear()
                                    input.value = name.innerHTML;
                                    displayFollowers.style.display = 'none';
                                    getData()
                            })
                    })
                }
            })

            displayFollowers.querySelector('i').addEventListener('click', () => {
                displayFollowers.style.display = 'none'
            })



        }catch(err){
            console.log(err);
        }

        input.value = ''
    }else{
        alert('User Name toh Likh')
    }
}