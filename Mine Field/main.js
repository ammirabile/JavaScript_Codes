const bombChar   = 'B';
const openCell   = ' ';
const closedCell = '-';

class Cell {
    constructor(id){
        this._id = id;
        this._neiboughrs = [];
        this._bombsClose = 0;
        this._isBomb = false;
        this._isOpened = false;
    }
    get id(){
        return this._id;
    }
    get neiboughrs (){
        return this._neiboughrs;
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
    set neiboughrs (arr){
        this._neiboughrs = arr;
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
        this._bombList = [];
        this._x = 0;
        this._y = 0;
        this._height;
        this._width;
    }
    get field (){
        return this._field;
    }
    get bombList (){
        return this._bombList;
    }
    get x (){
        return this._x;
    }
    get y (){
        return this._y;
    }
    get height (){
        return this._height;
    }
    get width () {
        return this._width;
    }
    set height (height){
        this._height = height;
    }
    set width (width) {
        this._width = width;
    }
    set x(x){
        this._x = x;
    }
    set y(y){
        this._y = y;
    }
    static generateField(height,width,bombs){
        const field = [];
        this.height = height;
        this.width  = width;
        console.log(this.height);
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
                if(bombsIndex.some(element => element === counter)){
                    field[i][j].toggleBomb();
                }
                counter++;
            }       
        }
        return field;
    }

    print() {
        let string = '';
        console.log(this.height);
        for(let i = 0; i<this.height;i++){          
            for(let j = 0; j< this.width; j++){
                if(this._field[i][j].isOpened === false){
                    string+='*';
                }
            }
            string +='\n';
        }
        console.log(string);
      }
}

const myField = new Field(Field.generateField(5,5,5));

myField.print();