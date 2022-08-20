function parse(file, offset) {
    let array = file.split("\n");
    let notelist = [];
    let notelistt = [];
    let notelistc = [];
    let depth = 0;
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.startsWith("t")) {
            notelistt.push({
                "line": depth,
                "ty": (element.split(",")[0]),
                "st": parseInt(element.split(",")[1]) + offset,
                "pos": parseInt(element.split(",")[2]),
                "hit": false
            });
        }
        if (element.startsWith("c")) {
            notelistc.push({
                "line": depth,
                "ty": (element.split(",")[0]),
                "st": parseInt(element.split(",")[1]) + offset,
                "pos": parseInt(element.split(",")[2]),
                "hit": false
            });
        }
        depth++;
    }
    notelist.push(notelistt);
    notelist.push(notelistc)
    console.log(notelist);
    return notelist;
}