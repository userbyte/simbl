// const apiURL = config.apiURLs.xapiURL;

function SETUP_xLogin() {
  event.preventDefault();
  const xapiURL = document.getElementById("xapi_url").value;
  const simblapiURL = document.getElementById("simblapi_url").value;

  var email = document.getElementById("xapi_email").value;
  var password = document.getElementById("xapi_password").value;
  var s = document.getElementById("status-text");

  if (xapiURL === "") {
    s.innerHTML = "<b>login error:<br> xAPI URL cannot be empty</b>";
    s.setAttribute("class", "status status-error");
    return;
  }
  if (simblapiURL === "") {
    s.innerHTML = "<b>login error:<br> xAPI URL cannot be empty</b>";
    s.setAttribute("class", "status status-error");
    return;
  }
  if (email === "") {
    s.innerHTML = "<b>login error:<br> email cannot be empty</b>";
    s.setAttribute("class", "status status-error");
    return;
  }
  if (password === "") {
    s.innerHTML = "<b>login error:<br> password cannot be empty</b>";
    s.setAttribute("class", "status status-error");
    return;
  }
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  var body = {
    email: email,
    password: password,
  };
  body = JSON.stringify(body);
  const init = {
    method: "POST",
    headers,
    body,
  };
  s.innerHTML = "<b>attempting login...</b>";
  s.setAttribute("class", "status");
  fetch(xapiURL + "login", init)
    .then((response) => response.json())
    .then((post) => {
      if (post === null) {
        alert(
          "api err: backend api may be temporarily down or broken. try again later?"
        );
        window.history.back();
        return;
      }
      responsestatus = post.status;
      console.log("login status: " + responsestatus);
      if (responsestatus === "success") {
        u = post.username;
        tk = post.token;
        localStorage.setItem("username", u);
        localStorage.setItem("token", tk);
        s.innerHTML = "<b>xAPI login success<br>moving onto simbl setup...</b>";
        s.setAttribute("class", "status status-success");
        setTimeout(function () {
          //window.history.back();

          // ok now run the actual simbl-server setup function
          SETUP_doSetup(xapiURL, simblapiURL, tk);

          // location.href = document.referrer; return false; // reload previous page for updated data
        }, 700);
      } else if (responsestatus === "failed") {
        err = post.error;
        s.innerHTML = "<b>login error:<br>" + err + "</b>";
        s.setAttribute("class", "status status-error");
        return;
      } else if (responsestatus === "error") {
        err = post.error;
        s.innerHTML = "<b>login error:<br>" + err + "</b>";
        s.setAttribute("class", "status status-error");
        return;
      } else {
        s.innerHTML =
          "<b>login error:<br>" + "an unknown error has occurred :(" + "</b>";
        s.setAttribute("class", "status status-error");
        return;
      }
    });
}

function SETUP_doSetup(xapiURL, simblapiURL, xapi_token) {
  var s = document.getElementById("status-text");

  s.innerHTML = "configuring simbl-server...";

  if (xapiURL === "") {
    s.innerHTML = "<b>setup error:<br> xAPI URL cannot be empty</b>";
    s.setAttribute("class", "status status-error");
    return;
  }
  if (simblapiURL === "") {
    s.innerHTML = "<b>setup error:<br> simbl-server URL cannot be empty</b>";
    s.setAttribute("class", "status status-error");
    return;
  }
  if (xapi_token === "" || xapi_token === null) {
    s.innerHTML =
      "<b>setup error:<br> token is missing! this shouldnt be possible... wtf?</b>";
    s.setAttribute("class", "status status-error");
    return;
  }

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  var body = {
    xapi_url: xapiURL,
    xapi_token: xapi_token,
  };
  body = JSON.stringify(body);
  const init = {
    method: "POST",
    headers,
    body,
  };
  s.innerHTML = "<b>attempting setup...</b>";
  s.setAttribute("class", "status");
  fetch(simblapiURL + "setup", init)
    .then((response) => response.json())
    .then((post) => {
      if (post === null) {
        alert(
          "api err: backend api may be temporarily down or broken. try again later?"
        );
        return;
      }
      responsestatus = post.status;
      console.log("setup status: " + responsestatus);
      if (responsestatus === "success") {
        s.innerHTML =
          "<b>setup success<br>redirecting back to the homepage...</b>";
        s.setAttribute("class", "status status-success");
        setTimeout(function () {
          //window.history.back();
          location.href = "";
          return false; // reload previous page for updated data
        }, 700);
      } else if (responsestatus === "failed") {
        err = post.error;
        s.innerHTML = "<b>setup error:<br>" + err + "</b>";
        s.setAttribute("class", "status status-error");
        return;
      } else if (responsestatus === "error") {
        err = post.error;
        s.innerHTML = "<b>setup error:<br>" + err + "</b>";
        s.setAttribute("class", "status status-error");
        return;
      } else {
        s.innerHTML =
          "<b>setup error:<br>" + "an unknown error has occurred :(" + "</b>";
        s.setAttribute("class", "status status-error");
        return;
      }
    });
}
export default function Setup() {
  return <></>;
}
