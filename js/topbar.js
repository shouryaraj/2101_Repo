

function validateform_topbar(){
    var URL = document.forms["new_API_URL"]["URL"].value;
    localStorage.setItem("URL", URL);
    document.getElementById("teamStatistics").innerHTML = "";
    document.getElementById("memberRankings").innerHTML = "";
    document.getElementById("file_details").innerHTML = "";
    if (URL != ""){
        save_all_API(URL);
        members_sidebar_init(URL);
        current_URL_topbar();

        //try_new_url(URL, output);
        if (window.location.pathname.includes("/members.html") || window.location.pathname.includes("/Members.html")){
            display_data();
        }
        else if (window.location.pathname.includes("/member.html") || window.location.pathname.includes("/Member.html")){
        }
        else if (window.location.pathname.includes("/index.html") || window.location.pathname.includes("/Index.html")){
              getIssues_index();
              getCommits_index();
              getWeeklyCommits_index();
              get_commits_details();
              getWeeklyIndividualCommits_index(1);
              printing_the_file_details();
        }
    }

}

function current_URL_topbar(){
    id = document.getElementById("current_URL");
    URL = localStorage.getItem("URL");
    if (URL!= null){
        console.log("Asdasdasdasdasd");
        console.log(URL);
        id.innerHTML = "The current URL is: " + URL;

        idd = document.getElementById("URLbutton_index");
        idd.classList = "btn btn-primary";

        id = document.getElementById("search_sign");
        id.classList = "fas fa-search fa-sm";
    }
    else{
        id = document.getElementById("current_URL");
        id.innerHTML = "ERROR empty search";
    }
}

function current_URL_loading(){
    var URL = document.forms["new_API_URL"]["URL"].value;
    if (URL != ""){
        localStorage.setItem("URL", URL);
        id = document.getElementById("current_URL");
        URL = localStorage.getItem("URL");
        id.innerHTML = "Loading...";

        id = document.getElementById("URLbutton_index");
        id.classList = "btn btn-secondary";

        id = document.getElementById("search_sign");
        id.classList = "fas fa-search fa-spin fa-sm";
        setTimeout(function(){
            validateform_topbar();
        }, 250);
    }
    else{
        id = document.getElementById("current_URL");
        id.innerHTML = "ERROR empty search";
    }
}
