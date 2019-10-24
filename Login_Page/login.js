var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// onclick function for the URL search 
function validateform_login(){
    console.log("bbbbbbbbbbb");
	console.log(document.getElementById("URLbutton"))
    var URL = document.forms["new_API_URL_login"]["URL_login"].value;
    new_url(URL);
    // window.location = "index.html";
    
    
//    if (URL != ""){
//        new_url(URL);
//    }
    
}
// Making an API call for the data, and storing it in the localStorage.
// param: input as string                                                                           
function new_url(input){
   input =input.replace("https://github.com/","");
   input = input.replace(".git","");
   console.log(input);
   let apidata = "https://api.github.com/repos/" + input + "/contributors";
   console.log(apidata);
   let request = new XMLHttpRequest();
   request.open('GET', apidata, true);
   request.onload = function(){
   	console.log(this.response);
       let data = JSON.parse(this.response);

       let storeData = JSON.stringify(this.response);
       console.log(storeData);
       // Storing the overall data in the local storage
         if (localStorage){
            localStorage.setItem("response", storeData)
           }
       data.forEach(member => {
           let member_request = new XMLHttpRequest();

           member_request.open('GET', "https://api.github.com/users/" + member["login"], true);
           member_request.onload = function(){
               let data = JSON.parse(this.response);
               let storeData = JSON.stringify(this.response);
               console.log(storeData);
               // Storing the members data in the local storage
               if (localStorage){
               	localStorage.setItem(member["login"], storeData)
               }

           }
           member_request.send();


       })
   }
   request.send();
   // window.location = "index.html";
}