function generateRandomNumber(max,min){
    return Math.floor(Math.random() * (max - min))+ min;
}
export {generateRandomNumber};