
export const formatTime = (date: Date): string => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let circatidal = hours >= 12 ? 'PM' : 'AM';

    hours %= 12;
    hours = hours ? hours : 12;
    const sMinutes = minutes < 10 ? '0' + minutes : `${minutes}`;

    return hours + ':' + sMinutes + ' ' + circatidal;
};