const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Place {
  constructor (id){
    this._id = id;
    this._isHat = false;
    this._isHole = false;
    this._visited = false;
    this._arrPos = [];
  }
  get id(){
    return this.id;
  }
  get char(){
    return this._char;
  }
  get visited() {
    return this._visited;
  }
  isHat (){
    return this._isHat;
  }
  isHole (){
    return this._isHole;
  }
  setHat (){
    this._isHat = true;
  }
  setHole (){
    this._isHole = true;
  }
  setVisited(){
    this._visited = true;
  }

}

class Field {
  constructor (field){
    this._field = field;
    this._height = 0;
    this._width = 0;
  }

  print (){
    let field = this._field;
    let print = '';
    for(let i = 0; i < field.length;i++){
      for(let j = 0; j < field[i].length; j++){
        let pos = field[i][j];
        if(pos.isHat()) {
          print += hat;
        }
        else if(pos.isHole()) {
          print += hole;
        }
        else if(pos.visited) {
          print += pathCharacter;
        }
        else print += fieldCharacter;
      }
      print += '\n';
    }
    console.log(print);
  }

  generateField(height,width,holes){
    const arr = [[]];
    this._height = height;
    this._width = width;
    let totalChars = height*width;
    let holesList = [];
    let totalBombs = Math.ceil(totalChars*(holes/100)) + 1;
    for(let i = 0;i < totalBombs; i++){
      let randomNumber = Math.floor(Math.random()*totalChars)+1;
      if(holesList.some(element => element === randomNumber || randomNumber === 1)){
        i--;
      }
      else{
        holesList.push(randomNumber);
      } 
    }

    let counter = 1;

    for(let i = 0; i<height; i++){
      arr.push([]);
      for(let j = 0; j<width; j++){
        let place = new Place(counter);
        arr[i].push(place);
        if(holesList.some(element => element === counter)){
          if(counter === holesList[holesList.length-1]){  
            arr[i][j].setHat();
          }
          else {
            arr[i][j].setHole();
          }
        }
        else if (counter === 1){
          arr[i][j].setVisited();
        }        

        arr[i][j]._arrPos = [i,j];
        counter++;
      }
    }
    this._field = arr;
  }
}

const checkPosition = (position,field) => {
  let x = position[0];
  let y = position[1];
  if(position.some(element => element < 0)){
    return false;
  }
  if(position[0] >= field._height || position[1] >= field._width){
    return false;
  }
  if(field._field[x][y].isHole()){
    return false;
  }
  return true;
}

const moveNextPlace = (mov,initialPosition) => {
  if(mov === 'u'){
    initialPosition[0] -= 1;
  }
  else if(mov === 'd'){
    initialPosition[0] += 1;
  }
  else if(mov === 'l'){
    initialPosition[1] -= 1;
  }
  else if(mov === 'r'){
    initialPosition[1] += 1;
  }
  else {
    return 'Invalid Movement';
  }
  return initialPosition;
}

const updatePath = (position,field) => {
  let x = position[0];
  let y = position[1];
  field._field[x][y].setVisited();
}

const checkForHat = (position,field) => {
  let x = position[0];
  let y = position[1];
  return field._field[x][y].isHat();
}
const myField = new Field([[]]);

myField.generateField(5,10,20);
myField.print();
let gameOver = false;


let currPosition = [0,0];


while (!gameOver){
let input = prompt('Selecione uma direcao -> ');
currPosition = moveNextPlace(input,currPosition);
if(!checkPosition(currPosition,myField)){
  gameOver = true;
  console.log('Game Over');
}
else{
  updatePath(currPosition,myField);
  myField.print();
  if(checkForHat(currPosition,myField)){
    console.log('You found the hat!')
    gameOver = true;
  }

}
}
