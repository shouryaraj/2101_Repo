function save_all_API(URL){
    save_contributors_API(URL, "stats/contributors", "contributors");
    save_repos_API(URL, "issues?state=closed", "issues");
    save_repos_API(URL, "stats/participation", "weeklyCommits");
    save_issues_API(URL, "issues", 1, true)
    console.log(1234);
}

function getURL_API(inputURL, information){
    let input = inputURL.replace("https://github.com/","");
    input = input.replace(".git","");
    let apidata = "https://api.github.com/repos/" + input + "/" + information;
    return apidata;
}

function save_issues_API(URL, local_key, current_page, first_item){
    let input = URL.replace("https://github.com/","");
    input = input.replace(".git","");
    let date = new Date();
    date.setDate(date.getDate() - 84);
    date = date.toISOString().slice(0,10);
    let apidata = "https://api.github.com/search/issues?q=repo:" + input + "+type:issue+closed:>" + date + "&per_page=100&page=" + current_page;
    let request = new XMLHttpRequest();
    request.open('GET', apidata, false);
    request.onload = function(){
        let myObj = JSON.parse(this.response);
        let data = JSON.stringify(myObj);
        if(first_item === true){
            if(localStorage){
        	   localStorage.setItem(local_key, data);
                first_item = false;
            }

        }
        else{
            let value = localStorage.getItem(local_key);
            let array = JSON.parse(value);
            Array.prototype.push.apply(array["items"],myObj["items"]);
            console.log(array["items"]);
            console.log(myObj["items"]);
            array = JSON.stringify(array);
            localStorage.setItem(local_key, array);
        }


        if (this.readyState===4){
            let value = localStorage.getItem(local_key);
            let array = JSON.parse(value)
            if (array !== null){
                console.log(array["total_count"])
                let result = 100 * Math.ceil(array["total_count"] / 100);
                if (current_page < result/100){
                    current_page += 1;
                    save_issues_API(URL, local_key, current_page);
                }
            }
        }
    }

    request.send();


}

//api for contributors and commit
function save_repos_API(URL, information, local_key){
    let apidata = getURL_API(URL, information);
    let request = new XMLHttpRequest();
    request.open('GET', apidata, false);
    request.onload = function(){

    	var myObj = JSON.parse(this.response);
      let data = JSON.stringify(myObj);
      if(localStorage){
        	localStorage.setItem(local_key, data)
        }

    }
    request.send();

}

function save_contributors_API(URL, information, local_key){

    console.log(1234);
    let apidata = getURL_API(URL, information);
    let request = new XMLHttpRequest();
    request.open('GET', apidata, false);
    request.onload = function(){

    	var myObj = JSON.parse(this.response);
      let data = JSON.stringify(myObj);
      if(localStorage){
        	localStorage.setItem(local_key, data)
        }

        if (local_key == "contributors"){
            get_commits_API();
        }
    }
    request.send();

}

function get_commits_API(){
    let contributors =[];
    let value = localStorage.getItem("contributors");
    let array = JSON.parse(value);
    let count =0;
    array.forEach(contributor => {
        count +=1;
        contributors.push(contributor["author"]["login"]);
    })

    getContributorNames_API(contributors, count);


}

function getContributorNames_API(contributors,count){
    let members =[];
    for(let i =0; i<count; i++){
        let member_request = new XMLHttpRequest();
        let name;
        member_request.open('GET', "https://api.github.com/users/" + contributors[i] + '?access_token=5835a6b68b642986736d75f4f4995f4461846e9e ', false);
        member_request.onload = function(){
            let data = JSON.parse(this.response);
            if (data["name"] != null){
                members.push(data["name"]);

            }
            else{
                members.push(contributors[i]);
            }

            if (i == count - 1){
                members = JSON.stringify(members)
                localStorage.setItem("names", members);
            }
//            console.log(members);
        }
        member_request.send();
    }

}
// get commit details and store it
function get_commits_details(){
     if(localStorage){
       inputUrl = localStorage.getItem("URL");

     }
     apidata = getURL_API(inputUrl, "commits?per_page=50");
     let request = new XMLHttpRequest();
     request.open('GET', apidata, false);
     request.onload = function(){
     //console.log(this.response);
       var myObj = JSON.parse(this.response);
      // console.log(myObj);
       let data = JSON.stringify(myObj);
       local_key = "commits";
       if(localStorage){
          localStorage.setItem(local_key, data)
         }
          get_first_and_last_commit();
          get_the_file_details();
          using_the_file_data();
        //  get_the_file_details();
          // console.log(1234)

          // get_the_file_details();
     }

     request.send();


}
// Getting the first commit date and last commit date, store it localstorage.
function get_first_and_last_commit(){
   let data = JSON.parse(localStorage.getItem("commits"))
   console.log(data)
  //console.log(data);
   let last_commit_date = data[0]["commit"]["author"]["date"]
//   console.log(last_commit_date +"last commit ")

  // console.log(first_commit_date);
   let first_commit_date = data[data.length-1]["commit"]["author"]["date"]
  // console.log(last_commit_date);
//  console.log(first_commit_date +" first commit date")
    if(localStorage){
       localStorage.setItem("first_commit_date", first_commit_date);
       localStorage.setItem("last_commit_date",last_commit_date);
    }

}
function get_the_file_details(){
  // Get the sha for file details
   let array_of_file = {}
   let sha =""
   let myObj = ""
   let request = ""
   let shaRequestData = []
   let data = JSON.parse(localStorage.getItem("commits"))
   if(localStorage){
     inputUrl = localStorage.getItem("URL");

   }

   // // Looping through commits to the sha
   for(i =0; i< data.length; i++){
      // console.log(data[i]["sha"])

          sha = "commits/" + data[i]["sha"] ;
          //print(sha)
          apiReturnData = getURL_API(inputUrl, sha);
//          console.log(apiReturnData)
          // calling the another server call to get the data for each commits
          request = new XMLHttpRequest();
          request.open('GET', apiReturnData, false);
          request.onload = function(){
              // console.log(this.response);
              myObj = JSON.parse(this.response);
//              console.log(myObj)
              shaRequestData.push(myObj)
              // files = myObj["files"]
              // for(i = 0; i< array_of_file.length; i++){
              //    for(j =0; j< files[i].length; j++){
              //       // if(files[j])
              //    }
              //
              // }
              // console.log(myObj["files"])
              // console.log(this.response)
              // let data = JSON.stringify(myObj);
              // console.log(data);
          }

          request.send();

      }

//      console.log(shaRequestData)
      let file_store_data = JSON.stringify(shaRequestData)
             // / console.log(last_commit_date);
      if(localStorage){
            localStorage.setItem("file_data", file_store_data);
                  // localStorage.setItem("last_commit_date",last_commit_date);
       }
      }
//       //
//       // for(i = 0; i< array_of_file.length; i++){
//       //    for(j =0; j< shaRequestData[i]["files"].length; j++){
//       //         if array_of_file[shaRequestData[i][author]] == undefined {
//       //            array_of_file[shaRequestData[i][author]] = {"count" : 1, array_of_file["files"]["filename"]: 1}
//       //
//       //
//       //
//       //         }
//       //         else{
//       //             if array_of_file[shaRequestData[i][author]][array_of_file["files"]["filename"]] == undefined {
//       //                   array_of_file[shaRequestData[i][author]][array_of_file["files"]["filename"]] = 1
//       //                   array_of_file[shaRequestData[i][author]]["count"] +=1
//       //
//       //             }
//       //             else{
//       //                   array_of_file[shaRequestData[i][author]][array_of_file["files"]["filename"]] +=1
//       //                   array_of_file[shaRequestData[i][author]]["count"] +=1
//       //             }
//       //         }
//       //
//       //    }
//       //
//
//
//
// Using the stored data of the files to extracted each members contribution in the files
 function using_the_file_data(){
   let file_data= {}
   let array_of_file = {}
   let fileName = ""
   let authorName = ""
   let seperate_file_details = {}
   let  unique_file_dict = {}
   let = false
   if(localStorage){
       file_data =  JSON.parse(localStorage.getItem("file_data"));

      // localStorage.setItem("last_commit_date",last_commit_date);
   }
   // Getting each commit files changes
   for(i = 0; i< file_data.length; i++){
   // looping through the each file changes
          for(j =0; j< file_data[i]["files"].length; j++){
                // Find is the variable if it is new filename
                  find = false
                  // Author name
                  authorName = file_data[i]["commit"]["author"]["name"]
                  // console.log(authorName)
                  // storing the unique file in the dictionary with the count
                  fileName = file_data[i]["files"][j]["filename"]
                  if (seperate_file_details[fileName] == undefined ){
                         // unique_file_dict = {fileName: file_data[i]["files"][j]["filename"], "count": 1}
                         seperate_file_details[fileName] ={}
                         seperate_file_details[fileName].file = fileName;
                         seperate_file_details[fileName].count = 1;
                  }
                  else{
                    // seperate_file_details[fileName].file = file_data[i]["files"][j]["filename"]
                    seperate_file_details[fileName].count++;
                  }

                  // If it is new Author name then make a new dictionary for it
                   if (array_of_file[authorName] == undefined) {
                      // console.log(file_data[i]["files"][j]["filename"]);
                      // Getting the fileName
                      fileName = file_data[i]["files"][j]["filename"];
                      // creating new dict for the unique author name
                      array_of_file[authorName]= {}
                      // array of the files per unique author name
                      file_per_author_array = []
                      // creating an unique dict for each unique file Name
                      if(file_data[i]["author"] != null){
                        unique_file_dict.loginId = file_data[i]["author"]["id"]
                      }
                      else{
                        unique_file_dict.loginId = null
                      }
                      // Appending each file name into the array of each author
                      file_per_author_array.push(unique_file_dict)
                      filedict = {"count": 1, "fileName" : file_per_author_array}
                      // Assigning the array into the author
                      array_of_file[authorName].file = file_per_author_array


                    }
                    // If the author exist then check if file exist or not
                  else{
                        // console.log(array_of_file)

                        fileName = file_data[i]["files"][j]["filename"];
                        // console.log(fileName)
                        // If the author exist looping through the file array of the files
                        for(let k = 0; k < array_of_file[authorName]["file"].length; k++){

                          // console.log( array_of_file[authorName]["file"][k]["fileName"])

                              if (array_of_file[authorName]["file"][k]["fileName"] == fileName){
                                    console.log("increment in the count:")
                                     array_of_file[authorName]["file"][k]["count"]  = array_of_file[authorName]["file"][k]["count"] + 1;
                                     find = true
                                     break
                              }


                        }
                        // If it is a unique file, that was not found in the array of the files of the author then append in the array of the files
                        if(!find){

                               unique_file_dict = {fileName: fileName, "count": 1}
                               // file_per_author_array.push(unique_file_dict)
                               array_of_file[authorName]["file"].push(unique_file_dict)


                        }
                  }
            }
        }

         console.log(array_of_file)
         // sorted on the basis of the count of the array of unique file
         // seperate_file_details.sort()

         var sortable = [];
         for (var file in seperate_file_details) {
             sortable.push([file, seperate_file_details[file]["count"]]);
         }

         sortable.sort(function(a, b) {
             return b[1] - a[1];
         });

         console.log(sortable);



           if(localStorage){
              localStorage.setItem("file_data_for_each_member", JSON.stringify(array_of_file));
              localStorage.setItem("unique_file_details_in_sorted_order", JSON.stringify(sortable));
            // localStorage.setItem("last_commit_date",last_commit_date);
          }

}


           //

           //
           //
           //
           // else{
           //     if array_of_file[shaRequestData[i][author]][array_of_file["files"]["filename"]] == undefined {
           //           array_of_file[shaRequestData[i][author]][array_of_file["files"]["filename"]] = 1
           //           array_of_file[shaRequestData[i][author]]["count"] +=1
           //
           //     }
           //     else{
           //           array_of_file[shaRequestData[i][author]][array_of_file["files"]["filename"]] +=1
           //           array_of_file[shaRequestData[i][author]]["count"] +=1
           //     }
           // }
