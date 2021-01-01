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


function get_diff_color(adjcolors) {
    if (adjcolors === undefined) {
        return 1;
    } else {
        for(var i=1; i<=num_color_space; i++) {
            if (adjcolors.indexOf(i) <0) {
                return i;
            }
        }
        return Math.floor(Math.random() * Math.floor(num_color_space)) + 1;
    }
}

function is_color_different(current, new_c, adjs){
    for(var i=0; i< adjs.length; i++) {
        if (adjs[i]  in colormap) {
            if ( colormap[adjs[i]] == new_c ) return false;
        }
    }
    return true;
}

function is_adjacent(rect1, rect2) {
    if (is_same(rect1.top, rect2.bottom) || is_same(rect1.bottom, rect2.top)){
        return rect1.left > rect2.right || rect1.right < rect2.left ? false : true;
    }
    if (is_same(rect1.left, rect2.right) || is_same(rect1.right, rect2.left)){
        return rect1.top > rect2.bottom || rect1.bottom < rect2.top ? false : true;
    }    
    return false;
}

function is_same(x1, x2) {
    return Math.abs(x1 - x2) < 5;  
}