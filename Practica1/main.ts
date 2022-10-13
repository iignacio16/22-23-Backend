try{
    const arr= [1,["2",["3",0]]];
    function aplanar(a:any):number[] {
    const b = a.flat(Infinity).map(Number);
    return b
}
console.log(arr)
const array = aplanar(arr);
console.log(array)
const producto: number[] = array.map((element,index)=>{
    let product = 1;
    array.forEach((elemento,indice)=>{
            if(indice !== index){
                product = product*elemento
            }
        })
        return product
})
console.log(producto)

}catch(e){
    console.log(e);
}