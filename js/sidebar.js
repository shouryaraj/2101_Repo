function members_sidebar_init(){
    let contributors =[];
    let data = localStorage.getItem("contributors");
    data = JSON.parse(data);

    let count =0;
    if (data != null){
        data.forEach(contributor => {
        count +=1;
        contributors.push(contributor["author"]["login"]);
    })
    }
    members_sidebar(contributors, count);
}

function members_sidebar(contributors,count){
    data = localStorage.getItem("names");
    data = JSON.parse(data);
    div = document.getElementById('sidebarMember');
    reset_sidebar_member(div);
    for(let i =0; i<count; i++){
        if (contributors[i] != null){
            //changed to add member button for every memeber
            new_member = document.createElement('a');
            new_member.setAttribute('class','collapse-item');
            new_member.setAttribute('href','Member.html');
            new_member.setAttribute('onclick','member_index_in_the_data(' + i + ')');
            new_member.innerHTML = data[i];
            div.appendChild(new_member);
        }
    }
}

//removed the child and reset the sidebar for the new URL search.
function reset_sidebar_member(div){
    console.log(div.childElementCount)
    let child_num = div.childElementCount;
    for (let i = 0; i < child_num; i++){
        child_del = div.lastChild;
        div.removeChild(child_del);
    }

    new_member = document.createElement('a');
    new_member.setAttribute('class','collapse-item');
    new_member.setAttribute('href','Members.html');
    new_member.innerHTML = "All Members";
    div.appendChild(new_member);
    return 0;
}
