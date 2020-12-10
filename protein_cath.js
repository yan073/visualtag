var todo_cells;
var high_priority_todo;
//var colored_adjacents;
var adjacent;
var colors;
var adjacent_colors;

let num_color_space = 3;

function set_leaf_color() {
    let cats = ["leafc1", "leafc2", "leafc3", "leafc4","leafcu"];
    cats.forEach(c => set_color_for_cat(c));
}

function set_color_for_cat(cat){
    todo_cells = [];
    high_priority_todo = [];
    //colored_adjacents = {};
    adjacent = {};
    colors = {};
    adjacent_colors = {};
    
    let leaves = document.getElementsByClassName(cat);
    for(i = 0; i< leaves.length; i++) {
        adjacent[i] = [];
        //colored_adjacents[i] = [];
        adjacent_colors[i] = [];
    }
    // find the adjacents for every cell
    for(var i = 0; i< leaves.length - 1; i++) {
        let rect1 = leaves[i].getBoundingClientRect();
        for(var j=i+1; j < leaves.length; j++ ) {
            if (is_adjacent(rect1, leaves[j].getBoundingClientRect() )){
                adjacent[i].push(j);
                adjacent[j].push(i);
            }
        }
    }

    set_color_to_cell(0, cat, leaves);
    while( (todo_cells.length >0 || high_priority_todo.length >0)) {
        let next = high_priority_todo.length >0 ? high_priority_todo.shift() : todo_cells.shift(); 
        set_color_to_cell(next, cat, leaves)
    }
}

function set_color_to_cell(current, cat, leaves){
    if (! (current in colors)) {
        let level2 = leaves[current].getAttribute('level2');
        console.log('----- coloring ' + level2 + ', for cell ' + current);
        let adjs = adjacent[current];
        let new_c = get_diff_color(current, adjs, colors);
        colors [current] = new_c;
        let colorclass = cat + '_' + new_c;
        leaves[current].classList.add( colorclass );
        process_neighbor_after_coloring(current);

        console.log('---- coloring ' + level2);
        if (level2 != null && level2.length > 0) {
            for(var i = 1; i< leaves.length - 1; i++) {
                if (i!= current) {
                    if (level2 == leaves[i].getAttribute('level2')) {
                        colors [i] = new_c;
                        leaves[i].classList.add( colorclass );
                        process_neighbor_after_coloring(i);
                    }
                }
            }
        }

    }
}

function process_neighbor_after_coloring(current, color){
    let adjs = adjacent[current];
    for(var i=0;i<adjs.length;i++) {
        let acs = adjacent_colors[adjs[i]]
        if ( acs.indexOf(color) <0 ) { 
            acs.push(color);
        }
    }

    for(var i=0;i<adjs.length;i++) {
        let neighbor = adjs[i];
        if(!(neighbor in colors)){
            if (adjacent_colors[neighbor].length >= 2) {
                if(high_priority_todo.indexOf(neighbor) <0) {
                    high_priority_todo.push(neighbor);
                }
            }
            else {
                if (todo_cells.indexOf(neighbor) <0) {
                    todo_cells.push(neighbor);
                }
            }
        }
    }

}

function get_diff_color(current, adjs, colors) {
    for(var i=1; i<=num_color_space; i++) {
        if (is_color_different(current, i, adjs, colors)) {
            return i;
        }
    }
    return Math.floor(Math.random() * Math.floor(num_color_space)) + 1;
}

function is_color_different(current, new_c, adjs, colors){
    for(var i=0; i< adjs.length; i++) {
        if (adjs[i]  in colors) {
            if ( colors[adjs[i]] == new_c ) return false;
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