function getColours(number, other_members){
    let colours = []; 
    if (other_members === true){
        number = number -1
    }
    let documentColours = ['#4e73df', '#1cc88a', '#36b9cc', '#9932cc']
    for (let i =0; i<number; i++){
        colours.push(documentColours[i%documentColours.length]);
    }
    if (other_members === true){
        colours.push('#D3D3D3')
    }
    return colours;
}

function darkenColour(coloursList, other_members){
    let darkenedList = [];
    let number;
    if (other_members == true){
        number = coloursList.length-1;
    }
    else{
        number = coloursList.length;
    }
    let darkerList = ['#224abe', '#13855c', '#258391', '#9400D3']
    for (let i =0; i<number; i++){
        darkenedList.push(darkerList[i%coloursList.length]);
    }
    if (other_members === true){
        darkenedList.push('#A9A9A9');
    }
    return darkenedList;
}

function pieChartData(member_list, commits, issues_array){
    let top_members = [];
    let top_commits = [];
    let top_issues = [];
    let other_issues = 0;
    let other_total =0;
    let other_members = false
    let length = member_list.length
    if (length >= 10){
        for (i =length-9; i<length; i++){
            top_members.push(member_list[i]);
            top_commits.push(commits[i]);
        }
        for (i=0; i<length-9; i++){
            other_total += commits[i];
        }
        for (i =length-9; i<length; i++){
            top_issues.push(issues_array[i]);
        }
        for (i=0; i<length-9; i++){
            other_issues += issues_array[i];
        }
        top_members.push("Other");
        other_members = true;
        top_commits.push(other_total);
        top_issues.push(other_issues);
    }
    else{
        top_members = member_list;
        top_commits = commits;
        top_issues = issues_array;
    }
    let colours = getColours(top_members.length, other_members);
    let darkenedColours = darkenColour(colours, other_members);
    pieChartLegend(top_members, other_members);

    // Pie Chart 
    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        
        labels: top_members,
        datasets: [{
          data: top_commits,
          title: "",
          label: "total commits",
          backgroundColor: colours,
          hoverBackgroundColor: darkenedColours,
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        aspectRatio: 2.2,
        tooltips: {
          bodyFontSize: 14,
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
          callbacks: {
            title: function(tooltipItem, chart){
                return chart.labels[tooltipItem[0].index];
            },
            label: function(tooltipItem, chart) {
                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                let total =0;
             let total_commits =chart.datasets[tooltipItem.datasetIndex].data;
                for (i=0; i<total_commits.length; i++){
                    total += total_commits[i];
                }
                let data = chart.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
                let percentage = data/total * 100;
                percentage =percentage.toFixed(2);
              return  [[data+" " + datasetLabel],[percentage +"% of team commits"],["Issues: "+top_issues[tooltipItem.index]]];
            }
          },
          titleFontSize: 16,
          titleFontColor: '#808080',
        },
        legend: {
          display: false
        },
        cutoutPercentage: 60,
      },
    });
    
    //code for bar chart
    
    return myPieChart;
}

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function pieChartLegend(members_names, other_members){
    let output = document.getElementById("MembersPieChart");
    let colours = ['primary', 'success', 'info', 'violet'];
    output.innerHTML = "";
    output.innerHTML += "<br><br><br>";
    let number;
    if (other_members === true){
        number = members_names.length-1
    }
    else{
        number = members_names.length
    }
    for (let i=0; i<number; i++){
        output.innerHTML += "<span class='mr-2'><i class='fas fa-circle text-" + colours[i%4]+ "'></i>" + members_names[i] + "</span>";
    }
    if (other_members === true){
        output.innerHTML += "<span class='mr-2'><i class='fas fa-circle text-" + "gray" + "'></i>" + "Other" + "</span>";
    }
}

function lineChartData(dataPoints){
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12"],
        datasets: [{
          label: "Number of Commits",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: dataPoints,
        }],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              maxTicksLimit: 5,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return number_format(value);
              }
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          bodyFontSize: 14,
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 16,
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: 'index',
          caretPadding: 10,
          callbacks: {
            label: function(tooltipItem, chart) {
              var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
              return datasetLabel +": " +number_format(tooltipItem.yLabel);
            }
          }
        }
      }
    });
    return myLineChart;
}

function individualLineChartData(dataPoints, show_commits){
    var ctx = document.getElementById("chart_member");
    let data;
    if (show_commits === true){
        data = [{
          label: "Number of Commits",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: dataPoints[0],
        }];
    }
    else{
        data = [{
          label: "Number of Additions",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "#1cc88a",
          pointRadius: 3,
          pointBackgroundColor: "#1cc88a",
          pointBorderColor: "#1cc88a",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "#13855c",
          pointHoverBorderColor: "#13855c",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: dataPoints[1],
        },{
          label: "Number of Deletions",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "#e74a3b",
          pointRadius: 3,
          pointBackgroundColor:  "#e74a3b",
          pointBorderColor:  "#e74a3b",
          pointHoverRadius: 3,
          pointHoverBackgroundColor:"#8B0000",
          pointHoverBorderColor: "#8B0000",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: dataPoints[2],
        }];
    }
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12"],
        datasets: data,
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              maxTicksLimit: 5,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return number_format(value);
              }
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          bodyFontSize: 14,
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 16,
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: true,
          intersect: false,
          mode: 'index',
          caretPadding: 10,
          callbacks: {
            label: function(tooltipItem, chart) {
              var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
              return datasetLabel +": " +number_format(tooltipItem.yLabel);
            }
          }
        }
      }
    });
    return myLineChart;
}

//var barOptions_stacked = {
//    tooltips: {
//        enabled: false
//    },
//    hover :{
//        animationDuration:0
//    },
//    scales: {
//        xAxes: [{
//            ticks: {
//                beginAtZero:true,
//                fontFamily: "'Open Sans Bold', sans-serif",
//                fontSize:11
//            },
//            scaleLabel:{
//                display:false
//            },
//            gridLines: {
//            }, 
//            stacked: true,
//            barPercentage: 1.0,
//            categoryPercentage: 0.4
//        }],
//        yAxes: [{
//            gridLines: {
//                display:false,
//                color: "#fff",
//                zeroLineColor: "#fff",
//                zeroLineWidth: 0
//            },
//            ticks: {
//                fontFamily: "'Open Sans Bold', sans-serif",
//                fontSize:11
//            },
//            stacked: true, 
//            barPercentage: 0.8,
//            categoryPercentage: 0.7
//        }]
//    },
//    legend:{
//        display:false
//    },
//    
//    animation: {
//        onComplete: function () {
//            var chartInstance = this.chart;
//            var ctx = chartInstance.ctx;
//            ctx.textAlign = "left";
//            ctx.font = "9px Open Sans";
//            ctx.fillStyle = "#fff";
//
//            Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
//                var meta = chartInstance.controller.getDatasetMeta(i);
//                Chart.helpers.each(meta.data.forEach(function (bar, index) {
//                    data = dataset.data[index];
//                    if(i==0){
//                        ctx.fillText(data, 50, bar._model.y+4);
//                    } else {
//                        ctx.fillText(data, bar._model.x-25, bar._model.y+4);
//                    }
//                }),this)
//            }),this);
//        }
//    },
//    pointLabelFontFamily : "Quadon Extra Bold",
//    scaleFontFamily : "Quadon Extra Bold",
//};

function barChartData(topMembers, topCommits){
    var ctx = document.getElementById("myBarChart");
    var barChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: topMembers,
            mode: 'single',
            datasets: [{
                data: topCommits[0],
                backgroundColor: "rgba(63,103,126,1)",
                hoverBackgroundColor: "rgba(50,90,100,1)"
            },{
                data: topCommits[1],
                backgroundColor: "#1cc88a",
                hoverBackgroundColor: "#13855c"
            },{
                data: topCommits[2],
                backgroundColor: "#e74a3b",
                hoverBackgroundColor: "#8B0000"
            }]
        },

        options: {
            tooltips: {
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              bodyFontSize: 14,
              titleMarginBottom: 10,
              titleFontColor: '#6e707e',
              titleFontSize: 16,
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: true,
              intersect: false,
              mode: 'index',
              caretPadding: 10,
              callbacks: {
                label: function(tooltipItem, chart) {
                    let captions = ["Commits", "Additions", "Deletions"]
                  var data = captions[tooltipItem.datasetIndex]
                  return data +": "+tooltipItem.value;
                }
              }
            },
            hover :{
                animationDuration:0
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero:true,
                        fontFamily: "'Open Sans Bold', sans-serif",
                        fontSize:11
                    },
                    scaleLabel:{
                        display:false
                    },
                    gridLines: {
                    }, 
                    stacked: true,
                    barPercentage: 1.0,
                    categoryPercentage: 0.4
                }],
                yAxes: [{
                    gridLines: {
                        display:false,
                        color: "#fff",
                        zeroLineColor: "#fff",
                        zeroLineWidth: 0
                    },
                    ticks: {
                        fontFamily: "'Open Sans Bold', sans-serif",
                        fontSize:11
                    },
                    stacked: true, 
                    barPercentage: 0.8,
                    categoryPercentage: 0.7
                }]
            },
            legend:{
                display:false
            },

        },
    });
    return barChart;
}
