const bombChar   = 'B';
const openCell   = ' ';
const closedCell = '-';

class Cell {
    constructor(id){
        this._id = id;
        this._neighbours = [];
        this._bombsClose = 0;
        this._isBomb = false;
        this._isOpened = false;
    }
    get id(){
        return this._id;
    }
    get neighbours (){
        return this._neighbours;
    }
    get bombsClose(){
        return this._bombsClose;
    }
    get isBomb(){
        return this._isBomb;
    }
    get isOpened(){
        return this._isOpened;
    }
    set neighbours (arr){
        this._neighbours = arr;
    }
    set bombsClose(num){
        this._bombsClose = num;
    }
    toggleBomb (){
        this._isBomb = !this._isBomb;
    }
    toggleOpened(){
        this._isOpened = !this._isOpened;
    }
}
class Field {
    constructor(field = [[]]){
        this._field = field;
        this._lives = 3;
    }
    get field (){
        return this._field;
    }
    get lives () {
        return this._lives;
    }
    set lives(lives){
        this._lives = lives;
    }

    runGame(){
        this.getNeighbours();
        this.getBombsClose();
        let gameOver = false;
        console.log('Hi, welcome to the Mine Field');
        console.log('You have 3 lives to open all cells without exploding the mines');
        console.log('Good luck!\n\n\n\n');
        this.print();
        while(gameOver === false){
            this.userPlay();
            console.log(`You have ${this.lives} live(s) left!`);
            this.print();
            const closedCells = this.getClosedCells().join();
            const bombList = this.getBombList().join();
            if(this.lives === 0){
                console.log('You have lost all of your lives');
                gameOver = true;
            }
            if(closedCells === bombList){
                console.log('Congrats you won!');
                gameOver = true;
            }   
            console.log('************************************');
        }
    }


    static generateField(height,width,bombs){
        const field = [];
        let bombsIndex = new Array(bombs);
        for(let i = 0; i < bombs; i ++){
            const randomNumber = Math.floor(Math.random()*(height*width));
            if(bombsIndex.some(element => element === randomNumber)){
                i--;
            }
            else{
                bombsIndex[i] = randomNumber;
            }          
        }
        let counter = 0;
        for(let i = 0; i < height; i++){
            field.push([]);
            for(let j = 0; j < width; j++){
                const cell = new Cell([i,j]);
                field[i].push(cell);
                this.bomList = [];
                if(bombsIndex.some(element => element === counter)){
                    field[i][j].toggleBomb();
                }
                counter++;
            }       
        }
        return field;
    }

    print() {
        let string = ' ';
        for(let i = 0; i<this.field[0].length; i++){
            string += ' ' + i;
        }
        string+='\n';
        for(let i = 0; i<this.field.length;i++){  
            string+=i + " ";        
            for(let j = 0; j< this.field[i].length; j++){
                if(this.field[i][j].isOpened === false){
                    string+=closedCell + ' ';
                }
                else if(this.field[i][j].bombsClose !== 0){
                    string+=this.field[i][j].bombsClose + ' ';
                }
                else if(this.field[i][j].isBomb){
                    string+=bombChar + ' ';
                }
                else{
                    string+=openCell + ' ';
                }
            }
            string +='\n';
        }
        console.log(string);
    }

    getClosedCells (){
        const closedCells = [];
        for(let i = 0;i < this.field.length; i++){
            for(let j = 0; j < this.field[0].length; j++){
                if(!this.field[i][j].isOpened){
                    closedCells.push(this.field[i][j].id);
                }
                if(this.field[i][j].isOpened && this.field[i][j].isBomb){
                    closedCells.push(this.field[i][j].id);
                }
            }
        }
        return closedCells;
    }

    openCell(x,y){
        this.field[x][y].toggleOpened();
    }
    checkPlay (x,y){
        if(x > this.field.length ||
           y > this.field.length ||
           x < 0                 ||
           y < 0                    ){
            console.log("Please choose a valid coordenate");
            return false;
        }
        if(this.field[x][y].isOpened){
            return false;
        }
        this.openCell(x,y);
        if(this.field[x][y].isBomb){
            this.lives--;
            return true;
        }
        if(this.field[x][y].bombsClose === 0){
            for(let neighbour of this.field[x][y].neighbours){
                this.checkPlay(neighbour[0],neighbour[1]);
            }
            return true;
        }
        return true;
        
    }

    userPlay(){
        let x = prompt("Choose your X coordenate");
        let y = prompt("Choose your Y coordenate");
        console.log(`You choose - ${x} | ${y}.`);
        if(!this.checkPlay(x,y)){
            this.userPlay();
        }

    }

    getBombList() {
        const bombList = [];
        for(let i = 0; i < this.field.length; i++){
            for(let j = 0; j < this.field[0].length; j++){
                if(this.field[i][j].isBomb){
                    bombList.push(this.field[i][j].id);
                }
            }
        }
        return bombList;
    }

    getNeighbours(){
        const listNb = [];
        const checks = [-1,0,1];
        for(let i = 0; i < this.field.length; i++){
            for(let j = 0; j < this.field[0].length; j++){
                let cell = this.field[i][j];
                for (let k = 0; k< checks.length;k++){
                    for(let l = 0; l < checks.length; l++){
                        let newX = i + checks[k];
                        let newY = j + checks[l];
                        if(newX >= 0 &&
                           newY >= 0 &&
                           newX < this.field.length &&
                           newY < this.field[0].length){
                            let newNeighbour = [newX,newY];
                            if(newNeighbour.join() !== cell.id.join()){
                                cell.neighbours.push([newX,newY]);
                            }        
                        }
                    }
                }
                
            }
        }
    }

    getBombsClose() {
        let bombList = this.getBombList();
        for(let bomb of bombList){
            let neighbours = this.field[bomb[0]][bomb[1]].neighbours;
            for(let neighbour of neighbours){
                if(!this.field[neighbour[0]][neighbour[1]].isBomb){
                    this.field[neighbour[0]][neighbour[1]].bombsClose++;
                }
            }
        }
    }

}

const myField = new Field(Field.generateField(10,10,5));
myField.runGame();