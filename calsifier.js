var lda = require('lda');
var fs = require('fs');



fs.readFile("./1886.txt", "UTF8", function(err, data) {
    if (err) {
        throw err
    };
    var book = data;
    processBook(book)
});


// Example document. 
// var text = 'Cats are small. Dogs are big. Cats like to chase mice. Dogs like to eat bones.';

// // Extract sentences. 
// var documents = text.match(/[^\.!\?]+[\.!\?]+/g);
// console.log(documents)


// Run LDA to get terms for 2 topics (5 terms each). 
// var result = lda(documents, 1, documents.length);
// console.log(result)

function processBook(book) {
    console.log(book.length)

    // Extract sentences. 
    var documents = book.slice(0, 9000).match(/[^\.!\?]+[\.!\?]+/g);
    // var yarray = []
    // documents.forEach(function(document) {
    	// yarray.push(document.replace(/(?:\r\n|\r|\n)/g, ' '));
    // });

    // console.log(yarray)


    // Run LDA to get terms for 2 topics (5 terms each). 
    var result = lda(documents, 1, 100);
    console.log('result: ', result)
}
