version = "0.3.1";

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );
  return vars;
}

function populateVersionText() {
  ver_el = document.getElementById("frontend-version");
  if (ver_el != undefined) {
    console.log("[shared.js] populateVersionText() :: version text set");
    ver_el.textContent = `simbl-web ${version}`;
    return;
  }

  console.log("populateVersionText() :: couldnt find version element");
  return;
}

function getxAPIurl() {
  // ask simbl-server for the xAPI URL
  // fetch(apiURLs.simblAPI_URL)
  // apiURLs.xAPI_URL = resp.url;
}

pad = function (num) {
  return (num < 10 ? "0" : "") + num;
};

function prettifyUnixTime(timestamp, format) {
  // converts a given unix timestamp into a prettier human-readable format

  var d = new Date(timestamp * 1000); // JS expects millisecond timestamp so we needa multiply
  hrs24 = d.getHours();
  m = pad(d.getMinutes());
  s = pad(d.getSeconds());
  if (hrs24 === 0) {
    hrs12 = 12;
    amPm = "AM";
  } else if (hrs24 < 12) {
    hrs12 = hrs24;
    amPm = "AM";
  } else if (hrs24 === 12) {
    hrs12 = 12;
    amPm = "PM";
  } else {
    hrs12 = hrs24 - 12;
    amPm = "PM";
  }

  months_short = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  months_full = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  formatReplacements = {
    "%y": d.getFullYear().toString().slice(-2),
    "%Y": d.getFullYear(),
    "%M": d.getMonth() + 1,
    "%g": months_short[d.getMonth()], // g for gregorian idk but these need to be single letters for the regex to work
    "%G": months_full[d.getMonth()],
    "%d": d.getDate(),
    "%h": hrs12,
    "%H": hrs24,
    "%m": m,
    "%s": s,
    "%r": amPm, // r for roman cuz they used 12hr time ig idk bruh
    "%u": timestamp,
  };
  // Formatting guide:
  // [date used in examples: 1/30/2023 6:45:15 PM]
  // %y - Short year (ex. 23)
  // %Y - Full year (ex. 2023)
  // %M - Month number (ex. 1)
  // %g - Month name short (ex. Jan)
  // %G - Month name full (ex. January)
  // %d - Day number (ex. 30)
  // %h - Hours (ex. 12hr) (ex. 6)
  // %H - Hours (ex. 24hr) (ex. 18)
  // %m - Minutes (ex. 45)
  // %s - Seconds (ex. 15)
  // %r - AM/PM (ex. PM)
  // %u - Unix timestamp (ex. 1675122315)

  var timeformat;
  if (format === undefined) {
    // default time format
    timeformat = "%M/%d/%Y • %h:%m %r";
  } else {
    // allow the format to be specified in the function call, like prettifyUnixTime('%g %d, %Y @ %h:%m:%s %r')
    timeformat = format;
  }

  f = timeformat;
  for (let [key, val] of Object.entries(formatReplacements)) {
    var regex = new RegExp(key, "g");
    f = f.replace(regex, val);
  }

  return f;
}

function postObject(post, obj_settings) {
  if (typeof obj_settings === "undefined") {
    obj_settings = {};
  }
  id = post.id;
  timestamp = post.timestamp;
  author = post.author;
  text_content = post.text;

  // return a DOM element of the post data

  // WARNING: CODE BELOW IS ATROCIOUS, SORRY. I DONT KNOW HOW TO DO IT BETTER YET
  // maybe this is what react is all about............... ? idk dont care atm i just want this project to work

  // post_el = document.createElement('div');

  // post container <div>
  post_el_post_container = document.createElement("div");
  post_el_post_container.className = "post-container";
  post_el_post_container.id = `post-${id}`;

  // post edit <button>
  // post-container > button
  post_el_edit = document.createElement("button");
  post_el_edit.id = "edit-post-btn";
  post_el_edit.innerHTML = '<i class="fas fa-edit"></i>';
  // put it in post container div
  post_el_post_container.append(post_el_edit);

  // post delete <button>
  // post-container > button
  post_el_delete = document.createElement("button");
  post_el_delete.id = "delete-post-btn";
  post_el_delete.innerHTML = '<i class="fas fa-trash-alt"></i>';
  post_el_delete.setAttribute("onclick", `deletePost("${id}")`);
  // put it in post container div
  post_el_post_container.append(post_el_delete);

  // // // POST CONTENT // // //
  // post content <div>
  // post-container > post-content
  post_el_post_content = document.createElement("div");
  post_el_post_content.className = "post-content";
  if (obj_settings.clickable == true) {
    post_el_post_content.setAttribute(
      "onclick",
      `location.href = "post.html?id=${id}"`
    );
  }
  // put it in post container
  post_el_post_container.append(post_el_post_content);

  // post timepost_el_post_timestamp_p <div>
  // post-container > post-content > post-info
  post_el_post_info = document.createElement("div");
  post_el_post_info.className = "post-info";
  // put it in post content div
  post_el_post_content.append(post_el_post_info);

  // post author <div>
  // post-container > post-content > post-info > post-author
  post_el_post_author = document.createElement("div");
  post_el_post_author.className = "post-author";
  // put it in post info div
  post_el_post_info.append(post_el_post_author);

  // post author <picture>
  // post-container > post-content > post-info > post-author > p
  post_el_post_author_picture = document.createElement("picture");
  post_el_post_author_picture.innerHTML = `
                                    <!-- <source srcset="files/img/webp/default_pfp.webp" type="image/webp"> -->
                                    <source srcset="files/img/svg/default_pfp.svg" type="image/svg"> 
                                    <source srcset="files/img/png/default_pfp.png" type="image/png"> 
                                    <img src="files/img/png/default_pfp.png" alt="pfp" class="banners">
                                    `;
  // put it in post author div
  post_el_post_author.append(post_el_post_author_picture);

  // post author <p>
  // post-container > post-content > post-info > post-author > p
  post_el_post_author_p = document.createElement("p");
  post_el_post_author_p.textContent = xAPIIDToUsername(author);
  // put it in post author div
  post_el_post_author.append(post_el_post_author_p);

  // post timestamp <div>
  // post-container > post-content > post-info > post-timestamp
  post_el_post_timestamp = document.createElement("div");
  post_el_post_timestamp.className = "post-timestamp";
  // put it in post info div
  post_el_post_info.append(post_el_post_timestamp);

  // post timestamp <p>
  // post-container > post-content > post-info > post-timestamp > p
  post_el_post_timestamp_p = document.createElement("p");
  post_el_post_timestamp_p.textContent = prettifyUnixTime(timestamp);
  // put it in post timestamp div
  post_el_post_timestamp.append(post_el_post_timestamp_p);

  // post text <div>
  // post-container > post-content > post-text
  post_el_post_text = document.createElement("div");
  post_el_post_text.className = "post-text";
  // put it in post content div
  post_el_post_content.append(post_el_post_text);

  // post text <p>
  // post-container > post-content > post-text > p
  post_el_post_text_p = document.createElement("p");
  if (obj_settings.fulltext == true) {
    post_el_post_text_p.textContent = text_content;
  } else {
    // post_el_post_text_p.textContent = text_content;

    // TODO: cut off text at X chars and put a [show more...] button
    text_maxlen = 120;
    if (text_content.length > text_maxlen) {
      post_el_post_text_showmore = document.createElement("a");
      post_el_post_text_showmore.id = "post-show-more-btn";
      post_el_post_text_showmore.text = "[show more...]";
      post_el_post_text_showmore.setAttribute(
        "onclick",
        `showFullText(event, "${id}")`
      );
      post_el_post_text_p.textContent =
        text_content.substring(0, text_maxlen - 1) + " ...";
      post_el_post_text.append(post_el_post_text_showmore);
    } else {
      post_el_post_text_p.textContent = text_content;
    }
  }
  // put it in post text div
  post_el_post_text.prepend(post_el_post_text_p);

  // console.log(post_el_post_container);

  // post_el.append(post_el_post_container);
  return post_el_post_container;
}

function getPost(post_id) {
  // get a post from the API, by ID

  // xmlhttprequest (sync)
  req = new XMLHttpRequest();
  req.open("GET", simblapiURL + `posts?id=${post_id}`, false); // `false` makes the request synchronous

  req.send(null);

  if (req.status === 200) {
    req_json = JSON.parse(req.responseText);
    post = req_json["posts"];
    if (post == undefined || post == null) {
      console.log(`[shared.js] getPost() :: failed to get post ${post_id}`);
      return false;
    }
    console.log(`[shared.js] getPost() :: got post ${post.id}`);
    return post;
  } else {
    return undefined;
  }
}

function showFullText(event, post_id) {
  event.preventDefault();
  event.stopPropagation();
  post = getPost(post_id);
  post_el_post_text_p = document.querySelector(
    `#post-${post_id} .post-content .post-text p`
  );
  console.log(post_el_post_text_p);
  console.log(post);
  post_el_post_text_p.textContent = post.text;
  post_el_post_text_showmore = document.querySelector(
    `#post-${post_id} .post-content .post-text a`
  );
  post_el_post_text_showmore.style.display = "none";
  // post_el_post_text_showmore.setAttribute(
  //   "onclick",
  //   `showLessText("${post_id}")`
  // );
}
