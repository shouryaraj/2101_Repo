// API data for members page
// function getURL_member(inputURL, information){
//     input = inputURL.replace("https://github.com/","");
//     input = input.replace(".git","");
//     let apidata = "https://api.github.com/repos/" + input + "/" + information + '?access_token=dc4de003288be13bc5b89e829c1b04fcbd8ef316';
//     return apidata;
// }

// function getContributions(URL, output){
//   output.innerHTML += "<b>Contributed files by each member <br></b>"
//   let let apidata = getURL(URL, "contributors");
//   let request = new XMLHttpRequest();
//   request.open('GET', apidata, true);
//   request.onload = function(){
//   let data = JSON.parse(this.response);
//   // checkpoint
// // Retriving the stored URL storage from the local storage

//Function to retrieve the URL from the localStorage
// function getURL(){
//
// 	  var URL = localStorage.getItem('URL')
// 	  return URL
//
// }
// Dummy function to check the api working
// function dummy_storage(){
//      var URL = "https://github.com/github/scientist";
//      localStorage.setItem('URL', URL);
// }


// Function for API call and the storing the data in the local storage
//function get_total_commits(input){
//
////    input =input.replace("https://github.com/","");
////    input = input.replace(".git","");
////    console.log(input);
////    let apidata = "https://api.github.com/repos/" + input + "/stats/contributors";
////
////    let request = new XMLHttpRequest();
////    request.open('GET', apidata, true);
////    request.onload = function(){
//    	// console.log(this.response);
//    	var myObj = JSON.parse(this.response);
//        let data = JSON.stringify(myObj);
//        if(localStorage){
//        	localStorage.setItem("response", data)
//        }
//
//        // data.forEach(member => {
//        //     let member_request = new XMLHttpRequest();
//
//        //     member_request.open('GET', "https://api.github.com/users/" + member["login"], true);
//        //     member_request.onload = function(){
//        //         let data = JSON.parse(this.response);
//        //         console.log(data);
//        //     }
//        //     member_request.send();
//
//
//        // })
//    }
//    request.send();
//
//
//}
// Displaying the data on the web page for the total commits using the local storage
// var Current_Index = 0;
let individual_line_chart;

function display_data(){

   // getting the data from the local storage
    let value = localStorage.getItem("contributors");
    console.log(value);
    let array = JSON.parse(value);

    let nameArray = JSON.parse(localStorage.getItem("names"));


   // console.log(value)
   // //sconsole.log(array)
   // console.log(array);
    var html = '<div class="card bg-primary text-white shadow"><div class="card-body"><div class="text-white-70 small">';
    var html_end = '</br></div></div></div>'
    for(var i=array.length - 1; i >-1; i--){
         	var block_to_insert ;
      	  var container_block ;

        	block_to_insert = document.createElement( 'div' );
        	block_to_insert.className = "col-lg-6 mb-4"
          block_to_insert.id = i;
          block_to_insert.setAttribute("onclick","member_index_in_the_data(this.id)");

        	block_to_insert.innerHTML = html+'<br>Name: '+nameArray[i]+'</br>Login Id: '+array[i].author.login+'<br>Total commits:  '+array[i].total+html_end;

        	container_block = document.getElementById( 'member-info');
        	container_block.appendChild( block_to_insert );
  }
}

function member_index_in_the_data(id){
  //  this.Current_Index= id;
    if(localStorage){
      localStorage.setItem("individual_Index_for_member_page", JSON.stringify(id))
    }

    window.location.href='member.html';
  }
