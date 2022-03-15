export function convertTime ( duration: number )  {
    let seconds = parseInt( (  duration / 1000  % 60 ).toString() ).toString(),
        minutes = parseInt( (  duration / ( 1000 * 60 )  % 60 ).toString() ).toString(),
        hours = parseInt( (  duration / ( 1000 * 60 * 60 )  % 24 ).toString() ).toString()

    hours = Number( hours ) < 10 ? `0${  hours }` : hours
    minutes = Number( minutes ) < 10 ? `0${  minutes }` : minutes
    seconds = Number( seconds ) < 10 ? `0${  seconds }` : seconds

    if ( duration < 3600000 ) {
        return `${ minutes  }:${  seconds }`
    } else {
        return `${ hours  }:${  minutes  }:${  seconds }`
    }
}
