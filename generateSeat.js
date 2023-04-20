function generateSeat(start,end,noOfRows){
    let ASCIIStart = start.charCodeAt();
    let ASCIIEnd = end.charCodeAt();
    let seats = []
    for(let ascii = ASCIIStart; ascii <= ASCIIEnd; ascii++){
        
        for(let i =0;i<=noOfRows;i++){
            const eachSeat = {seatId:`${String.fromCharCode(ascii)}${i}`,isAvailable:true};
            seats.push(eachSeat)
        }
    }
    return(JSON.stringify( seats))
}
console.log(generateSeat("a","f",10))

/*'[{"seatId":"a0","isAvailable":true},{"seatId":"a1","isAvailable":true},{"seatId":"a2","isAvailable":true},{"seatId":"a3","isAvailable":true},{"seatId":"a4","isAvailable":true},{"seatId":"a5","isAvailable":true},{"seatId":"a6","isAvailable":true},{"seatId":"a7","isAvailable":true},{"seatId":"a8","isAvailable":true},{"seatId":"a9","isAvailable":true},{"seatId":"a10","isAvailable":true},{"seatId":"b0","isAvailable":true},{"seatId":"b1","isAvailable":true},{"seatId":"b2","isAvailable":true},{"seatId":"b3","isAvailable":true},{"seatId":"b4","isAvailable":true},{"seatId":"b5","isAvailable":true},{"seatId":"b6","isAvailable":true},{"seatId":"b7","isAvailable":true},{"seatId":"b8","isAvailable":true},{"seatId":"b9","isAvailable":true},{"seatId":"b10","isAvailable":true},{"seatId":"c0","isAvailable":true},{"seatId":"c1","isAvailable":true},{"seatId":"c2","isAvailable":true},{"seatId":"c3","isAvailable":true},{"seatId":"c4","isAvailable":true},{"seatId":"c5","isAvailable":true},{"seatId":"c6","isAvailable":true},{"seatId":"c7","isAvailable":true},{"seatId":"c8","isAvailable":true},{"seatId":"c9","isAvailable":true},{"seatId":"c10","isAvailable":true},{"seatId":"d0","isAvailable":true},{"seatId":"d1","isAvailable":true},{"seatId":"d2","isAvailable":true},{"seatId":"d3","isAvailable":true},{"seatId":"d4","isAvailable":true},{"seatId":"d5","isAvailable":true},{"seatId":"d6","isAvailable":true},{"seatId":"d7","isAvailable":true},{"seatId":"d8","isAvailable":true},{"seatId":"d9","isAvailable":true},{"seatId":"d10","isAvailable":true},{"seatId":"e0","isAvailable":true},{"seatId":"e1","isAvailable":true},{"seatId":"e2","isAvailable":true},{"seatId":"e3","isAvailable":true},{"seatId":"e4","isAvailable":true},{"seatId":"e5","isAvailable":true},{"seatId":"e6","isAvailable":true},{"seatId":"e7","isAvailable":true},{"seatId":"e8","isAvailable":true},{"seatId":"e9","isAvailable":true},{"seatId":"e10","isAvailable":true},{"seatId":"f0","isAvailable":true},{"seatId":"f1","isAvailable":true},{"seatId":"f2","isAvailable":true},{"seatId":"f3","isAvailable":true},{"seatId":"f4","isAvailable":true},{"seatId":"f5","isAvailable":true},{"seatId":"f6","isAvailable":true},{"seatId":"f7","isAvailable":true},{"seatId":"f8","isAvailable":true},{"seatId":"f9","isAvailable":true}]'
*/