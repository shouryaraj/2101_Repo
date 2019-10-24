let pieChart, lineChart, barChart;

function getURL_index(inputURL, information){
    input = inputURL.replace("https://github.com/","");
    input = input.replace(".git","");
    let apidata = "https://api.github.com/repos/" + input + "/" + information + '?access_token=5835a6b68b642986736d75f4f4995f4461846e9e ';
    return apidata;
}


function getIssues_index(){
    let output = document.getElementById("teamStatistics");
    output.innerHTML +=  "<b>Average Time to resolve issues: <br></b>"
    let value = localStorage.getItem("issues");
    let array_issues = JSON.parse(value);
    if (array_issues != null){
        let totalIssueTime = 0;
        let count = 0;
        let array = array_issues["items"];
        array.forEach(issue =>{
            count += 1;
            let createdDate = issue["created_at"];
            let closedDate = issue["closed_at"];
            let createdTime = new Date(createdDate);
            let closedTime = 0;
            if (closedDate != null){
                closedTime = new Date(closedDate);
                closedTime = closedTime.getTime();
            }
            let difference= closedTime - createdTime.getTime();
            var seconds = Math.floor((difference) / (1000));
            if (seconds > 0){
                totalIssueTime += seconds;
            }
        })
        let averageIssueTime = totalIssueTime/count;
        if (averageIssueTime > 0){
            output.innerHTML += (averageIssueTime/60/60).toFixed(2) +' hours' + "<br><br>";
        }
        else{
            output.innerHTML += "No resolved issues <br><br>";
        }
    output.innerHTML += "<b>Total issues closed: <br></b>" + array_issues["total_count"] + "<br><br>";
    }
}

function getIndividualIssues(){
    let value= localStorage.getItem("issues");
    let array = JSON.parse(value);
    let issues_array = array["items"];
    let contributors = localStorage.getItem("contributors");
    contributors = JSON.parse(contributors);
    let individual_issues = new Array(contributors.length).fill(0);
    for (i=0; i<issues_array.length; i++){
        for (j=0; j<contributors.length; j++){
            if(issues_array[i]["user"]["login"] === contributors[j]["author"]["login"]){
                individual_issues[j] += 1;
            }
        }
    }
    let JSON_issues = JSON.stringify(individual_issues);
    localStorage.setItem("individual_issues", JSON_issues);
    return individual_issues;
}

function getCommits_index(){
    let contributors =[];
    let commits =[];
    let value = localStorage.getItem("contributors");
    let array = JSON.parse(value);
    if (array != null){
        let count =0;
        array.forEach(contributor => {
            count +=1;
            commits.push(contributor["total"]);
            contributors.push(contributor["author"]["login"]);
        })

        let name = localStorage.getItem("names");
        let members = JSON.parse(name);

        //sidebar added by edwin
    //        members_sidebar(contributors, count);
        if (pieChart != null){
            pieChart.destroy();
        }
        let statistic_output = document.getElementById("teamStatistics");
        statistic_output.innerHTML += "<b> Total Number of contributors: </b><br>" + count + "<br><br>";
        let member_ranking_output = document.getElementById("memberRankings");
        member_ranking_output.innerHTML += "<b> Member rankings: </b><br>"
        let members_displayed = 0;
        for (i =members.length-1; i>=0; i--){
            if (members_displayed >= 4){
                break
            }

            let ordinal_indicator = ["1st", "2nd", "3rd", "4th"]
            member_ranking_output.innerHTML += "<b>"+ordinal_indicator[members_displayed] + ". </b>" + members[i] +", " + commits[i] + " commits<br>";
            members_displayed += 1;
        }
        let length = commits.length
        let total_commits = 0;
        for (i=0; i<length; i++){
            total_commits += commits[i];
        }
        let output = document.getElementById("teamStatistics");
            output.innerHTML += "<b> Total Number of commits: </b><br>" + total_commits + "<br><br>";
        let issues_array = getIndividualIssues();
        console.log(issues_array);
        pieChart = pieChartData(members, commits, issues_array);
    }
}

function getWeeklyCommits_index(){
    let value = localStorage.getItem("weeklyCommits");
    let array = JSON.parse(value);
    let data_array = array["all"];
    let length = data_array.length;
    data = data_array.slice(length-11);
    data.push(0);
    if (lineChart != null){
        lineChart.destroy();
    }
    lineChart = lineChartData(data);
}

function getWeeklyIndividualCommits_index(week_number){
    id = document.getElementById("dropdownMenuButton")
    id.innerHTML = "Week "+ week_number;

    let value = localStorage.getItem("contributors");
    let array = JSON.parse(value);
    let length = array.length
    let weekly_array = [[], [], []];
    let stop_at;
    if (length > 10){
        stop_at = length -10;
    }
    else{
        stop_at = 0;
    }
    for (i=length-1; i>=stop_at; i--){
        let week_length = array[i]["weeks"].length;
        if (week_length >= 12){
            let week = (week_length -1)- (12 - week_number);
            weekly_array[0].push(array[i]["weeks"][week]["c"])
            weekly_array[1].push(array[i]["weeks"][week]["a"])
            weekly_array[2].push(array[i]["weeks"][week]["d"])
        }
    }
    let members = localStorage.getItem("names");
    let members_array = JSON.parse(members);
    if (members_array.length > 10){
        members_array = members_array.slice(members_array.length -10);
    }
    if (barChart != null){
        barChart.destroy();
    }
    console.log(weekly_array);
    topMembers = members_array.reverse();
    barChart = barChartData(topMembers, weekly_array);
}

//function getWeeklyTeamChart_index(){
//    barChart = barChartData();
//}


function try_new_url_index(input, output){
    input =input.replace("https://github.com/","");
    input = input.replace(".git","");
    output.innerHTML += "<br><b>Members of Repository: </b><br>";
    let apidata = "https://api.github.com/repos/" + input + "/contributors" +'?access_token=5835a6b68b642986736d75f4f4995f4461846e9e ';
    let request = new XMLHttpRequest();
    request.open('GET', apidata, true);
    request.onload = function(){
        let data = JSON.parse(this.response);
        data.forEach(member => {
            let member_request = new XMLHttpRequest();
            member_request.open('GET', "https://api.github.com/users/" + member["login"] + '?access_token=5835a6b68b642986736d75f4f4995f4461846e9e ', true);
            member_request.onload = function(){
                let data = JSON.parse(this.response);
                if (data["name"] != null){
                    output.innerHTML += data["name"] +"<br>";
                }
            }
            member_request.send();


        })
    }
    request.send();
}



function printing_the_file_details(){
      let file_details = localStorage.getItem("unique_file_details_in_sorted_order")
      let index_value = 0
      file_details = JSON.parse(file_details)
      html = '<i>'
      html_end = '</i>'

      var block_to_insert ;
      var container_block ;
    let ordinal_indicator = ["1st", "2nd", "3rd", "4th"]

      block_to_insert = document.createElement( 'i' );
      block_to_insert.className = "file"
        block_to_insert.innerHTML = "<b>The Most Changed Files:<br></b>"
      for(var i=0; i < file_details.length-1; i++){
          block_to_insert.innerHTML +=  "<b>"+ ordinal_indicator[i] +'. </b>  '+file_details[i][0]+'<br>';
          if(i == 3){
             break;
          }
      }

      container_block = document.getElementById( "file_details");
      container_block.appendChild(block_to_insert);
      averageCommit();





};

function averageCommit(){
      let totalIssueTime = 0
      let lastDateCommit = localStorage.getItem("last_commit_date");
      let average_commit_string = ""
      // lastDateCommit = JSON.parse(lastDateCommit)
      let firstDateCommit = localStorage.getItem("first_commit_date");
      // lastDateCommit = JSON.parse(firstDateCommit)
      let createdTime = new Date(firstDateCommit);
      let lastTime = new Date(lastDateCommit);

      let commits = JSON.parse(localStorage.getItem("commits"));
      let commitCount = commits.length;
        console.log("Commit Count " + commitCount)
      let difference= lastTime.getTime() - createdTime.getTime();
      var seconds = Math.floor((difference) / (1000));
      let averageCommitTime = seconds/commitCount;
      console.log(averageCommitTime)
      if (averageCommitTime > 0){
          average_commit_string = ((averageCommitTime/60/60).toFixed(2) +' hours' + "<br><br>");
      }

      else{
          average_commit_string = ( "No resolved issues <br><br>");
      }
      let output = document.getElementById("teamStatistics");
      output.innerHTML +=  "<b>Average Time to commits: <br></b>"
      output.innerHTML += average_commit_string;

}

/*
//run this once the page is created by the login page, any further updates will be done in the functions
let input = localStorage.getItem("URL_login")
input =input.replace("https://github.com/","");
input = input.replace(".git","");
let output= document.getElementById("teamStatistics");
output.innerHTML += "<br><b>Members of Repository: </b><br>";
let apidata = "https://api.github.com/repos/" + input + "/contributors";
let request = new XMLHttpRequest();
request.open('GET', apidata, true);
request.onload = function(){
    let data = JSON.parse(this.response);
    data.forEach(member => {
        let member_request = new XMLHttpRequest();
        member_request.open('GET', "https://api.github.com/users/" + member["login"], true);
        member_request.onload = function(){
            let data = JSON.parse(this.response);
            if (data["name"] != null){
                output.innerHTML += data["name"] +"<br>";
            }
        }
        member_request.send();


    })
}
request.send();

*/


// else{
//     console.log(localStorage.getItem("response"))
//     let data = JSON.parse(localStorage.getItem("response"));
//     let output= document.getElementById("teamStatistics");
//     output.innerHTML += "<br><b>Members of Repository: </b><br>";
//     console.log(data);
//     for(var i = 0; i < data.length; i++) {
//     var obj = data[i];

//     console.log(obj.n);

//      if (obj.name != null){
//             output.innerHTML += member["name"] +"<br>";
//         }
//     }


// }
