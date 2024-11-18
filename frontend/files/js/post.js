const simblapiURL = config.apiURLs.simblAPI_URL;

function getPosts() {
  console.log("[post.js] getPosts() :: getting post from server...");
  var post_id = getUrlVars()["id"];
  if (post_id === undefined) {
    return false;
  }
  post = getPost(post_id);
  var posts_div_el = document.getElementById("posts");
  posts_div_el.prepend(postObject(post, { clickable: false, fulltext: true }));
}

function deletePost(post_id) {
  console.log(post_id);
}

// https://stackoverflow.com/a/995374
function textAreaAdjust(element) {
  element.style.height = "1px";
  element.style.height = 25 + element.scrollHeight + "px";
}

window.onload = function onDOMLoaded() {
  console.log("[main.js] onDOMLoaded() :: firing...");
  populateVersionText();
  getPosts();
  isAdmin();
};
