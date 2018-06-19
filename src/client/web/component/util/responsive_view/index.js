
export function check_device_type(){
    let width = window.innerWidth;
    let result = 1;
    switch(true) {
        case width <= 450:
            result = 1;  //iphone
            break;
        case width <= 1050://ipad pro 
            result = 2; 
            break;
        case width <= 1600:
            result = 3;  //wide-screen 
            break;
        default:
            result = 4; // 4K
    }
    return result;
}

export function Responsive_Column_Filter(columns) {
    let device_type  = check_device_type();
    let result = [];
    columns.map((item)=>{
        if (item.display_priority <= device_type) {
            result.push(item);
        }
    });
    return result;
}