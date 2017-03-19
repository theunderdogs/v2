export const functions = {
    getRandomColor : () => {    
        return ['lightblue', 'bluegray', 'cyan', 'teal', 'green', 'orange', 'blue', 'purple'][Math.floor((Math.random() * 8) + 1) - 1];
    }
}