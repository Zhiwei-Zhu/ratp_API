function settime() {
    const date = new Date()
    const formattedHour =date.getHours() +"<span class='blink'>:</span>" + (date.getMinutes() < 10 ? '0': '' ) + date.getMinutes()
    console.log(formattedHour)
    document.querySelector(".hour h2").innerHTML = formattedHour
}

function getAPIData() {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4){
            const data = JSON.parse(xhr.responseText);
            const metros = data.result.metros.length;
            const rers = data.result.rers.length;

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

            document.querySelector('.status h1').innerHTML = hasProblem ? 'Incidents' : 'Trafic normal '
            templateType('rers',data.result.rers)
            templateType('metros',data.result.metros)

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
    console.log(data)

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


// heure
settime()
setInterval(function(){
    settime()
},1000)


getAPIData()