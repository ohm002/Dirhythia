function parse(file) {
    let array = file.split("\n");
    let notelist = [];
    let depth = 0;
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.startsWith("t")) {
            notelist.push({
                "line": depth,
                "ty" : (element.split(",")[0]), 
                "st" : parseInt(element.split(",")[1]),
                "pos" : parseInt(element.split(",")[2]), 
                "hit" : false
            })
        }
        depth++;
    }
    console.log(notelist);
    return notelist;
}