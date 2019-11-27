function settime() {
    const date = new Date()
    const formattedHour =date.getHours() +"<span class='blink'>:</span>" + (date.getMinutes() < 10 ? '0': '' ) + date.getMinutes()
    document.querySelector(".hour h2").innerHTML = formattedHour
}

function getAPIData() {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4){
            const data = JSON.parse(xhr.responseText);
            const metros = data.result.metros.length;
            const rers = data.result.rers.length;
            const tramways = data.result.tramways.length;

            let hasProblem =false

            for (let i = 0 ; i< rers; i++){
                if(data.result.rers[i].slug === 'critical'){
                    hasProblem =true
                }
                //console.log(data.result.metros[i])
            }

            for (let i = 0 ; i< metros; i++){
                if(data.result.metros[i].slug === 'critical'){
                    hasProblem =true
                }
                //console.log(data.result.metros[i])
            }
            for (let i = 0 ; i< tramways; i++){
                if(data.result.tramways[i].slug === 'critical'){
                    hasProblem =true
                }
                //console.log(data.result.metros[i])
            }

            document.querySelector('.status h1').innerHTML = hasProblem ? 'Incidents' : 'Trafic normal '
            templateType('rers',data.result.rers)
            templateType('metros',data.result.metros)
            templateType('tramways',data.result.tramways)

            showProblems(data.result);

        }
    }
    xhr.open('GET', 'https://api-ratp.pierre-grimaud.fr/v4/traffic');
    xhr.send()
}
function templateType(type,data){
    let template = document.querySelector('.lines--'+type);
    template.innerHTML = '<div class="col-sm-2 text-center">' + type + '</div>'
    const lines = data.length
    for (let i = 0 ; i< lines; i++){
        template.innerHTML +='<div class="col-sm-2 text-center '+ getBackgroundcolor(data[i].slug)+' ">' + data[i].line + '</div>'
    }

}
function getBackgroundcolor(slug){
    switch(slug) {
        case 'critical':
            return 'line--critical';
            break;
        case 'normal_trav':
            return 'lines--works';
            break;
        case 'normal':
        default:
            return '';
            break;
    }
}
function showProblems(data){
    const linesType = [
        'rers',
        'metros',
        'tramways',
    ]
    for(let i=0;i<linesType.length;i++){
        const lineType = linesType[i]

        for(let j=0;j<data[lineType].length;j++){

            const line = data[lineType][j]
            if(line.slug !== 'normal'){
                templateProblem(lineType,line)
            }
        }
    }
}
function templateProblem(lineType,line){
    let template =document.querySelector('.col--trafic')
    template.innerHTML +='<div class="row">' +
        '<div class="col-sm-4">'+lineType +' '+ line.line+ '</div>'+
        '<div class="col-sm-8">'+line.message+ '</div>'+
        '</div>'
}


// heure
settime()
setInterval(function(){
    settime()
},1000)


getAPIData()