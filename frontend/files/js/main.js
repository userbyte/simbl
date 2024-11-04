const simblapiURL = config.apiURLs.simblAPI_URL;

function getPosts() {
    console.log('[main.js] getPosts() :: getting posts from server...');
    // console.log('[ %cmain.js%c] getPosts() :: getting posts from server...', 'color: lightblue');
    const headers = new Headers();
    const init = {
      method: 'GET',
      headers
    };
    fetch(simblapiURL+"posts", init)
    .then(response => response.json())
    .then(post => {
        if (post === null) {
            alert('api err: backend api may be temporarily down or broken. try again later?');
            return;
        }
        responsestatus = post.status;
        if (responsestatus === 'success') {
            console.log('[main.js] getPosts() :: got posts');
            console.log('[main.js] getPosts() :: adding to posts div');
            post.posts.forEach(function(post_item){
                var posts_div_el = document.getElementById('posts');
                posts_div_el.prepend(postObject(post_item));
            })
        } else if (responsestatus === 'failed') {
            console.log('[main.js] getPosts() :: no, we are not admin');
        }
    });
}

function isAdmin() {
    // check if the user is admin, show the post create thing if they are
    console.log('[main.js] isAdmin() :: are we admin?');

    var token = localStorage.getItem("token");
    if (token === null) { return false; }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Token', token);
    const init = {
      method: 'GET',
      headers
    };
    fetch(simblapiURL+"admin", init)
    .then(response => response.json())
    .then(post => {
        if (post === null) {
            alert('api err: backend api may be temporarily down or broken. try again later?');
            return;
        }
        responsestatus = post.status;
        if (responsestatus === 'success') {
            console.log('[main.js] isAdmin() :: yes, we are admin');
            var post_create_thing = document.getElementById('upload-post');
            post_create_thing.style.display = 'flex';
            footer_el = document.getElementById('footer');
            var footer_text = document.createElement('p');
            footer_text.textContent = '[admin mode]';
            footer_el.prepend(footer_text);

        } else if (responsestatus === 'failed') {
            console.log('[main.js] isAdmin() :: no, we are not admin');
        }
    });
}

function postThePost() {

    event.preventDefault();

    var token = localStorage.getItem("token");

    var post_textcontent = document.querySelector('#upload-post textarea').value;

    // var s = document.getElementById("status-text");

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Token', token);
    var body = {
      "post_content": post_textcontent,
    };
    body = JSON.stringify(body);
    const init = {
      method: 'POST',
      headers,
      body
    };
    // s.innerHTML = "<b>attempting login...</b>";
    // s.setAttribute('class', 'status');

    fetch(simblapiURL+"posts", init)
    .then(response => response.json())
    .then(post => {
        if (post === null) {
            alert('api err: backend api may be temporarily down or broken. try again later?');
            return;
        }
        responsestatus = post.status;
        console.log('[main.js] postThePost() :: post status: '+responsestatus);
        if (responsestatus === 'success') {
            // s.innerHTML = "<b>post submit success<br>yay</b>";
            // s.setAttribute('class', 'status status-success');
            var posts_div_el = document.getElementById('posts');
            posts_div_el.prepend(postObject(post.post));
            console.log('[main.js] postThePost() :: posted successfully')
        } else if (responsestatus === 'failed') {
            err = post.error;
            // s.innerHTML = "<b>error:<br>"+err+"</b>";
            // s.setAttribute('class', 'status status-error');
            return;
        } else if (responsestatus === 'error') {
            err = post.error;
            // s.innerHTML = "<b>error:<br>"+err+"</b>";
            // s.setAttribute('class', 'status status-error');
            return;
        } else {
            // s.innerHTML = "<b>error:<br>"+"an unknown error has occurred :("+"</b>";
            // s.setAttribute('class', 'status status-error');
            return;
        }
    });
}

// https://stackoverflow.com/a/995374
function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = (25+element.scrollHeight)+"px";
}

window.onload = function onDOMLoaded() {
    console.log('[main.js] onDOMLoaded() :: firing...');
    populateVersionText();
    getPosts();
    isAdmin();
}