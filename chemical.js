var adjacent;
var todo_cells;
var high_priority_todo;
var colormap;
var adjacent_colors;
var colored;

let num_color_space = 4;

function set_leaf_color() {
    todo_cells = [];
    high_priority_todo = [];    
    colormap = {};
    adjacent_colors = {};
    colored =[];

    let leaves = document.querySelectorAll('[data-cluster]');
    console.log('found leaves: ' + leaves.length );
    adjacent = find_adjacents(leaves);

    set_color_to_cell(0, 'leaf', leaves);
    while( (todo_cells.length >0 || high_priority_todo.length >0)) {
        let next = high_priority_todo.length >0 ? high_priority_todo.shift() : todo_cells.shift(); 
        set_color_to_cell(next, 'leaf', leaves)
    }
}

function set_color_to_cell(current, cat, leaves){
    if (colored.indexOf(current)<0) {
        var cluster = leaves[current].getAttribute('data-cluster');
        if (cluster == null) {
            cluster = leaves[current].getAttribute('transform');
        }
        var new_c;
        if (cluster == 'unknown') {
            new_c = 5;
        }
        else {
            new_c = get_diff_color(adjacent_colors[cluster]);
        }
        colored.push(current);
        colormap [current] = new_c;
        let colorclass = cat + 'c1_' + new_c;
        leaves[current].classList.add( colorclass );
        let siblings = get_cells_in_same_cluster(cluster, leaves);
        for(var i=0;i<siblings.length;i++){
            let next = siblings[i];
            if (next != current) {
                colormap[next] = new_c;
                colored.push(next);
                leaves[next].classList.add( colorclass );
            }
        }
        for(var i=0;i<siblings.length;i++){
            process_neighbor_after_coloring(siblings[i], new_c, cluster, leaves);
        }
    }
}

function get_cells_in_same_cluster(cluster, leaves){
    let samel = [];
    if (cluster != null && cluster.length >0) {
        for(var i = 0; i< leaves.length; i++) {
            var nl = leaves[i].getAttribute('data-cluster');
            if (nl==null) {
                nl = leaves[i].getAttribute('transform');
            }
            if (cluster == nl) {
                samel.push(i);
            }
        }
    }
    return samel;
}

function process_neighbor_after_coloring(current, color, cluster, leaves){
    let adjs = adjacent[current];
    for(var i=0;i<adjs.length;i++) {
        let neighbor = adjs[i];
        let elem = leaves[neighbor];
        var sibl2 = elem.getAttribute('data-cluster');
        if (sibl2 == null) {
            sibl2 = elem.getAttribute('transform');
        }
        if (sibl2 != cluster) {
            if (!(sibl2 in adjacent_colors)) {
                adjacent_colors[sibl2] = [];
            }
            if (adjacent_colors[sibl2].indexOf(color) <0) {
                adjacent_colors[sibl2].push(color);
            }
        }
    }

    for(var i=0;i<adjs.length;i++) {
        let neighbor = adjs[i];
        if(colored.indexOf(neighbor) < 0){
            let elem = leaves[neighbor];
            var sibl2 = elem.getAttribute('data-cluster');
            if (sibl2 == null) {
                sibl2 = elem.getAttribute('transform');
            }
            if (adjacent_colors[sibl2].length >= 3) {
                high_priority_todo.unshift(neighbor);
            }
            else if (adjacent_colors[sibl2].length == 2) {
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

