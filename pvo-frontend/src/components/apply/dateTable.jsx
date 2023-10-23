const dayjs = require('dayjs')

const ROWS = 5;

export default function DateTable({remoteData, applyData, setRemoteData, setApplyData}){
    var year = new Date().getFullYear() + 1;
    var daysInYear = ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;
    var firstDay = new Date(year, 0, 1);

    const tableIds = new Array(ROWS).fill(0).map(() => new Array(daysInYear).fill(0));

    var busyDays = new Array(ROWS).fill(new Set());   
    var rowsApplications = new Array(ROWS).fill(new Array());

    for (let i = 0; i < remoteData.applications.length; i++) {
        var i_begin = dayjs(new Date(Date.parse(remoteData.applications[i]["start_date"]))).diff(dayjs(firstDay), 'day');
        var amount_days = remoteData.applications[i]["amount_days"];
        var id = remoteData.applications[i]["employee_id"];
        var daysSet = new Set(Array.from({length: amount_days}, (x, j) => j + i_begin));

        for (let k = 0; k < busyDays.length; k++) {
            let intersect = new Set([...busyDays[k]].filter(i => daysSet.has(i)));
            if (intersect.length == 0) {
                busyDays[k] = new Set(...busyDays[k], ...daysSet);
                for (let m = 0; m < daysSet.length; m++){
                    tableIds[k][m] = id;
                }
                break;
            }
        }
    }

    return (<></>);
}