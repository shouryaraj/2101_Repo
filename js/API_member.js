function display_data_Individual(){

        let issues = localStorage.getItem("individual_issues");
        issues = JSON.parse(issues);
        let value = localStorage.getItem("contributors");
        let array = JSON.parse(value);
        let nameArray = JSON.parse(localStorage.getItem("names"));
        let file_names = ""

        let Current_Index = localStorage.getItem("individual_Index_for_member_page")
        Current_Index = JSON.parse(Current_Index)
         // console.log(value)
         // //sconsole.log(array)
         // console.log(array);
        html = '<i>'
        html_end = '</i>'
        file_names = checking_for_file(array[Current_Index].author.id)
        console.log(file_names)
        var block_to_insert ;
      	var container_block ;

        id = document.getElementById("current_member_topbar")
        id.innerHTML = 'Name: '+nameArray[Current_Index]+'&emsp;Login ID: '+array[Current_Index].author.login + "&emsp;&emsp;&emsp;&emsp;&emsp;";

      	block_to_insert = document.getElementById( "individual-member-info");
      	block_to_insert.className = "login"
      	block_to_insert.innerHTML = 'Name: '+nameArray[Current_Index]+'<br>Login ID: '+array[Current_Index].author.login+'<br>Total commits:  '+array[Current_Index].total +"<br>Issues Resolved: "+issues[Current_Index];
        // block_to_insert.innerHTML += file_names
        fileId = document.getElementById("file_by_member");
        fileId.innerHTML = file_names;
        console.log(file_names);
   	// console.log(array[i].author.login)
   	// console.log(array[i].total)
 //   	block_to_insert_in_sidebar =  document.createElement('div')
 //   	block_to_insert_in_sidebar.className = "member"+i
 //   	block_to_insert_in_sidebar.innerHTML = '<a class="collapse-item" href="Member.html">'+array[i].author.login +'</a>'
 //   	container_block = document.getElementById( 'Each-member');
	// container_block.appendChild(block_to_insert_in_sidebar);


}
// This function is to check whether member has contribution in the file changes
// if member has then retrieve the data from the local storage and return the all file name in the format of the HTML
function checking_for_file(LoginId){

      let value = "";
      // boolean if it found that member is present
      let found  = false;
      let return_value = "";
      // Getting the file from the local storage for each member's one
      let file_data = localStorage.getItem("file_data_for_each_member");
      file_data = JSON.parse(file_data);

      // Checking with unique login id whether the loginID exists
      for (var author in file_data) {
          if(file_data[author]["file"][0]["loginId"] == LoginId){
              value = author;
              found = true;
              break;
          }
      }
      // If member exist in the file array then loop through all the filename
      // and make string in HTML format
      if(found){
          return_value  ="Contribution in the files:- "
          for(var i=0; i<file_data[author]["file"].length; i++){

             return_value += "<br>"+ (i+1) + ") "+file_data[author]["file"][i]["fileName"] ;
           }
      }
      else{
        return_value = "No Contribution data regarding to the file"
      }

      return return_value;


}

function display_individual_linegraph(show_commits){
    let value = localStorage.getItem("individual_Index_for_member_page");
    let index = JSON.parse(value);
    let members = localStorage.getItem("contributors");
    let contributors = JSON.parse(members);
    let weeks_length = contributors[index]["weeks"].length
    let total_commits = [[],[],[]]
    if (weeks_length >= 12){
        for (i=weeks_length-12; i<weeks_length; i++){
            total_commits[0].push(contributors[index]["weeks"][i]["c"]);
            total_commits[1].push(contributors[index]["weeks"][i]["a"]);
            total_commits[2].push(contributors[index]["weeks"][i]["d"]);
        }
    }
    else{
        for (i=0; i<weeks_length; i++){
            total_commits[0].push(contributors[index]["weeks"][i]["c"]);
            total_commits[1].push(contributors[index]["weeks"][i]["a"]);
            total_commits[2].push(contributors[index]["weeks"][i]["d"]);
        }
    }
    console.log(total_commits);
    if (individual_line_chart != null){
        individual_line_chart.destroy();
    }
    individual_line_chart = individualLineChartData(total_commits, show_commits)
}
