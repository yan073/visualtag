function find_adjacents(leaves) { 
    var adjacent = {};
    for(i = 0; i< leaves.length; i++) {
        adjacent[i] = [];
    }    
    for(var i = 0; i< leaves.length - 1; i++) {
        let rect1 = leaves[i].getBoundingClientRect();
        for(var j=i+1; j < leaves.length; j++ ) {
            if (is_adjacent(rect1, leaves[j].getBoundingClientRect() )){
                adjacent[i].push(j);
                adjacent[j].push(i);
            }
        }
    }
    return adjacent;
}